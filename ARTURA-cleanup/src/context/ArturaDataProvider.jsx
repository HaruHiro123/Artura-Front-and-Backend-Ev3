import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchArtworksFromApi,
  createArtworkInApi,
  updateArtworkInApi,
  deleteArtworkInApi,
  fetchStoreDataFromApi,
  syncStoreDataToApi,
  notifyPricingOrCommissionUpdated,
} from '../services/api'
import ArturaDataContext from './ArturaDataContext.js'
import initialArtworks from '../data/artworks.js'
import { STORE_KEY, loadStore, normalizeStore, validPricing } from '../utils/store.js'
import { createOrderData, updateOrderData, soldIds, reservedIds, money, httpsUrl } from '../utils/transactionRules.js'
import { getAvailablePaymentMethods } from '../utils/paymentMethods.js'

const makeId = (prefix) => `${prefix}-${crypto.randomUUID().slice(0, 12).toUpperCase()}`

function normalizeArtworkStatus(item, isSoldInOrder = false) {
  if (!item) return item
  const colType = String(item.collectionType || item.collection_type || 'portfolio').toLowerCase()
  let nextStatus = item.status

  if (isSoldInOrder || nextStatus === 'sold') {
    nextStatus = 'sold'
  } else if (colType === 'shop') {
    if (!nextStatus || nextStatus === 'not-for-sale' || nextStatus === 'portfolio') {
      nextStatus = 'available'
    }
  } else {
    nextStatus = 'not-for-sale'
  }

  return {
    ...item,
    collectionType: colType,
    collection_type: colType,
    status: nextStatus,
    price: colType === 'shop' ? Number(item.price) || 0 : null,
  }
}

// Memastikan setiap objek komisi memiliki finalPrice & estimatedPrice yang sinkron agar tampilan User langsung berubah
function normalizeCommissionEntry(entry) {
  if (!entry || typeof entry !== 'object') return entry
  const resolvedPrice =
    entry.finalPrice !== undefined && Number(entry.finalPrice) > 0
      ? Math.round(Number(entry.finalPrice))
      : Math.round(Number(entry.estimatedPrice || entry.price || 0))

  return {
    ...entry,
    finalPrice: resolvedPrice,
    estimatedPrice: resolvedPrice,
    price: resolvedPrice,
    totalPrice: resolvedPrice,
  }
}

// Membersihkan seluruh nilai di dalam objek pricing agar selalu berupa integer bulat positif
function sanitizePricingObject(rawPricing) {
  if (!rawPricing || typeof rawPricing !== 'object') return rawPricing
  if (Array.isArray(rawPricing)) {
    return rawPricing.map((item) => sanitizePricingObject(item))
  }
  const result = { ...rawPricing }
  Object.keys(result).forEach((key) => {
    const val = result[key]
    if (val !== null && typeof val === 'object') {
      result[key] = sanitizePricingObject(val)
    } else if (typeof val === 'string' && /^[0-9.,\s]+$/.test(val.trim())) {
      const cleaned = Number(val.replace(/[^0-9]/g, ''))
      if (!Number.isNaN(cleaned) && cleaned > 0) {
        result[key] = cleaned
      }
    } else if (typeof val === 'number') {
      result[key] = Math.round(val)
    }
  })
  return result
}

export default function ArturaDataProvider({ children }) {
  const [data, setData] = useState(() => loadStore(initialArtworks))

  const current = useRef(data)
  const [storageError, setStorageError] = useState('')
  const reportStorageError = useCallback(
    (message) =>
      setStorageError(
        message ||
          'Browser storage is full or unavailable. The latest changes were not saved. Remove some old data/images or try a normal browser session, then try again.'
      ),
    []
  )

  useEffect(() => {
    function sync(event) {
      if (event.key !== STORE_KEY || !event.newValue) return
      try {
        const parsed = JSON.parse(event.newValue)
        const next = normalizeStore(parsed, current.current.artworks || initialArtworks)
        if (parsed.pricing) {
          next.pricing = parsed.pricing
        }
        if (Array.isArray(parsed.commissions)) {
          next.commissions = parsed.commissions.map(normalizeCommissionEntry)
        }
        current.current = next
        setData({ ...next })
      } catch {
        /* Ignore malformed changes. */
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function db() {
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        const normalized = normalizeStore(parsed, current.current.artworks || initialArtworks)
        if (parsed.pricing) {
          normalized.pricing = parsed.pricing
        }
        if (Array.isArray(parsed.commissions)) {
          normalized.commissions = parsed.commissions.map(normalizeCommissionEntry)
        }
        current.current = normalized
      }
    } catch {
      /* Use current session state. */
    }
    return current.current
  }

  function commit(next) {
    const normalizedArtworks = Array.isArray(next.artworks)
      ? next.artworks.map((art) =>
          normalizeArtworkStatus(art, soldIds(next.orders || []).has(art.id))
        )
      : next.artworks

    const normalizedCommissions = Array.isArray(next.commissions)
      ? next.commissions.map(normalizeCommissionEntry)
      : next.commissions

    const cleanNext = {
      ...next,
      artworks: normalizedArtworks,
      commissions: normalizedCommissions,
      pricing: next.pricing ? { ...next.pricing } : current.current.pricing,
    }

    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(cleanNext))
    } catch {
      reportStorageError()
      return false
    }
    current.current = cleanNext
    setData({ ...cleanNext })
    setStorageError('')

    syncStoreDataToApi(cleanNext).catch((err) => {
      console.warn('Gagal menyinkronkan data toko ke MySQL:', err.message)
    })

    return true
  }

  // Menarik seluruh data artworks, orders, commissions, reviews, dan pricing dari MySQL
  const syncFromDatabase = useCallback(() => {
    Promise.all([
      fetchArtworksFromApi().catch(() => null),
      fetchStoreDataFromApi().catch(() => null),
    ])
      .then(([apiArtworks, storeData]) => {
        const prev = current.current
        const activeOrders =
          storeData?.orders?.length > 0 ? storeData.orders : prev.orders || []
        const soldSet = soldIds(activeOrders)

        const baseArtworks =
          Array.isArray(apiArtworks) && apiArtworks.length > 0
            ? apiArtworks
            : prev.artworks || initialArtworks

        const syncedArtworks = baseArtworks.map((apiItem) => {
          const normalized = normalizeArtworkStatus(apiItem, soldSet.has(apiItem.id))
          if (normalized.collectionType === 'shop' && apiItem.status !== normalized.status) {
            updateArtworkInApi(apiItem.slug || apiItem.id, normalized, { silent: true }).catch(() => {})
          }
          return normalized
        })

        const rawCommissions =
          storeData?.commissions?.length > 0
            ? storeData.commissions
            : prev.commissions || []

        const syncedCommissions = rawCommissions.map(normalizeCommissionEntry)

        const mergedRaw = {
          ...prev,
          artworks: syncedArtworks,
          orders: activeOrders,
          commissions: syncedCommissions,
          reviews:
            storeData?.reviews?.length > 0 ? storeData.reviews : prev.reviews,
          pricing: storeData?.pricing || prev.pricing,
          artist: storeData?.artist || prev.artist,
          paymentSettings: storeData?.paymentSettings || prev.paymentSettings,
          siteSettings: storeData?.siteSettings || prev.siteSettings,
        }

        const nextSnapshot = normalizeStore(mergedRaw, syncedArtworks)
        if (storeData?.pricing) {
          nextSnapshot.pricing = { ...nextSnapshot.pricing, ...storeData.pricing }
        }
        nextSnapshot.commissions = syncedCommissions

        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(nextSnapshot))
        } catch {
          /* Ignore local storage quota errors during initial sync */
        }
        current.current = nextSnapshot
        setData({ ...nextSnapshot })

        // Jika di MySQL belum ada pricing/commissions tetapi di lokal sudah ada, kirim ke MySQL
        if (
          storeData &&
          !storeData.pricing &&
          prev.pricing
        ) {
          syncStoreDataToApi(nextSnapshot).catch(() => {})
        }
      })
      .catch((err) => {
        console.warn('Server Laravel tidak aktif, menggunakan fallback localStorage:', err.message)
      })
  }, [])

  // Jalankan sinkronisasi saat pertama kali dibuka, saat tombol Undo diklik, dan saat pindah tab (focus)
  useEffect(() => {
    syncFromDatabase()

    const handleRestored = () => {
      syncFromDatabase()
    }

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        syncFromDatabase()
      }
    }

    window.addEventListener('artura:data-restored', handleRestored)
    window.addEventListener('focus', handleVisibilityOrFocus)
    document.addEventListener('visibilitychange', handleVisibilityOrFocus)

    return () => {
      window.removeEventListener('artura:data-restored', handleRestored)
      window.removeEventListener('focus', handleVisibilityOrFocus)
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
    }
  }, [syncFromDatabase])

  function fail(message) {
    reportStorageError(message)
    return false
  }

  function update(field, transform) {
    const source = db()
    return commit({ ...source, [field]: transform(source[field]) })
  }

  function addArtwork(payload) {
    const tempId = makeId('art')
    const normalizedPayload = normalizeArtworkStatus(payload, false)
    const optimisticArtwork = {
      ...normalizedPayload,
      id: tempId,
      createdAt: new Date().toISOString(),
    }

    const ok = update('artworks', (items) => [optimisticArtwork, ...items])
    if (!ok) return null

    createArtworkInApi(normalizedPayload)
      .then((savedArtwork) => {
        const cleanSaved = normalizeArtworkStatus(savedArtwork, false)
        update('artworks', (items) =>
          items.map((item) => (item.id === tempId ? cleanSaved : item))
        )
      })
      .catch((err) => {
        console.error('Gagal menyimpan karya baru ke database Laravel:', err.message)
        update('artworks', (items) => items.filter((item) => item.id !== tempId))
      })

    return optimisticArtwork
  }

  function updateArtwork(id, changes) {
    const source = db()
    const target = source.artworks.find((a) => a.id === id)
    const isSoldOrder = soldIds(source.orders).has(id)

    if ((isSoldOrder || target?.status === 'sold') && changes.status && changes.status !== 'sold') {
      return fail('A sold original artwork cannot be made available again.')
    }

    const merged = target ? { ...target, ...changes } : changes
    const updatedLocal = normalizeArtworkStatus(merged, isSoldOrder)

    const ok = update('artworks', (items) =>
      items.map((item) => (item.id === id ? updatedLocal : item))
    )
    if (!ok) return false

    const identifier = target?.slug || id
    updateArtworkInApi(identifier, updatedLocal, { previousSnapshot: target })
      .then((savedArtwork) => {
        const cleanSaved = normalizeArtworkStatus(savedArtwork, isSoldOrder)
        update('artworks', (items) =>
          items.map((item) => (item.id === id ? cleanSaved : item))
        )
      })
      .catch((err) => {
        console.error('Gagal mengupdate karya di database Laravel:', err.message)
        syncFromDatabase()
      })

    return true
  }

  function deleteArtwork(id) {
    const source = db()
    if (reservedIds(source.orders).has(id)) {
      return fail('An artwork with an active order cannot be deleted.')
    }

    const target = source.artworks.find((a) => a.id === id)
    const ok = update('artworks', (items) => items.filter((item) => item.id !== id))
    if (!ok) return false

    const identifier = target?.slug || id
    deleteArtworkInApi(identifier, { deletedSnapshot: target }).catch((err) => {
      console.error('Gagal menghapus karya di database Laravel:', err.message)
      syncFromDatabase()
    })

    return true
  }

  function createOrder(payload) {
    try {
      const source = db()
      const order = createOrderData(source, payload, makeId('ART'))
      return commit({ ...source, orders: [order, ...source.orders] }) ? order : null
    } catch (error) {
      return fail(error.message)
    }
  }

  function updateOrder(id, changes) {
    try {
      const nextState = updateOrderData(db(), id, changes)
      const ok = commit(nextState)
      if (ok && changes.paymentStatus === 'paid') {
        const paidOrder = nextState.orders.find((o) => o.id === id)
        paidOrder?.items?.forEach((orderItem) => {
          const artId = orderItem.artworkId || orderItem.id
          const currentArt = nextState.artworks.find((a) => a.id === artId)
          if (artId && currentArt) {
            updateArtworkInApi(
              currentArt.slug || artId,
              { ...currentArt, status: 'sold' },
              { silent: true }
            ).catch(() => {})
          }
        })
      }
      return ok
    } catch (error) {
      return fail(error.message)
    }
  }

  function createCommission(payload) {
    if (!db().artist.commissionOpen) return fail('Commission is currently closed.')
    const initialPrice = Math.round(Number(payload.estimatedPrice || payload.finalPrice || payload.price || 0))
    const request = normalizeCommissionEntry({
      ...payload,
      id: makeId('COM'),
      createdAt: new Date().toISOString(),
      status: 'new',
      paymentStatus: 'waiting-approval',
      paymentMethod: '',
      paymentProof: null,
      estimatedPrice: initialPrice,
      finalPrice: initialPrice,
      price: initialPrice,
    })
    if (!money(request.finalPrice) || request.finalPrice <= 0) {
      return fail('Price must be a positive whole rupiah amount.')
    }
    return update('commissions', (items) => [request, ...items]) ? request : null
  }

  function updateCommission(id, changes) {
    const source = db()
    const item = source.commissions.find((entry) => entry.id === id)
    if (!item) return false

    const previousSnapshot = { ...item, delivery: { ...item.delivery } }

    if (['rejected', 'cancelled', 'completed'].includes(item.status)) {
      return fail('This request has already been closed.')
    }

    // Tangkap perubahan harga dari field finalPrice, estimatedPrice, atau price
    const rawNewPrice =
      changes.finalPrice !== undefined
        ? changes.finalPrice
        : changes.estimatedPrice !== undefined
          ? changes.estimatedPrice
          : changes.price

    const parsedNewPrice =
      rawNewPrice !== undefined
        ? Number(String(rawNewPrice).replace(/[^0-9.-]+/g, ''))
        : undefined

    if (parsedNewPrice !== undefined && (!money(parsedNewPrice) || parsedNewPrice <= 0)) {
      return fail('Price must be a positive whole rupiah amount.')
    }

    if (
      changes.paymentStatus === 'waiting-verification' &&
      (!['waiting-payment', 'rejected'].includes(item.paymentStatus) ||
        !changes.paymentProof?.preview ||
        !getAvailablePaymentMethods(source.paymentSettings).some(
          (method) => method.value === changes.paymentMethod
        ))
    ) {
      return fail('Choose an active payment method and a valid proof.')
    }
    if (
      changes.paymentStatus === 'paid' &&
      (item.paymentStatus !== 'waiting-verification' || !item.paymentProof?.preview)
    ) {
      return fail('Only a submitted payment proof can be verified.')
    }
    if (
      item.paymentStatus === 'paid' &&
      ((changes.paymentStatus && changes.paymentStatus !== 'paid') ||
        (parsedNewPrice !== undefined && parsedNewPrice !== item.finalPrice))
    ) {
      return fail(
        'A paid order cannot be cancelled from this flow. Complete the process or handle the refund manually.'
      )
    }

    const syncedPrice = parsedNewPrice !== undefined ? parsedNewPrice : item.finalPrice

    const next = normalizeCommissionEntry({
      ...item,
      ...changes,
      finalPrice: syncedPrice,
      estimatedPrice: syncedPrice,
      price: syncedPrice,
      totalPrice: syncedPrice,
      updatedAt: new Date().toISOString(),
      delivery: { ...item.delivery, ...changes.delivery },
    })

    if (next.delivery.deliveryUrl && !httpsUrl(next.delivery.deliveryUrl)) {
      return fail('The final file link must use HTTPS.')
    }
    if (
      ['in-progress', 'ready-to-deliver', 'ready-to-ship', 'shipped', 'delivered', 'completed'].includes(
        next.status
      ) &&
      next.paymentStatus !== 'paid'
    ) {
      return fail('Payment must be verified before fulfillment.')
    }
    if (
      item.mediaType === 'traditional' &&
      ['shipped', 'delivered', 'completed'].includes(next.status) &&
      !next.delivery.trackingNumber?.trim()
    ) {
      return fail('Enter a tracking number before marking the commission as Shipped.')
    }
    if (
      item.mediaType === 'digital' &&
      ['ready-to-deliver', 'completed'].includes(next.status) &&
      !httpsUrl(next.delivery.deliveryUrl)
    ) {
      return fail('The final file link must use HTTPS.')
    }

    const ok = commit({
      ...source,
      commissions: source.commissions.map((entry) => (entry.id === id ? next : entry)),
    })

    if (ok) {
      notifyPricingOrCommissionUpdated({
        type: 'commission',
        label: item.title || item.clientName || item.id,
        onUndo: async () => {
          const latestSource = db()
          commit({
            ...latestSource,
            commissions: latestSource.commissions.map((entry) =>
              entry.id === id ? normalizeCommissionEntry(previousSnapshot) : entry
            ),
          })
        },
      })
    }

    return ok
  }

  // Fungsi Update Daftar Harga Dasar Komisi (AdminPricing)
  function handleUpdatePricing(nextRaw) {
    const source = db()
    const previousPricing = source.pricing ? JSON.parse(JSON.stringify(source.pricing)) : null
    const sanitized = sanitizePricingObject(nextRaw)
    const mergedPricing = { ...(source.pricing || {}), ...sanitized }

    const candidatePricing = validPricing(mergedPricing)
      ? mergedPricing
      : validPricing(sanitized)
        ? sanitized
        : null

    if (!candidatePricing) {
      return fail('Price must be a positive whole rupiah amount.')
    }

    const ok = commit({
      ...source,
      pricing: { ...candidatePricing },
    })

    if (ok) {
      notifyPricingOrCommissionUpdated({
        type: 'pricing',
        onUndo: previousPricing
          ? async () => {
              const latestSource = db()
              commit({
                ...latestSource,
                pricing: previousPricing,
              })
            }
          : null,
      })
    }

    return ok
  }

  function addReview(payload) {
    const commentText =
      payload?.comment ||
      payload?.review ||
      payload?.text ||
      payload?.message ||
      ''

    const review = {
      ...payload,
      id: makeId('review'),
      comment: commentText,
      review: commentText,
      createdAt: new Date().toISOString(),
    }
    return update('reviews', (items) => [review, ...items]) ? review : null
  }

  function resetArturaData() {
    if (!commit({ ...normalizeStore({}, current.current.artworks || initialArtworks), resetVersion: Date.now() })) {
      return false
    }
    try {
      localStorage.removeItem('artura.cart.v1')
    } catch {
      /* Cart state also resets through resetVersion. */
    }
    syncFromDatabase()
    return true
  }

  const value = {
    ...data,
    storageError,
    reportStorageError,
    clearStorageError: () => setStorageError(''),
    syncFromDatabase,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    createOrder,
    updateOrder,
    createCommission,
    updateCommission,
    addReview,
    deleteReview: (id) => update('reviews', (items) => items.filter((item) => item.id !== id)),
    updatePricing: handleUpdatePricing,
    updateArtist: (next) => update('artist', () => next),
    updatePaymentSettings: (next) => update('paymentSettings', () => next),
    updateSiteSettings: (next) => update('siteSettings', () => next),
    resetArturaData,
    saveSettings: (changes) => commit({ ...db(), ...changes }),
  }

  return <ArturaDataContext.Provider value={value}>{children}</ArturaDataContext.Provider>
}
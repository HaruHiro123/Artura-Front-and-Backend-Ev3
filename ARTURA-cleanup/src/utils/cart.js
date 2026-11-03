export function isBuyable(artwork) {
  if (!artwork) return false

  // Menangkap format jenis koleksi baik dari frontend (collectionType) maupun database MySQL (collection_type)
  const collectionType = artwork.collectionType || artwork.collection_type

  // Menangkap status ketersediaan (default 'available' jika kosong)
  const status = artwork.status || 'available'

  // Membersihkan format harga (mengatasi string rupiah atau desimal jika ada)
  const rawPrice = artwork.price !== null && artwork.price !== undefined ? Number(String(artwork.price).replace(/[^0-9.-]+/g, "")) : NaN

  return Boolean(
    collectionType === 'shop' &&
    status === 'available' &&
    Number.isSafeInteger(rawPrice) &&
    rawPrice > 0
  )
}

export function sanitizeCartIds(value, catalog) {
  if (!Array.isArray(value) || !Array.isArray(catalog)) return []
  const allowed = new Set(catalog.filter(isBuyable).map((artwork) => artwork.id))
  return [...new Set(value)].filter((id) => allowed.has(id))
}

export function cartReducer(ids, action) {
  switch (action.type) {
    case 'replace': return Array.isArray(action.ids) ? action.ids : []
    case 'add': return ids.includes(action.id) ? ids : [...ids, action.id]
    case 'remove': return ids.filter((id) => id !== action.id)
    case 'clear': return []
    default: return ids
  }
}
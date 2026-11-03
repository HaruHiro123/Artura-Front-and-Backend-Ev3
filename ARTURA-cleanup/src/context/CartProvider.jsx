import { useEffect, useReducer, useRef } from 'react'
import CartContext from './CartContext.js'
import useArturaData from '../hooks/useArturaData.js'
import { cartReducer, isBuyable, sanitizeCartIds } from '../utils/cart.js'
import { loadCart, saveCart } from '../utils/cartStorage.js'
import { fetchCartFromApi, syncCartToApi } from '../services/api.js'

export default function CartProvider({ children }) {
  const { artworks, reportStorageError, resetVersion } = useArturaData()
  const lastReset = useRef(resetVersion)
  const isHydratedFromApi = useRef(false)
  const artworksRef = useRef(artworks)
  const [cartIds, dispatch] = useReducer(cartReducer, [], () => loadCart(artworks))

  useEffect(() => {
    artworksRef.current = artworks
  }, [artworks])

  // 1. Tarik isi keranjang dari tabel carts di MySQL saat aplikasi dimuat
  useEffect(() => {
    let isMounted = true

    fetchCartFromApi()
      .then((remoteIds) => {
        if (!isMounted) return
        if (Array.isArray(remoteIds) && remoteIds.length > 0) {
          const validIds = sanitizeCartIds(remoteIds, artworksRef.current)
          dispatch({ type: 'replace', ids: validIds })
        } else {
          const currentLocal = loadCart(artworksRef.current)
          if (currentLocal.length > 0) {
            syncCartToApi(currentLocal).catch(() => {})
          }
        }
      })
      .catch((err) => {
        console.warn('Menggunakan keranjang lokal (server belum aktif):', err.message)
      })
      .finally(() => {
        if (isMounted) {
          isHydratedFromApi.current = true
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  // 2. Bersihkan keranjang di UI dan di MySQL saat data di-reset
  useEffect(() => {
    if (lastReset.current !== resetVersion) {
      dispatch({ type: 'clear' })
      syncCartToApi([]).catch(() => {})
      lastReset.current = resetVersion
    }
  }, [resetVersion])

  // 3. Pastikan hanya karya yang masih tersedia (buyable) yang ada di keranjang
  useEffect(() => {
    const cleanIds = sanitizeCartIds(cartIds, artworks)
    if (cleanIds.length !== cartIds.length) {
      dispatch({ type: 'replace', ids: cleanIds })
    }
  }, [artworks, cartIds])

  // 4. Simpan setiap perubahan keranjang ke localStorage dan tabel carts di MySQL
  useEffect(() => {
    if (!saveCart(cartIds)) {
      reportStorageError(
        'The cart is still available for this session, but the browser could not save it. If the page is refreshed, the cart may be lost.'
      )
    }

    if (isHydratedFromApi.current) {
      syncCartToApi(cartIds).catch((err) => {
        console.warn('Gagal menyinkronkan keranjang ke MySQL:', err.message)
      })
    }
  }, [cartIds, reportStorageError])

  const cartItems = cartIds
    .map((id) => artworks.find((artwork) => artwork.id === id))
    .filter(isBuyable)
  const totalQty = cartItems.length
  const totalPrice = cartItems.reduce((total, artwork) => total + Number(artwork.price), 0)

  function addToCart(id) {
    const artwork = artworks.find((item) => item.id === id)
    if (!isBuyable(artwork)) return
    dispatch({ type: 'add', id })
  }

  function removeFromCart(id) {
    dispatch({ type: 'remove', id })
  }

  function clearCart() {
    dispatch({ type: 'clear' })
  }

  function isInCart(id) {
    return cartItems.some((artwork) => artwork.id === id)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQty,
        totalPrice,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
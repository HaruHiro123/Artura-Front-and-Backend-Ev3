import { sanitizeCartIds } from './cart.js'

export const CART_STORAGE_KEY = 'artura.cart.v1'

export function loadCart(catalog) {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (data?.version !== 1) return []
    return sanitizeCartIds(data.ids, catalog)
  } catch {
    return []
  }
}

export function saveCart(ids) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, ids }))
    return true
  } catch {
    console.warn('The cart can still be used, but the browser does not allow localStorage persistence.')
    return false
  }
}

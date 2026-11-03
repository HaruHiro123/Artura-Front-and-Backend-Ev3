import { isBuyable } from './cart.js'
import { getAvailablePaymentMethods } from './paymentMethods.js'
export const money = (value) => Number.isSafeInteger(value) && value >= 0
export const httpsUrl = (value) => { try { return new URL(value).protocol === 'https:' } catch { return false } }
export function soldIds(orders) { return new Set(orders.filter((order) => order.paymentStatus === 'paid').flatMap((order) => order.items.map((item) => item.id))) }
export function reconcileSold(artworks, orders) { const sold = soldIds(orders); return artworks.map((artwork) => sold.has(artwork.id) ? { ...artwork, status: 'sold' } : artwork) }
export function reservedIds(orders) { return new Set(orders.filter((order) => order.orderStatus !== 'cancelled').flatMap((order) => order.items.map((item) => item.id))) }
export function createOrderData(db, payload, id) {
  const ids = [...new Set(payload.items.map((item) => item.id))]
  const items = ids.map((artworkId) => db.artworks.find((artwork) => artwork.id === artworkId))
  if (!items.length || items.some((item) => !isBuyable(item))) throw new Error('This artwork is no longer available.')
  const reserved = reservedIds(db.orders)
  if (ids.some((artworkId) => reserved.has(artworkId))) throw new Error('This artwork already has an active order. Complete or cancel that order first.')
  const subtotal = items.reduce((sum, item) => sum + Number(item.price), 0)
  if (!money(subtotal) || subtotal <= 0) throw new Error('Price must be a positive whole rupiah amount.')
  return { ...payload, id, createdAt: new Date().toISOString(), items: items.map((item) => ({ id:item.id, slug:item.slug, title:item.title, image:item.image, price:Number(item.price) })), subtotal, total:subtotal, paymentMethod:'', paymentProof:null, paymentStatus:'waiting-payment', orderStatus:'waiting-payment' }
}
export function updateOrderData(db, id, changes) {
  const order = db.orders.find((item) => item.id === id)
  if (!order) throw new Error('Order not found')
  if (order.orderStatus === 'cancelled') throw new Error('The order has already been cancelled.')
  if (order.paymentStatus === 'paid' && (changes.orderStatus === 'cancelled' || (changes.paymentStatus && changes.paymentStatus !== 'paid'))) throw new Error('A paid order cannot be cancelled from this flow. Complete the process or handle the refund manually.')
  if (changes.paymentStatus === 'waiting-verification') {
    if (!['waiting-payment','rejected'].includes(order.paymentStatus) || !changes.paymentProof?.preview || !getAvailablePaymentMethods(db.paymentSettings).some((item) => item.value === changes.paymentMethod)) throw new Error('Choose an active payment method and a valid proof.')
  }
  if (changes.paymentStatus === 'paid') {
    if (order.paymentStatus !== 'waiting-verification' || !order.paymentProof?.preview) throw new Error('Only a submitted payment proof can be verified.')
    const otherPaid = soldIds(db.orders.filter((item) => item.id !== id))
    if (order.items.some((item) => otherPaid.has(item.id))) throw new Error('This artwork is no longer available.')
  }
  if (changes.paymentStatus === 'rejected' && order.paymentStatus !== 'waiting-verification') throw new Error('Only a submitted payment proof can be verified.')
  const next = { ...order, ...changes, shipping:{ ...order.shipping, ...changes.shipping } }
  if (['processing','ready-to-ship','shipped','delivered','completed'].includes(next.orderStatus) && next.paymentStatus !== 'paid') throw new Error('Payment must be verified before fulfillment.')
  if (['shipped','delivered','completed'].includes(next.orderStatus) && !next.shipping.trackingNumber?.trim()) throw new Error('Enter a tracking number before marking the order as Shipped.')
  const orders = db.orders.map((item) => item.id === id ? next : item)
  return { ...db, orders, artworks:reconcileSold(db.artworks, orders) }
}

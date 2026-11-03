import products from './products.js'

export const cartItems = [
  {
    product: products.find((product) => product.id === 1),
    quantity: 2,
  },
  {
    product: products.find((product) => product.id === 2),
    quantity: 1,
  },
]

export const cartTotal = cartItems.reduce(
  (total, item) => total + item.product.price * item.quantity,
  0
)

export function formatRupiah(value) {
  return value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
}
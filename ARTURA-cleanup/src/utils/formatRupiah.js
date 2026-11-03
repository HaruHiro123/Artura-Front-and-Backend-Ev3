export default function formatRupiah(value) {
  if (!Number.isFinite(value)) return 'Price not set'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(value)
}

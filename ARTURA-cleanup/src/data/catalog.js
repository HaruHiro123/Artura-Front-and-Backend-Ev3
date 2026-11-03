import artworks from './artworks.js'

// Contoh untuk praktikum. Bukan harga jual atau status transaksi sungguhan.
// Ubah menjadi false untuk mengembalikan seluruh artworks ke data asli.
export const DEMO_SALES_ENABLED = true

const demoListings = {
  waguri: { status: 'available', price: 150000 },
  jasper: { status: 'available', price: 130000 },
  'abstrak-gunung': { status: 'sold', price: null },
}

const catalog = artworks.map((artwork) => {
  const demo = DEMO_SALES_ENABLED ? demoListings[artwork.slug] : null
  return demo ? { ...artwork, ...demo, isDemoListing: true } : artwork
})

export default catalog

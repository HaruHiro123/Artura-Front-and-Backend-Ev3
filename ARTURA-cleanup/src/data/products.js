import sketchbookImage from '../assets/products/sketchbook.jpg'
import pensilGrafitImage from '../assets/products/pensil-grafit.jpg'
import pensilWarnaImage from '../assets/products/pensil-warna.jpg'
import kuasLukisImage from '../assets/products/kuas-lukis.jpg'
import paletCatImage from '../assets/products/palet-cat.jpg'
import tasSeniImage from '../assets/products/tas-seni.jpg'

const products = [
  {
    id: 1,
    name: 'Sketchbook A5',
    category: 'Buku Sketsa',
    price: 45000,
    image: sketchbookImage,
    description:
      'An A5 sketchbook for daily drawing practice and ideas.',
  },
  {
    id: 2,
    name: 'Set Pensil Grafit',
    category: 'Alat Gambar',
    price: 38000,
    image: pensilGrafitImage,
    description:
      'A graphite pencil set for line practice, shading, and form studies.',
  },
  {
    id: 3,
    name: 'Pensil Warna 24 Warna',
    category: 'Coloring',
    price: 72000,
    image: pensilWarnaImage,
    description:
      'A 24-color pencil set for experimenting with color combinations in drawings.',
  },
  {
    id: 4,
    name: 'Set Kuas Lukis',
    category: 'Alat Lukis',
    price: 32000,
    image: kuasLukisImage,
    description:
      'A selection of brushes in several sizes for practicing strokes and painting details.',
  },
  {
    id: 5,
    name: 'Palet Cat',
    category: 'Perlengkapan',
    price: 18000,
    image: paletCatImage,
    description:
      'A simple palette for holding and mixing paint colors.',
  },
  {
    id: 6,
    name: 'Tas Peralatan Seni',
    category: 'Penyimpanan',
    price: 55000,
    image: tasSeniImage,
    description:
      'A pouch for organizing pencils, erasers, and small drawing tools.',
  },
]

export default products
export const mediaOptions = [
  { value: 'digital', label: 'Digital Art' },
  { value: 'traditional', label: 'Traditional Art' },
]
export const styleOptions = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'semi-realistic', label: 'Semi Realistic' },
  { value: 'anime', label: 'Anime' },
]
export const bodyOptions = [
  { value: 'headshot', label: 'Headshot', cost: 0 },
  { value: 'bust', label: 'Bust Up', cost: 20000 },
  { value: 'half', label: 'Half Body', cost: 40000 },
  { value: 'full', label: 'Full Body', cost: 70000 },
]
export const digitalFinishOptions = [
  { value: 'grayscale', label: 'Digital Grayscale', cost: 0 },
  { value: 'color', label: 'Full Color', cost: 40000 },
]
export const traditionalFinishOptions = [
  { value: 'pencil', label: 'Pencil Shading', cost: 0 },
  { value: 'color', label: 'Full Color', cost: 40000 },
]
export const personOptions = [
  { value: 1, label: '1 orang', cost: 0 },
  { value: 2, label: '2 orang', cost: 70000 },
  { value: 3, label: '3 orang', cost: 140000 },
]
export const poseOptions = [
  { value: 'artist', label: 'Artist Choice', cost: 0 },
  { value: 'reference', label: 'Reference Pose', cost: 0 },
  { value: 'custom', label: 'Custom Pose', cost: 20000 },
]
export const backgroundOptions = [
  { value: 'none', label: 'No Background', cost: 0 },
  { value: 'simple', label: 'Simple Background', cost: 25000 },
  { value: 'detailed', label: 'Detailed Background', cost: 55000 },
]
export const ratioOptions = [
  { value: '1:1', label: '1:1 — Square' },
  { value: '4:5', label: '4:5 — Portrait' },
  { value: '3:4', label: '3:4 — Classic Portrait' },
  { value: '2:3', label: '2:3 — Print Portrait' },
  { value: '9:16', label: '9:16 — Phone / Story' },
  { value: '16:9', label: '16:9 — Landscape' },
  { value: 'custom', label: 'Custom Ratio' },
]
export const paperOptions = [
  { value: 'A5', label: 'A5', cost: 0 },
  { value: 'A4', label: 'A4', cost: 30000 },
  { value: 'A3', label: 'A3', cost: 70000 },
]
export const orientationOptions = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
]
export const basePrices = {
  digital: { realistic: 120000, 'semi-realistic': 105000, anime: 90000 },
  traditional: { realistic: 130000, 'semi-realistic': 110000, anime: 95000 },
}

export function getRatioError({ mediaType, ratio, customWidth, customHeight }) {
  if (mediaType !== 'digital' || ratio !== 'custom') return ''
  const width = Number(customWidth)
  const height = Number(customHeight)
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return 'Width and Height must be numbers greater than 0.'
  }
  return ''
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('The image could not be read.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The image could not be processed.'))
    image.src = src
  })
}

async function compressImage(dataUrl, type) {
  const image = await loadImage(dataUrl)
  const maxDimension = 1400
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return dataUrl

  if (type !== 'image/png') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }
  context.drawImage(image, 0, 0, width, height)

  const outputType = type === 'image/png' ? 'image/png' : 'image/jpeg'
  const quality = outputType === 'image/jpeg' ? 0.82 : undefined
  return canvas.toDataURL(outputType, quality)
}

export async function readImageFile(file, maxMb = 5) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('The file must be an image.')
  }
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`Maximum image size is ${maxMb} MB.`)
  }

  const original = await fileToDataUrl(file)
  await loadImage(original)
  const preview = file.size > 350 * 1024 ? await compressImage(original, file.type) : original
  return { name: file.name, preview, type: file.type, size: file.size }
}

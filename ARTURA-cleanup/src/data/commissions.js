const commissions = [
  {
    id: 'realistic-portrait', title: 'Realistic Portrait', startingPrice: 120000,
    description: 'A personal portrait based on your idea and visual references.',
    note: 'Digital · Realistic · Headshot · Grayscale · 1 orang.',
    preset: { mediaType: 'digital', artStyle: 'realistic', bodyCoverage: 'headshot', renderType: 'grayscale', personCount: 1, poseType: 'artist', backgroundType: 'none' },
  },
  {
    id: 'anime-request', title: 'Anime Request', startingPrice: 90000,
    description: 'Anime characters with your chosen expression, outfit, and story.',
    note: 'Digital · Anime · Headshot · Grayscale · 1 orang.',
    preset: { mediaType: 'digital', artStyle: 'anime', bodyCoverage: 'headshot', renderType: 'grayscale', personCount: 1, poseType: 'artist', backgroundType: 'none' },
  },
  {
    id: 'custom-pose', title: 'Custom Pose', startingPrice: 110000,
    description: 'A custom pose exploration designed to give the illustration more character.',
    note: 'Digital · Anime · Headshot · Custom Pose.',
    preset: { mediaType: 'digital', artStyle: 'anime', bodyCoverage: 'headshot', renderType: 'grayscale', personCount: 1, poseType: 'custom', backgroundType: 'none' },
  },
  {
    id: 'couple-portrait', title: 'Couple Portrait', startingPrice: 180000,
    description: 'A two-person illustration to preserve a shared moment and story.',
    note: 'Traditional · Semi Realistic · 2 Persons · Headshot · Pencil Shading · A5.',
    preset: { mediaType: 'traditional', artStyle: 'semi-realistic', bodyCoverage: 'headshot', renderType: 'pencil', personCount: 2, poseType: 'artist', backgroundType: 'none' },
  },
]

export default commissions

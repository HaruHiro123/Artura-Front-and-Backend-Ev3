export const defaultPricing = {
  basePrices: {
    digital: { realistic: 120000, 'semi-realistic': 105000, anime: 90000 },
    traditional: { realistic: 130000, 'semi-realistic': 110000, anime: 95000 },
  },
  modifiers: {
    body: { headshot: 0, bust: 20000, half: 40000, full: 70000 },
    finish: { grayscale: 0, pencil: 0, color: 40000 },
    persons: { 1: 0, 2: 70000, 3: 140000 },
    pose: { artist: 0, reference: 0, custom: 20000 },
    background: { none: 0, simple: 25000, detailed: 55000 },
    paper: { A5: 0, A4: 30000, A3: 70000 },
  },
}

export const defaultArtist = {
  name: 'ARTURA Artist',
  bio: 'Exploring characters, expressions, and stories through digital artwork and traditional drawing.',
  instagram: '@artuhiro.__',
  email: '',
  profilePhoto: '',
  commissionOpen: true,
}

export const defaultPaymentSettings = {
  bank: {
    active: true,
    name: 'Bank Transfer',
    bankName: 'ARTURA Bank',
    accountNumber: '0000000000',
    accountHolder: 'ARTURA',
  },
  ewallet: {
    active: true,
    name: 'E-Wallet',
    provider: 'ARTURA Wallet',
    number: '080000000000',
    accountHolder: 'ARTURA',
  },
  qris: {
    active: false,
    name: 'QRIS',
    image: '',
  },
}

export const defaultSiteSettings = {
  siteName: 'ARTURA',
  heroTagline: 'Art with character. A story in every stroke.',
}

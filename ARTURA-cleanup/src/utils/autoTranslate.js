const CACHE_KEY = 'artura.dynamic.translations.v1'

let memoryCache = {}
const pendingRequests = new Set()
const listeners = new Set()

// 1. Muat riwayat terjemahan dari localStorage saat aplikasi pertama kali dibuka
try {
  const saved = localStorage.getItem(CACHE_KEY)
  if (saved) {
    memoryCache = JSON.parse(saved) || {}
  }
} catch {
  memoryCache = {}
}

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache))
  } catch {
    /* Abaikan jika kuota localStorage penuh */
  }
}

function notifyListeners() {
  listeners.forEach((callback) => {
    try {
      callback()
    } catch {
      /* Ignore listener errors */
    }
  })
}

// 2. Listener agar komponen React otomatis me-refresh teks begitu terjemahan selesai diambil
export function subscribeAutoTranslate(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

// 3. Fungsi utama penerjemah otomatis dua arah (Indonesia <-> Inggris)
export function autoTranslateText(text, targetLang = 'en') {
  if (!text || typeof text !== 'string') return text

  const trimmed = text.trim()

  // Jangan terjemahkan teks yang terlalu pendek, URL, kode ID, atau nominal angka/Rupiah
  if (
    trimmed.length < 2 ||
    /^https?:\/\//i.test(trimmed) ||
    /^[0-9.,Rp\s-]+$/i.test(trimmed) ||
    /^(ART|COM|REV|art|review)-[A-Z0-9-]+$/i.test(trimmed)
  ) {
    return text
  }

  const langCode = String(targetLang).toLowerCase().startsWith('id') ? 'id' : 'en'
  const cacheKey = `${langCode}:::${trimmed}`

  // Jika kalimat ini sudah pernah diterjemahkan di localStorage, langsung tampilkan secara instan!
  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey]
  }

  // Jika belum ada di localStorage, terjemahkan otomatis di background (sl=auto mendukung ID->EN dan EN->ID)
  if (!pendingRequests.has(cacheKey)) {
    pendingRequests.add(cacheKey)

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(
      trimmed
    )}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.[0])) {
          const translated = data[0]
            .map((segment) => segment?.[0] || '')
            .join('')
            .trim()

          if (translated) {
            memoryCache[cacheKey] = translated
            saveCache()
            notifyListeners()
          }
        }
      })
      .catch(() => {
        /* Jika sedang offline, biarkan tampil teks aslinya dengan aman */
      })
      .finally(() => {
        pendingRequests.delete(cacheKey)
      })
  }

  // Sementara menunggu sepersekian detik saat pertama kali diterjemahkan, tampilkan teks asli
  return text
}
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './LanguageContext.js'
import { translate } from './translate.js'
import { autoTranslateText, subscribeAutoTranslate } from '../utils/autoTranslate.js'

const STORAGE_KEY = 'artura.language.v1'

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'id' ? 'id' : 'en'
    } catch {
      return 'en'
    }
  })

  // State pemicu re-render otomatis saat terjemahan baru selesai disimpan ke localStorage
  const [translationTick, setTranslationTick] = useState(0)

  const setLanguage = useCallback((next) => {
    const value = next === 'id' ? 'id' : 'en'
    setLanguageState(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* Keep language usable for this session. */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.title =
      language === 'id'
        ? 'ARTURA — Galeri Seni & Komisi Kustom'
        : 'ARTURA — Art Gallery & Custom Commission'
  }, [language])

  useEffect(() => {
    const sync = (event) => {
      if (event.key === STORAGE_KEY) {
        setLanguageState(event.newValue === 'id' ? 'id' : 'en')
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  // Dengarkan event ketika autoTranslate selesai menerjemahkan kalimat baru
  useEffect(() => {
    return subscribeAutoTranslate(() => {
      setTranslationTick((tick) => tick + 1)
    })
  }, [])

  const t = useCallback(
    (value) => {
      if (value === null || value === undefined || typeof value !== 'string') {
        return value
      }

      // 1. Cek terlebih dahulu di kamus bawaan (translate.js)
      const staticResult = translate(value, language)

      // Jika kamus bawaan sudah punya terjemahannya (hasilnya berubah), langsung gunakan kamus bawaan
      if (staticResult !== value) {
        return staticResult
      }

      // 2. Jika belum ada di kamus bawaan (misal deskripsi/input baru dari Admin),
      // terjemahkan otomatis dua arah (ID <-> EN) dan simpan di localStorage
      return autoTranslateText(value, language)
    },
    [language, translationTick]
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      locale: language === 'id' ? 'id-ID' : 'en-GB',
    }),
    [language, setLanguage, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
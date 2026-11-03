import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import useArturaData from '../../hooks/useArturaData.js'
import formatRupiah from '../../utils/formatRupiah.js'

const labels = {
  realistic: 'Realistic',
  'semi-realistic': 'Semi Realistic',
  anime: 'Anime',
  headshot: 'Headshot',
  bust: 'Bust Up',
  half: 'Half Body',
  full: 'Full Body',
  grayscale: 'Digital Grayscale',
  pencil: 'Pencil Shading',
  color: 'Full Color',
  artist: 'Artist Choice',
  reference: 'Reference Pose',
  custom: 'Custom Pose',
  none: 'No Background',
  simple: 'Simple Background',
  detailed: 'Detailed Background',
  A5: 'A5',
  A4: 'A4',
  A3: 'A3',
  1: '1 Person',
  2: '2 Persons',
  3: '3 Persons',
}

function isPricingValid(pricing) {
  const values = [
    ...Object.values(pricing.basePrices).flatMap((group) => Object.values(group)),
    ...Object.values(pricing.modifiers).flatMap((group) => Object.values(group)),
  ]
  return values.every((value) => Number.isSafeInteger(Number(value)) && Number(value) >= 0)
}

export default function AdminPricing() {
  const { t } = useLanguage()

  const { pricing, updatePricing } = useArturaData()
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(pricing)))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function safeNumber(value) {
    if (value === '') return 0
    const number = Number(value)
    return Number.isFinite(number) ? number : 0
  }

  function setBase(medium, key, value) {
    setDraft((current) => ({
      ...current,
      basePrices: {
        ...current.basePrices,
        [medium]: {
          ...current.basePrices[medium],
          [key]: safeNumber(value),
        },
      },
    }))
    setError('')
  }

  function setModifier(group, key, value) {
    setDraft((current) => ({
      ...current,
      modifiers: {
        ...current.modifiers,
        [group]: {
          ...current.modifiers[group],
          [key]: safeNumber(value),
        },
      },
    }))
    setError('')
  }

  function save() {
    if (!isPricingValid(draft)) {
      setError('Prices and modifiers must be valid and cannot be negative.')
      return
    }

    const ok = updatePricing(draft)
    if (!ok) {
      setError('Pricing was not saved. Check the browser storage notification at the top of the page.')
      return
    }

    setMessage('Pricing saved and immediately applied to the Commission Calculator.')
    setError('')
    window.setTimeout(() => setMessage(''), 2200)
  }

  const input = 'w-36 rounded-xl border border-stone-300 px-3 py-2 text-right focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100'

  return (
    <div className="max-w-5xl">
      <p className="text-xs uppercase tracking-widest text-emerald-700">{t("Integrated with Public Calculator")}</p>
      <h1 className="mt-2 font-serif text-4xl">{t("Commission Pricing")}</h1>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        {['digital', 'traditional'].map((medium) => (
          <section key={medium} className="rounded-3xl border bg-white p-6">
            <h2 className="font-serif text-2xl capitalize">{t("Base Price")} · {t(medium)}</h2>
            <div className="mt-5 space-y-3">
              {Object.entries(draft.basePrices[medium]).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{t(labels[key])}</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={value}
                    onChange={(e) => setBase(medium, key, e.target.value)}
                    className={input}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}

        {Object.entries(draft.modifiers).map(([group, values]) => (
          <section key={group} className="rounded-3xl border bg-white p-6">
            <h2 className="font-serif text-2xl capitalize">{t("Modifier")} · {t(group)}</h2>
            <div className="mt-5 space-y-3">
              {Object.entries(values).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{t(labels[key] || key)}</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={value}
                    onChange={(e) => setModifier(group, key, e.target.value)}
                    className={input}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-800">{t(error)}</p>}
      {message && <p className="mt-6 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">{t(message)}</p>}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button type="button" onClick={save} className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">{t("Save Pricing")}</button>
      </div>
      <p className="mt-4 text-sm text-stone-500">{t("Current Realistic Digital example: ")}{t(formatRupiah(draft.basePrices.digital.realistic))}.</p>
    </div>
  )
}

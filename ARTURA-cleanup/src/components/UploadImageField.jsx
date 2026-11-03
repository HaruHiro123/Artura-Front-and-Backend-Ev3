import { useState } from 'react'
import { useLanguage } from '../i18n/useLanguage.js'
export default function UploadImageField({
  id,
  label,
  optional = false,
  image,
  onChoose,
  onRemove,
  onBusyChange,
  helper = 'JPG, PNG, or WEBP. Maximum 5 MB.',
}) {
  const { t } = useLanguage()

  const [busy, setBusy] = useState(false)
  async function handleChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || busy) return
    setBusy(true); onBusyChange?.(true)
    try { await onChoose(file) } finally { setBusy(false); onBusyChange?.(false) }
  }

  return (
    <div className="rounded-[1.5rem] border border-stone-200/80 bg-white/70 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">
            {t(label)}
            {optional && <span className="ml-1 font-normal text-stone-500">{t("(optional)")}</span>}
          </p>
          <p className="mt-1 text-xs leading-5 text-stone-500">{t(helper)}</p>
        </div>
      </div>

      {busy && <p role="status" className="mt-3 text-xs text-emerald-800">{t("Please wait for the image to finish uploading.")}</p>}
      <input id={id} type="file" disabled={busy} accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleChange} />

      {image ? (
        <div className="mt-4 grid gap-4 rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-3 sm:grid-cols-[150px_1fr] sm:items-center">
          <div className="overflow-hidden rounded-xl border border-white bg-white shadow-sm">
            <img src={image.preview} alt={t(`Preview ${label}`)} className="aspect-[4/3] h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-900">{image.name}</p>
            <p className="mt-1 text-xs text-stone-500">{t("Preview stored in the browser.")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <label
                htmlFor={id}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:border-emerald-900/30 hover:shadow-sm"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 17.5V20h2.5L18.7 7.8l-2.5-2.5L4 17.5Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m14.9 6.6 2.5 2.5" strokeLinecap="round" />
                </svg>{t("Change Photo")}</label>
              <button
                type="button"
                onClick={onRemove} disabled={busy}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 7h14M9 7V4h6v3M8 10v7m4-7v7m4-7v7M7 7l1 13h8l1-13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>{t("Remove")}</button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="group mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-900/25 bg-gradient-to-br from-emerald-50/80 to-white px-5 py-8 text-center transition duration-300 hover:-translate-y-0.5 hover:border-emerald-900/45 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-900/10 bg-white text-emerald-950 shadow-sm transition group-hover:scale-105">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 17V7a2 2 0 0 1 2-2h8l6 6v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 5v6h6M8 15l2-2 2 2 2.5-2.5L17 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="mt-3 text-sm font-semibold text-emerald-950">{t("Choose Reference Photo")}</span>
          <span className="mt-1 text-xs text-stone-500">{t("Click this area to choose an image from your device.")}</span>
        </label>
      )}
    </div>
  )
}

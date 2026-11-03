import { useLanguage } from '../i18n/useLanguage.js'
import useArturaData from '../hooks/useArturaData.js'

export default function StorageErrorBanner() {
  const { t } = useLanguage()

  const { storageError, clearStorageError } = useArturaData()
  if (!storageError) return null

  return (
    <div className="mx-auto mt-4 max-w-7xl px-5 sm:px-8">
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50/95 px-4 py-3 text-sm text-red-900 shadow-sm backdrop-blur">
        <div>
          <p className="font-semibold">{t("Data not saved")}</p>
          <p className="mt-1 leading-6">{t(storageError)}</p>
        </div>
        <button type="button" onClick={clearStorageError} className="shrink-0 rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold hover:bg-red-100">{t("Close")}</button>
      </div>
    </div>
  )
}

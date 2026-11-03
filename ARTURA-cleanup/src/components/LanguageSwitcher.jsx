import { useLanguage } from '../i18n/useLanguage.js'

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div
      data-no-translate="true"
      className={`inline-flex items-center rounded-full border border-emerald-950/15 bg-white/80 p-1 shadow-sm backdrop-blur ${compact ? '' : 'min-w-[94px]'}`}
      aria-label={t("Language selector")}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition ${language === 'en' ? 'bg-emerald-950 text-white' : 'text-stone-500 hover:text-emerald-950'}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('id')}
        aria-pressed={language === 'id'}
        className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition ${language === 'id' ? 'bg-emerald-950 text-white' : 'text-stone-500 hover:text-emerald-950'}`}
      >
        ID
      </button>
    </div>
  )
}

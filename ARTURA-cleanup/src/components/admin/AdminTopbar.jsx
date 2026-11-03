import { useLanguage } from '../../i18n/useLanguage.js'
import LanguageSwitcher from '../LanguageSwitcher.jsx'
function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7H20M4 12H20M4 17H20" strokeLinecap="round" />
    </svg>
  )
}

export default function AdminTopbar({ onMenu }) {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenu} aria-label={t("Open admin menu")} className="rounded-xl border border-stone-300 p-2.5 text-stone-700 lg:hidden">
          <MenuIcon />
        </button>
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-700">{t("ARTURA")}</p>
          <p className="font-semibold">{t("Admin Management")}</p>
        </div>
      </div>
      <div className="flex items-center gap-2"><LanguageSwitcher compact /><span className="hidden rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 sm:inline-flex">{t("Admin Session")}</span></div>
    </header>
  )
}

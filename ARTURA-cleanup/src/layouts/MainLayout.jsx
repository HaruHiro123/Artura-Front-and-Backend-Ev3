import { useLanguage } from '../i18n/useLanguage.js'
import { Link, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import useArturaData from '../hooks/useArturaData.js'
import StorageErrorBanner from '../components/StorageErrorBanner.jsx'

function BackgroundGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#eef2ef]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(7,89,68,0.08),transparent_26%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.08),transparent_20%)]" />
      <div className="absolute left-[-6rem] top-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute right-[-5rem] top-32 h-72 w-72 rounded-full bg-teal-200/25 blur-3xl" />
      <div className="absolute bottom-10 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
      <div className="absolute bottom-[-5rem] right-[-4rem] h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.26)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
    </div>
  )
}

export default function MainLayout() {
  const { t } = useLanguage()

  const { siteSettings } = useArturaData()
  const name = siteSettings.siteName || 'ARTURA'

  return (
    <div className="relative flex min-h-screen flex-col text-stone-900">
      <BackgroundGlow />
      <Navbar />
      <StorageErrorBanner />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 sm:px-8">
          <div>
            <Link to="/" className="font-serif text-2xl font-semibold tracking-widest text-emerald-950">
              {t(name)}
            </Link>
            <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">{t("A space to share artwork, sell selected pieces, and bring stories to life through custom art commissions.")}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-semibold text-emerald-900">{t("Every stroke tells a story.")}</p>
            <p className="mt-3 text-sm leading-7 text-stone-500">{t("Personal Art Gallery")}<br />{t("Art Shop & Custom Commission")}</p>
          </div>
        </div>
        <div className="border-t border-white/50">
          <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-stone-500 sm:px-8">
            © {t(new Date().getFullYear())} {t(name)}.
          </div>
        </div>
      </footer>
    </div>
  )
}

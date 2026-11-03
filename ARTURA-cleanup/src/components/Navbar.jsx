import { useLanguage } from '../i18n/useLanguage.js'
import { NavLink } from 'react-router-dom'
import useCart from '../hooks/useCart.js'
import useArturaData from '../hooks/useArturaData.js'
import { isAdminAuthenticated } from '../utils/adminAuth.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'

export default function Navbar() {
  const { t } = useLanguage()

  const { totalQty } = useCart()
  const { siteSettings } = useArturaData()
  const adminLoggedIn = isAdminAuthenticated()

  const navigationClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 ${
      isActive
        ? 'bg-emerald-950 text-white'
        : 'text-stone-600 hover:bg-stone-100 hover:text-emerald-950'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav
        aria-label={t("Main navigation")}
        className="mx-auto grid max-w-7xl items-center gap-4 px-5 py-4 sm:px-8 lg:grid-cols-[auto_1fr_auto]"
      >
        <NavLink to="/" end className="rounded text-center lg:text-left">
          <span className="block font-serif text-3xl font-semibold tracking-widest text-emerald-950">
            {siteSettings.siteName || 'ARTURA'}
          </span>
          <span className="mt-1 block text-xs tracking-wide text-stone-500">{t("Art Gallery, Shop & Custom Commission")}</span>
        </NavLink>

        <div className="flex flex-wrap items-center justify-center gap-1 lg:justify-end">
          <NavLink to="/" end className={navigationClass}>{t("Home")}</NavLink>
          <NavLink to="/portfolio" className={navigationClass}>{t("Portfolio")}</NavLink>
          <NavLink to="/shop" className={navigationClass}>{t("Shop")}</NavLink>
          <NavLink to="/commission" className={navigationClass}>{t("Commission")}</NavLink>
          <NavLink to="/about" className={navigationClass}>{t("About")}</NavLink>
          <NavLink to="/status" className={navigationClass}>{t("Purchase Status")}</NavLink>
          <NavLink to="/cart" className={navigationClass}>{t("Cart")}{totalQty > 0 && (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-emerald-950">
                {t(totalQty)}
              </span>
            )}
          </NavLink>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
          <LanguageSwitcher />
          <NavLink
            to={adminLoggedIn ? '/admin/dashboard' : '/admin/login'}
            className="group inline-flex items-center gap-2 rounded-full border border-emerald-950 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-current font-serif text-xs font-semibold"
            >{t("A")}</span>
            {t(adminLoggedIn ? 'Admin Panel' : 'Admin Login')}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

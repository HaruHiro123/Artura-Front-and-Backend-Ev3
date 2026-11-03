import { useLanguage } from '../../i18n/useLanguage.js'
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutAdmin } from '../../utils/adminAuth.js'

const links = [
  ['Dashboard', '/admin/dashboard'],
  ['Artwork', '/admin/artworks'],
  ['Commissions', '/admin/commissions'],
  ['Orders', '/admin/orders'],
  ['Payments', '/admin/payments'],
  ['Reviews', '/admin/reviews'],
  ['Commission Pricing', '/admin/pricing'],
  ['Artist Profile', '/admin/profile'],
  ['Settings', '/admin/settings'],
]

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}

export default function AdminSidebar({ open, onClose }) {
  const { t } = useLanguage()

  const navigate = useNavigate()

  return (
    <>
      {open && <button aria-label={t("Close admin menu")} className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-stone-200 bg-white p-5 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold tracking-widest text-emerald-950">{t("ARTURA")}</p>
            <p className="text-xs text-stone-500">{t("Admin Panel")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("Close sidebar")} className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 lg:hidden">
            <CloseIcon />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-emerald-950 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              {t(label)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 space-y-2 border-t border-stone-200 pt-5">
          <button type="button" onClick={() => navigate('/')} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-left text-sm font-semibold text-stone-700 hover:border-emerald-900">{t("View Website")}</button>
          <button
            type="button"
            onClick={() => {
              logoutAdmin()
              navigate('/')
            }}
            className="w-full rounded-xl bg-stone-100 px-4 py-3 text-left text-sm font-semibold text-stone-700 hover:bg-stone-200"
          >{t("Logout")}</button>
        </div>
      </aside>
    </>
  )
}

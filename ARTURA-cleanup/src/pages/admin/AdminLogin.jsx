import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { isAdminAuthenticated, loginAdmin } from '../../utils/adminAuth.js'
import LanguageSwitcher from '../../components/LanguageSwitcher.jsx'

function ArturaMark() {
  const { t } = useLanguage()

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-900/15 bg-emerald-50 font-serif text-xl font-semibold text-emerald-950">{t("A")}</div>
  )
}

export default function AdminLogin() {
  const { t } = useLanguage()

  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />
  }

  function submit(event) {
    event.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Please enter your admin username and password.')
      return
    }

    if (!loginAdmin(username.trim(), password)) {
      setError('Incorrect username or password.')
      return
    }

    navigate(location.state?.from || '/admin/dashboard', { replace: true })
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
          <ArturaMark />
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[0.18em] text-emerald-950">{t("ARTURA")}</p>
            <p className="text-xs text-stone-500">{t("Administration")}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <Link
            to="/"
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-900 hover:text-emerald-950"
          >{t("Back to Website")}</Link>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-8 py-10 lg:grid-cols-[1fr_0.85fr]">
        <section className="hidden rounded-[2.25rem] bg-emerald-950 p-10 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">{t("ARTURA Admin")}</p>
          <h1 className="mt-5 max-w-lg font-serif text-5xl leading-tight">{t("Manage the gallery without leaving the ARTURA experience.")}</h1>
          <p className="mt-6 max-w-xl leading-8 text-emerald-50/75">{t("Manage artwork, commissions, orders, payments, pricing, reviews, and website settings from one panel connected to the public site.")}</p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {['Artwork', 'Commission', 'Orders', 'Payments'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-emerald-50">
                {t(item)}
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="w-full rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
          <div className="flex items-center gap-4 lg:hidden">
            <ArturaMark />
            <div>
              <p className="font-serif text-2xl font-semibold tracking-widest text-emerald-950">{t("ARTURA")}</p>
              <p className="text-sm text-stone-500">{t("Admin Login")}</p>
            </div>
          </div>

          <div className="mt-2 lg:mt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">{t("Secure Access")}</p>
            <h2 className="mt-3 font-serif text-4xl text-stone-900">{t("Admin Login")}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-500">{t("Sign in to open the ARTURA Admin Panel.")}</p>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-stone-800">{t("Username")}</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-100"
                placeholder={t("Enter username")}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-stone-800">{t("Password")}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-100"
                placeholder={t("Enter password")}
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-800">
              {t(error)}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-emerald-950 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
          >{t("Login to Admin Panel")}</button>
        </form>
      </div>
    </main>
  )
}

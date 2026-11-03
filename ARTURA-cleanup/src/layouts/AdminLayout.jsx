import { useLanguage } from '../i18n/useLanguage.js'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'
import AdminTopbar from '../components/admin/AdminTopbar.jsx'
import StorageErrorBanner from '../components/StorageErrorBanner.jsx'

export default function AdminLayout() {
  const { t } = useLanguage()

  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 lg:flex">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      {open && (
        <button
          aria-label={t("Close sidebar")}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="min-w-0 flex-1">
        <AdminTopbar onMenu={() => setOpen(true)} />
        <StorageErrorBanner />
        <main className="p-5 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}

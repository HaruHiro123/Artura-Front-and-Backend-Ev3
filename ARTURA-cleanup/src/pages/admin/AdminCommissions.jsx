import { useLanguage } from '../../i18n/useLanguage.js'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useArturaData from '../../hooks/useArturaData.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import formatRupiah from '../../utils/formatRupiah.js'

const statuses = ['new','waiting-payment','waiting-verification','in-progress','ready-to-deliver','ready-to-ship','shipped','delivered','completed','rejected']

export default function AdminCommissions() {
  const { t, locale } = useLanguage()

  const { commissions } = useArturaData()
  const [search, setSearch] = useState('')
  const [medium, setMedium] = useState('all')
  const [status, setStatus] = useState('all')

  const visible = useMemo(() => commissions.filter((item) => {
    const client = item.client?.name?.toLowerCase() || ''
    return client.includes(search.toLowerCase()) && (medium === 'all' || item.mediaType === medium) && (status === 'all' || item.status === status)
  }), [commissions, search, medium, status])

  return (
    <div>
      <h1 className="font-serif text-4xl">{t("Commission Management")}</h1>
      <div className="mt-7 grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search customer...")} className="rounded-xl border px-4 py-3" />
        <select value={medium} onChange={(e) => setMedium(e.target.value)} className="rounded-xl border px-4 py-3"><option value="all">{t("All Medium")}</option><option value="digital">{t("Digital")}</option><option value="traditional">{t("Traditional")}</option></select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border px-4 py-3"><option value="all">{t("All Status")}</option>{statuses.map((value) => <option key={value} value={value}>{t(value)}</option>)}</select>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-[950px] w-full text-left text-sm">
          <thead className="bg-stone-100"><tr>{['Request ID','Client','Medium','Style','Body','Price','Payment','Date','Status','Action'].map((heading) => <th key={heading} className="px-4 py-3">{t(heading)}</th>)}</tr></thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3 font-semibold">{item.id}</td>
                <td className="px-4 py-3">{item.client.name}</td>
                <td className="px-4 py-3 capitalize">{t(item.mediaType)}</td>
                <td className="px-4 py-3">{t(item.artStyle)}</td>
                <td className="px-4 py-3">{t(item.bodyCoverage)}</td>
                <td className="px-4 py-3">{t(formatRupiah(item.finalPrice || item.estimatedPrice))}</td>
                <td className="px-4 py-3"><StatusBadge status={item.paymentStatus || 'waiting-approval'} /></td>
                <td className="px-4 py-3">{t(new Date(item.createdAt).toLocaleDateString(locale))}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3"><Link to={`/admin/commissions/${item.id}`} className="font-semibold text-emerald-800">{t("Open")}</Link></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan="10" className="px-4 py-8 text-center text-stone-500">{t("No commission requests yet.")}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

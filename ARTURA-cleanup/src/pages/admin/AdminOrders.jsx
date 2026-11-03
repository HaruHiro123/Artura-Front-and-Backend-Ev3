import { useLanguage } from '../../i18n/useLanguage.js'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useArturaData from '../../hooks/useArturaData.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import formatRupiah from '../../utils/formatRupiah.js'

const statuses = ['waiting-payment','waiting-verification','processing','ready-to-ship','shipped','delivered','completed','cancelled']

export default function AdminOrders() {
  const { t, locale } = useLanguage()

  const { orders } = useArturaData()
  const [status, setStatus] = useState('all')
  const visible = useMemo(() => status === 'all' ? orders : orders.filter((item) => item.orderStatus === status), [orders, status])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs uppercase tracking-widest text-emerald-700">{t("Public Checkout Data")}</p><h1 className="mt-2 font-serif text-4xl">{t("Orders")}</h1></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border bg-white px-4 py-3"><option value="all">{t("All Status")}</option>{statuses.map((value) => <option key={value} value={value}>{t(value)}</option>)}</select>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-[950px] w-full text-left text-sm">
          <thead className="bg-stone-100"><tr>{['Order ID','Customer','Artwork','Total','Payment','Order Status','Courier','Date','Action'].map((heading) => <th key={heading} className="px-4 py-3">{t(heading)}</th>)}</tr></thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-3 font-semibold">{order.id}</td>
                <td className="px-4 py-3">{order.customer.name}</td>
                <td className="px-4 py-3">{order.items.map((item) => item.title).join(', ')}</td>
                <td className="px-4 py-3">{t(formatRupiah(order.total))}</td>
                <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
                <td className="px-4 py-3"><StatusBadge status={order.orderStatus} /></td>
                <td className="px-4 py-3 uppercase">{order.shipping?.courier || '-'}</td>
                <td className="px-4 py-3">{t(new Date(order.createdAt).toLocaleDateString(locale))}</td>
                <td className="px-4 py-3"><Link to={`/admin/orders/${order.id}`} className="font-semibold text-emerald-800">{t("Open")}</Link></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan="9" className="px-4 py-8 text-center text-stone-500">{t("No orders yet.")}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

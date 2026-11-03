import { useLanguage } from '../../i18n/useLanguage.js'
import { Link } from 'react-router-dom'
import useArturaData from '../../hooks/useArturaData.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import formatRupiah from '../../utils/formatRupiah.js'

export default function AdminPayments() {
  const { t } = useLanguage()

  const { orders, commissions } = useArturaData()
  const orderPayments = orders
    .filter((order) => ['waiting-verification', 'paid', 'rejected'].includes(order.paymentStatus))
    .map((order) => ({
      id: order.id,
      type: 'Shop Order',
      customer: order.customer.name,
      total: order.total,
      method: order.paymentMethod,
      proof: order.paymentProof,
      status: order.paymentStatus,
      link: `/admin/orders/${order.id}`,
    }))
  const commissionPayments = commissions
    .filter((item) => ['waiting-verification', 'paid', 'rejected'].includes(item.paymentStatus))
    .map((item) => ({
      id: item.id,
      type: 'Commission',
      customer: item.client.name,
      total: item.finalPrice || item.estimatedPrice,
      method: item.paymentMethod,
      proof: item.paymentProof,
      status: item.paymentStatus,
      link: `/admin/commissions/${item.id}`,
    }))
  const payments = [...orderPayments, ...commissionPayments]

  return (
    <div>
      <h1 className="font-serif text-4xl">{t("Payment Management")}</h1>
      <p className="mt-3 text-sm text-stone-600">{t("Shop and Commission payments appear on a single verification page.")}</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-[860px] w-full text-left text-sm">
          <thead className="bg-stone-100"><tr>{['ID','Type','Customer','Total','Method','Proof','Status','Action'].map((heading) => <th key={heading} className="px-4 py-3">{t(heading)}</th>)}</tr></thead>
          <tbody>
            {payments.map((item) => (
              <tr key={`${item.type}-${item.id}`} className="border-t">
                <td className="px-4 py-3 font-semibold">{item.id}</td>
                <td className="px-4 py-3">{t(item.type)}</td>
                <td className="px-4 py-3">{item.customer}</td>
                <td className="px-4 py-3">{t(formatRupiah(item.total))}</td>
                <td className="px-4 py-3 capitalize">{t(item.method || '-')}</td>
                <td className="px-4 py-3">{item.proof?.preview ? <img src={item.proof.preview} alt={t("Proof")} className="h-14 w-14 rounded bg-stone-100 object-contain" /> : '-'}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3"><Link to={item.link} className="font-semibold text-emerald-800">{t("Open")}</Link></td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan="8" className="px-4 py-8 text-center text-stone-500">{t("No payments are waiting for verification.")}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

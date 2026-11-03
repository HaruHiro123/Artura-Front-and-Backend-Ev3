import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import useArturaData from '../../hooks/useArturaData.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import formatRupiah from '../../utils/formatRupiah.js'
import { courierOptions, courierLabel } from '../../data/deliveryOptions.js'

export default function OrderDetail() {
  const { t, locale } = useLanguage()

  const { id } = useParams()
  const { orders, updateOrder } = useArturaData()
  const order = orders.find((item) => item.id === id)
  const [courier, setCourier] = useState(order?.shipping?.courier || 'jnt')
  const [trackingNumber, setTrackingNumber] = useState(order?.shipping?.trackingNumber || '')
  const [message, setMessage] = useState('')

  if (!order) return <Navigate to="/admin/orders" replace />

  function commit(changes, successMessage) {
    const ok = updateOrder(order.id, changes)
    setMessage(ok ? successMessage : 'Changes were not saved. Check the browser storage notification.')
    return ok
  }

  function verify() {
    if (order.orderStatus === 'cancelled') return setMessage('A cancelled order cannot have its payment verified.')
    if (!order.paymentProof) return setMessage('Payment proof is not available yet.')
    commit({ paymentStatus: 'paid', orderStatus: 'processing' }, 'Payment verified. The order has moved to Processing.')
  }

  function reject() {
    if (order.orderStatus === 'cancelled') return setMessage('The order has already been cancelled.')
    commit({ paymentStatus: 'rejected', orderStatus: 'waiting-payment', paymentProof: null }, 'Payment proof rejected. The customer can submit payment again.')
  }

  function cancelOrder() {
    if (order.paymentStatus === 'paid') return setMessage('A paid order cannot be cancelled from this flow. Complete the process or handle the refund manually.')
    commit({ orderStatus: 'cancelled', paymentStatus: 'cancelled', paymentProof: null }, 'The order was cancelled and new payments have been disabled.')
  }

  function saveShipping(nextStatus) {
    if (nextStatus === 'shipped' && !trackingNumber.trim()) {
      setMessage('Enter a tracking number before marking the order as Shipped.')
      return
    }
    const now = new Date().toISOString()
    commit({
      orderStatus: nextStatus,
      shipping: {
        ...(order.shipping || {}),
        courier,
        trackingNumber: trackingNumber.trim(),
        shippedAt: nextStatus === 'shipped' ? now : order.shipping?.shippedAt || '',
        deliveredAt: nextStatus === 'delivered' ? now : order.shipping?.deliveredAt || '',
      },
    }, 'Order status updated.')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs uppercase tracking-widest text-emerald-700">{t("Order Detail")}</p><h1 className="mt-2 font-serif text-4xl">{order.id}</h1></div>
        <div className="flex gap-2"><StatusBadge status={order.paymentStatus} /><StatusBadge status={order.orderStatus} /></div>
      </div>

      {message && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{t(message)}</p>}

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <section className="space-y-6">
          <div className="rounded-3xl border bg-white p-6"><h2 className="font-serif text-2xl">{t("Order Information")}</h2><p className="mt-3 text-sm text-stone-500">{t(new Date(order.createdAt).toLocaleString(locale))}</p></div>
          <div className="rounded-3xl border bg-white p-6"><h2 className="font-serif text-2xl">{t("Customer")}</h2><p className="mt-4 font-semibold">{order.customer.name}</p><p className="text-sm text-stone-600">{order.customer.email || '-'}</p><p className="text-sm text-stone-600">{order.customer.whatsapp || '-'}</p></div>
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="font-serif text-2xl">{t("Shipping")}</h2>
            <p className="mt-4 text-sm leading-7">{order.shipping.address}<br />{order.shipping.city}, {order.shipping.province} {order.shipping.postalCode}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">{t("Courier")}<select value={courier} onChange={(e) => setCourier(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3">{courierOptions.map((item) => <option key={item.value} value={item.value}>{t(item.label)}</option>)}</select></label>
              <label className="text-sm font-semibold">{t("Tracking Number")}<input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder={t("Tracking number")} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
            </div>
            <p className="mt-3 text-xs text-stone-500">{t("Current courier: ")}{t(courierLabel(order.shipping?.courier))}</p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="font-serif text-2xl">{t("Items")}</h2>
            <div className="mt-4 space-y-3">{order.items.map((item) => <div key={item.id} className="flex items-center gap-4 rounded-xl bg-stone-50 p-3"><img src={item.image} alt="" className="h-20 w-16 rounded object-contain" /><div className="flex-1"><p className="font-semibold">{item.title}</p><p className="text-sm text-stone-600">{t(formatRupiah(item.price))}</p></div></div>)}</div>
            <div className="mt-5 flex justify-between border-t pt-4"><span>{t("Total")}</span><strong>{t(formatRupiah(order.total))}</strong></div>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="font-serif text-2xl">{t("Payment & Fulfillment")}</h2>
            <div className="mt-4 flex flex-wrap gap-3"><StatusBadge status={order.paymentStatus} /><span className="text-sm font-semibold capitalize">{t(order.paymentMethod || 'No method')}</span></div>
            {order.paymentProof?.preview && <img src={order.paymentProof.preview} alt={t("Payment proof")} className="mt-5 max-h-72 w-full rounded-xl bg-stone-100 object-contain" />}

            <div className="mt-5 flex flex-wrap gap-2">
              {order.orderStatus !== 'cancelled' && order.paymentStatus === 'waiting-verification' && <><button type="button" onClick={verify} className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white">{t("Verify Payment")}</button><button type="button" onClick={reject} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">{t("Reject Payment Proof")}</button></>}
              {order.paymentStatus === 'paid' && order.orderStatus === 'processing' && <button type="button" onClick={() => saveShipping('ready-to-ship')} className="rounded-full border px-4 py-2 text-sm font-semibold">{t("Mark Ready to Ship")}</button>}
              {order.paymentStatus === 'paid' && order.orderStatus === 'ready-to-ship' && <button type="button" onClick={() => saveShipping('shipped')} className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white">{t("Mark Shipped")}</button>}
              {order.paymentStatus === 'paid' && order.orderStatus === 'shipped' && <button type="button" onClick={() => saveShipping('delivered')} className="rounded-full border px-4 py-2 text-sm font-semibold">{t("Mark Delivered")}</button>}
              {order.paymentStatus === 'paid' && order.orderStatus === 'delivered' && <button type="button" onClick={() => saveShipping('completed')} className="rounded-full border px-4 py-2 text-sm font-semibold">{t("Mark Completed")}</button>}
              {!['completed', 'cancelled'].includes(order.orderStatus) && order.paymentStatus !== 'paid' && <button type="button" onClick={cancelOrder} className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">{t("Cancel Order")}</button>}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

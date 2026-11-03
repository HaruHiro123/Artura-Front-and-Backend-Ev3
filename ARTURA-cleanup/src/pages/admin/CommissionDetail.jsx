import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import useArturaData from '../../hooks/useArturaData.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import formatRupiah from '../../utils/formatRupiah.js'
import { courierOptions, courierLabel } from '../../data/deliveryOptions.js'

export default function CommissionDetail() {
  const { t, locale } = useLanguage()

  const { id } = useParams()
  const { commissions, updateCommission } = useArturaData()
  const item = commissions.find((entry) => entry.id === id)
  const [finalPrice, setFinalPrice] = useState(String(item?.finalPrice || item?.estimatedPrice || 0))
  const [courier, setCourier] = useState(item?.delivery?.courier || 'jnt')
  const [trackingNumber, setTrackingNumber] = useState(item?.delivery?.trackingNumber || '')
  const [deliveryUrl, setDeliveryUrl] = useState(item?.delivery?.deliveryUrl || '')
  const [message, setMessage] = useState('')

  if (!item) return <Navigate to="/admin/commissions" replace />

  function commit(changes, successMessage) {
    const ok = updateCommission(item.id, changes)
    setMessage(ok ? successMessage : 'Changes were not saved. Check the browser storage notification.')
    return ok
  }

  function acceptRequest() {
    const nextPrice = Number(finalPrice)
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) return setMessage('Final price must be greater than 0.')
    commit({ finalPrice: nextPrice, status: 'waiting-payment', paymentStatus: 'waiting-payment' }, 'Commission accepted. The customer can now make a payment.')
  }

  function verifyPayment() {
    if (!item.paymentProof) return setMessage('Payment proof is not available yet.')
    commit({ paymentStatus: 'paid', status: 'in-progress' }, 'Payment verified. The commission has moved to In Progress.')
  }

  function rejectPayment() {
    commit({ paymentStatus: 'rejected', paymentProof: null, status: 'waiting-payment' }, 'Payment proof rejected. The customer can upload a new payment proof.')
  }

  function saveDigitalLink() {
    const value = deliveryUrl.trim()
    if (value && !/^https:\/\//i.test(value)) return setMessage('The final file link must use HTTPS.')
    commit({ delivery: { ...(item.delivery || {}), deliveryUrl: value } }, value ? 'Digital delivery link saved.' : 'Digital delivery link removed.')
  }

  function updateWorkStatus(status) {
    if (status === 'shipped' && item.mediaType === 'traditional' && !trackingNumber.trim()) return setMessage('Enter a tracking number before marking the commission as Shipped.')
    if (status === 'ready-to-deliver' && item.mediaType === 'digital' && !deliveryUrl.trim()) return setMessage('Enter the Final File Link first, or save it when the file is available.')
    const now = new Date().toISOString()
    commit({
      status,
      delivery: {
        ...(item.delivery || {}),
        courier: item.mediaType === 'traditional' ? courier : item.delivery?.courier || '',
        trackingNumber: trackingNumber.trim(),
        deliveryUrl: item.mediaType === 'digital' ? deliveryUrl.trim() : item.delivery?.deliveryUrl || '',
        shippedAt: status === 'shipped' ? now : item.delivery?.shippedAt || '',
        deliveredAt: status === 'delivered' ? now : item.delivery?.deliveredAt || '',
      },
    }, 'Commission status updated.')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-emerald-700">{t("Commission Detail")}</p><h1 className="mt-2 font-serif text-4xl">{item.id}</h1></div><div className="flex flex-wrap gap-2"><StatusBadge status={item.status} /><StatusBadge status={item.paymentStatus} /></div></div>
      {message && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{t(message)}</p>}

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border bg-white p-6">
          <h2 className="font-serif text-2xl">{t("Request Information")}</h2>
          <dl className="mt-5 space-y-3 text-sm">{[['Client', item.client.name], ['Contact', item.client.contact], ['Medium', item.mediaType], ['Style', item.artStyle], ['Body', item.bodyCoverage], ['Rendering', item.renderType], ['Persons', item.personCount], ['Pose', item.poseType], ['Background', item.backgroundType], ['Canvas Ratio', item.ratio], ['Paper Size', item.paperSize], ['Orientation', item.orientation], ['Estimated Price', formatRupiah(item.estimatedPrice)], ['Created At', new Date(item.createdAt).toLocaleString(locale)]].filter(([, value]) => value).map(([key, value]) => <div key={key} className="flex justify-between gap-4"><dt className="text-stone-500">{t(key)}</dt><dd className="text-right font-medium capitalize">{['Client','Contact'].includes(key) ? value : t(value)}</dd></div>)}</dl>
          {item.specialRequest && <div className="mt-5 rounded-xl bg-stone-50 p-4"><p className="text-xs font-semibold uppercase text-stone-500">{t("Special Request")}</p><p className="mt-2 text-sm leading-7">{item.specialRequest}</p></div>}
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border bg-white p-6"><h2 className="font-serif text-2xl">{t("References")}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{item.mainReference?.preview && <img src={item.mainReference.preview} alt={t("Main reference")} className="h-56 w-full rounded-xl bg-stone-100 object-contain" />}{item.poseReference?.preview && <img src={item.poseReference.preview} alt={t("Pose reference")} className="h-56 w-full rounded-xl bg-stone-100 object-contain" />}{!item.mainReference?.preview && !item.poseReference?.preview && <p className="text-sm text-stone-500">{t("No reference image.")}</p>}</div></div>
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="font-serif text-2xl">{t("Approval & Payment")}</h2>
            <label className="mt-5 block text-sm font-semibold">{t("Final Price")}<input type="number" min="1" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
            <div className="mt-5 flex flex-wrap gap-2">{item.status === 'new' && <><button type="button" onClick={acceptRequest} className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white">{t("Accept Request")}</button><button type="button" onClick={() => commit({ status: 'rejected', paymentStatus: 'rejected' }, 'Commission request rejected.')} className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">{t("Reject Request")}</button></>}{item.paymentStatus === 'waiting-verification' && <><button type="button" onClick={verifyPayment} className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white">{t("Verify Payment")}</button><button type="button" onClick={rejectPayment} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">{t("Reject Payment Proof")}</button></>}</div>
            {item.paymentProof?.preview && <img src={item.paymentProof.preview} alt={t("Commission payment proof")} className="mt-5 max-h-72 w-full rounded-xl bg-stone-100 object-contain" />}
          </div>
        </section>
      </div>

      {item.paymentStatus === 'paid' && (
        <section className="mt-6 rounded-3xl border bg-white p-6">
          <h2 className="font-serif text-2xl">{t("Production & Delivery")}</h2>
          {item.mediaType === 'traditional' ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end"><label className="text-sm font-semibold">{t("Courier")}<select value={courier} onChange={(e) => setCourier(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3">{courierOptions.map((option) => <option key={option.value} value={option.value}>{t(option.label)}</option>)}</select></label><label className="text-sm font-semibold">{t("Tracking Number")}<input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" placeholder={t("Tracking number")} /></label><div className="text-xs text-stone-500">{t("Current: ")}{t(courierLabel(item.delivery?.courier))}</div></div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><label className="text-sm font-semibold">{t("Final File Link")}<input type="url" value={deliveryUrl} onChange={(e) => setDeliveryUrl(e.target.value)} placeholder={t("https://drive.google.com/...")} className="mt-2 w-full rounded-xl border px-4 py-3" /><span className="mt-2 block text-xs font-normal text-stone-500">{t("Use a Drive, Dropbox, or other file link that the customer can open.")}</span></label><button type="button" onClick={saveDigitalLink} className="rounded-full border px-4 py-3 text-sm font-semibold">{t("Save Link")}</button></div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">{item.status === 'in-progress' && item.mediaType === 'digital' && <button type="button" onClick={() => updateWorkStatus('ready-to-deliver')} className="rounded-full border px-4 py-2 text-sm font-semibold">{t("Mark Ready to Deliver")}</button>}{item.status === 'ready-to-deliver' && item.mediaType === 'digital' && <button type="button" onClick={() => updateWorkStatus('completed')} className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white">{t("Mark Completed")}</button>}{item.status === 'in-progress' && item.mediaType === 'traditional' && <button type="button" onClick={() => updateWorkStatus('ready-to-ship')} className="rounded-full border px-4 py-2 text-sm font-semibold">{t("Mark Ready to Ship")}</button>}{item.status === 'ready-to-ship' && item.mediaType === 'traditional' && <button type="button" onClick={() => updateWorkStatus('shipped')} className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white">{t("Mark Shipped")}</button>}{item.status === 'shipped' && item.mediaType === 'traditional' && <button type="button" onClick={() => updateWorkStatus('delivered')} className="rounded-full border px-4 py-2 text-sm font-semibold">{t("Mark Delivered")}</button>}{item.status === 'delivered' && item.mediaType === 'traditional' && <button type="button" onClick={() => updateWorkStatus('completed')} className="rounded-full border px-4 py-2 text-sm font-semibold">{t("Mark Completed")}</button>}</div>

          {item.mediaType === 'traditional' && <div className="mt-6 rounded-2xl bg-stone-50 p-5 text-sm leading-7 text-stone-600"><strong className="text-stone-900">{t("Delivery Address")}</strong><br />{item.delivery?.recipientName || item.client.name}<br />{item.delivery?.address || '-'}<br />{[item.delivery?.city, item.delivery?.province, item.delivery?.postalCode].filter(Boolean).join(', ')}</div>}
        </section>
      )}
    </div>
  )
}

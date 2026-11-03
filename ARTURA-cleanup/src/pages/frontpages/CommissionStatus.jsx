import { useLanguage } from '../../i18n/useLanguage.js'
import { Navigate, useParams } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import ProgressTimeline from '../../components/ProgressTimeline.jsx'
import ReceiptCard from '../../components/ReceiptCard.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import useArturaData from '../../hooks/useArturaData.js'
import { courierLabel } from '../../data/deliveryOptions.js'
import { paymentMethodLabel } from '../../utils/paymentMethods.js'
import formatRupiah from '../../utils/formatRupiah.js'

const digitalSteps = [
  { value: 'new', label: 'Request Submitted', description: 'The commission request has been submitted and is waiting for review.' },
  { value: 'waiting-payment', label: 'Request Accepted', description: 'The request has been accepted and payment can be made.' },
  { value: 'waiting-verification', label: 'Payment Verification', description: 'Payment proof is being verified.' },
  { value: 'in-progress', label: 'In Progress', description: 'The artwork is currently in progress.' },
  { value: 'ready-to-deliver', label: 'Final Artwork Ready', description: 'The final artwork is ready for digital delivery.' },
  { value: 'completed', label: 'Completed', description: 'The commission is complete and the final file has been delivered.' },
]

const traditionalSteps = [
  { value: 'new', label: 'Request Submitted', description: 'The commission request has been submitted and is waiting for review.' },
  { value: 'waiting-payment', label: 'Request Accepted', description: 'The request has been accepted and payment can be made.' },
  { value: 'waiting-verification', label: 'Payment Verification', description: 'Payment proof is being verified.' },
  { value: 'in-progress', label: 'In Progress', description: 'The physical artwork is currently in progress.' },
  { value: 'ready-to-ship', label: 'Ready to Ship', description: 'The artwork is complete and is being prepared for shipping.' },
  { value: 'shipped', label: 'Shipped', description: 'The artwork has been handed over to the courier.' },
  { value: 'delivered', label: 'Delivered', description: 'The package has arrived at the recipient address.' },
  { value: 'completed', label: 'Completed', description: 'The commission and delivery process are complete.' },
]

function instagramHref(handle) {
  const username = String(handle || '@artuhiro.__').replace(/^@/, '').trim()
  return `https://www.instagram.com/${username}/`
}

export default function CommissionStatus() {
  const { t } = useLanguage()

  const { id } = useParams()
  const { commissions, paymentSettings, artist } = useArturaData()
  const item = commissions.find((entry) => entry.id === id)
  if (!item) return <Navigate to="/commission" replace />

  const currentStatus = item.status === 'accepted' ? 'waiting-payment' : item.status
  const steps = item.mediaType === 'traditional' ? traditionalSteps : digitalSteps
  const canPay = item.status !== 'rejected' && ['waiting-payment', 'rejected'].includes(item.paymentStatus)
  const instagram = artist.instagram || '@artuhiro.__'

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">{t("Commission Progress")}</p>
            <h1 className="mt-3 font-serif text-4xl text-stone-950">{item.id}</h1>
            <p className="mt-3 text-sm text-stone-600">{item.client.name} · {item.client.contact}</p>
          </div>
          <div className="flex flex-wrap gap-2"><StatusBadge status={item.status} /><StatusBadge status={item.paymentStatus} /></div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-serif text-2xl">{t("Progress")}</h2>
            {item.status === 'rejected' ? (
              <div className="mt-5 rounded-2xl bg-red-50 p-5 text-sm leading-7 text-red-900">{t("Commission request rejected. Contact ARTURA through Instagram if you need more information.")}</div>
            ) : (
              <div className="mt-5"><ProgressTimeline steps={steps} currentStatus={currentStatus} /></div>
            )}
          </div>

          <aside className="rounded-[1.5rem] bg-emerald-950 p-6 text-white">
            <p className="text-xs uppercase tracking-widest text-emerald-200">{t("Commission Summary")}</p>
            <p className="mt-4 font-serif text-3xl">{t(formatRupiah(item.finalPrice || item.estimatedPrice))}</p>
            <dl className="mt-5 space-y-3 border-t border-white/15 pt-5 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-emerald-100">{t("Medium")}</dt><dd className="capitalize">{t(item.mediaType)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-emerald-100">{t("Style")}</dt><dd className="capitalize">{t(item.artStyle)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-emerald-100">{t("Payment")}</dt><dd>{t(paymentMethodLabel(item.paymentMethod, paymentSettings))}</dd></div>
            </dl>
            {canPay && <Button to={`/commission/payment/${item.id}`} variant="light" className="mt-6 w-full">{t("Pay Commission")}</Button>}
          </aside>
        </div>
      </section>

      {item.mediaType === 'traditional' ? (
        <section className="grid gap-6 rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Delivery")}</p>
            <h2 className="mt-2 font-serif text-2xl">{t("Artwork Delivery")}</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Courier")}</dt><dd className="font-semibold">{t(courierLabel(item.delivery?.courier))}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Tracking Number")}</dt><dd className="font-semibold">{t(item.delivery?.trackingNumber || 'Not available yet')}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Recipient")}</dt><dd className="font-semibold">{item.delivery?.recipientName || item.client.name}</dd></div>
            </dl>
          </div>
          <div className="rounded-2xl bg-stone-50 p-5 text-sm leading-7 text-stone-600">
            <strong className="text-stone-900">{t("Address:")}</strong><br />
            {item.delivery?.address || '-'}<br />
            {t([item.delivery?.city, item.delivery?.province, item.delivery?.postalCode].filter(Boolean).join(', '))}
          </div>
        </section>
      ) : (
        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Digital Delivery")}</p>
          <h2 className="mt-2 font-serif text-2xl">{t("Final Commission File")}</h2>
          {item.delivery?.deliveryUrl ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-emerald-50 p-5">
              <div>
                <p className="text-sm font-semibold text-emerald-950">{t("The final file is available.")}</p>
                <p className="mt-1 text-sm text-emerald-800">{t("Use the button beside it to open the final file link from the artist.")}</p>
              </div>
              <a href={item.delivery.deliveryUrl} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">{t("Open Final Artwork")}</a>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-stone-600">{t("The final file link is not available yet. If the artwork is finished but the link has not appeared, contact ARTURA and include this commission ID.")}</p>
          )}
        </section>
      )}

      <ReceiptCard
        title={t("Commission Receipt")}
        id={item.id}
        date={item.createdAt}
        customer={item.client.name}
        total={item.finalPrice || item.estimatedPrice}
        paymentStatus={item.paymentStatus}
        contactInstagram={instagram}
        rows={[
          { label: 'Medium', value: item.mediaType },
          { label: 'Style', value: item.artStyle },
          { label: 'Body Coverage', value: item.bodyCoverage },
          { label: 'Payment Method', value: paymentMethodLabel(item.paymentMethod, paymentSettings) },
          { label: 'Work Status', value: item.status },
          { label: 'Courier', value: item.mediaType === 'traditional' ? courierLabel(item.delivery?.courier) : 'Digital Delivery' },
          { label: 'Tracking Number', value: item.delivery?.trackingNumber || '' },
        ]}
      />

      <section className="rounded-[2rem] bg-emerald-950 p-6 text-white sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs uppercase tracking-widest text-emerald-200">{t("Contact")}</p><p className="mt-2 text-sm text-emerald-50/85">{t("Questions about the progress? Include ID ")}<strong>{item.id}</strong>.</p></div>
          <a href={instagramHref(instagram)} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/20">{t("Instagram ")}{t(instagram)}</a>
        </div>
      </section>

      <div className="flex flex-wrap gap-3"><Button to="/status" variant="secondary">{t("Purchase Status")}</Button></div>
    </div>
  )
}

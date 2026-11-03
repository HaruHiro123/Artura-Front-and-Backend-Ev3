import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import UploadImageField from '../../components/UploadImageField.jsx'
import PaymentMethodSelector from '../../components/PaymentMethodSelector.jsx'
import { getAvailablePaymentMethods } from '../../utils/paymentMethods.js'
import useArturaData from '../../hooks/useArturaData.js'
import { readImageFile } from '../../utils/filePreview.js'
import formatRupiah from '../../utils/formatRupiah.js'

export default function Payment() {
  const { t } = useLanguage()

  const { orderId } = useParams()
  const { orders, updateOrder, paymentSettings } = useArturaData()
  const order = orders.find((item) => item.id === orderId)
  const [method, setMethod] = useState(order?.paymentMethod || '')
  const [proof, setProof] = useState(order?.paymentProof || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  if (!order) {
    return (
      <section className="rounded-3xl bg-white p-8 text-center">
        <h1 className="font-serif text-3xl">{t("Order not found")}</h1>
        <Button to="/shop" className="mt-6">{t("Back to Shop")}</Button>
      </section>
    )
  }

  const methods = getAvailablePaymentMethods(paymentSettings)
  const cancelled = order.orderStatus === 'cancelled'
  const locked = cancelled || ['waiting-verification', 'paid'].includes(order.paymentStatus)

  async function chooseFile(file) {
    try {
      setProof(await readImageFile(file, 5))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  function submitProof() {
    if (uploading) return setError('Please wait for the image to finish uploading.')
    if (cancelled) return setError('A cancelled order cannot receive payment proof.')
    if (order.paymentStatus === 'paid') return setError('This order payment has already been verified.')
    if (order.paymentStatus === 'waiting-verification') return setError('Payment proof is waiting for admin verification.')
    if (methods.length === 0) return setError('No payment methods are currently active.')
    if (!method) return setError('Select a payment method first.')
    if (!proof) return setError('Select payment proof first.')

    const ok = updateOrder(order.id, {
      paymentMethod: method,
      paymentProof: proof,
      paymentStatus: 'waiting-verification',
      orderStatus: 'waiting-verification',
    })

    if (!ok) return setError('Payment proof was not saved. Check the browser storage notification.')
    setError('')
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-3">
      <section className="space-y-6 lg:col-span-2">
        <div className="artura-reveal rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Payment")}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-4xl">{t("Order ")}{order.id}</h1>
            <StatusBadge status={order.paymentStatus} />
          </div>
          <dl className="mt-7 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-stone-500">{t("Customer")}</dt><dd className="mt-1 font-semibold">{order.customer.name}</dd></div>
            <div><dt className="text-stone-500">{t("Total Payment")}</dt><dd className="mt-1 font-semibold">{t(formatRupiah(order.total))}</dd></div>
          </dl>
        </div>

        {cancelled && (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-900">
            <h2 className="font-serif text-2xl">{t("Order Cancelled")}</h2>
            <p className="mt-3 text-sm leading-7">{t("This order has been cancelled. Payment method selection and payment proof upload have been disabled.")}</p>
          </div>
        )}

        {!cancelled && (
          <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
            <h2 className="font-serif text-3xl">{t("Payment Method")}</h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">{t("Choose Bank Transfer, E-Wallet, or QRIS enabled in Admin Settings.")}</p>
            <div className="mt-5">
              <PaymentMethodSelector paymentSettings={paymentSettings} method={method} onChange={(value) => { setMethod(value); setError('') }} disabled={locked} />
            </div>
          </div>
        )}

        {!locked && (
          <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
            <h2 className="font-serif text-3xl">{t("Upload Payment Proof")}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{t("Upload a screenshot or photo of the payment proof. The status will not become Paid until the admin verifies it.")}</p>
            <div className="mt-5">
              <UploadImageField id="payment-proof" label={t("Payment Proof")} image={proof} onBusyChange={setUploading} onChoose={chooseFile} onRemove={() => setProof(null)} helper={t("JPG, PNG, or WEBP. Make sure the amount and payment destination are clearly visible.")} />
            </div>
            {error && <p className="artura-reveal mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{t(error)}</p>}
            <Button onClick={submitProof} disabled={uploading || methods.length === 0} className="mt-6">{t("Submit Payment Proof")}</Button>
          </div>
        )}

        {locked && error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{t(error)}</p>}

        {order.paymentStatus === 'waiting-verification' && !cancelled && (
          <div className="artura-reveal rounded-[2rem] border border-sky-100 bg-sky-50/85 p-6">
            <h2 className="font-serif text-2xl text-sky-950">{t("Payment Submitted")}</h2>
            <p className="mt-3 text-sm leading-7 text-sky-900">{t("Payment proof has been received and is waiting for admin verification.")}</p>
          </div>
        )}
      </section>

      <aside className="rounded-[2rem] bg-emerald-950 p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-32">
        <h2 className="font-serif text-2xl">{t("Order Summary")}</h2>
        <div className="mt-6 space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="border-b border-white/15 pb-4">
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-emerald-100">{t(formatRupiah(item.price))}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between"><span>{t("Total")}</span><strong className="text-2xl">{t(formatRupiah(order.total))}</strong></div>
        <Button to={`/order/${order.id}`} variant="light" className="mt-6 w-full">{t("View Order Status")}</Button>
        <Button to="/shop" variant="secondary" className="mt-3 w-full border-white/20 bg-white/10 text-white hover:bg-white/20">{t("Back to Shop")}</Button>
      </aside>
    </div>
  )
}

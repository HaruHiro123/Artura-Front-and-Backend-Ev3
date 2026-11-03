import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import UploadImageField from '../../components/UploadImageField.jsx'
import PaymentMethodSelector from '../../components/PaymentMethodSelector.jsx'
import { getAvailablePaymentMethods } from '../../utils/paymentMethods.js'
import useArturaData from '../../hooks/useArturaData.js'
import { readImageFile } from '../../utils/filePreview.js'
import formatRupiah from '../../utils/formatRupiah.js'

export default function CommissionPayment() {
  const { t } = useLanguage()

  const { id } = useParams()
  const { commissions, updateCommission, paymentSettings } = useArturaData()
  const commission = commissions.find((item) => item.id === id)
  const [method, setMethod] = useState(commission?.paymentMethod || '')
  const [proof, setProof] = useState(commission?.paymentProof || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  if (!commission) return <Navigate to="/commission" replace />

  const payable = ['waiting-payment', 'rejected'].includes(commission.paymentStatus)
  const locked = ['waiting-verification', 'paid'].includes(commission.paymentStatus)
  const methods = getAvailablePaymentMethods(paymentSettings)

  if (commission.status === 'rejected' || (!payable && !locked)) {
    return <Navigate to={`/commission/status/${commission.id}`} replace />
  }

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
    if (methods.length === 0) return setError('No payment methods are currently active.')
    if (!method) return setError('Select a payment method first.')
    if (!proof) return setError('Select payment proof first.')
    const ok = updateCommission(commission.id, {
      paymentMethod: method,
      paymentProof: proof,
      paymentStatus: 'waiting-verification',
      status: 'waiting-verification',
    })
    if (!ok) return setError('Payment proof was not saved. Check the browser storage notification.')
    setError('')
  }

  return (
    <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Commission Payment")}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-4xl">{commission.id}</h1>
            <StatusBadge status={commission.paymentStatus} />
          </div>
          <p className="mt-5 text-sm leading-7 text-stone-600">{t("Commission payment is made after the request is accepted by the admin. Upload payment proof, then wait for verification before the work begins.")}</p>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <h2 className="font-serif text-3xl">{t("Payment Method")}</h2>
          <div className="mt-5">
            <PaymentMethodSelector paymentSettings={paymentSettings} method={method} onChange={(value) => { setMethod(value); setError('') }} disabled={locked} />
          </div>
        </div>

        {!locked && (
          <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
            <h2 className="font-serif text-3xl">{t("Payment Proof")}</h2>
            <div className="mt-5">
              <UploadImageField id="commission-proof" label={t("Payment Proof")} image={proof} onBusyChange={setUploading} onChoose={chooseFile} onRemove={() => setProof(null)} helper={t("Upload a clear bank transfer or e-wallet payment screenshot.")} />
            </div>
            {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{t(error)}</p>}
            <Button onClick={submitProof} disabled={uploading || methods.length === 0} className="mt-6">{t("Submit Payment Proof")}</Button>
          </div>
        )}

        {commission.paymentStatus === 'waiting-verification' && (
          <div className="rounded-[2rem] border border-sky-100 bg-sky-50 p-6">
            <h2 className="font-serif text-2xl text-sky-950">{t("Payment Submitted")}</h2>
            <p className="mt-3 text-sm leading-7 text-sky-900">{t("Payment proof has been submitted. The admin will verify it before the commission enters the work stage.")}</p>
          </div>
        )}
      </section>

      <aside className="rounded-[2rem] bg-emerald-950 p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-32">
        <p className="text-xs uppercase tracking-widest text-emerald-200">{t("Payment Summary")}</p>
        <h2 className="mt-3 font-serif text-2xl">{t(commission.mediaType === 'traditional' ? 'Traditional Art' : 'Digital Art')}</h2>
        <p className="mt-5 text-3xl font-semibold">{t(formatRupiah(commission.finalPrice || commission.estimatedPrice))}</p>
        <dl className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-emerald-100">{t("Style")}</dt><dd className="capitalize">{t(commission.artStyle)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-emerald-100">{t("Body")}</dt><dd className="capitalize">{t(commission.bodyCoverage)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-emerald-100">{t("Persons")}</dt><dd>{t(commission.personCount)}</dd></div>
        </dl>
        <Button to={`/commission/status/${commission.id}`} variant="light" className="mt-6 w-full">{t("View Progress")}</Button>
      </aside>
    </div>
  )
}

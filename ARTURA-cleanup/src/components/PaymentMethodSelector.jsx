import { useLanguage } from '../i18n/useLanguage.js'
import { getAvailablePaymentMethods } from '../utils/paymentMethods.js'

export default function PaymentMethodSelector({ paymentSettings, method, onChange, disabled = false }) {
  const { t } = useLanguage()

  const methods = getAvailablePaymentMethods(paymentSettings)

  function instructions() {
    if (method === 'bank') {
      return (
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-stone-500">{t("Bank")}</dt><dd className="mt-1 font-semibold">{paymentSettings.bank.bankName || '-'}</dd></div>
          <div><dt className="text-stone-500">{t("Account Number")}</dt><dd className="mt-1 font-semibold">{paymentSettings.bank.accountNumber || '-'}</dd></div>
          <div><dt className="text-stone-500">{t("Account Holder")}</dt><dd className="mt-1 font-semibold">{paymentSettings.bank.accountHolder || '-'}</dd></div>
        </dl>
      )
    }
    if (method === 'ewallet') {
      return (
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-stone-500">{t("E-Wallet")}</dt><dd className="mt-1 font-semibold">{paymentSettings.ewallet.provider || '-'}</dd></div>
          <div><dt className="text-stone-500">{t("Number")}</dt><dd className="mt-1 font-semibold">{paymentSettings.ewallet.number || '-'}</dd></div>
          <div><dt className="text-stone-500">{t("Account Holder")}</dt><dd className="mt-1 font-semibold">{paymentSettings.ewallet.accountHolder || '-'}</dd></div>
        </dl>
      )
    }
    if (method === 'qris') {
      return <img src={paymentSettings.qris.image} alt={t("QRIS ARTURA")} className="mx-auto max-h-72 rounded-2xl border bg-white object-contain p-2" />
    }
    return <p className="text-sm text-stone-500">{t("Select a payment method to view the payment destination details.")}</p>
  }

  return (
    <div>
      {methods.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {methods.map((item) => (
            <label key={item.value} className="cursor-pointer">
              <input
                type="radio"
                name="payment-method"
                value={item.value}
                checked={method === item.value}
                disabled={disabled}
                onChange={() => onChange(item.value)}
                className="peer sr-only"
              />
              <span className="block h-full rounded-2xl border border-stone-300 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm peer-checked:border-emerald-700 peer-checked:bg-emerald-50 peer-checked:ring-4 peer-checked:ring-emerald-100/70 peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
                <span className="block text-sm font-semibold text-stone-900">{t(item.label)}</span>
                <span className="mt-1 block text-xs text-stone-500">{t(item.detail)}</span>
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{t("No payment methods are currently active. The admin needs to enable Bank Transfer, E-Wallet, or QRIS in Settings.")}</div>
      )}

      <div className="mt-5 rounded-2xl bg-stone-50 p-5">
        <h3 className="font-semibold text-stone-900">{t("Payment Instructions")}</h3>
        <div className="mt-4">{t(instructions())}</div>
      </div>
    </div>
  )
}

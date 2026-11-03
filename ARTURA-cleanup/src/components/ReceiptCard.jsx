import { useLanguage } from '../i18n/useLanguage.js'
import StatusBadge from './StatusBadge.jsx'
import formatRupiah from '../utils/formatRupiah.js'

function instagramHref(handle) {
  const username = String(handle || '@artuhiro.__').replace(/^@/, '').trim()
  return `https://www.instagram.com/${username}/`
}

export default function ReceiptCard({
  title = 'ARTURA Receipt',
  id,
  date,
  customer,
  total,
  paymentStatus,
  rows = [],
  contactInstagram = '@artuhiro.__',
}) {
  const { t, locale } = useLanguage()

  return (
    <section className="receipt-card rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">{t("ARTURA")}</p>
          <h2 className="mt-2 font-serif text-2xl text-stone-950">{t(title)}</h2>
          <p className="mt-1 text-xs text-stone-500">{id}</p>
        </div>
        <div className="text-right text-xs text-stone-500">
          <p>{t(date ? new Date(date).toLocaleString(locale) : '-')}</p>
          <div className="mt-2 flex justify-end"><StatusBadge status={paymentStatus} /></div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{t("Customer")}</p>
          <p className="mt-2 font-semibold text-stone-900">{customer || '-'}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{t("Total")}</p>
          <p className="mt-2 font-serif text-2xl text-emerald-950">{t(formatRupiah(Number(total || 0)))}</p>
        </div>
      </div>

      {rows.length > 0 && (
        <dl className="mt-6 divide-y divide-stone-100 rounded-2xl bg-stone-50/80 px-4">
          {rows.filter((row) => row.value !== undefined && row.value !== null && row.value !== '').map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 py-3 text-sm">
              <dt className="text-stone-500">{t(row.label)}</dt>
              <dd className="text-right font-medium text-stone-800">{['Payment Method','Medium','Style','Body','Rendering','Work Status','Order Status','Status','Payment Status'].includes(row.label) ? t(row.value) : row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-950">
        <span className="font-semibold">{t("ARTURA Contact:")}</span>{' '}
        <a href={instagramHref(contactInstagram)} target="_blank" rel="noreferrer" className="font-semibold underline decoration-emerald-300 underline-offset-4">{t("Instagram ")}{contactInstagram}
        </a>
      </div>

      <div className="mt-6 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:border-emerald-900 hover:text-emerald-950"
        >{t("Print Receipt")}</button>
      </div>
    </section>
  )
}

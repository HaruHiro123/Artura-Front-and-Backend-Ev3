import { useLanguage } from '../i18n/useLanguage.js'
import useArturaData from '../hooks/useArturaData.js'
import { getCommissionQuote } from '../utils/commissionPricing.js'
import Button from './Button.jsx'
import formatRupiah from '../utils/formatRupiah.js'

export default function CommissionCard({ service, onSelect, selected = false }) {
  const { t } = useLanguage()
  const { pricing } = useArturaData()
  const quote = getCommissionQuote({ ...service.preset, ratio:'4:5',paperSize:'A5',orientation:'portrait' },pricing)

  return (
    <article className={`flex h-full flex-col rounded-2xl border bg-white p-6 ${selected ? 'border-emerald-700 ring-1 ring-emerald-700' : 'border-stone-200'}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{t("Custom artwork")}</p>
      <h3 className="mt-4 font-serif text-2xl text-stone-900">{t(service.title)}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-stone-600">{t(service.description)}</p>
      <p className="mt-6 text-xs text-stone-500">{t("Starting price")}</p>
      <p className="mt-1 text-xl font-semibold text-emerald-950">{t(formatRupiah(quote.total ?? service.startingPrice))}</p>
      <p className="mt-3 text-xs leading-6 text-stone-500">{t(service.note)}</p>
      {onSelect ? (
        <Button onClick={() => onSelect(service.id)} aria-pressed={selected} variant={selected ? 'primary' : 'secondary'} className="mt-5 w-full">{t(selected ? 'Service Selected' : 'Select Service')}</Button>
      ) : (
        <Button to={`/commission?service=${service.id}`} variant="secondary" className="mt-5 w-full">{t("Customize Service")}</Button>
      )}
    </article>
  )
}

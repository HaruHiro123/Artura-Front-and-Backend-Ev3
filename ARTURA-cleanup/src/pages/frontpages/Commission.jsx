import { useLanguage } from '../../i18n/useLanguage.js'
import { useSearchParams } from 'react-router-dom'
import CommissionCard from '../../components/CommissionCard.jsx'
import CommissionConfigurator from '../../components/CommissionConfigurator.jsx'
import commissions from '../../data/commissions.js'
import useArturaData from '../../hooks/useArturaData.js'

export default function Commission() {
  const { t } = useLanguage()

  const { artist } = useArturaData()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedService = commissions.find((service) => service.id === searchParams.get('service')) || commissions[0]
  function selectService(id) { setSearchParams({ service: id }); setTimeout(() => document.getElementById('customize')?.scrollIntoView({ behavior: 'smooth' }), 0) }

  return <div className="space-y-12"><header className="max-w-3xl"><div className="flex flex-wrap items-center gap-3"><p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Custom Art Commission")}</p><span className={`rounded-full px-3 py-1 text-xs font-semibold ${artist.commissionOpen ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-800'}`}>{t(artist.commissionOpen ? 'Open' : 'Closed')}</span></div><h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{t("A personal story, captured in art.")}</h1><p className="mt-5 leading-8 text-stone-600">{t("Choose a service as your starting point, then customize the medium, style, body coverage, rendering, references, and other details.")}</p></header><section><h2 className="mb-6 font-serif text-2xl">{t("Service Options")}</h2><div className="grid gap-6 sm:grid-cols-2">{commissions.map((service) => <CommissionCard key={service.id} service={service} selected={selectedService.id === service.id} onSelect={selectService} />)}</div></section><section id="customize" className="scroll-mt-48"><p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{t("Your creative direction")}</p><h2 className="mt-3 font-serif text-3xl">{t(selectedService.title)}</h2><div className="mt-7"><CommissionConfigurator key={selectedService.id} service={selectedService} /></div></section></div>
}

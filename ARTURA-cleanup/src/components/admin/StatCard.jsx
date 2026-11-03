import { useLanguage } from '../../i18n/useLanguage.js'
export default function StatCard({ label, value, helper }) {
  const { t } = useLanguage()

  return <article className="rounded-2xl border border-stone-200 bg-white p-5"><p className="text-sm text-stone-500">{t(label)}</p><p className="mt-2 text-3xl font-semibold text-emerald-950">{t(value)}</p>{helper && <p className="mt-2 text-xs text-stone-500">{t(helper)}</p>}</article>
}

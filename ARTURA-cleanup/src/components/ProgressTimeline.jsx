import { useLanguage } from '../i18n/useLanguage.js'
export default function ProgressTimeline({ steps, currentStatus }) {
  const { t } = useLanguage()

  const currentIndex = steps.findIndex((step) => step.value === currentStatus)

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const complete = currentIndex >= 0 && index < currentIndex
        const active = step.value === currentStatus
        return (
          <li key={step.value} className="relative flex gap-4 pb-7 last:pb-0">
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px ${complete ? 'bg-emerald-700' : 'bg-stone-200'}`}
              />
            )}
            <span
              className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                complete
                  ? 'border-emerald-800 bg-emerald-900 text-white'
                  : active
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-100'
                    : 'border-stone-200 bg-white text-stone-400'
              }`}
            >
              {complete ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <div className="min-w-0 pt-1">
              <p className={`text-sm font-semibold ${active || complete ? 'text-stone-900' : 'text-stone-500'}`}>{t(step.label)}</p>
              {step.description && <p className="mt-1 text-xs leading-5 text-stone-500">{t(step.description)}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

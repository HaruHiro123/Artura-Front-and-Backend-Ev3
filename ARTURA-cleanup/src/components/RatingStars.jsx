import { useLanguage } from '../i18n/useLanguage.js'
function StarIcon({ filled = true, className = 'h-4 w-4' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="M12 3.8L14.47 8.8L20 9.6L16 13.5L16.94 19L12 16.4L7.06 19L8 13.5L4 9.6L9.53 8.8L12 3.8Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function RatingStars({ value = 0, outOf = 5, showValue = false, className = '' }) {
  const { t } = useLanguage()

  const safeValue = Math.max(0, Math.min(outOf, Number(value) || 0))
  const filledCount = Math.round(safeValue)

  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${safeValue} / ${outOf}`}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: outOf }, (_, index) => (
          <StarIcon key={index} filled={index < filledCount} />
        ))}
      </span>
      {showValue && <span className="ml-1 font-semibold">{t(safeValue.toFixed(1))} / {t(outOf)}</span>}
    </span>
  )
}

export { StarIcon }

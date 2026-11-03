import { useLanguage } from '../i18n/useLanguage.js'
import { Link } from 'react-router-dom'

export default function Button({
  children, to, href, variant = 'primary', className = '',
  disabled = false, type = 'button', ...props
}) {
  const { t } = useLanguage()

  const variants = {
    primary: 'bg-emerald-950 text-white hover:bg-emerald-800',
    secondary: 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-100',
    light: 'bg-white text-emerald-950 hover:bg-emerald-100',
  }
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`

  if (disabled) {
    return <button type="button" disabled className={classes} {...props}>{t(children)}</button>
  }
  if (to) return <Link to={to} className={classes} {...props}>{t(children)}</Link>
  if (href) return <a href={href} className={classes} {...props}>{t(children)}</a>
  return <button type={type} className={classes} {...props}>{t(children)}</button>
}

import { useLanguage } from '../i18n/useLanguage.js'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { t, locale } = useLanguage()

  const formattedPrice = product.price.toLocaleString(locale, {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
    <div className="aspect-square overflow-hidden bg-stone-100 p-4">
    <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="h-full w-full object-contain"
    />
    </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          {t(product.category)}
        </p>

        <h3 className="mt-2 text-lg font-semibold text-stone-900">
          {product.name}
        </h3>

        <p className="mt-2 text-lg font-bold text-emerald-800">
          {t(formattedPrice)}
        </p>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
          {t(product.description)}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="mt-5 rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >{t("View Details")}</Link>
      </div>
    </article>
  )
}
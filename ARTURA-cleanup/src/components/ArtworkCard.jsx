import { useLanguage } from '../i18n/useLanguage.js'
import useCart from '../hooks/useCart.js'
import Button from './Button.jsx'
import StatusBadge from './StatusBadge.jsx'
import formatRupiah from '../utils/formatRupiah.js'

export default function ArtworkCard({ artwork, enableDetails = true }) {
  const { t } = useLanguage()

  const { addToCart, isInCart } = useCart()
  const isShop = artwork.collectionType === 'shop'
  const added = isInCart(artwork.id)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/45 bg-white/62 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
      <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-stone-100/80 p-4 sm:p-5">
        <img src={artwork.image} alt={artwork.title} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex min-h-7 flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">{t(artwork.medium || artwork.categoryName)}</p>
          {isShop ? <StatusBadge status={artwork.status} /> : <StatusBadge status="portfolio" />}
        </div>
        <h3 className="mt-4 min-h-16 line-clamp-2 font-serif text-2xl leading-8 text-stone-900">{artwork.title}</h3>
        <p className="mt-2 text-xs uppercase tracking-wide text-stone-500">{t(artwork.categoryName || artwork.category)}</p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-stone-600">{t(artwork.description)}</p>

        {isShop ? (
          <p className="mt-4 min-h-6 text-sm font-semibold text-emerald-950">
            {t(artwork.status === 'sold' ? 'Artwork sold' : formatRupiah(Number(artwork.price)))}
          </p>
        ) : (
          <p className="mt-4 min-h-6 text-sm font-semibold text-emerald-950">{t("Portfolio Collection")}</p>
        )}

        {isShop && artwork.status === 'available' && Number(artwork.price) > 0 && (
          <Button className="mt-5 w-full" disabled={added} onClick={() => addToCart(artwork.id)}>
            {t(added ? 'Already in Cart' : 'Add to Cart')}
          </Button>
        )}
        {isShop && artwork.status === 'sold' && <Button disabled className="mt-5 w-full">{t("Sold")}</Button>}
        {enableDetails && (
          <Button to={`/artwork/${artwork.slug}`} variant="secondary" className="mt-3 w-full">
            {t(isShop ? 'View Details' : 'View Artwork')}
          </Button>
        )}
      </div>
    </article>
  )
}

import { useLanguage } from '../../i18n/useLanguage.js'
import { Link, useSearchParams } from 'react-router-dom'
import ArtworkCard from '../../components/ArtworkCard.jsx'
import artworks from '../../data/catalog.js'

const categories = [
  { value: 'all', label: 'All Works' },
  { value: 'digital', label: 'Digital' },
  { value: 'traditional', label: 'Traditional' },
]

export default function Artworks() {
  const { t } = useLanguage()

  const [searchParams] = useSearchParams()
  const requestedCategory = searchParams.get('medium') || 'all'
  const category = categories.some((item) => item.value === requestedCategory)
    ? requestedCategory : 'all'
  const visibleArtworks = category === 'all'
    ? artworks : artworks.filter((artwork) => artwork.category === category)

  return (
    <div>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("The Artura collection")}</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 sm:text-5xl">{t("Every artwork tells a story.")}</h1>
        <p className="mt-5 leading-8 text-stone-600">{t("From colorful digital characters to pencil textures on paper. Explore the full collection and discover the details that catch your attention.")}</p>
      </header>
      <div className="my-8 flex flex-col gap-5 border-y border-stone-200 py-5 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label={t("Filter artwork medium")} className="flex flex-wrap gap-2">
          {categories.map((item) => {
            const count = item.value === 'all' ? artworks.length : artworks.filter((artwork) => artwork.category === item.value).length
            const active = category === item.value
            return (
              <Link
                key={item.value}
                to={item.value === 'all' ? '/artworks' : `/artworks?medium=${item.value}`}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 ${active ? 'bg-emerald-950 text-white' : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100'}`}
              >
                {t(item.label)} <span className="ml-1 opacity-70">({t(count)})</span>
              </Link>
            )
          })}
        </nav>
        <p role="status" className="text-sm text-stone-500">{t("Showing ")}{t(visibleArtworks.length)}{t(" artworks")}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  )
}

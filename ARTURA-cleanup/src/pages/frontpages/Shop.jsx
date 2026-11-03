import { useLanguage } from '../../i18n/useLanguage.js'
import ArtworkCard from '../../components/ArtworkCard.jsx'
import useArturaData from '../../hooks/useArturaData.js'

export default function Shop() {
  const { t } = useLanguage()

  const { artworks } = useArturaData()
  const shop = artworks.filter((artwork) => artwork.collectionType === 'shop')

  return (
    <div>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Original Artwork Shop")}</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 sm:text-5xl">{t("Art Shop")}</h1>
        <p className="mt-5 leading-8 text-stone-600">{t("Original artwork available for purchase. Available artwork can be added to the Cart and continued to Checkout.")}</p>
      </header>
      <div className="my-8 border-y border-stone-200 py-5 text-sm text-stone-500">{t(shop.length)}{t(" artworks in the Art Shop")}</div>
      {shop.length === 0 ? <p className="rounded-2xl bg-white p-6 text-stone-600">{t("No artwork is currently for sale.")}</p> : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shop.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}
        </div>
      )}
    </div>
  )
}

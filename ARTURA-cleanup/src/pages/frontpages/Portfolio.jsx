import { useLanguage } from '../../i18n/useLanguage.js'
import { useMemo, useState } from 'react'
import ArtworkCard from '../../components/ArtworkCard.jsx'
import useArturaData from '../../hooks/useArturaData.js'

export default function Portfolio() {
  const { t } = useLanguage()

  const { artworks } = useArturaData()
  const [medium, setMedium] = useState('all')
  const portfolio = useMemo(() => artworks.filter((artwork) => artwork.collectionType === 'portfolio'), [artworks])
  const visible = medium === 'all' ? portfolio : portfolio.filter((artwork) => artwork.category === medium)

  return (
    <div>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Personal Art Gallery")}</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 sm:text-5xl">{t("Portfolio")}</h1>
        <p className="mt-5 leading-8 text-stone-600">{t("A collection of works presented as a showcase. Artwork on this page is not for sale and cannot be added to the cart.")}</p>
      </header>
      <div className="my-8 flex flex-wrap gap-2 border-y border-stone-200 py-5">
        {[
          ['all', 'All Works'], ['digital', 'Digital'], ['traditional', 'Traditional'],
        ].map(([value, label]) => (
          <button key={value} type="button" onClick={() => setMedium(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${medium === value ? 'bg-emerald-950 text-white' : 'border border-stone-300 bg-white text-stone-700'}`}>{t(label)}</button>
        ))}
      </div>
      {visible.length === 0 ? <p className="rounded-2xl bg-white p-6 text-stone-600">{t("There are no works in this category yet.")}</p> : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}
        </div>
      )}
    </div>
  )
}

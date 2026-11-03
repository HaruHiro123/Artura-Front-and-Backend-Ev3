import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import useCart from '../../hooks/useCart.js'
import useArturaData from '../../hooks/useArturaData.js'
import Button from '../../components/Button.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import ArtworkCard from '../../components/ArtworkCard.jsx'
import RatingStars, { StarIcon } from '../../components/RatingStars.jsx'
import formatRupiah from '../../utils/formatRupiah.js'

export default function ArtworkDetail() {
  const { t } = useLanguage()

  const { slug } = useParams()
  const { artworks } = useArturaData()
  const artwork = artworks.find((item) => item.slug === slug)

  if (!artwork) {
    return (
      <section className="rounded-3xl border border-stone-200 bg-white p-8 text-center">
        <h1 className="font-serif text-3xl">{t("Artwork not found")}</h1>
        <p className="mt-4 leading-7 text-stone-600">{t("The artwork address may be incorrect.")}</p>
        <Button to="/portfolio" className="mt-6">{t("Back")}</Button>
      </section>
    )
  }

  return <ArtworkDetailContent key={artwork.id} artwork={artwork} />
}

function ArtworkDetailContent({ artwork }) {
  const { t } = useLanguage()

  const { artworks, reviews, addReview } = useArturaData()
  const { addToCart, isInCart } = useCart()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const isShop = artwork.collectionType === 'shop'
  const added = isInCart(artwork.id)
  const artworkReviews = reviews.filter((item) => item.artworkId === artwork.id)
  const averageRating = artworkReviews.length ? artworkReviews.reduce((total, item) => total + item.rating, 0) / artworkReviews.length : 0

  function handleSubmit(event) {
    event.preventDefault()
    const text = review.trim()
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return setFeedback({ type: 'error', message: 'Select a rating from 1 to 5.' })
    if (!text) return setFeedback({ type: 'error', message: 'Write a review first.' })
    if (!addReview({ artworkId: artwork.id, artworkTitle: artwork.title, rating, text })) return
    setRating(0)
    setReview('')
    setFeedback({ type: 'success', message: 'Review added successfully.' })
  }

  const relatedArtworks = artworks.filter((item) => item.collectionType === artwork.collectionType && item.id !== artwork.id).slice(0, 3)

  return (
    <div className="space-y-12">
      <Button to={isShop ? '/shop' : '/portfolio'} variant="secondary"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 6L9 12L15 18" strokeLinecap="round" strokeLinejoin="round" /></svg>{t("Back to ")}{t(isShop ? 'Shop' : 'Portfolio')}</Button>
      <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <figure className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 p-5 sm:p-8">
          <div className="flex aspect-[4/5] items-center justify-center"><img src={artwork.image} alt={artwork.title} className="h-full w-full object-contain" /></div>
          <figcaption className="mt-5 text-center text-sm text-stone-500">{artwork.title} · {t(artwork.medium || artwork.categoryName)}</figcaption>
        </figure>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t(artwork.medium || artwork.categoryName)}</p>
            <StatusBadge status={isShop ? artwork.status : 'portfolio'} />
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">{artwork.title}</h1>
          {isShop && <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-stone-500">{artworkReviews.length ? <RatingStars value={averageRating} showValue /> : <span>{t("No ratings yet")}</span>}<span>·</span><span>{t(artworkReviews.length)}{t(" review")}</span></div>}
          <div className="mt-7 border-t border-stone-200 pt-6"><h2 className="font-semibold">{t("About the Artwork")}</h2><p className="mt-3 leading-8 text-stone-600">{t(artwork.description)}</p></div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Category")}</dt><dd className="font-medium">{t(artwork.categoryName || artwork.category)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Medium")}</dt><dd className="font-medium">{t(artwork.medium || artwork.categoryName)}</dd></div>
            {artwork.year && <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Year")}</dt><dd className="font-medium">{t(artwork.year)}</dd></div>}
            {artwork.technique && <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Technique")}</dt><dd className="text-right font-medium">{t(artwork.technique)}</dd></div>}
          </dl>

          <div className="mt-7 border-t border-stone-200 pt-6">
            {!isShop ? (
              <div className="rounded-2xl bg-stone-50 p-5"><p className="font-semibold text-emerald-950">{t("Portfolio Artwork")}</p><p className="mt-2 text-sm leading-7 text-stone-600">{t("This artwork is displayed as a showcase and is not available for purchase.")}</p></div>
            ) : artwork.status === 'available' ? (
              <><p className="text-2xl font-semibold text-emerald-950">{t(formatRupiah(Number(artwork.price)))}</p><Button onClick={() => addToCart(artwork.id)} disabled={added} className="mt-5 w-full">{t(added ? 'Already in Cart' : 'Add to Cart')}</Button></>
            ) : (
              <><Button disabled className="w-full">{t("Sold")}</Button><p className="mt-3 text-sm text-stone-600">{t("Artwork sold.")}</p></>
            )}
            <Button to="/commission" variant="secondary" className="mt-4 w-full">{t("Custom Commission")}</Button>
          </div>
        </div>
      </section>

      {isShop && (
        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{t("Your impression")}</p><h2 className="mt-2 font-serif text-3xl">{t("Rating & Review")}</h2></div><div className="rounded-2xl bg-amber-50 px-5 py-3">{artworkReviews.length ? <RatingStars value={averageRating} showValue className="text-amber-900" /> : <p className="font-semibold text-amber-900">{t("No ratings yet")}</p>}<p className="mt-1 text-xs text-stone-600">{t(artworkReviews.length)}{t(" review")}</p></div></div>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <fieldset><legend className="text-sm font-semibold">{t("Your Rating")}</legend><div className="mt-3 flex flex-wrap gap-2">{[1,2,3,4,5].map((value) => <label key={value} className="cursor-pointer"><input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} className="peer sr-only" /><span className="inline-flex min-h-11 min-w-14 items-center justify-center gap-1.5 rounded-xl border border-stone-300 px-3 text-sm peer-checked:border-amber-500 peer-checked:bg-amber-100"><span>{t(value)}</span><StarIcon className="h-4 w-4" /></span></label>)}</div></fieldset>
              <div><label htmlFor="review-text" className="block text-sm font-semibold">{t("Your Review")}</label><textarea id="review-text" value={review} onChange={(event) => setReview(event.target.value)} rows={5} maxLength={1000} className="mt-3 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 leading-7 focus:outline-2 focus:outline-emerald-700" placeholder={t("What stood out to you about this artwork?")} /></div>
              {feedback.message && <p className={`rounded-xl px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-900'}`}>{t(feedback.message)}</p>}
              <Button type="submit">{t("Submit Review")}</Button>
            </form>
            <div><h3 className="font-semibold">{t("Latest reviews")}</h3>{artworkReviews.length === 0 ? <p className="mt-4 rounded-2xl bg-stone-50 p-5 text-sm text-stone-600">{t("No reviews yet.")}</p> : <div className="mt-4 space-y-3">{artworkReviews.map((item) => <article key={item.id} className="rounded-2xl bg-stone-50 p-5"><RatingStars value={item.rating} className="text-amber-900" /><p className="mt-2 text-sm leading-7 text-stone-700">{item.text}</p></article>)}</div>}</div>
          </div>
        </section>
      )}

      {relatedArtworks.length > 0 && <section><h2 className="font-serif text-3xl">{t("More Artworks")}</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{relatedArtworks.map((item) => <ArtworkCard key={item.id} artwork={item} />)}</div></section>}
    </div>
  )
}

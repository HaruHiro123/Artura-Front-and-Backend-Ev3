import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import useArturaData from '../../hooks/useArturaData.js'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import RatingStars from '../../components/RatingStars.jsx'

export default function AdminReviews() {
  const { t, locale } = useLanguage()

  const { reviews, deleteReview } = useArturaData()
  const [pending, setPending] = useState(null)

  return (
    <div>
      <h1 className="font-serif text-4xl">{t("Review Management")}</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="bg-stone-100">
            <tr>
              <th className="px-4 py-3">{t("Artwork")}</th>
              <th className="px-4 py-3">{t("Rating")}</th>
              <th className="px-4 py-3">{t("Review")}</th>
              <th className="px-4 py-3">{t("Date")}</th>
              <th className="px-4 py-3">{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3 font-semibold">{t(item.artworkTitle)}</td>
                <td className="px-4 py-3"><RatingStars value={item.rating} className="text-amber-800" /></td>
                <td className="max-w-md px-4 py-3">{item.text}</td>
                <td className="px-4 py-3">{t(new Date(item.createdAt).toLocaleDateString(locale))}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => setPending(item)} className="font-semibold text-red-700">{t("Delete")}</button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-stone-500">{t("No reviews yet.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={Boolean(pending)}
        title={t("Delete Review")}
        message={t("Delete this review?")}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          deleteReview(pending.id)
          setPending(null)
        }}
      />
    </div>
  )
}

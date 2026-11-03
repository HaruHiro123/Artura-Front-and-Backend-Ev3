import { useLanguage } from '../../i18n/useLanguage.js'
import Button from '../../components/Button.jsx'
import useArturaData from '../../hooks/useArturaData.js'

function ArturaLineAccent({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 88C35 52 60 31 88 31C111 31 126 45 124 61C122 76 107 84 91 80C74 76 67 60 74 47C82 31 103 22 126 25"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M112 91C129 82 146 77 166 78"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M21 103C40 99 53 99 67 101"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArtworkGalleryPanel({ artworks }) {
  const { t } = useLanguage()

  const gallery = artworks.filter((artwork) => artwork?.image).slice(0, 4)

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-emerald-950 via-[#003f35] to-emerald-900 p-5 shadow-[0_22px_70px_rgba(0,50,40,0.18)] sm:p-6">
      <ArturaLineAccent className="pointer-events-none absolute -right-8 -top-5 h-36 w-48 text-emerald-300/20" />
      <ArturaLineAccent className="pointer-events-none absolute -bottom-10 -left-12 h-40 w-52 rotate-180 text-white/10" />
      <div className="pointer-events-none absolute left-10 top-10 h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">{t("Selected Works")}</p>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">{t("ARTURA Artist Space")}</h2>
          </div>
          <p className="hidden rounded-full border border-white/10 bg-white/10 px-3 py-1 text-right text-[11px] leading-5 text-emerald-100/80 backdrop-blur sm:block">{t("Digital")}<br />{t("Traditional")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {gallery.map((artwork) => (
            <article
              key={artwork.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-sm backdrop-blur-md"
            >
              <div className="aspect-[4/5] overflow-hidden bg-white/5 p-2">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="h-full w-full rounded-xl object-contain"
                />
              </div>
              <div className="border-t border-white/10 px-3 py-3">
                <p className="line-clamp-1 text-sm font-semibold text-white">
                  {artwork.title}
                </p>
                <p className="mt-1 text-xs text-emerald-100/70">
                  {t(artwork.medium || artwork.categoryName || 'Artwork')}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
          <p className="max-w-sm text-sm leading-6 text-emerald-50/85">{t("A personal collection of character studies, portraits, expressive sketches, and selected visual experiments.")}</p>
          <span className="hidden font-serif text-3xl text-emerald-200/80 sm:block">{t("A.")}</span>
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const { t } = useLanguage()

  const { artist, artworks } = useArturaData()

  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
      <ArtworkGalleryPanel artworks={artworks} />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-white/55 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-10">
        <ArturaLineAccent className="pointer-events-none absolute -bottom-8 -right-10 h-32 w-44 text-emerald-900/6" />

        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800">{t("About the Artist")}</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
            {artist.name}
          </h1>
          <p className="mt-6 max-w-xl leading-8 text-stone-600">
            {t(artist.bio)}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/60 bg-white/55 px-4 py-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{t("Focus")}</p>
              <p className="mt-2 text-sm leading-6 text-stone-800">{t("Portrait, character, and expressive artwork")}</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/55 px-4 py-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{t("Medium")}</p>
              <p className="mt-2 text-sm leading-6 text-stone-800">{t("Digital and traditional art")}</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/55 px-4 py-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{t("Commission")}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-900">
                {t(artist.commissionOpen ? 'Open' : 'Closed')}
              </p>
            </div>
          </div>

          {(artist.instagram || artist.email) && (
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
              {artist.instagram && <p>{t("Instagram: ")}{artist.instagram}</p>}
              {artist.email && <p>{t("Email: ")}{artist.email}</p>}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/portfolio">{t("View Portfolio")}</Button>
            <Button to="/commission" variant="secondary">{t("Commission Me")}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

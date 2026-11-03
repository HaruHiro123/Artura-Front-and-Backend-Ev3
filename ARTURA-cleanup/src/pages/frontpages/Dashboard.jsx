import { useLanguage } from '../../i18n/useLanguage.js'
import ArtworkCard from '../../components/ArtworkCard.jsx'
import CommissionCard from '../../components/CommissionCard.jsx'
import Button from '../../components/Button.jsx'
import useArturaData from '../../hooks/useArturaData.js'
import commissions from '../../data/commissions.js'
import omniVideo from '../../assets/Omni.mp4'

function ArtisticArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 20"
      className="h-4 w-7 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 14.5C8.5 14.5 13.6 12.8 18.1 9.6C20.2 8.1 22 6.3 23.8 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19.1 4.2H24V9.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 17.2C7.3 17.4 9.7 17.1 12 16.3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

export default function Dashboard() {
  const { t } = useLanguage()

  const { artworks, siteSettings } = useArturaData()
  const featuredArtworks = artworks.filter((artwork) => artwork.featured).slice(0, 6)
  const portfolioCount = artworks.filter((item) => item.collectionType === 'portfolio').length
  const shopCount = artworks.filter((item) => item.collectionType === 'shop').length

  return (
    <div className="space-y-16 sm:space-y-24">
      <section className="relative overflow-hidden rounded-[2rem] border border-emerald-900/15 bg-gradient-to-br from-emerald-950 via-[#003f35] to-emerald-900 px-6 py-8 text-white shadow-[0_24px_80px_rgba(0,50,40,0.18)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(167,243,208,0.08),transparent_26%)]" />
        <div className="pointer-events-none absolute -left-20 top-8 h-52 w-52 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="pointer-events-none absolute right-14 top-8 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">{t("Personal Art Gallery, Art Shop & Commission")}</p>

            <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.12] sm:text-5xl lg:text-[3.5rem]">
              {t(siteSettings.heroTagline)}
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-emerald-50/82 sm:text-base sm:leading-8">{t("Explore the portfolio, discover available original artwork, or bring your personal idea to life through a custom commission.")}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                to="/portfolio"
                variant="light"
                className="group"
              >
                <span>{t("Explore My Art")}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  <ArtisticArrow />
                </span>
              </Button>

              <Button
                to="/shop"
                variant="secondary"
                className="border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/18 hover:text-white"
              >{t("Visit Art Shop")}</Button>

              <Button
                to="/commission"
                variant="secondary"
                className="border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/18 hover:text-white"
              >{t("Commission Me")}</Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/12 pt-6 text-xs tracking-wide text-emerald-100/85">
              <span>{t(portfolioCount)}{t(" Portfolio")}</span>
              <span>{t(shopCount)}{t(" Shop Artwork")}</span>
              <span>{t("Digital & Traditional")}</span>
            </div>
          </div>

          <figure className="mx-auto w-full max-w-[19rem] sm:max-w-[21rem] lg:max-w-[22rem]">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-3 shadow-[0_18px_60px_rgba(0,25,20,0.30)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.3rem] bg-black/15">
                <video
                  src={omniVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  className="block w-full object-contain"
                  style={{ aspectRatio: '9 / 16' }}
                />
              </div>
            </div>

            <figcaption className="mt-4 text-center text-xs leading-6 text-emerald-100/78">{t("From a single stroke, a story comes to life.")}</figcaption>
          </figure>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/40 bg-white/55 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Selected works")}</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">{t("Featured Artworks")}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/40 bg-white/55 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Made for your story")}</p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-emerald-950 sm:text-4xl">{t("Your idea, brought to life as a personal artwork.")}</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {commissions.map((service) => (
            <CommissionCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-8">
          <Button to="/commission">{t("Explore Commissions")}</Button>
        </div>
      </section>
    </div>
  )
}

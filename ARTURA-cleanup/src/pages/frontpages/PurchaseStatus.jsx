import { useLanguage } from '../../i18n/useLanguage.js'
import { useMemo, useState } from 'react'
import Button from '../../components/Button.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import useArturaData from '../../hooks/useArturaData.js'
import formatRupiah from '../../utils/formatRupiah.js'

function instagramHref(handle) {
  const username = String(handle || '@artuhiro.__').replace(/^@/, '').trim()
  return `https://www.instagram.com/${username}/`
}

function formatDate(value, locale) {
  if (!value) return '-'
  return new Date(value).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function PurchaseStatus() {
  const { t, locale } = useLanguage()

  const { orders, commissions, artist } = useArturaData()
  const [query, setQuery] = useState('')
  const instagram = artist.instagram || '@artuhiro.__'

  const history = useMemo(() => {
    const shopOrders = orders.map((order) => ({
      id: order.id,
      type: 'shop',
      typeLabel: 'Artwork Purchase',
      customer: order.customer?.name || '-',
      total: Number(order.total || 0),
      paymentStatus: order.paymentStatus,
      progressStatus: order.orderStatus,
      createdAt: order.createdAt,
      href: `/order/${order.id}`,
      description: order.items?.map((item) => item.title).join(', ') || 'Artwork order',
    }))

    const commissionOrders = commissions.map((item) => ({
      id: item.id,
      type: 'commission',
      typeLabel: 'Art Commission',
      customer: item.client?.name || '-',
      total: Number(item.finalPrice || item.estimatedPrice || 0),
      paymentStatus: item.paymentStatus,
      progressStatus: item.status,
      createdAt: item.createdAt,
      href: `/commission/status/${item.id}`,
      description: `${item.mediaType === 'traditional' ? 'Traditional' : 'Digital'} ${item.artStyle || ''}`.trim(),
    }))

    return [...shopOrders, ...commissionOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, commissions])

  const filtered = history.filter((item) => {
    const keyword = query.toLowerCase().trim()
    if (!keyword) return true
    return [item.id, item.customer, item.typeLabel, item.description].some((value) => String(value).toLowerCase().includes(keyword))
  })

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_330px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">{t("Customer Area")}</p>
            <h1 className="mt-3 font-serif text-4xl text-stone-950 sm:text-5xl">{t("Purchase Status")}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">{t("View payment status, work progress, delivery, and receipts for artwork purchases and custom commissions stored in this browser.")}</p>
          </div>
          <label>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">{t("Search ID or name")}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Example: ART-... or COM-...")}
              className="mt-2 w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-sm outline-none backdrop-blur focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-5">
        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-white/60 bg-white/70 p-8 text-center backdrop-blur-xl">
            <h2 className="font-serif text-2xl">{t("No purchase history found")}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{t("Orders and commissions created from this browser will appear on this page.")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3"><Button to="/shop">{t("Visit Shop")}</Button><Button to="/commission" variant="secondary">{t("Open Commission")}</Button></div>
          </div>
        ) : (
          filtered.map((item) => (
            <article key={`${item.type}-${item.id}`} className="artura-reveal rounded-[2rem] border border-white/60 bg-white/72 p-6 shadow-sm backdrop-blur-xl sm:p-7">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">{t(item.typeLabel)}</span>
                    <span className="text-xs text-stone-500">{t(formatDate(item.createdAt, locale))}</span>
                  </div>
                  <h2 className="mt-3 font-serif text-2xl text-stone-950">{item.id}</h2>
                  <p className="mt-2 text-sm font-medium text-stone-700">{item.type === 'shop' ? item.description : t(item.description)}</p>
                  <p className="mt-1 text-sm text-stone-500">{t("Customer: ")}{item.customer}</p>
                </div>

                <div className="lg:text-right">
                  <p className="font-serif text-2xl text-emerald-950">{t(formatRupiah(item.total))}</p>
                  <div className="mt-3 flex flex-wrap gap-2 lg:justify-end">
                    <StatusBadge status={item.paymentStatus} />
                    <StatusBadge status={item.progressStatus} />
                  </div>
                  <Button to={item.href} className="mt-4">{t("View Receipt & Progress")}</Button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="rounded-[2rem] bg-emerald-950 p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">{t("Need Help?")}</p>
            <h2 className="mt-3 font-serif text-3xl">{t("Contact ARTURA")}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80">{t("If you have questions about payment, work progress, or delivery, include the order/commission ID so it can be checked more easily.")}</p>
          </div>
          <a
            href={instagramHref(instagram)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >{t("Instagram ")}{t(instagram)}
          </a>
        </div>
      </section>
    </div>
  )
}

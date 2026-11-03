import { useLanguage } from '../../i18n/useLanguage.js'
import { Link } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import useCart from '../../hooks/useCart.js'
import formatRupiah from '../../utils/formatRupiah.js'

export default function Cart() {
  const { t } = useLanguage()

  const { cartItems, totalQty, totalPrice, removeFromCart, clearCart } = useCart()

  if (totalQty === 0) return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-stone-200 bg-white p-8 text-center sm:p-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{t("Your selection")}</p><h1 className="mt-4 font-serif text-3xl sm:text-4xl">{t("Your cart is still empty.")}</h1><p className="mt-5 leading-8 text-stone-600">{t("Choose an Available artwork from the Art Shop.")}</p><Button to="/shop" className="mt-7">{t("Explore Art Shop")}</Button>
    </section>
  )

  return (
    <div><p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Your selection")}</p><h1 className="mt-3 font-serif text-4xl">{t("Cart")}</h1><p className="mt-4 leading-7 text-stone-600">{t(totalQty)}{t(" artwork selected. Original artwork is limited to one item.")}</p>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">{cartItems.map((artwork) => <article key={artwork.id} className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 sm:flex-row"><div className="flex h-36 w-full items-center justify-center rounded-xl bg-stone-100 sm:w-28"><img src={artwork.image} alt={artwork.title} className="h-full w-full object-contain" /></div><div className="min-w-0 flex-1"><p className="text-xs text-emerald-700">{t(artwork.medium)}</p><h2 className="mt-2 font-serif text-2xl"><Link to={`/artwork/${artwork.slug}`} className="hover:underline">{artwork.title}</Link></h2><p className="mt-2 text-sm text-stone-600">{t(formatRupiah(Number(artwork.price)))}</p><button type="button" onClick={() => removeFromCart(artwork.id)} className="mt-4 text-sm font-semibold text-red-700 underline underline-offset-4">{t("Remove")}</button></div><div className="sm:text-right"><p className="text-xs text-stone-500">{t("Subtotal")}</p><p className="mt-2 font-semibold text-emerald-950">{t(formatRupiah(Number(artwork.price)))}</p></div></article>)}<Button variant="secondary" onClick={clearCart}>{t("Clear Cart")}</Button></section>
        <aside className="rounded-3xl bg-emerald-950 p-7 text-white"><h2 className="font-serif text-2xl">{t("Order Summary")}</h2><div className="mt-6 flex justify-between text-sm"><span>{t("Artwork Count")}</span><span>{t(totalQty)}</span></div><div className="mt-5 flex justify-between gap-3 border-t border-white/20 pt-5"><span>{t("Total")}</span><strong className="text-2xl">{t(formatRupiah(totalPrice))}</strong></div><Button to="/checkout" variant="light" className="mt-6 w-full">{t("Checkout")}</Button><Button to="/shop" variant="secondary" className="mt-3 w-full">{t("Continue Shopping")}</Button></aside>
      </div>
    </div>
  )
}

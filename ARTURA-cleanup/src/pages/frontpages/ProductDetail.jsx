import { useLanguage } from '../../i18n/useLanguage.js'
import { Link, useParams } from 'react-router-dom'
import products from '../../data/products.js'

export default function ProductDetail() {
  const { t, locale } = useLanguage()

  const { id } = useParams()

  const product = products.find(
    (item) => item.id === Number(id)
  )

  if (!product) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-stone-900">{t("Product not found")}</h1>

        <p className="mt-3 text-stone-600">{t("The product you are looking for is not available in the catalog yet.")}</p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
        >{t("Back to Home")}</Link>
      </section>
    )
  }

  const formattedPrice = product.price.toLocaleString(locale, {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })

  return (
    <div>
      <Link
        to="/"
        className="inline-block rounded text-sm font-medium text-emerald-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
      >{t("Back to catalog")}</Link>

      <section className="mt-6 grid gap-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
      <div className="aspect-square overflow-hidden rounded-2xl bg-stone-100 p-6">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            {t(product.category)}
          </p>

          <h1 className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-bold text-emerald-800">
            {t(formattedPrice)}
          </p>

          <div className="mt-6 border-t border-stone-200 pt-6">
            <h2 className="font-semibold text-stone-900">{t("About the product")}</h2>

            <p className="mt-2 leading-relaxed text-stone-600">
              {t(product.description)}
            </p>
          </div>

          <Link
            to="/cart"
            className="mt-8 inline-block w-full rounded-xl bg-emerald-700 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto"
          >{t("Add to Cart (Demo)")}</Link>

          <p className="mt-3 text-sm leading-relaxed text-stone-500">{t("This demo button opens the cart without adding a product.")}</p>
        </div>
      </section>
    </div>
  )
}
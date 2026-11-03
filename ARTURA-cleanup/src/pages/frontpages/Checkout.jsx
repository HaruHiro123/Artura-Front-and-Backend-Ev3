import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import useCart from '../../hooks/useCart.js'
import useArturaData from '../../hooks/useArturaData.js'
import formatRupiah from '../../utils/formatRupiah.js'
import { courierOptions } from '../../data/deliveryOptions.js'

const emptyForm = {
  name: '',
  email: '',
  whatsapp: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  notes: '',
  courier: 'jnt',
}

export default function Checkout() {
  const { t } = useLanguage()

  const { cartItems, totalQty, totalPrice, clearCart } = useCart()
  const { createOrder } = useArturaData()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [createdOrderId, setCreatedOrderId] = useState('')

  if (totalQty === 0 && !createdOrderId) return <Navigate to="/cart" replace />

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '', contact: '' }))
    setSubmitError('')
  }

  function submit(event) {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your full name.'
    if (!form.email.trim() && !form.whatsapp.trim()) next.contact = 'Please enter your email or WhatsApp.'
    if (!form.address.trim()) next.address = 'Please enter your address.'
    if (!form.city.trim()) next.city = 'Please enter your city.'
    if (!form.province.trim()) next.province = 'Please enter your province.'
    if (!form.postalCode.trim()) next.postalCode = 'Please enter your postal code.'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.contact = 'Please enter a valid email address.'
    if (!/^\d{5}$/.test(form.postalCode.trim())) next.postalCode = 'Postal code must contain 5 digits.'
    if (!form.courier) next.courier = 'Please choose a courier.'
    setErrors(next)
    if (Object.keys(next).length) return

    const order = createOrder({
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
      },
      shipping: {
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        postalCode: form.postalCode.trim(),
        notes: form.notes.trim(),
        courier: form.courier,
        trackingNumber: '',
      },
      items: cartItems.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        image: item.image,
        price: Number(item.price),
      })),
      subtotal: totalPrice,
      total: totalPrice,
    })

    if (!order) {
      setSubmitError('The order could not be saved. Check the browser storage notification, then try again.')
      return
    }

    // Simpan ID terlebih dahulu agar perubahan Cart tidak memicu redirect kembali ke /cart
    // sebelum React Router selesai berpindah ke halaman pembayaran.
    setCreatedOrderId(order.id)
    navigate(`/payment/${order.id}`)
    clearCart()
  }

  const fieldClass = 'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 transition focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100'

  return (
    <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-3" noValidate>
      <div className="space-y-8 lg:col-span-2">
        <section className="artura-reveal rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Checkout")}</p>
          <h1 className="mt-3 font-serif text-4xl">{t("Customer Information")}</h1>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold">{t("Full Name")}</span>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} className={fieldClass} />
              {errors.name && <span className="mt-2 block text-sm text-red-700">{t(errors.name)}</span>}
            </label>
            <label>
              <span className="text-sm font-semibold">{t("Email")}</span>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={fieldClass} />
            </label>
            <label>
              <span className="text-sm font-semibold">{t("WhatsApp")}</span>
              <input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} className={fieldClass} />
            </label>
            {errors.contact && <p className="sm:col-span-2 text-sm text-red-700">{t(errors.contact)}</p>}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7Z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
              </svg>
            </span>
            <div>
              <h2 className="font-serif text-3xl">{t("Delivery Information")}</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">{t("Choose your preferred courier. Once the package is shipped, the tracking number will appear on the Purchase Status page.")}</p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold">{t("Address")}</span>
              <textarea rows={3} value={form.address} onChange={(e) => update('address', e.target.value)} className={fieldClass} />
              {errors.address && <span className="mt-2 block text-sm text-red-700">{t(errors.address)}</span>}
            </label>
            <label><span className="text-sm font-semibold">{t("City")}</span><input value={form.city} onChange={(e) => update('city', e.target.value)} className={fieldClass} />{errors.city && <span className="mt-2 block text-sm text-red-700">{t(errors.city)}</span>}</label>
            <label><span className="text-sm font-semibold">{t("Province")}</span><input value={form.province} onChange={(e) => update('province', e.target.value)} className={fieldClass} />{errors.province && <span className="mt-2 block text-sm text-red-700">{t(errors.province)}</span>}</label>
            <label><span className="text-sm font-semibold">{t("Postal Code")}</span><input value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} className={fieldClass} />{errors.postalCode && <span className="mt-2 block text-sm text-red-700">{t(errors.postalCode)}</span>}</label>
            <label>
              <span className="text-sm font-semibold">{t("Preferred Courier")}</span>
              <select value={form.courier} onChange={(e) => update('courier', e.target.value)} className={fieldClass}>
                {courierOptions.map((item) => <option key={item.value} value={item.value}>{t(item.label)}</option>)}
              </select>
              {errors.courier && <span className="mt-2 block text-sm text-red-700">{t(errors.courier)}</span>}
            </label>
            <label className="sm:col-span-2"><span className="text-sm font-semibold">{t("Delivery Notes")}</span><input value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder={t("Address landmark, preferred receiving time, and other notes")} className={fieldClass} /></label>
          </div>
        </section>

        {submitError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{t(submitError)}</p>}
      </div>

      <aside className="rounded-[2rem] bg-emerald-950 p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-32">
        <h2 className="font-serif text-2xl">{t("Order Summary")}</h2>
        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3 border-b border-white/15 pb-4">
              <img src={item.image} alt="" className="h-16 w-12 rounded bg-white/10 object-contain" />
              <div className="min-w-0 flex-1"><p className="font-medium">{item.title}</p><p className="mt-1 text-sm text-emerald-100">{t(formatRupiah(Number(item.price)))}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-sm"><span>{t("Subtotal")}</span><span>{t(formatRupiah(totalPrice))}</span></div>
        <div className="mt-5 flex justify-between border-t border-white/20 pt-5"><strong>{t("Total")}</strong><strong className="text-2xl">{t(formatRupiah(totalPrice))}</strong></div>
        <p className="mt-4 text-xs leading-6 text-emerald-100/75">{t("The courier is selected at checkout. The tracking number will be added by the admin after the package is handed over to the courier.")}</p>
        <Button type="submit" variant="light" className="mt-6 w-full">{t("Continue to Payment")}</Button>
      </aside>
    </form>
  )
}

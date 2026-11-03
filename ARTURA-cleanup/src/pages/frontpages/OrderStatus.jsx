import { useLanguage } from '../../i18n/useLanguage.js'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import ProgressTimeline from '../../components/ProgressTimeline.jsx'
import ReceiptCard from '../../components/ReceiptCard.jsx'
import useArturaData from '../../hooks/useArturaData.js'
import { courierLabel } from '../../data/deliveryOptions.js'
import { paymentMethodLabel } from '../../utils/paymentMethods.js'
import formatRupiah from '../../utils/formatRupiah.js'

const orderSteps = [
  { value: 'waiting-payment', label: 'Waiting for Payment', description: 'The order was created and is waiting for payment.' },
  { value: 'waiting-verification', label: 'Payment Verification', description: 'Payment proof is being verified by the admin.' },
  { value: 'processing', label: 'Processing', description: 'Payment verified and the order is being processed.' },
  { value: 'ready-to-ship', label: 'Ready to Ship', description: 'The artwork is ready to be shipped.' },
  { value: 'shipped', label: 'Shipped', description: 'The package has been handed over to the courier.' },
  { value: 'delivered', label: 'Delivered', description: 'The package has arrived at the destination address.' },
  { value: 'completed', label: 'Completed', description: 'The entire order process is complete.' },
]

export default function OrderStatus() {
  const { t } = useLanguage()

  const { orderId } = useParams()
  const { orders, paymentSettings, artist } = useArturaData()
  const order = orders.find((item) => item.id === orderId)

  if (!order) {
    return <section className="rounded-3xl bg-white p-8 text-center"><h1 className="font-serif text-3xl">{t("Order not found")}</h1><Button to="/shop" className="mt-6">{t("Back to Shop")}</Button></section>
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Order Status")}</p>
            <h1 className="mt-3 font-serif text-4xl">{order.id}</h1>
            <p className="mt-3 text-sm text-stone-600">{order.customer.name}</p>
          </div>
          <div className="flex flex-wrap gap-2"><StatusBadge status={order.orderStatus} /><StatusBadge status={order.paymentStatus} /></div>
        </div>

        {order.orderStatus === 'cancelled' ? (
          <div className="mt-8 rounded-2xl bg-red-50 p-5 text-sm leading-7 text-red-900">{t("This order has been cancelled. New payments cannot be submitted for this order.")}</div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <h2 className="font-serif text-2xl">{t("Order Progress")}</h2>
              <div className="mt-5"><ProgressTimeline steps={orderSteps} currentStatus={order.orderStatus} /></div>
            </div>
            <aside className="rounded-[1.5rem] bg-emerald-950 p-6 text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-200">{t("Delivery")}</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-emerald-100">{t("Courier")}</dt><dd className="font-semibold">{t(courierLabel(order.shipping?.courier))}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-emerald-100">{t("Tracking")}</dt><dd className="text-right font-semibold">{t(order.shipping?.trackingNumber || 'Not available yet')}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-emerald-100">{t("Total")}</dt><dd className="font-semibold">{t(formatRupiah(order.total))}</dd></div>
              </dl>
              {['waiting-payment', 'rejected'].includes(order.paymentStatus) && <Button to={`/payment/${order.id}`} variant="light" className="mt-6 w-full">{t("Continue Payment")}</Button>}
            </aside>
          </div>
        )}
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Shipping Address")}</p>
          <p className="mt-4 text-sm leading-7 text-stone-700">{order.shipping?.address}<br />{order.shipping?.city}, {order.shipping?.province} {order.shipping?.postalCode}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">{t("Payment")}</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Method")}</dt><dd className="font-semibold">{t(paymentMethodLabel(order.paymentMethod, paymentSettings))}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-stone-500">{t("Status")}</dt><dd><StatusBadge status={order.paymentStatus} /></dd></div>
          </dl>
        </div>
      </section>

      <ReceiptCard
        title={t("Purchase Receipt")}
        id={order.id}
        date={order.createdAt}
        customer={order.customer.name}
        total={order.total}
        paymentStatus={order.paymentStatus}
        contactInstagram={artist.instagram || '@artuhiro.__'}
        rows={[
          { label: 'Artwork', value: order.items.map((item) => item.title).join(', ') },
          { label: 'Payment Method', value: paymentMethodLabel(order.paymentMethod, paymentSettings) },
          { label: 'Order Status', value: order.orderStatus },
          { label: 'Courier', value: courierLabel(order.shipping?.courier) },
          { label: 'Tracking Number', value: order.shipping?.trackingNumber || '' },
        ]}
      />

      <div className="flex flex-wrap gap-3"><Button to="/status" variant="secondary">{t("Purchase Status")}</Button><Button to="/shop" variant="secondary">{t("Back to Shop")}</Button></div>
    </div>
  )
}

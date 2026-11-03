import { useLanguage } from '../i18n/useLanguage.js'
const statuses = {
  available: { label: 'Available', color: 'bg-emerald-100 text-emerald-900' },
  sold: { label: 'Sold', color: 'bg-stone-200 text-stone-700' },
  portfolio: { label: 'Portfolio', color: 'bg-amber-50 text-amber-900' },
  'waiting-approval': { label: 'Waiting for Approval', color: 'bg-amber-100 text-amber-900' },
  'waiting-payment': { label: 'Waiting for Payment', color: 'bg-amber-100 text-amber-900' },
  'waiting-verification': { label: 'Waiting for Verification', color: 'bg-sky-100 text-sky-900' },
  paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-900' },
  processing: { label: 'Processing', color: 'bg-violet-100 text-violet-900' },
  'ready-to-deliver': { label: 'Ready to Deliver', color: 'bg-indigo-100 text-indigo-900' },
  'ready-to-ship': { label: 'Ready to Ship', color: 'bg-indigo-100 text-indigo-900' },
  shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-900' },
  delivered: { label: 'Delivered', color: 'bg-teal-100 text-teal-900' },
  completed: { label: 'Completed', color: 'bg-emerald-950 text-white' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  new: { label: 'New', color: 'bg-amber-100 text-amber-900' },
  accepted: { label: 'Accepted', color: 'bg-sky-100 text-sky-900' },
  'in-progress': { label: 'In Progress', color: 'bg-violet-100 text-violet-900' },
}

export default function StatusBadge({ status }) {
  const { t } = useLanguage()

  const item = statuses[status] || { label: status || '-', color: 'bg-stone-100 text-stone-700' }
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>{t(item.label)}</span>
}

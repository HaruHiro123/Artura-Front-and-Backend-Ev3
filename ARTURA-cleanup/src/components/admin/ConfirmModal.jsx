import { useLanguage } from '../../i18n/useLanguage.js'
export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  const { t } = useLanguage()

  if (!open) return null
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h2 className="font-serif text-2xl">{t(title)}</h2><p className="mt-3 text-sm leading-7 text-stone-600">{t(message)}</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onCancel} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold">{t("Cancel")}</button><button type="button" onClick={onConfirm} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">{t("Confirm")}</button></div></div></div>
}

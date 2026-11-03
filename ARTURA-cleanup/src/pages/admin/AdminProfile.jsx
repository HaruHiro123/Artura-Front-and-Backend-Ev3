import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import useArturaData from '../../hooks/useArturaData.js'
import { readImageFile } from '../../utils/filePreview.js'

export default function AdminProfile() {
  const { t } = useLanguage()

  const { artist, updateArtist } = useArturaData()
  const [draft, setDraft] = useState({ ...artist })
  const [message, setMessage] = useState('')
  function set(field, value) { setDraft((current) => ({ ...current, [field]: value })) }
  async function photo(file) { try { const image = await readImageFile(file, 2); set('profilePhoto', image.preview); setMessage('') } catch (err) { setMessage(err.message) } }
  function save(event) { event.preventDefault(); if (updateArtist(draft)) setMessage('Profile saved.'); else setMessage('') }
  const input='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3'
  return <form onSubmit={save} className="max-w-4xl"><h1 className="font-serif text-4xl">{t("Artist Profile")}</h1><div className="mt-7 grid gap-6 rounded-3xl border bg-white p-6 sm:grid-cols-2"><label><span className="text-sm font-semibold">{t("Artist Name")}</span><input value={draft.name} onChange={(e) => set('name',e.target.value)} className={input} /></label><label><span className="text-sm font-semibold">{t("Instagram")}</span><input value={draft.instagram} onChange={(e) => set('instagram',e.target.value)} className={input} /></label><label><span className="text-sm font-semibold">{t("Email")}</span><input value={draft.email} onChange={(e) => set('email',e.target.value)} className={input} /></label><label><span className="text-sm font-semibold">{t("Commission Status")}</span><select value={draft.commissionOpen ? 'open':'closed'} onChange={(e) => set('commissionOpen',e.target.value==='open')} className={input}><option value="open">{t("Open")}</option><option value="closed">{t("Closed")}</option></select></label><label className="sm:col-span-2"><span className="text-sm font-semibold">{t("Bio")}</span><textarea rows="5" value={draft.bio} onChange={(e) => set('bio',e.target.value)} className={input} /></label><div className="sm:col-span-2"><p className="text-sm font-semibold">{t("Profile Photo")}</p>{draft.profilePhoto && <img src={draft.profilePhoto} alt={t("Profile preview")} className="mt-3 h-48 w-48 rounded-2xl object-cover" />}<input id="profile-photo" type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && photo(e.target.files[0])} /><label htmlFor="profile-photo" className="mt-3 inline-flex cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold">{t("Choose Photo")}</label></div>{message && <p className="sm:col-span-2 text-sm text-emerald-800">{t(message)}</p>}<button type="submit" className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white sm:col-span-2 sm:w-fit">{t("Save Profile")}</button></div></form>
}

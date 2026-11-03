import { useLanguage } from '../../i18n/useLanguage.js'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useArturaData from '../../hooks/useArturaData.js'
import { readImageFile } from '../../utils/filePreview.js'

function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

export default function ArtworkForm({ mode = 'add' }) {
  const { t } = useLanguage()

  const { id } = useParams()
  const navigate = useNavigate()
  const { artworks, addArtwork, updateArtwork } = useArturaData()
  const existing = mode === 'edit' ? artworks.find((item) => String(item.id) === String(id)) : null
  const [form, setForm] = useState(() => existing ? { ...existing } : { title: '', slug: '', collectionType: 'portfolio', category: 'traditional', categoryName: 'Traditional Art', medium: 'Traditional Art', description: '', price: '', status: 'available', image: '', featured: false, year: new Date().getFullYear().toString(), technique: '' })
  const [manualSlug, setManualSlug] = useState(mode === 'edit')
  const [error, setError] = useState('')

  if (mode === 'edit' && !existing) return <Navigate to="/admin/artworks" replace />
  function update(field, value) { if (field === 'slug') setManualSlug(true); setForm((current) => ({ ...current, [field]: value, ...(field === 'title' && !manualSlug ? { slug: slugify(value) } : {}) })) }
  async function imageChange(file) { try { const image = await readImageFile(file, 2); update('image', image.preview); setError('') } catch (err) { setError(err.message) } }
  function submit(event) {
    event.preventDefault()
    if (!form.title.trim()) return setError('Artwork title is required.')
    if (!slugify(form.slug)) return setError('Slug is required.')
    if (!form.image) return setError('An image is required.')
    if (form.collectionType === 'shop' && (!Number.isSafeInteger(Number(form.price)) || Number(form.price) <= 0)) return setError('Price is required for Shop artwork.')
    const duplicate = artworks.some((item) => item.slug === slugify(form.slug) && String(item.id) !== String(existing?.id))
    if (duplicate) return setError('This slug is already used by another artwork.')
    const payload = { ...form, title: form.title.trim(), slug: slugify(form.slug), price: form.collectionType === 'shop' ? Number(form.price) : null, status: form.collectionType === 'shop' ? form.status : 'portfolio' }
    const saved = mode === 'edit' ? updateArtwork(existing.id, payload) : addArtwork(payload)
    if (!saved) return
    navigate('/admin/artworks')
  }

  const input = 'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3'
  return <form onSubmit={submit} className="mx-auto max-w-4xl"><p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{t("Artwork Management")}</p><h1 className="mt-2 font-serif text-4xl">{t(mode === 'edit' ? 'Edit Artwork' : 'Add Artwork')}</h1><div className="mt-7 grid gap-6 rounded-3xl border border-stone-200 bg-white p-6 sm:grid-cols-2 sm:p-8"><label><span className="text-sm font-semibold">{t("Artwork Title")}</span><input value={form.title} onChange={(e) => update('title', e.target.value)} className={input} /></label><label><span className="text-sm font-semibold">{t("Slug")}</span><input value={form.slug} onChange={(e) => update('slug', slugify(e.target.value))} className={input} /></label><label><span className="text-sm font-semibold">{t("Collection Type")}</span><select value={form.collectionType} onChange={(e) => update('collectionType', e.target.value)} className={input}><option value="portfolio">{t("Portfolio")}</option><option value="shop">{t("Shop")}</option></select></label><label><span className="text-sm font-semibold">{t("Category")}</span><input value={form.categoryName} onChange={(e) => update('categoryName', e.target.value)} className={input} /></label><label><span className="text-sm font-semibold">{t("Medium")}</span><input value={form.medium} onChange={(e) => update('medium', e.target.value)} className={input} /></label><label><span className="text-sm font-semibold">{t("Technique")}</span><input value={form.technique || ''} onChange={(e) => update('technique', e.target.value)} className={input} /></label><label><span className="text-sm font-semibold">{t("Year")}</span><input value={form.year || ''} onChange={(e) => update('year', e.target.value)} className={input} /></label>{form.collectionType === 'shop' && <><label><span className="text-sm font-semibold">{t("Price")}</span><input type="number" min="1" value={form.price ?? ''} onChange={(e) => update('price', e.target.value)} className={input} /></label><label><span className="text-sm font-semibold">{t("Status")}</span><select value={form.status} onChange={(e) => update('status', e.target.value)} className={input}><option value="available">{t("Available")}</option><option value="sold">{t("Sold")}</option></select></label></>}<label className="sm:col-span-2"><span className="text-sm font-semibold">{t("Description")}</span><textarea rows="4" value={form.description} onChange={(e) => update('description', e.target.value)} className={input} /></label><div className="sm:col-span-2"><span className="text-sm font-semibold">{t("Image")}</span><input id="art-image" type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && imageChange(e.target.files[0])} />{form.image && <img src={form.image} alt={t("Preview")} className="mt-3 h-56 w-full rounded-2xl bg-stone-100 object-contain" />}<label htmlFor="art-image" className="mt-3 inline-flex cursor-pointer rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold">{t(form.image ? 'Change Image' : 'Choose Image')}</label></div><label className="flex items-center gap-3 sm:col-span-2"><input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => update('featured', e.target.checked)} className="h-5 w-5" /><span className="text-sm font-semibold">{t("Featured Artwork")}</span></label>{error && <p className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-sm text-red-800">{t(error)}</p>}<div className="flex gap-3 sm:col-span-2"><button type="submit" className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white">{t("Save Artwork")}</button><button type="button" onClick={() => navigate('/admin/artworks')} className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold">{t("Cancel")}</button></div></div></form>
}

import { useLanguage } from '../../i18n/useLanguage.js'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useArturaData from '../../hooks/useArturaData.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import formatRupiah from '../../utils/formatRupiah.js'

export default function AdminArtworks() {
  const { t } = useLanguage()

  const { artworks, deleteArtwork } = useArturaData()
  const [search, setSearch] = useState('')
  const [collection, setCollection] = useState('all')
  const [status, setStatus] = useState('all')
  const [pendingDelete, setPendingDelete] = useState(null)
  const visible = useMemo(() => artworks.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesCollection = collection === 'all' || item.collectionType === collection
    const matchesStatus = status === 'all' || item.status === status
    return matchesSearch && matchesCollection && matchesStatus
  }), [artworks, search, collection, status])

  return <div><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{t("Shared artwork data")}</p><h1 className="mt-2 font-serif text-4xl">{t("Artwork Management")}</h1></div><Link to="/admin/artworks/add" className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white">{t("Add Artwork")}</Link></div><div className="mt-7 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-3"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search artwork...")} className="rounded-xl border border-stone-300 px-4 py-3" /><select value={collection} onChange={(e) => setCollection(e.target.value)} className="rounded-xl border border-stone-300 px-4 py-3"><option value="all">{t("All Collections")}</option><option value="portfolio">{t("Portfolio")}</option><option value="shop">{t("Shop")}</option></select><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-stone-300 px-4 py-3"><option value="all">{t("All Status")}</option><option value="available">{t("Available")}</option><option value="sold">{t("Sold")}</option><option value="portfolio">{t("Portfolio")}</option></select></div><div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white"><table className="min-w-[950px] w-full text-left text-sm"><thead className="bg-stone-100 text-stone-600"><tr>{['Image','Title','Collection','Category','Medium','Price','Status','Featured','Actions'].map((h) => <th key={h} className="px-4 py-3">{t(h)}</th>)}</tr></thead><tbody>{visible.map((item) => <tr key={item.id} className="border-t border-stone-100"><td className="px-4 py-3"><img src={item.image} alt="" className="h-14 w-12 rounded bg-stone-100 object-contain" /></td><td className="px-4 py-3 font-semibold">{item.title}</td><td className="px-4 py-3 capitalize">{t(item.collectionType)}</td><td className="px-4 py-3">{t(item.categoryName || item.category)}</td><td className="px-4 py-3">{t(item.medium)}</td><td className="px-4 py-3">{t(item.collectionType === 'shop' ? formatRupiah(Number(item.price || 0)) : '-')}</td><td className="px-4 py-3"><StatusBadge status={item.collectionType === 'portfolio' ? 'portfolio' : item.status} /></td><td className="px-4 py-3">{t(item.featured ? 'Yes' : 'No')}</td><td className="px-4 py-3"><div className="flex gap-2"><Link to={`/artwork/${item.slug}`} className="font-semibold text-emerald-800">{t("View")}</Link><Link to={`/admin/artworks/edit/${item.id}`} className="font-semibold text-sky-700">{t("Edit")}</Link><button type="button" onClick={() => setPendingDelete(item)} className="font-semibold text-red-700">{t("Delete")}</button></div></td></tr>)}{visible.length === 0 && <tr><td colSpan="9" className="px-4 py-8 text-center text-stone-500">{t("No matching artwork found.")}</td></tr>}</tbody></table></div><ConfirmModal open={Boolean(pendingDelete)} title={t("Delete Artwork")} message={<>{t('Delete this artwork from ARTURA?')} <strong>{pendingDelete?.title}</strong> {t('This also removes it from the public site.')}</>} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (deleteArtwork(pendingDelete.id)) setPendingDelete(null) }} /></div>
}

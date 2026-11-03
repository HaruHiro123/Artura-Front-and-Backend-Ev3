import { defaultArtist, defaultPaymentSettings, defaultPricing, defaultSiteSettings } from '../data/defaults.js'
import { STORAGE_KEYS } from '../data/storageKeys.js'
import { reconcileSold, money } from './transactionRules.js'
export const STORE_KEY = 'artura.store.v2'
const object = (value) => value && typeof value === 'object' && !Array.isArray(value)
const list = (value, fallback = []) => Array.isArray(value) ? value : fallback
const text = (value, fallback = '') => typeof value === 'string' ? value : fallback
export function validPricing(pricing) {
  return Object.entries(defaultPricing).every(([type, groups]) => Object.entries(groups).every(([group, values]) => Object.keys(values).every((key) => money(pricing?.[type]?.[group]?.[key]) && (type !== 'basePrices' || pricing[type][group][key] > 0))))
}
export function normalizeStore(raw, initialArtworks) {
  const data = object(raw) ? raw : {}
  const orders = list(data.orders).filter((item) => object(item) && typeof item.id === 'string' && object(item.customer) && Array.isArray(item.items) && item.items.every((entry) => object(entry) && typeof entry.title === 'string' && Number.isFinite(Number(entry.price)))).map((item) => ({ paymentMethod:'', paymentStatus:'waiting-payment', orderStatus:'waiting-payment', paymentProof:null, ...item, shipping:{courier:'',trackingNumber:'',shippedAt:'',deliveredAt:'',...(object(item.shipping)?item.shipping:{})} }))
  const artworks = list(data.artworks, initialArtworks).filter((item) => object(item) && item.id != null && typeof item.title === 'string' && typeof item.slug === 'string').map((item) => {
    const original = initialArtworks.find((entry) => entry.id === item.id)
    return { ...item, image:original && /^\/(assets|src)\//.test(item.image) ? original.image : item.image }
  })
  const commissions = list(data.commissions).filter((item) => object(item) && item.id && object(item.client)).map((item) => ({ paymentStatus:item.status === 'new' ? 'waiting-approval':'waiting-payment', paymentMethod:'', paymentProof:null, finalPrice:Number(item.estimatedPrice)||0, ...item, delivery:{type:item.mediaType === 'traditional'?'courier':'digital',courier:'',trackingNumber:'',deliveryUrl:'',...(item.delivery||{})} }))
  const paymentSettings = Object.fromEntries(Object.entries(defaultPaymentSettings).map(([key,value]) => [key,{...value,...(object(data.paymentSettings?.[key])?data.paymentSettings[key]:{})}]))
  return { artworks:reconcileSold(artworks,orders), orders, commissions, paymentSettings, reviews:list(data.reviews).filter((item)=>object(item)&&item.id&&typeof item.text==='string'&&Number.isInteger(item.rating)&&item.rating>=1&&item.rating<=5),
    pricing: validPricing(data.pricing) ? data.pricing : structuredClone(defaultPricing), artist:{...defaultArtist,...(object(data.artist)?data.artist:{})}, siteSettings:{siteName:text(data.siteSettings?.siteName,defaultSiteSettings.siteName),heroTagline:text(data.siteSettings?.heroTagline,defaultSiteSettings.heroTagline)}, resetVersion:data.resetVersion||0 }
}
export function loadStore(initialArtworks) {
  try { const raw=localStorage.getItem(STORE_KEY);if(raw)return normalizeStore(JSON.parse(raw),initialArtworks) } catch { /* Fall back to valid legacy collections. */ }
  const legacy={}
  for(const [key,storageKey] of Object.entries(STORAGE_KEYS)) {try{const raw=localStorage.getItem(storageKey);if(raw)legacy[{payments:'paymentSettings',settings:'siteSettings'}[key]||key]=JSON.parse(raw)}catch{/* Recover this collection from defaults. */}}
  return normalizeStore(legacy,initialArtworks)
}

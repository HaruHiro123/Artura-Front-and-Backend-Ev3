import test from 'node:test'
import assert from 'node:assert/strict'
import { translate } from '../src/i18n/translate.js'
import { defaultPaymentSettings } from '../src/data/defaults.js'
import { createOrderData, updateOrderData, reconcileSold } from '../src/utils/transactionRules.js'
import { normalizeStore, validPricing } from '../src/utils/store.js'
import { sanitizeCartIds } from '../src/utils/cart.js'
const artwork={id:14,slug:'jasper',title:'Jasper',image:'/assets/new.jpg',price:130000,collectionType:'shop',status:'available'}
const initial=()=>({artworks:[artwork],orders:[],paymentSettings:defaultPaymentSettings})
const payload={items:[{id:14,price:1}],customer:{name:'New'},shipping:{courier:'jnt',trackingNumber:''}}
const submitted=()=>{const db=initial();db.orders=[createOrderData(db,payload,'ART-TEST')];return updateOrderData(db,'ART-TEST',{paymentStatus:'waiting-verification',orderStatus:'waiting-verification',paymentMethod:'bank',paymentProof:{preview:'data:image/png;base64,AA=='}})}
test('Exact translation avoids recursive word replacement',()=>{assert.equal(translate('Shop','id'),'Toko');assert.equal(translate('Shop Artwork','id'),'Karya di Toko');assert.equal(translate('Workshop','id'),'Workshop');assert.equal(translate('My Shop Drawing','id'),'My Shop Drawing')})
test('Repeated language switching is reversible for UI strings',()=>{let text='Waiting for Verification';for(let i=0;i<20;i++){text=translate(text,'id');assert.equal(text,'Menunggu Verifikasi');text=translate(text,'en');assert.equal(text,'Waiting for Verification')}})
test('Translation preserves non-text React values and whitespace',()=>{const element={type:'span'};assert.equal(translate(element,'id'),element);assert.equal(translate(2,'id'),2);assert.equal(translate(' Shop ','id'),' Toko ');assert.equal(translate(null,'id'),null)})
test('Status and preview translations are explicit',()=>{assert.equal(translate('sold','en'),'Sold');assert.equal(translate('sold','id'),'Terjual');assert.equal(translate('Preview Main Reference Photo','id'),'Pratinjau Foto Referensi Utama');assert.equal(translate('Maximum image size is 5 MB.','id'),'Ukuran gambar maksimal 5 MB.')})
test('Checkout uses current catalog price, not payload price',()=>{const order=createOrderData(initial(),payload,'ART-1');assert.equal(order.total,130000);assert.equal(order.items.length,1)})
test('Unpaid and unverified artwork remains available',()=>{const db=submitted();assert.equal(db.artworks[0].status,'available');assert.equal(db.orders[0].paymentStatus,'waiting-verification')})
test('Verification changes payment and stock in one state',()=>{const db=updateOrderData(submitted(),'ART-TEST',{paymentStatus:'paid',orderStatus:'processing'});assert.equal(db.artworks[0].status,'sold');assert.equal(db.orders[0].paymentStatus,'paid');assert.deepEqual(sanitizeCartIds([14],db.artworks),[])})
test('Active order prevents duplicate checkout',()=>{const db=submitted();assert.throws(()=>createOrderData(db,payload,'ART-2'),/active order/)})
test('Cancelled invoice cannot be reactivated and reservation is released',()=>{const db=updateOrderData(submitted(),'ART-TEST',{orderStatus:'cancelled',paymentStatus:'cancelled'});assert.throws(()=>updateOrderData(db,'ART-TEST',{paymentStatus:'paid'}),/cancelled/);assert.ok(createOrderData(db,payload,'ART-2'))})
test('Cannot verify payment without a submitted proof',()=>{const db=initial();db.orders=[createOrderData(db,payload,'ART-1')];assert.throws(()=>updateOrderData(db,'ART-1',{paymentStatus:'paid'}),/submitted payment proof/)})
test('Inactive payment method cannot accept proof',()=>{const db=initial();db.orders=[createOrderData(db,payload,'ART-1')];assert.throws(()=>updateOrderData(db,'ART-1',{paymentStatus:'waiting-verification',paymentMethod:'qris',paymentProof:{preview:'image'}}),/active payment method/)})
test('Historical duplicate orders cannot both become paid',()=>{const db=submitted();db.orders.push({...db.orders[0],id:'ART-OTHER',paymentStatus:'paid'});assert.throws(()=>updateOrderData(db,'ART-TEST',{paymentStatus:'paid'}),/no longer available/)})
test('Paid original cannot be cancelled without refund support',()=>{const db=updateOrderData(submitted(),'ART-TEST',{paymentStatus:'paid',orderStatus:'processing'});assert.throws(()=>updateOrderData(db,'ART-TEST',{orderStatus:'cancelled'}),/paid order/)})
test('Fulfillment requires verified payment and tracking',()=>{assert.throws(()=>updateOrderData(submitted(),'ART-TEST',{orderStatus:'shipped'}),/verified/);const db=updateOrderData(submitted(),'ART-TEST',{paymentStatus:'paid',orderStatus:'processing'});assert.throws(()=>updateOrderData(db,'ART-TEST',{orderStatus:'shipped'}),/tracking number/)})
test('Paid migration repairs stock and refreshes bundled image URLs',()=>{const db=submitted();db.orders[0].paymentStatus='paid';const next=normalizeStore({...db,artworks:[{...artwork,image:'/assets/old.jpg'}]},[artwork]);assert.equal(next.artworks[0].status,'sold');assert.equal(next.artworks[0].image,'/assets/new.jpg');assert.equal(reconcileSold([artwork],db.orders)[0].status,'sold')})
test('Malformed collections recover safely',()=>{const next=normalizeStore({artworks:{},orders:null,reviews:null,commissions:[null],pricing:{basePrices:null}},[artwork]);assert.equal(next.artworks.length,1);assert.deepEqual(next.orders,[]);assert.equal(validPricing(next.pricing),true)})

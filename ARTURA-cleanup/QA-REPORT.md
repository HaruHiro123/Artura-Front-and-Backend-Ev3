# Hasil verifikasi ARTURA

Tanggal: 8 Oktober 2026.
Sumber: ARTURA-BILINGUAL-EN-ID-FIX(2).zip.

## Hasil

- ESLint: lulus.
- Build produksi Vite: lulus.
- Tes regresi logika: 16 lulus.
- Pemeriksaan browser pada build produksi: 21 lulus, tanpa error JavaScript yang tidak tertangani.
- Seluruh 23 aset bawaan identik dengan ZIP sumber: 20 gambar JPEG, Omni.mp4, dan 2 SVG.

## Alur yang diperiksa

1. Home EN/ID translations and document language
2. Repeated language changes across seven public routes without DOM errors
3. Language switch preserves form input and option values
4. Upload labels and preview alt text translated
5. Checkout preserves user text and does not mark unpaid artwork sold
6. Proof submitted while original remains unsold until verification
7. Quota failure cannot partially save Paid or Sold
8. Payment verification atomically changes artwork to Sold
9. Sold/Terjual persists after refresh and blocks cart button
10. Detail stock and receipt preserve names/addresses such as New
11. Admin cannot relist a sold one-off original
12. Duplicate checkout for a reserved original blocked
13. Cancelled unpaid order releases stock and blocks proof
14. Admin pages translated in both languages
15. Negative price cannot be saved
16. Mobile layout 390px has no page overflow on five key routes
17. Language preference persists on reload
18. Stock sync between browser tabs
19. Legacy paid orders repair missing Sold state
20. Malformed localStorage collections recover without white screen
21. No uncaught browser JavaScript errors

## Bukti dan cara mengulang

Hasil browser tersedia di `docs/qa-report.json`. Screenshot akhir ada di `docs/shop-id-sold.png` dan `docs/commission-id-mobile.png`.
Jalankan `npm run lint`, `npm test`, dan `npm run build` untuk pemeriksaan dasar. Untuk tes browser, jalankan `npx playwright install chromium`, lalu `npm run test:e2e`. Port 5173 harus kosong.

Pengujian menggunakan data contoh pada browser uji terpisah. Data pesanan uji tidak dimasukkan ke katalog bawaan proyek.

## Batas verifikasi

Ini masih aplikasi frontend dengan localStorage, pembayaran manual, dan autentikasi admin demo. Tidak ada uang, gateway pembayaran, maupun pesanan kurir sungguhan yang diproses dalam pengujian. Sinkronisasi stok berlaku antar-tab pada browser/origin yang sama, belum lintas perangkat atau pelanggan. Pengujian mencakup skenario di atas dan tidak menjamin seluruh kemungkinan lingkungan pengguna bebas bug.

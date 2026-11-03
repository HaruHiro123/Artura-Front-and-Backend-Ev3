# ARTURA

**Personal Art Gallery, Art Shop & Custom Art Commission**

ARTURA adalah prototipe website untuk menampilkan karya seni personal, menyediakan karya original yang dijual, dan menerima permintaan gambar custom. Website ini dikembangkan sebagai tugas Frontend Programming menggunakan React.

**Live demo:** https://haruhiro123.github.io/ARTURA/  
**Source code:** https://github.com/HaruHiro123/ARTURA

## Fitur

- **Portfolio:** galeri karya yang ditampilkan sebagai koleksi, tanpa fitur pembelian.
- **Art Shop:** katalog artwork dengan detail, status ketersediaan, keranjang, dan checkout.
- **Custom Commission:** pilihan Digital/Traditional Art, gaya gambar, ukuran, referensi foto, dan estimasi harga berdasarkan pilihan.
- **Order & Commission Status:** ringkasan pesanan, nota, tahap pembayaran, progres pengerjaan, dan informasi pengiriman sesuai jenis karya.
- **Admin Panel (demo):** pengelolaan artwork, commission, pesanan, pembayaran, harga layanan, dan pengaturan.
- **Bilingual Interface:** pilihan bahasa Inggris dan bahasa Indonesia.

## Teknologi

- React JS (Functional Components, Hooks, Context API)
- JavaScript dan JSX
- Vite
- Tailwind CSS
- React Router
- Browser Storage (`localStorage` dan `sessionStorage`)
- GitHub Pages untuk publikasi website

## Struktur project

```text
src/
├── components/       # Komponen UI reusable
├── context/          # Global state dan provider aplikasi
├── data/             # Data awal dan konfigurasi
├── hooks/            # Custom React hooks
├── i18n/             # Pengaturan bahasa dan terjemahan
├── layouts/          # Layout public dan admin
├── pages/            # Halaman aplikasi
├── utils/            # Validasi, perhitungan, dan penyimpanan
├── App.jsx           # Konfigurasi halaman dan routing
└── main.jsx          # Entry point aplikasi
```

## Menjalankan di komputer

Persyaratan: Node.js dan npm versi yang mendukung dependency pada `package.json`.

```bash
npm ci
npm run dev
```

Buka alamat lokal yang ditampilkan Vite pada terminal.

Untuk pengujian dan build:

```bash
npm run test
npm run lint
npm run build
```

## Deployment

Repository ini menggunakan GitHub Actions pada `.github/workflows/deploy.yml`. Perubahan pada branch `main` akan memicu build dan deployment otomatis ke GitHub Pages.

## Catatan

ARTURA saat ini adalah **prototipe frontend**. Data artwork yang dikelola, pesanan, dan status disimpan menggunakan browser storage, bukan database server yang tersinkron antarperangkat. Login admin dan alur pembayaran merupakan simulasi untuk demonstrasi fitur, **bukan sistem transaksi produksi**. Jangan gunakan data pelanggan atau pembayaran sungguhan pada versi ini.

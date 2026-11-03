# ARTURA: Decentralized & Decoupled Artwork E-Commerce Platform

> **Live Demo (Frontend):** [https://haruhiro123.github.io/ARTURA/](https://haruhiro123.github.io/ARTURA/)  

---

## Deskripsi Proyek (Evaluasi 3)
**ARTURA** adalah platform e-commerce dan manajemen karya seni profesional yang mengusung arsitektur **Decoupled (Separated Frontend & Backend)**. Sistem ini dirancang untuk menghubungkan seniman dan kolektor seni dengan fitur manajemen katalog karya, sistem keranjang belanja interaktif, pelacakan status pesanan komisi secara real-time, integrasi metode pembayaran, serta dukungan **Auto-Translate (ID/EN)** berbasis *localStorage* dan sinkronisasi database relasional MySQL.

---

## Struktur Direktori Proyek (Monorepo)
Proyek ini dibagi menjadi dua bagian utama di dalam satu wadah penyimpanan:
* **`/ARTURA-cleanup`**: Frontend SPA yang dibangun menggunakan **React**, **Vite**, dan **Tailwind CSS**.
* **`/artura-api`**: Backend RESTful API yang dibangun menggunakan framework **Laravel 10+** dengan basis data **MySQL**.

---

## Panduan Menjalankan Proyek Secara Lokal

Untuk menjalankan sistem secara utuh (*Fullstack*), Anda memerlukan dua terminal yang berjalan secara bersamaan:

### 1. Menjalankan Backend (Laravel API)
```bash
cd artura-api
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link --force
php artisan serve

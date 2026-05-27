# 📋 Dokumentasi Web Admin GoDiet

> Dokumen ini menjelaskan secara terperinci struktur, fitur, dan cara kerja aplikasi **GoDiet Admin Panel** — sebuah dashboard manajemen untuk aplikasi diet dan kebugaran GoDiet.

---

## 🗂️ Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Teknologi yang Digunakan](#2-teknologi-yang-digunakan)
3. [Struktur Proyek](#3-struktur-proyek)
4. [Arsitektur & Alur Aplikasi](#4-arsitektur--alur-aplikasi)
5. [Sistem Autentikasi](#5-sistem-autentikasi)
6. [Halaman-Halaman Admin](#6-halaman-halaman-admin)
   - [6.1 Overview / Dashboard](#61-overview--dashboard)
   - [6.2 Reports (Laporan Pengguna)](#62-reports-laporan-pengguna)
   - [6.3 Kebugaran (Fitness)](#63-kebugaran-fitness)
   - [6.4 Kelola User](#64-kelola-user)
   - [6.5 Kelola Makanan](#65-kelola-makanan)
7. [Komponen Reusable](#7-komponen-reusable)
   - [7.1 Sidebar](#71-sidebar)
   - [7.2 StatCard](#72-statcard)
8. [Modul API (api.ts)](#8-modul-api-apits)
9. [Deployment](#9-deployment)
10. [Ringkasan Fitur Lengkap](#10-ringkasan-fitur-lengkap)

---

## 1. Gambaran Umum

**GoDiet Admin Panel** adalah aplikasi web berbasis React yang berfungsi sebagai pusat kendali (control panel) untuk platform aplikasi mobile GoDiet. Admin dapat memantau statistik pengguna, mengelola database makanan, melihat laporan dari pengguna, dan memantau aktivitas kebugaran secara real-time melalui antarmuka yang modern dan responsif.

**Backend API** terhubung ke server yang di-hosting di Railway:
```
https://web-production-78ab8.up.railway.app
```

Panel ini **hanya bisa diakses oleh akun dengan role `admin`**. Akun biasa (pengguna aplikasi mobile) tidak dapat masuk ke panel ini.

---

## 2. Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|---|---|---|
| **React** | 19.x | Library UI utama |
| **TypeScript** | ~6.0 | Superset JavaScript dengan typing |
| **Vite** | 8.x | Build tool & development server |
| **React Router DOM** | 7.x | Navigasi & routing antar halaman |
| **Recharts** | 3.x | Library grafik & chart interaktif |
| **Lucide React** | 1.x | Ikon-ikon SVG modern |
| **Vanilla CSS** | — | Styling manual per komponen |
| **serve** | 14.x | Static file server untuk production |

**Dev Dependencies:**
- `eslint` + `typescript-eslint` — linting kode
- `@vitejs/plugin-react` — plugin React untuk Vite

---

## 3. Struktur Proyek

```
admin_godiet/
├── public/                  # File statis publik
├── src/
│   ├── assets/
│   │   ├── image.png        # Logo GoDiet (ditampilkan di sidebar)
│   │   └── logo.png         # Asset logo alternatif
│   ├── components/
│   │   ├── Sidebar.tsx      # Navigasi sidebar utama
│   │   ├── Sidebar.css
│   │   ├── StatCard.tsx     # Kartu statistik reusable
│   │   └── StatCard.css
│   ├── pages/
│   │   ├── Login.tsx        # Halaman login admin
│   │   ├── Login.css
│   │   ├── Overview.tsx     # Dashboard utama
│   │   ├── Overview.css
│   │   ├── Reports.tsx      # Manajemen laporan pengguna
│   │   ├── Reports.css
│   │   ├── Fitness.tsx      # Pantauan kebugaran user
│   │   ├── Fitness.css
│   │   ├── Users.tsx        # Manajemen pengguna
│   │   ├── Users.css
│   │   ├── Foods.tsx        # Manajemen database makanan
│   │   └── Foods.css
│   ├── api.ts               # Konfigurasi & fungsi API terpusat
│   ├── App.tsx              # Root component + routing
│   ├── App.css
│   ├── index.css            # Global CSS
│   └── main.tsx             # Entry point aplikasi
├── index.html               # HTML template
├── package.json
├── vite.config.ts
├── railway.json             # Konfigurasi deployment Railway
└── nixpacks.toml            # Build config untuk Railway
```

---

## 4. Arsitektur & Alur Aplikasi

### Alur Routing (App.tsx)

Aplikasi menggunakan **React Router DOM v7** dengan dua jenis route:

```
/login          → Halaman Login (tanpa Sidebar, tanpa proteksi)
/*              → Semua halaman admin (dilindungi RequireAdmin guard)
  /             → Redirect otomatis ke /overview
  /overview     → Dashboard utama
  /reports      → Manajemen laporan
  /fitness      → Pantauan kebugaran
  /users        → Kelola pengguna
  /foods        → Kelola makanan
```

### Route Guard (`RequireAdmin`)

Semua halaman admin dilindungi oleh komponen `RequireAdmin`. Komponen ini memeriksa apakah `admin_id` tersimpan di `localStorage`. Jika tidak ada, pengguna akan di-redirect paksa ke `/login`.

```tsx
function RequireAdmin({ children }) {
  const adminId = localStorage.getItem('admin_id');
  if (!adminId) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

### Layout Aplikasi

Setelah login berhasil, semua halaman menggunakan layout dua kolom:
- **Kiri**: `<Sidebar />` — navigasi tetap
- **Kanan**: `<main>` — konten halaman yang berubah sesuai route aktif

---

## 5. Sistem Autentikasi

### Login Process

1. Admin membuka halaman `/login`
2. Mengisi **Email** dan **Password**
3. Klik tombol **"Masuk ke Dashboard"**
4. Request dikirim ke endpoint: `POST /api/auth/login`
5. Server memverifikasi kredensial dan mengembalikan data user
6. **Validasi role**: Jika `data.user.role !== 'admin'`, akses **ditolak** dengan pesan error
7. Jika sukses, dua nilai disimpan ke `localStorage`:
   - `admin_id` → ID admin yang login
   - `admin_email` → Email admin (ditampilkan di sidebar)
8. Admin di-redirect ke `/overview`

### Logout Process

Admin klik tombol **Logout** di sidebar → `admin_id` dan `admin_email` dihapus dari `localStorage` → Redirect ke `/login`.

### Keamanan Header API

Setiap request ke endpoint admin menyertakan header `X-Admin-Id` berisi ID admin yang sedang login:

```typescript
export function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Admin-Id': localStorage.getItem('admin_id') || '',
  };
}
```

---

## 6. Halaman-Halaman Admin

### 6.1 Overview / Dashboard

**Route**: `/overview`  
**File**: `src/pages/Overview.tsx`

Halaman ini adalah **pusat dashboard** yang menampilkan ringkasan keseluruhan platform GoDiet secara real-time.

#### Statistik Utama (Top Stats Cards)

| Kartu | Data yang Ditampilkan |
|---|---|
| **Total Users** | Jumlah seluruh pengguna terdaftar + penambahan bulan ini |
| **Makanan Database** | Total resep makanan tersedia di database |
| **Workout Hari Ini** | Jumlah sesi workout yang tercatat hari ini |
| **Avg BMI Platform** | Rata-rata BMI seluruh pengguna + kategori (Normal/Overweight/dll) |

#### Grafik-Grafik (Charts Row 1)

1. **Pertumbuhan User** — Area Chart menampilkan tren pertumbuhan pengguna selama 7 bulan terakhir (warna hijau dengan gradient fill)
2. **User Aktif Mingguan** — Bar Chart menampilkan jumlah sesi workout per hari dalam 7 hari terakhir + rata-rata mingguan

#### Grafik-Grafik (Charts Row 2)

3. **Distribusi Program Diet** — Donut/Pie Chart menampilkan sebaran program yang diikuti pengguna:
   - 🟢 Fat Loss
   - 🔵 Muscle Gain
   - 🟡 Maintenance
   - 🟣 Health
4. **Tingkat Kepatuhan Fitness** — Area Chart menampilkan compliance rate (persentase kepatuhan workout) per minggu + rata-rata compliance

#### Panel Bawah (Bottom Section)

- **Pantauan Kebugaran User** — Daftar user lengkap dengan tab filter:
  - Semua | On Track | Perlu Perhatian | Tidak Aktif
  - Menampilkan: avatar berwarna, nama, program diet, streak (hari berturut-turut), dan status
- **Notifikasi Terbaru** — Panel notifikasi dari server + **Fitness Highlights**:
  - Total workout hari ini
  - Total kalori terbakar minggu ini
  - Jumlah user aktif latihan

#### Bottom Stats Cards

| Kartu | Data |
|---|---|
| User Baru Bulan Ini | Jumlah + persentase dari total |
| Avg BMI Platform | Rata-rata BMI + label kategori |
| Total Kalori Terbakar | Kalori minggu ini (format K/M untuk angka besar) |
| Makanan Tersedia | Total resep di database |

#### Fitur Tambahan

- **Loading State**: Spinner animasi saat data dimuat dari server
- **Error State**: Tampilan error dengan tombol "🔄 Coba Lagi" jika gagal terhubung ke server
- **BMI Helper**: Fungsi otomatis mengklasifikasikan BMI → `Underweight / Normal / Overweight / Obesitas`

---

### 6.2 Reports (Laporan Pengguna)

**Route**: `/reports`  
**File**: `src/pages/Reports.tsx`

Halaman untuk melihat dan mengelola laporan (feedback/komplain) yang dikirimkan oleh pengguna aplikasi GoDiet.

#### Fitur Utama

- **Tab Filter Status**:
  - `Semua` — semua laporan
  - `Menunggu` (pending) — laporan baru yang belum ditangani
  - `Selesai` (resolved) — laporan yang sudah ditangani
  - `Ditolak` (rejected) — laporan yang ditolak
- **Kotak Pencarian**: Cari berdasarkan username, judul laporan, isi laporan, atau kategori
- **Tombol Refresh**: Reload data laporan dari server

#### Tabel Laporan

Kolom: `#` | `Pengguna` | `Judul Laporan` | `Kategori` | `Status` | `Tanggal` | `Aksi`

- Setiap baris bisa diklik untuk membuka **panel detail** di sebelah kanan
- Badge status berwarna:
  - 🕐 **Menunggu** (abu-abu/kuning)
  - ✅ **Selesai** (hijau)
  - ⚠️ **Ditolak** (merah)

#### Panel Detail Laporan

Ketika baris laporan diklik, panel detail muncul di sebelah kanan tabel menampilkan:
- Avatar + Username pengguna
- Tanggal laporan
- Judul laporan
- Kategori
- Isi laporan lengkap
- Status saat ini

**Aksi yang tersedia** (jika status masih `pending`):
- ✅ **Tombol "Selesai"** → Mengubah status ke `resolved`
- ⚠️ **Tombol "Tolak"** → Mengubah status ke `rejected`
- 🗑️ **Hapus Laporan** → Menghapus laporan secara permanen

#### Data Model Report

```typescript
interface Report {
  id_report: string;
  id_user: string;
  username: string;
  judul: string;
  isi_laporan: string;
  kategori: string;
  status: string;        // 'pending' | 'resolved' | 'rejected'
  created_at: string;
}
```

---

### 6.3 Kebugaran (Fitness)

**Route**: `/fitness`  
**File**: `src/pages/Fitness.tsx`

Halaman pemantauan detail aktivitas kebugaran seluruh pengguna aplikasi GoDiet.

#### Statistik Cards

| Kartu | Data |
|---|---|
| **Total User Fitness** | Jumlah pengguna yang terdaftar dalam program fitness |
| **On Track** | Pengguna dengan performa optimal + persentase |
| **Perlu Perhatian** | Pengguna yang butuh follow-up |
| **Avg Compliance** | Rata-rata kepatuhan workout (%) + evaluasi trend |

#### Grafik Kebugaran

1. **Workout Sessions Mingguan** — Bar Chart: total sesi per hari dalam 7 hari terakhir + rata-rata mingguan
2. **Compliance Rate Trend** — Area Chart: tren persentase kepatuhan per minggu (0-100%), axis Y diformat sebagai `%`

#### Tabel Detail User Fitness

Tabel lengkap dengan **filter tab** dan **kotak pencarian**:

Filter tab: `Semua | On Track | Perlu Perhatian | Tidak Aktif`  
Tab "Perlu Perhatian" dan "Tidak Aktif" menampilkan badge merah/oranye dengan jumlah user-nya.

Kolom tabel:
| Kolom | Keterangan |
|---|---|
| **User** | Avatar berwarna + Nama + Total kalori terbakar 30 hari |
| **Program** | Program diet yang diikuti (Fat Loss, Muscle Gain, dll) |
| **BMI** | Nilai BMI berwarna (hijau=normal, kuning=underweight, merah=overweight/obesitas) |
| **Compliance** | Progress bar berwarna + persentase kepatuhan |
| **Streak** | Ikon api 🔥 + jumlah hari berturut-turut latihan |
| **Status** | Badge: ✅ OK / ⚠️ Warn / ❌ Off |
| **Last Workout** | Tanggal/waktu workout terakhir |

#### Data Model Fitness User

```typescript
interface FitnessUser {
  id: string;
  id_user: string;
  name: string;
  initials: string;
  program: string;
  bmi: number | null;
  compliance: number;       // 0-100%
  streak: number;           // hari berturut-turut
  status: 'OK' | 'Warn' | 'Off';
  lastWorkout: string;
  totalKalori: number;
}
```

---

### 6.4 Kelola User

**Route**: `/users`  
**File**: `src/pages/Users.tsx`

Halaman untuk memantau dan mengelola semua pengguna terdaftar di aplikasi GoDiet.

#### Tampilan Utama

- **Header**: Menampilkan judul halaman + chip total jumlah user
- **Kotak Pencarian**: Filter user berdasarkan nama atau email (real-time)
- **Grid Kartu User**: Setiap user ditampilkan dalam kartu visual yang rapi

#### Kartu User (User Card)

Setiap kartu menampilkan:
- **Avatar** berwarna otomatis (berdasarkan email) atau foto profil jika ada
- **Nama lengkap** + **Email**
- **Statistik fisik**: Berat Badan (BB), Tinggi Badan (TB), Usia, BMI
- **Badge BMI** berwarna:
  - 🟡 Underweight
  - 🟢 Normal
  - 🟠 Overweight
  - 🔴 Obesitas
- **Tingkat aktivitas** user (Sedentary, Lightly Active, dll)
- **Tombol Hapus** (ikon sampah) di sudut kanan kartu

#### Modal Detail User

Klik kartu → modal detail muncul dengan informasi lengkap:
- Avatar besar + nama + email + role badge
- Grid 4 statistik: Berat Badan, Tinggi Badan, Usia, Jenis Kelamin
- Tampilan BMI khusus (berwarna sesuai kategori)
- Tingkat aktivitas
- User ID
- Tombol **Hapus Akun** (merah, dengan konfirmasi)

#### Penghapusan User

Penghapusan dilakukan dengan konfirmasi dialog dua langkah. Peringatan eksplisit bahwa **semua data user** (profil, history, bookmark) akan **terhapus permanen**.

#### Kalkulasi BMI Otomatis

```typescript
const getBMI = (u: User) => {
  if (!u.berat_badan || !u.tinggi_badan) return null;
  const h = u.tinggi_badan / 100;
  return (u.berat_badan / (h * h)).toFixed(1);
};
```

#### Data Model User

```typescript
interface User {
  id_user: string;
  email: string;
  nama: string;
  berat_badan: number;       // kg
  tinggi_badan: number;      // cm
  usia: number;
  jenis_kelamin: string;
  tingkat_aktivitas: string;
  foto_profil?: string;      // URL opsional
}
```

---

### 6.5 Kelola Makanan

**Route**: `/foods`  
**File**: `src/pages/Foods.tsx`

Halaman untuk mengelola database makanan dan nutrisi yang digunakan oleh AI GoDiet untuk rekomendasi diet.

#### Dua Sumber Data Makanan

Halaman ini menggabungkan dua sumber data:

1. **Data Server** — makanan yang tersimpan di database backend (Railway)
2. **Data Statis Lokal** — 25 makanan Indonesia yang telah dipreset di kode (tidak disimpan ke server, hanya tampil di UI)

Makanan statis yang tersedia antara lain: Nasi Putih, Mie Goreng, Ayam Goreng, Tempe Goreng, Tahu Goreng, Telur Ceplok, Soto Ayam, Bakso, Gado-Gado, Rendang Daging, Pisang, Pepaya, Jeruk, Roti Tawar, dan masih banyak lagi.

**Aturan penggabungan**: Jika nama makanan statis sudah ada di server, data statis dilewati (tidak duplikat).

#### Fitur CRUD Makanan

| Aksi | Deskripsi |
|---|---|
| **Tambah** | Modal form → POST ke API → reload data server |
| **Edit (Server)** | Modal form pre-filled → PUT ke API → reload |
| **Edit (Statis)** | Modal form pre-filled → update state lokal saja |
| **Hapus (Server)** | Konfirmasi → DELETE ke API → reload |
| **Hapus (Statis)** | Konfirmasi → hapus dari state lokal saja |

#### Tabel Makanan

Kolom: `Nama Makanan` | `Kategori` | `Kalori` | `Protein` | `Lemak` | `Karbo` | `Aksi`

- **Preview resep**: Ditampilkan 60 karakter pertama di bawah nama makanan
- **Kategori badge**: Label berwarna sesuai kategori
- **Tombol Edit** (ikon pensil) + **Tombol Hapus** (ikon sampah)

#### Kategori Makanan yang Tersedia

`Makanan Pokok` | `Lauk Pauk` | `Sayuran` | `Buah-buahan` | `Minuman` | `Snack` | `Dessert` | `Suplemen` | `Lainnya`

#### Modal Form Tambah/Edit Makanan

Field yang dapat diisi:
- **Nama Makanan*** (required)
- **Kategori** (dropdown)
- **Kalori** (angka, kcal)
- **Protein** (angka, gram)
- **Lemak** (angka, gram)
- **Karbohidrat** (angka, gram)
- **Resep / Deskripsi** (textarea)

#### Data Model Makanan

```typescript
interface FoodPayload {
  nama_makanan: string;
  kalori: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
  resep: string;
  kategori: string;
}

interface Food extends FoodPayload {
  id_makanan: string;
}
```

---

## 7. Komponen Reusable

### 7.1 Sidebar

**File**: `src/components/Sidebar.tsx`

Sidebar navigasi tetap di sisi kiri layar yang selalu tampil di semua halaman admin (kecuali Login).

**Konten Sidebar:**

**Header (Logo)**
- Menampilkan logo GoDiet (`image.png`) dengan tinggi 60px

**Navigasi Utama — Seksi "UTAMA"**
| Menu | Route | Ikon |
|---|---|---|
| Overview | `/overview` | `LayoutDashboard` |
| Reports | `/reports` | `BarChart2` |
| Kebugaran | `/fitness` | `Activity` |

**Navigasi Database — Seksi "DATABASE"**
| Menu | Route | Ikon |
|---|---|---|
| Kelola User | `/users` | `Users` |
| Kelola Makanan | `/foods` | `UtensilsCrossed` |

**Footer Sidebar**
- Avatar lingkaran berisi inisial email admin
- Tampilan email admin yang sedang login
- Tombol **Logout**

**Highlight Aktif**: Link yang sedang aktif otomatis mendapat class `active` melalui `NavLink` dari React Router.

---

### 7.2 StatCard

**File**: `src/components/StatCard.tsx`

Komponen kartu statistik yang digunakan berulang di halaman Overview dan Fitness.

**Props:**
```typescript
{
  title: string;           // Judul kartu
  value: React.ReactNode;  // Nilai utama (bisa string atau JSX)
  subtitle?: string;       // Teks keterangan di bawah nilai
  subtitleColor?: 'success' | 'warning' | 'info' | 'danger';
  icon?: React.ReactNode;  // Ikon (dari Lucide React)
  iconBgColor?: string;    // Warna background ikon
  iconColor?: string;      // Warna ikon
}
```

---

## 8. Modul API (api.ts)

**File**: `src/api.ts`

Semua komunikasi dengan backend terpusat di file ini.

### Base URL
```typescript
export const BASE_URL = 'https://web-production-78ab8.up.railway.app';
```

### Fungsi-Fungsi API

#### Autentikasi
```typescript
loginAdmin(email, password)   // POST /api/auth/login
```

#### Statistik
```typescript
fetchStats()        // GET /api/admin/stats
fetchFitnessData()  // GET /api/admin/fitness
```

#### Manajemen User
```typescript
fetchUsers()              // GET /api/admin/users
deleteUser(id_user)       // DELETE /api/admin/users/:id
```

#### Manajemen Makanan
```typescript
fetchFoods()                         // GET /api/admin/foods
createFood(data)                     // POST /api/admin/foods
updateFood(id_makanan, data)         // PUT /api/admin/foods/:id
deleteFood(id_makanan)               // DELETE /api/admin/foods/:id
```

#### Manajemen Laporan
```typescript
fetchReports()                           // GET /api/admin/reports
deleteReport(id_report)                  // DELETE /api/admin/reports/:id
updateReportStatus(id_report, status)    // PUT /api/admin/reports/:id/status
```

---

## 9. Deployment

Aplikasi di-deploy menggunakan **Railway** sebagai platform hosting.

### Konfigurasi Build

**`nixpacks.toml`** — Menggunakan Nixpacks sebagai build system untuk Railway.

**`railway.json`** — Konfigurasi Railway untuk menentukan:
- Perintah build: `npm run build` (TypeScript compile + Vite bundle)
- Perintah start: `npm run start` (menjalankan `serve -s dist -l $PORT`)

### Script NPM

```json
{
  "dev": "vite",               // Development server dengan HMR
  "build": "tsc -b && vite build",  // Build production
  "preview": "vite preview",   // Preview build production lokal
  "start": "serve -s dist -l $PORT" // Production server (Railway)
}
```

### Requirements
- Node.js **≥ 20.0.0**

---

## 10. Ringkasan Fitur Lengkap

| Fitur | Halaman | Deskripsi |
|---|---|---|
| Login Admin | `/login` | Autentikasi dengan role check |
| Dashboard Statistik | `/overview` | 8 stat card + 4 grafik interaktif |
| Pantauan Pertumbuhan User | `/overview` | Area chart 7 bulan |
| Distribusi Program Diet | `/overview` | Donut chart program |
| Compliance Monitoring | `/overview` | Trend kepatuhan workout |
| Notifikasi Real-time | `/overview` | Panel notifikasi dari server |
| Manajemen Laporan | `/reports` | CRUD laporan + update status |
| Filter Laporan | `/reports` | Tab: Semua/Menunggu/Selesai/Ditolak |
| Detail Laporan | `/reports` | Panel samping dengan aksi |
| Pantauan Fitness | `/fitness` | 4 stat card + 2 grafik |
| Tabel User Fitness | `/fitness` | Progress bar compliance + streak |
| Daftar Pengguna | `/users` | Grid kartu dengan info lengkap |
| Detail User | `/users` | Modal BMI + data fisik lengkap |
| Hapus Pengguna | `/users` | Konfirmasi dua langkah |
| Database Makanan | `/foods` | Tabel dengan data server + statis |
| Tambah Makanan | `/foods` | Form modal → POST ke API |
| Edit Makanan | `/foods` | Form modal → PUT ke API |
| Hapus Makanan | `/foods` | DELETE ke API dengan konfirmasi |
| Pencarian Real-time | Semua | Filter instan tanpa reload |
| Proteksi Route | Semua | Guard berdasarkan localStorage |
| Logout | Sidebar | Hapus sesi + redirect login |
| Loading State | Semua | Spinner animasi saat fetch data |
| Error State | Semua | Tampilan error + tombol retry |

---

*Dokumentasi ini dibuat berdasarkan analisis kode sumber proyek `admin_godiet` — versi terakhir diperbarui: 27 Mei 2026.*

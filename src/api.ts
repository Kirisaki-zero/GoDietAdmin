// src/api.ts
// ─────────────────────────────────────────────────────────────────────
// Konfigurasi sentral untuk semua panggilan API ke backend Railway
// ─────────────────────────────────────────────────────────────────────

export const BASE_URL = 'https://web-production-78ab8.up.railway.app';

/** Ambil admin ID dari localStorage (disimpan saat login berhasil) */
export function getAdminId(): string {
  return localStorage.getItem('admin_id') || '';
}

/** Header default yang dikirim ke semua endpoint admin */
export function adminHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Admin-Id': getAdminId(),
  };
}

// ── AUTH ──────────────────────────────────────────────────────────────

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// ── STATS ─────────────────────────────────────────────────────────────

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/api/admin/stats`, { headers: adminHeaders() });
  return res.json();
}

export async function fetchFitnessData() {
  const res = await fetch(`${BASE_URL}/api/admin/fitness`, { headers: adminHeaders() });
  return res.json();
}

// ── USERS ─────────────────────────────────────────────────────────────

export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/api/admin/users`, { headers: adminHeaders() });
  return res.json();
}

export async function deleteUser(id_user: string) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id_user}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  return res.json();
}

// ── FOODS ─────────────────────────────────────────────────────────────

export async function fetchFoods() {
  const res = await fetch(`${BASE_URL}/api/admin/foods`, { headers: adminHeaders() });
  return res.json();
}

export async function createFood(data: FoodPayload) {
  const res = await fetch(`${BASE_URL}/api/admin/foods`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateFood(id_makanan: string, data: FoodPayload) {
  const res = await fetch(`${BASE_URL}/api/admin/foods/${id_makanan}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteFood(id_makanan: string) {
  const res = await fetch(`${BASE_URL}/api/admin/foods/${id_makanan}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  return res.json();
}

// ── REPORTS ──────────────────────────────────────────────────────────

export async function fetchReports() {
  const res = await fetch(`${BASE_URL}/api/admin/reports`, { headers: adminHeaders() });
  return res.json();
}

export async function deleteReport(id_report: string) {
  const res = await fetch(`${BASE_URL}/api/admin/reports/${id_report}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
  return res.json();
}

export async function updateReportStatus(id_report: string, status: string) {
  const res = await fetch(`${BASE_URL}/api/admin/reports/${id_report}/status`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}


// ── TYPES ─────────────────────────────────────────────────────────────

export interface Report {
  id_report: string;
  id_user: string;
  username: string;
  judul: string;
  isi_laporan: string;
  kategori: string;
  status: string;
  created_at: string;
}

export interface FoodPayload {
  nama_makanan: string;
  kalori: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
  resep: string;
  kategori: string;
}

export interface Food extends FoodPayload {
  id_makanan: string;
}

export interface User {
  id_user: string;
  email: string;
  nama: string;
  berat_badan: number;
  tinggi_badan: number;
  usia: number;
  jenis_kelamin: string;
  tingkat_aktivitas: string;
}

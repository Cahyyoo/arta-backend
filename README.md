# Arta API Reference

Dokumentasi resmi backend sistem pengelolaan keuangan UMKM. Terintegrasi penuh dengan Supabase Auth & Storage.

**Base URL:** `http://localhost:3000/api`

---

## Otorisasi

Kamu **wajib** menyertakan Token JWT di dalam header request. Token ini didapatkan dari response saat melakukan Login.

**Headers:**

Authorization: Bearer <token_dari_login>


---

## 1. Transaksi (Protected)

### GET /transactions

Mengambil seluruh daftar transaksi khusus milik user yang sedang login.

### POST /transactions

Menambah transaksi baru. Karena bisa mengirim file gambar (invoice), endpoint ini wajib menggunakan format **form-data**, bukan JSON.

**Field yang dikirim (form-data):**

| Field | Tipe | Keterangan |
|-------|------|-------------|
| `type` | string | "Pemasukan" atau "Pengeluaran" |
| `amount` | number | Angka nominal (contoh: 150000) |
| `date` | string | Format YYYY-MM-DD |
| `category` | string | Kategori transaksi |
| `description` | string | Keterangan detail |
| `invoiceFile` | file | (Opsional) File gambar/PDF |

### PUT /transactions/:id

Memperbarui data transaksi yang sudah ada. Jika `invoiceFile` dikirim, lampiran lama akan diganti.

**Endpoint URL:** `/api/transactions/uuid-transaksi`

**Format:** `multipart/form-data`

### DELETE /transactions/:id

Menghapus transaksi berdasarkan ID. Backend otomatis mengecek agar user hanya bisa menghapus transaksinya sendiri.

---

## 2. Profil (Protected)

### PUT /profile

Memperbarui data metadata profil user di Supabase Auth.

**Request Body (JSON):**

```json
{
  "nama_lengkap": "Budi Santoso Update",
  "telepon": "08123456789",
  "nama_usaha": "Toko Kue Budi",
  "kategori_usaha": "Kuliner",
  "alamat_usaha": "Jl. Merdeka No 1",
  "bio": "Menjual kue tart enak"
}
```
© 2026 Artha API Services. Built for scaling.

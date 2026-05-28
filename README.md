# 🚀 Arta API Reference

Backend resmi sistem pengelolaan keuangan UMKM berbasis **Node.js + Express + Supabase** dengan fitur autentikasi, transaksi multi-tenant, AI forecasting, hingga laporan keuangan.

---

# 📌 Base URL

```bash
https://arta-backend-nine.vercel.app/api
```

---

# 🔐 Authentication

Semua endpoint protected wajib menggunakan JWT Token pada header:

```http
Authorization: Bearer <token_dari_login>
```

Token diperoleh dari endpoint login atau session Supabase OAuth.

---

# 1. 🔑 Authentication & Verification (Public)

## POST `/auth/register`

Mendaftarkan akun baru dan otomatis mengirim OTP 6 digit ke email pengguna.

### Request Body

```json
{
  "nama": "Juanda",
  "email": "user@email.com",
  "password": "password123"
}
```

---

## POST `/auth/verify-otp`

Memvalidasi kode OTP yang dikirim ke email saat registrasi.

### Request Body

```json
{
  "email": "user@email.com",
  "otp": "123456"
}
```

---

## POST `/auth/resend-otp`

Mengirim ulang OTP jika pengguna belum menerima email.

### Request Body

```json
{
  "email": "user@email.com"
}
```

---

## POST `/auth/login`

Login menggunakan email & password untuk mendapatkan JWT Token.

### Request Body

```json
{
  "email": "user@email.com",
  "password": "password123"
}
```

---

# 2. 🌐 Login Google OAuth

Login Google dilakukan langsung dari frontend menggunakan Supabase SDK.

## Contoh Implementasi React

```javascript
const handleGoogleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:5173/dashboard",
    },
  });

  if (error) {
    console.error(error.message);
  }
};
```

### Catatan

Setelah login berhasil:

* Ambil access token dari session Supabase
* Simpan token ke `localStorage`
* Gunakan token tersebut untuk mengakses endpoint protected

---

# 3. 💰 Transactions (Protected - Multi Tenant)

## GET `/transactions`

Mengambil seluruh transaksi berdasarkan business user yang login.

---

## POST `/transactions`

Menambahkan transaksi baru.

### Content-Type

```http
multipart/form-data
```

### Form Data

| Field       | Type   | Keterangan              |
| ----------- | ------ | ----------------------- |
| type        | string | Pemasukan / Pengeluaran |
| amount      | number | Nominal transaksi       |
| date        | string | Format YYYY-MM-DD       |
| description | string | Keterangan transaksi    |
| invoiceFile | file   | Optional                |

---

## PUT `/transactions/:id`

Memperbarui transaksi berdasarkan ID.

### Endpoint Example

```bash
/api/transactions/uuid-transaksi
```

---

## DELETE `/transactions/:id`

Menghapus transaksi berdasarkan ID.

---

# 4. 👤 Profile & Onboarding

## GET `/profile`

Mengambil data profil user login.

---

## POST `/profile/onboarding`

Menyimpan data onboarding user baru.

### Request Body

```json
{
  "user_type": "umkm_aktif",
  "nama_usaha": "Toko Maju",
  "tipe_usaha": "Kuliner",
  "lama_usaha": "1-3 Tahun"
}
```

---

## POST `/profile/upgrade`

Upgrade akun dari `calon_pengusaha` menjadi `umkm_aktif`.

### Request Body

```json
{
  "nama_usaha": "Bisnis Baru",
  "tipe_usaha": "Jasa",
  "lama_usaha": "> 3 Tahun"
}
```

---

## PUT `/profile`

Memperbarui data profil sekaligus password akun.

### Request Body

```json
{
  "nama_lengkap": "Juanda",
  "email": "user@email.com",
  "telepon": "08123456789",
  "bio": "Pemilik usaha",
  "password_lama": "admin123",
  "password_baru": "passwordBaru!"
}
```

---

# 5. 👥 User Management

## GET `/users`

Mengambil daftar seluruh user/karyawan.

---

## POST `/users`

Membuat akun karyawan baru.

### Request Body

```json
{
  "nama": "Admin Baru",
  "email": "admin@email.com",
  "role": "ADMIN",
  "business_id": "uuid-optional"
}
```

---

## PUT `/users/:id`

Memperbarui nama dan role user.

### Request Body

```json
{
  "nama": "Nama Baru",
  "role": "ADMIN"
}
```

---

## DELETE `/users/:id`

Menghapus akun user dari Supabase Auth.

---

# 6. 🏢 Business Settings

## PUT `/business`

Memperbarui identitas bisnis.

### Request Body

```json
{
  "name": "Warung Makan Sederhana",
  "type": "F&B",
  "industry": "Kuliner",
  "founded_year": "2020",
  "employee_count": "1-10 Karyawan",
  "description": "Menyediakan makanan padang",
  "phone": "08123456789",
  "email": "usaha@email.com",
  "address": "Jl. Merdeka No 1",
  "website": "https://usahaku.com",
  "instagram": "@usahaku",
  "nib": "123456789",
  "npwp": "00.000.000.0-000.000"
}
```

---

# 7. 🤖 Feasibility Test & AI Prediction

## GET `/feasibility-tests/latest`

Mengambil data kuesioner terakhir user.

---

## POST `/feasibility-tests`

Mengirim data kelayakan bisnis untuk diprediksi AI.

### Request Body

```json
{
  "initial_capital": 10000000,
  "tools_materials_percentage": 75,
  "marketing_percentage": 25,
  "roi_target_months": 18,
  "business_sector": "Jasa & Layanan Umum",
  "strategic_location": "Pinggir Jalan Raya Utama",
  "target_market": "Anak-anak",
  "last_education": "Sarjana (S1+)",
  "technical_expertise": "Pemrograman / IT",
  "has_business_experience": false
}
```

### Response Example

```json
{
  "message": "Kuesioner berhasil disimpan",
  "ai_prediction": {
    "feasibility_score": 85.5,
    "status": "Layak",
    "recommendation": "Bisnis memiliki probabilitas sukses tinggi"
  }
}
```

---

# 8. 📊 Dashboard Overview

## GET `/dashboard/overview`

Mengambil seluruh data dashboard dalam satu request.

### Response Example

```json
{
  "summary": {
    "income": 13100000,
    "expense": 5500000,
    "net_profit": 7600000,
    "health_status": "Very Healthy"
  }
}
```

---

# 9. 📈 AI Forecasting

## GET `/forecast`

Menghasilkan prediksi arus kas 7 hari ke depan menggunakan AI Forecasting.

### Response Example

```json
{
  "status": "success",
  "method_used": "LSTM",
  "actual_data": [],
  "ai_prediction": [],
  "insight": "Disarankan menambah stok minggu depan"
}
```

---

# 10. 📑 Financial Reports

## GET `/reports/financial`

Mengambil laporan finansial lengkap.

### Response Example

```json
{
  "summary": {
    "total_income": 37086723,
    "total_expense": 10855632,
    "net_profit": 26231091,
    "profit_margin_percent": 70.7
  }
}
```

---

# 🛠️ Tech Stack

* Node.js
* Express.js
* Supabase Auth
* Supabase Storage
* PostgreSQL
* Machine Learning API
* JWT Authentication

---

# 📂 Project Structure

```bash
├── controllers/
├── middlewares/
├── routes/
├── services/
├── utils/
├── app.js
├── server.js
└── README.md
```

---

# 🚀 Running Locally

## Install Dependencies

```bash
npm install
```

## Setup Environment

Buat file `.env`

```env
PORT=5000
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
JWT_SECRET=your_secret
```

## Run Development Server

```bash
npm run dev
```

Server berjalan di:

```bash
http://localhost:5000
```

---

# 📄 License

MIT License © 2026 Artha API Services

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// Middlewares Global
app.use(cors()); // Mengizinkan akses dari frontend
app.use(express.json()); // Membaca body JSON

// Daftarkan semua routes API ke prefix /api
app.use("/api", apiRoutes);

// Jika ada yang mengakses root URL (/), arahkan ke dokumentasi
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dokumentasi API Artha</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .method-get { @apply bg-blue-100 text-blue-700 border-blue-300; }
            .method-post { @apply bg-emerald-100 text-emerald-700 border-emerald-300; }
            .method-put { @apply bg-amber-100 text-amber-700 border-amber-300; }
            .method-delete { @apply bg-rose-100 text-rose-700 border-rose-300; }
            .method-oauth { @apply bg-purple-100 text-purple-700 border-purple-300; }
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        </style>
    </head>
    <body class="bg-slate-50 text-slate-800 font-sans antialiased pb-20 custom-scrollbar">
        
        <div class="max-w-5xl mx-auto px-4 mt-12">
            <header class="mb-12 border-b border-slate-200 pb-8 relative">
                <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">
                    v2.2 - OTP & Google Auth
                </div>
                <h1 class="text-4xl font-black text-slate-900 mb-3 tracking-tight">🚀 Artha API Reference</h1>
                <p class="text-slate-500 text-lg font-medium max-w-2xl">Dokumentasi resmi backend sistem pengelolaan keuangan UMKM. Terintegrasi penuh dengan Supabase Auth, OTP, dan Google Login.</p>
                
                <div class="mt-6 inline-flex items-center bg-white rounded-xl px-4 py-2 text-sm text-slate-600 border border-slate-200 shadow-sm">
                    <span class="font-bold mr-2 text-slate-800">Base URL:</span> 
                    <code class="text-indigo-600 font-mono">https://arta-backend-nine.vercel.app/api</code>
                </div>
            </header>

            <section class="mb-10">
                <h2 class="text-2xl font-black text-slate-800 mb-5 flex items-center gap-2">
                    👤 1. Autentikasi & Verifikasi (OTP)
                </h2>
                
                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">
                    <div class="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                        <span class="px-3 py-1 rounded-lg font-bold text-xs border method-post">POST</span>
                        <code class="text-base font-mono text-slate-700 font-bold">/auth/register</code>
                    </div>
                    <div class="p-5">
                        <p class="mb-2 text-slate-600 text-sm">Mendaftarkan akun baru. Sistem akan otomatis mengirimkan <strong>Kode OTP 6 Digit</strong> ke email pengguna.</p>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4 hover:border-emerald-300 transition-colors">
                    <div class="p-4 border-b border-slate-100 bg-emerald-50/30 flex items-center gap-4 relative">
                        <span class="px-3 py-1 rounded-lg font-bold text-xs border method-post">POST</span>
                        <code class="text-base font-mono text-slate-700 font-bold">/auth/verify-otp</code>
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase tracking-wider">New</span>
                    </div>
                    <div class="p-5">
                        <p class="mb-4 text-slate-600 text-sm">Memvalidasi kode OTP yang dikirim ke email saat pendaftaran.</p>
                        <div class="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>email: "user@email.com"</div>
                            <div>otp: "123456"</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">
                    <div class="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4 relative">
                        <span class="px-3 py-1 rounded-lg font-bold text-xs border method-post">POST</span>
                        <code class="text-base font-mono text-slate-700 font-bold">/auth/resend-otp</code>
                    </div>
                    <div class="p-5">
                        <p class="text-slate-600 text-sm">Mengirim ulang kode OTP jika pengguna tidak menerimanya (Kirim <code class="bg-slate-100 px-1 rounded text-xs">email</code> di Body JSON).</p>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">
                    <div class="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                        <span class="px-3 py-1 rounded-lg font-bold text-xs border method-post">POST</span>
                        <code class="text-base font-mono text-slate-700 font-bold">/auth/login</code>
                    </div>
                    <div class="p-5">
                        <p class="text-slate-600 text-sm">Login menggunakan Email & Password standar untuk mendapatkan <code>Access Token</code>.</p>
                    </div>
                </div>
            </section>

            <section class="mb-10">
                <h2 class="text-2xl font-black text-slate-800 mb-5 flex items-center gap-2">
                    🌐 2. Login via Google (OAuth)
                </h2>
                
                <div class="bg-white border border-purple-200 rounded-2xl shadow-md overflow-hidden relative">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent opacity-50 pointer-events-none"></div>
                    
                    <div class="p-4 border-b border-slate-100 bg-purple-50/50 flex items-center gap-4 relative z-10">
                        <span class="px-3 py-1 rounded-lg font-bold text-xs border method-oauth">CLIENT-SIDE</span>
                        <code class="text-base font-mono text-slate-700 font-bold">Supabase Auth SDK</code>
                    </div>
                    <div class="p-6 relative z-10">
                        <p class="mb-4 text-slate-600 text-sm leading-relaxed">
                            Login menggunakan Google <strong>tidak diproses melalui Backend Node.js</strong>. Aplikasi React langsung berkomunikasi dengan Supabase menggunakan metode <code class="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-purple-600">signInWithOAuth()</code>.
                        </p>
                        
                        <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Cara Penggunaan di React (Frontend):</h4>
                        <pre class="bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm overflow-x-auto font-mono leading-relaxed">
<span class="text-purple-400">const</span> handleGoogleLogin = <span class="text-blue-400">async</span> () => {
  <span class="text-purple-400">const</span> { data, error } = <span class="text-blue-400">await</span> supabase.auth.<span class="text-amber-300">signInWithOAuth</span>({
    provider: <span class="text-green-300">'google'</span>,
    options: {
      redirectTo: <span class="text-green-300">'https://domain-kamu.com/dashboard'</span>
    }
  });
};</pre>
                        <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start">
                            <span class="text-amber-500 text-lg">⚠️</span>
                            <p class="text-xs text-amber-800 font-medium">
                                <strong>Penting:</strong> Setelah login Google berhasil, token (Session) akan otomatis tersimpan di penyimpanan browser oleh Supabase. Kamu harus mengambil token tersebut menggunakan <code>supabase.auth.getSession()</code> lalu menyimpannya ke <code>localStorage</code> agar API backend (seperti Transaksi) bisa mendeteksinya.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mb-10 opacity-70 hover:opacity-100 transition-opacity">
                <h2 class="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                    💸 3. Operasi Data (Memerlukan Token)
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                        <span class="px-2 py-1 rounded text-[10px] font-bold border method-get">GET</span>
                        <span class="font-mono text-sm font-bold text-slate-600">/transactions</span>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                        <span class="px-2 py-1 rounded text-[10px] font-bold border method-post">POST</span>
                        <span class="font-mono text-sm font-bold text-slate-600">/transactions (Form-Data)</span>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                        <span class="px-2 py-1 rounded text-[10px] font-bold border method-put">PUT</span>
                        <span class="font-mono text-sm font-bold text-slate-600">/transactions/:id</span>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                        <span class="px-2 py-1 rounded text-[10px] font-bold border method-put">PUT</span>
                        <span class="font-mono text-sm font-bold text-slate-600">/profile</span>
                    </div>
                </div>
            </section>

            <footer class="mt-16 text-center text-slate-400 text-xs font-medium border-t border-slate-200 pt-6">
                &copy; 2026 Artha - Keuangan Cerdas UMKM.
            </footer>
        </div>
    </body>
    </html>
  `);
});

// Menjalankan Server (Module Exports Wajib untuk Vercel)
module.exports = app;
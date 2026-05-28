const supabase = require("../config/supabase");

/**
 * JWT Auth Middleware
 * Melindungi rute API dengan validasi token Supabase.
 * 
 * Urutan Validasi:
 * 1. Cek header Authorization: Bearer <token>
 * 2. Verifikasi JWT via Supabase getUser()
 * 3. Set req.user dengan data user terautentikasi
 * 4. Isolasi data: query selanjutnya bisa filter by user_id
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Cek header Authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Akses ditolak. Token tidak ditemukan.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verifikasi JWT menggunakan Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        status: "error",
        message: "Token tidak valid atau sudah expired.",
      });
    }

    // 3. Set req.user untuk digunakan di controller
    req.user = data.user;
    req.token = token;

    // 4. Lanjut ke handler berikutnya
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({
      status: "error",
      message: "Gagal memvalidasi token autentikasi.",
    });
  }
};

module.exports = authMiddleware;

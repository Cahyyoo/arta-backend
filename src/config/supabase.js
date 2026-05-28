require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Arahkan kembali ke halaman dashboard setelah sukses login dari Google
        redirectTo: 'http://localhost:5173/dashboard' 
      }
    });

    if (error) {
      console.error("Gagal login dengan Google:", error.message);
      alert("Terjadi kesalahan saat login dengan Google");
    }
};

module.exports = {supabase, handleGoogleLogin};

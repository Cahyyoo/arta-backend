const supabaseAdmin = require('../config/supabaseAdmin');

// 1. GET: Mengambil Daftar Semua Pengguna
exports.getUsers = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        
        if (error) throw error;

        // Merapikan data untuk dikirim ke frontend
        const formattedUsers = data.users.map(user => ({
            id: user.id,
            email: user.email,
            nama: user.user_metadata?.nama || 'Tanpa Nama',
            role: user.user_metadata?.role || 'USER',
            status: 'Aktif',
            created_at: user.created_at
        }));

        res.status(200).json(formattedUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. POST: Membuat Akun Karyawan Baru
exports.createUser = async (req, res) => {
    try {
        const { nama, email, role } = req.body;

        // Karena di UI tidak ada input password, kita berikan password default
        // Nantinya pengguna bisa mengubahnya melalui fitur "Lupa Password"
        const defaultPassword = "PasswordDefault123!"; 

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: defaultPassword,
            email_confirm: true, // Langsung aktif tanpa perlu konfirmasi email
            user_metadata: {
                nama: nama,
                role: role.toUpperCase() // OWNER, ADMIN, atau USER
            }
        });

        if (error) throw error;

        res.status(201).json({ 
            message: "Akun berhasil dibuat", 
            user: data.user 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 3. PUT: Mengedit Role / Nama Karyawan
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, role } = req.body;

        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
            user_metadata: {
                nama: nama,
                role: role.toUpperCase()
            }
        });

        if (error) throw error;

        res.status(200).json({ 
            message: "Data pengguna berhasil diperbarui", 
            user: data.user 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 4. DELETE: Menghapus Akun Karyawan
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Hapus pengguna secara permanen dari auth.users
        const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (error) throw error;

        res.status(200).json({ message: "Pengguna berhasil dihapus" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
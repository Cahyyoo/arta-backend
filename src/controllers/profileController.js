const supabase = require("../config/supabase");

exports.updateProfile = async (req, res) => {
  // API bawaan Supabase untuk update metadata user
  const { data, error } = await supabase.auth.admin.updateUserById(
    req.user.id,
    { user_metadata: req.body },
  );

  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ message: "Profil diperbarui", user: data.user });
};

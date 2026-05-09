const supabase = require("../config/supabase");

exports.getTransactions = async (req, res) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", req.user.id) // Hanya ambil transaksi milik user yang login
    .order("date", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json(data);
};

exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, date, category, description } = req.body;
    let invoice_name = null;
    let invoice_url = null;

    // Jika ada file gambar diupload
    if (req.file) {
      const file = req.file;
      const uniqueFileName = `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("attachments") // Pastikan kamu sudah buat public bucket bernama 'attachments'
        .upload(uniqueFileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(uniqueFileName);
      invoice_name = file.originalname;
      invoice_url = urlData.publicUrl;
    }

    // Insert ke database
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: req.user.id,
          type,
          amount: Number(amount),
          date,
          category,
          description,
          invoice_name,
          invoice_url,
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ message: "Transaksi berhasil dihapus" });
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, date, category, description } = req.body;

    // Siapkan objek data yang akan diupdate
    let updateData = {
      type,
      amount: Number(amount),
      date,
      category,
      description,
    };

    // Jika user mengunggah gambar invoice baru, kita proses upload-nya
    if (req.file) {
      const file = req.file;
      const uniqueFileName = `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(uniqueFileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(uniqueFileName);
      updateData.invoice_name = file.originalname;
      updateData.invoice_url = urlData.publicUrl;
    }

    // Lakukan update ke database Supabase
    const { data, error } = await supabase
      .from("transactions")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", req.user.id) // Pastikan user hanya bisa edit transaksinya sendiri
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

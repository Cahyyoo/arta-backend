const supabase = require('../config/supabase'); 
const axios = require('axios'); // Pastikan kamu sudah install axios: npm install axios

// 1. POST: Menyimpan Data Kuesioner & Mengirim ke Model AI
exports.submitQuestionnaire = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            initial_capital,
            tools_materials_percentage,
            marketing_percentage,
            roi_target_months,
            business_sector,
            strategic_location,
            target_market,
            last_education,
            technical_expertise,
            has_business_experience
        } = req.body;

        // Validasi input dasar dari UI
        if (initial_capital === undefined || !business_sector || !strategic_location) {
            return res.status(400).json({ message: "Beberapa field wajib dari form belum diisi!" });
        }

        // --- TAHAP 1: SIMPAN DATA ORIGINAL KE SUPABASE ---
        const { data: dbData, error: dbError } = await supabase
            .from('business_feasibility_questionnaires')
            .insert([{
                user_id: userId,
                initial_capital,
                tools_materials_percentage,
                marketing_percentage,
                roi_target_months,
                business_sector,
                strategic_location,
                target_market,
                last_education,
                technical_expertise,
                has_business_experience,
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (dbError) throw dbError;

        // --- TAHAP 2: MAPPING & HARDCODING UNTUK MODEL AI ---
        
        // A. Konversi Pendidikan (1=SD, 2=SMP, 3=SMA, 4=D3/S1, 5=S2/S3)
        let eduLevel = 3; // Default SMA
        const eduLower = last_education ? last_education.toLowerCase() : "";
        if (eduLower.includes("sd")) eduLevel = 1;
        else if (eduLower.includes("smp")) eduLevel = 2;
        else if (eduLower.includes("sma") || eduLower.includes("smk")) eduLevel = 3;
        else if (eduLower.includes("sarjana") || eduLower.includes("s1") || eduLower.includes("d3")) eduLevel = 4;
        else if (eduLower.includes("s2") || eduLower.includes("s3")) eduLevel = 5;

        // B. Konversi Upaya Pemasaran (Persentase ke skala 1-10)
        let mktEffort = Math.ceil((marketing_percentage || 0) / 10);
        if (mktEffort < 1) mktEffort = 1;
        if (mktEffort > 10) mktEffort = 10;

        // C. Konversi Pengalaman Industri (Boolean ke angka tahun)
        // Kita asumsikan jika mereka menjawab "Ya", mereka punya pengalaman 2 tahun
        let indExperience = has_business_experience ? 2 : 0;

        // D. Buat Payload sesuai skema UMKMInput
        const mlPayload = {
            Age: 30,                                        // Hardcoded: Asumsi usia 30 tahun
            Education: eduLevel,                            // Mapped dari last_education
            Initial_Capital: initial_capital > 0 ? 1 : 0,   // Mapped: 1 jika ada nominal, 0 jika tidak
            Financial_Record_Keeping: 0,                    // Hardcoded: 0 (Belum punya catatan)
            Internet_Usage: 1,                              // Hardcoded: 1 (Ya, karena menggunakan aplikasi web ini)
            Business_Plan: 0,                               // Hardcoded: 0
            Marketing_Effort: mktEffort,                    // Mapped dari marketing_percentage
            Partnership: 0,                                 // Hardcoded: 0
            Parent_Business_Experience: 0,                  // Hardcoded: 0
            Industry_Experience: indExperience,             // Mapped dari has_business_experience
            Owner_Gender: 1,                                // Hardcoded: 1 (Laki-laki)
            Professional_Advice: 1                          // Hardcoded: Skala 1 (Paling rendah)
        };

        // --- TAHAP 3: HIT API MACHINE LEARNING ---
        let aiPrediction = null;
        try {
            // Sesuaikan URL ini dengan endpoint API ML prediksi kelayakanmu
            const mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000';
            const aiResponse = await axios.post(`${mlApiUrl}/predict-feasibility`, mlPayload);
            aiPrediction = aiResponse.data;
        } catch (mlError) {
            console.error("Gagal menghubungi Model AI Kelayakan:", mlError.message);
            // Kita tidak throw error agar user tetap bisa lanjut meski AI sedang mati
        }

        // Kembalikan response gabungan (Data tersimpan + Hasil Prediksi)
        res.status(201).json({
            message: "Kuesioner kelayakan berhasil disimpan!",
            saved_data: dbData,
            ai_input_used: mlPayload, // Bisa dihapus nanti, ini berguna untuk debugging di frontend
            ai_prediction: aiPrediction || { message: "AI saat ini tidak tersedia", default_score: 50 }
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 2. GET: Mengambil Riwayat/Data Kuesioner Terbaru Milik User
exports.getLatestResponse = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('business_feasibility_questionnaires')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Kamu belum pernah mengisi kuesioner kelayakan." });
        }

        res.status(200).json(data[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
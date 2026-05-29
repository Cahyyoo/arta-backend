const express = require("express");
const router = express.Router();

const uploadMiddleware = require("../middlewares/uploadMiddleware");
const transactionController = require("../controllers/transactionController");
const profileController = require("../controllers/profileController");
const userController = require('../controllers/userController');
const businessController = require('../controllers/businessController');
const feasibilityController = require('../controllers/feasibilityController');
const dashboardController = require('../controllers/dashboardController');
const forecastController = require('../controllers/forecastController');
const reportController = require('../controllers/reportController');
const authMiddleware = require("../middlewares/authMiddleware");

// --- HEALTH (Dibutuhkan oleh Dashboard.jsx) ---
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Berhasil terhubung ke server Back-End!" });
});

// --- TRANSACTIONS (Dilindungi authMiddleware) ---
router.get("/transactions", transactionController.getTransactions);
router.post(
  "/transactions",
  uploadMiddleware.single("invoiceFile"),
  transactionController.createTransaction,
);
router.put(
  "/transactions/:id",
  uploadMiddleware.single("invoiceFile"),
  transactionController.updateTransaction,
);
router.delete("/transactions/:id", transactionController.deleteTransaction);

// PROFILE USER 
// GET /api/profile — Ambil profil user
router.get("/profile", profileController.getProfile);
// POST /api/profile/onboarding — Simpan hasil onboarding
router.post("/profile/onboarding", profileController.updateOnboarding);
// POST /api/profile/upgrade — Upgrade ke UMKM Aktif
router.post("/profile/upgrade", profileController.upgradeToUmkm);
// PUT /api/profile — Update Informasi Pribadi & Keamanan (Password)
router.put("/profile", profileController.updateProfile);

// Rute Manajemen Pengguna (Karyawan)
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Edit Profile Company
router.put('/business', businessController.updateBusiness);

// Rute Kuesioner Kelayakan Bisnis (Protected)
router.post('/feasibility-tests', feasibilityController.submitQuestionnaire);
router.get('/feasibility-tests/latest', feasibilityController.getLatestResponse);

// Route Dashboard Overview (Protected)
router.get('/dashboard/overview', dashboardController.getOverview);

// Route Prediksi AI (Protected)
router.get('/forecast', forecastController.getForecast);

// Route Laporan Keuangan
router.get('/reports/financial', reportController.getFinancialReport);

module.exports = router;

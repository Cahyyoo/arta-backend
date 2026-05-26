const express = require("express");
const router = express.Router();

const uploadMiddleware = require("../middlewares/uploadMiddleware");
const transactionController = require("../controllers/transactionController");
const profileController = require("../controllers/profileController");
const userController = require('../controllers/userController');

// --- HEALTH (Dibutuhkan oleh Dashboard.jsx) ---
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Berhasil terhubung ke server Back-End ✅" });
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

// --- PROFILE ---
router.put("/profile", profileController.updateProfile);

// Rute Manajemen Pengguna (Karyawan)
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;

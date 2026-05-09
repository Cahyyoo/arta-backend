const express = require("express");
const router = express.Router();

const uploadMiddleware = require("../middlewares/uploadMiddleware");
const transactionController = require("../controllers/transactionController");
const profileController = require("../controllers/profileController");

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

module.exports = router;

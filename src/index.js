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

app.use(express.static(path.join(__dirname, "../public")));

// Jika ada yang mengakses root URL (/), arahkan ke file index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Menjalankan Server
module.exports = app;

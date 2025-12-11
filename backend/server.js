// backend/server.js

require('dotenv').config(); // Memuat variabel lingkungan dari .env
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Koneksi MySQL Pool

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const port = process.env.PORT || 5000;

// ===================================
// 1. MIDDLEWARE GLOBAL (HARUS DI ATAS)
// ===================================
app.use(cors()); // Mengizinkan Front-end mengakses Back-end
app.use(express.json()); // Untuk parsing body JSON dari request (POST/PUT)

// =======================
// 2. KONEKSI DATABASE
// =======================
db.getConnection()
    .then(connection => {
        console.log('MySQL/MariaDB Terkoneksi.');
        connection.release();
    })
    .catch(err => {
        console.error('Koneksi Database Gagal:', err.message);
        // Penting: Pastikan server MySQL Anda berjalan
    });

// =======================
// 3. GUNAKAN ROUTES
// =======================
app.use('/api/auth', authRoutes); // Route Autentikasi (Login)
app.use('/api/products', productRoutes); // Route Produk (Perlu Proteksi JWT)
app.use('/api/transactions', transactionRoutes); // Route Transaksi (Perlu Proteksi JWT)

// Endpoint Testing Root
app.get('/', (req, res) => {
    res.send('Kasir API Berjalan!');
});


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
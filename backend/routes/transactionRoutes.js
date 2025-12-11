// backend/routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware'); // Pastikan ini diimpor

// Route POST untuk Checkout / Transaksi
router.post(
    '/checkout', 
    // 1. PERBAIKAN: IZIN - Sertakan 'bos' agar bos juga bisa melakukan transaksi
    authMiddleware.protect(['kasir', 'bos']), 
    // 2. PERBAIKAN: TYPERROR - Ganti handleCheckout menjadi checkout 
    //    (Karena di controller Anda mengekspor exports.checkout)
    transactionController.checkout 
);

// Route GET untuk Laporan (Biasanya hanya untuk Bos)
router.get(
    '/report', 
    authMiddleware.protect(['bos']),
    transactionController.getReport
);

module.exports = router;
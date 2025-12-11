// backend/routes/productRoutes.js (Perubahan)
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); // <--- IMPORT MIDDLEWARE

// Semua endpoint produk sekarang memerlukan token dan peran tertentu
router.get('/', authMiddleware.protect(['kasir', 'bos']), productController.getAllProducts);
router.post('/', authMiddleware.protect(['kasir', 'bos']), productController.createProduct);
router.put('/:id', authMiddleware.protect(['kasir', 'bos']), productController.updateProduct);
router.delete('/:id', authMiddleware.protect(['bos']), productController.deleteProduct); // Hanya Bos yang boleh hapus

module.exports = router;
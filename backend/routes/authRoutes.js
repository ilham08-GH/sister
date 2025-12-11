// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// PASTIKAN BARIS INI BENAR
router.post('/login', authController.login); 

module.exports = router;
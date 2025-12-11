// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'admin123'; 

// Middleware untuk memverifikasi token dan mengambil role
exports.protect = (roles = []) => (req, res, next) => {
    // Ambil token dari header (Bearer Token)
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan atau format salah.' });
    }
    
    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Menyimpan data pengguna (id, role) di objek request

        // Otorisasi berdasarkan role (jika roles ditentukan)
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Akses terlarang. Anda tidak memiliki izin (' + req.user.role + ').' });
        }

        next(); // Lanjut ke controller jika token valid dan role diizinkan

    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid.' });
    }
};
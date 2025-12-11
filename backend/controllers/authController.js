// backend/controllers/authController.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mengambil secret key dari .env (atau default jika tidak ada)
const JWT_SECRET = process.env.JWT_SECRET || 'admin123'; 

// @route   POST /api/auth/login
// @desc    Login pengguna dan kembalikan token
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Cari pengguna berdasarkan username
        const [users] = await db.query('SELECT id, password, role FROM users WHERE username = ?', [username]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ message: 'Username atau password salah.' });
        }

        // 2. Bandingkan password (menggunakan hash)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Username atau password salah.' });
        }

        // 3. Jika cocok, buat JSON Web Token (JWT)
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Payload (data yang disimpan dalam token)
            JWT_SECRET,
            { expiresIn: '1d' } // Token berlaku 1 hari
        );

        // 4. Kirim token dan data user kembali ke front-end
        res.json({ token, user: { id: user.id, username, role: user.role } });

    } catch (error) {
        console.error('Error login:', error);
        res.status(500).json({ message: 'Server error saat login.' });
    }
};

// Fungsi utilitas untuk hashing, bisa digunakan untuk mengisi tabel users
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
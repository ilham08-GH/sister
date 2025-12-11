require('dotenv').config(); // Muat variabel dari .env
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import koneksi DB

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Untuk parsing JSON body

// Coba koneksi database saat startup
db.getConnection()
    .then(connection => {
        console.log('MySQL/MariaDB Terkoneksi.');
        connection.release();
    })
    .catch(err => {
        console.error('Koneksi Database Gagal:', err.message);
        // Hentikan aplikasi jika DB gagal konek
        // process.exit(1); 
    });

// Endpoint testing
app.get('/', (req, res) => {
    res.send('Kasir API Berjalan!');
});

// To Do: Import dan gunakan router untuk produk dan transaksi
// app.use('/api/products', require('./routes/productRoutes'));

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
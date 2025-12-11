// backend/controllers/productController.js
const db = require('../db');

// @route   GET /api/products
// @desc    Mendapatkan semua produk
exports.getAllProducts = async (req, res) => {
    try {
        // Query sudah benar: mengambil array rows pertama
        const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
        
        // PENTING: Gunakan JSON.stringify dan JSON.parse jika Anda menggunakan driver 
        // yang mengembalikan nilai DECIMAL sebagai string (mysql2 biasanya mengonversi dengan baik, tapi ini aman).
        // Kita asumsikan rows sudah berupa Array of Objects yang siap dikirim.
        res.json(rows); 
        
    } catch (error) {
        console.error('Error saat mengambil produk:', error);
        res.status(500).json({ message: 'Gagal mengambil data produk dari database.' });
    }
};

// @route   POST /api/products
// @desc    Menambah produk baru (CREATE)
exports.createProduct = async (req, res) => {
    const { name, price, stock } = req.body;
    
    // Perbaikan: Memastikan price adalah angka positif dan name ada
    if (!name || !price || isNaN(price) || price <= 0 || stock === undefined || isNaN(stock) || stock < 0) {
        return res.status(400).json({ message: 'Nama, harga (>0), dan stok (>=0) wajib diisi dengan nilai yang valid.' });
    }

    try {
        const sql = 'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [name, price, stock]);
        
        // Mengirimkan data produk yang baru dibuat
        res.status(201).json({ 
            id: result.insertId, 
            name, 
            price: parseFloat(price), 
            stock: parseInt(stock),
            message: 'Produk berhasil ditambahkan.'
        });
    } catch (error) {
        console.error('Error saat membuat produk:', error);
        // Tangani jika ada error UNIQUE (misalnya, jika ada field UNIQUE selain ID)
        res.status(500).json({ message: 'Gagal menambahkan produk ke database.' });
    }
};

// @route   PUT /api/products/:id
// @desc    Mengubah detail produk (UPDATE)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    
    // Perbaikan: Memastikan semua field yang dibutuhkan untuk update disertakan
    if (!name || !price || isNaN(price) || price <= 0 || stock === undefined || isNaN(stock) || stock < 0) {
         return res.status(400).json({ message: 'Semua field (Nama, Harga, Stok) wajib diisi dengan nilai yang valid untuk pembaruan.' });
    }

    try {
        const sql = 'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?';
        const [result] = await db.query(sql, [name, price, stock, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Produk dengan ID ${id} tidak ditemukan.` });
        }
        
        // Return data yang diperbarui untuk kemudahan front-end
        res.json({ id: parseInt(id), name, price: parseFloat(price), stock: parseInt(stock), message: 'Produk berhasil diperbarui.' });
    } catch (error) {
        console.error('Error saat memperbarui produk:', error);
        res.status(500).json({ message: 'Gagal memperbarui produk.' });
    }
};

// @route   DELETE /api/products/:id
// @desc    Menghapus produk (DELETE)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        
        // Status 200 OK sudah cukup untuk DELETE, pesan di body
        res.json({ message: `Produk dengan ID ${id} berhasil dihapus.` }); 
    } catch (error) {
        console.error('Error saat menghapus produk:', error);
        res.status(500).json({ message: 'Gagal menghapus produk.' });
    }
};
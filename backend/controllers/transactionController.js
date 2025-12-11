// backend/controllers/transactionController.js
const db = require('../db');

// @route   POST /api/transactions/checkout
// @desc    Memproses checkout dan mengurangi stok (menggunakan MySQL Transaction)
exports.checkout = async (req, res) => {
    const { cartItems, paymentMethod } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Keranjang kosong.' });
    }

    // Mendapatkan koneksi dari pool untuk memulai transaksi
    let connection;
    try {
        connection = await db.getConnection(); 
        await connection.beginTransaction(); // <-- MULAI TRANSAKSI MYSQL

        // 1. Hitung total transaksi
        // Menggunakan parseFloat untuk memastikan kalkulasi yang benar
        const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

        // 2. Insert ke tabel transactions
        const [transResult] = await connection.query(
            'INSERT INTO transactions (total_amount, payment_method) VALUES (?, ?)',
            [totalAmount, paymentMethod || 'Cash']
        );
        const transactionId = transResult.insertId;

        // 3. Proses setiap item di keranjang (Insert details & Update stock)
        for (const item of cartItems) {
            // A. Update stok
            // Menggunakan sintaks MySQL untuk mengurangi stok dengan aman
            const [stockResult] = await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
                [item.quantity, item.id, item.quantity]
            );

            if (stockResult.affectedRows === 0) {
                // Jika stok tidak cukup atau produk tidak ditemukan, batalkan transaksi
                await connection.rollback(); 
                return res.status(400).json({ 
                    message: `Stok produk ${item.name} (${item.id}) tidak cukup atau tidak valid.` 
                });
            }

            // B. Insert ke transaction_details
            const subtotal = parseFloat(item.price) * item.quantity;
            await connection.query(
                'INSERT INTO transaction_details (transaction_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)',
                [transactionId, item.id, item.quantity, subtotal]
            );
        }

        await connection.commit(); // <-- SEMUA BERHASIL, PERMANENKAN PERUBAHAN
        res.status(201).json({ 
            message: 'Transaksi berhasil!', 
            transactionId, 
            totalAmount 
        });

    } catch (error) {
        if (connection) {
            await connection.rollback(); // <-- JIKA ADA ERROR, BATALKAN SEMUA
        }
        console.error('Error saat proses checkout:', error);
        res.status(500).json({ message: 'Proses transaksi gagal di server.', error: error.message });
    } finally {
        if (connection) {
            connection.release(); // Lepaskan koneksi kembali ke pool
        }
    }
};


// @route   GET /api/transactions/report
// @desc    Mendapatkan daftar semua transaksi beserta detailnya (Untuk Halaman Bos)
exports.getReport = async (req, res) => {
    try {
        // Query kompleks untuk mengambil semua transaksi beserta detail itemnya
        const sql = `
            SELECT 
                t.id AS transaction_id, 
                t.transaction_date, 
                t.total_amount, 
                td.quantity, 
                td.subtotal, 
                p.name AS product_name, 
                p.price
            FROM transactions t
            JOIN transaction_details td ON t.id = td.transaction_id
            JOIN products p ON td.product_id = p.id
            ORDER BY t.transaction_date DESC;
        `;
        const [rows] = await db.query(sql);

        // Mengelompokkan hasil per ID Transaksi
        const groupedReports = rows.reduce((acc, row) => {
            const transactionId = row.transaction_id;
            if (!acc[transactionId]) {
                acc[transactionId] = {
                    transaction_id: transactionId,
                    transaction_date: row.transaction_date,
                    total_amount: row.total_amount,
                    items: []
                };
            }
            acc[transactionId].items.push({
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.price
            });
            return acc;
        }, {});

        // Mengubah objek menjadi array untuk front-end
        res.json(Object.values(groupedReports));

    } catch (error) {
        console.error('Error saat mengambil laporan:', error);
        res.status(500).json({ message: 'Gagal mengambil data laporan dari database.' });
    }
};
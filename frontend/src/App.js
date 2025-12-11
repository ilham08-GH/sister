import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Asumsi Anda memiliki file styling (bisa diabaikan jika belum ada)

// Definisikan BASE_URL untuk API
const API_URL = 'http://localhost:5000/api'; 

export default function App() {
    // State untuk menyimpan daftar produk dari API
    const [products, setProducts] = useState([]);
    // State untuk menangani pesan error dari API
    const [error, setError] = useState(null);
    // State untuk keranjang belanja (cart)
    const [cart, setCart] = useState([]);

    // --- FUNGSI MENGAMBIL DATA PRODUK DARI BACK-END ---
    useEffect(() => {
        // Karena kita belum membuat endpoint /api/products, 
        // kita akan coba memanggil endpoint root sementara (/)
        axios.get(API_URL.replace('/api', '')) // Mengakses http://localhost:5000/
            .then(response => {
                console.log("Koneksi API Berhasil. Respon:", response.data);
                // Untuk uji coba, kita isi produk dummy karena endpoint produk belum dibuat
                setProducts([
                    { id: 1, name: "Soda Dingin", price: 5000, stock: 50 },
                    { id: 2, name: "Keripik Kentang", price: 12500, stock: 30 },
                    { id: 3, name: "Kopi Sachet", price: 2500, stock: 100 },
                ]);
                setError(null);
            })
            .catch(err => {
                console.error("Gagal terhubung ke API:", err);
                setError("Gagal terhubung ke API. Pastikan server Node.js berjalan di port 5000.");
            });
    }, []);

    // --- FUNGSI LOGIKA KASIR ---

    const addToCart = (product) => {
        // Cek apakah produk sudah ada di keranjang
        const exist = cart.find(item => item.id === product.id);
        
        if (exist) {
            // Jika ada, tambahkan kuantitasnya
            setCart(
                cart.map(item =>
                    item.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : item
                )
            );
        } else {
            // Jika belum ada, tambahkan produk baru dengan quantity 1
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }
        // Di sini nanti kita akan memanggil API POST ke /api/transactions
        alert(`Total Pembayaran: Rp ${calculateTotal().toLocaleString('id-ID')}`);
        // Reset keranjang setelah transaksi sukses
        setCart([]);
    };

    // --- TAMPILAN (RENDER) ---

    return (
        <div className="app-container">
            <header>
                <h1>Sistem Kasir Modern (POS)</h1>
            </header>
            
            <main className="cashier-layout">
                
                {/* Bagian Kiri: Daftar Produk */}
                <div className="product-list-panel">
                    <h2>Daftar Produk</h2>
                    {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                    
                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <h4>{product.name}</h4>
                                <p>Rp {product.price.toLocaleString('id-ID')}</p>
                                <p>Stok: {product.stock}</p>
                                <button onClick={() => addToCart(product)}>Tambah ke Keranjang</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bagian Kanan: Keranjang & Pembayaran */}
                <div className="cart-panel">
                    <h2>Keranjang ({cart.length} Item)</h2>
                    
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Produk</th>
                                <th>Harga</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.price.toLocaleString('id-ID')}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="total-summary">
                        <h3>Total: </h3>
                        <h3 className="total-amount">
                            Rp {calculateTotal().toLocaleString('id-ID')}
                        </h3>
                    </div>

                    <button 
                        className="checkout-button"
                        onClick={handleCheckout} 
                        disabled={cart.length === 0}
                    >
                        Proses Pembayaran
                    </button>
                </div>
            </main>
        </div>
    );
}

// Catatan: Anda mungkin perlu membuat file App.css sederhana agar tata letak terlihat rapi.
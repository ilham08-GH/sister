import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import { useAuth } from './AuthContext'; // <--- IMPORT PENTING: Untuk mengakses token
import { Spinner, Button } from 'react-bootstrap'; // <--- PASTIKAN INI ADA DI ATAS

const API_URL = 'http://localhost:5000/api'; 

// Menggunakan Button dari react-bootstrap untuk tampilan yang konsisten dan tombol Logout

export default function CashierPage() { 
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Ambil token dan fungsi logout dari AuthContext
    const { token, handleLogout } = useAuth(); 

    // --- FUNGSI UTAMA: MENGAMBIL DATA PRODUK DARI BACK-END ---
    const fetchProducts = async () => {
        // Jika belum ada token, hentikan permintaan.
        if (!token) return; 

        setIsLoading(true);
        setError(null);
        try {
            // Karena kita sudah set axios.defaults.headers.common['Authorization'] di AuthContext
            // kita bisa langsung memanggil GET.
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
            
        } catch (err) {
            console.error("Gagal memuat produk:", err.response || err.message);
            
            // Tangani error proteksi (401/403)
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                // Logout otomatis jika token ditolak atau kadaluarsa
                handleLogout(); 
                setError("Sesi kedaluwarsa atau akses ditolak. Silakan login kembali.");
            } else {
                setError("Gagal memuat data produk. Pastikan server Node.js berjalan di port 5000.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Panggil fetchProducts SETIAP KALI token berubah (setelah login)
    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [token]); // <-- Dependency array harus menyertakan token

    // --- LOGIKA KERANJANG (Logika ini sudah benar) ---
    const addToCart = (product) => {
        const exist = cart.find(item => item.id === product.id);
        
        // Cek stok (gunakan data produk terbaru dari state 'products' untuk validasi stok)
        const currentProductData = products.find(p => p.id === product.id);
        const currentStock = currentProductData ? currentProductData.stock : 0;
        
        if (exist && exist.quantity >= currentStock) {
            alert(`Stok ${product.name} hanya tersisa ${currentStock}!`);
            return;
        }

        if (exist) {
            setCart(
                cart.map(item =>
                    item.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // --- FUNGSI CHECKOUT KRUSIAL (Tetap harus menggunakan token di header) ---
    const handleCheckout = async () => {
         if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        // ... (Logika konfirmasi checkout) ...
        if (window.confirm(`Konfirmasi Pembayaran sebesar Rp ${calculateTotal().toLocaleString('id-ID')}?`)) {
             try {
                const transactionData = {
                    cartItems: cart, 
                    paymentMethod: 'Cash'
                };
                
                // Panggilan API POST ke endpoint transaksi (Token otomatis terkirim)
                const response = await axios.post(`${API_URL}/transactions/checkout`, transactionData);
                
                alert(`Transaksi sukses! ID: ${response.data.transactionId}. Total: Rp ${calculateTotal().toLocaleString('id-ID')}`);
                
                setCart([]); // Kosongkan keranjang
                fetchProducts(); // Muat ulang data produk untuk menampilkan stok baru

            } catch (error) {
                // ... (Error handling tetap sama) ...
                console.error('Gagal saat checkout:', error.response ? error.response.data : error.message);
                const errorMessage = error.response && error.response.data && error.response.data.message
                                        ? error.response.data.message
                                        : 'Terjadi kegagalan koneksi atau server.';
                alert(`Checkout Gagal: ${errorMessage}`);
            }
        }
    };

    // --- TAMPILAN (RENDER) ---
    return (
        <div className="app-container">
            <header>
                 {/* Menggunakan Button React-Bootstrap untuk konsistensi */}
                <h1>INFORMART</h1> 
            </header>
            
            <main className="cashier-layout">
                
                {/* Bagian Kiri: Daftar Produk */}
                <div className="product-list-panel">
                    <h2>Daftar Produk</h2>
                    {/* Tampilkan error jika ada */}
                    {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                    
                    {isLoading ? (
                        <p><Spinner animation="border" size="sm" /> Memuat produk...</p>
                    ) : (
                        <div className="products-grid">
                            {/* ... (Pemetaan Produk) ... */}
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <h4>{product.name}</h4>
                                    <p>Rp {product.price.toLocaleString('id-ID')}</p>
                                    <p className={product.stock > 10 ? 'stock-ok' : 'stock-low'}>
                                        Stok: {product.stock}
                                    </p>
                                    <button 
                                        onClick={() => addToCart(product)} 
                                        disabled={product.stock <= 0}
                                    >
                                        {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bagian Kanan: Keranjang & Pembayaran (tetap sama) */}
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
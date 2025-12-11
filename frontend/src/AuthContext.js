import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    // State untuk menyimpan token dan data pengguna (role, id, username)
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- Efek untuk memuat token dari localStorage saat aplikasi dimulai ---
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                // Konversi string user kembali menjadi objek
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
                // Set header Authorization default untuk semua request axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (e) {
                console.error("Gagal parse user dari localStorage", e);
                // Jika gagal, hapus yang tersimpan
                handleLogout(); 
            }
        }
        setIsLoading(false);
    }, []);

    // --- Fungsi Login ---
    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });
            const { token: receivedToken, user: receivedUser } = response.data;
            
            // 1. Simpan di State
            setToken(receivedToken);
            setUser(receivedUser);

            // 2. Simpan di localStorage (agar sesi tetap ada setelah browser ditutup)
            localStorage.setItem('token', receivedToken);
            localStorage.setItem('user', JSON.stringify(receivedUser));
            
            // 3. Set Header default untuk semua API call berikutnya
            axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
            
            return receivedUser; // Kembalikan user untuk navigasi
        } catch (error) {
            console.error("Login Gagal:", error.response ? error.response.data.message : error.message);
            throw new Error(error.response ? error.response.data.message : 'Koneksi gagal atau Server Error.');
        }
    };

    // --- Fungsi Logout ---
    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    // Cek apakah user adalah 'bos'
    const isBos = user && user.role === 'bos';
    // Cek apakah user adalah 'kasir'
    const isKasir = user && user.role === 'kasir';

    return (
        <AuthContext.Provider value={{ token, user, isBos, isKasir, isLoading, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook kustom untuk memudahkan penggunaan Context di komponen lain
export const useAuth = () => {
    return useContext(AuthContext);
};  
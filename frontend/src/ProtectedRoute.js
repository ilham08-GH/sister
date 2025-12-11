// frontend/src/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner, Alert } from 'react-bootstrap';

// Komponen untuk melindungi route tertentu
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token, isLoading } = useAuth();
    
    if (isLoading) {
        // Tampilkan loading saat cek token dari localStorage
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Memuat sesi...</p>
            </div>
        );
    }

    // 1. Cek Token: Jika tidak ada token, arahkan ke halaman login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Cek Role: Jika ada token, tapi role tidak diizinkan, tampilkan error
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return (
            <div className="text-center mt-5">
                <Alert variant="danger">
                    Akses Ditolak. Role Anda ({user?.role}) tidak diizinkan mengakses halaman ini.
                </Alert>
            </div>
        );
    }
    
    // 3. Token valid dan role diizinkan: Tampilkan komponen anak (Outlet)
    return <Outlet />; 
};

export default ProtectedRoute;
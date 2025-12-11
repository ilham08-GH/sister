import React from 'react';
// ⚠️ PERBAIKAN: Import useLocation dari react-router-dom
import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    Link, 
    Navigate, 
    useLocation // <--- BARIS INI WAJIB ADA
} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CashierPage from './CashierPage'; 
import BosPage from './BosPage'; 
import LoginPage from './LoginPage'; 
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './AuthContext'; 

function Navigation() {
    const { user, handleLogout } = useAuth(); 
    const location = useLocation(); // <--- Sekarang useLocation didefinisikan
    
    if (!user) {
        return null; // Sembunyikan Navigasi jika belum login
    }

    return (
        <nav style={{ padding: '10px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '20px' }}>
                
                {/* 1. LINK KASIR (Hanya tampil jika bukan di halaman Kasir) */}
                {location.pathname !== '/' && (
                    <li><Link to="/" style={navLinkStyle}>KASIR</Link></li>
                )}

                {/* 2. LINK BOS (Hanya tampil jika user adalah BOS DAN bukan di halaman BOS) */}
                {user.role === 'bos' && location.pathname !== '/bos' && (
                    <li><Link to="/bos" style={navLinkStyle}>BOS (Laporan)</Link></li>
                )}
            </ul>
            <div style={{ marginRight: '10px' }}>
                <span style={{ marginRight: '15px' }}>Logged in as:({user.role} </span>
                <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
        </nav>
    );
}

const navLinkStyle = { color: 'white', textDecoration: 'none' };

export default function App() {
    return (
        <Router>
            <Navigation />
            <div className="main-content">
                <Routes>
                    
                    {/* 1. Route Publik: Halaman Login */}
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* 2. Route Kasir: Hanya diizinkan oleh Kasir atau Bos */}
                    <Route 
                        path="/" 
                        element={<ProtectedRoute allowedRoles={['kasir', 'bos']} />}
                    >
                        <Route index element={<CashierPage />} /> 
                    </Route>

                    {/* 3. Route Bos: Hanya diizinkan oleh Bos */}
                    <Route 
                        path="/bos" 
                        element={<ProtectedRoute allowedRoles={['bos']} />}
                    >
                        <Route index element={<BosPage />} /> 
                    </Route>
                    
                    {/* 4. Catch All: Redirect ke login jika path tidak ditemukan */}
                    <Route path="*" element={<Navigate to="/login" replace />} />

                </Routes>
            </div>
        </Router>
    );
}
// frontend/src/BosPage.js (Perbaikan untuk mencegah error .map pada undefined)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Alert, Spinner } from 'react-bootstrap'; 
import { useAuth } from './AuthContext'; 

const API_URL = 'http://192.168.246.1:5000/api'; // Pastikan IP sesuai jika tidak menggunakan localhost

export default function BosPage() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, handleLogout } = useAuth();

    const fetchReports = async () => {
        if (!token) return;
        // ... (Logika fetchReports tetap sama) ...
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/transactions/report`);
            setReports(response.data);
            
        } catch (err) {
            console.error("Gagal memuat laporan:", err.response || err.message);
            
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                handleLogout(); 
                setError("Sesi kedaluwarsa. Silakan login kembali.");
            } else {
                setError("Gagal memuat laporan. Pastikan back-end berjalan dan endpoint report berfungsi.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchReports();
        }
    }, [token]);

    const formatCurrency = (amount) => {
        // ... (formatCurrency tetap sama) ...
        if (typeof amount !== 'number' || isNaN(amount)) {
            const num = parseFloat(amount);
            return isNaN(num) ? '0' : num.toLocaleString('id-ID');
        }
        return amount.toLocaleString('id-ID');
    };


    return (
        <Container className="mt-4">
            <h1>Laporan Transaksi</h1>
            <p className="text-muted">Ringkasan dan detail transaksi yang telah dilakukan.</p>

            {error && <Alert variant="danger">{error}</Alert>}
            
            {isLoading ? (
                <div className="text-center mt-5"><Spinner animation="border" /><p>Memuat data laporan...</p></div>
            ) : reports.length === 0 ? (
                <Alert variant="info" className="mt-4">
                    Belum ada data transaksi yang tercatat. Silakan lakukan transaksi di halaman Kasir.
                </Alert>
            ) : (
                <Table striped bordered hover responsive className="mt-4">
                    <thead>
                        <tr>
                            <th>ID Transaksi</th>
                            <th>Tanggal</th>
                            <th>Total (Rp)</th>
                            <th>Detail Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.transaction_id}>
                                <td>{report.transaction_id}</td>
                                <td>{new Date(report.transaction_date).toLocaleString('id-ID')}</td> 
                                <td>{formatCurrency(report.total_amount)}</td> 
                                
                                <td>
                                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                        {/* ⚠️ PERBAIKAN: Gunakan Optional Chaining (?.map) di sini ⚠️ */}
                                        {report.items?.map((item, index) => (
                                            <li key={index}>
                                                {item.quantity}x {item.product_name} (@{formatCurrency(item.price)}) 
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
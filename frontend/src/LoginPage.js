// frontend/src/BosPage.js (Perbaikan Tata Letak dan Format)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Alert, Spinner, Badge } from 'react-bootstrap'; // Import Badge
import { useAuth } from './AuthContext'; 

// ... (API_URL, fetchReports, useEffect, formatCurrency tetap sama) ...
const API_URL = 'http://192.168.246.1:5000/api'; 
// ...

// ... (Kode fetchReports dan useEffect tetap sama) ...

// Fungsi utilitas untuk formatting harga
const formatCurrency = (amount) => {
    // ... (Logika formatCurrency tetap sama) ...
    if (typeof amount !== 'number' || isNaN(amount)) {
        const num = parseFloat(amount);
        return isNaN(num) ? '0' : num.toLocaleString('id-ID');
    }
    return amount.toLocaleString('id-ID');
};

// Fungsi utilitas untuk formatting Tanggal
const formatDate = (dateString) => {
    // Memastikan kita menggunakan objek Date yang valid
    const date = new Date(dateString);
    if (isNaN(date)) return 'Tanggal Tidak Valid';

    // Opsi format tanggal dan waktu
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Format 24 jam
    }).format(date);
}

export default function BosPage() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, handleLogout } = useAuth();
    // ... (fetchReports dan useEffect) ...

    return (
        // Beri padding horizontal lebih besar
        <Container className="mt-5 mb-5 px-5"> 
            
            <h1 className="mb-4 text-primary">
                <i className="bi bi-bar-chart-fill me-3"></i> Laporan Transaksi Harian
            </h1>
            <p className="text-muted border-bottom pb-3">Ringkasan transaksi berdasarkan ID dan detail item.</p>

            {error && <Alert variant="danger">{error}</Alert>}
            
            {isLoading ? (
                // ... (Loading spinner) ...
                <div className="text-center mt-5"><Spinner animation="border" /><p>Memuat data laporan...</p></div>
            ) : reports.length === 0 ? (
                <Alert variant="info" className="mt-4">
                    Belum ada data transaksi yang tercatat.
                </Alert>
            ) : (
                <Table striped bordered hover responsive className="mt-4 shadow-sm" size="sm">
                    <thead>
                        <tr className="table-primary"> {/* Warna header tabel */}
                            <th># ID</th>
                            <th>Waktu Transaksi</th>
                            <th className="text-end">Total (Rp)</th> {/* Rata kanan */}
                            <th>Detail Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.transaction_id}>
                                <td><Badge bg="dark">{report.transaction_id}</Badge></td>
                                <td>{formatDate(report.transaction_date)}</td> {/* Format Tanggal Baru */}
                                <td className="text-end fw-bold">{formatCurrency(report.total_amount)}</td> {/* Total Tebal dan Rata Kanan */}
                                <td>
                                    <ul style={{ listStyleType: 'none', paddingLeft: 0, fontSize: '0.9em' }}>
                                        {report.items?.map((item, index) => (
                                            <li key={index} className="d-flex justify-content-between">
                                                <span>{item.quantity}x {item.product_name}</span>
                                                <span className="text-muted">(@{formatCurrency(item.price)})</span>
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
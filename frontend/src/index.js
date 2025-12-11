import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // <-- Tetap ada
import { AuthProvider } from './AuthContext'; // <-- IMPORT BARU

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* BUNGKUS SELURUH APLIKASI DENGAN AuthProvider */}
    <AuthProvider> 
        <App />
    </AuthProvider>
  </React.StrictMode>
);
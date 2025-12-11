<?php
session_start();
// Jika tidak ada sesi user (belum login), tendang ke halaman login
if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

// ===============================================================
// === LOGIKA PENGAMBILAN DATA DOKTER DIKEMBALIKAN KE SINI ===
// ===============================================================
$users_file = '../backend/users.json';
$all_users = json_decode(file_get_contents($users_file), true);
$doctors = []; // Siapkan array kosong untuk menampung data dokter

// Pastikan $all_users adalah array sebelum di-loop
if (is_array($all_users)) {
    foreach ($all_users as $user) {
        if (isset($user['role']) && $user['role'] === 'dokter') {
            $doctors[] = $user; // Masukkan user ke array jika perannya adalah dokter
        }
    }
}
// Sekarang variabel $doctors berisi array data semua dokter
?>
<!DOCTYPE html>
<html lang-en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Klinik Sehat - Dashboard Pasien</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>🏥 Klinik Sehat Sederhana</h1>
        <div class="user-info">
            <span>Selamat datang, <?php echo htmlspecialchars($_SESSION['user']['nama_lengkap']); ?>!</span>
            <a href="../backend/logout.php" class="logout-btn">Logout</a>
        </div>
    </header>
    <main>
        <div class="form-container">
            <h2>Buat Janji Temu Baru</h2>
            <form id="appointment-form">
                <input type="date" id="tanggal_temu" required>
                
                <select id="pilih_dokter" required>
                    <option value="" disabled selected>-- Pilih Dokter --</option>
                    
                    <?php foreach ($doctors as $doctor): ?>
                        <option value="<?php echo htmlspecialchars($doctor['nama_lengkap']); ?>">
                            <?php echo htmlspecialchars($doctor['nama_lengkap']); ?>
                        </option>
                    <?php endforeach; ?>

                </select>

                <textarea id="keluhan" placeholder="Tuliskan keluhan Anda..." required></textarea>
                <button type="submit">Daftar</button>
            </form>
        </div>
        <hr>
        <div class="list-container">
            <h2>Daftar Janji Temu Anda</h2>
            <div id="appointment-list">
                <p>Memuat data janji temu...</p>
            </div>
        </div>
    </main>
    <script src="app.js"></script>
</body>
</html>
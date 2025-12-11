<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Manajemen Pengguna</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Admin Panel</h1>
        <div class="user-info">
            <span>Login sebagai: <?php echo htmlspecialchars($_SESSION['user']['nama_lengkap']); ?></span>
            <a href="../backend/logout.php" class="logout-btn">Logout</a>
        </div>
    </header>
    <main>
        <div class="form-container">
            <h2>Tambah Pengguna Baru</h2>
            <form id="add-user-form">
                <input type="text" id="nama_lengkap" placeholder="Nama Lengkap" required>
                <input type="text" id="username" placeholder="Username" required>
                <input type="password" id="password" placeholder="Password" required>
                <select id="role" required>
                    <option value="pasien">Pasien</option>
                    <option value="dokter">Dokter</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Tambah Pengguna</button>
            </form>
            <div id="admin-message"></div>
        </div>
        <hr>
        <div class="list-container">
            <h2>Daftar Semua Pengguna</h2>
            <div id="user-list"></div>
        </div>
    </main>
    <script src="admin.js"></script> </body>
</html>
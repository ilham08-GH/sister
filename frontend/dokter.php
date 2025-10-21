<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'dokter') {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Dokter - Klinik Sehat</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>🏥 Dashboard Dokter</h1>

        <div class="user-info">
            <span>Selamat datang, <?php echo htmlspecialchars($_SESSION['user']['nama_lengkap']); ?>!</span>
            <a href="../backend/logout.php" class="logout-btn">Logout</a>
        </div>
    </header> <main>
        <div class="list-container">
            <h2>Daftar Janji Temu Masuk</h2>
            <div id="appointment-list">
                <p>Memuat data janji temu...</p>
            </div>
        </div>
    </main>

    <script src="app.js"></script>
</body>
</html>
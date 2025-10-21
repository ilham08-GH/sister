<?php
session_start();
// Jika pengguna sudah login, jangan biarkan mereka registrasi lagi
if (isset($_SESSION['user'])) {
    header('Location: index.php');
    exit;
}

// Menyiapkan pesan error berdasarkan parameter GET dari URL
$error_message = '';
if (isset($_GET['error'])) {
    switch ($_GET['error']) {
        case 'kolom_kosong':
            $error_message = "Semua kolom harus diisi.";
            break;
        case 'password_tidak_cocok':
            $error_message = "Konfirmasi password tidak cocok.";
            break;
        case 'username_sudah_ada':
            $error_message = "Username sudah digunakan. Silakan pilih yang lain.";
            break;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrasi Akun - Klinik Sehat</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>🏥 Registrasi Akun Baru</h1>
    </header>
    <main>
        <div class="login-container">
            <h2>Buat Akun Pasien</h2>
            <form action="../backend/register_process.php" method="POST">
                <input type="text" name="nama_lengkap" placeholder="Nama Lengkap" required>
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <input type="password" name="password_konfirmasi" placeholder="Konfirmasi Password" required>
                <button type="submit">Registrasi</button>
            </form>
            
            <?php if (!empty($error_message)): ?>
                <div id="message-container" class="message-error">
                    <?php echo $error_message; ?>
                </div>
            <?php endif; ?>

            <p class="register-link">Sudah punya akun? <a href="login.php">Login di sini</a></p>
        </div>
    </main>
</body>
</html>
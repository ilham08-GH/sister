<?php
session_start();
// Jika pengguna sudah login, langsung arahkan ke dashboard
if (isset($_SESSION['user'])) {
    if ($_SESSION['user']['role'] === 'admin') {
        header('Location: admin.php');
    } elseif ($_SESSION['user']['role'] === 'dokter') {
        header('Location: dokter.php');
    } else {
        header('Location: index.php');
    }
    exit;
}

// Menyiapkan pesan berdasarkan parameter GET dari URL
$message = '';
$message_type = ''; // 'message-success' atau 'message-error'

if (isset($_GET['error']) && $_GET['error'] === 'login_failed') {
    $message = "Username atau password salah.";
    $message_type = 'message-error';
}
if (isset($_GET['status']) && $_GET['status'] === 'reg_success') {
    $message = "Registrasi berhasil! Silakan login dengan akun baru Anda.";
    $message_type = 'message-success';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Klinik Sehat</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>🏥 Klinik Sehat</h1>
    </header>
    <main>
        <div class="login-container">
            <h2>Silakan Login</h2>
            
            <form action="../backend/login_process.php" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            
            <?php if (!empty($message)): ?>
                <div id="message-container" class="<?php echo $message_type; ?>">
                    <?php echo $message; ?>
                </div>
            <?php endif; ?>
            
            <p class="register-link">Belum punya akun? <a href="register.php">Registrasi di sini</a></p>
        </div>
    </main>
</body>
</html>
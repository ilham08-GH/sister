document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('user-list');
    const addUserForm = document.getElementById('add-user-form');
    const adminMessage = document.getElementById('admin-message');
    const apiUrl = '../backend/api.php';

    // Fungsi untuk memuat semua pengguna dan menampilkannya dalam tabel
    const loadUsers = () => {
        fetch(`${apiUrl}?action=get_users`)
            .then(response => response.json())
            .then(data => {
                if(data.status === 'error') {
                    alert(data.message);
                    if(response.status === 401 || response.status === 403) {
                        window.location.href = 'login.php';
                    }
                    return;
                }
                
                userList.innerHTML = ''; // Kosongkan kontainer
                
                // Buat elemen tabel
                const table = document.createElement('table');
                table.className = 'user-table';

                // Buat header tabel
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Nama Lengkap</th>
                            <th>Username</th>
                            <th>Peran</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                `;

                // Buat body tabel
                const tbody = document.createElement('tbody');
                data.forEach(user => {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td>${user.nama_lengkap}</td>
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td class="action-buttons">
                            <button class="delete-btn" data-username="${user.username}">Hapus</button>
                        </td>
                    `;
                });

                table.appendChild(tbody);
                userList.appendChild(table);
            });
    };

    // Event listener untuk form tambah pengguna (tidak berubah)
    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newUser = {
            nama_lengkap: document.getElementById('nama_lengkap').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value
        };

        fetch(`${apiUrl}?action=add_user`, {
            method: 'POST',
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(data => {
            adminMessage.textContent = data.message;
            adminMessage.className = data.status === 'success' ? 'message-success' : 'message-error';
            if (data.status === 'success') {
                addUserForm.reset();
                loadUsers();
            }
        });
    });

    // Event listener untuk tombol hapus (tidak berubah)
    userList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const username = event.target.dataset.username;
            if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${username}"?`)) {
                fetch(`${apiUrl}?action=delete_user&username=${username}`)
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        loadUsers();
                    });
            }
        }
    });

    // Panggil fungsi untuk memuat data saat halaman dibuka
    loadUsers();
});
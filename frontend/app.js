document.addEventListener('DOMContentLoaded', function() {
    const appointmentList = document.getElementById('appointment-list');
    const form = document.getElementById('appointment-form');
    const apiUrl = '../backend/api.php';

    // Logika ini hanya berjalan di halaman pasien (index.php) karena hanya di sana form-nya ada
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const newAppointment = {
                keluhan: document.getElementById('keluhan').value,
                pilih_dokter: document.getElementById('pilih_dokter').value,
                tanggal_temu: document.getElementById('tanggal_temu').value
            };

            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAppointment),
            })
            .then(response => response.json())
            .then(result => {
                console.log(result.message);
                form.reset();
                loadAppointments();
            })
            .catch(error => console.error('Error saat mengirim:', error));
        });
    }

    // Fungsi ini berjalan di kedua halaman (index.php dan dokter.php)
    const loadAppointments = () => {
        if (!appointmentList) return;

        fetch(apiUrl)
            .then(response => {
                if (response.status === 401) {
                    // Arahkan paksa ke halaman login
                    alert("Sesi Anda telah berakhir. Silakan login kembali.");
                    window.location.href = 'login.php'; 
                    return; // Hentikan eksekusi script lebih lanjut
                }

                return response.json();
            })
            .then(data => {
                if (!data) return; // Hentikan jika tidak ada data (misalnya setelah redirect)
                
                const sortedData = data.sort((a, b) => b.id - a.id);
                appointmentList.innerHTML = '';
                
                if (sortedData.length === 0) {
                    appointmentList.innerHTML = '<p>Belum ada janji temu yang terdaftar.</p>';
                } else {
                    sortedData.forEach(app => {
                        const card = document.createElement('div');
                        card.classList.add('appointment-card');
                        
                        const statusClass = app.status === 'Dikonfirmasi' ? 'status-dikonfirmasi' : 'status-menunggu';
                        const isDoctorPage = !form;
                        let confirmButtonHTML = '';

                        if (isDoctorPage && app.status === 'Menunggu Konfirmasi') {
                            confirmButtonHTML = `<button class="konfirmasi-btn" data-id="${app.id}">Konfirmasi</button>`;
                        }

                        card.innerHTML = `
                            <div class="card-header">
                                <h3>${app.nama_pasien}</h3>
                                <span class="status ${statusClass}">${app.status}</span>
                            </div>
                            <p><strong>Jadwal:</strong> ${app.tanggal_temu}</p>
                            <p><strong>Dokter:</strong> ${app.pilih_dokter}</p>
                            <p><strong>Keluhan:</strong> ${app.keluhan}</p>
                            <div class="card-footer">
                                <small>Didaftarkan pada: ${app.waktu_registrasi}</small>
                                ${confirmButtonHTML}
                            </div>
                        `;
                        appointmentList.appendChild(card);
                    });
                }
            })
            .catch(error => console.error('Error saat memuat:', error));
    };
    
    // Fungsi untuk memanggil API konfirmasi
    const konfirmasiJanjiTemu = (id) => {
        fetch(`${apiUrl}?action=konfirmasi&id=${id}`)
            .then(response => response.json())
            .then(result => {
                console.log(result.message);
                loadAppointments();
            })
            .catch(error => console.error('Error saat konfirmasi:', error));
    };

    // Menangani klik pada tombol konfirmasi di halaman dokter
    appointmentList.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('konfirmasi-btn')) {
            const appointmentId = event.target.dataset.id;
            konfirmasiJanjiTemu(appointmentId);
        }
    });

    // Panggil fungsi untuk memuat janji temu saat halaman dibuka
    loadAppointments();
});
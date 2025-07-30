document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');
    const dropZone = document.body; // Menggunakan seluruh body sebagai drop zone

    // Memicu klik pada input file
    window.triggerFileUpload = () => {
        fileInput.click();
    };
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFileUpload(fileInput.files[0]);
        }
    });

    // Event listener untuk drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        document.body.classList.add('dragging');
    });

    dropZone.addEventListener('dragleave', () => {
        document.body.classList.remove('dragging');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        document.body.classList.remove('dragging');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files; // Menetapkan file ke input
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    // Fungsi untuk menangani file yang dipilih
    function handleFileUpload(file) {
        const errorDiv = document.querySelector('.upload-error');
        const boxUpload = document.querySelector('.box-upload');
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';

        // 1. Validasi Tipe File
        const allowedTypes = ['video/mp4', 'video/quicktime'];
        if (!allowedTypes.includes(file.type)) {
            showModal('errorModal');
            uploadForm.reset();
            return;
        }

        // 2. Validasi Ukuran File (100MB)
        const maxFileSize = 100 * 1024 * 1024; // 100MB dalam bytes
        if (file.size > maxFileSize) {
            errorDiv.textContent = "Error: Ukuran file terlalu besar. Harap unggah file di bawah 100MB.";
            errorDiv.style.display = 'block';
            uploadForm.reset();
            return;
        }

        // Mulai proses upload (simulasi)
        uploadFile(file);
    }

    function uploadFile(file) {
        const boxUpload = document.querySelector('.box-upload');
        boxUpload.classList.add('animate');
        boxUpload.innerHTML = 'Mengunggah...';

        // Ini adalah bagian di mana Anda akan menggunakan AJAX (misalnya Fetch API)
        // untuk mengirim file ke server backend Anda.
        
        // Contoh menggunakan FormData dan Fetch API
        const formData = new FormData(uploadForm);
        // Jika form tidak memiliki file, tambahkan secara manual
        if (!formData.has('videoFile')) {
            formData.append('videoFile', file);
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadForm.action, true);

        // Event listener untuk progress upload
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                boxUpload.innerHTML = `${percentComplete}%`;
                if(percentComplete === 100) {
                    boxUpload.innerHTML = "Memproses...";
                }
            }
        });

        // Event listener untuk saat upload selesai
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Berhasil: arahkan ke halaman video atau tampilkan link
                // Server Anda harus mengembalikan JSON dengan link video
                const response = JSON.parse(xhr.responseText);
                // Contoh: window.location.href = response.link;
                alert('Upload berhasil! Link video: ' + (response.link || 'tidak ada'));
                boxUpload.innerHTML = 'Upload Selesai!';
            } else {
                // Gagal: tampilkan pesan error dari server
                const errorDiv = document.querySelector('.upload-error');
                errorDiv.textContent = `Error: Upload gagal. (Status: ${xhr.status})`;
                errorDiv.style.display = 'block';
                resetUploadUI();
            }
        };

        // Event listener untuk error koneksi
        xhr.onerror = function() {
            const errorDiv = document.querySelector('.upload-error');
            errorDiv.textContent = 'Error: Terjadi masalah koneksi.';
            errorDiv.style.display = 'block';
            resetUploadUI();
        };
        
        xhr.send(formData);
    }
    
    function resetUploadUI() {
        const boxUpload = document.querySelector('.box-upload');
        boxUpload.classList.remove('animate');
        boxUpload.innerHTML = 'Pilih Video untuk Diunggah';
        uploadForm.reset();
    }

    // Fungsi Modal
    window.showModal = (modalId) => {
        document.getElementById(modalId).style.display = 'flex';
    }

    window.closeModal = (modalId) => {
        document.getElementById(modalId).style.display = 'none';
    }
});

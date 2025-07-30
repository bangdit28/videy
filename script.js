document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');
    const dropZone = document.body;

    // Fungsi trigger yang sudah dimodifikasi
    window.triggerFileUpload = () => {
        // Ganti URL di bawah ini dengan Direct Link Anda dari Adsterra
        const adsterraDirectLink = 'https://GANTI_DENGAN_URL_DIRECT_LINK_ANDA.com';

        // Buka Direct Link di tab baru
        window.open(adsterraDirectLink, '_blank');
        
        // Jalankan fungsi upload file seperti biasa di halaman ini
        fileInput.click();
    };
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFileUpload(fileInput.files[0]);
        }
    });

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
            fileInput.files = e.dataTransfer.files;
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    function handleFileUpload(file) {
        const errorDiv = document.querySelector('.upload-error');
        const boxUpload = document.querySelector('.box-upload');
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';

        const allowedTypes = ['video/mp4', 'video/quicktime'];
        if (!allowedTypes.includes(file.type)) {
            showModal('errorModal');
            uploadForm.reset();
            return;
        }

        const maxFileSize = 100 * 1024 * 1024;
        if (file.size > maxFileSize) {
            errorDiv.textContent = "Error: Ukuran file terlalu besar. Harap unggah file di bawah 100MB.";
            errorDiv.style.display = 'block';
            uploadForm.reset();
            return;
        }

        uploadFile(file);
    }

    function uploadFile(file) {
        const boxUpload = document.querySelector('.box-upload');
        boxUpload.classList.add('animate');
        boxUpload.innerHTML = 'Mengunggah...';

        const formData = new FormData(uploadForm);
        if (!formData.has('videoFile')) {
            formData.append('videoFile', file);
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadForm.action, true);

        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                boxUpload.innerHTML = `${percentComplete}%`;
                if(percentComplete === 100) {
                    boxUpload.innerHTML = "Memproses...";
                }
            }
        });

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                alert('Upload berhasil! Link video: ' + (response.link || 'tidak ada'));
                boxUpload.innerHTML = 'Upload Selesai!';
            } else {
                const errorDiv = document.querySelector('.upload-error');
                errorDiv.textContent = `Error: Upload gagal. (Status: ${xhr.status})`;
                errorDiv.style.display = 'block';
                resetUploadUI();
            }
        };

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

    window.showModal = (modalId) => {
        document.getElementById(modalId).style.display = 'flex';
    }

    window.closeModal = (modalId) => {
        document.getElementById(modalId).style.display = 'none';
    }
});

const validator = require('validator');
const path = require('path');
/**
 * 1. Validasi Data Hospital
 */
const validateHospital = (data) => {
    let errors = [];

    if (!data.name || validator.isEmpty(String(data.name).trim())) {
        errors.push("Nama hospital wajib diisi");
    }
    if (!data.address || validator.isEmpty(String(data.address).trim())) {
        errors.push("Alamat wajib diisi");
    }
    if (!data.code || validator.isEmpty(String(data.code).trim())) {
        errors.push("Kode hospital wajib diisi");
    }
    if (!data.class || validator.isEmpty(String(data.class).trim())) {
        errors.push("Class hospital wajib diisi");
    }
    if (data.name && !validator.isLength(String(data.name), { min: 3 })) {
        errors.push("Nama hospital minimal harus 3 karakter");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

/**
 * 2. Validasi Data Indikator
 */
const validateIndicator = (data) => {
    let errors = [];

    if (!data.name || validator.isEmpty(String(data.name).trim())) {
        errors.push("Nama indikator wajib diisi");
    }
    if (!data.description || validator.isEmpty(String(data.description).trim())) {
        errors.push("Deskripsi wajib diisi");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

/**
 * 3. Validasi Data User
 */
const validateUser = (data) => {
    let errors = [];

    if (!data.email || !validator.isEmail(String(data.email))) {
        errors.push("Format email tidak valid");
    }
    if (!data.password || !validator.isLength(String(data.password), { min: 6 })) {
        errors.push("Password minimal harus 6 karakter");
    }
    if (data.name && validator.isEmpty(String(data.name).trim())) {
        errors.push("Nama tidak boleh kosong");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

/**
 * 4. Validasi File Upload (Sesuai Materi Pertemuan 7)
 * Memastikan file aman, valid, dan tidak merusak sistem
 */


function validateFile(file) {
    // Jika tidak ada file, dianggap valid karena bersifat opsional 
    if (!file) return null; 

    // Daftar format yang diperbolehkan
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"]; 
    const allowedExtensions = [".jpg", ".jpeg", ".png"]; 
    const fileExtension = path.extname(file.originalname).toLowerCase(); 

    // Cek apakah Mimetype OK atau Ekstensinya OK (Logika Cadangan)
    const isMimeValid = allowedMimeTypes.includes(file.mimetype); 
    const isExtValid = allowedExtensions.includes(fileExtension);

    if (!isMimeValid && !isExtValid) {
        return "format file harus JPG atau PNG"; 
    }

    // Validasi ukuran file (Maksimal 2MB) 
    if (file.size > 2 * 1024 * 1024) { 
        return "ukuran file maksimal 2MB"; 
    }

    return null; 
}

module.exports = { 
    validateHospital, 
    validateIndicator, 
    validateUser, 
    validateFile // Pastikan ini diekspor 
};
const validator = require('validator');

const validateHospital = (data) => {
    let errors = [];

    // 1. Validasi Required (Field tidak boleh kosong)
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

    // 2. Validasi Panjang Karakter
    if (data.name && !validator.isLength(String(data.name), { min: 3 })) {
        errors.push("Nama hospital minimal harus 3 karakter");
    }

    // --- BAGIAN ISINT DIHAPUS ---
    // Kita tidak perlu mengecek isInt karena Class RS adalah String (A, B, C)

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};
const validateIndicator = (data) => {
    let errors = [];

    if (!data.name || validator.isEmpty(String(data.name).trim())) {
        errors.push("Nama indikator wajib diisi");
    }

    if (!data.description || validator.isEmpty(String(data.description).trim())) {
        errors.push("Deskripsi indikator wajib diisi");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};
module.exports = { 
    validateHospital,
    validateIndicator
 };
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

    // 2. Validasi Tipe Data & Panjang Karakter
    if (data.name && !validator.isLength(String(data.name), { min: 3 })) {
        errors.push("Nama hospital minimal harus 3 karakter");
    }

    // Contoh validasi angka untuk field 'class' jika ada (sebagai number)
    if (data.class && !validator.isInt(String(data.class))) {
        errors.push("Tipe data Class harus berupa angka");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

module.exports = { validateHospital };
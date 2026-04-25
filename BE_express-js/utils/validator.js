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

    if (!data.class) {
        errors.push("Class hospital wajib diisi");
    };

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
        errors.push("Deskripsi wajib diisi");
    }

    return{
        isValid: errors.length === 0,
        errors: errors
    };
};
const validateUser = (data) => {
    let errors = [];

    //validasi email (harus format email yang benar)
    if (!data.email || !validator.isEmail(String(data.email))) {
        errors.push("Format email tidak valid");
    }

    // Validasi Password (Minimal 6 karakter)
    if (!data.password || !validator.isLength(String(data.password), { min: 6 })) {
        errors.push("Password minimal harus 6 karakter");
    }

    // Validasi Username (Hanya untuk Register)
    if (data.username !== undefined && validator.isEmpty(String(data.username).trim())) {
        errors.push("Username tidak boleh kosong");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};
    


module.exports = { validateHospital, validateIndicator, validateUser };
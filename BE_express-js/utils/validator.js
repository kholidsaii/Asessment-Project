function validateIndicator(data) {
  if (!data.name) {
    return "Nama indikator wajib diisi";
  }

  if (data.name.length < 3) {
    return "Nama minimal 3 karakter";
  }

  return null;
}

module.exports = { validateIndicator };
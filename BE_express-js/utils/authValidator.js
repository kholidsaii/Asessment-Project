function validateRegister(data) {
  if (!data.name) return "Nama wajib diisi";
  if (!data.email) return "Email wajib diisi";
  if (!data.password) return "Password wajib diisi";
  return null;
}

function validateLogin(data) {
  if (!data.email) return "Email wajib diisi";
  if (!data.password) return "Password wajib diisi";
  return null;
}

module.exports = { validateRegister, validateLogin };
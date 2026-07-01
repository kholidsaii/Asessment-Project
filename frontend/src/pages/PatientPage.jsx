import { useEffect, useMemo, useState } from "react";
import api from "../utils/constant/http";
import PatientTable from "../components/PatientTable/PatientTable";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
  hospital_id: "",
};

function PatientPage() {
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const isEditMode = Boolean(editingId);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return users;

    return users.filter((item) =>
      [item.name, item.email, item.role, item.hospital_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [users, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [userRes, hospitalRes] = await Promise.all([
        api.get("/users"),
        api.get("/hospitals"),
      ]);

      setUsers(userRes.data.data || []);
      setHospitals(hospitalRes.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      setError(err.response?.data?.message || "Gagal mengambil data user.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && value === "admin" ? { hospital_id: "" } : {}),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
      hospital_id: user.hospital_id ? String(user.hospital_id) : "",
    });
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Nama dan email wajib diisi.");
      return;
    }

    if (!isEditMode && !form.password.trim()) {
      setError("Password wajib diisi untuk user baru.");
      return;
    }

    if (form.password && form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        hospital_id: form.role === "user" && form.hospital_id ? Number(form.hospital_id) : null,
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (isEditMode) {
        await api.put(`/users/${editingId}`, payload);
        setSuccess("Data user berhasil diperbarui.");
      } else {
        await api.post("/users", payload);
        setSuccess("Data user berhasil ditambahkan.");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      console.error("Gagal menyimpan user:", err);
      setError(err.response?.data?.message || "Gagal menyimpan data user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus user "${name}"?`);
    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");
      await api.delete(`/users/${id}`);
      setSuccess("Data user berhasil dihapus.");
      await fetchData();
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      setError(err.response?.data?.message || "Gagal menghapus data user.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen User</h1>
          <p className="mt-1 text-slate-500">
            Kelola akun admin dan user rumah sakit yang dapat mengakses sistem.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "Edit User" : "Tambah User"}
          </h2>
          <p className="text-sm text-slate-500">
            Untuk role user rumah sakit, pilih rumah sakit agar assessment dan laporan dapat terhubung.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Nama</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama user"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@contoh.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">
              Password {isEditMode && <span className="font-normal text-slate-400">(kosongkan jika tidak diubah)</span>}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={isEditMode ? "Password baru opsional" : "Minimal 6 karakter"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="user">User Rumah Sakit</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-600">Rumah Sakit</label>
            <select
              name="hospital_id"
              value={form.hospital_id}
              onChange={handleChange}
              disabled={form.role === "admin"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Tidak terhubung / pilih rumah sakit</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name} ({hospital.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          {isEditMode && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-blue-100 hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : isEditMode ? "Update User" : "Simpan User"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama, email, role, atau rumah sakit..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-slate-400">
          Memuat data user...
        </div>
      ) : (
        <PatientTable patients={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default PatientPage;

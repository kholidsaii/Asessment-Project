import { useEffect, useMemo, useState } from "react";
import api from "../utils/constant/http";
import HospitalTable from "../components/HospitalTable/HospitalTable";

const initialForm = {
  name: "",
  code: "",
  class: "",
  address: "",
};

function HospitalPage() {
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const isEditMode = Boolean(editingId);

  const filteredHospitals = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return hospitals;

    return hospitals.filter((item) =>
      [item.name, item.code, item.class, item.address]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [hospitals, search]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/hospitals");
      setHospitals(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data rumah sakit:", err);
      setError(err.response?.data?.message || "Gagal mengambil data rumah sakit.");
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  const handleEdit = (hospital) => {
    setEditingId(hospital.id);
    setForm({
      name: hospital.name || "",
      code: hospital.code || "",
      class: hospital.class || "",
      address: hospital.address || "",
    });
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.code.trim() || !form.class.trim() || !form.address.trim()) {
      setError("Nama, kode, kelas, dan alamat rumah sakit wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        class: form.class.trim(),
        address: form.address.trim(),
      };

      if (isEditMode) {
        await api.put(`/hospitals/${editingId}`, payload);
        setSuccess("Data rumah sakit berhasil diperbarui.");
      } else {
        await api.post("/hospitals", payload);
        setSuccess("Data rumah sakit berhasil ditambahkan.");
      }

      resetForm();
      await fetchHospitals();
    } catch (err) {
      console.error("Gagal menyimpan rumah sakit:", err);
      setError(err.response?.data?.message || "Gagal menyimpan data rumah sakit.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus rumah sakit "${name}"?`);
    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");
      await api.delete(`/hospitals/${id}`);
      setSuccess("Data rumah sakit berhasil dihapus.");
      await fetchHospitals();
    } catch (err) {
      console.error("Gagal menghapus rumah sakit:", err);
      setError(err.response?.data?.message || "Gagal menghapus data rumah sakit.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Data Rumah Sakit</h1>
          <p className="mt-1 text-slate-500">
            Kelola data rumah sakit yang menggunakan sistem assessment.
          </p>
        </div>

        <button
          onClick={fetchHospitals}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "Edit Rumah Sakit" : "Tambah Rumah Sakit"}
          </h2>
          <p className="text-sm text-slate-500">
            Data ini akan dipakai untuk menghubungkan akun user rumah sakit dengan assessment.
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
            <label className="mb-2 block text-sm font-bold text-slate-600">Nama Rumah Sakit</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: RS Contoh Sehat"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Kode Rumah Sakit</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Contoh: RS001"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Kelas</label>
            <select
              name="class"
              value={form.class}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Pilih kelas</option>
              <option value="A">Kelas A</option>
              <option value="B">Kelas B</option>
              <option value="C">Kelas C</option>
              <option value="D">Kelas D</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Alamat</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Contoh: Jakarta"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
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
            {saving ? "Menyimpan..." : isEditMode ? "Update Rumah Sakit" : "Simpan Rumah Sakit"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama, kode, kelas, atau alamat..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-slate-400">
          Memuat data rumah sakit...
        </div>
      ) : (
        <HospitalTable hospitals={filteredHospitals} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default HospitalPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/constant/http"; // Pastikan path ini sesuai dengan project kamu
import { Plus, Edit, Trash2, FolderTree, AlertCircle } from "lucide-react";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Memuat data pertama kali komponen dirender
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/categories");
      // Menyesuaikan dengan format response backend (array data)
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Gagal memuat data kategori");
    } finally {
      setLoading(false);
    }
  }

  // Fungsi Hapus Kategori
  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?\n\nPeringatan: Menghapus kategori dapat mempengaruhi instrumen yang terhubung!`)) {
      try {
        const response = await api.delete(`/categories/${id}`);
        if (response.data.success || response.status === 200) {
          alert("Kategori berhasil dihapus");
          fetchCategories(); // Refresh tabel setelah hapus sukses
        }
      } catch (error) {
        console.error("Gagal menghapus kategori:", error);
        alert("Gagal menghapus data. Kategori ini mungkin sedang digunakan oleh instrumen penilaian.");
      }
    }
  };

  // 1. TAMPILAN LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-500">
        <p className="animate-pulse text-blue-600 font-medium">Memuat master kategori...</p>
      </div>
    );
  }

  // 2. TAMPILAN ERROR
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-5 mb-6 m-6 flex items-start gap-3">
        <AlertCircle className="shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-lg mb-1">Terjadi Kesalahan</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 3. TAMPILAN UTAMA
  return (
    <div className="p-6 max-w-6xl mx-auto pb-20">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FolderTree size={28} />
            </div>
            Master Kategori
          </h1>
          <p className="text-slate-500 mt-2">
            Kelola daftar kategori instrumen penilaian (Khusus Admin Dinas/Pusat)
          </p>
        </div>
        
        <button
          onClick={() => navigate("/categories/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          Tambah Kategori
        </button>
      </div>

      {/* Tabel Kategori */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FolderTree className="mx-auto mb-4 text-slate-300" size={48} />
            <p className="font-medium text-lg text-slate-600">Belum ada data kategori</p>
            <p className="text-sm mt-1">Silakan klik Tambah Kategori untuk membuat master data baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4 w-16 text-center">No</th>
                  <th className="px-6 py-4">Nama Kategori</th>
                  <th className="px-6 py-4">Grup / Keterangan</th>
                  <th className="px-6 py-4 text-center w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat, index) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium text-center">{index + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{cat.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {cat.group ? (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                          {cat.group}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">Tidak ada grup</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {/* Tombol Edit */}
                        <button
                          onClick={() => navigate(`/categories/${cat.id}/edit`)}
                          className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-colors"
                          title="Edit Kategori"
                        >
                          <Edit size={16} />
                        </button>
                        
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                          title="Hapus Kategori"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../utils/constant/http";

function IndicatorFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // State baru untuk efek sukses
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchOldData = async () => {
        try {
          const res = await http.get(`/indicators/${id}`);
          if (res.data.data) {
            setName(res.data.data.name);
            setDescription(res.data.data.description || "");
          }
        } catch (err) {
          setError("Gagal memuat data lama dari server.");
        }
      };
      fetchOldData();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error setiap kali tombol ditekan

    // === VALIDASI FRONTEND SPRINT 11 & 12 (BARU) ===
    if (!name.trim()) {
      setError("Nama Indikator tidak boleh kosong atau hanya berisi spasi.");
      return;
    }

    if (name.trim().length < 3) {
      setError("Nama Indikator terlalu pendek (Minimal 3 karakter).");
      return;
    }

    if (!description.trim()) {
      setError("Deskripsi / Capaian wajib diisi untuk standar rekam medis.");
      return;
    }

    if (description.trim().length < 5) {
      setError("Berikan deskripsi yang jelas (Minimal 5 karakter).");
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        name: name.trim(), 
        description: description.trim() 
      };

      if (isEditMode) {
        await http.put(`/indicators/${id}`, payload);
      } else {
        await http.post("/indicators", payload);
      }
      
      // Tampilkan efek sukses sebelum pindah halaman
      setSuccess(true);
      setTimeout(() => {
        navigate("/indicators"); 
      }, 1500); // Tunggu 1.5 detik baru kembali ke tabel

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal menyimpan data ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border p-8 transition-all">
        <h1 className="text-xl font-bold mb-1 text-slate-800">
          {isEditMode ? "Modifikasi Indikator" : "Tambah Indikator Baru"}
        </h1>
        <p className="text-xs text-slate-400 mb-6">Pusat Kendali Mutu SIMRS Dev</p>
        
        {/* TAMPILAN ALERT ERROR (Jika validasi gagal) */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3.5 mb-5 text-sm font-medium flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* TAMPILAN ALERT SUKSES (Jika berhasil disimpan) */}
        {success && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl p-3.5 mb-5 text-sm font-medium flex items-center gap-2 animate-pulse">
            <span>✅ Data Berhasil Disimpan! Mengalihkan halaman...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">Nama Indikator</label>
            <input
              type="text"
              placeholder="Contoh: BOR (Bed Occupancy Ratio)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || success}
              className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">Deskripsi / Capaian</label>
            <textarea
              placeholder="Masukkan penjelasan atau nilai indikator mutu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading || success}
              rows="3"
              className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-60"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/indicators")}
              disabled={loading || success}
              className="w-1/2 border py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {loading ? "Proses..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IndicatorFormPage;
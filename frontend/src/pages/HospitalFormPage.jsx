import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/constant/http";
import { Save, X, Building2 } from "lucide-react";

function HospitalFormPage() {
  const { id } = useParams();
  const isEditMode = !!id && id !== "new";
  const navigate = useNavigate();

  // 1. Tambahkan 'address' pada state awal
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    class: "",
    address: "" 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      api.get(`/hospitals/${id}`).then(res => {
        const data = res.data.data;
        // 2. Masukkan juga 'address' saat mengambil data lama
        setFormData({
          name: data.name,
          code: data.code,
          class: data.class,
          address: data.address || "" 
        });
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/hospitals/${id}`, formData);
      } else {
        await api.post("/hospitals", formData);
      }
      navigate("/hospitals");
    } catch (err) {
      alert("Gagal menyimpan data rumah sakit: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <Building2 className="text-blue-600" />
          {isEditMode ? "Edit Data Rumah Sakit" : "Tambah Rumah Sakit Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Rumah Sakit</label>
            <input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Contoh: RSUD Cibinong"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kode RS</label>
              <input 
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value})} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Contoh: RS001"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kelas RS</label>
              <select 
                value={formData.class} 
                onChange={(e) => setFormData({...formData, class: e.target.value})} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Pilih Kelas</option>
                <option value="A">Kelas A</option>
                <option value="B">Kelas B</option>
                <option value="C">Kelas C</option>
                <option value="D">Kelas D</option>
              </select>
            </div>
          </div>

          {/* 3. Tambahkan Input untuk Alamat */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows="3"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan alamat lengkap rumah sakit..."
              required
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate("/hospitals")} 
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
            >
              <X size={18} className="inline mr-2" /> Batal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <Save size={18} className="inline mr-2" /> 
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HospitalFormPage;
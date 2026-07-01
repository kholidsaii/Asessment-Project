import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../utils/constant/http";
import { Save, X, User } from "lucide-react";

function PatientFormPage() {
  const { id } = useParams();
  const isEditMode = !!id && id !== "new";
  const navigate = useNavigate();

  // State awal formulir
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", 
    role: "user" // Default role
  });
  const [loading, setLoading] = useState(false);

  // Ambil data jika dalam mode Edit
  useEffect(() => {
    if (isEditMode) {
      http.get(`/users/${id}`)
        .then(res => {
          // Menyesuaikan dengan format respon API kamu
          const data = res.data.data || res.data; 
          setFormData({
            name: data.name || "",
            email: data.email || "",
            password: "", // Kosongkan agar password lama tidak terlihat
            role: data.role || "user"
          });
        })
        .catch(err => {
          console.error("Gagal memuat data:", err);
          alert("Gagal memuat data pengguna.");
        });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Menyalin data agar tidak mengubah state secara langsung
    const payload = { ...formData };

    // Jika sedang mode edit dan password dikosongkan, hapus password dari payload
    // agar backend tidak mengubah password lama menjadi kosong.
    if (isEditMode && payload.password === "") {
      delete payload.password;
    }

    try {
      if (isEditMode) {
        await http.put(`/users/${id}`, payload);
      } else {
        await http.post("/users", payload);
      }
      // Kembali ke halaman daftar pasien jika sukses
      navigate("/patients");
    } catch (err) {
      alert("Gagal menyimpan data: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <User size={24} />
          </div>
          {isEditMode ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input 
              type="text"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Masukkan nama lengkap pengguna..."
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="email@contoh.com"
                required 
              />
            </div>
            
            {/* Input Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Hak Akses (Role)</label>
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="user">User / Pasien</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password {isEditMode && <span className="text-slate-400 font-normal">(Kosongkan jika tidak ingin mengubah password)</span>}
            </label>
            <input 
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan password..."
              // Wajib diisi jika sedang membuat data baru
              required={!isEditMode}
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate("/patients")} 
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
            >
              <X size={18} className="inline mr-2" /> Batal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-slate-400"
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

export default PatientFormPage;
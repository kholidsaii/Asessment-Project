import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/constant/http";

function CategoryFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [loading, setLoading] = useState(false);

  // Jika mode edit, ambil data lama
  useEffect(() => {
    if (isEditMode) {
      api.get(`/categories/${id}`).then(res => {
        setName(res.data.data.name);
        setGroup(res.data.data.group || "");
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Membuat slug otomatis dari nama (menghapus spasi dan mengubah ke lowercase)
  const generatedSlug = name.toLowerCase().replace(/\s+/g, '-');

  try {
    const payload = {
      name: name,
      slug: generatedSlug, // Backend mewajibkan field ini
      group: group
    };

    if (isEditMode) {
      await api.put(`/categories/${id}`, payload);
    } else {
      await api.post("/categories", payload);
    }
    navigate("/categories");
  } catch (err) {
    // Menampilkan pesan error detail dari backend agar tahu field mana yang kurang
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Gagal menyimpan kategori");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-6">{isEditMode ? "Edit" : "Tambah"} Kategori</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          value={name} onChange={(e) => setName(e.target.value)} 
          placeholder="Nama Kategori" className="w-full p-3 border rounded-xl" required 
        />
        <input 
          value={group} onChange={(e) => setGroup(e.target.value)} 
          placeholder="Grup (Contoh: Pelayanan Medik)" className="w-full p-3 border rounded-xl" 
        />
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-200 rounded-xl">Batal</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-xl">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default CategoryFormPage;
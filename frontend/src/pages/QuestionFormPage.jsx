import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/constant/http";
import { Save, X, FileQuestion } from "lucide-react";

function QuestionFormPage() {
  const { id } = useParams();
  const isEditMode = !!id && id !== "new";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ question: "", category_id: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil data kategori untuk dropdown
    api.get("/categories").then(res => setCategories(res.data.data || []));

    // Jika edit, ambil data pertanyaan lama
    if (isEditMode) {
      api.get(`/questions/${id}`).then(res => {
        const data = res.data.data;
        setFormData({ question: data.question || data.name || "", category_id: data.category_id || "" });
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/questions/${id}`, formData);
      } else {
        await api.post("/questions", formData);
      }
      navigate("/questions");
    } catch (err) {
      alert("Gagal menyimpan data: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileQuestion className="text-blue-600" /> 
        {isEditMode ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Kategori Instrumen</label>
          <select 
            value={formData.category_id} 
            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Teks Pertanyaan / Instrumen</label>
          <textarea
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            rows="4"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ketik poin penilaian di sini..." required
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate("/questions")} className="px-5 py-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 font-semibold"><X size={18} className="inline" /> Batal</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold disabled:bg-slate-400"><Save size={18} className="inline" /> Simpan</button>
        </div>
      </form>
    </div>
  );
}

export default QuestionFormPage;
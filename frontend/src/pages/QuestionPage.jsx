import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/constant/http";
import { Edit, Trash2, FileQuestion, AlertCircle } from "lucide-react";

function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const res = await api.get("/questions");
      setQuestions(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data pertanyaan");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pertanyaan ini?")) {
      try {
        await api.delete(`/questions/${id}`);
        fetchQuestions();
      } catch (err) {
        alert("Gagal menghapus data.");
      }
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-blue-600">Memuat pertanyaan...</div>;

  return (
    <div className="pb-20 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FileQuestion className="text-blue-600" /> Master Pertanyaan
          </h1>
          <p className="text-slate-500 mt-2">Kelola daftar pertanyaan untuk instrumen assessment</p>
        </div>
        <button
          onClick={() => navigate("/questions/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all"
        >
          + Tambah Pertanyaan
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-5 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 font-semibold text-slate-700 w-16 text-center">No</th>
              <th className="p-4 font-semibold text-slate-700">Pertanyaan</th>
              <th className="p-4 font-semibold text-slate-700 w-32 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {questions.length === 0 ? (
              <tr><td colSpan="3" className="p-10 text-center text-slate-400">Belum ada data pertanyaan</td></tr>
            ) : (
              questions.map((q, i) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="p-4 text-center">{i + 1}</td>
                  <td className="p-4 font-medium text-slate-800">{q.question || q.name}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => navigate(`/questions/${q.id}/edit`)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(q.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuestionPage;
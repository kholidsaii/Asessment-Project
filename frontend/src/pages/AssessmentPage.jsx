import { useState, useEffect } from "react";
import api from "../utils/constant/http";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

function AssessmentPage({ user }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk menampung form penilaian per question_id
  const [scores, setScores] = useState({});
  const [files, setFiles] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);

  // 1. Ambil Semua Kategori Mutu
  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error("Gagal load kategori", err));
  }, []);

  // 2. Ambil Pertanyaan jika Kategori Dipilih
  useEffect(() => {
    if (!selectedCategory) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    api.get(`/questions?category_id=${selectedCategory}`)
      .then((res) => {
        setQuestions(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setQuestions([]);
        setLoading(false);
      });
  }, [selectedCategory]);

  const handleScoreChange = (qId, val) => {
    setScores(prev => ({ ...prev, [qId]: val }));
  };

  const handleFileChange = (qId, e) => {
    setFiles(prev => ({ ...prev, [qId]: e.target.files[0] }));
  };

  // 3. Submit Skor per Indikator Pertanyaan
  const handleSubmitAssessment = async (questionId) => {
    const score = scores[questionId];
    const file = files[questionId];

    if (score === undefined || score === "") {
      alert("Pilih skor terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("hospital_id", user.hospital_id);
    formData.append("question_id", questionId);
    formData.append("score", score);
    if (file) {
      formData.append("photo", file);
    }

    try {
      const res = await api.post("/assessments", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        setStatusMessage({ type: "success", text: `Skor untuk pertanyaan ID ${questionId} berhasil disimpan!` });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Gagal menyimpan skor ke server." });
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Form Input Assessment</h1>
        <p className="text-slate-500 mt-1">Silakan pilih kategori instrumen penilaian mutu rumah sakit Anda.</p>
      </div>

      {statusMessage && (
        <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 border ${
          statusMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {statusMessage.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Pilihan Kategori */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori Instrumen</label>
        <select
          className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Pilih Kategori Penilaian --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name} ({cat.group})</option>
          ))}
        </select>
      </div>

      {/* Daftar Pertanyaan */}
      {loading ? (
        <p className="text-center text-slate-500 p-10 animate-pulse">Memuat lembar pertanyaan...</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
              <div className="flex gap-3">
                <span className="bg-blue-50 text-blue-600 font-bold w-7 h-7 flex items-center justify-center rounded-lg text-sm shrink-0">
                  {index + 1}
                </span>
                <p className="text-slate-800 font-medium pt-0.5">{q.indicator}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {/* Input Nilai Skor */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Input Nilai Kemampuan</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleScoreChange(q.id, num)}
                        className={`w-10 h-10 rounded-xl font-semibold border transition ${
                          scores[q.id] === num ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Foto Bukti */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Foto / Berkas Bukti Implementasi</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm text-slate-600 transition">
                      <Upload size={16} />
                      <span>Pilih File</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(q.id, e)} />
                    </label>
                    <span className="text-xs text-slate-400 truncate max-w-[200px]">
                      {files[q.id] ? files[q.id].name : "Belum ada file dipilih"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleSubmitAssessment(q.id)}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
                >
                  Simpan Jawaban
                </button>
              </div>
            </div>
          ))}

          {selectedCategory && questions.length === 0 && (
            <div className="text-center p-10 bg-white border border-dashed rounded-2xl text-slate-400">
              Belum ada daftar pertanyaan instrumen untuk kategori ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AssessmentPage;      
import { useState, useEffect } from "react";
import api from "../utils/constant/http";
import { Upload, CheckCircle2, Loader2, Info } from "lucide-react";

function AssessmentPage({ user }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State Management untuk form per-pertanyaan
  const [scores, setScores] = useState({});
  const [files, setFiles] = useState({});
  
  // UX State: Melacak status pengiriman tiap pertanyaan
  const [submittingId, setSubmittingId] = useState(null);
  const [submittedStatus, setSubmittedStatus] = useState({}); // Contoh: { 1: true, 2: true }

  // 1. Fetch Master Kategori saat halaman dimuat
  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error("Gagal memuat kategori", err));
  }, []);

  // 2. Fetch Pertanyaan saat Kategori dipilih
  useEffect(() => {
    if (!selectedCategory) {
      setQuestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Reset form setiap ganti kategori agar bersih
    setScores({});
    setFiles({});
    setSubmittedStatus({});

    api.get(`/questions?category_id=${selectedCategory}`)
      .then((res) => {
        setQuestions(res.data.data || []);
      })
      .catch((err) => {
        setQuestions([]);
        if (err.response?.status === 404) {
          setError("Belum ada daftar pertanyaan untuk kategori ini.");
        } else {
          setError("Gagal mengambil data instrumen dari server.");
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleScoreChange = (qId, val) => {
    setScores((prev) => ({ ...prev, [qId]: val }));
  };

  const handleFileChange = (qId, e) => {
    setFiles((prev) => ({ ...prev, [qId]: e.target.files[0] }));
  };

  // 3. Eksekusi Pengiriman per Indikator
  const handleSubmitAssessment = async (questionId) => {
    const score = scores[questionId];
    const file = files[questionId];

    if (score === undefined || score === null) {
      alert("Harap pilih nilai skor terlebih dahulu!");
      return;
    }

    // Menggunakan FormData karena kita mengirim file gambar (photo)
    const formData = new FormData();
    // Catatan: Jika DB user belum ada hospital_id, kita pakai fallback ID 1 untuk testing
    formData.append("hospital_id", user?.hospital_id || 1); 
    formData.append("question_id", questionId);
    formData.append("score", score);
    
    if (file) {
      formData.append("photo", file);
    }

    try {
      setSubmittingId(questionId);
      
      const res = await api.post("/assessments", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        // Tandai pertanyaan ini sudah sukses diisi
        setSubmittedStatus((prev) => ({ ...prev, [questionId]: true }));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menyimpan jawaban. Coba lagi.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="max-w-4xl pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Form Input Assessment</h1>
        <p className="text-slate-500 mt-1">
          Pilih kategori dan lengkapi instrumen penilaian mutu layanan rumah sakit.
        </p>
      </div>

      {/* Bagian Pilihan Kategori */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-3">
          Pilih Kategori Instrumen:
        </label>
        <select
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700 font-medium"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Silakan Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} {cat.group ? `(${cat.group})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Menampilkan Status Loading / Error Murni untuk Pertanyaan */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
          <p className="animate-pulse">Menyiapkan lembar kuesioner...</p>
        </div>
      )}

      {error && !loading && selectedCategory && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 p-6 rounded-2xl flex items-center justify-center gap-3">
          <Info size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Daftar Kuesioner (Dirender jika ada data) */}
      {!loading && questions.length > 0 && (
        <div className="space-y-5">
          {questions.map((q, index) => {
            const isSubmitted = submittedStatus[q.id];
            const isSubmitting = submittingId === q.id;

            return (
              <div 
                key={q.id} 
                // Jika sudah disubmit, ubah border menjadi hijau sebagai tanda visual
                className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all duration-300 ${
                  isSubmitted ? "border-emerald-400 bg-emerald-50/30" : "border-slate-100"
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl font-bold text-sm ${
                    isSubmitted ? "bg-emerald-500 text-white" : "bg-blue-100 text-blue-600"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-800 font-semibold mb-4 text-lg leading-snug">
                      {q.indicator}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      
                      {/* 1. Input Nilai (0-5) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                          Skor Penilaian
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              disabled={isSubmitted || isSubmitting}
                              onClick={() => handleScoreChange(q.id, num)}
                              className={`w-11 h-11 rounded-xl font-bold border-2 transition ${
                                scores[q.id] === num
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Upload Bukti Foto */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                          Dokumen / Foto Bukti (Opsional)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                            isSubmitted || isSubmitting
                              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}>
                            <Upload size={16} />
                            <span>Pilih File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isSubmitted || isSubmitting}
                              onChange={(e) => handleFileChange(q.id, e)}
                            />
                          </label>
                          <span className="text-sm text-slate-500 truncate max-w-[150px]">
                            {files[q.id] ? files[q.id].name : "Tidak ada file"}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* 3. Tombol Eksekusi Submit per Soal */}
                    <div className="flex justify-end pt-5 mt-2">
                      {isSubmitted ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold px-4 py-2 bg-emerald-100 rounded-xl">
                          <CheckCircle2 size={20} />
                          <span>Tersimpan</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubmitAssessment(q.id)}
                          disabled={isSubmitting || scores[q.id] === undefined}
                          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              <span>Menyimpan...</span>
                            </>
                          ) : (
                            <span>Simpan Jawaban</span>
                          )}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AssessmentPage;
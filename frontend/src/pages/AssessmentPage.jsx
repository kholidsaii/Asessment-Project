import { useState, useEffect } from "react";
import api from "../utils/constant/http";
import { Upload, CheckCircle2, Loader2, Info, Hospital, AlertCircle, FileText } from "lucide-react"; 

function AssessmentPage({ user }) {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [scores, setScores] = useState({});
  const [files, setFiles] = useState({});
  
  const [submittingId, setSubmittingId] = useState(null);
  const [submittedStatus, setSubmittedStatus] = useState({});

  // 1. Fetch Master Kategori & Data Rumah Sakit
  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error("Gagal memuat kategori", err));

    api.get("/hospitals")
      .then((res) => setHospitals(res.data.data || []))
      .catch((err) => console.error("Gagal memuat RS", err));
  }, []);

  // 2. Fetch Pertanyaan saat Kategori dipilih
// 2. Fetch Pertanyaan DAN Riwayat Jawaban
  useEffect(() => {
    if (!selectedCategory || !selectedHospital) {
      setQuestions([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setScores({});
      setFiles({});
      setSubmittedStatus({});

      try {
        // A. Ambil list instrumen pertanyaan (Wajib Berhasil)
        const qRes = await api.get(`/questions?category_id=${selectedCategory}`);
        setQuestions(qRes.data.data || []);

        // B. Ambil riwayat penilaian (Diletakkan di try-catch terpisah)
       try {
          // UBAH BARIS INI: Ganti kata 'report' menjadi 'answers'
          const rRes = await api.get(`/assessments/answers/${selectedHospital}`);
          const historyData = rRes.data.data;

          if (Array.isArray(historyData)) {
            const existingScores = {};
            const existingStatus = {};

            historyData.forEach((item) => {
              existingScores[item.question_id] = item.score; 
              existingStatus[item.question_id] = true; 
            });

            setScores(existingScores);
            setSubmittedStatus(existingStatus);
          }
        } catch (historyErr) {
          console.log("Riwayat jawaban kosong untuk RS ini.");
        }

      } catch (err) {
        console.error("Gagal memuat instrumen:", err);
        setQuestions([]);
        setError("Gagal memuat daftar instrumen pertanyaan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedHospital]);

  const handleScoreChange = (qId, val) => setScores((prev) => ({ ...prev, [qId]: val }));
  const handleFileChange = (qId, e) => setFiles((prev) => ({ ...prev, [qId]: e.target.files[0] }));

  // 3. Eksekusi Pengiriman
  const handleSubmitAssessment = async (questionId) => {
    if (!selectedHospital) {
      alert("Harap pilih Rumah Sakit terlebih dahulu!");
      return;
    }

    const score = scores[questionId];
    const file = files[questionId];

    if (score === undefined || score === "") {
      alert("Harap pilih status kepatuhan (Patuh/Tidak Patuh) terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("hospital_id", selectedHospital);
    formData.append("question_id", questionId);
    formData.append("score", score);
    
    // Hanya tambahkan foto jika user mengunggahnya
    if (file) {
        formData.append("photo", file);
    }

    try {
      setSubmittingId(questionId);
      const res = await api.post("/assessments", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success || res.status === 201 || res.status === 200) {
        setSubmittedStatus((prev) => ({ ...prev, [questionId]: true }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan jawaban.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="max-w-4xl pb-20 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FileText className="text-blue-600" size={32} />
            Form Input Assessment
        </h1>
        <p className="text-slate-500 mt-2">Pilih Rumah Sakit dan Kategori untuk memulai evaluasi kepatuhan.</p>
      </div>

      {/* Grid Pemilihan: RS dan Kategori */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Pilih RS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Hospital size={18} className="text-blue-600" /> Pilih Rumah Sakit:
            </label>
            <select
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700 font-medium cursor-pointer"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
            >
                <option value="">-- Silakan Pilih RS --</option>
                {hospitals.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
                ))}
            </select>
        </div>

        {/* Pilih Kategori */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Info size={18} className="text-blue-600" /> Pilih Kategori Instrumen:
            </label>
            <select
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700 font-medium cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">-- Silakan Pilih Kategori --</option>
                {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
      </div>

      {/* TAMPILAN LOADING */}
      {loading && (
        <div className="flex items-center justify-center p-16 text-slate-500">
          <Loader2 className="animate-spin text-blue-600 mr-3" size={24} />
          <p className="font-medium">Memuat instrumen penilaian...</p>
        </div>
      )}

      {/* TAMPILAN ERROR */}
      {error && !loading && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-5 mb-6 flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-lg mb-1">Pemberitahuan</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* DAFTAR PERTANYAAN */}
      {!loading && questions.length > 0 && (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-2 flex items-center gap-3 text-blue-800">
                <Info size={20} className="shrink-0" />
                <p className="text-sm font-medium">Isi status kepatuhan dan lampirkan bukti foto jika diperlukan. Jangan lupa klik "Simpan" pada setiap nomor.</p>
            </div>

          {questions.map((q, index) => (
            <div key={q.id} className={`bg-white p-6 rounded-2xl border transition-all ${submittedStatus[q.id] ? 'border-green-300 ring-4 ring-green-50' : 'border-slate-200 shadow-sm hover:border-blue-300'}`}>
              
              {/* Teks Pertanyaan */}
             <h3 className="font-bold text-slate-800 mb-4 text-lg leading-snug">
                <span className="text-blue-600 mr-1">{index + 1}.</span> 
                {/* Tambahkan q.indicator di urutan paling depan */}
                {q.indicator || q.question || q.name || "Teks instrumen tidak tersedia"}
              </h3>

              <div className="flex flex-col md:flex-row gap-5 mt-4">
                
                {/* 1. Input Skor (Patuh / Tidak Patuh) */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status Kepatuhan:</label>
                  <select
                    className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-slate-100 disabled:cursor-not-allowed cursor-pointer"
                    value={scores[q.id] !== undefined ? scores[q.id] : ""}
                    onChange={(e) => handleScoreChange(q.id, e.target.value)}
                    disabled={submittedStatus[q.id]}
                  >
                    <option value="">-- Pilih Status --</option>
                    <option value="1">✅ Sudah Dipatuhi</option>
                    <option value="0">❌ Belum Dipatuhi</option>
                  </select>
                </div>

                {/* 2. Input Upload Foto */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bukti Lampiran Foto:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(q.id, e)}
                    disabled={submittedStatus[q.id]}
                    className="w-full p-2 border border-slate-300 rounded-xl text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* 3. Tombol Simpan Aksi */}
              <div className="mt-6 flex justify-end pt-4 border-t border-slate-100">
                {submittedStatus[q.id] ? (
                  <div className="flex items-center gap-2 text-green-700 font-semibold bg-green-100 px-5 py-2.5 rounded-xl border border-green-200">
                    <CheckCircle2 size={20} /> Data Tersimpan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubmitAssessment(q.id)}
                    disabled={submittingId === q.id || !selectedHospital}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition active:scale-95 disabled:bg-slate-300 disabled:text-slate-500 disabled:active:scale-100 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                  >
                    {submittingId === q.id ? (
                      <><Loader2 size={18} className="animate-spin" /> Memproses...</>
                    ) : (
                      <><Upload size={18} /> Simpan Jawaban</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssessmentPage;
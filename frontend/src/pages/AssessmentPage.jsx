import { useState, useEffect } from "react";
import api from "../utils/constant/http";
import { Upload, CheckCircle2, Loader2, Info } from "lucide-react";

function AssessmentPage({ user }) {
  const [hospitals, setHospitals] = useState([]);
  const [indicators, setIndicators] = useState([]);
  
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedIndicator, setSelectedIndicator] = useState("");
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [scores, setScores] = useState({});
  const [files, setFiles] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [submittedStatus, setSubmittedStatus] = useState({});

  // 1. Fetch Rumah Sakit & Indikator
  useEffect(() => {
    api.get("/indicators")
      .then((res) => setIndicators(res.data.data || []))
      .catch((err) => console.error("Gagal memuat indikator", err));

    api.get("/hospitals")
      .then((res) => setHospitals(res.data.data || []))
      .catch((err) => console.error("Gagal memuat daftar RS", err));
  }, []);

  useEffect(() => {
    if (user?.hospital_id) {
      setSelectedHospital(user.hospital_id);
    }
  }, [user]);

  // 2. Fetch Riwayat Jawaban berdasarkan Rumah Sakit yang dipilih
  useEffect(() => {
    if (!selectedHospital) {
      setScores({});
      setSubmittedStatus({});
      return;
    }

    // Ambil data jawaban lama dari backend
    api.get(`/assessments/answers/${selectedHospital}`)
      .then((res) => {
        if (res.data.success) {
          const historyScores = {};
          const historyStatus = {};
          
          res.data.data.forEach((item) => {
            historyScores[item.question_id] = item.score;
            historyStatus[item.question_id] = true; // Tandai bahwa ini sudah tersimpan
          });
          
          setScores(historyScores);
          setSubmittedStatus(historyStatus);
        }
      })
      .catch((err) => console.error("Gagal mengambil riwayat jawaban:", err));
  }, [selectedHospital]);

  // 3. Fetch Pertanyaan saat Kategori dipilih
  useEffect(() => {
    if (!selectedIndicator) {
      setQuestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    // CATATAN: State scores dan status TIDAK DI-RESET di sini agar riwayat tidak hilang

    api.get(`/questions?category_id=${selectedIndicator}`)
      .then((res) => {
        setQuestions(res.data.data || []);
      })
      .catch((err) => {
        setQuestions([]);
        setError(err.response?.status === 404 ? "Belum ada pertanyaan pada kategori ini." : "Gagal mengambil instrumen.");
      })
      .finally(() => setLoading(false));
  }, [selectedIndicator]); 

  // Memungkinkan user meng-update jawaban yang sudah tersimpan
  const handleScoreChange = (qId, val) => {
    setScores((prev) => ({ ...prev, [qId]: val }));
    setSubmittedStatus((prev) => ({ ...prev, [qId]: false })); // Hilangkan status 'Tersimpan' agar tombol Simpan muncul lagi
  };

  const handleFileChange = (qId, e) => {
    setFiles((prev) => ({ ...prev, [qId]: e.target.files[0] }));
    setSubmittedStatus((prev) => ({ ...prev, [qId]: false }));
  };

  const handleSubmitAssessment = async (questionId) => {
    const score = scores[questionId];
    const file = files[questionId];

    if (score === undefined || score === null) {
      alert("Harap pilih nilai skor terlebih dahulu!");
      return;
    }

    if (!selectedHospital) {
      alert("Harap pilih Rumah Sakit terlebih dahulu di bagian atas!");
      return;
    }

    const formData = new FormData();
    formData.append("hospital_id", selectedHospital);
    formData.append("question_id", questionId);
    formData.append("score", score);

    if (file) {
      formData.append("photo", file);
    }

    try {
      setSubmittingId(questionId);
      const res = await api.post("/assessments", formData);

      if (res.data.success) {
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
          Pilih indikator layanan/fasilitas dan lengkapi instrumen penilaian mutu rumah sakit.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <label className="block text-sm font-bold text-slate-700 mb-3">
            Pilih Rumah Sakit:
          </label>
          <select
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700 font-medium"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
          >
            <option value="">-- Silakan Pilih Rumah Sakit --</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <label className="block text-sm font-bold text-slate-700 mb-3">
            Pilih Indikator / Layanan:
          </label>
          <select
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700 font-medium"
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
          >
            <option value="">-- Silakan Pilih Indikator --</option>
            {indicators.map((indicator) => (
              <option key={indicator.id} value={indicator.id}>
                {indicator.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
          <p className="animate-pulse">Menyiapkan lembar kuesioner...</p>
        </div>
      )}

      {error && !loading && selectedIndicator && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 p-6 rounded-2xl flex items-center justify-center gap-3">
          <Info size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!loading && selectedIndicator && !error && questions.length === 0 && (
        <div className="bg-slate-50 border border-dashed text-slate-500 p-8 rounded-2xl text-center">
          Belum ada pertanyaan untuk indikator ini.
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="space-y-5">
          {questions.map((q, index) => {
            const isSubmitted = submittedStatus[q.id];
            const isSubmitting = submittingId === q.id;

            return (
              <div
                key={q.id}
                className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all duration-300 ${
                  isSubmitted ? "border-emerald-400 bg-emerald-50/30" : "border-slate-100"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl font-bold text-sm ${
                      isSubmitted ? "bg-emerald-500 text-white" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-slate-800 font-semibold text-lg leading-snug">
                        {q.question_text}
                      </h3>
                      {q.indicator_name && (
                        <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                          Indikator: {q.indicator_name}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                          Skor Penilaian
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[0, 5, 10].map((num) => (
                            <button
                              key={num}
                              type="button"
                              disabled={isSubmitting} // Kini hanya disable ketika sedang submit API, user bebas mengklik skor lagi untuk update data
                              onClick={() => handleScoreChange(q.id, num)}
                              className={`min-w-14 h-11 px-3 rounded-xl font-bold border-2 transition ${
                                scores[q.id] === num
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                          0 = belum memenuhi, 5 = sebagian, 10 = memenuhi.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                          Dokumen / Foto Bukti (Opsional)
                        </label>
                        <div className="flex items-center gap-3">
                          <label
                            className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                              isSubmitting
                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <Upload size={16} />
                            <span>Pilih File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isSubmitting}
                              onChange={(e) => handleFileChange(q.id, e)}
                            />
                          </label>
                          <span className="text-sm text-slate-500 truncate max-w-37.5">
                            {files[q.id] ? files[q.id].name : "Tidak ada file (atau tersimpan di sistem)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-5 mt-2">
                      {isSubmitted ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold px-4 py-2 bg-emerald-100 rounded-xl cursor-default">
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
                            <span>{scores[q.id] !== undefined ? "Simpan Jawaban" : "Pilih Skor Dulu"}</span>
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
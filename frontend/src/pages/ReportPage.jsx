import { useState, useEffect } from "react";
import api from "../utils/constant/http";
import { FileText, TrendingUp, Award, CheckCircle2, Building2 } from "lucide-react";

function ReportPage({ user }) {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatNumber = (value) => {
    const number = Number(value || 0);
    return Number.isInteger(number) ? number : number.toFixed(2);
  };

  // 1. Ambil daftar RS saat komponen dimuat
  useEffect(() => {
    api.get("/hospitals")
      .then((res) => setHospitals(res.data.data || []))
      .catch((err) => console.error("Gagal memuat RS", err));
  }, []);

  // Set default hospital jika user login
  useEffect(() => {
    if (user?.hospital_id) {
      setSelectedHospital(user.hospital_id);
    }
  }, [user]);

  // 2. Fetch laporan saat RS dipilih
  useEffect(() => {
    if (!selectedHospital) {
      setReport(null);
      return;
    }

    setLoading(true);
    setError(null);

    api.get(`/assessments/report/${selectedHospital}`)
      .then((res) => {
        setReport(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Data rekap laporan belum tersedia.");
        setLoading(false);
      });
  }, [selectedHospital]);

  return (
    <div className="max-w-5xl pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Laporan Rekap Penilaian</h1>
        <p className="text-slate-500 mt-1">Pilih rumah sakit untuk melihat akumulasi penilaian mutu.</p>
      </div>

      {/* Dropdown Pilih Rumah Sakit */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm mb-8 flex items-center gap-4">
        <Building2 className="text-slate-400" />
        <select
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-slate-700 font-medium"
          value={selectedHospital}
          onChange={(e) => setSelectedHospital(e.target.value)}
        >
          <option value="">-- Pilih Rumah Sakit --</option>
          {hospitals.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="p-10 text-center animate-pulse text-slate-500">Menyusun ringkasan laporan...</p>
      ) : error ? (
        <div className="bg-slate-100 border border-dashed rounded-2xl p-10 text-center text-slate-400">
          <FileText className="mx-auto mb-3 text-slate-300" size={40} />
          <p className="font-medium">{error}</p>
        </div>
      ) : !report ? (
        <div className="text-center py-20 text-slate-400">Silakan pilih rumah sakit terlebih dahulu.</div>
      ) : (
        <>
          {/* BAGIAN STATISTIK (Sama seperti kode Anda sebelumnya) */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Pertanyaan Dinilai</p>
                <h3 className="text-2xl font-bold text-slate-800">{report.total_evaluated || 0} / {report.total_questions || 0}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Rata-rata Skor</p>
                <h3 className="text-2xl font-bold text-emerald-600">{formatNumber(report.average_score)} / 10</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Status Mutu</p>
                <h3 className="text-2xl font-bold text-slate-800">{report.evaluation_status || "-"}</h3>
              </div>
            </div>
          </div>

          {/* Progress Bar & Detail (Sama seperti kode Anda sebelumnya) */}
          {/* ... tambahkan kode Progress Bar dan Detail list Anda di sini ... */}
        </>
      )}
    </div>
  );
}

export default ReportPage;
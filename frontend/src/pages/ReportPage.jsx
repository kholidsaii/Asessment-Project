import { useState, useEffect } from "react";
import api from "../utils/constant/http";
import { FileText, TrendingUp, Award } from "lucide-react";

function ReportPage({ user }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/assessments/report/${user.hospital_id}`)
      .then((res) => {
        setReport(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Data rekap laporan penilaian belum tersedia.");
        setLoading(false);
      });
  }, [user.hospital_id]);

  if (loading) return <p className="p-10 text-center animate-pulse text-slate-500">Menyusun ringkasan laporan...</p>;

  if (error) {
    return (
      <div className="bg-slate-100 border border-dashed rounded-2xl p-10 text-center text-slate-400">
        <FileText className="mx-auto mb-3 text-slate-300" size={40} />
        <p className="font-medium">{error}</p>
        <p className="text-xs mt-1">Silakan lakukan pengisian kuesioner mutu pada menu Input Assessment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Laporan Rekap Penilaian</h1>
        <p className="text-slate-500 mt-1">Hasil akumulasi perhitungan penilaian dari seluruh instrumen mutu.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Indikator Dinilai</p>
            <h3 className="text-2xl font-bold text-slate-800">{report?.total_evaluated || 0} Soal</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Rata-rata Skor Mutu</p>
            <h3 className="text-2xl font-bold text-emerald-600">{report?.average_score || 0} / 5</h3>
          </div>
        </div>
      </div>

      {/* Rincian Detail dari Response DB */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Hasil Evaluasi Mutu Kerja</h3>
        <div className="p-8 bg-slate-50 rounded-xl text-center text-sm text-slate-500 border border-dashed">
          Visualisasi grafis capaian indikator kepatuhan standar rumah sakit.
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
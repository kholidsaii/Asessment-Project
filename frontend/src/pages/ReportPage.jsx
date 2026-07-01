import { useState, useEffect } from "react";
import api from "../utils/constant/http";
import { FileText, TrendingUp, Award, CheckCircle2 } from "lucide-react";

function ReportPage({ user }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatNumber = (value) => {
    const number = Number(value || 0);
    return Number.isInteger(number) ? number : number.toFixed(2);
  };

  useEffect(() => {
    if (!user?.hospital_id) {
      setError("Akun ini belum terhubung dengan data rumah sakit.");
      setLoading(false);
      return;
    }

    api
      .get(`/assessments/report/${user.hospital_id}`)
      .then((res) => {
        setReport(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Data rekap laporan penilaian belum tersedia."
        );
        setLoading(false);
      });
  }, [user?.hospital_id]);

  if (loading) {
    return (
      <p className="p-10 text-center animate-pulse text-slate-500">
        Menyusun ringkasan laporan...
      </p>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-100 border border-dashed rounded-2xl p-10 text-center text-slate-400">
        <FileText className="mx-auto mb-3 text-slate-300" size={40} />
        <p className="font-medium">{error}</p>
        <p className="text-xs mt-1">
          Silakan lakukan pengisian kuesioner mutu pada menu Input Assessment.
        </p>
      </div>
    );
  }

  const details = report?.details || [];

  return (
    <div className="max-w-5xl pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Laporan Rekap Penilaian
        </h1>
        <p className="text-slate-500 mt-1">
          Hasil akumulasi penilaian mutu berdasarkan instrumen assessment rumah sakit.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Pertanyaan Dinilai
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {report?.total_evaluated || 0} / {report?.total_questions || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Rata-rata Skor Mutu
            </p>
            <h3 className="text-2xl font-bold text-emerald-600">
              {formatNumber(report?.average_score)} / 10
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Status Mutu</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {report?.evaluation_status || "-"}
            </h3>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Progress Pengisian Assessment
            </h3>
            <p className="text-sm text-slate-500">
              Persentase pertanyaan yang sudah dinilai oleh rumah sakit.
            </p>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {formatNumber(report?.completion_percentage)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${Math.min(Number(report?.completion_percentage || 0), 100)}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Hasil Evaluasi Mutu Kerja
        </h3>

        {details.length === 0 ? (
          <div className="p-8 bg-slate-50 rounded-xl text-center text-sm text-slate-500 border border-dashed">
            Belum ada rincian evaluasi per indikator.
          </div>
        ) : (
          <div className="space-y-4">
            {details.map((item) => (
              <div
                key={item.indicator_id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {item.indicator_name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      Terjawab {item.answered_questions || 0} dari {item.total_questions || 0} pertanyaan
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-white px-3 py-1 font-semibold text-blue-600 border">
                      Skor {formatNumber(item.average_score)} / 10
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600 border">
                      {item.evaluation_status || "-"}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(Number(item.completion_percentage || 0), 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;

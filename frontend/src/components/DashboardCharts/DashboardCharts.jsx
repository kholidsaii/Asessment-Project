import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../utils/constant/http";

function DashboardCharts({ mode = "admin", user }) {
  const [chartData, setChartData] = useState({
    scoreByIndicator: [],
    hospitalRanking: [],
    assessmentTrend: [],
    progress: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = mode === "admin";

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setLoading(true);
        setError("");

        const endpoint = isAdmin
          ? "/dashboard/admin/charts"
          : `/dashboard/user/charts/${user?.hospital_id}`;

        if (!isAdmin && !user?.hospital_id) {
          setError("Akun ini belum terhubung dengan data rumah sakit.");
          return;
        }

        const res = await api.get(endpoint);

        if (res.data.success) {
          setChartData(res.data.data || {});
        }
      } catch (err) {
        console.error("Gagal mengambil data grafik dashboard:", err);
        setError("Gagal mengambil data grafik dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, [isAdmin, user?.hospital_id]);

  const formatScore = (value) => `${Number(value || 0).toFixed(2)} / 10`;
  const formatDate = (value) => {
    if (!value) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
    }).format(new Date(value));
  };

  const scoreByIndicator = (chartData.scoreByIndicator || []).map((item) => ({
    ...item,
    name: item.indicator_name,
    average_score: Number(item.average_score || 0),
  }));

  const hospitalRanking = (chartData.hospitalRanking || []).map((item) => ({
    ...item,
    name: item.hospital_name,
    average_score: Number(item.average_score || 0),
  }));

  const assessmentTrend = (chartData.assessmentTrend || []).map((item) => ({
    ...item,
    date_label: formatDate(item.assessment_date),
    total_assessments: Number(item.total_assessments || 0),
  }));

  const progress = (chartData.progress || []).map((item) => ({
    ...item,
    value: Number(item.value || 0),
  }));

  if (loading) {
    return (
      <div className="mb-8 rounded-2xl border bg-white p-6 text-slate-500 shadow-sm">
        Memuat grafik dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Rata-rata Skor per Indikator
            </h2>
            <p className="text-sm text-slate-500">
              Perbandingan capaian mutu berdasarkan seluruh penilaian rumah sakit.
            </p>
          </div>

          {scoreByIndicator.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreByIndicator} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [formatScore(value), "Rata-rata skor"]} />
                  <Bar dataKey="average_score" name="Rata-rata skor" radius={[10, 10, 0, 0]} fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Ranking Rumah Sakit
            </h2>
            <p className="text-sm text-slate-500">
              Lima rumah sakit dengan rata-rata skor assessment tertinggi.
            </p>
          </div>

          {hospitalRanking.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hospitalRanking} layout="vertical" margin={{ top: 10, right: 20, left: 35, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                  <Tooltip formatter={(value) => [formatScore(value), "Rata-rata skor"]} />
                  <Bar dataKey="average_score" name="Rata-rata skor" radius={[0, 10, 10, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Tren Aktivitas Penilaian
            </h2>
            <p className="text-sm text-slate-500">
              Jumlah penilaian yang masuk berdasarkan tanggal terbaru.
            </p>
          </div>

          {assessmentTrend.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={assessmentTrend} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date_label" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [value, "Total penilaian"]} />
                  <Line type="monotone" dataKey="total_assessments" name="Total penilaian" stroke="#7c3aed" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 grid gap-6 xl:grid-cols-2">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            Skor per Indikator
          </h2>
          <p className="text-sm text-slate-500">
            Rata-rata skor rumah sakit kamu pada setiap indikator assessment.
          </p>
        </div>

        {scoreByIndicator.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreByIndicator} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [formatScore(value), "Rata-rata skor"]} />
                <Bar dataKey="average_score" name="Rata-rata skor" radius={[10, 10, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            Progress Pengisian
          </h2>
          <p className="text-sm text-slate-500">
            Perbandingan pertanyaan yang sudah dan belum dinilai.
          </p>
        </div>

        {progress.every((item) => item.value === 0) ? (
          <EmptyChart />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progress}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {progress.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={index === 0 ? "#10b981" : "#e2e8f0"}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed bg-slate-50 text-sm text-slate-400">
      Data grafik belum tersedia
    </div>
  );
}

export default DashboardCharts;

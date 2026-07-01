import { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import StatsSection from "../components/StatsSection/StatsSection";
import ActivitySection from "../components/ActivitySection/ActivitySection";
import DashboardCharts from "../components/DashboardCharts/DashboardCharts";
import api from "../utils/constant/http";

function Home({ user }) {
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState({
    hospitals: 0,
    users: 0,
    indicators: 0,
    totalAssessments: 0,
    assessedHospitals: 0,
    averageScore: 0,
    totalQuestions: 0,
    totalEvaluated: 0,
    totalIndicatorsEvaluated: 0,
    completionPercentage: 0,
    evaluationStatus: "-",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        if (isAdmin) {
          const res = await api.get("/hospitals/stats");

          if (res.data.success) {
            setStats({
              hospitals: res.data.data.totalHospitals || 0,
              users: res.data.data.totalUsers || 0,
              indicators: res.data.data.totalIndicators || 0,
              totalAssessments: res.data.data.totalAssessments || 0,
              assessedHospitals: res.data.data.assessedHospitals || 0,
              averageScore: res.data.data.averageScore || 0,
            });
          }
        } else {
          if (!user?.hospital_id) {
            setError("Akun ini belum terhubung dengan data rumah sakit.");
            return;
          }

          const res = await api.get(`/assessments/report/${user.hospital_id}`);

          if (res.data.success) {
            setStats({
              totalQuestions: res.data.data.total_questions || 0,
              totalEvaluated: res.data.data.total_evaluated || 0,
              totalIndicatorsEvaluated: res.data.data.total_indicators_evaluated || 0,
              averageScore: res.data.data.average_score || 0,
              completionPercentage: res.data.data.completion_percentage || 0,
              evaluationStatus: res.data.data.evaluation_status || "-",
            });
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err);
        setError("Gagal mengambil data dashboard dari database.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, user?.hospital_id]);

  return (
    <div>
      <DashboardHeader />

      {user && (
        <div className="mb-6 text-slate-500">
          Selamat datang kembali,{" "}
          <span className="font-semibold text-slate-700">{user.name}</span>!
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mb-8 rounded-2xl border bg-white p-6 text-slate-500">
          Mengambil data dashboard...
        </div>
      ) : (
        <>
          <StatsSection stats={stats} mode={isAdmin ? "admin" : "user"} />

          {!error && (
            <DashboardCharts
              mode={isAdmin ? "admin" : "user"}
              user={user}
            />
          )}
        </>
      )}

      {isAdmin && <ActivitySection />}
    </div>
  );
}

export default Home;

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
  });

  useEffect(() => {
    // Memanggil mock API statistik yang ada di file backend (api.js) Anda
    api.get("/hospitals/stats")
      .then((res) => {
        if (res.data.success) {
          // Menyesuaikan struktur response dari mock backend Anda
          setStats({
            hospitals: res.data.data.totalHospitals,
            users: res.data.data.totalUsers,
            indicators: res.data.data.totalIndicators,
          });
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data statistik:", err);
        // Fallback dummy data jika API gagal ditarik
        setStats({
          hospitals: 12,
          users: 45,
          indicators: 8,
        });
      });
  }, []);

  return (
    <div>
      <DashboardHeader />
      
      {/* Jika user memiliki informasi role, kita bisa tampilkan pesan selamat datang kecil */}
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

      {/* Sekarang stats tidak lagi undefined */}
      <StatsSection stats={stats} />
      <ActivitySection />
    </div>
  );
}

export default Home;

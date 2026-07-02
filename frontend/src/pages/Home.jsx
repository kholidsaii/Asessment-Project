import { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import StatsSection from "../components/StatsSection/StatsSection";
import ActivitySection from "../components/ActivitySection/ActivitySection";
import api from "../utils/constant/http";

function Home({ user }) {
  // State untuk menyimpan angka statistik
  const [stats, setStats] = useState({
    hospitals: 0,
    users: 0,
    indicators: 0,
  });
  
  // Tambah state loading agar UI nampak lebih lancar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk mengambil semua data serentak
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Memanggil ketiga-tiga endpoint sebenar secara serentak (parallel)
        const [hospitalsRes, usersRes, questionsRes] = await Promise.all([
          api.get("/hospitals"),
          api.get("/users"),
          api.get("/questions")
        ]);

        // Mengira jumlah (length) data sebenar dari pangkalan data
        setStats({
          hospitals: hospitalsRes.data.data?.length || 0,
          users: usersRes.data.data?.length || 0,
          indicators: questionsRes.data.data?.length || 0,
        });
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err);
        // Tetapkan ke 0 jika berlaku ralat, bukannya data palsu
        setStats({
          hospitals: 0,
          users: 0,
          indicators: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <DashboardHeader />
      
      {/* Mesej selamat datang untuk pengguna yang log masuk */}
      {user && (
        <div className="mb-6 text-slate-500">
          Selamat datang kembali, <span className="font-semibold text-slate-700">{user.name}</span>!
        </div>
      )}

      {/* Paparkan efek loading semasa data sedang diambil */}
      {loading ? (
        <div className="p-10 mb-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 animate-pulse">
          Memuatkan data statistik semasa...
        </div>
      ) : (
        <StatsSection stats={stats} />
      )}
      
      <ActivitySection />
    </div>
  );
}

export default Home;
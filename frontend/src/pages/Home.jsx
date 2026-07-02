import { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import StatsSection from "../components/StatsSection/StatsSection";
import ActivitySection from "../components/ActivitySection/ActivitySection";
import api from "../utils/constant/http";

function Home({ user }) {
  const [stats, setStats] = useState({
    hospitals: 0,
    users: 0,
    indicators: 0,
    totalPenilaian: 0,
    rataRataSkor: 0
  });
  
  const [error, setError] = useState(null);

 useEffect(() => {
    console.log("useEffect triggered, user:", user); // 1. Cek apakah user ada

    if (!user) {
      console.log("User belum ada, fetch dibatalkan.");
      return;
    }
    const fetchDashboardData = async () => {
      console.log("Fungsi terpanggil untuk mengambil data dashboard. User:", user);
      try {
        // 1. JIKA ADMIN: Ambil statistik global (semua RS)
        if (user.role === "admin" || user.role === "user") {
          const res = await api.get("/hospitals/stats");
          console.log("Response Admin Stats:", res.data);
          if (res.data.success) {
            const d = res.data.data; // Mempersingkat akses
            setStats({
              hospitals: d.totalHospitals || 0,
              users: d.totalUsers || 0,
              indicators: d.totalIndicators || 0,
              totalAssessments: d.totalAssessments || 0, // Dulu totalPenilaian
              assessedHospitals: d.assessedHospitals || 0, // Dulu RS Sudah Dinilai
              averageScore: d.averageScore || 0          // Dulu rataRataSkor
            });
          }
        
        } 
        // 2. JIKA USER (RUMAH SAKIT): Ambil data KHUSUS rumah sakitnya saja
        else if (user.hospital_id) {
          // Anda bisa memanggil endpoint report / dashboard spesifik RS
          const res = await api.get(`/assessments/report/${user.hospital_id}`);
          console.log("Response User Stats:", res.data);
          if (res.data.success) {
            const data = res.data.data;
            
            // Sesuaikan pemetaan field ini dengan struktur tabel/response dari backend Anda
            setStats({
              hospitals: 1, // Hanya RS miliknya sendiri
              users: 1,     // Akun miliknya sendiri
              indicators: data.total_indicators || 8, // Ganti jika ada field total indikator di respons
              totalPenilaian: data.total_score || 0,
              rataRataSkor: data.average_score || 0
            });
          }
        }
        
        // Bersihkan error jika berhasil
        setError(null);
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err);
        setError("Gagal mengambil data. Pastikan server berjalan dan koneksi aman."); 
        
        // Fallback data jika API gagal ditarik
        setStats({
          hospitals: 0,
          users: 0,
          indicators: 0,
          totalPenilaian: 0,
          rataRataSkor: 0
        });
      }
    };

    fetchDashboardData();
  }, [user]); // useEffect akan dijalankan ulang jika ada perubahan pada objek 'user'

  return (
    <div>
      <DashboardHeader />
      
      {/* Pesan selamat datang */}
      {user && (
        <div className="mb-6 text-slate-500">
          Selamat datang kembali,{" "}
          <span className="font-semibold text-slate-700">{user.name}</span>!
          {user.role === "user" && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Mode Rumah Sakit
            </span>
          )}
        </div>
      )}

      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Teruskan stats yang sudah dinamis ke StatsSection */}
      <StatsSection stats={stats} />
      
      {/* Jika ActivitySection membutuhkan ID user/hospital untuk difilter, Anda bisa melemparnya via props */}
      <ActivitySection user={user} />
    </div>
  );
}

export default Home;
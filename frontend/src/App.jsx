import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Activity, Users, ClipboardCheck, Clock, Loader2 } from 'lucide-react';
import api from './api/api'; // Pastikan file ini sudah ada di src/api/api.js

function App() {
  const [stats, setStats] = useState({
    hospitals: 0,
    users: 0,
    indicators: 0,
    loading: true
  });

  // Fungsi Fetching Data dari Backend Express
  const fetchDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Mengambil data dari endpoint yang sudah kamu buat di routes.js
      const [resHospitals, resUsers, resIndicators] = await Promise.all([
        api.get('/hospitals'),
        api.get('/users'),
        api.get('/indicators')
      ]);

      setStats({
        hospitals: resHospitals.data.length,
        users: resUsers.data.length,
        indicators: resIndicators.data.length,
        loading: false
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* Sidebar Statis di Kiri */}
      <Sidebar />
      
      {/* Area Konten Utama */}
      <main className="ml-64 flex-1 p-8 transition-all duration-300">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Kholid</h1>
            <p className="text-gray-500">Sistem Informasi Manajemen Rumah Sakit (SIMRS) Dev.</p>
          </div>
          {stats.loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm font-medium">Sinkronisasi data...</span>
            </div>
          )}
        </header>

        {/* Statistik Ringkas - Mengambil data asli dari Backend */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Users className="text-blue-600"/>} 
            label="Total Rumah Sakit" 
            value={stats.loading ? "..." : stats.hospitals} 
          />
          <StatCard 
            icon={<Clock className="text-yellow-600"/>} 
            label="Total Pengguna" 
            value={stats.loading ? "..." : stats.users} 
          />
          <StatCard 
            icon={<ClipboardCheck className="text-green-600"/>} 
            label="Indikator Medis" 
            value={stats.loading ? "..." : stats.indicators} 
          />
          <StatCard 
            icon={<Activity className="text-red-600"/>} 
            label="Kondisi Kritis" 
            value="2" // Statis sementara
          />
        </div>

        {/* Section Content - Tempat Tabel CRUD Utama */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Aktivitas & Data Terbaru</h3>
            <button 
              onClick={fetchDashboardData}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
            >
              Refresh Data
            </button>
          </div>
          
          {/* Placeholder untuk Tabel */}
          <div className="border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 mb-2">Belum ada aktivitas terbaru hari ini.</p>
            <p className="text-xs text-gray-300 italic text-center px-4">
              Silakan pilih menu di samping untuk mengelola data Hospital, User, atau Indicator.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-komponen StatCard yang sudah disempurnakan
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className="p-3 bg-gray-50 rounded-xl shrink-0">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-sm text-gray-500 truncate">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default App;
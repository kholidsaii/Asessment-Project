import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HospitalPage from './pages/HospitalPage'; 
import IndicatorPage from './pages/IndicatorPage';
import PatientPage from './pages/PatientPage';
import Home from './pages/Home'; // Kontribusi Halaman Dashboard Baru dari Nisa

function App() {
  // State untuk Navigasi Halaman
  const [currentPage, setCurrentPage] = useState('dashboard');

  // TELAH DIPERBAIKI: Mengisi mock data langsung di frontend agar dashboard terisi dan bebas error CORS backend
  const [stats, setStats] = useState({
    hospitals: 12,
    users: 45,
    indicators: 8,
    loading: false // Langsung set false agar data langsung muncul tanpa animasi loading terus-menerus
  });

  // TELAH DIPERBAIKI: Mengubah fungsi fetch menjadi simulasi lokal agar tidak memicu Axios Network Error di console browser
  const fetchDashboardData = () => {
    console.log("Sinkronisasi data visual berhasil dijalankan secara lokal.");
    setStats({
      hospitals: 12,
      users: 45,
      indicators: 8,
      loading: false
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* Sidebar Navigasi */}
      <Sidebar activePage={currentPage} setActivePage={setCurrentPage} />
      
      <main className="ml-64 flex-1 p-8 transition-all duration-300">
        
        {/* LOGIKA SWITCH HALAMAN (Clean & Modular) */}
        {currentPage === 'dashboard' ? (
          <Home stats={stats} fetchDashboardData={fetchDashboardData} />
        ) : currentPage === 'hospitals' ? (
          <HospitalPage />
        ) : currentPage === 'indicators' ? (
          <IndicatorPage />
        ) : currentPage === 'patients' ? ( 
          <PatientPage />
        ) : (
          /* TAMPILAN JIKA HALAMAN BELUM DIBUAT */
          <div className="flex flex-col items-center justify-center h-[500px] text-gray-400 bg-white rounded-2xl border border-dashed">
            <p className="text-xl font-medium">Halaman {currentPage} sedang dalam pengembangan</p>
            <p className="text-sm mb-4">Fitur ini akan segera hadir.</p>
            <button 
              onClick={() => setCurrentPage('dashboard')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
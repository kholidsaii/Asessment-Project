// src/App.jsx
import Sidebar from './components/Sidebar';
import { Activity, Users, ClipboardCheck, Clock } from 'lucide-react';

function App() {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      
      {/* Area Konten Utama */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Kholid</h1>
          <p className="text-gray-500">Berikut adalah ringkasan assessment hari ini.</p>
        </header>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Users className="text-blue-600"/>} label="Total Pasien" value="128" />
          <StatCard icon={<Clock className="text-yellow-600"/>} label="Antrean" value="12" />
          <StatCard icon={<ClipboardCheck className="text-green-600"/>} label="Assessment Selesai" value="45" />
          <StatCard icon={<Activity className="text-red-600"/>} label="Kondisi Kritis" value="2" />
        </div>

        {/* Section Content (Nanti diisi Tabel CRUD) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
          <p className="text-gray-400">Belum ada data assessment terbaru.</p>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default App;
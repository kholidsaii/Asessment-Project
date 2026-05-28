import { useState, useEffect } from "react";
import api from "../utils/constant/http";
import HospitalTable from "../components/HospitalTable/HospitalTable";

function HospitalPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchHospitals() {
    try {
      setLoading(true);
      setError(null); // Reset error setiap kali fetch ulang

      const res = await api.get("/hospitals");

      // Pastikan menyesuaikan dengan struktur response API Anda
      setHospitals(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      // Tangkap pesan error dan masukkan ke state agar UI Error muncul
      setError(err.response?.data?.message || err.message || "Gagal mengambil data dari server");
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHospitals();
  }, []);

  // 1. TAMPILAN LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-500">
        <p className="animate-pulse text-blue-600 font-medium">Loading data rumah sakit...</p>
      </div>
    );
  }

  // 2. TAMPILAN ERROR
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-5 mb-6">
        <p className="font-semibold text-lg mb-1">Terjadi Kesalahan</p>
        <p>{error}</p>
      </div>
    );
  }

  // 3. TAMPILAN SUKSES
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Data Rumah Sakit
        </h1>
        <p className="text-slate-500 mt-2">
          Daftar rumah sakit yang terintegrasi di dalam sistem manajemen
        </p>
      </div>

      {hospitals.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 border border-dashed">
          Tidak ada data rumah sakit yang ditemukan.
        </div>
      ) : (
        /* Menggunakan ulang komponen tabel agar rapi */
        <HospitalTable hospitals={hospitals} />
      )}
    </div>
  );
}

export default HospitalPage;
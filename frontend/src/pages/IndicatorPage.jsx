import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigasi
import http from "../utils/constant/http";
import IndicatorTable from "../components/IndicatorTable/IndicatorTable";

function IndicatorPage() {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIndicators();
  }, []);

  async function fetchIndicators() {
    try {
      setLoading(true);
      setError(null);
      const response = await http.get("/indicators");
      setIndicators(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // === FUNGSI DELETE SPRINT 12 ===
  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus indikator "${name}"?`)) {
      try {
        const response = await http.delete(`/indicators/${id}`);
        if (response.data.success || response.status === 200) {
          alert("Indikator berhasil dihapus");
          fetchIndicators(); // Memuat ulang data otomatis agar tabel terupdate
        }
      } catch (error) {
        console.error("Gagal menghapus indikator:", error);
        alert("Gagal menghapus data. Silakan coba lagi.");
      }
    }
  };

  if (loading) {
    return <p className="p-5 text-slate-500">Loading...</p>;
  }

  if (error) {
    return <p className="p-5 text-red-500">Error : {error}</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Bagian Atas Tabel */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">
          Data Indicator
        </h1>
        
        {/* === TOMBOL CREATE SPRINT 12 === */}
        <button
          onClick={() => navigate("/indicators/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm"
        >
          + Tambah Indikator
        </button>
      </div>

      {/* Kirim data dan fungsi ke komponen tabel */}
      <IndicatorTable indicators={indicators} onDelete={handleDelete} />
    </div>
  );
}

export default IndicatorPage;
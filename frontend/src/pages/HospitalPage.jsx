import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/constant/http";
import HospitalTable from "../components/HospitalTable/HospitalTable";

function HospitalPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function fetchHospitals() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/hospitals");
      setHospitals(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setError(err.response?.data?.message || err.message || "Gagal mengambil data dari server");
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHospitals();
  }, []);

  // --- FUNGSI UNTUK EDIT DATA ---
  const handleEdit = (id) => {
    // Arahkan ke rute form dengan menyertakan ID
    // Ini akan ditangkap oleh useParams() di HospitalFormPage
    navigate(`/hospitals/edit/${id}`);
  };

  // --- FUNGSI UNTUK HAPUS DATA ---
  const handleDelete = async (id) => {
    // Tampilkan dialog konfirmasi sebelum menghapus
    const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus data rumah sakit ini?");
    
    if (isConfirm) {
      try {
        await api.delete(`/hospitals/${id}`);
        // Jika berhasil dihapus, panggil ulang data terbaru dari server
        fetchHospitals(); 
      } catch (err) {
        console.error("Gagal menghapus data:", err);
        alert("Gagal menghapus data: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 animate-pulse">Loading data...</div>;

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Data Rumah Sakit</h1>
          <p className="text-slate-500 mt-2">Daftar rumah sakit yang terintegrasi</p>
        </div>
        <button
          onClick={() => navigate("/hospitals/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
        >
          + Tambah RS
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-5 mb-6">
          <p>{error}</p>
        </div>
      )}

      {hospitals.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 border border-dashed">
          Tidak ada data rumah sakit yang ditemukan.
        </div>
      ) : (
        /* Teruskan fungsi onEdit dan onDelete ke komponen tabel */
        <HospitalTable 
          hospitals={hospitals} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

export default HospitalPage;
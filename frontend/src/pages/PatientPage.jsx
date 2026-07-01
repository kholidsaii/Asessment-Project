import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan ini
import http from "../utils/constant/http";
import PatientTable from "../components/PatientTable/PatientTable";

function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      setLoading(true);
      setError(null);
      const response = await http.get("/users");
      setPatients(response.data.data || []);
    } catch (error) {
      setError(error.message || "Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  }

  // --- FUNGSI EDIT DATA ---
  const handleEdit = (id) => {
    navigate(`/patients/${id}/edit`);
  };

  // --- FUNGSI HAPUS DATA ---
  const handleDelete = async (id) => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus data pasien/user ini?");
    
    if (isConfirm) {
      try {
        await http.delete(`/users/${id}`);
        fetchPatients(); 
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        alert("Gagal menghapus data: " + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-slate-500 animate-pulse">Loading data pasien...</div>;
  }

  return (
    <div className="pb-20">
      {/* Header Halaman */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Data Patient</h1>
          <p className="text-slate-500 mt-2">Daftar pengguna dan pasien yang terdaftar</p>
        </div>
        <button
          onClick={() => navigate("/patients/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
        >
          + Tambah Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-5 mb-6">
          <p className="font-semibold text-lg mb-1">Terjadi Kesalahan</p>
          <p>{error}</p>
        </div>
      )}

      {/* Tabel Data */}
      {patients.length === 0 && !error ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 border border-dashed">
          Tidak ada data yang ditemukan.
        </div>
      ) : (
        <PatientTable 
          patients={patients} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

export default PatientPage;
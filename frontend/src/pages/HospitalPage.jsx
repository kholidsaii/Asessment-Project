import { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Edit, Hospital } from 'lucide-react';

const HospitalPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data dari Backend
  const fetchHospitals = async () => {
    try {
      const res = await api.get('/hospitals');
      setHospitals(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setHospitals([]);
      setLoading(false);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Hospital className="text-blue-600" /> Manajemen Rumah Sakit
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Tambah RS
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nama RS</th>
              <th className="p-4 font-semibold text-gray-600">Kode</th>
              <th className="p-4 font-semibold text-gray-600">Kelas</th>
              <th className="p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400">Loading data...</td></tr>
            ) : hospitals.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada data rumah sakit.</td></tr>
            ) : (
              hospitals.map((rs) => (
                <tr key={rs.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{rs.name}</td>
                  <td className="p-4 text-gray-600">{rs.code}</td>
                  <td className="p-4 text-gray-600">{rs.class}</td>
                  <td className="p-4 flex gap-2">
                    <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"><Edit size={18} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HospitalPage;
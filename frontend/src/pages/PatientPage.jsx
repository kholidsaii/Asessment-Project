import { useState, useEffect } from 'react';
import api from '../api/api';
import { Users, UserPlus, Search, Trash2, Edit, Mail } from 'lucide-react';

const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await api.get('/users'); // Mengambil data dari endpoint users
      // Jika di database kamu ada role, kita bisa filter:
      // const onlyPatients = res.data.data.filter(u => u.role === 'patient');
      setPatients(res.data.data || res.data);
    } catch (err) {
      console.error("Gagal load data pasien:", err);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  // Fungsi Pencarian Sederhana
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Daftar Pasien & Pengguna
          </h2>
          <p className="text-sm text-gray-500">Kelola data pasien dan hak akses pengguna sistem.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <UserPlus size={20} /> Tambah Pasien
        </button>
      </div>

      {/* Bar Pencarian */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Cari nama atau email..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="p-4 font-semibold text-sm">Nama Lengkap</th>
              <th className="p-4 font-semibold text-sm">Kontak / Email</th>
              <th className="p-4 font-semibold text-sm">Role</th>
              <th className="p-4 font-semibold text-sm text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr><td colSpan="4" className="p-12 text-center text-gray-400 italic">Data pasien tidak ditemukan.</td></tr>
            ) : (
              filteredPatients.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400">ID: #{p.id}</div>
                  </td>
                  <td className="p-4 text-gray-600 flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" /> {p.email}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                      p.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {p.role || 'Patient'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"><Edit size={18} /></button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
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

export default PatientPage;
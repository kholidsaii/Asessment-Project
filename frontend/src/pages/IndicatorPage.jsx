import { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Edit, ClipboardCheck, X, Save } from 'lucide-react';

const IndicatorPage = () => {
  const [indicators, setIndicators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchIndicators = async () => {
    try {
      const res = await api.get('/indicators');
      setIndicators(res.data.data || res.data); // Menyesuaikan struktur response backend
    } catch (err) {
      console.error("Gagal load indikator:", err);
    }
  };

  useEffect(() => { fetchIndicators(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/indicators', formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchIndicators();
    } catch (err) {
      alert("Gagal simpan indikator");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardCheck className="text-green-600" /> Indikator Penilaian Medis
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
        >
          <Plus size={20} /> Tambah Indikator
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="p-4 font-semibold">Nama Indikator</th>
              <th className="p-4 font-semibold">Deskripsi Standar</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {indicators.length === 0 ? (
              <tr><td colSpan="3" className="p-8 text-center text-gray-400">Data indikator masih kosong.</td></tr>
            ) : (
              indicators.map((ind) => (
                <tr key={ind.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{ind.name}</td>
                  <td className="p-4 text-gray-600">{ind.description}</td>
                  <td className="p-4 flex gap-2">
                    <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"><Edit size={18} /></button>
                    <button className="p-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">Tambah Indikator Baru</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Indikator</label>
                <input 
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: Ketersediaan Alat Radiologi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi/Kriteria</label>
                <textarea 
                  rows="3" value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="Jelaskan kriteria penilaian..."
                ></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex justify-center gap-2 hover:bg-green-700">
                <Save size={20} /> Simpan Indikator
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndicatorPage;
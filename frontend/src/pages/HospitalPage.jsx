import { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Edit, Hospital, X, Save } from 'lucide-react';

const HospitalPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk Form
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    class: '',
    address: ''
  });

 // Contoh di HospitalPage.jsx saat ambil data
const fetchHospitals = async () => {
  try {
    const res = await api.get('/hospitals');
    // Karena Backend kita kirim: res.json({ message: "...", data: rows })
    // Maka di frontend:
    setHospitals(res.data.data); 
  } catch (err) {
    console.error("Gagal ambil data RS");
  }
};

  useEffect(() => { fetchHospitals(); }, []);

  // Handler Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler Simpan Data (Create)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/hospitals', formData);
      setIsModalOpen(false); // Tutup modal
      setFormData({ name: '', code: '', class: '', address: '' }); // Reset form
      fetchHospitals(); // Refresh tabel
      alert("Data berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data. Periksa konsol.");
    }
  };

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Hospital className="text-blue-600" /> Manajemen Rumah Sakit
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Tambah RS
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="p-4 font-semibold">Nama RS</th>
              <th className="p-4 font-semibold">Kode</th>
              <th className="p-4 font-semibold">Kelas</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400 italic">Menghubungkan ke database...</td></tr>
            ) : hospitals.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400 italic">Belum ada data rumah sakit.</td></tr>
            ) : (
              hospitals.map((rs) => (
                <tr key={rs.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{rs.name}</td>
                  <td className="p-4 text-gray-600">{rs.code}</td>
                  <td className="p-4 text-gray-600">{rs.class}</td>
                  <td className="p-4 flex gap-2">
                    <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"><Edit size={18} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Tambah Rumah Sakit</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Rumah Sakit</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: RS PPN Suyoto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode RS</label>
                  <input 
                    type="text" name="code" required value={formData.code} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="RS001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                  <select 
                    name="class" value={formData.class} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Pilih</option>
                    <option value="A">Kelas A</option>
                    <option value="B">Kelas B</option>
                    <option value="C">Kelas C</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea 
                  name="address" rows="3" value={formData.address} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Alamat lengkap..."
                ></textarea>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                >
                  <Save size={18} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalPage;
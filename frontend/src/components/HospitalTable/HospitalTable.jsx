import { Edit, Trash2 } from "lucide-react"; 

function HospitalTable({ hospitals, onEdit, onDelete }) { // 1. Terima props onEdit dan onDelete
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left font-semibold text-slate-700">Nama RS</th>
            <th className="p-4 text-left font-semibold text-slate-700">Kode</th>
            <th className="p-4 text-left font-semibold text-slate-700">Kelas</th>
            {/* 2. Tambahkan Header untuk Aksi */}
            <th className="p-4 text-center font-semibold text-slate-700">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {hospitals.map((rs) => (
            <tr key={rs.id} className="border-t hover:bg-slate-50 transition-colors">
              <td className="p-4 text-slate-800 font-medium">{rs.name}</td>
              <td className="p-4 text-slate-600">{rs.code}</td>
              <td className="p-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-semibold">
                  Kelas {rs.class}
                </span>
              </td>
              
              {/* 3. Tambahkan Kolom Tombol Edit dan Hapus */}
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(rs.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(rs.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HospitalTable;
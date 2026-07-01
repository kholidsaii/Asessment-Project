import { Edit, Trash2 } from "lucide-react"; 

function PatientTable({ patients, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 font-semibold text-slate-700">Nama</th>
            <th className="p-4 font-semibold text-slate-700">Email</th>
            <th className="p-4 font-semibold text-slate-700">Role</th>
            <th className="p-4 font-semibold text-slate-700 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-800">{item.name}</td>
              <td className="p-4 text-slate-600">{item.email}</td>
              <td className="p-4">
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}
                >
                  {item.role || 'User'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
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

export default PatientTable;
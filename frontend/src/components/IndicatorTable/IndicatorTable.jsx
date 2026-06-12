import { useNavigate } from "react-router-dom";

function IndicatorTable({ indicators, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Nama</th>
            <th className="p-4 text-left">Deskripsi</th>
            {/* Kolom Aksi Baru untuk menampung tombol Edit & Hapus */}
            <th className="p-4 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {indicators.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-slate-400">
                Belum ada data indikator mutu.
              </td>
            </tr>
          ) : (
            indicators.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">{item.name}</td>
                <td className="p-4 text-slate-600">{item.description}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-4">
                    {/* BUTTON UPDATE */}
                    <button
                      onClick={() => navigate(`/indicators/edit/${item.id}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold"
                    >
                      Edit
                    </button>

                    {/* BUTTON DELETE */}
                    <button
                      onClick={() => onDelete(item.id, item.name)}
                      className="text-red-600 hover:text-red-800 hover:underline text-sm font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IndicatorTable;
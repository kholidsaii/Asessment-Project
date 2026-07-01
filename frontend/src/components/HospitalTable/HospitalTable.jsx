function HospitalTable({ hospitals = [], onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">No</th>
              <th className="px-5 py-4">Nama RS</th>
              <th className="px-5 py-4">Kode</th>
              <th className="px-5 py-4">Kelas</th>
              <th className="px-5 py-4">Alamat</th>
              <th className="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {hospitals.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-slate-400">
                  Belum ada data rumah sakit.
                </td>
              </tr>
            ) : (
              hospitals.map((rs, index) => (
                <tr key={rs.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-500">{index + 1}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{rs.name}</td>
                  <td className="px-5 py-4 text-slate-600">{rs.code}</td>
                  <td className="px-5 py-4 text-slate-600">{rs.class}</td>
                  <td className="px-5 py-4 text-slate-600">{rs.address || "-"}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(rs)}
                        className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(rs.id, rs.name)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
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
    </div>
  );
}

export default HospitalTable;

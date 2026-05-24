function HospitalTable({ hospitals }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Nama RS</th>
            <th className="p-4 text-left">Kode</th>
            <th className="p-4 text-left">Kelas</th>
          </tr>
        </thead>

        <tbody>
          {hospitals.map((rs) => (
            <tr key={rs.id} className="border-t">
              <td className="p-4">{rs.name}</td>
              <td className="p-4">{rs.code}</td>
              <td className="p-4">{rs.class}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default HospitalTable;
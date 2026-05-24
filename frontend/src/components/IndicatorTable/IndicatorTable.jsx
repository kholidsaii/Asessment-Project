function IndicatorTable({ indicators }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Nama</th>
            <th className="p-4 text-left">Deskripsi</th>
          </tr>
        </thead>

        <tbody>
          {indicators.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4">{item.name}</td>
              <td className="p-4">{item.description}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default IndicatorTable;
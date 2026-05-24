function PatientTable({ patients }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Nama</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Role</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4">{item.name}</td>
              <td className="p-4">{item.email}</td>
              <td className="p-4">{item.role}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default PatientTable;
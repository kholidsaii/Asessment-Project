import { useState, useEffect } from "react";
import api from "../utils/constant/http";

function HospitalPage() {
  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  async function fetchHospitals() {
    try {
      setLoading(true);

      const res = await api.get("/hospitals");

      setHospitals(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHospitals();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="p-8">
        <p className="text-blue-600">Loading data rumah sakit...</p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">
        Data Rumah Sakit
      </h2>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4 text-left">Kode</th>
              <th className="p-4 text-left">Kelas</th>
            </tr>
          </thead>

          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td className="p-4">
                  {hospital.name}
                </td>

                <td className="p-4">
                  {hospital.code}
                </td>

                <td className="p-4">
                  {hospital.class}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HospitalPage;



// import { useEffect, useState } from "react";
// import api from "../utils/constant/http";
// import HospitalTable from "../components/HospitalTable/HospitalTable";

// function HospitalPage() {
//   const [hospitals, setHospitals] = useState([]);

//   async function fetchHospitals() {
//     const res = await api.get("/hospitals");
//     setHospitals(res.data.data);
//   }

//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-5">
//         Data Rumah Sakit
//       </h1>

//       <HospitalTable hospitals={hospitals} />
//     </div>
//   );
// }

// export default HospitalPage;
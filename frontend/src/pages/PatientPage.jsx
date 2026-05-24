import { useEffect, useState } from "react";
import api from "../api/api";
import PatientTable from "../components/PatientTable/PatientTable";

function PatientPage() {
  const [patients, setPatients] = useState([]);

  async function fetchPatients() {
    const res = await api.get("/users");
    setPatients(res.data.data);
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">
        Data Pasien
      </h1>

      <PatientTable patients={patients} />
    </div>
  );
}

export default PatientPage;
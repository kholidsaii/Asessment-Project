import { useEffect, useState } from "react";

import http from "../utils/constant/http";

import PatientTable from "../components/PatientTable/PatientTable";

function PatientPage() {

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {

      setLoading(true);
      setError(null);

      const response = await http.get("/users");

      setPatients(response.data.data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error : {error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">
        Data Patient
      </h1>

      <PatientTable patients={patients} />
    </div>
  );
}

export default PatientPage;
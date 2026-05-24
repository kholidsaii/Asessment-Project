import { useEffect, useState } from "react";
import api from "../api/api";
import HospitalTable from "../components/HospitalTable/HospitalTable";

function HospitalPage() {
  const [hospitals, setHospitals] = useState([]);

  async function fetchHospitals() {
    const res = await api.get("/hospitals");
    setHospitals(res.data.data);
  }

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">
        Data Rumah Sakit
      </h1>

      <HospitalTable hospitals={hospitals} />
    </div>
  );
}

export default HospitalPage;
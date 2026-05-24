import { useEffect, useState } from "react";
import api from "../api/api";
import IndicatorTable from "../components/IndicatorTable/IndicatorTable";

function IndicatorPage() {
  const [indicators, setIndicators] = useState([]);

  async function fetchIndicators() {
    const res = await api.get("/indicators");
    setIndicators(res.data.data);
  }

  useEffect(() => {
    fetchIndicators();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">
        Data Indikator
      </h1>

      <IndicatorTable indicators={indicators} />
    </div>
  );
}

export default IndicatorPage;
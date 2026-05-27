import { useEffect, useState } from "react";

import http from "../utils/constant/http";

import IndicatorTable from "../components/IndicatorTable/IndicatorTable";

function IndicatorPage() {

  const [indicators, setIndicators] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIndicators();
  }, []);

  async function fetchIndicators() {
    try {

      setLoading(true);
      setError(null);

      const response = await http.get("/indicators");

      setIndicators(response.data.data);

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
        Data Indicator
      </h1>

      <IndicatorTable indicators={indicators} />
    </div>
  );
}

export default IndicatorPage;
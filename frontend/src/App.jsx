import { useState } from "react";

import Sidebar from "./components/Sidebar/Sidebar";

import Home from "./pages/Home";
import HospitalPage from "./pages/HospitalPage";
import IndicatorPage from "./pages/IndicatorPage";
import PatientPage from "./pages/PatientPage";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const stats = {
    hospitals: 12,
    users: 45,
    indicators: 8,
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <Sidebar
        activePage={currentPage}
        setActivePage={setCurrentPage}
      />

      <main className="ml-64 flex-1 p-8">

        {currentPage === "dashboard" && (
          <Home stats={stats} />
        )}

        {currentPage === "hospitals" && (
          <HospitalPage />
        )}

        {currentPage === "indicators" && (
          <IndicatorPage />
        )}

        {currentPage === "patients" && (
          <PatientPage />
        )}

      </main>

    </div>
  );
}

export default App;
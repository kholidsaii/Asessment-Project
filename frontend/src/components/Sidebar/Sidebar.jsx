import {
  LayoutDashboard,
  Hospital,
  ClipboardCheck,
  Users,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="w-64 h-screen bg-white border-r fixed p-5">
      
      <h1 className="text-2xl font-bold text-blue-600 mb-10">
        SIMRS Dev
      </h1>

      <div className="flex flex-col gap-3">

        <button
          onClick={() => setActivePage("dashboard")}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${
            activePage === "dashboard"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button
          onClick={() => setActivePage("hospitals")}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${
            activePage === "hospitals"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          <Hospital size={20} />
          Rumah Sakit
        </button>

        <button
          onClick={() => setActivePage("indicators")}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${
            activePage === "indicators"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          <ClipboardCheck size={20} />
          Indikator
        </button>

        <button
          onClick={() => setActivePage("patients")}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${
            activePage === "patients"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          <Users size={20} />
          Pasien
        </button>

      </div>
    </div>
  );
}

export default Sidebar;
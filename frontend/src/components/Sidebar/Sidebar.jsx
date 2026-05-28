import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Hospital,
  ClipboardCheck,
  Users,
  FileBarChart2,
  LogOut
} from "lucide-react";

function Sidebar({ user, onLogout }) {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-xl transition ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
        : "hover:bg-blue-50 text-slate-600"
    }`;

  const isAdmin = user?.role === "admin";

  return (
    <div className="w-64 h-screen bg-white border-r fixed p-5 flex flex-col justify-between">
      <div>
        <div className="mb-10 px-3">
          <h1 className="text-2xl font-bold text-blue-600">SIMRS Dev</h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin ? "Pusat Kendali Admin" : "Portal Rumah Sakit"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {/* Menu Dashboard berlaku untuk semua user */}
          <NavLink to="/" className={navLinkClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          {/* RENDERING MENU BERDASARKAN ROLE */}
          {isAdmin ? (
            <>
              {/* Menu Khusus Admin */}
              <NavLink to="/hospitals" className={navLinkClass}>
                <Hospital size={20} />
                Rumah Sakit
              </NavLink>
              <NavLink to="/indicators" className={navLinkClass}>
                <ClipboardCheck size={20} />
                Indikator
              </NavLink>
              <NavLink to="/patients" className={navLinkClass}>
                <Users size={20} />
                Pasien / User
              </NavLink>
            </>
          ) : (
            <>
              {/* Menu Khusus Perawat / Staf Rumah Sakit */}
              <NavLink to="/assessment" className={navLinkClass}>
                <ClipboardCheck size={20} />
                Input Assessment
              </NavLink>
              <NavLink to="/report" className={navLinkClass}>
                <FileBarChart2 size={20} />
                Laporan Rekap
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Bagian Bawah: Informasi Profil Akun & Tombol Keluar */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center font-bold text-blue-600 border border-blue-100 uppercase text-sm">
            {user?.name?.substring(0, 2) || "US"}
          </div>
          <div className="truncate max-w-[140px]">
            <h4 className="text-sm font-semibold text-slate-700 truncate">{user?.name}</h4>
            <p className="text-xs text-slate-400 capitalize truncate">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition text-sm font-medium"
        >
          <LogOut size={18} />
          Keluar Sistem
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
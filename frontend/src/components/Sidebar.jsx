// src/components/Sidebar.jsx
import { LayoutDashboard, ClipboardPlus, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-4 fixed">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ClipboardPlus className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-gray-800">SIMRS Dev</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
        <NavItem icon={<ClipboardPlus size={20} />} label="Assessment Baru" />
        <NavItem icon={<Users size={20} />} label="Daftar Pasien" />
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <NavItem icon={<Settings size={20} />} label="Settings" />
        <NavItem icon={<LogOut size={20} />} label="Keluar" />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
    active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

export default Sidebar;
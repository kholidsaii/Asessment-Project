import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home";
import HospitalPage from "./pages/HospitalPage";
import IndicatorPage from "./pages/IndicatorPage";
import PatientPage from "./pages/PatientPage";
import AssessmentPage from "./pages/AssessmentPage";
import ReportPage from "./pages/ReportPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Memvalidasi Sesi...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* RUTE DI LUAR DASHBOARD (Sesi Publik) */}
        {!user ? (
          <>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Jika belum login ketik url aneh-aneh langsung ditendang ke /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          /* RUTE DI DALAM DASHBOARD (Sesi Terproteksi setelah Login) */
          <Route
            path="/*"
            element={
              <div className="flex bg-slate-50 min-h-screen">
                <Sidebar user={user} onLogout={handleLogout} />

                <main className="ml-64 flex-1 p-8">
                  <Routes>
                    {/* Halaman Utama untuk Semua User */}
                    <Route path="/" element={<Home user={user} />} />

                    {/* Pembatasan Rute Internal Berdasarkan Role */}
                    {user.role === "admin" ? (
                      <>
                        <Route path="/hospitals" element={<HospitalPage />} />
                        <Route path="/indicators" element={<IndicatorPage />} />
                        <Route path="/patients" element={<PatientPage />} />
                      </>
                    ) : (
                      <>
                        <Route path="/assessment" element={<AssessmentPage user={user} />} />
                        <Route path="/report" element={<ReportPage user={user} />} />
                      </>
                    )}

                    {/* Jika salah ketik path di dalam dashboard dikembalikan ke Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
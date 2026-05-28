import { useState } from "react";
import api from "../utils/constant/http";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi basic frontend
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Sesuai dengan route AuthController.js di backend Anda
      const res = await api.post("/login", { email, password });

      if (res.data.success) {
        const { token, data } = res.data;
        
        // Simpan token dan data user ke localStorage agar sesi menetap saat reload
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));

        // Panggil callback untuk mengangkat status login ke App.jsx
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      // Menangkap response error terstruktur dari backend errorHandler
      setError(
        err.response?.data?.message || 
        "Gagal masuk. Silakan periksa kembali email dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* Branding App */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight">SIMRS Dev</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Sistem Informasi Manajemen Rumah Sakit & Assessment Mutu
          </p>
        </div>

        {/* Alert Error Box */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Form Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Sistem
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="nama@rumahsakit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-100 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memvalidasi...</span>
              </>
            ) : (
              <span>Masuk Portal</span>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-xs text-slate-400">
            Hak Cipta &copy; {new Date().getFullYear()} SIMRS Assessment. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
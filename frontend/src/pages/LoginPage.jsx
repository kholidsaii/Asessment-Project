import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/constant/http";
import { 
  Lock, 
  Mail, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Hospital,
  ShieldCheck
} from "lucide-react";

/**
 * Komponen LoginPage
 * Menangani proses otentikasi user (Admin maupun Perawat/Staf)
 * * @param {Object} props
 * @param {Function} props.onLoginSuccess - Callback ketika login berhasil untuk update state global di App.jsx
 */
function LoginPage({ onLoginSuccess }) {
  // Navigation hook
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI Interaction States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Efek berjalan sekali saat komponen dimuat:
  // Mengecek apakah sebelumnya user mencentang "Remember Me"
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /**
   * Menangani aksi submit form login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validasi basic frontend agar tidak buang-buang request ke server
    if (!email || !password) {
      setError("Mohon lengkapi email dan password Anda.");
      return;
    }

    // Validasi format email sederhana menggunakan Regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 2. Menembak API Login di backend (Sesuai rute AuthController.js)
      const res = await api.post("/login", { email, password });

      // 3. Jika response sukses dari server
      if (res.data.success) {
        const { token, data } = res.data;
        
        // Simpan token dan data profil user ke localStorage agar sesi menetap saat reload
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));

        // Logika Remember Me: Simpan atau hapus email berdasarkan checkbox
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Panggil callback untuk mengangkat status login ke parent (App.jsx)
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
        
        // Arahkan user ke halaman utama setelah berhasil
        navigate("/");
      }
    } catch (err) {
      console.error("Login error detail:", err);
      
      // 4. Menangkap response error terstruktur dari backend (errorHandler)
      // Jika server mati atau tidak merespons, berikan pesan fallback
      const errorMessage = err.response?.data?.message 
        || err.message 
        || "Gagal terhubung ke server. Silakan coba beberapa saat lagi.";
        
      setError(errorMessage);
    } finally {
      // Hentikan efek loading baik saat sukses maupun gagal
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk toggle visibilitas password
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Wrapper Utama: Menggunakan layar penuh dengan layout grid untuk layar besar
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* =========================================
          KOLOM KIRI: FORM LOGIN UTAMA
          ========================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 transition-all">
          
          {/* Header Branding Khusus Mobile (Disembunyikan di Desktop) */}
          <div className="flex items-center gap-2 text-blue-600 mb-8 lg:hidden justify-center">
            <Hospital size={32} />
            <span className="text-2xl font-bold tracking-tight">SIMRS Dev</span>
          </div>

          {/* Teks Sambutan */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Masuk ke portal Sistem Informasi Manajemen Rumah Sakit untuk mengelola dan memantau penilaian mutu.
            </p>
          </div>

          {/* Alert Error Box (Muncul jika ada error) */}
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-2xl p-4 mb-8 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-bold">Otentikasi Gagal</span>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="nama@rumahsakit.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 bg-slate-50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-medium"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 border border-slate-200 bg-slate-50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-medium"
                  disabled={loading}
                  autoComplete="current-password"
                />
                {/* Tombol Toggle Mata (Show/Hide) */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Opsi Tambahan (Remember Me & Forgot Password) */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  disabled={loading}
                />
                <span className="text-slate-600 font-medium group-hover:text-slate-800 transition-colors">
                  Ingat saya
                </span>
              </label>

              <button 
                type="button" 
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all"
              >
                Lupa password?
              </button>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memvalidasi Akses...</span>
                </>
              ) : (
                <span>Masuk Portal Area</span>
              )}
            </button>
          </form>

          {/* Link Registrasi Baru */}
          <div className="text-center mt-8 pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              Belum memiliki akun staf?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline ml-1 transition-all">
                Daftar di sini
              </Link>
            </p>
          </div>
          
          {/* Footer Copyright Text */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-400">
              Hak Cipta &copy; {new Date().getFullYear()} SIMRS Dev Assessment.
            </p>
          </div>

        </div>
      </div>

      {/* =========================================
          KOLOM KANAN: DEKORASI (Hanya terlihat di layar LG ke atas)
          ========================================= */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12">
        {/* Ornamen Latar Belakang Lingkaran Abstrak */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        {/* Konten Atas Kanan: Logo / Branding App */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <Hospital size={24} className="text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">SIMRS Dev</span>
        </div>

        {/* Konten Tengah Kanan: Value Proposition */}
        <div className="relative z-10 text-white max-w-lg">
          <div className="w-16 h-1 bg-blue-400 mb-8 rounded-full"></div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Tingkatkan Mutu Layanan Rumah Sakit Anda
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Platform terpadu untuk melakukan *assessment*, mengevaluasi indikator kinerja medis, dan memantau kepatuhan standar pelayanan kesehatan secara real-time.
          </p>
          
          <div className="flex items-center gap-4 text-blue-100 bg-white/10 p-4 rounded-2xl backdrop-blur-sm w-fit border border-white/10">
            <ShieldCheck size={28} className="text-blue-300" />
            <span className="font-medium">Data dienkripsi dan diamankan dengan standar tinggi.</span>
          </div>
        </div>

        {/* Konten Bawah Kanan: Info Modul */}
        <div className="relative z-10 grid grid-cols-2 gap-6 mt-12 border-t border-blue-500/30 pt-8">
          <div>
            <h4 className="text-white font-bold text-xl mb-1">Cepat & Akurat</h4>
            <p className="text-blue-200 text-sm">Input data observasi instrumen per bangsal dengan efisien.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xl mb-1">Analitik Mutu</h4>
            <p className="text-blue-200 text-sm">Sajikan laporan pencapaian mutu dengan grafik otomatis.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default LoginPage;
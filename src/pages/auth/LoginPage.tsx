import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuthStore } from "../../stores/authStore";
import { config } from "../../lib/config";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("username", email);
      form.append("password", password);
      const res = await api.post("/auth/login", form);
      const { access_token, name, role } = res.data;
      setAuth({ id: 0, name, email, role }, access_token);
      navigate("/");
    } catch {
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F9F4" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{ backgroundColor: config.primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ backgroundColor: config.accentColor }}
          >
            🌿
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {config.clinicName}
            </div>
            <div
              className="uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}
            >
              {config.clinicTagline}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-white leading-snug mb-4">
            Kelola klinik
            <br />
            lebih mudah &<br />
            terorganisir
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Sistem rekam medis elektronik untuk klinik kesehatan. Catat, pantau,
            dan kelola semua kunjungan pasien dalam satu platform.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {["Rekam Medis", "Jadwal", "Kasir", "Laporan"].map((f) => (
            <div
              key={f}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl"
              style={{ backgroundColor: config.accentColor }}
            >
              🌿
            </div>
            <h1
              className="text-lg font-semibold"
              style={{ color: config.primaryColor }}
            >
              {config.clinicName}
            </h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Selamat datang
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Masuk ke akun Anda untuk melanjutkan
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@klinik.com"
                className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-xl bg-white outline-none transition-all"
                style={{ outlineColor: config.primaryColor }}
                onFocus={(e) =>
                  (e.target.style.borderColor = config.primaryColor)
                }
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-xl bg-white outline-none transition-all"
                onFocus={(e) =>
                  (e.target.style.borderColor = config.primaryColor)
                }
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3.5 py-2.5 rounded-xl border border-red-100">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90 mt-2"
              style={{
                backgroundColor: loading ? "#9CA3AF" : config.primaryColor,
              }}
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-8">
            {config.clinicName} © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

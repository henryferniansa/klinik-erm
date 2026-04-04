import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { config } from "../lib/config";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/appointments", icon: Calendar, label: "Jadwal" },
  { to: "/patients", icon: Users, label: "Data Pasien" },
  { to: "/medical-records", icon: FileText, label: "Rekam Medis" },
  { to: "/invoices", icon: CreditCard, label: "Kasir" },
  { to: "/settings", icon: Settings, label: "Pengaturan" },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F9F4" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col fixed top-0 left-0 bottom-0 z-50 transition-all duration-200"
        style={{
          width: collapsed ? 64 : 220,
          backgroundColor: config.primaryColor,
        }}
      >
        {/* Logo + Toggle */}
        <div
          className="flex items-center px-3 py-4 border-b border-white/10"
          style={{ minHeight: 64 }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
            style={{ backgroundColor: config.accentColor }}
          >
            🌿
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 ml-3">
              <div className="text-sm font-semibold text-white leading-tight truncate">
                {config.clinicName}
              </div>
              <div
                className="uppercase mt-0.5 tracking-widest truncate"
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px" }}
              >
                {config.clinicTagline}
              </div>
            </div>
          )}
          {/* Toggle button - always visible */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 ml-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
            title={collapsed ? "Perluas sidebar" : "Perkecil sidebar"}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive ? "font-medium" : "font-normal hover:bg-white/5"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? config.accentColor : "rgba(255,255,255,0.6)",
                backgroundColor: isActive
                  ? `${config.accentColor}22`
                  : undefined,
              })}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-2 py-3 border-t border-white/10">
          {collapsed ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: config.accentColor,
                  color: "#2D4A1E",
                }}
                title={user?.name}
              >
                {user?.name?.[0] ?? "A"}
              </div>
              <button
                onClick={handleLogout}
                className="text-white/40 hover:text-white/70 transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: config.accentColor,
                  color: "#2D4A1E",
                }}
              >
                {user?.name?.[0] ?? "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">
                  {user?.name}
                </div>
                <div
                  className="capitalize truncate"
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
                >
                  {user?.role}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.35)" }}
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main
        className="flex-1 min-w-0 transition-all duration-200"
        style={{ marginLeft: collapsed ? 64 : 220 }}
      >
        <Outlet />
      </main>
    </div>
  );
}

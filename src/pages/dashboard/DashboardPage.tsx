import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  CreditCard,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import type { Appointment, Invoice } from "../../types";

interface Stats {
  totalPatients: number;
  todayAppointments: number;
  todayIncome: number;
  activeServices: number;
}

const statusLabel: Record<string, string> = {
  scheduled: "Menunggu",
  in_progress: "Proses",
  done: "Selesai",
  cancelled: "Batal",
};

const statusColor: Record<string, string> = {
  scheduled: "bg-purple-50 text-purple-700",
  in_progress: "bg-amber-50 text-amber-700",
  done: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    todayAppointments: 0,
    todayIncome: 0,
    activeServices: 0,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes, servicesRes, invoicesRes] =
          await Promise.all([
            api.get("/patients/"),
            api.get("/appointments/today"),
            api.get("/services/"),
            api.get("/invoices/?status=paid"),
          ]);

        const todayIncome = invoicesRes.data
          .filter((inv: Invoice) => {
            const d = new Date(inv.paid_at ?? "");
            const today = new Date();
            return d.toDateString() === today.toDateString();
          })
          .reduce((sum: number, inv: Invoice) => sum + inv.total_amount, 0);

        setStats({
          totalPatients: patientsRes.data.length,
          todayAppointments: appointmentsRes.data.length,
          todayIncome,
          activeServices: servicesRes.data.length,
        });
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Pasien",
      value: stats.totalPatients,
      icon: Users,
      color: "#6B2D4E",
      bg: "#F4E6EE",
      link: "/patients",
    },
    {
      label: "Kunjungan Hari Ini",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "#2D7A4F",
      bg: "#E8F5E0",
      link: "/appointments",
    },
    {
      label: "Pendapatan Hari Ini",
      value: `Rp ${stats.todayIncome.toLocaleString("id-ID")}`,
      icon: CreditCard,
      color: "#C2610C",
      bg: "#FEF3E2",
      link: "/invoices",
    },
    {
      label: "Layanan Aktif",
      value: stats.activeServices,
      icon: Activity,
      color: "#6D28D9",
      bg: "#EDE9FE",
      link: "/settings",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#6B2D4E" }}>
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => navigate("/appointments")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2D7A4F" }}
        >
          + Kunjungan Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, bg, link }) => (
          <button
            key={label}
            onClick={() => navigate(link)}
            className="bg-white rounded-xl p-4 border border-gray-100 text-left hover:border-gray-200 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <ArrowRight
                size={14}
                className="text-gray-300 group-hover:text-gray-400 transition-colors mt-1"
              />
            </div>
            <div className="text-2xl font-semibold text-gray-800">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </button>
        ))}
      </div>

      {/* Tabel Kunjungan */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "#6B2D4E" }}>
            Kunjungan Hari Ini
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {appointments.length} kunjungan
            </span>
            <button
              onClick={() => navigate("/appointments")}
              className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: "#2D7A4F" }}
            >
              Lihat semua <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "#F4E6EE" }}
            >
              <Calendar size={20} style={{ color: "#6B2D4E" }} />
            </div>
            <p className="text-sm font-medium text-gray-600">
              Belum ada kunjungan hari ini
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Kunjungan yang dijadwalkan hari ini akan muncul di sini
            </p>
            <button
              onClick={() => navigate("/appointments")}
              className="mt-4 px-4 py-2 text-xs font-medium text-white rounded-lg"
              style={{ backgroundColor: "#6B2D4E" }}
            >
              + Buat Kunjungan
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-5 py-3 text-left font-medium">Pasien</th>
                <th className="px-5 py-3 text-left font-medium">Layanan</th>
                <th className="px-5 py-3 text-left font-medium">Terapis</th>
                <th className="px-5 py-3 text-left font-medium">Jam</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="border-t border-gray-50 hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: "#F4E6EE", color: "#6B2D4E" }}
                      >
                        {apt.patient?.full_name?.[0] ?? "?"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {apt.patient?.full_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {apt.patient?.patient_code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {apt.service?.name ?? "-"}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {apt.therapist?.name ?? "-"}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600 font-medium">
                    {new Date(apt.scheduled_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[apt.status]}`}
                    >
                      {statusLabel[apt.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

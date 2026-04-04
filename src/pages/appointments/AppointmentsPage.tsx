import { useEffect, useState, useCallback } from "react";
import { Plus, Calendar } from "lucide-react";
import api from "../../lib/api";
import type { Appointment } from "../../types";
import AppointmentFormModal from "./AppointmentFormModal";
import PageHeader from "../../components/PageHeader";

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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const url = dateFilter
        ? `/appointments/?date_filter=${dateFilter}`
        : "/appointments/";
      const res = await api.get(url);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status?status=${status}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <PageHeader
        title="Jadwal Kunjungan"
        subtitle={`${appointments.length} kunjungan`}
        actions={[
          {
            label: "Buat Kunjungan",
            onClick: () => setShowModal(true),
            icon: <Plus size={15} />,
          },
        ]}
      />

      <div className="p-6">
        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Calendar
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-[#6B2D4E] transition-all"
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Hapus filter
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#E8F5E0" }}
              >
                <Calendar size={20} style={{ color: "#2D7A4F" }} />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Tidak ada kunjungan
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {dateFilter
                  ? "Tidak ada kunjungan pada tanggal ini"
                  : "Belum ada kunjungan yang dibuat"}
              </p>
              <button
                onClick={() => setShowModal(true)}
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
                  <th className="px-5 py-3 text-left font-medium">Jadwal</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">
                    Ubah Status
                  </th>
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
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: "#F4E6EE",
                            color: "#6B2D4E",
                          }}
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
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-gray-800">
                        {new Date(apt.scheduled_at).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(apt.scheduled_at).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "short" },
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[apt.status]}`}
                      >
                        {statusLabel[apt.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={apt.status}
                        onChange={(e) =>
                          handleStatusChange(apt.id, e.target.value)
                        }
                        className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-600 outline-none bg-white focus:border-[#6B2D4E] transition-all"
                      >
                        <option value="scheduled">Menunggu</option>
                        <option value="in_progress">Proses</option>
                        <option value="done">Selesai</option>
                        <option value="cancelled">Batal</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <AppointmentFormModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Appointment } from "../../types";
import { getApi } from "../../lib/api";
const api = getApi();

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function InvoiceFormModal({ onClose, onSaved }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    appointment_id: "",
    patient_id: "",
    total_amount: "",
    payment_method: "tunai",
    notes: "",
  });

  useEffect(() => {
    api.get("/appointments/").then((res) => {
      setAppointments(res.data.filter((a: Appointment) => a.status === "done"));
    });
  }, []);

  const handleAppointmentChange = (aptId: string) => {
    const apt = appointments.find((a) => a.id === parseInt(aptId));
    if (apt) {
      setForm((f) => ({
        ...f,
        appointment_id: aptId,
        patient_id: String(apt.patient_id),
        total_amount: String(apt.service?.price ?? ""),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!form.appointment_id || !form.total_amount) {
      setError("Appointment dan total harga wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/invoices/", {
        appointment_id: parseInt(form.appointment_id),
        patient_id: parseInt(form.patient_id),
        total_amount: parseFloat(form.total_amount),
        payment_method: form.payment_method || null,
        notes: form.notes || null,
      });
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-green-500 focus:bg-white transition-all";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  const selectedApt = appointments.find(
    (a) => a.id === parseInt(form.appointment_id),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold" style={{ color: "#6B2D4E" }}>
            Buat Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className={labelClass}>
              Pilih Kunjungan (sudah selesai) *
            </label>
            <select
              className={inputClass}
              value={form.appointment_id}
              onChange={(e) => handleAppointmentChange(e.target.value)}
            >
              <option value="">Pilih kunjungan...</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.patient?.full_name} — {a.service?.name} —{" "}
                  {new Date(a.scheduled_at).toLocaleDateString("id-ID")}
                </option>
              ))}
            </select>
          </div>

          {selectedApt && (
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "#F4E6EE" }}
            >
              <div className="text-sm font-medium" style={{ color: "#6B2D4E" }}>
                {selectedApt.patient?.full_name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {selectedApt.service?.name} · Rp{" "}
                {selectedApt.service?.price.toLocaleString("id-ID")}
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Total Pembayaran (Rp) *</label>
            <input
              type="number"
              className={inputClass}
              value={form.total_amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, total_amount: e.target.value }))
              }
              placeholder="150000"
            />
          </div>

          <div>
            <label className={labelClass}>Metode Pembayaran</label>
            <div className="flex gap-2">
              {["tunai", "transfer", "qris"].map((m) => (
                <button
                  key={m}
                  onClick={() => setForm((f) => ({ ...f, payment_method: m }))}
                  className={`flex-1 py-2 text-sm rounded-lg border capitalize transition-all ${
                    form.payment_method === m
                      ? "border-[#6B2D4E] bg-[#F4E6EE] text-[#6B2D4E] font-medium"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Catatan</label>
            <input
              className={inputClass}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Catatan tambahan..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: loading ? "#9CA3AF" : "#6B2D4E" }}
          >
            {loading ? "Menyimpan..." : "Buat Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

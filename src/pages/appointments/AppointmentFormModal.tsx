import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../lib/api";
import type { Patient, Service, User } from "../../types";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function AppointmentFormModal({ onClose, onSaved }: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patient_id: "",
    therapist_id: "",
    service_id: "",
    scheduled_at: "",
    notes: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [pRes, sRes, uRes] = await Promise.all([
          api.get("/patients/"),
          api.get("/services/"),
          api.get("/auth/me"),
        ]);
        setPatients(pRes.data);
        setServices(sRes.data);
        setTherapists([uRes.data]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.patient_id || !form.service_id || !form.scheduled_at) {
      setError("Pasien, layanan, dan jadwal wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/appointments/", {
        patient_id: parseInt(form.patient_id),
        therapist_id: parseInt(form.therapist_id) || therapists[0]?.id,
        service_id: parseInt(form.service_id),
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        notes: form.notes || null,
      });
      onSaved();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-green-500 focus:bg-white transition-all";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold" style={{ color: "#6B2D4E" }}>
            Buat Kunjungan Baru
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
            <label className={labelClass}>Pasien *</label>
            <select
              className={inputClass}
              value={form.patient_id}
              onChange={(e) => set("patient_id", e.target.value)}
            >
              <option value="">Pilih pasien...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} — {p.patient_code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Layanan *</label>
            <select
              className={inputClass}
              value={form.service_id}
              onChange={(e) => set("service_id", e.target.value)}
            >
              <option value="">Pilih layanan...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.duration_minutes} mnt — Rp{" "}
                  {s.price.toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Terapis</label>
            <select
              className={inputClass}
              value={form.therapist_id}
              onChange={(e) => set("therapist_id", e.target.value)}
            >
              {therapists.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Tanggal & Jam *</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.scheduled_at}
              onChange={(e) => set("scheduled_at", e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Catatan</label>
            <textarea
              className={inputClass}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Catatan tambahan..."
              rows={2}
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
            {loading ? "Menyimpan..." : "Buat Kunjungan"}
          </button>
        </div>
      </div>
    </div>
  );
}

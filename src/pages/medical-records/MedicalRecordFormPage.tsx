import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import api from "../../lib/api";
import type { Appointment } from "../../types";

const ICD10_LIST = [
  { code: "M79.1", desc: "Myalgia" },
  { code: "M54.5", desc: "Low Back Pain" },
  { code: "M54.4", desc: "Lumbago with Sciatica" },
  { code: "M62.4", desc: "Contracture of Muscle" },
  { code: "G44.2", desc: "Tension-type Headache" },
  { code: "F41.1", desc: "Generalized Anxiety Disorder" },
  { code: "M25.5", desc: "Pain in Joint" },
  { code: "R51", desc: "Headache" },
  { code: "R52", desc: "Pain, Unspecified" },
  { code: "Z73.0", desc: "Burnout / Stress" },
];

export default function MedicalRecordFormPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [icdSearch, setIcdSearch] = useState("");
  const [showIcdDropdown, setShowIcdDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "anamnesis" | "vital" | "treatment" | "diagnosis"
  >("anamnesis");

  const [form, setForm] = useState({
    appointment_id: "",
    patient_id: "",
    therapist_id: "",
    chief_complaint: "",
    illness_history: "",
    past_medical_history: "",
    family_history: "",
    allergy_history: "",
    current_medication: "",
    lifestyle_notes: "",
    systolic_bp: "",
    diastolic_bp: "",
    pulse_rate: "",
    respiratory_rate: "",
    temperature: "",
    oxygen_saturation: "",
    body_weight: "",
    body_height: "",
    bmi: "",
    treatment_area: "",
    technique_used: "",
    tools_used: "",
    duration_actual: "",
    pre_treatment_notes: "",
    post_treatment_notes: "",
    icd10_code: "",
    icd10_description: "",
    diagnosis_notes: "",
    treatment_plan: "",
    next_visit_recommendation: "",
    referral_needed: false,
    referral_notes: "",
  });

  useEffect(() => {
    api.get("/appointments/").then((res) => setAppointments(res.data));
  }, []);

  const set = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleAppointmentChange = (aptId: string) => {
    const apt = appointments.find((a) => a.id === parseInt(aptId));
    if (apt) {
      set("appointment_id", aptId);
      set("patient_id", String(apt.patient_id));
      set("therapist_id", String(apt.therapist_id));
      set("duration_actual", String(apt.service?.duration_minutes ?? ""));
    }
  };

  const calcBMI = (weight: string, height: string) => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w && h) {
      set("bmi", (w / (h * h)).toFixed(1));
    }
  };

  const selectICD = (code: string, desc: string) => {
    set("icd10_code", code);
    set("icd10_description", desc);
    setIcdSearch(`${code} — ${desc}`);
    setShowIcdDropdown(false);
  };

  const filteredICD = ICD10_LIST.filter(
    (i) =>
      i.code.toLowerCase().includes(icdSearch.toLowerCase()) ||
      i.desc.toLowerCase().includes(icdSearch.toLowerCase()),
  );

  const handleSubmit = async () => {
    if (!form.appointment_id || !form.chief_complaint) {
      setError("Appointment dan keluhan utama wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/medical-records/", {
        ...form,
        appointment_id: parseInt(form.appointment_id),
        patient_id: parseInt(form.patient_id),
        therapist_id: parseInt(form.therapist_id),
        systolic_bp: form.systolic_bp ? parseInt(form.systolic_bp) : null,
        diastolic_bp: form.diastolic_bp ? parseInt(form.diastolic_bp) : null,
        pulse_rate: form.pulse_rate ? parseInt(form.pulse_rate) : null,
        respiratory_rate: form.respiratory_rate
          ? parseInt(form.respiratory_rate)
          : null,
        temperature: form.temperature ? parseFloat(form.temperature) : null,
        oxygen_saturation: form.oxygen_saturation
          ? parseFloat(form.oxygen_saturation)
          : null,
        body_weight: form.body_weight ? parseFloat(form.body_weight) : null,
        body_height: form.body_height ? parseFloat(form.body_height) : null,
        bmi: form.bmi ? parseFloat(form.bmi) : null,
        duration_actual: form.duration_actual
          ? parseInt(form.duration_actual)
          : null,
      });
      navigate("/medical-records");
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
  const tabs = [
    { key: "anamnesis", label: "Anamnesis" },
    { key: "vital", label: "Tanda Vital" },
    { key: "treatment", label: "Treatment" },
    { key: "diagnosis", label: "Diagnosis" },
  ] as const;

  const selectedApt = appointments.find(
    (a) => a.id === parseInt(form.appointment_id),
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/medical-records")}
          className="text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#6B2D4E" }}>
            Buat Rekam Medis
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Isi data rekam medis pasien
          </p>
        </div>
      </div>

      {/* Pilih Appointment */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <label className={labelClass}>Pilih Kunjungan (Appointment) *</label>
        <select
          className={inputClass}
          value={form.appointment_id}
          onChange={(e) => handleAppointmentChange(e.target.value)}
        >
          <option value="">Pilih kunjungan...</option>
          {appointments
            .filter((a) => a.status !== "done" && a.status !== "cancelled")
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.patient?.full_name} — {a.service?.name} —{" "}
                {new Date(a.scheduled_at).toLocaleDateString("id-ID")}
              </option>
            ))}
        </select>

        {selectedApt && (
          <div
            className="mt-3 flex items-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: "#F4E6EE" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: "#6B2D4E", color: "#fff" }}
            >
              {selectedApt.patient?.full_name?.[0]}
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: "#6B2D4E" }}>
                {selectedApt.patient?.full_name}
              </div>
              <div className="text-xs text-gray-500">
                {selectedApt.service?.name} · {selectedApt.therapist?.name}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === t.key
                  ? "border-[#6B2D4E] text-[#6B2D4E]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">
              {error}
            </p>
          )}

          {/* ANAMNESIS */}
          {activeTab === "anamnesis" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Keluhan Utama *</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.chief_complaint}
                  onChange={(e) => set("chief_complaint", e.target.value)}
                  placeholder="Keluhan yang dirasakan pasien..."
                />
              </div>
              <div>
                <label className={labelClass}>Riwayat Penyakit Sekarang</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.illness_history}
                  onChange={(e) => set("illness_history", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Riwayat Penyakit Dahulu</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.past_medical_history}
                  onChange={(e) => set("past_medical_history", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Riwayat Penyakit Keluarga</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.family_history}
                  onChange={(e) => set("family_history", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Alergi</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.allergy_history}
                  onChange={(e) => set("allergy_history", e.target.value)}
                  placeholder="Alergi obat/makanan..."
                />
              </div>
              <div>
                <label className={labelClass}>Obat yang Dikonsumsi</label>
                <input
                  className={inputClass}
                  value={form.current_medication}
                  onChange={(e) => set("current_medication", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Gaya Hidup</label>
                <input
                  className={inputClass}
                  value={form.lifestyle_notes}
                  onChange={(e) => set("lifestyle_notes", e.target.value)}
                  placeholder="Merokok, olahraga, dll..."
                />
              </div>
            </div>
          )}

          {/* TANDA VITAL */}
          {activeTab === "vital" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tekanan Darah (Sistolik)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.systolic_bp}
                    onChange={(e) => set("systolic_bp", e.target.value)}
                    placeholder="120"
                  />
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    mmHg
                  </span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tekanan Darah (Diastolik)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.diastolic_bp}
                    onChange={(e) => set("diastolic_bp", e.target.value)}
                    placeholder="80"
                  />
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    mmHg
                  </span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Nadi</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.pulse_rate}
                    onChange={(e) => set("pulse_rate", e.target.value)}
                    placeholder="80"
                  />
                  <span className="text-xs text-gray-400">/mnt</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Pernapasan</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.respiratory_rate}
                    onChange={(e) => set("respiratory_rate", e.target.value)}
                    placeholder="18"
                  />
                  <span className="text-xs text-gray-400">/mnt</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Suhu</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    className={inputClass}
                    value={form.temperature}
                    onChange={(e) => set("temperature", e.target.value)}
                    placeholder="36.5"
                  />
                  <span className="text-xs text-gray-400">°C</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>SpO2</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.oxygen_saturation}
                    onChange={(e) => set("oxygen_saturation", e.target.value)}
                    placeholder="98"
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Berat Badan</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.body_weight}
                    onChange={(e) => {
                      set("body_weight", e.target.value);
                      calcBMI(e.target.value, form.body_height);
                    }}
                    placeholder="70"
                  />
                  <span className="text-xs text-gray-400">kg</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tinggi Badan</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.body_height}
                    onChange={(e) => {
                      set("body_height", e.target.value);
                      calcBMI(form.body_weight, e.target.value);
                    }}
                    placeholder="170"
                  />
                  <span className="text-xs text-gray-400">cm</span>
                </div>
              </div>
              {form.bmi && (
                <div
                  className="col-span-2 p-3 rounded-lg"
                  style={{ backgroundColor: "#E8F5E0" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D7A4F" }}
                  >
                    BMI: {form.bmi}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {parseFloat(form.bmi) < 18.5
                      ? "Kurang"
                      : parseFloat(form.bmi) < 25
                        ? "Normal"
                        : parseFloat(form.bmi) < 30
                          ? "Lebih"
                          : "Obesitas"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TREATMENT */}
          {activeTab === "treatment" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Area Treatment</label>
                <input
                  className={inputClass}
                  value={form.treatment_area}
                  onChange={(e) => set("treatment_area", e.target.value)}
                  placeholder="Punggung bawah, bahu, leher..."
                />
              </div>
              <div>
                <label className={labelClass}>Teknik yang Digunakan</label>
                <input
                  className={inputClass}
                  value={form.technique_used}
                  onChange={(e) => set("technique_used", e.target.value)}
                  placeholder="Swedish massage, deep tissue..."
                />
              </div>
              <div>
                <label className={labelClass}>Alat yang Digunakan</label>
                <input
                  className={inputClass}
                  value={form.tools_used}
                  onChange={(e) => set("tools_used", e.target.value)}
                  placeholder="Jarum, batu panas, minyak..."
                />
              </div>
              <div>
                <label className={labelClass}>Durasi Aktual (menit)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.duration_actual}
                  onChange={(e) => set("duration_actual", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Kondisi Sebelum Treatment</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.pre_treatment_notes}
                  onChange={(e) => set("pre_treatment_notes", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Kondisi Sesudah Treatment</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.post_treatment_notes}
                  onChange={(e) => set("post_treatment_notes", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* DIAGNOSIS */}
          {activeTab === "diagnosis" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 relative">
                <label className={labelClass}>Cari Diagnosis ICD-10</label>
                <input
                  className={inputClass}
                  value={icdSearch}
                  onChange={(e) => {
                    setIcdSearch(e.target.value);
                    setShowIcdDropdown(true);
                  }}
                  onFocus={() => setShowIcdDropdown(true)}
                  placeholder="Ketik nama penyakit atau kode..."
                />
                {showIcdDropdown && filteredICD.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 overflow-hidden shadow-lg">
                    {filteredICD.map((i) => (
                      <div
                        key={i.code}
                        onClick={() => selectICD(i.code, i.desc)}
                        className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0"
                      >
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#6B2D4E" }}
                        >
                          {i.code}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {i.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Kode ICD-10</label>
                <input
                  className={inputClass}
                  value={form.icd10_code}
                  readOnly
                  style={{ backgroundColor: "#E8F5E0", color: "#2D7A4F" }}
                />
              </div>
              <div>
                <label className={labelClass}>Deskripsi Diagnosis</label>
                <input
                  className={inputClass}
                  value={form.icd10_description}
                  readOnly
                  style={{ backgroundColor: "#E8F5E0", color: "#2D7A4F" }}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Catatan Diagnosis</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.diagnosis_notes}
                  onChange={(e) => set("diagnosis_notes", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Rencana Treatment</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.treatment_plan}
                  onChange={(e) => set("treatment_plan", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>
                  Rekomendasi Kunjungan Berikutnya
                </label>
                <input
                  className={inputClass}
                  value={form.next_visit_recommendation}
                  onChange={(e) =>
                    set("next_visit_recommendation", e.target.value)
                  }
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Perlu Rujukan?</label>
                <div className="flex gap-2">
                  {[false, true].map((val) => (
                    <button
                      key={String(val)}
                      onClick={() => set("referral_needed", val)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                        form.referral_needed === val
                          ? "border-[#6B2D4E] bg-[#F4E6EE] text-[#6B2D4E] font-medium"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {val ? "Ya" : "Tidak"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <div
                key={t.key}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: activeTab === t.key ? 16 : 6,
                  backgroundColor: activeTab === t.key ? "#6B2D4E" : "#E5E7EB",
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/medical-records")}
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
              {loading ? "Menyimpan..." : "Simpan Rekam Medis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

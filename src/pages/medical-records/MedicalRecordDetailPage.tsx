import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import api from "../../lib/api";
import type { MedicalRecord, Patient, User } from "../../types";

interface FullMedicalRecord extends MedicalRecord {
  patient?: Patient;
  therapist?: User;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
      <div className="px-5 py-3 border-b border-gray-100">
        <h3
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "#6B2D4E" }}
        >
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="mb-3 last:mb-0">
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  );
}

export default function MedicalRecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<FullMedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/medical-records/${id}`)
      .then((res) => setRecord(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="p-8 text-center text-sm text-gray-400">Memuat...</div>
    );
  if (!record)
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        Rekam medis tidak ditemukan
      </div>
    );

  const bmi = record.bmi;
  const bmiCategory = bmi
    ? bmi < 18.5
      ? "Kurang"
      : bmi < 25
        ? "Normal"
        : bmi < 30
          ? "Lebih"
          : "Obesitas"
    : null;

  return (
    <>
      <div className="print:hidden flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button
          onClick={() => navigate("/medical-records")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <div className="ml-2">
          <h1 className="text-base font-semibold" style={{ color: "#6B2D4E" }}>
            Rekam Medis — {record.patient?.full_name}
          </h1>
          <p className="text-xs text-gray-400">
            {new Date(record.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {record.patient?.patient_code}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ backgroundColor: "#6B2D4E" }}
        >
          <Printer size={15} />
          Print
        </button>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
            style={{ backgroundColor: "#F4E6EE", color: "#6B2D4E" }}
          >
            {record.patient?.full_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-gray-800">
              {record.patient?.full_name}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {record.patient?.patient_code}
              {record.patient?.birth_date &&
                ` · ${new Date().getFullYear() - new Date(record.patient.birth_date).getFullYear()} tahun`}
              {record.patient?.gender &&
                ` · ${record.patient.gender === "male" ? "Laki-laki" : "Perempuan"}`}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-gray-400">Terapis</div>
            <div className="text-sm font-medium text-gray-800">
              {record.therapist?.name}
            </div>
          </div>
        </div>

        <Section title="Anamnesis">
          <div className="grid grid-cols-2 gap-x-8">
            <Field label="Keluhan Utama" value={record.chief_complaint} />
            <Field
              label="Riwayat Penyakit Sekarang"
              value={record.illness_history}
            />
            <Field
              label="Riwayat Penyakit Dahulu"
              value={record.past_medical_history}
            />
            <Field
              label="Riwayat Penyakit Keluarga"
              value={record.family_history}
            />
            <Field label="Alergi" value={record.allergy_history} />
            <Field
              label="Obat yang Dikonsumsi"
              value={record.current_medication}
            />
            <Field label="Gaya Hidup" value={record.lifestyle_notes} />
          </div>
        </Section>

        {(record.systolic_bp ||
          record.pulse_rate ||
          record.temperature ||
          record.body_weight) && (
          <Section title="Tanda Vital">
            <div className="grid grid-cols-4 gap-3">
              {record.systolic_bp && record.diastolic_bp && (
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div
                    className="text-base font-semibold"
                    style={{ color: "#6B2D4E" }}
                  >
                    {record.systolic_bp}/{record.diastolic_bp}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">mmHg</div>
                  <div className="text-xs text-gray-500 mt-0.5">Tensi</div>
                </div>
              )}
              {record.pulse_rate && (
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div
                    className="text-base font-semibold"
                    style={{ color: "#6B2D4E" }}
                  >
                    {record.pulse_rate}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">/mnt</div>
                  <div className="text-xs text-gray-500 mt-0.5">Nadi</div>
                </div>
              )}
              {record.respiratory_rate && (
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div
                    className="text-base font-semibold"
                    style={{ color: "#6B2D4E" }}
                  >
                    {record.respiratory_rate}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">/mnt</div>
                  <div className="text-xs text-gray-500 mt-0.5">Napas</div>
                </div>
              )}
              {record.temperature && (
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div
                    className="text-base font-semibold"
                    style={{ color: "#6B2D4E" }}
                  >
                    {record.temperature}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">°C</div>
                  <div className="text-xs text-gray-500 mt-0.5">Suhu</div>
                </div>
              )}
              {record.oxygen_saturation && (
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div
                    className="text-base font-semibold"
                    style={{ color: "#6B2D4E" }}
                  >
                    {record.oxygen_saturation}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">%</div>
                  <div className="text-xs text-gray-500 mt-0.5">SpO2</div>
                </div>
              )}
              {record.body_weight && (
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div
                    className="text-base font-semibold"
                    style={{ color: "#6B2D4E" }}
                  >
                    {record.body_weight}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">kg</div>
                  <div className="text-xs text-gray-500 mt-0.5">BB</div>
                </div>
              )}
              {record.body_height && (
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div
                    className="text-base font-semibold"
                    style={{ color: "#6B2D4E" }}
                  >
                    {record.body_height}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">cm</div>
                  <div className="text-xs text-gray-500 mt-0.5">TB</div>
                </div>
              )}
              {bmi && (
                <div
                  className="rounded-lg p-3 text-center border"
                  style={{ backgroundColor: "#E8F5E0", borderColor: "#C8E6A0" }}
                >
                  <div
                    className="text-base font-semibold"
                    style={{ color: "#2D7A4F" }}
                  >
                    {bmi.toFixed(1)}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#2D7A4F" }}>
                    BMI
                  </div>
                  <div
                    className="text-xs font-medium mt-0.5"
                    style={{ color: "#2D7A4F" }}
                  >
                    {bmiCategory}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {(record.treatment_area || record.technique_used) && (
          <Section title="Detail Treatment">
            <div className="grid grid-cols-2 gap-x-8">
              <Field label="Area Treatment" value={record.treatment_area} />
              <Field label="Teknik" value={record.technique_used} />
              <Field label="Alat" value={record.tools_used} />
              <Field
                label="Durasi Aktual"
                value={
                  record.duration_actual
                    ? `${record.duration_actual} menit`
                    : null
                }
              />
              <Field
                label="Kondisi Sebelum"
                value={record.pre_treatment_notes}
              />
              <Field
                label="Kondisi Sesudah"
                value={record.post_treatment_notes}
              />
            </div>
          </Section>
        )}

        {(record.icd10_code || record.diagnosis_notes) && (
          <Section title="Diagnosis">
            {record.icd10_code && (
              <div
                className="flex items-center gap-3 mb-3 p-3 rounded-lg"
                style={{ backgroundColor: "#F4E6EE" }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: "#6B2D4E" }}
                >
                  {record.icd10_code}
                </span>
                <span className="text-sm text-gray-700">
                  {record.icd10_description}
                </span>
              </div>
            )}
            <Field label="Catatan Diagnosis" value={record.diagnosis_notes} />
          </Section>
        )}

        {(record.treatment_plan || record.next_visit_recommendation) && (
          <Section title="Rencana & Tindak Lanjut">
            <div className="grid grid-cols-2 gap-x-8">
              <Field label="Rencana Treatment" value={record.treatment_plan} />
              <Field
                label="Rekomendasi Kunjungan"
                value={record.next_visit_recommendation}
              />
              <Field
                label="Perlu Rujukan"
                value={record.referral_needed ? "Ya" : "Tidak"}
              />
              <Field label="Catatan Rujukan" value={record.referral_notes} />
            </div>
          </Section>
        )}
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}

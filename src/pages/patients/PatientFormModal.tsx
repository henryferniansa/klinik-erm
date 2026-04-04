import { useState } from "react";
import { X } from "lucide-react";
import api from "../../lib/api";
import type { Patient } from "../../types";

interface Props {
  patient: Patient | null;
  onClose: () => void;
  onSaved: () => void;
}

const provinces = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "DI Yogyakarta",
  "Banten",
  "Bali",
  "Sumatera Utara",
  "Sumatera Selatan",
  "Sulawesi Selatan",
  "Kalimantan Timur",
  "Lainnya",
];

export default function PatientFormModal({ patient, onClose, onSaved }: Props) {
  const isEdit = !!patient;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "identitas" | "kontak" | "alamat" | "asuransi"
  >("identitas");

  const [form, setForm] = useState({
    nik: patient?.nik ?? "",
    full_name: patient?.full_name ?? "",
    birth_place: patient?.birth_place ?? "",
    birth_date: patient?.birth_date ?? "",
    gender: patient?.gender ?? "",
    blood_type: patient?.blood_type ?? "",
    marital_status: patient?.marital_status ?? "",
    religion: patient?.religion ?? "",
    nationality: patient?.nationality ?? "WNI",
    occupation: patient?.occupation ?? "",
    phone: patient?.phone ?? "",
    email: patient?.email ?? "",
    emergency_contact_name: patient?.emergency_contact_name ?? "",
    emergency_contact_phone: patient?.emergency_contact_phone ?? "",
    emergency_contact_relation: patient?.emergency_contact_relation ?? "",
    address_street: patient?.address_street ?? "",
    address_rt_rw: patient?.address_rt_rw ?? "",
    address_kelurahan: patient?.address_kelurahan ?? "",
    address_kecamatan: patient?.address_kecamatan ?? "",
    address_city: patient?.address_city ?? "",
    address_province: patient?.address_province ?? "",
    address_postal_code: patient?.address_postal_code ?? "",
    insurance_type: patient?.insurance_type ?? "umum",
    bpjs_number: patient?.bpjs_number ?? "",
    insurance_number: patient?.insurance_number ?? "",
  });

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.full_name) {
      setError("Nama lengkap wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await api.put(`/patients/${patient.id}`, form);
      } else {
        await api.post("/patients/", form);
      }
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

  const tabs = [
    { key: "identitas", label: "Identitas" },
    { key: "kontak", label: "Kontak" },
    { key: "alamat", label: "Alamat" },
    { key: "asuransi", label: "Asuransi" },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold" style={{ color: "#6B2D4E" }}>
            {isEdit ? "Edit Pasien" : "Tambah Pasien Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === t.key
                  ? "border-[#6B2D4E] text-[#6B2D4E]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">
              {error}
            </p>
          )}

          {activeTab === "identitas" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>NIK</label>
                <input
                  className={inputClass}
                  value={form.nik}
                  onChange={(e) => set("nik", e.target.value)}
                  placeholder="16 digit NIK"
                  maxLength={16}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Nama Lengkap *</label>
                <input
                  className={inputClass}
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="Nama sesuai KTP"
                />
              </div>
              <div>
                <label className={labelClass}>Tempat Lahir</label>
                <input
                  className={inputClass}
                  value={form.birth_place}
                  onChange={(e) => set("birth_place", e.target.value)}
                  placeholder="Kota lahir"
                />
              </div>
              <div>
                <label className={labelClass}>Tanggal Lahir</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.birth_date}
                  onChange={(e) => set("birth_date", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Jenis Kelamin</label>
                <select
                  className={inputClass}
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                >
                  <option value="">Pilih...</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Golongan Darah</label>
                <select
                  className={inputClass}
                  value={form.blood_type}
                  onChange={(e) => set("blood_type", e.target.value)}
                >
                  <option value="">Pilih...</option>
                  <option>A</option>
                  <option>B</option>
                  <option>AB</option>
                  <option>O</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status Pernikahan</label>
                <select
                  className={inputClass}
                  value={form.marital_status}
                  onChange={(e) => set("marital_status", e.target.value)}
                >
                  <option value="">Pilih...</option>
                  <option>Belum Menikah</option>
                  <option>Menikah</option>
                  <option>Cerai Hidup</option>
                  <option>Cerai Mati</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Agama</label>
                <select
                  className={inputClass}
                  value={form.religion}
                  onChange={(e) => set("religion", e.target.value)}
                >
                  <option value="">Pilih...</option>
                  <option>Islam</option>
                  <option>Kristen Protestan</option>
                  <option>Katolik</option>
                  <option>Hindu</option>
                  <option>Buddha</option>
                  <option>Konghucu</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Kewarganegaraan</label>
                <select
                  className={inputClass}
                  value={form.nationality}
                  onChange={(e) => set("nationality", e.target.value)}
                >
                  <option>WNI</option>
                  <option>WNA</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Pekerjaan</label>
                <input
                  className={inputClass}
                  value={form.occupation}
                  onChange={(e) => set("occupation", e.target.value)}
                  placeholder="Pekerjaan"
                />
              </div>
            </div>
          )}

          {activeTab === "kontak" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>No. Telepon</label>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="email@contoh.com"
                />
              </div>
              <div className="col-span-2 border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Kontak Darurat
                </p>
              </div>
              <div>
                <label className={labelClass}>Nama Kontak Darurat</label>
                <input
                  className={inputClass}
                  value={form.emergency_contact_name}
                  onChange={(e) =>
                    set("emergency_contact_name", e.target.value)
                  }
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className={labelClass}>Hubungan</label>
                <select
                  className={inputClass}
                  value={form.emergency_contact_relation}
                  onChange={(e) =>
                    set("emergency_contact_relation", e.target.value)
                  }
                >
                  <option value="">Pilih...</option>
                  <option>Suami/Istri</option>
                  <option>Orang Tua</option>
                  <option>Anak</option>
                  <option>Saudara</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>No. Telepon Darurat</label>
                <input
                  className={inputClass}
                  value={form.emergency_contact_phone}
                  onChange={(e) =>
                    set("emergency_contact_phone", e.target.value)
                  }
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>
          )}

          {activeTab === "alamat" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Alamat Lengkap</label>
                <input
                  className={inputClass}
                  value={form.address_street}
                  onChange={(e) => set("address_street", e.target.value)}
                  placeholder="Nama jalan, nomor rumah"
                />
              </div>
              <div>
                <label className={labelClass}>RT/RW</label>
                <input
                  className={inputClass}
                  value={form.address_rt_rw}
                  onChange={(e) => set("address_rt_rw", e.target.value)}
                  placeholder="000/000"
                />
              </div>
              <div>
                <label className={labelClass}>Kelurahan</label>
                <input
                  className={inputClass}
                  value={form.address_kelurahan}
                  onChange={(e) => set("address_kelurahan", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Kecamatan</label>
                <input
                  className={inputClass}
                  value={form.address_kecamatan}
                  onChange={(e) => set("address_kecamatan", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Kota/Kabupaten</label>
                <input
                  className={inputClass}
                  value={form.address_city}
                  onChange={(e) => set("address_city", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Provinsi</label>
                <select
                  className={inputClass}
                  value={form.address_province}
                  onChange={(e) => set("address_province", e.target.value)}
                >
                  <option value="">Pilih provinsi...</option>
                  {provinces.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Kode Pos</label>
                <input
                  className={inputClass}
                  value={form.address_postal_code}
                  onChange={(e) => set("address_postal_code", e.target.value)}
                  placeholder="12345"
                  maxLength={5}
                />
              </div>
            </div>
          )}

          {activeTab === "asuransi" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Jenis Pembayaran</label>
                <div className="flex gap-2">
                  {["umum", "bpjs", "asuransi_swasta"].map((type) => (
                    <button
                      key={type}
                      onClick={() => set("insurance_type", type)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                        form.insurance_type === type
                          ? "border-[#6B2D4E] bg-[#F4E6EE] text-[#6B2D4E] font-medium"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {type === "umum"
                        ? "Umum"
                        : type === "bpjs"
                          ? "BPJS"
                          : "Asuransi Swasta"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>No. Kartu BPJS</label>
                <input
                  className={inputClass}
                  value={form.bpjs_number}
                  onChange={(e) => set("bpjs_number", e.target.value)}
                  placeholder="13 digit"
                />
              </div>
              <div>
                <label className={labelClass}>No. Asuransi Swasta</label>
                <input
                  className={inputClass}
                  value={form.insurance_number}
                  onChange={(e) => set("insurance_number", e.target.value)}
                  placeholder="No. polis"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <div
                key={t.key}
                className={`w-2 h-2 rounded-full transition-all ${activeTab === t.key ? "w-4" : ""}`}
                style={{
                  backgroundColor: activeTab === t.key ? "#6B2D4E" : "#E5E7EB",
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
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
              {loading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Pasien"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Search, Plus, Users } from "lucide-react";
import type { Patient } from "../../types";
import PatientFormModal from "./PatientFormModal";
import PageHeader from "../../components/PageHeader";
import { getApi } from "../../lib/api";
const api = getApi();

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/patients/${search ? `?search=${search}` : ""}`,
      );
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleAdd = () => {
    setSelected(null);
    setShowModal(true);
  };
  const handleEdit = (patient: Patient) => {
    setSelected(patient);
    setShowModal(true);
  };
  const handleSaved = () => {
    setShowModal(false);
    fetchPatients();
  };

  return (
    <div>
      <PageHeader
        title="Data Pasien"
        subtitle={`${patients.length} pasien terdaftar`}
        actions={[
          {
            label: "Tambah Pasien",
            onClick: handleAdd,
            icon: <Plus size={15} />,
          },
        ]}
      />

      <div className="p-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari nama, NIK, atau kode pasien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-[#6B2D4E] transition-all"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : patients.length === 0 ? (
            <div className="p-12 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#F4E6EE" }}
              >
                <Users size={20} style={{ color: "#6B2D4E" }} />
              </div>
              <p className="text-sm font-medium text-gray-600">
                {search
                  ? "Pasien tidak ditemukan"
                  : "Belum ada pasien terdaftar"}
              </p>
              {!search && (
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 text-xs font-medium text-white rounded-lg"
                  style={{ backgroundColor: "#6B2D4E" }}
                >
                  + Tambah Pasien Pertama
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-medium">Pasien</th>
                  <th className="px-5 py-3 text-left font-medium">NIK</th>
                  <th className="px-5 py-3 text-left font-medium">Telepon</th>
                  <th className="px-5 py-3 text-left font-medium">Kota</th>
                  <th className="px-5 py-3 text-left font-medium">Asuransi</th>
                  <th className="px-5 py-3 text-left font-medium">Terdaftar</th>
                  <th className="px-5 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p.id}
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
                          {p.full_name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {p.full_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {p.patient_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 font-mono text-xs">
                      {p.nik ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {p.phone ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {p.address_city ?? "-"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          p.insurance_type === "bpjs"
                            ? "bg-blue-50 text-blue-700"
                            : p.insurance_type === "asuransi_swasta"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.insurance_type === "bpjs"
                          ? "BPJS"
                          : p.insurance_type === "asuransi_swasta"
                            ? "Swasta"
                            : "Umum"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {new Date(p.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#6B2D4E] hover:text-[#6B2D4E] transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <PatientFormModal
          patient={selected}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

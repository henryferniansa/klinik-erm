import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText } from "lucide-react";
import type { MedicalRecord, Patient, User } from "../../types";
import PageHeader from "../../components/PageHeader";
import { getApi } from "../../lib/api";
const api = getApi();

interface FullMedicalRecord extends MedicalRecord {
  patient?: Patient;
  therapist?: User;
}

export default function MedicalRecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<FullMedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get("/medical-records/");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filtered = records.filter(
    (r) =>
      r.patient?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.icd10_code?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Rekam Medis"
        subtitle={`${records.length} rekam medis`}
        actions={[
          {
            label: "Buat Rekam Medis",
            onClick: () => navigate("/medical-records/new"),
            icon: <Plus size={15} />,
          },
        ]}
      />

      <div className="p-6">
        <div className="relative mb-4">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari nama pasien atau kode ICD-10..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-[#6B2D4E] transition-all"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#EDE9FE" }}
              >
                <FileText size={20} style={{ color: "#6D28D9" }} />
              </div>
              <p className="text-sm font-medium text-gray-600">
                {search
                  ? "Rekam medis tidak ditemukan"
                  : "Belum ada rekam medis"}
              </p>
              {!search && (
                <button
                  onClick={() => navigate("/medical-records/new")}
                  className="mt-4 px-4 py-2 text-xs font-medium text-white rounded-lg"
                  style={{ backgroundColor: "#6B2D4E" }}
                >
                  + Buat Rekam Medis
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-medium">Pasien</th>
                  <th className="px-5 py-3 text-left font-medium">Keluhan</th>
                  <th className="px-5 py-3 text-left font-medium">Diagnosis</th>
                  <th className="px-5 py-3 text-left font-medium">Terapis</th>
                  <th className="px-5 py-3 text-left font-medium">Tanggal</th>
                  <th className="px-5 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
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
                          {r.patient?.full_name?.[0] ?? "?"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {r.patient?.full_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {r.patient?.patient_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                      {r.chief_complaint ?? "-"}
                    </td>
                    <td className="px-5 py-3">
                      {r.icd10_code ? (
                        <div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                            {r.icd10_code}
                          </span>
                          {r.icd10_description && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {r.icd10_description}
                            </div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {r.therapist?.name ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {new Date(r.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => navigate(`/medical-records/${r.id}`)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#6B2D4E] hover:text-[#6B2D4E] transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Service } from "../../types";
import ConfirmModal from "../../components/ConfirmModal";
import PageHeader from "../../components/PageHeader";
import { getApi } from "../../lib/api";
const api = getApi();

export default function SettingsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_minutes: "60",
    price: "",
    is_active: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/services/");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setForm({
      name: "",
      description: "",
      duration_minutes: "60",
      price: "",
      is_active: true,
    });
    setShowForm(true);
  };

  const handleEdit = (s: Service) => {
    setSelected(s);
    setForm({
      name: s.name,
      description: s.description ?? "",
      duration_minutes: String(s.duration_minutes),
      price: String(s.price),
      is_active: s.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = (s: Service) => setConfirmDelete(s);

  const doDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/services/${confirmDelete.id}`);
      setConfirmDelete(null);
      fetchServices();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e.response?.data?.detail ?? "Gagal menghapus layanan");
      setConfirmDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      setError("Nama dan harga wajib diisi");
      return;
    }
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        duration_minutes: parseInt(form.duration_minutes),
        price: parseFloat(form.price),
        is_active: form.is_active,
      };
      if (selected) {
        await api.put(`/services/${selected.id}`, payload);
      } else {
        await api.post("/services/", payload);
      }
      setShowForm(false);
      fetchServices();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail ?? "Terjadi kesalahan");
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-[#6B2D4E] transition-all";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <div>
      <PageHeader title="Pengaturan" subtitle="Kelola layanan klinik" />

      <div className="p-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold" style={{ color: "#6B2D4E" }}>
              Daftar Layanan
            </h2>
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg"
              style={{ backgroundColor: "#6B2D4E" }}
            >
              <Plus size={13} /> Tambah
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-medium">
                    Nama Layanan
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Durasi</th>
                  <th className="px-5 py-3 text-left font-medium">Harga</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-gray-50 hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-gray-800">
                        {s.name}
                      </div>
                      {s.description && (
                        <div className="text-xs text-gray-400">
                          {s.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {s.duration_minutes} menit
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-800">
                      Rp {s.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {s.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-gray-400 hover:text-[#6B2D4E] transition-colors p-1"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold" style={{ color: "#6B2D4E" }}>
                {selected ? "Edit Layanan" : "Tambah Layanan"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">
                  {error}
                </p>
              )}
              <div>
                <label className={labelClass}>Nama Layanan *</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Akupuntur"
                />
              </div>
              <div>
                <label className={labelClass}>Deskripsi</label>
                <input
                  className={inputClass}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Deskripsi singkat..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Durasi (menit)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={form.duration_minutes}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        duration_minutes: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Harga (Rp) *</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="150000"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <div className="flex gap-2">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      onClick={() => setForm((f) => ({ ...f, is_active: val }))}
                      className={`px-4 py-2 text-sm rounded-xl border transition-all ${form.is_active === val ? "border-[#6B2D4E] bg-[#F4E6EE] text-[#6B2D4E] font-medium" : "border-gray-200 text-gray-500"}`}
                    >
                      {val ? "Aktif" : "Nonaktif"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white rounded-xl"
                style={{ backgroundColor: "#6B2D4E" }}
              >
                {selected ? "Simpan Perubahan" : "Tambah Layanan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Hapus Layanan"
          message={`Apakah kamu yakin ingin menghapus layanan "${confirmDelete.name}"? Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Ya, Hapus"
          danger
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

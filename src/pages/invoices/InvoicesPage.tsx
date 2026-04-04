import { useEffect, useState } from "react";
import { Plus, X, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import type { Invoice } from "../../types";
import InvoiceFormModal from "./InvoiceFormModal";
import PageHeader from "../../components/PageHeader";

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [payMethod, setPayMethod] = useState("tunai");
  const [payLoading, setPayLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/invoices/");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePay = async () => {
    if (!payInvoice) return;
    setPayLoading(true);
    try {
      await api.patch(
        `/invoices/${payInvoice.id}/pay?payment_method=${payMethod}`,
      );
      setPayInvoice(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    } finally {
      setPayLoading(false);
    }
  };

  const totalToday = invoices
    .filter((inv) => {
      if (inv.status !== "paid" || !inv.paid_at) return false;
      return new Date(inv.paid_at).toDateString() === new Date().toDateString();
    })
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const unpaidCount = invoices.filter((inv) => inv.status === "unpaid").length;

  return (
    <div>
      <PageHeader
        title="Kasir & Invoice"
        subtitle={`Pendapatan hari ini: Rp ${totalToday.toLocaleString("id-ID")}${unpaidCount > 0 ? ` · ${unpaidCount} belum dibayar` : ""}`}
        actions={[
          {
            label: "Buat Invoice",
            onClick: () => setShowModal(true),
            icon: <Plus size={15} />,
          },
        ]}
      />

      <div className="p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-xs text-gray-400 mb-1">Total Invoice</div>
            <div className="text-2xl font-semibold text-gray-800">
              {invoices.length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-xs text-gray-400 mb-1">Belum Dibayar</div>
            <div className="text-2xl font-semibold text-amber-600">
              {unpaidCount}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-xs text-gray-400 mb-1">
              Pendapatan Hari Ini
            </div>
            <div
              className="text-2xl font-semibold"
              style={{ color: "#2D7A4F" }}
            >
              Rp {totalToday.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-12 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#FEF3E2" }}
              >
                <CreditCard size={20} style={{ color: "#C2610C" }} />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Belum ada invoice
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 text-xs font-medium text-white rounded-lg"
                style={{ backgroundColor: "#6B2D4E" }}
              >
                + Buat Invoice Pertama
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-medium">
                    No. Invoice
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Pasien</th>
                  <th className="px-5 py-3 text-left font-medium">Total</th>
                  <th className="px-5 py-3 text-left font-medium">Metode</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Tanggal</th>
                  <th className="px-5 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-gray-50 hover:bg-gray-50/80 transition-colors"
                  >
                    <td
                      className="px-5 py-3 text-sm font-medium"
                      style={{ color: "#6B2D4E" }}
                    >
                      {inv.invoice_number}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: "#F4E6EE",
                            color: "#6B2D4E",
                          }}
                        >
                          {inv.patient?.full_name?.[0] ?? "?"}
                        </div>
                        <div className="text-sm text-gray-800">
                          {inv.patient?.full_name ?? "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-800">
                      Rp {inv.total_amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 capitalize">
                      {inv.payment_method ?? "-"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          inv.status === "paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {inv.status === "paid" ? "Lunas" : "Belum Bayar"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {new Date(inv.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {inv.status === "unpaid" && (
                          <button
                            onClick={() => {
                              setPayInvoice(inv);
                              setPayMethod("tunai");
                            }}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: "#2D7A4F" }}
                          >
                            Bayar
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/print/invoice/${inv.id}`)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#6B2D4E] hover:text-[#6B2D4E] transition-colors"
                        >
                          Print
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

      {showModal && (
        <InvoiceFormModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchInvoices();
          }}
        />
      )}

      {/* Payment Modal */}
      {payInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold" style={{ color: "#6B2D4E" }}>
                Proses Pembayaran
              </h2>
              <button
                onClick={() => setPayInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: "#F4E6EE" }}
              >
                <div className="text-xs text-gray-500">
                  {payInvoice.invoice_number}
                </div>
                <div
                  className="text-sm font-medium mt-0.5"
                  style={{ color: "#6B2D4E" }}
                >
                  {payInvoice.patient?.full_name}
                </div>
                <div
                  className="text-xl font-bold mt-1"
                  style={{ color: "#6B2D4E" }}
                >
                  Rp {payInvoice.total_amount.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Metode Pembayaran
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "tunai", label: "💵 Tunai" },
                    { id: "transfer", label: "🏦 Transfer" },
                    { id: "qris", label: "📱 QRIS" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`py-3 text-sm rounded-xl border transition-all ${
                        payMethod === m.id
                          ? "border-[#6B2D4E] bg-[#F4E6EE] text-[#6B2D4E] font-medium"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setPayInvoice(null)}
                className="flex-1 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handlePay}
                disabled={payLoading}
                className="flex-1 py-2.5 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: payLoading ? "#9CA3AF" : "#2D7A4F" }}
              >
                {payLoading ? "Memproses..." : "Konfirmasi Bayar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

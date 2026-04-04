import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import api from "../../lib/api";
import type { Invoice, Appointment } from "../../types";

export default function InvoicePrintPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const invRes = await api.get(`/invoices/${id}`);
        setInvoice(invRes.data);
        if (invRes.data.appointment_id) {
          const aptRes = await api.get(
            `/appointments/${invRes.data.appointment_id}`,
          );
          setAppointment(aptRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="p-8 text-center text-sm text-gray-400">Memuat...</div>
    );
  if (!invoice)
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        Invoice tidak ditemukan
      </div>
    );

  return (
    <>
      <div className="print:hidden flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
        <button
          onClick={() => navigate("/invoices")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg ml-auto"
          style={{ backgroundColor: "#6B2D4E" }}
        >
          <Printer size={16} />
          Print / Simpan PDF
        </button>
      </div>

      <div
        className="min-h-screen p-8 flex justify-center"
        style={{ backgroundColor: "#F8F9F4" }}
      >
        <div
          className="bg-white w-full max-w-md p-8 rounded-2xl print:rounded-none print:shadow-none print:p-6"
          style={{ boxShadow: "0 4px 24px rgba(107,45,78,0.08)" }}
        >
          <div className="text-center mb-6 pb-6 border-b border-gray-100">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "#8BC34A" }}
            >
              <span className="text-xl">🌿</span>
            </div>
            <h1 className="text-lg font-bold" style={{ color: "#6B2D4E" }}>
              Griya Sehat Madasakti
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Klinik Kesehatan Holistik
            </p>
          </div>

          <div className="text-center mb-6">
            <div
              className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: "#F4E6EE", color: "#6B2D4E" }}
            >
              {invoice.status === "paid"
                ? "Kwitansi Pembayaran"
                : "Nota Tagihan"}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">No. Invoice</span>
              <span className="font-medium text-gray-800">
                {invoice.invoice_number}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tanggal</span>
              <span className="font-medium text-gray-800">
                {new Date(invoice.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            {invoice.status === "paid" && invoice.paid_at && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tgl. Bayar</span>
                <span className="font-medium text-gray-800">
                  {new Date(invoice.paid_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          <div
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: "#F8F9F4" }}
          >
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Data Pasien
            </div>
            <div className="text-sm font-semibold text-gray-800">
              {invoice.patient?.full_name}
            </div>
            {invoice.patient?.patient_code && (
              <div className="text-xs text-gray-400 mt-0.5">
                {invoice.patient.patient_code}
              </div>
            )}
            {invoice.patient?.phone && (
              <div className="text-xs text-gray-400">
                {invoice.patient.phone}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Detail Layanan
            </div>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {appointment?.service?.name ?? "Layanan"}
                  </div>
                  {appointment?.service?.duration_minutes && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {appointment.service.duration_minutes} menit
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-800">
                  Rp {invoice.total_amount.toLocaleString("id-ID")}
                </div>
              </div>
              <div
                className="flex justify-between items-center px-4 py-3 border-t"
                style={{ backgroundColor: "#F8F9F4", borderColor: "#F0F0F0" }}
              >
                <span className="text-sm font-semibold text-gray-700">
                  Total
                </span>
                <span
                  className="text-base font-bold"
                  style={{ color: "#6B2D4E" }}
                >
                  Rp {invoice.total_amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {invoice.status === "paid" && (
            <div className="flex justify-between items-center mb-6 text-sm">
              <span className="text-gray-400">Metode Pembayaran</span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                style={{ backgroundColor: "#E8F5E0", color: "#2D7A4F" }}
              >
                {invoice.payment_method ?? "-"}
              </span>
            </div>
          )}

          <div
            className="text-center py-3 rounded-xl mb-6"
            style={{
              backgroundColor:
                invoice.status === "paid" ? "#E8F5E0" : "#FEF3E2",
              color: invoice.status === "paid" ? "#2D7A4F" : "#C2610C",
            }}
          >
            <span className="text-sm font-semibold">
              {invoice.status === "paid" ? "✓ LUNAS" : "⏳ BELUM DIBAYAR"}
            </span>
          </div>

          {invoice.notes && (
            <div className="mb-6 text-xs text-gray-400 text-center">
              Catatan: {invoice.notes}
            </div>
          )}

          <div className="text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400">
              Terima kasih telah mempercayakan
            </p>
            <p className="text-xs text-gray-400">
              kesehatan Anda kepada kami 🌿
            </p>
            <p
              className="text-xs font-medium mt-2"
              style={{ color: "#6B2D4E" }}
            >
              Griya Sehat Madasakti
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}

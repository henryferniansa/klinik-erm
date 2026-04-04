import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PatientsPage from "./pages/patients/PatientsPage";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";
import MedicalRecordsPage from "./pages/medical-records/MedicalRecordsPage";
import MedicalRecordFormPage from "./pages/medical-records/MedicalRecordFormPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import InvoicePrintPage from "./pages/invoices/InvoicePrintPage";
import SettingsPage from "./pages/settings/SettingsPage";
import MedicalRecordDetailPage from "./pages/medical-records/MedicalRecordDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Print page - path berbeda agar tidak konflik dengan /invoices */}
        <Route
          path="/print/invoice/:id"
          element={
            <PrivateRoute>
              <InvoicePrintPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="medical-records" element={<MedicalRecordsPage />} />
          <Route
            path="medical-records/new"
            element={<MedicalRecordFormPage />}
          />
          <Route
            path="/medical-records/:id"
            element={
              <PrivateRoute>
                <MedicalRecordDetailPage />
              </PrivateRoute>
            }
          />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import {
  mockPatients,
  mockServices,
  mockAppointments,
  mockMedicalRecords,
  mockInvoices,
} from "./mockData";

// Simulate API delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  async get(url: string) {
    await delay();
    if (url.includes("/patients/")) return { data: mockPatients };
    if (url.includes("/services/")) return { data: mockServices };
    if (url.includes("/appointments/today")) return { data: mockAppointments };
    if (url.includes("/appointments/")) return { data: mockAppointments };
    if (url.includes("/medical-records/")) {
      const match = url.match(/\/medical-records\/(\d+)/);
      if (match)
        return {
          data: mockMedicalRecords.find((r) => r.id === parseInt(match[1])),
        };
      return { data: mockMedicalRecords };
    }
    if (url.includes("/invoices/")) {
      const match = url.match(/\/invoices\/(\d+)/);
      if (match)
        return { data: mockInvoices.find((i) => i.id === parseInt(match[1])) };
      return { data: mockInvoices };
    }
    if (url.includes("/auth/me"))
      return {
        data: {
          id: 1,
          name: "Admin Demo",
          email: "admin@demo.com",
          role: "admin",
        },
      };
    return { data: [] };
  },
  async post() {
    await delay();
    return { data: {} };
  },
  async put() {
    await delay();
    return { data: {} };
  },
  async patch() {
    await delay();
    return { data: {} };
  },
  async delete() {
    await delay();
    return { data: {} };
  },
};

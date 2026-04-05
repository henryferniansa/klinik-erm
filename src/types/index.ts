export type UserRole = "owner" | "admin" | "therapist";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Patient {
  id: number;
  patient_code: string;
  nik?: string | null;
  full_name: string;
  birth_place?: string | null;
  birth_date?: string | null;
  gender?: "male" | "female" | null;
  blood_type?: string | null;
  marital_status?: string | null;
  religion?: string | null;
  nationality: string;
  occupation?: string | null;
  phone?: string | null;
  email?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relation?: string | null;
  address_street?: string | null;
  address_rt_rw?: string | null;
  address_kelurahan?: string | null;
  address_kecamatan?: string | null;
  address_city?: string | null;
  address_province?: string | null;
  address_postal_code?: string | null;
  insurance_type: string;
  bpjs_number?: string | null;
  insurance_number?: string | null;
  medical_history?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface Service {
  id: number;
  name: string;
  description?: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

export type AppointmentStatus =
  | "scheduled"
  | "in_progress"
  | "done"
  | "cancelled";

export interface Appointment {
  id: number;
  patient_id: number;
  therapist_id: number;
  service_id: number;
  scheduled_at: string;
  status: AppointmentStatus;
  notes?: string | null;
  patient?: Patient;
  therapist?: User;
  service?: Service;
  created_at: string;
}

export interface MedicalRecord {
  id: number;
  appointment_id: number;
  patient_id: number;
  therapist_id: number;
  patient?: Patient;
  therapist?: User;
  chief_complaint?: string | null;
  illness_history?: string | null;
  past_medical_history?: string | null;
  family_history?: string | null;
  allergy_history?: string | null;
  current_medication?: string | null;
  lifestyle_notes?: string | null;
  systolic_bp?: number | null;
  diastolic_bp?: number | null;
  pulse_rate?: number | null;
  respiratory_rate?: number | null;
  temperature?: number | null;
  oxygen_saturation?: number | null;
  body_weight?: number | null;
  body_height?: number | null;
  bmi?: number | null;
  treatment_area?: string | null;
  technique_used?: string | null;
  tools_used?: string | null;
  duration_actual?: number | null;
  pre_treatment_notes?: string | null;
  post_treatment_notes?: string | null;
  icd10_code?: string | null;
  icd10_description?: string | null;
  diagnosis_notes?: string | null;
  treatment_plan?: string | null;
  next_visit_recommendation?: string | null;
  next_visit_date?: string | null;
  referral_needed: boolean;
  referral_notes?: string | null;
  therapist_signature_url?: string | null;
  clinic_head_signature_url?: string | null;
  signed_by?: string | null;
  signed_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  appointment_id: number;
  patient_id: number;
  total_amount: number;
  payment_method?: string | null;
  status: "unpaid" | "paid";
  notes?: string | null;
  paid_at?: string | null;
  patient?: Patient;
  created_at: string;
}

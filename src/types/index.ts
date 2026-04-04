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
  nik?: string;
  full_name: string;
  birth_place?: string;
  birth_date?: string;
  gender?: "male" | "female";
  blood_type?: string;
  marital_status?: string;
  religion?: string;
  nationality: string;
  occupation?: string;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  address_street?: string;
  address_rt_rw?: string;
  address_kelurahan?: string;
  address_kecamatan?: string;
  address_city?: string;
  address_province?: string;
  address_postal_code?: string;
  insurance_type: string;
  bpjs_number?: string;
  insurance_number?: string;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
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
  notes?: string;
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
  chief_complaint?: string;
  illness_history?: string;
  past_medical_history?: string;
  family_history?: string;
  allergy_history?: string;
  current_medication?: string;
  lifestyle_notes?: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  pulse_rate?: number;
  respiratory_rate?: number;
  temperature?: number;
  oxygen_saturation?: number;
  body_weight?: number;
  body_height?: number;
  bmi?: number;
  treatment_area?: string;
  technique_used?: string;
  tools_used?: string;
  duration_actual?: number;
  pre_treatment_notes?: string;
  post_treatment_notes?: string;
  icd10_code?: string;
  icd10_description?: string;
  diagnosis_notes?: string;
  treatment_plan?: string;
  next_visit_recommendation?: string;
  next_visit_date?: string;
  referral_needed: boolean;
  referral_notes?: string;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  appointment_id: number;
  patient_id: number;
  total_amount: number;
  payment_method?: string;
  status: "unpaid" | "paid";
  notes?: string;
  paid_at?: string;
  patient?: Patient;
  created_at: string;
}

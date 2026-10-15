export type Language = 'hi' | 'en';
export type UserRole = 'patient' | 'asha_worker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  village?: string;
  district?: string;
  abha_id?: string;
  assigned_phc?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  is_emergency?: boolean;
  emergency_actions?: string[];
  suggested_followups?: string[];
  triage_urgency?: 'RED' | 'YELLOW' | 'GREEN';
  timestamp: string;
  provider?: 'openai' | 'fallback';
  model?: string;
  error?: boolean;
}

export interface TriageResult {
  assessment_id: string;
  urgency: 'RED' | 'YELLOW' | 'GREEN';
  urgency_label_en: string;
  urgency_label_hi: string;
  headline_en: string;
  headline_hi: string;
  recommendation_en: string;
  recommendation_hi: string;
  reasoning_en: string[];
  reasoning_hi: string[];
  immediate_actions_en: string[];
  immediate_actions_hi: string[];
  warning_signs_to_watch_en: string[];
  warning_signs_to_watch_hi: string[];
  emergency_contact: string;
  created_at: string;
  patient_summary_for_asha: {
    token?: string;
    date?: string;
    patient_name: string;
    age_group: string;
    urgency?: string;
    triage_level?: string;
    duration_days: number;
    main_symptoms?: string[];
    symptoms?: string[];
    severity?: string;
    red_flags?: string[];
    vital_temp?: string;
    vital_spo2?: string;
    recommended_facility?: string;
    facility_referral?: string;
    asha_action_notes?: string;
  };
}

export interface Biomarker {
  test_name: string;
  test_name_hi: string;
  value: number;
  unit: string;
  reference_low: number;
  reference_high: number;
  status: 'NORMAL' | 'HIGH' | 'LOW';
  status_label_en: string;
  status_label_hi: string;
  explanation_en: string;
  explanation_hi: string;
}

export interface ReportAnalysis {
  report_type: string;
  patient_info: {
    name: string;
    status?: string;
    age?: number;
    gender?: string;
    test_date?: string;
  };
  biomarkers: Biomarker[];
  summary_en: string;
  summary_hi: string;
  abnormal_count: number;
  recommendation_en: string;
  recommendation_hi: string;
  safety_disclaimer: string;
}

export interface Facility {
  id: string;
  name: string;
  name_hi: string;
  type: string;
  type_label: string;
  district: string;
  state: string;
  pincode: string;
  address: string;
  phone: string;
  emergency_phone: string;
  lat: number;
  lng: number;
  beds: number;
  services: string[];
  services_hi: string[];
  open_hours: string;
  is_verified: boolean;
  distance_km?: number | null;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  phone: string;
  abha_id: string;
  category: string;
  last_visit?: string;
  last_triage?: string;
  last_assessment_id?: string;
  risk_level?: string;
  triage_status: 'RED' | 'YELLOW' | 'GREEN';
  symptoms: string;
  assigned_worker?: string;
  assigned_asha?: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  patient_id: string;
  patient_name: string;
  title: string;
  title_hi: string;
  due_date: string;
  type: string;
  facility: string;
  completed: boolean;
  urgency: 'high' | 'medium' | 'normal' | 'low';
}

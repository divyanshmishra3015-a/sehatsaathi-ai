import { TriageResult, Facility, ReportAnalysis, Patient, Reminder } from '../types';

const API_BASE = '/api';

export const api = {
  // Chat
  async sendChat(message: string, language: string = 'hi', history: any[] = []) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, history })
    });
    if (!res.ok) throw new Error('Failed to get response from AI Health Saathi');
    return res.json();
  },

  // Triage
  async submitTriage(data: any): Promise<TriageResult> {
    const res = await fetch(`${API_BASE}/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to evaluate triage assessment');
    return res.json();
  },

  // Facilities
  async getFacilities(params: {
    q?: string;
    facility_type?: string;
    district?: string;
    lat?: number;
    lng?: number;
  }): Promise<Facility[]> {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.facility_type) query.append('facility_type', params.facility_type);
    if (params.district) query.append('district', params.district);
    if (params.lat !== undefined) query.append('lat', params.lat.toString());
    if (params.lng !== undefined) query.append('lng', params.lng.toString());

    const res = await fetch(`${API_BASE}/facilities?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch facilities');
    return res.json();
  },

  // Medical Reports
  async getSampleReport(sampleKey: string): Promise<ReportAnalysis> {
    const res = await fetch(`${API_BASE}/reports/sample/${sampleKey}`);
    if (!res.ok) throw new Error('Failed to fetch sample report');
    return res.json();
  },

  async analyzeReport(formData: FormData): Promise<ReportAnalysis> {
    const res = await fetch(`${API_BASE}/reports/analyze`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to analyze report');
    return res.json();
  },

  // ASHA & Patients
  async getPatients(search?: string): Promise<Patient[]> {
    const url = search ? `${API_BASE}/patients?search=${encodeURIComponent(search)}` : `${API_BASE}/patients`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  },

  async getPatient(id: string): Promise<Patient> {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    if (!res.ok) throw new Error('Failed to fetch patient details');
    return res.json();
  },

  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to register patient');
    return res.json();
  },

  // Reminders
  async getReminders(patientId?: string): Promise<Reminder[]> {
    const url = patientId ? `${API_BASE}/reminders?patient_id=${patientId}` : `${API_BASE}/reminders`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch reminders');
    return res.json();
  },

  async createReminder(data: any): Promise<Reminder> {
    const res = await fetch(`${API_BASE}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create reminder');
    return res.json();
  },

  async toggleReminder(id: string): Promise<Reminder> {
    const res = await fetch(`${API_BASE}/reminders/${id}/toggle`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to toggle reminder');
    return res.json();
  },

  async deleteReminder(id: string): Promise<Reminder> {
    const res = await fetch(`${API_BASE}/reminders/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete reminder');
    return res.json();
  },

  // Admin Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  }
};

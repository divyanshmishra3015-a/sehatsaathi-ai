import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Patient, Reminder } from '../types';
import {
  Users,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  UserPlus,
  Search,
  ChevronRight,
  ClipboardList,
  PhoneCall,
  Activity,
  FileCheck
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const AshaDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Registration modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('32');
  const [newGender, setNewGender] = useState('Female');
  const [newVillage, setNewVillage] = useState('Cholapur Tola 1');
  const [newPhone, setNewPhone] = useState('+91 98765 00000');
  const [newCategory, setNewCategory] = useState('Pregnant (ANC)');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);

  useEffect(() => {
    Promise.all([api.getPatients(), api.getReminders()])
      .then(([pts, rems]) => {
        setPatients(pts);
        setReminders(rems);
      })
      .catch((err) => console.error('Error fetching ASHA data', err))
      .finally(() => setLoading(false));
  }, []);

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !consentGiven) return;

    try {
      const created = await api.registerPatient({
        name: newName,
        age: parseInt(newAge),
        gender: newGender,
        village: newVillage,
        phone: newPhone,
        category: newCategory,
        symptoms: newSymptoms || 'Routine ASHA household checkup',
        triage_status: 'GREEN'
      });
      setPatients((prev) => [created, ...prev]);
      setShowRegisterModal(false);
      setNewName('');
      setNewSymptoms('');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  const urgentPatients = patients.filter((p) => p.triage_status === 'RED');
  const yellowPatients = patients.filter((p) => p.triage_status === 'YELLOW');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
              {language === 'hi' ? 'अधिकृत स्वास्थ्य कार्यकर्ता पोर्टल' : 'Authorized Healthcare Worker Portal'}
            </span>
            <span className="text-xs text-purple-200">
              Cluster: Cholapur Primary Health Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {t('asha_title')}
          </h1>
          <p className="text-purple-200 text-sm mt-0.5">
            {language === 'hi'
              ? 'कार्यकर्ता: राधा मौर्या | क्षेत्र: चोलापुर क्लस्टर | संबद्ध पीएचसी: पीएचसी चोलापुर'
              : 'ASHA Worker: Radha Maurya | Coverage: Cholapur Cluster | Linked PHC: PHC Cholapur'}
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-purple-900 font-bold text-sm shadow hover:bg-purple-50 transition active:scale-95"
        >
          <UserPlus className="w-4 h-4 text-purple-700" />
          <span>{t('register_new_patient')}</span>
        </button>
      </div>

      {/* Top Priority Triage Alerts Banner (RED Flags in Village) */}
      {urgentPatients.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
              <span>{t('urgent_queue')}</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-xs">
                {urgentPatients.length} {language === 'hi' ? 'मरीज तत्काल ध्यान हेतु' : 'Needs Immediate Review'}
              </span>
            </div>
            <span className="text-xs text-rose-700 font-semibold">Protocols: Dial 108 / Visit District Trauma</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {urgentPatients.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-2xl border border-rose-200 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{p.name} ({p.age} Y / {p.gender})</h4>
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      RED - URGENT
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 font-semibold mt-1">
                    {p.symptoms}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Village: {p.village} | {p.phone}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${p.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Patient</span>
                  </a>
                  <a
                    href="tel:108"
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-900 bg-rose-100 px-2 py-1 rounded-lg"
                  >
                    <span>108 Ambulance</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Patients List & Scheduled Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Registry (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {t('all_patients_list')}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'सहमति-आधारित स्वास्थ्य रिकॉर्ड एवं हालिया लक्षण' : 'Consent-based community health registry'}
              </p>
            </div>
            <Link
              to="/worker/patients"
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              {language === 'hi' ? 'विस्तृत सूची' : 'Full Registry'}
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {patients.map((pat) => (
              <div key={pat.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{pat.name}</span>
                    <span className="text-xs text-slate-400">({pat.age} Y / {pat.gender})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pat.triage_status === 'RED'
                          ? 'bg-rose-100 text-rose-800'
                          : pat.triage_status === 'YELLOW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {pat.triage_status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-700">Category:</strong> {pat.category} | {pat.village}
                  </div>
                  <p className="text-xs text-slate-500">
                    <strong className="text-slate-600">Recent check:</strong> {pat.symptoms}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${pat.phone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Call"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                  <Link
                    to={`/worker/patients/${pat.id}`}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>View Record</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Follow-up Reminders & Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-700" />
                <span>{language === 'hi' ? 'फॉलो-अप एवं गृह भ्रमण' : 'Scheduled Follow-ups'}</span>
              </h3>
            </div>

            <div className="space-y-3">
              {reminders.map((r) => (
                <div key={r.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.patient_name}</span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full">
                      {r.due_date}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium">
                    {language === 'hi' ? r.title_hi : r.title}
                  </div>
                  <div className="text-slate-400">{r.facility}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">
                {language === 'hi' ? 'नए ग्रामीण मरीज का पंजीकरण' : 'Register New Village Citizen'}
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'मरीज का नाम' : 'Patient Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Geeta Devi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age (वर्ष)</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  >
                    <option value="Female">Female (महिला)</option>
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Village / Tola</label>
                  <input
                    type="text"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Care Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                >
                  <option value="Pregnant (ANC)">Pregnant Woman (ANC Care)</option>
                  <option value="Pediatric">Infant / Child (&lt; 5 Y)</option>
                  <option value="NCD / Diabetic / HTN">NCD (Diabetes / Hypertension)</option>
                  <option value="Elderly">Elderly Senior Citizen</option>
                  <option value="General">General Adult</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'प्रारंभिक लक्षण / टिप्पणियां' : 'Initial Symptoms / Health Notes'}
                </label>
                <textarea
                  rows={2}
                  value={newSymptoms}
                  onChange={(e) => setNewSymptoms(e.target.value)}
                  placeholder="e.g. Mild headache, routine 2nd trimester checkup"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              {/* Consent requirement */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-4 h-4 rounded-md mt-0.5 text-purple-600"
                />
                <span className="text-[11px] text-slate-600">
                  {language === 'hi'
                    ? 'मरीज ने अपनी स्वास्थ्य जानकारी आशा कार्यकर्ता के साथ साझा करने की सूचित सहमति (Informed Consent) दी है।'
                    : 'Patient has provided informed verbal consent to record health details for community healthcare support.'}
                </span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!consentGiven || !newName}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold disabled:opacity-50"
                >
                  {language === 'hi' ? 'पंजीकरण पूर्ण करें' : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <MedicalSafetyNotice />
    </div>
  );
};

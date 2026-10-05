import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Patient } from '../types';
import {
  ArrowLeft,
  User,
  PhoneCall,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Activity,
  Save,
  Clock
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getPatient(id)
        .then((p) => {
          setPatient(p);
          setNotes(p.notes || '');
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSaveNotes = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading patient profile...</div>;
  }

  if (!patient) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Patient not found</h2>
        <Link to="/worker/dashboard" className="text-teal-700 font-bold">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/worker/dashboard"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {patient.name}
          </h1>
          <p className="text-xs text-slate-500">
            ABHA ID: {patient.abha_id} • Village: {patient.village}
          </p>
        </div>
      </div>

      {/* Patient Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    patient.triage_status === 'RED'
                      ? 'bg-rose-100 text-rose-800'
                      : patient.triage_status === 'YELLOW'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  Triage: {patient.triage_status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.age} Y / {patient.gender} • {patient.category}
              </p>
            </div>
          </div>

          <a
            href={`tel:${patient.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call {patient.phone}</span>
          </a>
        </div>

        {/* Health details & Recent Triage Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              Recent Reported Symptoms
            </span>
            <p className="text-slate-800 font-semibold text-sm">
              {patient.symptoms}
            </p>
            <span className="text-slate-400 block pt-1">
              Last check: {patient.last_visit}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              Assigned Healthcare Worker
            </span>
            <p className="text-slate-800 font-semibold text-sm">
              {patient.assigned_worker} (ASHA)
            </p>
            <span className="text-slate-400 block pt-1">
              Cluster: Cholapur Health Network
            </span>
          </div>
        </div>

        {/* ASHA Clinical Visit Notes */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {language === 'hi' ? 'आशा कार्यकर्ता गृह-भ्रमण टिप्पणियां (Visit Notes):' : 'ASHA Worker Visit Notes & Action Plan:'}
            </label>
            {saved && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'hi' ? 'टिप्पणी सहेजें' : 'Save Notes'}</span>
            </button>
          </div>
        </div>
      </div>

      <MedicalSafetyNotice />
    </div>
  );
};

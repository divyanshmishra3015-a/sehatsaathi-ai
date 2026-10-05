import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Activity,
  Calendar,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Printer
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const HealthHistory: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();

  const [history] = useState([
    {
      id: 'SSA-20261005-44C9D3',
      date: '2026-10-05 14:30',
      urgency: 'RED',
      symptoms: ['Chest Pain', 'Shortness of Breath'],
      summary: 'Urgent escalation: Severe chest pain with SpO2 91%. Dialed 108 ambulance immediately.',
      facility: 'District Hospital Trauma ICU'
    },
    {
      id: 'SSA-20261004-98A1B2',
      date: '2026-10-04 10:15',
      urgency: 'YELLOW',
      symptoms: ['Fever (101°F)', 'Fatigue'],
      summary: 'ANC 3rd Trimester patient with moderate fever lasting 2 days. Consulted PHC Cholapur.',
      facility: 'PHC Cholapur'
    },
    {
      id: 'SSA-20261001-11E2F5',
      date: '2026-10-01 16:40',
      urgency: 'GREEN',
      symptoms: ['Mild Seasonal Cough'],
      summary: 'Mild dry cough without respiratory distress. Supportive home care, warm fluids, hydration.',
      facility: 'Home Monitoring'
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {language === 'hi' ? 'स्वास्थ्य इतिहास एवं पूर्व जांच' : 'Health History & Past Assessments'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'आपके द्वारा किए गए पूर्व ट्राइएज परीक्षण और परामर्श' : 'Chronological log of symptom assessments and triage evaluations'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
        >
          <Printer className="w-4 h-4" />
          <span>{language === 'hi' ? 'प्रिंट करें' : 'Print History'}</span>
        </button>
      </div>

      <div className="printable-area space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border-2 transition ${
              item.urgency === 'RED'
                ? 'bg-rose-50/70 border-rose-300'
                : item.urgency === 'YELLOW'
                ? 'bg-amber-50/70 border-amber-300'
                : 'bg-emerald-50/70 border-emerald-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.urgency === 'RED'
                      ? 'bg-rose-600 text-white'
                      : item.urgency === 'YELLOW'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {item.urgency}
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">{item.id}</span>
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {item.date}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {item.symptoms.map((s, i) => (
                  <span key={i} className="text-xs font-bold px-2 py-0.5 rounded-md bg-white text-slate-800 shadow-2xs">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {item.summary}
              </p>
              <div className="text-xs text-slate-500 pt-1">
                <strong>Facility:</strong> {item.facility}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MedicalSafetyNotice />
    </div>
  );
};

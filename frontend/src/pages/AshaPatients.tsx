import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Patient } from '../types';
import {
  Users,
  Search,
  ChevronRight,
  PhoneCall,
  Activity,
  ArrowLeft,
  Calendar,
  FileText
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const AshaPatients: React.FC = () => {
  const { language } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPatients(search)
      .then(setPatients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/worker/dashboard"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {language === 'hi' ? 'ग्रामीण नागरिक स्वास्थ्य पंजी' : 'Village Citizen Health Registry'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'सहमति प्राप्त पंजीकृत ग्रामीण मरीजों का रिकॉर्ड' : 'Comprehensive list of registered patients and visits'}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'hi' ? 'मरीज का नाम या गाँव खोजें...' : 'Search patient by name or village...'}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-2xs"
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {patients.map((p) => (
            <div key={p.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                  <span className="text-xs text-slate-400">({p.age} Y / {p.gender})</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.triage_status === 'RED'
                        ? 'bg-rose-100 text-rose-800'
                        : p.triage_status === 'YELLOW'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {p.triage_status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {p.category} • Village: {p.village}
                </div>
                <p className="text-xs text-slate-500">
                  <strong className="text-slate-600">Reported issues:</strong> {p.symptoms}
                </p>
                <div className="text-[11px] text-slate-400 font-mono">
                  ABHA ID: {p.abha_id} | Last Check: {p.last_visit}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href={`tel:${p.phone}`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Call"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
                <Link
                  to={`/worker/patients/${p.id}`}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <span>{language === 'hi' ? 'मरीज प्रोफाइल' : 'View Record'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MedicalSafetyNotice />
    </div>
  );
};

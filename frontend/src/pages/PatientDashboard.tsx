import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Mic,
  FileText,
  Hospital,
  Bell,
  Clock,
  ChevronRight,
  ShieldAlert,
  PhoneCall,
  User,
  Heart,
  AlertCircle
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';
import { api } from '../services/api';
import { Reminder } from '../types';

export const PatientDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);

  useEffect(() => {
    api.getReminders()
      .then((data) => setReminders(data.slice(0, 3)))
      .catch(() => {
        // Fallback default
        setReminders([
          {
            id: 'rem_01',
            patient_id: 'pat_01',
            patient_name: 'Sunita Devi',
            title: '3rd Trimester ANC Checkup & Hb Re-test',
            title_hi: 'तीसरी तिमाही एएनसी जांच एवं हीमोग्लोबिन टेस्ट',
            due_date: '2026-10-07',
            type: 'Maternal Visit',
            facility: 'PHC Cholapur',
            completed: false,
            urgency: 'high'
          }
        ]);
      })
      .finally(() => setLoadingReminders(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
                {language === 'hi' ? 'नागरिक स्वास्थ्य प्रोफाइल' : 'Patient Portal'}
              </span>
              <span className="text-xs text-teal-200">
                ABHA ID: {currentUser?.abha_id || '91-2345-6789-0123'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t('welcome_patient')}, {currentUser?.name || 'Sunita Devi'}!
            </h1>
            <p className="text-teal-100 text-sm">
              {language === 'hi'
                ? 'गाँव: चोलापुर | प्राथमिक स्वास्थ्य केंद्र: पीएचसी चोलापुर | आशा दीदी: राधा मौर्या'
                : 'Village: Cholapur | Assigned PHC: PHC Cholapur | Local ASHA: Radha Maurya'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/patient/assistant"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-sm shadow hover:bg-teal-50 transition"
            >
              <Mic className="w-4 h-4 text-teal-600" />
              <span>{language === 'hi' ? 'बोलकर पूछें' : 'Speak to Saathi'}</span>
            </Link>
            <a
              href="tel:108"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow transition"
              title="Call 108 Emergency Ambulance"
            >
              <PhoneCall className="w-4 h-4" />
              <span>108</span>
            </a>
          </div>
        </div>
      </div>

      {/* Primary Actions Grid (Big Touch Cards for Low Digital Literacy) */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-teal-600" />
          <span>{language === 'hi' ? 'त्वरित स्वास्थ्य सेवाएं' : 'Key Health Actions'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Start Triage Assessment */}
          <Link
            to="/patient/assessment"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('card_triage_title')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('card_triage_desc')}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-emerald-700 font-semibold text-xs pt-2 border-t border-slate-100">
              <span>{language === 'hi' ? 'जांच शुरू करें' : 'Start Check'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 2: Voice Chatbot */}
          <Link
            to="/patient/assistant"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('card_chat_title')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('card_chat_desc')}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-teal-700 font-semibold text-xs pt-2 border-t border-slate-100">
              <span>{language === 'hi' ? 'बातचीत करें' : 'Talk Now'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 3: Lab Report Explainer */}
          <Link
            to="/patient/reports"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('card_report_title')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('card_report_desc')}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-blue-700 font-semibold text-xs pt-2 border-t border-slate-100">
              <span>{language === 'hi' ? 'रिपोर्ट समझें' : 'Explain Lab'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 4: Find Facilities */}
          <Link
            to="/facilities"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Hospital className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('card_facility_title')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('card_facility_desc')}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-purple-700 font-semibold text-xs pt-2 border-t border-slate-100">
              <span>{language === 'hi' ? 'अस्पताल खोजें' : 'Locate Centers'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Reminders & Emergency Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reminders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-lg">
                {language === 'hi' ? 'आगामी फॉलो-अप एवं जांच स्मरण' : 'Upcoming Follow-ups & Reminders'}
              </h3>
            </div>
            <Link
              to="/patient/reminders"
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              {language === 'hi' ? 'सभी देखें' : 'View All'}
            </Link>
          </div>

          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rem.urgency === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rem.type}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {rem.due_date}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {language === 'hi' ? rem.title_hi : rem.title}
                  </h4>
                  <p className="text-xs text-slate-500">{rem.facility}</p>
                </div>

                <Link
                  to="/patient/reminders"
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition"
                >
                  {language === 'hi' ? 'विवरण' : 'Details'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Emergency & ASHA Contact */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-base">
              {language === 'hi' ? 'आपातकालीन सहायता' : 'Emergency Assistance'}
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'यदि मरीज को छाती में तेज दर्द, सांस लेने में अत्यधिक तकलीफ या बेहोशी हो, तो तुरंत संपर्क करें:'
              : 'If experiencing sudden severe chest pain, breathing difficulty, or unconsciousness, call immediately:'}
          </p>

          <div className="space-y-2">
            <a
              href="tel:108"
              className="flex items-center justify-between p-3 rounded-xl bg-rose-600/30 border border-rose-500/40 hover:bg-rose-600/40 transition"
            >
              <div>
                <div className="text-xs text-rose-200 font-medium">
                  {language === 'hi' ? 'सरकारी एम्बुलेंस' : 'Free Ambulance'}
                </div>
                <div className="font-extrabold text-lg text-rose-100">108</div>
              </div>
              <PhoneCall className="w-5 h-5 text-rose-300" />
            </a>

            <a
              href="tel:104"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700/60 transition"
            >
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  {language === 'hi' ? 'राष्ट्रीय स्वास्थ्य सलाह' : 'Health Advice Line'}
                </div>
                <div className="font-extrabold text-lg text-teal-300">104</div>
              </div>
              <PhoneCall className="w-5 h-5 text-teal-300" />
            </a>
          </div>

          <div className="pt-2 border-t border-slate-700">
            <div className="text-xs text-slate-400">
              {language === 'hi' ? 'आपकी अधिकृत आशा कार्यकर्ता:' : 'Assigned Village ASHA:'}
            </div>
            <div className="font-bold text-sm text-teal-200 mt-0.5">
              राधा मौर्या (Radha Maurya)
            </div>
            <div className="text-xs text-slate-400">+91 94150 11223</div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <MedicalSafetyNotice />
    </div>
  );
};

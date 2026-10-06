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
  QrCode,
  Pill,
  Sparkles,
  CheckCircle2,
  Copy,
  Printer
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';
import { api } from '../services/api';
import { Reminder } from '../types';

export const PatientDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAbhaCard, setShowAbhaCard] = useState(false);
  const [copiedAbha, setCopiedAbha] = useState(false);

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
            due_date: '2026-10-08',
            type: 'Maternal Visit',
            facility: 'PHC Cholapur',
            completed: false,
            urgency: 'high'
          }
        ]);
      });
  }, []);

  const copyAbhaId = () => {
    navigator.clipboard?.writeText(currentUser?.abha_id || '91-2345-6789-0123');
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-emerald-100">
                {language === 'hi' ? 'नागरिक स्वास्थ्य सेतु' : 'Citizen Health Portal'}
              </span>
              <button
                onClick={() => setShowAbhaCard(!showAbhaCard)}
                className="text-xs bg-emerald-700/80 hover:bg-emerald-600 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border border-emerald-500/40 cursor-pointer"
              >
                <QrCode className="w-3 h-3 text-amber-300" />
                <span>ABHA: {currentUser?.abha_id || '91-2345-6789-0123'}</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('welcome_patient')}, {currentUser?.name || 'Sunita Devi'}!
            </h1>
            <p className="text-emerald-100/90 text-sm">
              {language === 'hi'
                ? 'गाँव: चोलापुर (वाराणसी) • प्राथमिक स्वास्थ्य केंद्र: पीएचसी चोलापुर • आशा दीदी: राधा मौर्या'
                : 'Village: Cholapur (Varanasi) • Assigned PHC: PHC Cholapur • Local ASHA: Radha Maurya'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowAbhaCard(!showAbhaCard)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs shadow-md transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{language === 'hi' ? 'आभा कार्ड' : 'ABHA Card'}</span>
            </button>
            <Link
              to="/patient/assistant"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow hover:bg-emerald-50 transition"
            >
              <Mic className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'बोलकर पूछें' : 'Speak to Setu AI'}</span>
            </Link>
            <a
              href="tel:108"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow transition"
              title="Call 108 Emergency Ambulance"
            >
              <PhoneCall className="w-4 h-4" />
              <span>108</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Digital ABHA Card Studio (Show/Hide) */}
      {showAbhaCard && (
        <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white border-2 border-emerald-400/30 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-base sm:text-lg text-emerald-200">
                {language === 'hi' ? 'राष्ट्रीय डिजिटल स्वास्थ्य मिशन • आभा स्वास्थ्य कार्ड' : 'Ayushman Bharat Digital Mission (ABHA) Card'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyAbhaId}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1 text-emerald-200 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedAbha ? 'Copied!' : 'Copy ID'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="space-y-1">
              <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-semibold">Citizen Name</div>
              <div className="text-xl font-black text-white">{currentUser?.name || 'Sunita Devi'}</div>
              <div className="text-xs text-slate-300">Gender: Female | Age: 26 | Blood: B+</div>
              <div className="text-xs text-slate-400">Village: Cholapur, Varanasi (UP)</div>
            </div>

            <div className="space-y-1 text-center md:text-left">
              <div className="text-[11px] text-amber-300 uppercase tracking-wider font-semibold">14-Digit ABHA ID</div>
              <div className="text-2xl font-mono font-black text-amber-400 tracking-wider">
                {currentUser?.abha_id || '91-2345-6789-0123'}
              </div>
              <div className="text-[11px] text-emerald-300">Linked to e-Sanjeevani & PM-JAY ₹5L</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white text-slate-900 shadow-sm mx-auto md:ml-auto">
              <QrCode className="w-16 h-16 text-slate-900" />
              <div className="text-[9px] font-mono font-bold mt-1 text-slate-600">VERIFIED ABDM TOKEN</div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Actions Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-700" />
          <span>{language === 'hi' ? 'त्वरित स्वास्थ्य सेवाएं' : 'Key Health Actions'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Start Triage Assessment */}
          <Link
            to="/patient/assessment"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Activity className="w-6 h-6 text-emerald-700" />
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
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Mic className="w-6 h-6 text-teal-700" />
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
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <FileText className="w-6 h-6 text-blue-700" />
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
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Hospital className="w-6 h-6 text-purple-700" />
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

      {/* Two Column Section: Reminders & Emergency / Scheme Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reminders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-lg">
                {language === 'hi' ? 'आगामी फॉलो-अप एवं जांच स्मरण' : 'Upcoming Follow-ups & Reminders'}
              </h3>
            </div>
            <Link
              to="/patient/reminders"
              className="text-xs font-semibold text-emerald-700 hover:underline"
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
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition"
                >
                  {language === 'hi' ? 'विवरण' : 'Details'}
                </Link>
              </div>
            ))}
          </div>

          {/* PM Jan Aushadhi & Generic Savings Banner */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold">
                <Pill className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {language === 'hi' ? 'प्रधानमंत्री जन औषधि केंद्र बचत' : 'PM Jan Aushadhi Kendra Benefit'}
                </h4>
                <p className="text-xs text-slate-600">
                  {language === 'hi'
                    ? 'पीएचसी चोलापुर के पास जन औषधि केंद्र से 50% से 80% सस्ती जेनेरिक दवाएं प्राप्त करें।'
                    : 'Get quality generic medicines at 50% to 80% lower cost at verified Jan Aushadhi Kendras.'}
                </p>
              </div>
            </div>
            <Link
              to="/facilities"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition shrink-0 ml-2"
            >
              {language === 'hi' ? 'केंद्र खोजें' : 'Locate'}
            </Link>
          </div>
        </div>

        {/* Right Column: Emergency & ASHA Contact */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-base">
              {language === 'hi' ? 'आपातकालीन सहायता (Sanjeevani SOS)' : 'Emergency Assistance'}
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
                <div className="font-extrabold text-lg text-emerald-300">104</div>
              </div>
              <PhoneCall className="w-5 h-5 text-emerald-300" />
            </a>
          </div>

          <div className="pt-2 border-t border-slate-700">
            <div className="text-xs text-slate-400">
              {language === 'hi' ? 'आपकी अधिकृत आशा कार्यकर्ता:' : 'Assigned Village ASHA:'}
            </div>
            <div className="font-bold text-sm text-emerald-300 mt-0.5">
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

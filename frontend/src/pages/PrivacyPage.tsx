import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Lock, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const PrivacyPage: React.FC = () => {
  const { language } = useLanguage();
  const [deleted, setDeleted] = useState(false);

  const handleClearLocalStorage = () => {
    localStorage.removeItem('sehatsaathi_user');
    localStorage.removeItem('sehatsaathi_lang');
    setDeleted(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
            Data Governance & Ethics
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {language === 'hi' ? 'गोपनीयता नीति एवं डेटा सुरक्षा' : 'Privacy Policy & Patient Data Protection'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Digital Personal Data Protection (DPDP) Act alignment and ethical AI principles.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>{language === 'hi' ? '1. न्यूनतम डेटा संग्रह सिद्धांत' : '1. Minimum Data Collection Principle'}</span>
          </h2>
          <p>
            SehatSaathi AI collects only the clinical parameters strictly necessary to perform rule-based triage and generate a summary for your local ASHA worker. We do not sell, rent, or commercialize patient data under any circumstances.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>{language === 'hi' ? '2. सूचित सहमति (Informed Consent)' : '2. Informed Consent Requirement'}</span>
          </h2>
          <p>
            Health records entered through ASHA worker portals require affirmative informed consent. Citizens maintain the right to review their summary tokens and revoke health record linkage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-teal-600" />
            <span>{language === 'hi' ? '3. गोपनीयता एवं डि-आइडेंटिफिकेशन' : '3. De-identification in Analytics'}</span>
          </h2>
          <p>
            Public health administrators view strictly de-identified aggregate statistics (e.g. cluster-level fever trends or urgency distributions). Individual names, addresses, or raw lab report uploads are never exposed in administrative analytics dashboards.
          </p>
        </section>

        {/* Data Erasure Action */}
        <section className="pt-4 border-t border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-rose-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>{language === 'hi' ? '4. स्थानीय डेटा विलोपन (Right to Erasure)' : '4. Right to Erasure / Reset Demo Data'}</span>
          </h2>
          <p className="text-xs text-slate-500">
            You can clear all locally stored demo session data, cache, and preferences at any time.
          </p>

          <button
            onClick={handleClearLocalStorage}
            disabled={deleted}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs transition"
          >
            {deleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cleared successfully! Reloading...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'मेरा स्थानीय डेटा मिटाएं' : 'Delete Local Session Data'}</span>
              </>
            )}
          </button>
        </section>
      </div>

      <MedicalSafetyNotice />
    </div>
  );
};

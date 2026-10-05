import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TriageResult } from '../types';
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  HeartPulse,
  PhoneCall,
  Printer,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const SymptomTriage: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  // Form states
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState('adult');
  const [mainSymptoms, setMainSymptoms] = useState<string[]>(['fever']);
  const [durationDays, setDurationDays] = useState(2);
  const [severity, setSeverity] = useState('moderate');
  const [hasRedFlags, setHasRedFlags] = useState<string[]>([]);
  const [tempF, setTempF] = useState<string>('99.5');
  const [spo2, setSpo2] = useState<string>('97');

  // Evaluation states
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const toggleSymptom = (sym: string) => {
    setMainSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const toggleRedFlag = (rf: string) => {
    setHasRedFlags((prev) =>
      prev.includes(rf) ? prev.filter((r) => r !== rf) : [...prev, rf]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        patient_name: currentUser?.name || 'Sunita Devi',
        age_group: ageGroup,
        main_symptoms: mainSymptoms,
        duration_days: durationDays,
        severity: severity,
        has_red_flags: hasRedFlags,
        temperature_f: tempF ? parseFloat(tempF) : undefined,
        oxygen_saturation: spo2 ? parseInt(spo2) : undefined,
        language: language
      };

      const result = await api.submitTriage(payload);
      setTriageResult(result);
      setStep(4); // Results step
    } catch (err) {
      console.error('Triage failed', err);
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setTriageResult(null);
    setHasRedFlags([]);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              {language === 'hi' ? 'क्लीनिकल ट्राइएज' : 'Clinical Triage'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {language === 'hi' ? 'प्रोटोटाइप निर्णय सहायता' : 'Prototype Protocol'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t('triage_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('triage_disclaimer')}
          </p>
        </div>

        {/* Quick Demo Pre-sets for Hackathon Review */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAgeGroup('elderly');
              setMainSymptoms(['chest_pain', 'breathing']);
              setHasRedFlags(['chest_pain_severe']);
              setSeverity('severe');
              setSpo2('90');
              setStep(3);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100 transition"
            title="Load emergency scenario to test red-flag protocol"
          >
            🚨 {language === 'hi' ? 'रेड-फ्लैग डेमो (आपातकाल)' : 'Simulate RED Emergency'}
          </button>
        </div>
      </div>

      {/* Stepper Progress */}
      {step < 4 && (
        <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl">
          <div
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition ${
              step === 1 ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            1. {language === 'hi' ? 'मरीज व लक्षण' : 'Patient & Symptoms'}
          </div>
          <div
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition ${
              step === 2 ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            2. {language === 'hi' ? 'अवधि व गंभीरता' : 'Duration & Vitals'}
          </div>
          <div
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition ${
              step === 3 ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            3. {language === 'hi' ? 'खतरे के संकेत (Red Flags)' : 'Red Flags'}
          </div>
        </div>
      )}

      {/* Step 1: Patient Category & Main Symptoms */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              {t('age_group_label')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'infant', label: t('infant'), icon: '👶' },
                { key: 'child', label: t('child'), icon: '🧒' },
                { key: 'adult', label: t('adult'), icon: '🧑' },
                { key: 'elderly', label: t('elderly'), icon: '👴' },
                { key: 'pregnant', label: t('pregnant'), icon: '🤰' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setAgeGroup(item.key)}
                  className={`p-3.5 rounded-2xl text-left border text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    ageGroup === item.key
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              {language === 'hi' ? 'मुख्य लक्षण चुनें (एक से अधिक चुन सकते हैं):' : 'Select Main Symptoms (Select all that apply):'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'fever', hi: 'बुखार (Fever)', en: 'Fever' },
                { key: 'cough', hi: 'खांसी / जुकाम (Cough)', en: 'Cough / Cold' },
                { key: 'headache', hi: 'तेज सिरदर्द (Headache)', en: 'Headache' },
                { key: 'diarrhea', hi: 'दस्त / उल्टी (Diarrhea)', en: 'Diarrhea / Vomiting' },
                { key: 'abdominal_pain', hi: 'पेट दर्द (Abdominal pain)', en: 'Stomach pain' },
                { key: 'chest_pain', hi: 'छाती में दर्द (Chest pain)', en: 'Chest pain' },
                { key: 'breathing', hi: 'सांस में तकलीफ (Breathing difficulty)', en: 'Difficulty breathing' },
                { key: 'weakness', hi: 'अत्यधिक कमजोरी (Fatigue)', en: 'Severe weakness' },
                { key: 'rash', hi: 'त्वचा पर चकत्ते (Skin rash)', en: 'Skin rash' }
              ].map((sym) => {
                const selected = mainSymptoms.includes(sym.key);
                return (
                  <button
                    key={sym.key}
                    type="button"
                    onClick={() => toggleSymptom(sym.key)}
                    className={`p-3 rounded-xl text-left border text-xs sm:text-sm font-medium transition flex items-center justify-between ${
                      selected
                        ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{language === 'hi' ? sym.hi : sym.en}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow transition"
            >
              <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Duration, Severity & Vitals */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              {t('symptom_duration')} <span className="text-teal-700">{durationDays} दिन (Days)</span>
            </label>
            <input
              type="range"
              min="0"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>आज शुरू हुआ (Today)</span>
              <span>1 सप्ताह (7 days)</span>
              <span>2 सप्ताह (14+ days)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              {t('severity_label')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'mild', title: t('mild'), desc: language === 'hi' ? 'दैनिक कामकाज सामान्य रूप से संभव' : 'Can carry out normal daily routine' },
                { key: 'moderate', title: t('moderate'), desc: language === 'hi' ? 'थकान, बेचैनी या काम में रुकावट' : 'Interfering with daily tasks' },
                { key: 'severe', title: t('severe'), desc: language === 'hi' ? 'अत्यधिक कष्ट या बिस्तर से उठने में असमर्थ' : 'Incapacitating / severe pain' }
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSeverity(s.key)}
                  className={`p-4 rounded-2xl text-left border transition ${
                    severity === s.key
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-sm">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'बुखार / तापमान (°F)' : 'Body Temperature (°F)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={tempF}
                onChange={(e) => setTempF(e.target.value)}
                placeholder="e.g. 100.4"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'ऑक्सीजन स्तर (SpO2 %)' : 'Oxygen Saturation (SpO2 %)'}
              </label>
              <input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                placeholder="e.g. 98"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow transition"
            >
              <span>{language === 'hi' ? 'खतरे के संकेत जांचें' : 'Check Warning Signs'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Explicit Emergency Red Flags */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-rose-300 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-rose-950 text-base sm:text-lg">
                {t('red_flag_alert_title')}
              </h3>
              <p className="text-xs text-rose-700">
                {language === 'hi'
                  ? 'यदि कोई भी लक्षण है, तो प्रणाली तुरंत आपातकालीन 108 अस्पताल जाने का निर्देश देगी।'
                  : 'Selecting any warning sign triggers immediate emergency triage instructions.'}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              {
                key: 'chest_pain_severe',
                hi: 'छाती में अत्यधिक तेज दबाव/दर्द जो बांह, गर्दन या जबड़े तक फैल रहा हो',
                en: 'Severe crushing chest pain/pressure spreading to arm, neck or jaw'
              },
              {
                key: 'difficulty_breathing',
                hi: 'सांस लेने में भारी कठिनाई, हांफना या होठों/नाखूनों का नीला पड़ना',
                en: 'Severe shortness of breath, gasping, or blue lips/nails'
              },
              {
                key: 'unconscious_altered',
                hi: 'बेहोशी, अचानक भ्रम, चक्कर खाकर गिरना या जगाने में असमर्थता',
                en: 'Loss of consciousness, sudden confusion, or inability to awaken'
              },
              {
                key: 'stroke_signs',
                hi: 'शरीर के एक हिस्से में अचानक कमजोरी, चेहरे का टेढ़ा होना या बोली लड़खड़ाना',
                en: 'Sudden weakness on one side of body, facial droop, or slurred speech'
              },
              {
                key: 'severe_bleeding',
                hi: 'अनियंत्रित खून बहना या उल्टी/खांसी में अधिक मात्रा में खून निकलना',
                en: 'Uncontrolled bleeding or large volume blood in vomit/cough'
              },
              {
                key: 'snake_insect_bite',
                hi: 'सांप या जहरीले कीड़े का काटना, अथवा विषैले पदार्थ का सेवन',
                en: 'Suspected snake/scorpion bite, or toxic poison ingestion'
              }
            ].map((rf) => {
              const checked = hasRedFlags.includes(rf.key);
              return (
                <label
                  key={rf.key}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    checked
                      ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRedFlag(rf.key)}
                    className="w-5 h-5 rounded-md mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs sm:text-sm leading-relaxed">
                    {language === 'hi' ? rf.hi : rf.en}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'मूल्यांकन जारी है...' : t('btn_submit_triage')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Triage Results Display (RED, YELLOW, or GREEN) */}
      {step === 4 && triageResult && (
        <div className="printable-area space-y-6">
          {/* Urgency Result Card */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border-2 shadow-md ${
              triageResult.urgency === 'RED'
                ? 'bg-rose-50 border-rose-500 text-rose-950'
                : triageResult.urgency === 'YELLOW'
                ? 'bg-amber-50 border-amber-500 text-amber-950'
                : 'bg-emerald-50 border-emerald-500 text-emerald-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                    triageResult.urgency === 'RED'
                      ? 'bg-rose-600 animate-pulse'
                      : triageResult.urgency === 'YELLOW'
                      ? 'bg-amber-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  {triageResult.urgency === 'RED' ? (
                    <ShieldAlert className="w-8 h-8" />
                  ) : triageResult.urgency === 'YELLOW' ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider">
                    {language === 'hi'
                      ? triageResult.urgency_label_hi
                      : triageResult.urgency_label_en}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight mt-0.5">
                    {language === 'hi'
                      ? triageResult.headline_hi
                      : triageResult.headline_en}
                  </h2>
                </div>
              </div>

              {/* Emergency Call Action if RED */}
              {triageResult.urgency === 'RED' && (
                <a
                  href="tel:108"
                  className="no-print inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 transition animate-bounce"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>{language === 'hi' ? 'तुरंत 108 एम्बुलेंस बुलाएं' : 'Call 108 Ambulance'}</span>
                </a>
              )}
            </div>

            {/* Recommendation Paragraph */}
            <div className="mt-4 text-sm sm:text-base leading-relaxed font-medium">
              {language === 'hi'
                ? triageResult.recommendation_hi
                : triageResult.recommendation_en}
            </div>

            {/* Reasons for recommendation */}
            <div className="mt-5 pt-4 border-t border-black/10">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2">
                {language === 'hi' ? 'मूल्यांकन के मुख्य कारण:' : 'Reasons for this triage determination:'}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                {(language === 'hi' ? triageResult.reasoning_hi : triageResult.reasoning_en).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Immediate Actions */}
            <div className="mt-5 pt-4 border-t border-black/10">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2">
                {language === 'hi' ? 'तुरंत करने योग्य कदम (Immediate Actions):' : 'Immediate Recommended Actions:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(language === 'hi' ? triageResult.immediate_actions_hi : triageResult.immediate_actions_en).map((action, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Printable Patient Slip for ASHA Worker or PHC */}
          <div className="bg-white rounded-3xl p-6 border border-slate-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {language === 'hi' ? 'आशा कार्यकर्ता एवं पीएचसी हेतु मरीज पर्ची' : 'Patient Clinical Summary Slip for ASHA / PHC'}
                </h3>
                <p className="text-xs text-slate-500">
                  Token: {triageResult.patient_summary_for_asha.token} | {triageResult.patient_summary_for_asha.date}
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'hi' ? 'प्रिंट / डाउनलोड करें' : 'Print Slip'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-500 block">Patient Name</span>
                <span className="font-bold text-slate-900">{triageResult.patient_summary_for_asha.patient_name}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-500 block">Category</span>
                <span className="font-bold text-slate-900 capitalize">{triageResult.patient_summary_for_asha.age_group}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-500 block">Reported Vitals</span>
                <span className="font-bold text-slate-900">
                  {triageResult.patient_summary_for_asha.vital_temp} / SpO2 {triageResult.patient_summary_for_asha.vital_spo2}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-500 block">Recommended Facility</span>
                <span className="font-bold text-teal-800">{triageResult.patient_summary_for_asha.recommended_facility}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <span className="text-slate-500 font-bold block">ASHA Action Recommendation:</span>
              <p className="text-slate-800 font-medium">
                {triageResult.patient_summary_for_asha.asha_action_notes}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="no-print flex items-center justify-between">
            <button
              onClick={resetAssessment}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'hi' ? 'नया परीक्षण शुरू करें' : 'Start New Assessment'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <MedicalSafetyNotice />
    </div>
  );
};

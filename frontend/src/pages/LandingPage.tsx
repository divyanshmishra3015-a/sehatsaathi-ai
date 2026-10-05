import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Mic,
  Activity,
  FileText,
  Hospital,
  ShieldCheck,
  Users,
  ArrowRight,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Stethoscope,
  Volume2
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const LandingPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-50 pb-20 md:pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Decorative backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-200/30 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{t('hero_badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {language === 'hi' ? (
              <>
                बोलकर अपनी भाषा में पाएं <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700">
                  सटीक स्वास्थ्य सहायता
                </span>
              </>
            ) : (
              <>
                Voice-First AI Healthcare <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700">
                  In Your Own Language
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/patient/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg shadow-teal-600/25 transition active:scale-98"
            >
              <Activity className="w-5 h-5" />
              <span>{t('btn_start_triage')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/patient/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition active:scale-98"
            >
              <Mic className="w-5 h-5 text-teal-600" />
              <span>{t('btn_talk_saathi')}</span>
              <Volume2 className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Quick Stats or Highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-teal-700 font-bold text-lg">100% Voice</div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'बोलकर पूछें व सुनें' : 'Speech-to-Speech'}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-emerald-700 font-bold text-lg">RED / GREEN</div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'सुरक्षित ट्राइएज प्रोटोकॉल' : 'Clinical Triage Engine'}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-blue-700 font-bold text-lg">PHC / CHC</div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'नजदीकी अस्पताल खोज' : 'Verified Facilities'}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-purple-700 font-bold text-lg">ASHA Desk</div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'कार्यकर्ता समन्वय' : 'Rural Health Worker'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'hi' ? 'ग्रामीण भारत के लिए तैयार की गई प्रमुख सुविधाएं' : 'Key Capabilities Tailored for Rural Healthcare'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {language === 'hi' ? 'डिजिटल साक्षरता की सीमा पार कर, सरल आवाज और संकेतों द्वारा स्वास्थ्य सेवा' : 'Overcoming literacy barriers through voice, local languages, and clinician-reviewed triage.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Voice-First AI Saathi */}
          <Link
            to="/patient/assistant"
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'hi' ? 'आवाज से संचालित स्वास्थ्य साथी (Voice AI)' : 'Voice-First AI Health Saathi'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'टाइप करने की जरूरत नहीं! बस माइक दबाकर हिंदी में बताएं, जैसे: "मुझे दो दिन से बुखार और कमजोरी है।" साथी समझकर आवाज में उत्तर देगा।'
                  : 'Low digital literacy friendly. Speak naturally in Hindi or English to describe symptoms, with read-aloud spoken audio replies.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-teal-700 font-semibold text-sm group-hover:translate-x-1 transition">
              <span>{language === 'hi' ? 'बातचीत शुरू करें' : 'Try Voice Assistant'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 2: Symptom Assessment & Triage */}
          <Link
            to="/patient/assessment"
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'hi' ? 'क्लीनिकल लक्षण ट्राइएज (RED / YELLOW / GREEN)' : 'Rule-Based Clinical Triage Engine'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'कठोर रेड-फ्लैग स्क्रीनिंग! छाती में तेज दर्द, सांस फूलने पर तुरंत 108 एम्बुलेंस और नजदीकी अस्पताल की सलाह मिलती है।'
                  : 'Screen for life-threatening red flags first. Classify into RED (Urgent 108 emergency), YELLOW (Consult PHC/ASHA), or GREEN (Self-care).'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-emerald-700 font-semibold text-sm group-hover:translate-x-1 transition">
              <span>{language === 'hi' ? 'जांच शुरू करें' : 'Start Triage'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 3: Medical Report Explainer */}
          <Link
            to="/patient/reports"
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'hi' ? 'जांच रिपोर्ट का सरल अर्थ (Report Explainer)' : 'Medical Report Explainer'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'सीबीसी, हीमोग्लोबिन, ब्लड शुगर की जांच रिपोर्ट अपलोड करें। कौन सा स्तर कम या ज्यादा है, सरल शब्दों में समझें।'
                  : 'Upload lab scans or choose built-in CBC and diabetic panels. Highlights out-of-range biomarkers and explains in simple Hindi/English.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-blue-700 font-semibold text-sm group-hover:translate-x-1 transition">
              <span>{language === 'hi' ? 'रिपोर्ट समझें' : 'Explain Lab Reports'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 4: Facilities Finder */}
          <Link
            to="/facilities"
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Hospital className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'hi' ? 'नजदीकी अस्पताल एवं पीएचसी खोजें' : 'Nearby Healthcare Facilities'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'अपने जिले, ब्लॉक या पिनकोड से प्राथमिक स्वास्थ्य केंद्र (PHC), सीएचसी और जिला अस्पताल की दूरी और रास्ता देखें।'
                  : 'Interactive OpenStreetMap finder for rural PHCs, CHCs, Ayushman Arogya Mandirs, and District Hospitals.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-teal-700 font-semibold text-sm group-hover:translate-x-1 transition">
              <span>{language === 'hi' ? 'अस्पताल खोजें' : 'Locate Centers'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 5: ASHA Worker Portal */}
          <Link
            to="/worker/dashboard"
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'hi' ? 'आशा कार्यकर्ता डेस्क (ASHA Desk)' : 'ASHA Worker & Field Dashboard'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'गांव के नागरिकों का पंजीकरण, आपातकालीन ट्राइएज समीक्षा, फॉलो-अप रिमाइंडर और गृह भ्रमण (Home visits) का रिकॉर्ड।'
                  : 'Role-based tools for ASHA workers to register patients, review prioritized triage queues, and manage immunization/ANC visits.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-purple-700 font-semibold text-sm group-hover:translate-x-1 transition">
              <span>{language === 'hi' ? 'आशा पोर्टल खोलें' : 'Open ASHA Desk'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Card 6: Follow-up & Medicine Reminders */}
          <Link
            to="/patient/reminders"
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-amber-300 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'hi' ? 'दवा एवं जांच स्मरण (Reminders)' : 'Follow-ups & Medicine Reminders'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'टीकाकरण, गर्भवती महिलाओं की एएनसी जांच और बीपी/शुगर की अगली जांच तारीख याद रखने का इन-ऐप रिमाइंडर।'
                  : 'Manage upcoming follow-up consultations, ANC checkups, and chronic disease test reminders easily.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-amber-700 font-semibold text-sm group-hover:translate-x-1 transition">
              <span>{language === 'hi' ? 'रिमाइंडर देखें' : 'View Reminders'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'hi' ? 'सेहतसाथी कैसे काम करता है?' : 'How SehatSaathi AI Works'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {language === 'hi' ? '3 सरल चरणों में सही स्वास्थ्य मार्गदर्शन' : 'Simple 3-step navigation for citizens and health volunteers'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">
                {language === 'hi' ? 'बोलकर या लिखकर बताएं' : 'Speak or Type Symptoms'}
              </h4>
              <p className="text-sm text-slate-600">
                {language === 'hi'
                  ? 'अपनी भाषा (हिंदी/अंग्रेजी) में बीमारी के लक्षण, अवधि और परेशानी बताएं।'
                  : 'Speak using the microphone or type symptoms in conversational Hindi or English.'}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">
                {language === 'hi' ? 'सुरक्षित ट्राइएज मूल्यांकन' : 'Conservative Clinical Triage'}
              </h4>
              <p className="text-sm text-slate-600">
                {language === 'hi'
                  ? 'सिस्टम जीवन-रक्षक रेड-फ्लैग की जांच करता है और सुरक्षित स्तर (RED, YELLOW, GREEN) तय करता है।'
                  : 'The system screens red flags first, recommending urgent 108 hospital visits or doctor consultation.'}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">
                {language === 'hi' ? 'आशा या डॉक्टर से समन्वय' : 'Connect with ASHA or PHC'}
              </h4>
              <p className="text-sm text-slate-600">
                {language === 'hi'
                  ? 'मरीज का संक्षिप्त पर्चा (Slip) तैयार होता है जिसे आशा कार्यकर्ता या पीएचसी डॉक्टर को दिखाया जा सकता है।'
                  : 'A concise summary token is generated for the local ASHA worker or PHC medical officer.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice & Medical Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <MedicalSafetyNotice />
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-slate-800">SehatSaathi AI</span>
            <span>— {t('tagline')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-teal-700 transition">
              {t('nav_privacy')}
            </Link>
            <Link to="/help" className="hover:text-teal-700 transition">
              {t('nav_help')}
            </Link>
            <a href="tel:108" className="text-rose-600 font-bold hover:underline">
              {language === 'hi' ? 'एम्बुलेंस: 108' : 'Ambulance: 108'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

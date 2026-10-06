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
  Volume2,
  QrCode,
  Pill,
  Award,
  Clock,
  Compass
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const LandingPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 pb-20 md:pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Decorative backdrop aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-200/30 via-teal-200/30 to-amber-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-700 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t('hero_badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            {language === 'hi' ? (
              <>
                जन-जन तक स्वास्थ्य का <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900">
                  डिजिटल व सशक्त सेतु
                </span>
              </>
            ) : (
              <>
                Bridging Bharat to <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900">
                  Intelligent Healthcare
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            {t('hero_subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/patient/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-base shadow-lg shadow-emerald-700/25 transition active:scale-98"
            >
              <Activity className="w-5 h-5 text-emerald-200" />
              <span>{t('btn_start_triage')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/patient/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition active:scale-98"
            >
              <Mic className="w-5 h-5 text-emerald-700" />
              <span>{t('btn_talk_saathi')}</span>
              <Volume2 className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition">
              <div className="text-emerald-800 font-black text-lg">100% Vernacular</div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'हिंदी व अंग्रेजी में वॉइस AI' : 'Voice Speech AI'}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition">
              <div className="text-rose-700 font-black text-lg">RED / GREEN</div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'सुरक्षित क्लीनिकल ट्राइएज' : 'Clinical Triage Engine'}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition">
              <div className="text-blue-700 font-black text-lg">PHC / CHC</div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'सरकारी अस्पताल खोज' : 'Verified Facilities'}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition">
              <div className="text-amber-700 font-black text-lg">ABDM / ASHA</div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'आभा कार्ड व आशा पोर्टल' : 'Digital Health & ASHA'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated Portals Showcase (The "Setu" Architecture) */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            {language === 'hi' ? 'तीन-स्तरीय स्वास्थ्य सेतु' : 'Three Unified Portals'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'hi' ? 'नागरिक, आशा और स्वास्थ्य अधिकारी का संगम' : 'Seamless Bridge for Citizens, Frontline & Officials'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {language === 'hi'
              ? 'एक ही प्लेटफॉर्म पर आम जनता, आशा कार्यकर्ता और जिला स्वास्थ्य विभाग की जरूरतें'
              : 'End-to-end healthcare ecosystem connecting grassroot citizens to district administration'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Portal 1: Citizen Care */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <HeartPulse className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'hi' ? 'नागरिक स्वास्थ्य सेतु' : 'Citizen Health Portal'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'अपनी बोली में बोलकर बीमारी की शुरुआती जांच करें, पैथोलॉजी रिपोर्ट का अर्थ समझें और 108 आपातकालीन एम्बुलेंस बुलाएं।'
                  : 'Speak symptoms in vernacular Hindi or English, decode complex pathology reports, and access 24x7 emergency helplines.'}
              </p>
              <ul className="text-xs text-slate-500 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'hi' ? 'माइक से बोलकर बातचीत' : 'Voice-First AI Conversations'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'hi' ? 'सीबीसी व शुगर रिपोर्ट विश्लेषण' : 'Biomarker Pathology Explainer'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'hi' ? 'डिजिटल आभा हेल्थ कार्ड' : 'Instant ABHA ID Card Generator'}</span>
                </li>
              </ul>
            </div>
            <Link
              to="/patient/dashboard"
              className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-sm transition"
            >
              <span>{language === 'hi' ? 'नागरिक पोर्टल खोलें' : 'Open Citizen Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Portal 2: ASHA Worker Desk */}
          <div className="bg-white rounded-3xl p-6 border border-teal-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'hi' ? 'आशा सेतु (फील्ड साथी)' : 'ASHA Field Desk'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'गांव-गांव में गर्भवती माताओं (ANC), बच्चों के टीकाकरण और गंभीर मरीजों की डिजिटल सूची रखें, जो बिना इंटरनेट भी काम करे।'
                  : 'Digitized roster for high-risk antenatal care (ANC), infant immunizations, and community triage referrals.'}
              </p>
              <ul className="text-xs text-slate-500 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{language === 'hi' ? 'हाई-रिस्क गर्भावस्था ट्रैकर' : 'High-Risk Pregnancy Alerts'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{language === 'hi' ? 'टीकाकरण एवं फॉलो-अप रिमाइंडर' : 'Vaccine Schedule Reminders'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{language === 'hi' ? 'ऑफलाइन-सक्षम डेटा सिंक' : 'Offline-First Local Storage'}</span>
                </li>
              </ul>
            </div>
            <Link
              to="/worker/dashboard"
              className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-sm transition"
            >
              <span>{language === 'hi' ? 'आशा डेस्क खोलें' : 'Open ASHA Desk'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Portal 3: District Surveillance */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Users className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'hi' ? 'जिला स्वास्थ्य निगरानी (CMO)' : 'District Health Surveillance'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'मुख्य चिकित्सा अधिकारी (CMO) हेतु मौसमी बुखार के हॉटस्पॉट, प्राथमिक स्वास्थ्य केंद्रों में बेड उपलब्धता एवं सिंड्रोमिक रुझान।'
                  : 'Real-time syndromic outbreak monitoring, emergency escalations, and facility bed capacity for district health officers.'}
              </p>
              <ul className="text-xs text-slate-500 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{language === 'hi' ? 'मौसमी बुखार क्लस्टर ट्रैकिंग' : 'Fever & Infection Outbreak Trends'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{language === 'hi' ? 'पीएचसी/सीएचसी बेड क्षमता' : 'Bed & Resource Utilization'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{language === 'hi' ? 'गोपनीय समग्र आंकड़े' : 'De-identified Public Metrics'}</span>
                </li>
              </ul>
            </div>
            <Link
              to="/admin/dashboard"
              className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-sm transition"
            >
              <span>{language === 'hi' ? 'प्रशासनिक आंकड़े देखें' : 'View District Analytics'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'hi' ? 'जनस्वास्थ्य सेतु की प्रमुख विशेषताएं' : 'Core Capabilities of JanSwasthya Setu'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Voice AI */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'hi' ? 'बोलकर पूछें, आवाज में सुनें' : 'Voice-First vernacular AI'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'कम डिजिटल साक्षरता वाले नागरिकों के लिए सुविधाजनक। सिर्फ माइक दबाएं और हिंदी या अंग्रेजी में प्राकृतिक संवाद करें।'
                : 'Built for citizens with low digital literacy. Speak naturally in Hindi or English and listen to spoken advice.'}
            </p>
          </div>

          {/* 2. Clinical Triage */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'hi' ? 'सुरक्षित 3-स्तरीय ट्राइएज' : 'Conservative Clinical Triage'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'रेड (आपातकाल), येलो (24-48 घंटे में पीएचसी) और ग्रीन (घरेलू देखभाल)। जीवन-रक्षक रेड-फ्लैग तुरंत 108 रेफर करते हैं।'
                : 'Instant categorization into Emergency (Red), Urgent PHC Visit (Yellow), and Supportive Home Care (Green).'}
            </p>
          </div>

          {/* 3. Lab Reports */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'hi' ? 'पैथोलॉजी रिपोर्ट विश्लेषक' : 'Lab Report Explainer'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'सीबीसी (हीमोग्लोबिन/प्लेटलेट्स), फास्टिंग शुगर और लिपिड प्रोफाइल की तकनीकी रिपोर्ट को आसान भाषा और खान-पान में समझें।'
                : 'Translates complex biomarkers into plain words with actionable nutrition, dietary tips, and consultation warnings.'}
            </p>
          </div>

          {/* 4. Facility Finder */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <Hospital className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'hi' ? 'सत्यापित अस्पताल एवं दूरी' : 'Geo-Aware Health Facilities'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'आयुष्मान आरोग्य मंदिर, प्राथमिक स्वास्थ्य केंद्र और जिला अस्पताल की सटीक दूरी, उपलब्ध बेड और सीधे फोन नंबर।'
                : 'Interactive directory and map locating verified public facilities with bed status and direct emergency contacts.'}
            </p>
          </div>

          {/* 5. PM Jan Aushadhi & Generic Savings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-4">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'hi' ? 'जन औषधि व सरकारी योजनाएं' : 'Jan Aushadhi & PM-JAY Bridge'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'ब्रांडेड दवाओं की जगह 50-80% सस्ती जेनेरिक दवाओं की जानकारी और आयुष्मान भारत ₹5 लाख मुफ्त इलाज सहायता।'
                : 'Guides citizens to affordable generic medicines at Jan Aushadhi Kendras and PM-JAY cashless treatment benefits.'}
            </p>
          </div>

          {/* 6. Sanjeevani Emergency */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-700 mb-4">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'hi' ? 'संजीवनी 108 आपातकालीन बीकन' : 'Sanjeevani 108 Emergency SOS'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'एक क्लिक में लाइव जीपीएस लोकेशन के साथ एम्बुलेंस अलर्ट, 108/104 सीधी कॉल और आपातकालीन फर्स्ट-एड निर्देश।'
                : 'Instant one-tap ambulance dispatch with live GPS broadcast, offline first-aid cards, and 108/102/104 direct connect.'}
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'hi' ? 'जनस्वास्थ्य सेतु कैसे काम करता है?' : 'How JanSwasthya Setu Works'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {language === 'hi' ? '3 सरल चरणों में सही स्वास्थ्य मार्गदर्शन' : 'Simple 3-step navigation for citizens and health volunteers'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
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
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
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
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
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
            <HeartPulse className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-slate-800">JanSwasthya Setu AI</span>
            <span>— {t('tagline')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-emerald-700 transition">
              {t('nav_privacy')}
            </Link>
            <Link to="/help" className="hover:text-emerald-700 transition">
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

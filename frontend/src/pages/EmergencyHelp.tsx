import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  PhoneCall,
  HeartPulse,
  Flame,
  LifeBuoy,
  AlertTriangle,
  WifiOff,
  CheckCircle2
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const EmergencyHelp: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
            {language === 'hi' ? '24x7 आपातकालीन सहायता' : '24x7 Emergency Helplines'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {language === 'hi' ? 'आपातकालीन मदद एवं प्राथमिक उपचार' : 'Emergency Assistance & Offline First Aid'}
        </h1>
        <p className="text-rose-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
          {language === 'hi'
            ? 'यदि कोई व्यक्ति गंभीर रूप से बीमार या घायल है, तो तुरंत नीचे दिए गए निःशुल्क सरकारी आपातकालीन नंबरों पर कॉल करें।'
            : 'If someone is critically ill, unconscious, or injured, immediately call the free government emergency lines.'}
        </p>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            number: '108',
            title_hi: 'एम्बुलेंस सेवा (Ambulance)',
            title_en: 'Emergency Ambulance (108)',
            desc_hi: 'दुर्घटना, गंभीर प्रसव पीड़ा, दिल का दौरा, या बेहोशी में तुरंत बुलाएं।',
            desc_en: 'Immediate emergency transport for heart attack, trauma, labor, or critical illness.',
            bg: 'bg-rose-50 border-rose-300 text-rose-950',
            btn_bg: 'bg-rose-600 hover:bg-rose-700 text-white'
          },
          {
            number: '104',
            title_hi: 'राष्ट्रीय स्वास्थ्य हेल्पलाइन (Health Line)',
            title_en: 'National Health Advice (104)',
            desc_hi: 'डॉक्टर से निःशुल्क चिकित्सीय परामर्श और प्राथमिक मार्गदर्शन।',
            desc_en: 'Free telephonic medical consultation with registered medical professionals.',
            bg: 'bg-teal-50 border-teal-300 text-teal-950',
            btn_bg: 'bg-teal-700 hover:bg-teal-800 text-white'
          },
          {
            number: '102',
            title_hi: 'मातृ एवं शिशु वाहन सेवा (Mother & Child)',
            title_en: 'Mother & Infant Transport (102)',
            desc_hi: 'गर्भवती महिलाओं को प्रसव हेतु अस्पताल ले जाने के लिए निःशुल्क।',
            desc_en: 'Dedicated free transport service for institutional delivery and infants.',
            bg: 'bg-purple-50 border-purple-300 text-purple-950',
            btn_bg: 'bg-purple-700 hover:bg-purple-800 text-white'
          },
          {
            number: '112',
            title_hi: 'अखिल भारतीय आपातकालीन नंबर (All Emergency)',
            title_en: 'All-in-One Emergency (112)',
            desc_hi: 'पुलिस, अग्निशमन और चिकित्सा आपातकाल के लिए एकीकृत नंबर।',
            desc_en: 'Single emergency response support for police, fire, and medical crises.',
            bg: 'bg-slate-900 border-slate-800 text-white',
            btn_bg: 'bg-white text-slate-900 hover:bg-slate-100'
          }
        ].map((item, idx) => (
          <div key={idx} className={`p-5 rounded-3xl border-2 flex flex-col justify-between ${item.bg}`}>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base sm:text-lg">
                  {language === 'hi' ? item.title_hi : item.title_en}
                </h3>
                <span className="text-2xl font-extrabold">{item.number}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                {language === 'hi' ? item.desc_hi : item.desc_en}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10">
              <a
                href={`tel:${item.number}`}
                className={`inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition ${item.btn_bg}`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {item.number} Now</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Offline First-Aid Protocols */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <LifeBuoy className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'hi' ? 'ऑफलाइन आपातकालीन प्राथमिक उपचार (First Aid)' : 'Offline Critical First-Aid Protocols'}
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          These essential life-saving measures are permanently cached for rural situations with zero internet connectivity.
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-800">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🩸</span>
              <span>{language === 'hi' ? 'गंभीर रक्तस्राव (Severe Bleeding)' : 'Severe Bleeding'}</span>
            </h4>
            <p>
              {language === 'hi'
                ? 'साफ कपड़े या पट्टी से घाव पर लगातार सीधा दबाव (Direct Pressure) बनाएं रखें। पट्टी को हटाएं नहीं, उसके ऊपर और कपड़ा बांधें। घायल अंग को संभव हो तो दिल के स्तर से ऊपर उठाएं।'
                : 'Apply continuous firm direct pressure with clean cloth over the wound. Do not remove the first pad if soaked; add another layer on top. Elevate bleeding limb above heart level.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🐍</span>
              <span>{language === 'hi' ? 'सर्पदंश (Snake Bite)' : 'Suspected Snake Bite'}</span>
            </h4>
            <p>
              {language === 'hi'
                ? 'मरीज को शांत रखें और हिलने-डुलने न दें। घाव पर चीरा न लगाएं, मुंह से चूसें नहीं, और तंग धागा न बांधें। मरीज को तुरंत निकटतम CHC या जिला अस्पताल ले जाएं जहां एंटी-वेनम (Anti-venom) उपलब्ध हो।'
                : 'Keep the patient still and calm; immobilize the bitten limb below heart level. DO NOT cut, suck venom, or apply tight tourniquets. Transport immediately to the nearest CHC/District Hospital with anti-venom.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🔥</span>
              <span>{language === 'hi' ? 'जलना (Burns)' : 'Thermal Burns'}</span>
            </h4>
            <p>
              {language === 'hi'
                ? 'जले हुए स्थान पर तुरंत 15-20 मिनट तक सामान्य ठंडा नल का पानी डालें। बर्फ, टूथपेस्ट, तेल या घी कभी न लगाएं। फफोले (blisters) न फोड़ें।'
                : 'Immediately pour cool running tap water over the burn for 15-20 minutes. DO NOT apply ice, toothpaste, butter, or oil. Never pop blisters.'}
            </p>
          </div>
        </div>
      </div>

      <MedicalSafetyNotice />
    </div>
  );
};

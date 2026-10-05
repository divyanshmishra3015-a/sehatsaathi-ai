import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, PhoneCall, AlertTriangle } from 'lucide-react';

export const MedicalSafetyNotice: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 my-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-amber-950">
          <h4 className="font-bold flex items-center gap-2 text-amber-900">
            {language === 'hi' ? 'चिकित्सीय सुरक्षा एवं कानूनी अस्वीकरण (Medical Safety Notice)' : 'Medical Safety & Clinical Governance Notice'}
          </h4>
          <p className="leading-relaxed">
            {language === 'hi'
              ? 'सेहतसाथी AI केवल एक सूचनात्मक स्वास्थ्य सहायक और प्राथमिक स्क्रीनिंग (Triage) उपकरण है। यह किसी पंजीकृत डॉक्टर या चिकित्सा अधिकारी (Medical Officer) द्वारा किए जाने वाले वास्तविक निदान या उपचार का विकल्प नहीं है।'
              : 'SehatSaathi AI is an informational decision-support and conservative triage prototype. It does not provide definitive medical diagnoses or prescribe medications. Always consult a qualified physician or your local PHC medical team.'}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 font-semibold text-amber-900">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              {language === 'hi' ? 'रुढ़िवादी रेड-फ्लैग स्क्रीनिंग' : 'Conservative Red-Flag Protocol'}
            </span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-4 h-4 text-rose-700" />
              {language === 'hi' ? 'आपातकाल में तुरंत 108 पर कॉल करें' : 'Dial 108 Immediately in Emergencies'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

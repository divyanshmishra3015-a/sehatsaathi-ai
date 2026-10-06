import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  hi: {
    // Brand & Vision
    app_title: 'जनस्वास्थ्य सेतु AI',
    tagline: 'जन-जन तक स्वास्थ्य का डिजिटल सेतु',
    demo_mode_badge: 'राष्ट्रीय स्वास्थ्य नवाचार (JanSwasthya Intelligence)',
    medical_disclaimer_short: '⚠️ यह एक सूचनात्मक क्लीनिकल ट्राइएज एवं नेविगेशन प्रणाली है, अधिकृत चिकित्सक का विकल्प नहीं।',
    
    // Navigation
    nav_home: 'मुख्य पृष्ठ',
    nav_dashboard: 'नागरिक पोर्टल',
    nav_assistant: 'सेतु वॉइस AI',
    nav_assessment: 'लक्षण जांच (Triage)',
    nav_reports: 'जांच रिपोर्ट समझें',
    nav_facilities: 'स्वास्थ्य केंद्र खोजें',
    nav_history: 'स्वास्थ्य इतिहास',
    nav_reminders: 'दवा व जांच स्मरण',
    nav_asha_desk: 'आशा सेतु डेस्क',
    nav_admin: 'जिला स्वास्थ्य निगरानी',
    nav_privacy: 'गोपनीयता नीति',
    nav_help: 'संजीवनी आपातकाल',
    nav_login: 'लॉग इन',
    nav_logout: 'लॉग आउट',

    // Emergency Helplines
    emergency_title: 'राष्ट्रीय आपातकालीन स्वास्थ्य नंबर (24x7 निःशुल्क)',
    ambulance_108: '108 - आपातकालीन एम्बुलेंस',
    health_helpline_104: '104 - राष्ट्रीय स्वास्थ्य परामर्श',
    mother_child_102: '102 - जननी शिशु सुरक्षा वाहन',
    all_emergency_112: '112 - अखिल भारतीय आपातकालीन सेवा',

    // Hero Section
    hero_badge: 'डिजिटल भारत स्वास्थ्य मिशन • ग्रामीण एवं टियर-3/4 के लिए समर्पित',
    hero_title: 'बोलकर अपनी भाषा में पाएं सटीक स्वास्थ्य सहायता',
    hero_subtitle: 'आवाज से बीमारी के लक्षण बताएं, पैथोलॉजी रिपोर्ट का सरल अर्थ समझें, डिजिटल आभा कार्ड बनाएं और 1 क्लिक में नजदीकी सरकारी अस्पताल या आशा दीदी से जुड़ें।',
    btn_start_triage: 'लक्षण परीक्षण शुरू करें',
    btn_talk_saathi: 'सेतु वॉइस AI से बात करें',
    btn_find_hospital: 'नजदीकी अस्पताल खोजें',
    btn_upload_report: 'जांच रिपोर्ट समझें',

    // Patient Dashboard
    welcome_patient: 'नमस्ते',
    quick_health_status: 'आपकी वर्तमान स्वास्थ्य स्थिति',
    card_triage_title: 'लक्षण परीक्षण (Clinical Triage)',
    card_triage_desc: 'बुखार, दर्द, खांसी आदि का तुरंत 3-स्तरीय मूल्यांकन (लाल, पीला, हरा) प्राप्त करें।',
    card_chat_title: 'सेतु वॉइस AI से बोलकर पूछें',
    card_chat_desc: 'माइक दबाकर अपनी बोली में लक्षण बताएं और तुरंत ऑडियो व लिखित सलाह पाएं।',
    card_report_title: 'पैथोलॉजी रिपोर्ट का सरल अर्थ',
    card_report_desc: 'सीबीसी, शुगर, हीमोग्लोबिन और लिपिड रिपोर्ट का अर्थ आम बोलचाल में समझें।',
    card_facility_title: 'नजदीकी सरकारी स्वास्थ्य केंद्र',
    card_facility_desc: 'पीएचसी, सीएचसी और जिला अस्पताल की दूरी, बेड और संपर्क नंबर देखें।',

    // Triage flow
    triage_title: 'क्लीनिकल लक्षण जांच एवं सुरक्षित ट्राइएज',
    triage_disclaimer: 'यह प्रणाली जीवन-रक्षक प्रोटोकॉल का पालन करती है; किसी भी खतरे के संकेत पर तुरंत RED अलर्ट देती है।',
    age_group_label: 'मरीज की आयु वर्ग चुनें:',
    infant: 'शिशु (1 वर्ष से कम)',
    child: 'बच्चा (1 - 12 वर्ष)',
    adult: 'वयस्क (13 - 59 वर्ष)',
    elderly: 'बुजुर्ग (60 वर्ष या अधिक)',
    pregnant: 'गर्भवती महिला (विशेष मातृत्व देखभाल)',
    symptom_duration: 'लक्षण कितने दिनों से हैं?',
    severity_label: 'लक्षणों की तीव्रता (Severity):',
    mild: 'हल्का (दैनिक कार्य करने में सक्षम)',
    moderate: 'मध्यम (थकान, बेचैनी व दर्द)',
    severe: 'गंभीर (अत्यधिक कष्ट व कमजोरी)',
    red_flag_alert_title: 'क्या इनमें से कोई भी आपातकालीन खतरे का संकेत है? (Select Red Flags):',
    btn_submit_triage: 'परीक्षण परिणाम देखें',
    download_summary: 'आशा कार्यकर्ता / डॉक्टर हेतु पर्ची डाउनलोड करें',

    // Voice & Chat
    speak_prompt: 'माइक दबाएं और अपनी भाषा में बोलें...',
    listening_now: 'सुन रहे हैं... कृपया स्पष्ट बोलिए',
    stop_recording: 'रोकें',
    send_message: 'भेजें',
    type_message_placeholder: 'जैसे: मुझे दो दिन से तेज बुखार और ठंड लग रही है...',
    read_aloud: 'आवाज में सुनें',
    stop_reading: 'आवाज बंद करें',

    // Reports
    report_explainer_title: 'मेडिकल रिपोर्ट विश्लेषक (Report Explainer)',
    report_explainer_desc: 'अपनी पैथोलॉजी रिपोर्ट चुनें या फोटो/पीडीएफ अपलोड करें। कठिन मेडिकल शब्दों का सरल हिंदी में अर्थ और आहार सलाह समझें।',
    choose_sample_report: 'नमूना रिपोर्ट से तुरंत जांचें:',
    upload_own_report: 'अपनी रिपोर्ट अपलोड करें (PDF / Image)',
    extracted_biomarkers: 'पहचाने गए बायोमार्कर और जांच परिणाम:',
    status_normal: 'सामान्य (Normal)',
    status_high: 'अधिक (High)',
    status_low: 'कम (Low)',

    // Facilities
    facilities_finder_title: 'नजदीकी सरकारी स्वास्थ्य केंद्र (Facility Finder)',
    facilities_subtitle: 'आयुष्मान आरोग्य मंदिर, प्राथमिक स्वास्थ्य केंद्र (PHC), सामुदायिक स्वास्थ्य केंद्र (CHC) एवं जिला अस्पताल',
    search_placeholder: 'जिला, ब्लॉक, पिनकोड या केंद्र का नाम लिखें...',
    all_facilities: 'सभी केंद्र',
    distance_label: 'दूरी:',
    contact_label: 'हेल्पलाइन / फोन:',
    directions: 'दिशा-निर्देश देखें',

    // Reminders
    reminders_title: 'फॉलो-अप एवं दवा रिमाइंडर (Health Reminders)',
    add_reminder_btn: '+ नया रिमाइंडर जोड़ें',
    due_date_label: 'नियत तिथि:',
    mark_done: 'पूर्ण चिह्नित करें',
    completed: 'पूर्ण',

    // ASHA
    asha_title: 'आशा सेतु (ASHA Worker) फील्ड पोर्टल',
    asha_subtitle: 'ग्रामीण स्वास्थ्य निगरानी, मरीज पंजीकरण एवं आपातकालीन ट्राइएज समीक्षा',
    register_new_patient: '+ नए ग्रामीण नागरिक का पंजीकरण',
    urgent_queue: 'आपातकालीन ट्राइएज समीक्षा कतार (High Priority)',
    all_patients_list: 'पंजीकृत ग्रामीणों की सूची'
  },
  en: {
    // Brand & Vision
    app_title: 'JanSwasthya Setu AI',
    tagline: 'Bridging Bharat to Intelligent Healthcare',
    demo_mode_badge: 'National Health Innovation (JanSwasthya Intelligence)',
    medical_disclaimer_short: '⚠️ Informational triage and health navigation aid only. Not a substitute for licensed clinical diagnosis.',
    
    // Navigation
    nav_home: 'Home',
    nav_dashboard: 'Citizen Portal',
    nav_assistant: 'Setu Voice AI',
    nav_assessment: 'Symptom Triage',
    nav_reports: 'Report Explainer',
    nav_facilities: 'Find Facilities',
    nav_history: 'Health History',
    nav_reminders: 'Reminders',
    nav_asha_desk: 'ASHA Setu Desk',
    nav_admin: 'District Surveillance',
    nav_privacy: 'Privacy & Safety',
    nav_help: 'Sanjeevani SOS',
    nav_login: 'Sign In',
    nav_logout: 'Sign Out',

    // Emergency Helplines
    emergency_title: 'National 24x7 Emergency Health Helplines (Toll-Free)',
    ambulance_108: '108 - Emergency Ambulance Service',
    health_helpline_104: '104 - Medical Advice Helpline',
    mother_child_102: '102 - Mother & Child Transport (Janani Shishu)',
    all_emergency_112: '112 - All India Emergency Response',

    // Hero Section
    hero_badge: 'Digital Bharat Health Initiative • Purpose-built for Rural & Tier-3/4 India',
    hero_title: 'Voice-First Intelligent Healthcare in Your Language',
    hero_subtitle: 'Speak your symptoms, decode complex pathology reports, generate digital ABHA health cards, and connect with verified PHCs or your frontline ASHA worker in one click.',
    btn_start_triage: 'Start Health Assessment',
    btn_talk_saathi: 'Talk to Setu Voice AI',
    btn_find_hospital: 'Find Nearby Hospitals',
    btn_upload_report: 'Explain Lab Report',

    // Patient Dashboard
    welcome_patient: 'Welcome',
    quick_health_status: 'Your Health Overview',
    card_triage_title: 'Symptom Triage Assessment',
    card_triage_desc: 'Conservative rule-based evaluation: immediate emergency flags or home monitoring advice.',
    card_chat_title: 'Talk to Setu Voice AI',
    card_chat_desc: 'Speak using the microphone in Hindi or English and receive instant spoken guidance.',
    card_report_title: 'Medical Report Explainer',
    card_report_desc: 'Understand CBC, blood sugar, and liver biomarkers in plain conversational terms.',
    card_facility_title: 'Find Healthcare Facilities',
    card_facility_desc: 'Locate verified PHCs, CHCs, and District Hospitals with distance & directions.',

    // Triage flow
    triage_title: 'Clinical Symptom Assessment & Triage',
    triage_disclaimer: 'Conservative triage engine: any emergency warning sign immediately triggers a RED alert.',
    age_group_label: 'Select Age Category:',
    infant: 'Infant (< 1 Year)',
    child: 'Child (1 - 12 Years)',
    adult: 'Adult (13 - 59 Years)',
    elderly: 'Elderly (60+ Years)',
    pregnant: 'Pregnant Woman (Special Care)',
    symptom_duration: 'Duration of symptoms (days):',
    severity_label: 'Severity Level:',
    mild: 'Mild (Normal activities possible)',
    moderate: 'Moderate (Discomfort, fatigue)',
    severe: 'Severe (Disabling distress)',
    red_flag_alert_title: 'Do you have any of these critical warning signs? (Select any that apply):',
    btn_submit_triage: 'Evaluate Symptoms',
    download_summary: 'Download / Print Patient Slip for ASHA',

    // Voice & Chat
    speak_prompt: 'Tap mic and speak your symptoms...',
    listening_now: 'Listening... please speak clearly',
    stop_recording: 'Stop',
    send_message: 'Send',
    type_message_placeholder: 'E.g., I have fever, body aches and chills for 2 days...',
    read_aloud: 'Listen (Audio)',
    stop_reading: 'Mute',

    // Reports
    report_explainer_title: 'Medical Report Explainer',
    report_explainer_desc: 'Select a sample pathology report or upload your own scan. Understand clinical values in simple language.',
    choose_sample_report: 'Quick Test with Sample Reports:',
    upload_own_report: 'Upload Your Report (PDF / Image)',
    extracted_biomarkers: 'Detected Biomarkers & Test Values:',
    status_normal: 'Normal',
    status_high: 'High',
    status_low: 'Low',

    // Facilities
    facilities_finder_title: 'Nearby Healthcare Facilities',
    facilities_subtitle: 'Locate Ayushman Arogya Mandirs, Primary Health Centres (PHC), Community Health Centres (CHC), and District Hospitals',
    search_placeholder: 'Search by town, block, PIN code, or facility name...',
    all_facilities: 'All Facilities',
    distance_label: 'Distance:',
    contact_label: 'Contact / Emergency:',
    directions: 'Get Directions',

    // Reminders
    reminders_title: 'Follow-ups & Medicine Reminders',
    add_reminder_btn: '+ Add New Reminder',
    due_date_label: 'Due Date:',
    mark_done: 'Mark Completed',
    completed: 'Completed',

    // ASHA
    asha_title: 'ASHA Setu Field Worker Portal',
    asha_subtitle: 'Community health surveillance, patient registry, and priority triage review queue',
    register_new_patient: '+ Register New Patient',
    urgent_queue: 'Urgent Triage Review Queue (High Priority)',
    all_patients_list: 'Registered Village Citizens'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (
      (localStorage.getItem('janswasthya_lang') as Language) ||
      (localStorage.getItem('sehatsaathi_lang') as Language) ||
      'hi'
    );
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('janswasthya_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

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
    app_title: 'सेहतसाथी AI',
    tagline: 'आपका स्वास्थ्य, आपकी भाषा, आपका साथी',
    demo_mode_badge: 'प्रदर्शन मोड (डेमो डेटा)',
    medical_disclaimer_short: '⚠️ यह एक सूचनात्मक सहायता प्रणाली है, अधिकृत चिकित्सकीय परामर्श का विकल्प नहीं।',
    
    // Navigation
    nav_home: 'मुख्य पृष्ठ',
    nav_dashboard: 'डैशबोर्ड',
    nav_assistant: 'स्वास्थ्य साथी चैट',
    nav_assessment: 'लक्षण जांच (Triage)',
    nav_reports: 'जांच रिपोर्ट समझें',
    nav_facilities: 'स्वास्थ्य केंद्र खोजें',
    nav_history: 'स्वास्थ्य इतिहास',
    nav_reminders: 'दवा व जांच स्मरण',
    nav_asha_desk: 'आशा कार्यकर्ता डेस्क',
    nav_admin: 'प्रशासनिक आंकड़े',
    nav_privacy: 'गोपनीयता नीति',
    nav_help: 'आपातकालीन सहायता',
    nav_login: 'लॉग इन',
    nav_logout: 'लॉग आउट',

    // Emergency Helplines
    emergency_title: 'राष्ट्रीय आपातकालीन स्वास्थ्य नंबर',
    ambulance_108: '108 - एम्बुलेंस सेवा',
    health_helpline_104: '104 - स्वास्थ्य परामर्श',
    mother_child_102: '102 - मातृ एवं शिशु वाहन',
    all_emergency_112: '112 - राष्ट्रीय आपातकाल',

    // Hero Section
    hero_badge: 'ग्रामीण भारत और टियर-3/4 शहरों के लिए समर्पित',
    hero_title: 'बोलकर अपनी भाषा में पाएं सटीक स्वास्थ्य सलाह',
    hero_subtitle: 'आसानी से अपने लक्षणों की जांच करें, खून की जांच रिपोर्ट समझें, और 1 क्लिक में नजदीकी अस्पताल या आशा दीदी से संपर्क करें।',
    btn_start_triage: 'लक्षण परीक्षण शुरू करें',
    btn_talk_saathi: 'स्वास्थ्य साथी से बात करें',
    btn_find_hospital: 'नजदीकी अस्पताल खोजें',
    btn_upload_report: 'जांच रिपोर्ट अपलोड करें',

    // Patient Dashboard
    welcome_patient: 'नमस्ते',
    quick_health_status: 'आपकी वर्तमान स्वास्थ्य स्थिति',
    card_triage_title: 'लक्षण परीक्षण (Symptom Check)',
    card_triage_desc: 'बुखार, खांसी, दर्द आदि के आधार पर तुरंत आपातकालीन या सामान्य स्तर जानें।',
    card_chat_title: 'स्वास्थ्य साथी से बोलकर पूछें',
    card_chat_desc: 'माइक बटन दबाकर हिंदी में बोलें और आसान आवाज में जवाब सुनें।',
    card_report_title: 'जांच रिपोर्ट का सरल अर्थ',
    card_report_desc: 'सीबीसी, शुगर, हीमोग्लोबिन रिपोर्ट का अर्थ सामान्य भाषा में समझें।',
    card_facility_title: 'नजदीकी सरकारी स्वास्थ्य केंद्र',
    card_facility_desc: 'पीएचसी, सीएचसी और जिला अस्पताल की दूरी और संपर्क नंबर देखें।',

    // Triage flow
    triage_title: 'क्लीनिकल लक्षण जांच एवं ट्राइएज',
    triage_disclaimer: 'यह प्रणाली किसी भी गंभीर लक्षण को तुरंत आपातकाल (RED) घोषित करती है।',
    age_group_label: 'मरीज की आयु वर्ग चुनें:',
    infant: 'शिशु (1 वर्ष से कम)',
    child: 'बच्चा (1 - 12 वर्ष)',
    adult: 'वयस्क (13 - 59 वर्ष)',
    elderly: 'बुजुर्ग (60 वर्ष या अधिक)',
    pregnant: 'गर्भवती महिला (विशेष देखभाल)',
    symptom_duration: 'लक्षण कितने दिनों से हैं?',
    severity_label: 'लक्षणों की गंभीरता:',
    mild: 'हल्का (दैनिक कार्य संभव)',
    moderate: 'मध्यम (थकान या बेचैनी)',
    severe: 'गंभीर (अत्यधिक कष्ट)',
    red_flag_alert_title: 'क्या इनमें से कोई भी गंभीर खतरा लक्षण है? (एक भी हो तो तुरंत बताएं):',
    btn_submit_triage: 'परीक्षण परिणाम देखें',
    download_summary: 'आशा कार्यकर्ता हेतु पर्ची डाउनलोड करें',

    // Voice & Chat
    speak_prompt: 'माइक दबाएं और हिंदी में बोलें...',
    listening_now: 'सुन रहे हैं... कृपया बोलिए',
    stop_recording: 'रोकें',
    send_message: 'भेजें',
    type_message_placeholder: 'जैसे: मुझे दो दिन से बुखार और सिरदर्द है...',
    read_aloud: 'आवाज में सुनें',
    stop_reading: 'आवाज बंद करें',

    // Reports
    report_explainer_title: 'मेडिकल रिपोर्ट विश्लेषक',
    report_explainer_desc: 'अपनी पैथोलॉजी रिपोर्ट चुनें या फोटो/पीडीएफ अपलोड करें। कठिन मेडिकल शब्दों का सरल हिंदी में अर्थ समझें।',
    choose_sample_report: 'नमूना रिपोर्ट से तुरंत जांचें:',
    upload_own_report: 'अपनी रिपोर्ट अपलोड करें (PDF / Image)',
    extracted_biomarkers: 'जांच परिणाम और मापदंड:',
    status_normal: 'सामान्य (Normal)',
    status_high: 'अधिक (High)',
    status_low: 'कम (Low)',

    // Facilities
    facilities_finder_title: 'नजदीकी सरकारी स्वास्थ्य केंद्र',
    facilities_subtitle: 'प्राथमिक स्वास्थ्य केंद्र (PHC), सामुदायिक स्वास्थ्य केंद्र (CHC) एवं जिला अस्पताल खोजें',
    search_placeholder: 'जिला, ब्लॉक, पिनकोड या केंद्र का नाम लिखें...',
    all_facilities: 'सभी केंद्र',
    distance_label: 'दूरी:',
    contact_label: 'हेल्पलाइन / फोन:',
    directions: 'रास्ता देखें',

    // Reminders
    reminders_title: 'फॉलो-अप एवं दवा रिमाइंडर',
    add_reminder_btn: '+ नया रिमाइंडर जोड़ें',
    due_date_label: 'नियत तिथि:',
    mark_done: 'पूर्ण चिह्नित करें',
    completed: 'पूर्ण',

    // ASHA
    asha_title: 'आशा कार्यकर्ता (ASHA Worker) पोर्टल',
    asha_subtitle: 'ग्रामीण स्वास्थ्य निगरानी, मरीज पंजीकरण एवं आपातकालीन ट्राइएज समीक्षा',
    register_new_patient: '+ नए ग्रामीण मरीज का पंजीकरण',
    urgent_queue: 'आपातकालीन ट्राइएज समीक्षा कतार (High Priority)',
    all_patients_list: 'पंजीकृत मरीजों की सूची'
  },
  en: {
    // Brand & Vision
    app_title: 'SehatSaathi AI',
    tagline: 'Your Health, Your Language, Your Saathi',
    demo_mode_badge: 'DEMO MODE (Simulated Data)',
    medical_disclaimer_short: '⚠️ Informational triage aid only. Not a substitute for licensed clinical diagnosis.',
    
    // Navigation
    nav_home: 'Home',
    nav_dashboard: 'Dashboard',
    nav_assistant: 'AI Health Saathi',
    nav_assessment: 'Symptom Triage',
    nav_reports: 'Report Explainer',
    nav_facilities: 'Find Facilities',
    nav_history: 'Health History',
    nav_reminders: 'Reminders',
    nav_asha_desk: 'ASHA Desk',
    nav_admin: 'Admin Analytics',
    nav_privacy: 'Privacy & Safety',
    nav_help: 'Help & Emergency',
    nav_login: 'Sign In',
    nav_logout: 'Sign Out',

    // Emergency Helplines
    emergency_title: 'National Emergency Health Helplines',
    ambulance_108: '108 - Ambulance Service',
    health_helpline_104: '104 - Medical Advice Helpline',
    mother_child_102: '102 - Mother & Child Transport',
    all_emergency_112: '112 - All Emergency Response',

    // Hero Section
    hero_badge: 'Engineered for Rural India & Tier-3/4 Cities',
    hero_title: 'Voice-First AI Healthcare Assistance in Your Language',
    hero_subtitle: 'Assess symptoms safely, decode complex pathology reports in simple terms, and locate verified health centres in 1 tap.',
    btn_start_triage: 'Start Health Assessment',
    btn_talk_saathi: 'Talk to Health Saathi',
    btn_find_hospital: 'Find Nearby Hospitals',
    btn_upload_report: 'Explain Lab Report',

    // Patient Dashboard
    welcome_patient: 'Welcome',
    quick_health_status: 'Your Health Overview',
    card_triage_title: 'Symptom Triage Assessment',
    card_triage_desc: 'Conservative rule-based evaluation: immediate emergency flags or home monitoring advice.',
    card_chat_title: 'Talk to AI Health Saathi',
    card_chat_desc: 'Speak using the mic in Hindi or English and listen to spoken answers.',
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
    type_message_placeholder: 'E.g., I have fever and severe headache for 2 days...',
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
    facilities_subtitle: 'Locate Primary Health Centres (PHC), Community Health Centres (CHC), and District Hospitals',
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
    asha_title: 'ASHA Healthcare Worker Portal',
    asha_subtitle: 'Community health surveillance, patient registry, and priority triage review queue',
    register_new_patient: '+ Register New Patient',
    urgent_queue: 'Urgent Triage Review Queue (High Priority)',
    all_patients_list: 'Registered Village Citizens'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sehatsaathi_lang') as Language) || 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sehatsaathi_lang', lang);
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

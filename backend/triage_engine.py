"""
JanSwasthya Setu AI - Clinical Rule-Based Triage Engine
Designed for conservative, safety-first healthcare triage in rural & tier-3/4 India.

IMPORTANT MEDICAL SAFETY NOTICE:
This is an informational triage aid and prototype decision-support tool.
It does NOT provide a definitive diagnosis or replace licensed clinical evaluation.
Any red-flag symptom immediately escalates to RED (Urgent Medical Attention).
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class SymptomAssessmentInput(BaseModel):
    patient_name: Optional[str] = "Anonymous Citizen"
    age_group: str = Field(..., description="infant | child | adult | elderly | pregnant")
    main_symptoms: List[str] = Field(default_factory=list)
    duration_days: int = Field(default=1, ge=0)
    severity: str = Field(default="moderate", description="mild | moderate | severe")
    associated_symptoms: List[str] = Field(default_factory=list)
    has_red_flags: List[str] = Field(default_factory=list)
    temperature_f: Optional[float] = None
    oxygen_saturation: Optional[int] = None
    language: str = Field(default="hi", description="hi | en")

class TriageResult(BaseModel):
    assessment_id: str
    urgency: str  # RED, YELLOW, GREEN
    urgency_label_en: str
    urgency_label_hi: str
    headline_en: str
    headline_hi: str
    recommendation_en: str
    recommendation_hi: str
    reasoning_en: List[str]
    reasoning_hi: List[str]
    immediate_actions_en: List[str]
    immediate_actions_hi: List[str]
    warning_signs_to_watch_en: List[str]
    warning_signs_to_watch_hi: List[str]
    emergency_contact: str
    created_at: str
    patient_summary_for_asha: Dict[str, Any]

# Explicit Emergency Red-Flag Catalog
RED_FLAG_CATALOG = {
    "chest_pain_severe": {
        "en": "Severe crushing chest pain or pressure spreading to arm, neck, or jaw",
        "hi": "छाती में तेज दर्द, दबाव जो बांह, गर्दन या जबड़े तक फैल रहा हो"
    },
    "difficulty_breathing": {
        "en": "Severe shortness of breath, gasping, or blue discoloration around lips/nails",
        "hi": "सांस लेने में अत्यधिक कठिनाई, हांफना या होठों/नाखूनों का नीला पड़ना"
    },
    "unconscious_altered": {
        "en": "Loss of consciousness, fainting, sudden confusion, or inability to awaken",
        "hi": "बेहोशी, अचानक भ्रम की स्थिति या जगाने में असमर्थता"
    },
    "stroke_signs": {
        "en": "Sudden weakness on one side of body, facial drooping, or slurred speech (FAST)",
        "hi": "शरीर के एक तरफ अचानक कमजोरी, चेहरे का टेढ़ा होना या बोलने में लड़खड़ाहट"
    },
    "severe_bleeding": {
        "en": "Uncontrolled bleeding or coughing/vomiting large amounts of blood",
        "hi": "अनियंत्रित रक्तस्राव या उल्टी/खांसी में अधिक मात्रा में खून आना"
    },
    "high_fever_infant": {
        "en": "High fever (>101°F) in an infant under 3 months, or >103°F with lethargy",
        "hi": "3 महीने से कम उम्र के शिशु को 101°F से अधिक बुखार या अत्यधिक सुस्ती"
    },
    "severe_dehydration": {
        "en": "Unable to drink any fluids, sunken eyes, no urine for >8 hours",
        "hi": "पानी पीने में असमर्थ, धंसी हुई आंखें, 8 घंटे से अधिक समय से पेशाब न होना"
    },
    "pregnancy_complication": {
        "en": "Pregnancy with vaginal bleeding, severe abdominal pain, or severe headache with vision blur",
        "hi": "गर्भावस्था में रक्तस्राव, तेज पेट दर्द या सिरदर्द के साथ आंखों में धुंधलापन"
    },
    "snake_insect_bite": {
        "en": "Suspected snake bite, scorpion sting, or severe poisoning exposure",
        "hi": "सांप का काटना, बिच्छू का डंक या जहरीले पदार्थ का सेवन"
    }
}

def evaluate_triage(data: SymptomAssessmentInput) -> TriageResult:
    assessment_id = f"SSA-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    reasons_en = []
    reasons_hi = []
    immediate_en = []
    immediate_hi = []
    warnings_en = []
    warnings_hi = []

    # Check 1: Explicit Red Flags
    active_red_flags = []
    for rf_key in data.has_red_flags:
        if rf_key in RED_FLAG_CATALOG:
            active_red_flags.append(rf_key)
            reasons_en.append(f"Reported critical red flag: {RED_FLAG_CATALOG[rf_key]['en']}")
            reasons_hi.append(f"गंभीर आपातकालीन लक्षण: {RED_FLAG_CATALOG[rf_key]['hi']}")

    # Check 2: Oxygen saturation < 92% is always RED
    if data.oxygen_saturation is not None and data.oxygen_saturation < 92:
        active_red_flags.append("low_sp_o2")
        reasons_en.append(f"Critically low blood oxygen level: {data.oxygen_saturation}% (Normal is ≥ 95%)")
        reasons_hi.append(f"रक्त में ऑक्सीजन का खतरनाक रूप से कम स्तर: {data.oxygen_saturation}% (सामान्य ≥ 95% होता है)")

    # Check 3: Infant with high fever
    if data.age_group == "infant" and data.temperature_f and data.temperature_f >= 100.4:
        active_red_flags.append("infant_fever")
        reasons_en.append(f"Fever in infant ({data.temperature_f}°F) requires emergency pediatric evaluation")
        reasons_hi.append(f"शिशु में {data.temperature_f}°F बुखार के लिए तुरंत आपातकालीन डॉक्टर की आवश्यकता है")

    # If any red flag triggers -> RED
    if len(active_red_flags) > 0 or data.severity == "severe" and any(s in ["chest_pain", "breathing", "unconscious"] for s in data.main_symptoms):
        urgency = "RED"
        label_en = "RED — IMMEDIATE EMERGENCY CARE REQUIRED"
        label_hi = "लाल — तुरंत आपातकालीन चिकित्सा सहायता प्राप्त करें"
        headline_en = "Urgent: Visit the Nearest Hospital / Call 108 Ambulance Immediately"
        headline_hi = "चेतावनी: तुरंत नजदीकी अस्पताल जाएं या 108 एम्बुलेंस को कॉल करें"
        rec_en = "Your reported symptoms indicate a potential medical emergency. Do not wait for home remedies or delay medical assistance. Reach the nearest Community Health Centre (CHC) or District Hospital immediately."
        rec_hi = "आपके द्वारा बताए गए लक्षण किसी गंभीर चिकित्सीय स्थिति का संकेत हो सकते हैं। घरेलू उपचार की प्रतीक्षा न करें। तुरंत निकटतम सामुदायिक स्वास्थ्य केंद्र (CHC) या जिला अस्पताल पहुंचें।"
        
        immediate_en = [
            "Dial 108 (Toll-Free Government Ambulance) or 112 immediately",
            "Keep the patient in a comfortable seated or recovery position; do not leave unattended",
            "Loosen tight clothing around neck and chest to facilitate easy breathing",
            "Carry any ongoing medical prescriptions or recent test reports",
            "Alert your local ASHA worker or village health volunteer immediately"
        ]
        immediate_hi = [
            "तुरंत 108 (निःशुल्क एम्बुलेंस) या 112 पर कॉल करें",
            "मरीज को आरामदायक स्थिति में रखें; अकेला न छोड़ें",
            "गर्दन और छाती के आसपास के तंग कपड़े ढीले करें ताकि सांस आसानी से आ सके",
            "पुरानी दवाइयों के पर्चे और हालिया जांच रिपोर्ट साथ ले जाएं",
            "अपनी स्थानीय आशा कार्यकर्ता या स्वास्थ्य मित्र को तुरंत सूचित करें"
        ]
        warnings_en = [
            "Do not give solid foods if breathing is labored or patient is drowsy",
            "Do not drive yourself to hospital if experiencing chest pain or dizzy spells"
        ]
        warnings_hi = [
            "यदि सांस लेने में तकलीफ हो या मरीज को चक्कर आ रहे हों तो ठोस भोजन न दें",
            "छाती में दर्द या चक्कर आने पर स्वयं वाहन चलाकर अस्पताल न जाएं"
        ]
    
    # Check 4: Moderate symptoms or vulnerable groups -> YELLOW
    elif (
        data.severity == "moderate" or
        data.duration_days >= 3 or
        data.age_group in ["infant", "elderly", "pregnant"] or
        any(s in ["fever", "diarrhea", "vomiting", "abdominal_pain", "cough"] for s in data.main_symptoms) and data.duration_days >= 2
    ):
        urgency = "YELLOW"
        label_en = "YELLOW — PROFESSIONAL MEDICAL CONSULTATION RECOMMENDED"
        label_hi = "पीला — डॉक्टर या आशा कार्यकर्ता से जांच आवश्यक"
        headline_en = "Consult a Medical Officer or ASHA Worker Within 24-48 Hours"
        headline_hi = "अगले 24 से 48 घंटों में डॉक्टर या आशा कार्यकर्ता से परामर्श लें"
        rec_en = "Your symptoms warrant clinical examination by a qualified doctor at a Primary Health Centre (PHC) or Sub-Centre. While not an acute emergency right now, delaying care could lead to complications."
        rec_hi = "आपके लक्षणों के लिए प्राथमिक स्वास्थ्य केंद्र (PHC) या उप-स्वास्थ्य केंद्र पर डॉक्टर द्वारा जांच की आवश्यकता है। हालांकि यह तुरंत आपातकाल नहीं है, लेकिन देरी करने से समस्या बढ़ सकती है।"
        
        reasons_en.append(f"Symptoms have persisted for {data.duration_days} day(s)")
        reasons_hi.append(f"लक्षण {data.duration_days} दिन से बने हुए हैं")
        if data.age_group in ["infant", "pregnant", "elderly"]:
            reasons_en.append(f"Patient belongs to vulnerable category ({data.age_group})")
            reasons_hi.append(f"मरीज विशेष देखभाल श्रेणी ({data.age_group}) में आता है")

        immediate_en = [
            "Visit your local Primary Health Centre (PHC) or consult your ASHA worker",
            "Stay well hydrated with boiled water, ORS (Oral Rehydration Solution), or clear soups",
            "Monitor body temperature twice daily and record it",
            "Get sufficient bed rest and avoid strenuous physical labor"
        ]
        immediate_hi = [
            "अपने नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) पर जाएं या आशा कार्यकर्ता से मिलें",
            "उबला हुआ पानी, ओआरएस (ORS) या दाल का पानी पीकर शरीर में पानी की कमी न होने दें",
            "दिन में दो बार बुखार मापें और नोट करें",
            "पर्याप्त आराम करें और भारी शारीरिक श्रम से बचें"
        ]
        warnings_en = [
            "Escalate to emergency (108) if breathing becomes rapid, fever exceeds 102°F, or sudden extreme weakness occurs",
            "Do not consume unverified over-the-counter antibiotics without prescription"
        ]
        warnings_hi = [
            "यदि सांस तेज चलने लगे, बुखार 102°F से ऊपर जाए, या अत्यधिक कमजोरी आए तो तुरंत 108 पर कॉल करें",
            "बिना डॉक्टर की सलाह के मेडिकल स्टोर से एंटीबायोटिक गोलियां न लें"
        ]

    # Check 5: Mild symptoms -> GREEN
    else:
        urgency = "GREEN"
        label_en = "GREEN — SELF-CARE & MONITORING"
        label_hi = "हरा — सामान्य घरेलू देखभाल एवं निगरानी"
        headline_en = "Mild Symptoms: Practice Supportive Care at Home"
        headline_hi = "हल्के लक्षण: घर पर सावधानीपूर्वक देखभाल करें"
        rec_en = "Your reported symptoms appear mild and manageable with basic supportive care, adequate hydration, and rest. If symptoms worsen or persist beyond 3 days, seek clinical consultation."
        rec_hi = "आपके लक्षण सामान्य हैं जिन्हें आराम, संतुलित आहार और पर्याप्त पानी पीकर ठीक किया जा सकता है। यदि लक्षण 3 दिनों से अधिक रहें या बढ़ें, तो डॉक्टर से संपर्क करें।"

        reasons_en.append("No emergency red flags reported")
        reasons_en.append("Symptoms categorized as mild with short duration")
        reasons_hi.append("कोई आपातकालीन खतरे का लक्षण नहीं पाया गया")
        reasons_hi.append("लक्षण हल्के एवं कम समय के हैं")

        immediate_en = [
            "Rest well and maintain good hydration with clean fluids",
            "Consume freshly cooked, easily digestible meals (khichdi, dalia, fruit)",
            "Practice hand hygiene and respiratory etiquette",
            "Contact National Health Helpline (104) for free telephone medical guidance"
        ]
        immediate_hi = [
            "पर्याप्त आराम करें और स्वच्छ पानी पीते रहें",
            "ताजा और सुपाच्य भोजन लें (जैसे खिचड़ी, दलिया, सूप)",
            "हाथों की स्वच्छता का ध्यान रखें",
            "निःशुल्क चिकित्सीय परामर्श के लिए राष्ट्रीय स्वास्थ्य हेल्पलाइन 104 पर कॉल करें"
        ]
        warnings_en = [
            "Seek medical evaluation if symptoms worsen, high fever develops, or you cannot tolerate fluids"
        ]
        warnings_hi = [
            "यदि लक्षण बिगड़ें, तेज बुखार आए या उल्टी के कारण पानी भी न पच रहा हो, तो तुरंत डॉक्टर से मिलें"
        ]

    summary_for_asha = {
        "token": assessment_id,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "patient_name": data.patient_name,
        "age_group": data.age_group,
        "urgency": urgency,
        "duration_days": data.duration_days,
        "main_symptoms": data.main_symptoms,
        "severity": data.severity,
        "red_flags": active_red_flags,
        "vital_temp": f"{data.temperature_f}°F" if data.temperature_f else "Not recorded",
        "vital_spo2": f"{data.oxygen_saturation}%" if data.oxygen_saturation else "Not recorded",
        "recommended_facility": "CHC / District Hospital" if urgency == "RED" else ("PHC / Sub-Centre" if urgency == "YELLOW" else "Home / Health Post"),
        "asha_action_notes": "Needs urgent transport via 108" if urgency == "RED" else ("Schedule home visit within 24h & check vitals" if urgency == "YELLOW" else "Routine telephonic follow-up in 3 days")
    }

    return TriageResult(
        assessment_id=assessment_id,
        urgency=urgency,
        urgency_label_en=label_en,
        urgency_label_hi=label_hi,
        headline_en=headline_en,
        headline_hi=headline_hi,
        recommendation_en=rec_en,
        recommendation_hi=rec_hi,
        reasoning_en=reasons_en,
        reasoning_hi=reasons_hi,
        immediate_actions_en=immediate_en,
        immediate_actions_hi=immediate_hi,
        warning_signs_to_watch_en=warnings_en,
        warning_signs_to_watch_hi=warnings_hi,
        emergency_contact="108 (Ambulance) / 104 (Health Helpline) / 112 (All Emergency)",
        created_at=datetime.now().isoformat(),
        patient_summary_for_asha=summary_for_asha
    )

"""
JanSwasthya Setu AI - Medical Report Parser & Explainer
Parses laboratory and pathology reports (CBC, Blood Sugar, Lipid Profile, etc.),
extracts biomarkers, identifies out-of-range values, and explains results in simple Hindi & English.

MEDICAL SAFETY NOTICE:
- Lab values alone do not constitute a diagnosis.
- Always consult a physician or PHC Medical Officer for clinical correlation.
- Out-of-range values may be physiological or due to transient factors.
"""

from typing import List, Dict, Any, Optional
import re
from pydantic import BaseModel

class BiomarkerResult(BaseModel):
    test_name: str
    test_name_hi: str
    value: float
    unit: str
    reference_low: float
    reference_high: float
    status: str  # NORMAL | HIGH | LOW
    status_label_en: str
    status_label_hi: str
    explanation_en: str
    explanation_hi: str

class ReportAnalysisResponse(BaseModel):
    report_type: str
    patient_info: Dict[str, Any]
    biomarkers: List[BiomarkerResult]
    summary_en: str
    summary_hi: str
    abnormal_count: int
    recommendation_en: str
    recommendation_hi: str
    safety_disclaimer: str

# Biomarker Dictionary with Clinical Reference Ranges & Rural-friendly Explanations
BIOMARKER_KNOWLEDGE_BASE = {
    "hemoglobin": {
        "name_en": "Hemoglobin (Hb)",
        "name_hi": "हीमोग्लोबिन (रक्त में खून का स्तर)",
        "unit": "g/dL",
        "ref_low": 12.0,
        "ref_high": 16.5,
        "desc_en": "Protein in red blood cells that carries oxygen to body tissues.",
        "desc_hi": "लाल रक्त कोशिकाओं में पाया जाने वाला प्रोटीन जो पूरे शरीर में ऑक्सीजन पहुंचाता है।",
        "low_en": "Below normal (Anemia). May cause tiredness, dizziness, shortness of breath, and pale skin. Common in rural nutrition gaps.",
        "low_hi": "सामान्य से कम (खून की कमी / एनीमिया)। इससे कमजोरी, चक्कर, थकान और सांस फूलना हो सकता है। हरी पत्तेदार सब्जियां और गुड़-चना खाएं और डॉक्टर से सलाह लें।",
        "high_en": "Above normal. Can occur with dehydration, smoking, or living at high altitudes.",
        "high_hi": "सामान्य से अधिक। शरीर में पानी की कमी (डिहाइड्रेशन) या धूम्रपान के कारण हो सकता है।"
    },
    "wbc": {
        "name_en": "Total Leukocyte Count (WBC)",
        "name_hi": "सफेद रक्त कोशिकाएं (टीएलसी / डब्ल्यूबीसी)",
        "unit": "cells/mcL",
        "ref_low": 4000,
        "ref_high": 11000,
        "desc_en": "Infection-fighting cells of the immune system.",
        "desc_hi": "रोग प्रतिरोधक क्षमता (इम्यूनिटी) की कोशिकाएं जो संक्रमण और बीमारियों से लड़ती हैं।",
        "low_en": "Low WBC count (Leukopenia). Immune system may be weakened; risk of infections.",
        "low_hi": "सामान्य से कम। शरीर की बीमारियों से लड़ने की क्षमता कमजोर हो सकती है।",
        "high_en": "Elevated WBC count (Leukocytosis). Commonly indicates an active infection or inflammation in the body.",
        "high_hi": "सामान्य से अधिक। यह अक्सर शरीर में किसी सक्रिय संक्रमण (इन्फेक्शन), बुखार या सूजन का संकेत होता है।"
    },
    "platelets": {
        "name_en": "Platelet Count",
        "name_hi": "प्लेटलेट काउंट",
        "unit": "lakh/mcL",
        "ref_low": 1.5,
        "ref_high": 4.5,
        "desc_en": "Cell fragments that help blood clot and stop bleeding.",
        "desc_hi": "रक्त कोशिकाएं जो खून का थक्का बनाने और रक्तस्राव रोकने में मदद करती हैं।",
        "low_en": "Low Platelets (Thrombocytopenia). Frequently observed in viral fevers like Dengue or Malaria. Increases risk of bleeding.",
        "low_hi": "सामान्य से कम। डेंगू, मलेरिया या वायरल बुखार में अक्सर गिर जाती है। चोट लगने पर खून बहने का खतरा रहता है। तुरंत डॉक्टर से संपर्क करें।",
        "high_en": "High Platelets. May be reactive following acute inflammation or iron deficiency.",
        "high_hi": "सामान्य से अधिक। सूजन या शरीर में किसी प्रतिक्रिया के कारण बढ़ सकता है।"
    },
    "fasting_blood_glucose": {
        "name_en": "Fasting Blood Sugar (FBS)",
        "name_hi": "खाली पेट रक्त शर्करा (फास्टिंग ब्लड शुगर)",
        "unit": "mg/dL",
        "ref_low": 70,
        "ref_high": 99,
        "desc_en": "Blood sugar level after at least 8 hours of overnight fasting.",
        "desc_hi": "रात भर (कम से कम 8 घंटे) भूखे रहने के बाद रक्त में शुगर (ग्लूकोज) का स्तर।",
        "low_en": "Low blood sugar (Hypoglycemia). Can cause shakiness, sweating, and confusion.",
        "low_hi": "शुगर सामान्य से कम। घबराहट, पसीना आना और चक्कर आना हो सकता है। तुरंत मीठा या पानी लें।",
        "high_en": "Elevated fasting sugar (Impaired fasting glucose / Diabetes). Indicates body is not processing sugar efficiently.",
        "high_hi": "सामान्य से अधिक (मधुमेह / डायबिटीज का संकेत)। शरीर शुगर को सही से नियंत्रित नहीं कर पा रहा है। खान-पान में परहेज और डॉक्टर से दवा की सलाह लें।"
    },
    "post_prandial_glucose": {
        "name_en": "Post-Prandial Blood Sugar (PPBS)",
        "name_hi": "भोजन के बाद रक्त शर्करा (पीपी ब्लड शुगर)",
        "unit": "mg/dL",
        "ref_low": 70,
        "ref_high": 140,
        "desc_en": "Blood sugar level measured 2 hours after a meal.",
        "desc_hi": "खाना खाने के ठीक 2 घंटे बाद रक्त में शुगर का स्तर।",
        "low_en": "Lower than expected.",
        "low_hi": "सामान्य से कम।",
        "high_en": "Elevated post-meal blood sugar (>140 mg/dL indicates prediabetes, >200 indicates diabetes).",
        "high_hi": "सामान्य से अधिक। 140 से ऊपर प्रीडायबिटीज और 200 से ऊपर डायबिटीज का संकेत देता है।"
    },
    "creatinine": {
        "name_en": "Serum Creatinine",
        "name_hi": "सीरम क्रिएटिनिन (गुर्दे / किडनी की कार्यप्रणाली)",
        "unit": "mg/dL",
        "ref_low": 0.6,
        "ref_high": 1.2,
        "desc_en": "Waste product filtered out of the blood by healthy kidneys.",
        "desc_hi": "रक्त में अपशिष्ट उत्पाद जिसे स्वस्थ गुर्दे (किडनी) छानकर बाहर निकालते हैं।",
        "low_en": "Low creatinine is rarely concerning; may reflect low muscle mass.",
        "low_hi": "कम स्तर सामान्यतः मांसपेशियों की कमी के कारण हो सकता है।",
        "high_en": "High creatinine indicates reduced kidney filtration ability. Prompt medical review recommended.",
        "high_hi": "सामान्य से अधिक। इसका मतलब है कि गुर्दे रक्त को सही तरीके से साफ नहीं कर पा रहे हैं। तुरंत डॉक्टर से मिलें और पर्याप्त पानी पिएं।"
    },
    "sgpt": {
        "name_en": "SGPT / ALT (Liver Enzyme)",
        "name_hi": "एसजीपीटी / एएलटी (लिवर एंजाइम)",
        "unit": "U/L",
        "ref_low": 10,
        "ref_high": 45,
        "desc_en": "Enzyme produced in liver cells; spills into bloodstream if liver is inflamed.",
        "desc_hi": "लिवर कोशिकाओं द्वारा निर्मित एंजाइम; लिवर में सूजन या दबाव होने पर रक्त में बढ़ता है।",
        "low_en": "Normal finding.",
        "low_hi": "सामान्य स्थिति।",
        "high_en": "Elevated liver enzyme. May be caused by fatty liver, viral hepatitis, certain medications, or alcohol.",
        "high_hi": "सामान्य से अधिक। फैटी लिवर, पीलिया (हेपेटाइटिस) या अत्यधिक तैलीय भोजन के कारण बढ़ सकता है।"
    }
}

SAMPLE_REPORTS = {
    "cbc_anemia": {
        "name": "Complete Blood Count (CBC) - Suspected Anemia & Fever",
        "name_hi": "कम्प्लीट ब्लड काउंट (सीबीसी) - खून की कमी एवं बुखार",
        "patient": {"name": "Sunita Devi", "age": 28, "gender": "Female", "date": "2026-10-02"},
        "raw_text": """
PATIENT REPORT: SUNITA DEVI | Age: 28 Y / F | Date: 02-Oct-2026
TEST NAME                RESULT    UNIT       REFERENCE RANGE
Hemoglobin (Hb)          9.2       g/dL       12.0 - 15.5  (LOW)
Total Leukocyte Count    11800     cells/mcL  4000 - 11000 (HIGH)
Platelet Count           1.8       lakh/mcL   1.5 - 4.5    (NORMAL)
Fasting Blood Sugar      88        mg/dL      70 - 99      (NORMAL)
Serum Creatinine         0.8       mg/dL      0.6 - 1.2    (NORMAL)
        """
    },
    "sugar_high": {
        "name": "Diabetic Health Panel - High Fasting Sugar",
        "name_hi": "डायबिटीज हेल्थ पैनल - उच्च ब्लड शुगर",
        "patient": {"name": "Ramesh Chandra", "age": 52, "gender": "Male", "date": "2026-10-03"},
        "raw_text": """
PATIENT REPORT: RAMESH CHANDRA | Age: 52 Y / M | Date: 03-Oct-2026
TEST NAME                RESULT    UNIT       REFERENCE RANGE
Fasting Blood Sugar      168       mg/dL      70 - 99      (HIGH)
Post-Prandial Sugar      245       mg/dL      70 - 140     (HIGH)
Serum Creatinine         1.4       mg/dL      0.6 - 1.2    (HIGH)
SGPT (ALT)               54        U/L        10 - 45      (HIGH)
Hemoglobin (Hb)          13.4      g/dL       13.0 - 17.0  (NORMAL)
        """
    },
    "normal_checkup": {
        "name": "Routine Wellness Health Checkup - Normal",
        "name_hi": "नियमित स्वास्थ्य जांच - सामान्य रिपोर्ट",
        "patient": {"name": "Pooja Verma", "age": 24, "gender": "Female", "date": "2026-10-04"},
        "raw_text": """
PATIENT REPORT: POOJA VERMA | Age: 24 Y / F | Date: 04-Oct-2026
TEST NAME                RESULT    UNIT       REFERENCE RANGE
Hemoglobin (Hb)          12.8      g/dL       12.0 - 15.5  (NORMAL)
Total Leukocyte Count    6800      cells/mcL  4000 - 11000 (NORMAL)
Platelet Count           2.4       lakh/mcL   1.5 - 4.5    (NORMAL)
Fasting Blood Sugar      82        mg/dL      70 - 99      (NORMAL)
Serum Creatinine         0.7       mg/dL      0.6 - 1.2    (NORMAL)
        """
    }
}

def parse_report_text(raw_text: str, patient_name: Optional[str] = "Demo Citizen") -> ReportAnalysisResponse:
    """Parses text from medical report and maps detected tests to clinical explanations."""
    results: List[BiomarkerResult] = []
    text_lower = raw_text.lower()

    # Search for known biomarkers in the text
    patterns = {
        "hemoglobin": [r"hemoglobin.*?(\d+\.?\d*)", r"hb.*?(\d+\.?\d*)"],
        "wbc": [r"total leukocyte.*?(\d+)", r"tlc.*?(\d+)", r"wbc.*?(\d+)"],
        "platelets": [r"platelet.*?(\d+\.?\d*)"],
        "fasting_blood_glucose": [r"fasting blood sugar.*?(\d+\.?\d*)", r"fbs.*?(\d+\.?\d*)", r"fasting sugar.*?(\d+\.?\d*)"],
        "post_prandial_glucose": [r"post[- ]?prandial.*?(\d+\.?\d*)", r"ppbs.*?(\d+\.?\d*)", r"pp sugar.*?(\d+\.?\d*)"],
        "creatinine": [r"creatinine.*?(\d+\.?\d*)", r"serum creatinine.*?(\d+\.?\d*)"],
        "sgpt": [r"sgpt.*?(\d+\.?\d*)", r"alt.*?(\d+\.?\d*)"]
    }

    for key, regexes in patterns.items():
        kb = BIOMARKER_KNOWLEDGE_BASE[key]
        for rgx in regexes:
            match = re.search(rgx, text_lower)
            if match:
                try:
                    val = float(match.group(1))
                    # Validate and determine status
                    if val < kb["ref_low"]:
                        status = "LOW"
                        status_en = "Below Normal (Low)"
                        status_hi = "सामान्य से कम (कम)"
                        exp_en = kb["low_en"]
                        exp_hi = kb["low_hi"]
                    elif val > kb["ref_high"]:
                        status = "HIGH"
                        status_en = "Above Normal (High)"
                        status_hi = "सामान्य से अधिक (ज्यादा)"
                        exp_en = kb["high_en"]
                        exp_hi = kb["high_hi"]
                    else:
                        status = "NORMAL"
                        status_en = "Normal Range"
                        status_hi = "सामान्य स्तर"
                        exp_en = f"Within standard healthy limits ({kb['ref_low']} - {kb['ref_high']} {kb['unit']})."
                        exp_hi = f"उचित एवं स्वस्थ सीमा में है ({kb['ref_low']} - {kb['ref_high']} {kb['unit']})।"

                    results.append(BiomarkerResult(
                        test_name=kb["name_en"],
                        test_name_hi=kb["name_hi"],
                        value=val,
                        unit=kb["unit"],
                        reference_low=kb["ref_low"],
                        reference_high=kb["ref_high"],
                        status=status,
                        status_label_en=status_en,
                        status_label_hi=status_hi,
                        explanation_en=exp_en,
                        explanation_hi=exp_hi
                    ))
                    break
                except (ValueError, IndexError):
                    continue

    abnormal_count = sum(1 for b in results if b.status != "NORMAL")

    if abnormal_count > 0:
        summary_en = f"Analysis identified {len(results)} biomarker(s), with {abnormal_count} value(s) outside standard reference ranges. Please discuss these specific findings with your medical officer."
        summary_hi = f"जांच में {len(results)} मापदंड मिले, जिनमें से {abnormal_count} मापदंड सामान्य सीमा से बाहर हैं। कृपया इस रिपोर्ट को नजदीकी स्वास्थ्य केंद्र के डॉक्टर को दिखाएं।"
        rec_en = "Bring this printed report or summary to your Primary Health Centre (PHC) for clinical assessment and dietary advice."
        rec_hi = "इस रिपोर्ट के सारांश को अपने प्राथमिक स्वास्थ्य केंद्र (PHC) के डॉक्टर को दिखाकर उचित दवा या खान-पान की सलाह लें।"
    else:
        summary_en = f"Analysis identified {len(results)} biomarker(s). All detected test parameters fall within standard healthy reference ranges."
        summary_hi = f"जांच में {len(results)} मापदंड मिले। सभी मापदंड सामान्य और स्वस्थ सीमा में हैं।"
        rec_en = "Maintain balanced nutrition, adequate hydration, and schedule routine preventive check-ups annually."
        rec_hi = "संतुलित आहार, स्वच्छ पानी और नियमित दिनचर्या जारी रखें। साल में एक बार सामान्य जांच अवश्य कराएं।"

    return ReportAnalysisResponse(
        report_type="Pathology / Blood Investigation Report",
        patient_info={"name": patient_name or "Verified Citizen", "status": "Analyzed"},
        biomarkers=results,
        summary_en=summary_en,
        summary_hi=summary_hi,
        abnormal_count=abnormal_count,
        recommendation_en=rec_en,
        recommendation_hi=rec_hi,
        safety_disclaimer="CAUTION: This AI summary explains medical lab terms for educational purposes only. It is NOT a medical diagnosis. Never start or stop medicines without a qualified doctor's prescription."
    )

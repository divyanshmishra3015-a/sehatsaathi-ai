"""
SehatSaathi AI - Conversational AI Healthcare Assistant Service
Features:
- Explicit Red-Flag screening layer before LLM processing
- Conservative triage protocol
- Bilingual conversational assistant (Hindi & English)
- Secure backend API handling with fallback safe response engine
- Clean patient summary generation for ASHA worker
"""

import os
import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ChatMessage(BaseModel):
    role: str  # user | assistant | system
    content: str

class ChatRequest(BaseModel):
    message: str
    language: str = "hi"  # hi | en
    history: List[ChatMessage] = []
    patient_context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    is_emergency: bool
    emergency_actions: List[str]
    suggested_followups: List[str]
    triage_urgency: str  # RED, YELLOW, GREEN
    summary_for_worker: Optional[Dict[str, Any]] = None

# Red-flag keywords in Hindi and English
RED_FLAG_PATTERNS = [
    (r"(chest\s*pain|chhati\s*me\s*dard|chhati\s*dard|सीने|छाती)", "Severe Chest Pain"),
    (r"(breath|saans|सांस|साँस|दम फूलना|दमा)", "Difficulty Breathing"),
    (r"(unconscious|behoshi|behosh|बेहोश)", "Unconsciousness / Fainting"),
    (r"(blood\s*vomit|khoon\s*ki\s*ulti|khoon|रक्तस्राव|खून)", "Heavy Bleeding / Blood in Vomit"),
    (r"(stroke|paralysis|लकवा|पक्षाघात)", "Stroke / Paralysis signs"),
    (r"(snake\s*bite|saap|सांप|सर्प)", "Snake Bite"),
    (r"(poison|zeher|जहर|विष)", "Poisoning")
]

def screen_for_red_flags(text: str) -> Optional[str]:
    """Explicit safety filter: screens for life-threatening keywords before any LLM call."""
    text_lower = text.lower()
    for pattern, name in RED_FLAG_PATTERNS:
        if re.search(pattern, text_lower):
            return name
    return None

def generate_saathi_response(req: ChatRequest) -> ChatResponse:
    user_msg = req.message.strip()
    lang = req.language.lower()
    is_hi = lang.startswith("hi")

    # Step 1: Red-flag screening layer
    red_flag = screen_for_red_flags(user_msg)
    if red_flag:
        if is_hi:
            reply = (
                f"🚨 **अति आवश्यक चेतावनी: {red_flag} के संकेत मिले हैं!**\n\n"
                "यह एक संभावित आपातकालीन चिकित्सीय स्थिति (Medical Emergency) हो सकती है। "
                "घरेलू नुस्खों या चैटबॉट सलाह की प्रतीक्षा न करें। कृपया तुरंत कदम उठाएं:\n\n"
                "1. तुरंत **108** (सरकारी निःशुल्क एम्बुलेंस) या **112** पर कॉल करें।\n"
                "2. मरीज को आरामदायक स्थिति में बैठाएं और भीड़ न लगाएं।\n"
                "3. अपनी स्थानीय **आशा कार्यकर्ता (ASHA Worker)** को तुरंत फोन करें।\n"
                "4. निकटतम सामुदायिक स्वास्थ्य केंद्र (CHC) या जिला अस्पताल पहुंचें।"
            )
            actions = [
                "108 एम्बुलेंस तुरंत कॉल करें",
                "स्थानीय आशा कार्यकर्ता को सूचित करें",
                "नजदीकी सामुदायिक स्वास्थ्य केंद्र (CHC) जाएं"
            ]
            followups = [
                "108 एम्बुलेंस बुलाई जा चुकी है",
                "नजदीकी अस्पताल का पता कैसे देखें?",
                "मरीज को प्राथमिक उपचार कैसे दें?"
            ]
        else:
            reply = (
                f"🚨 **URGENT EMERGENCY ALERT: Detected {red_flag}!**\n\n"
                "Your reported symptom indicates a potential medical emergency. "
                "Do not wait for home remedies or online suggestions. Please take immediate action:\n\n"
                "1. Dial **108** (Free Emergency Ambulance) or **112** immediately.\n"
                "2. Keep the patient calm and in a comfortable posture; do not leave unattended.\n"
                "3. Notify your local **ASHA worker** or village health volunteer.\n"
                "4. Proceed to the nearest Community Health Centre (CHC) or District Hospital without delay."
            )
            actions = [
                "Call 108 Emergency Ambulance",
                "Alert local ASHA worker",
                "Proceed to nearest CHC or District Hospital"
            ]
            followups = [
                "Ambulance is called",
                "Where is the nearest hospital?",
                "What first aid to provide right now?"
            ]

        summary = {
            "urgency": "RED",
            "trigger": red_flag,
            "patient_message": user_msg,
            "status": "Escalated to Emergency"
        }
        return ChatResponse(
            reply=reply,
            is_emergency=True,
            emergency_actions=actions,
            suggested_followups=followups,
            triage_urgency="RED",
            summary_for_worker=summary
        )

    # Step 2: Intelligent Rule & Context engine for Healthcare guidance
    # Check for fever / bukhar
    msg_low = user_msg.lower()
    if any(k in msg_low for k in ["bukhar", "fever", "tapman", "बुखार", "ताप"]):
        if is_hi:
            reply = (
                "नमस्ते। बुखार शरीर का किसी संक्रमण से लड़ने का एक स्वाभाविक संकेत होता है।\n\n"
                "**महत्वपूर्ण जानकारी:**\n"
                "- क्या बुखार के साथ ठंड लग रही है, सिरदर्द है या उल्टी का मन हो रहा है?\n"
                "- बुखार कितने दिनों से है?\n"
                "- मरीज की उम्र कितनी है?\n\n"
                "**तत्काल सावधानियां:**\n"
                "• स्वच्छ उबला पानी, दाल का पानी या ओआरएस (ORS) घोल पिएं ताकि शरीर में पानी की कमी न हो।\n"
                "• माथे पर सामान्य पानी की ठंडी पट्टी रखें।\n"
                "• बिना डॉक्टर की सलाह के कोई तेज एंटीबायोटिक या दर्दनिवारक न लें।\n"
                "• यदि बुखार 3 दिन से अधिक हो या 102°F से ऊपर जाए, तो नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) पर जाकर खून की जांच (मलेरिया/डेंगू) कराएं।"
            )
            followups = [
                "बुखार 2 दिन से है और सिरदर्द है",
                "मरीज की उम्र 10 साल से कम है",
                "दवा लेने से पहले क्या जांच करानी चाहिए?",
                "नजदीकी पीएचसी (PHC) कहां है?"
            ]
        else:
            reply = (
                "Namaste. Fever is usually your body's immune response to an infection.\n\n"
                "**Helpful questions to understand better:**\n"
                "- How many days has the fever been present?\n"
                "- Are there chills, body ache, cough, or nausea?\n"
                "- What is the age group of the patient?\n\n"
                "**Safe supportive measures:**\n"
                "• Drink plenty of clean fluids (boiled water, clear soups, ORS solution) to prevent dehydration.\n"
                "• Apply normal-temperature wet cloth compresses on forehead.\n"
                "• Rest well and eat light, easily digestible food.\n"
                "• If fever lasts more than 2-3 days or exceeds 102°F, visit your nearest Primary Health Centre (PHC) for malaria/dengue blood screening."
            )
            followups = [
                "Fever has lasted 2 days with headache",
                "Patient is a young child",
                "Which tests are done at PHC?",
                "Find nearest health center"
            ]
        urgency = "YELLOW"

    # Check for diarrhea / dast / pet kharab / dehydration
    elif any(k in msg_low for k in ["dast", "diarrhea", "pet kharab", "loose motion", "दस्त", "उल्टी", "पेट खराब"]):
        if is_hi:
            reply = (
                "दस्त (Loose Motions) में सबसे बड़ा खतरा शरीर में पानी और नमक की कमी (डिहाइड्रेशन) होना है।\n\n"
                "**तुरंत क्या करें:**\n"
                "• **ओआरएस (ORS) घोल:** एक पैकेट ओआरएस 1 लीटर साफ उबले ठंडे पानी में घोलकर हर दस्त के बाद 1 कप पिएं।\n"
                "• नारियल पानी, छाछ, चावल का मांड या नमक-चीनी का घोल दें।\n"
                "• बच्चों के लिए जिंक (Zinc) की गोली 14 दिनों तक आशा दीदी की सलाह से दी जाती है।\n\n"
                "**सावधानी:** यदि आंखें धंसने लगें, पेशाब कम आए या दस्त में खून दिखे, तो तुरंत अस्पताल जाएं।"
            )
            followups = [
                "ORS घोल कैसे तैयार करें?",
                "छोटे बच्चे को दस्त है क्या करें?",
                "नजदीकी आशा कार्यकर्ता से संपर्क करें"
            ]
        else:
            reply = (
                "Diarrhea can quickly cause dehydration and electrolyte imbalance.\n\n"
                "**Immediate Steps:**\n"
                "• **ORS Solution:** Mix 1 packet of ORS in 1 liter of clean drinking water and drink regularly after each loose stool.\n"
                "• Drink buttermilk, coconut water, or rice gruel.\n"
                "• Continue feeding light foods (khichdi, curd, bananas).\n\n"
                "**Warning:** If patient cannot retain fluids, has sunken eyes, or has blood in stools, visit hospital immediately."
            )
            followups = [
                "How to prepare ORS at home?",
                "Infant has diarrhea, what to do?",
                "Contact nearest ASHA worker"
            ]
        urgency = "YELLOW"

    # Check for cough / cold / khansi / zukam
    elif any(k in msg_low for k in ["khansi", "cough", "cold", "zukam", "khansi bukhar", "खांसी", "जुकाम"]):
        if is_hi:
            reply = (
                "मौसम बदलने पर सर्दी-खांसी होना आम बात है।\n\n"
                "**घरेलू व सुरक्षित उपाय:**\n"
                "• गुनगुने पानी में नमक डालकर गरारे करें।\n"
                "• गर्म पानी की भाप (Steam) लें और तुलसी, अदरक वाला गर्म काढ़ा पिएं।\n"
                "• धूल और धुएं से बचाव करें।\n\n"
                "**चेतावनी:** यदि खांसी 2 सप्ताह (14 दिन) से अधिक रहे, तो बलगम की जांच सरकारी अस्पताल में निःशुल्क (टीबी जांच) कराएं।"
            )
            followups = [
                "खांसी 2 हफ्ते से ज्यादा है",
                "क्या कफ सिरप लेना चाहिए?",
                "टीबी (TB) जांच कहां होती है?"
            ]
        else:
            reply = (
                "Cough and cold are common respiratory symptoms often caused by seasonal viral changes.\n\n"
                "**Supportive Care:**\n"
                "• Warm saline water gargles 2-3 times daily.\n"
                "• Steam inhalation and warm herbal tea with ginger and tulsi.\n"
                "• Avoid exposure to smoke, dust, and chilled water.\n\n"
                "**Caution:** If cough lasts for more than 2 weeks, visit the nearest PHC for a free sputum test for Tuberculosis (TB)."
            )
            followups = [
                "Cough has lasted over 2 weeks",
                "Can I take over-the-counter cough syrup?",
                "Where can I get tested for TB?"
            ]
        urgency = "GREEN"

    # General greeting or other query
    else:
        if is_hi:
            reply = (
                "नमस्ते! मैं आपका **सेहतसाथी (SehatSaathi AI)** हूँ — आपका स्वास्थ्य साथी।\n\n"
                "मैं ग्रामीण और छोटे शहरों के नागरिकों को सरल भाषा में स्वास्थ्य मार्गदर्शन देने के लिए उपस्थित हूँ।\n"
                "आप मुझसे बोलकर या लिखकर अपने लक्षणों (जैसे बुखार, खांसी, पेट दर्द), जांच रिपोर्ट या नजदीकी अस्पताल के बारे में पूछ सकते हैं।\n\n"
                "कृपया बताएं, आज आप या आपके परिवार में कैसा महसूस हो रहा है?"
            )
            followups = [
                "मुझे दो दिन से बुखार और कमजोरी है",
                "खून की जांच रिपोर्ट का मतलब समझाइए",
                "नजदीकी सरकारी स्वास्थ्य केंद्र खोजें",
                "पूरा लक्षण परीक्षण (Health Check) शुरू करें"
            ]
        else:
            reply = (
                "Namaste! I am **SehatSaathi AI** — Your personal health companion.\n\n"
                "I am designed to assist rural citizens and healthcare workers with voice-first health guidance, symptom triage, lab report explanations, and nearby hospital navigation.\n\n"
                "You can ask me questions by speaking or typing. How may I support your health today?"
            )
            followups = [
                "I have had fever and weakness for 2 days",
                "Help me understand my lab report",
                "Find nearest government health center",
                "Start a complete symptom assessment"
            ]
        urgency = "GREEN"

    summary = {
        "urgency": urgency,
        "query": user_msg,
        "date": "Today",
        "guidance_provided": "General health guidance and conservative self-care information"
    }

    return ChatResponse(
        reply=reply,
        is_emergency=False,
        emergency_actions=[],
        suggested_followups=followups,
        triage_urgency=urgency,
        summary_for_worker=summary
    )

"""
JanSwasthya Setu AI - Conversational AI Healthcare Assistant Service
Features:
- Official OpenAI Python SDK integration supporting Responses API & Chat Completions
- Configurable model via OPENAI_MODEL env var (default: gpt-4o-mini)
- Server-side OPENAI_API_KEY resolution with python-dotenv support
- Immediate Red-Flag Screening Filter for critical medical emergencies
- Clinical safety protocols (non-diagnostic, educational, no unauthorized prescription dosages)
- Safe fallback engine when running offline or without an API key
- Bilingual vernacular support (Hindi, English, Hinglish)
- ASHA worker triage summary generation
"""

import os
import re
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Configure logger
logger = logging.getLogger("janswasthya.ai")

# 1. Load environment variables from backend/.env or root .env
_backend_dir = Path(__file__).resolve().parent
_root_dir = _backend_dir.parent

if (_backend_dir / ".env").exists():
    load_dotenv(_backend_dir / ".env")
elif (_root_dir / ".env").exists():
    load_dotenv(_root_dir / ".env")
else:
    load_dotenv()

# Configuration
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip() or "gpt-4o-mini"
OPENAI_TIMEOUT = float(os.getenv("OPENAI_TIMEOUT", "25.0"))

class ChatMessage(BaseModel):
    role: str  # user | assistant | system
    content: str = Field(..., max_length=4000)

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    language: str = "hi"  # hi | en
    history: List[ChatMessage] = Field(default_factory=list)
    patient_context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    is_emergency: bool = False
    emergency_actions: List[str] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)
    triage_urgency: str = "GREEN"  # RED, YELLOW, GREEN
    summary_for_worker: Optional[Dict[str, Any]] = None
    provider: str = "openai"  # "openai" | "fallback"
    model: Optional[str] = None
    warning: Optional[str] = None

# Red-flag keywords in Hindi, Hinglish, and English
RED_FLAG_PATTERNS = [
    (r"(chest\s*pain|chhati\s*me\s*dard|chhati\s*dard|सीने\s*में\s*दर्द|छाती\s*में\s*दर्द)", "Severe Chest Pain (सीने में तेज दर्द)"),
    (r"(breath|saans\s*lene|saans\s*phool|सांस\s*फूलना|साँस|दम\s*फूलना|दमा\s*का\s*दौरा)", "Difficulty Breathing (सांस लेने में गंभीर कठिनाई)"),
    (r"(unconscious|behoshi|behosh|बेहोश|मूर्छित|चेतना\s*खोना)", "Unconsciousness / Fainting (बेहोशी)"),
    (r"(blood\s*vomit|khoon\s*ki\s*ulti|khoon\s*behna|खून\s*की\s*उल्टी|रक्तस्राव|भारी\s*खून)", "Heavy Bleeding / Blood in Vomit (भारी रक्तस्राव)"),
    (r"(stroke|paralysis|lakwa|लकवा|पक्षाघात|मुंह\s*टेढ़ा|आधा\s*शरीर\s*सुन्न)", "Stroke / Paralysis Signs (लकवा / पक्षाघात)"),
    (r"(snake\s*bite|saap\s*ne\s*kata|saap|सांप\s*ने\s*काटा|सर्पदंश)", "Snake Bite (सर्पदंश)"),
    (r"(poison|zeher|जहर|विष\s*पान|कीटनाशक)", "Poisoning (विषाक्तता / जहर)"),
    (r"(severe\s*burn|aag\s*se\s*jala|गंभीर\s*जलना|आग\s*से\s*झुलसना)", "Severe Burns (गंभीर रूप से जलना)")
]

def screen_for_red_flags(text: str) -> Optional[str]:
    """Screens text for acute, life-threatening symptoms before any LLM latency."""
    text_lower = text.lower()
    for pattern, name in RED_FLAG_PATTERNS:
        if re.search(pattern, text_lower):
            return name
    return None

def build_system_prompt(language: str) -> str:
    """Builds clinical instructions for OpenAI guiding vernacular healthcare support."""
    is_hi = language.lower().startswith("hi")
    target_lang = "Hindi (हिंदी)" if is_hi else "English"

    return f"""You are **JanSwasthya Setu AI (जनस्वास्थ्य सेतु AI)** — an intelligent, empathetic, voice-first healthcare companion purpose-engineered for rural and semi-urban communities across Bharat (India).

### Primary Persona & Purpose:
- Deliver accessible, conservative clinical triage, general health education, pathology lab report explanations, and navigation to public health centers (PHC, CHC, District Hospitals) and local ASHA workers.
- Target audience: Rural citizens, families, and frontline healthcare volunteers (ASHAs).
- User's preferred response language: **{target_lang}**. If the user speaks in Hindi, reply in clear, respectful, natural Hindi (Devanagari script). If English, reply in English. If mixed Hinglish, reply in warm, easily understood Hindi or bilingual English.

### Healthcare Safety & Clinical Rules (MANDATORY):
1. **Understand Intent First:** Directly answer the user's actual question. Never regurgitate repetitive greeting templates or disclaimers unless relevant.
2. **Conservative Triage & Non-Diagnostic:** You are an educational decision-support tool, NOT a licensed physician. Do not provide a definitive medical diagnosis. Frame observations as possibilities to discuss with a doctor.
3. **Medication Safety:** NEVER prescribe personalized prescription drug dosages or advise stopping or altering prescription medicines. You may only mention safe universal supportive measures (e.g., ORS solution for diarrhea, steam inhalation for cold, sponging with normal water for fever).
4. **Emergency Red-Flags:** If symptoms suggest myocardial infarction, stroke, severe respiratory failure, heavy bleeding, snakebite, or poisoning:
   - State clearly: "EMERGENCY / आपातकाल"
   - Instruct to call **108** (Ambulance) or **112** (Emergency) immediately.
   - Advise proceeding immediately to the nearest CHC/Hospital trauma center.
5. **Lab Reports:** Explain reference ranges in everyday terms. Explain what a low or high value generally reflects (e.g., low Hemoglobin indicates anemia) without jumping to alarmist conclusions.
6. **Formatting:** Use structured markdown:
   - Clear bold headings (`**...**`)
   - Bullet points (`- `)
   - Numbered steps for actions (`1. `, `2. `)
   - Plain, vernacular language for medical jargon.
7. **Suggest Follow-ups:** At the very end of your response, provide 3 to 4 short, relevant follow-up questions or next steps the user might want to ask. Separate these clearly on lines starting with `[FOLLOWUP]: `.
8. **Triage Urgency Tag:** On the final line of your response, output exactly one urgency tag:
   `[URGENCY]: GREEN` (Mild / Educational / Routine)
   `[URGENCY]: YELLOW` (Moderate / Needs doctor visit within 24-48h)
   `[URGENCY]: RED` (Urgent / Emergency medical care)
"""

def _call_openai_responses_api(client: Any, model: str, system_prompt: str, user_msg: str, history: List[ChatMessage]) -> str:
    """
    Calls OpenAI using the official Responses API (client.responses.create).
    Falls back to chat.completions if responses API is not supported by the account/model.
    """
    # 1. Try Responses API
    if hasattr(client, "responses") and callable(getattr(client.responses, "create", None)):
        try:
            # Build conversation input for Responses API
            conversation_input = []
            for h in history[-6:]:  # Keep recent turns
                role = "assistant" if h.role == "assistant" else "user"
                conversation_input.append({
                    "role": role,
                    "content": h.content
                })
            conversation_input.append({
                "role": "user",
                "content": user_msg
            })

            response = client.responses.create(
                model=model,
                instructions=system_prompt,
                input=conversation_input,
            )

            # Extract output text
            if hasattr(response, "output_text") and response.output_text:
                return response.output_text
            
            # Inspect output structure if output_text is not directly present
            if hasattr(response, "output") and response.output:
                chunks = []
                for item in response.output:
                    if hasattr(item, "content"):
                        for c in item.content:
                            if hasattr(c, "text"):
                                chunks.append(c.text)
                if chunks:
                    return "".join(chunks)
        except Exception as e:
            logger.warning(f"Responses API call failed, trying chat.completions fallback: {e}")

    # 2. Fallback to Chat Completions API
    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-6:]:
        role = "assistant" if h.role == "assistant" else "user"
        messages.append({"role": role, "content": h.content})
    messages.append({"role": "user", "content": user_msg})

    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.4,
        max_tokens=900
    )
    return completion.choices[0].message.content or ""

def _parse_llm_output(raw_text: str, default_language: str) -> tuple[str, str, List[str]]:
    """Extracts cleaned reply, triage urgency, and suggested follow-ups from model output."""
    is_hi = default_language.lower().startswith("hi")
    triage_urgency = "GREEN"
    followups: List[str] = []

    # Extract [URGENCY]: GREEN/YELLOW/RED
    urgency_match = re.search(r"\[URGENCY\]:\s*(RED|YELLOW|GREEN)", raw_text, re.IGNORECASE)
    if urgency_match:
        triage_urgency = urgency_match.group(1).upper()
        raw_text = re.sub(r"\[URGENCY\]:\s*(RED|YELLOW|GREEN)", "", raw_text, flags=re.IGNORECASE)

    # Extract [FOLLOWUP]: ...
    for match in re.finditer(r"\[FOLLOWUP\]:\s*(.+)", raw_text):
        item = match.group(1).strip()
        if item and len(item) < 120:
            followups.append(item)
    raw_text = re.sub(r"\[FOLLOWUP\]:\s*(.+)", "", raw_text)

    # Clean trailing whitespace
    clean_reply = raw_text.strip()

    # Provide default followups if model didn't provide enough
    if len(followups) < 2:
        if is_hi:
            followups = [
                "क्या मुझे नजदीकी पीएचसी (PHC) जाना चाहिए?",
                "इसके लिए क्या घरेलू सावधानियां बरतें?",
                "खून की जांच कराने की आवश्यकता है क्या?"
            ]
        else:
            followups = [
                "Should I visit the nearest PHC hospital?",
                "What home precautions should I take?",
                "Are any diagnostic tests recommended?"
            ]

    return clean_reply, triage_urgency, followups[:4]

def _generate_fallback_response(user_msg: str, language: str) -> ChatResponse:
    """Safe, conservative, offline rule-based response engine when OpenAI is unavailable."""
    msg_low = user_msg.lower()
    is_hi = language.lower().startswith("hi")

    if any(k in msg_low for k in ["bukhar", "fever", "tapman", "बुखार", "ताप"]):
        urgency = "YELLOW"
        if is_hi:
            reply = (
                "**बुखार संबंधी प्राथमिक स्वास्थ्य मार्गदर्शन:**\n\n"
                "बुखार आमतौर पर किसी संक्रमण के विरुद्ध शरीर की स्वाभाविक रक्षा प्रतिक्रिया होती है।\n\n"
                "**तत्काल सावधानियां:**\n"
                "- **तरल पदार्थ:** स्वच्छ उबला पानी, दाल का पानी या ओआरएस (ORS) घोल पर्याप्त मात्रा में पिएं।\n"
                "- **आराम व तापमान नियंत्रण:** सामान्य पानी में भीगे कपड़े से माथे पर पट्टी रखें।\n"
                "- **चिकित्सक परामर्श:** यदि बुखार 3 दिनों से अधिक रहे, 102°F से ऊपर जाए, या तेज ठंड लगे, तो नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) जाकर मलेरिया/डेंगू की जांच कराएं।"
            )
            followups = [
                "बुखार 2 दिन से है और सिरदर्द है",
                "बच्चे को बुखार है, क्या करें?",
                "नजदीकी सरकारी स्वास्थ्य केंद्र कहां है?"
            ]
        else:
            reply = (
                "**Primary Guidance for Fever:**\n\n"
                "Fever is commonly the body's immune response to an infection.\n\n"
                "**Supportive Measures:**\n"
                "- **Hydration:** Drink boiled water, clear soups, or ORS to prevent dehydration.\n"
                "- **Temperature management:** Apply normal water wet cloth compress to forehead.\n"
                "- **Doctor consultation:** If fever lasts longer than 2-3 days, exceeds 102°F, or has severe chills, visit your nearest Primary Health Centre (PHC) for diagnostic screening."
            )
            followups = [
                "Fever has lasted 2 days with headache",
                "Patient is a child, what to do?",
                "Where is the nearest PHC hospital?"
            ]

    elif any(k in msg_low for k in ["dast", "diarrhea", "pet kharab", "loose motion", "दस्त", "उल्टी", "पेट खराब"]):
        urgency = "YELLOW"
        if is_hi:
            reply = (
                "**दस्त एवं उल्टी संबंधी जीवन-रक्षक उपाय:**\n\n"
                "दस्त में सबसे बड़ा जोखिम निर्जलीकरण (Dehydration) का होता है।\n\n"
                "**तत्काल कदम:**\n"
                "1. **ओआरएस (ORS) घोल:** 1 पैकेट ओआरएस 1 लीटर साफ उबले ठंडे पानी में घोलकर हर दस्त के बाद 1 कप पिएं।\n"
                "2. **घरेलू तरल:** नारियल पानी, छाछ या नमक-चीनी का घोल दें।\n"
                "3. **चेतावनी संकेत:** यदि आंखें धंसें, पेशाब कम आए या कमजोरी अत्यधिक हो, तो तुरंत अस्पताल ले जाएं।"
            )
            followups = [
                "घर पर ओआरएस कैसे बनाएं?",
                "बच्चे को दस्त और उल्टी है",
                "नजदीकी आशा दीदी से संपर्क करें"
            ]
        else:
            reply = (
                "**Management of Diarrhea and Dehydration:**\n\n"
                "The primary danger in diarrhea is dehydration and electrolyte loss.\n\n"
                "**Immediate Actions:**\n"
                "1. **ORS Solution:** Mix 1 packet of ORS in 1 liter of safe drinking water and consume regularly after each loose stool.\n"
                "2. **Hydration:** Consume buttermilk, coconut water, and rice kanji.\n"
                "3. **Warning Signs:** If patient has sunken eyes, lethargy, or unable to drink, visit hospital promptly."
            )
            followups = [
                "How to prepare ORS at home?",
                "Child has diarrhea and vomiting",
                "Contact local ASHA health worker"
            ]

    elif any(k in msg_low for k in ["khansi", "cough", "cold", "zukam", "खांसी", "जुकाम", "गला खराब"]):
        urgency = "GREEN"
        if is_hi:
            reply = (
                "**सर्दी एवं खांसी के लिए घरेलू व प्राथमिक देखभाल:**\n\n"
                "मौसम के बदलाव या वायरल संक्रमण में सामान्य सर्दी-खांसी होना आम है।\n\n"
                "- **गरारे:** गुनगुने पानी में थोड़ा नमक डालकर दिन में 2-3 बार गरारे करें।\n"
                "- **भाप:** सादे गर्म पानी की भाप (Steam) लें और तुलसी, अदरक का काढ़ा पिएं।\n"
                "- **चेतावनी:** यदि खांसी 2 सप्ताह (14 दिन) से अधिक रहे या बलगम में खून दिखे, तो सरकारी स्वास्थ्य केंद्र पर निःशुल्क टीबी (TB) जांच कराएं।"
            )
            followups = [
                "खांसी 2 हफ्ते से अधिक है",
                "क्या कफ सिरप लेना चाहिए?",
                "नजदीकी सरकारी अस्पताल कहां है?"
            ]
        else:
            reply = (
                "**Care for Cough and Cold:**\n\n"
                "Seasonal respiratory symptoms are usually viral and self-limiting.\n\n"
                "- **Gargles:** Warm saline water gargles 2-3 times daily.\n"
                "- **Steam & Fluids:** Steam inhalation and warm fluids (ginger/tulsi tea).\n"
                "- **Caution:** If cough persists for more than 2 weeks, visit the nearest PHC for a free Tuberculosis (TB) screening test."
            )
            followups = [
                "Cough has lasted more than 2 weeks",
                "Should I take cough syrup?",
                "Find nearest public health facility"
            ]

    else:
        urgency = "GREEN"
        if is_hi:
            reply = (
                "नमस्ते! मैं आपका **जनस्वास्थ्य सेतु AI (JanSwasthya Setu AI)** साथी हूँ।\n\n"
                "आप मुझसे किसी भी स्वास्थ्य लक्षण (जैसे बुखार, खांसी, पेट दर्द), खून की जांच रिपोर्ट का अर्थ, गर्भावस्था व शिशु देखभाल, या नजदीकी सरकारी स्वास्थ्य केंद्र (PHC/CHC) के बारे में पूछ सकते हैं।\n\n"
                "कृपया अपनी समस्या विस्तार से बताएं ताकि सही प्राथमिक मार्गदर्शन दिया जा सके।"
            )
            followups = [
                "मुझे 2 दिन से बुखार और बदन दर्द है",
                "खून की जांच रिपोर्ट समझाइए",
                "नजदीकी स्वास्थ्य केंद्र खोजें",
                "पूर्ण लक्षण परीक्षण (Triage) शुरू करें"
            ]
        else:
            reply = (
                "Namaste! I am **JanSwasthya Setu AI** — your voice-first healthcare companion.\n\n"
                "You can ask about symptoms (fever, cough, pain), understand blood test reports, ask about maternal care, or locate public health facilities.\n\n"
                "How may I support your health today? Please describe what you are experiencing."
            )
            followups = [
                "I have fever and body ache for 2 days",
                "Help me understand my lab report",
                "Find nearest government health center",
                "Start full clinical triage assessment"
            ]

    return ChatResponse(
        reply=reply,
        is_emergency=False,
        emergency_actions=[],
        suggested_followups=followups,
        triage_urgency=urgency,
        provider="fallback",
        model="offline-triage-engine",
        warning="Running in offline fallback mode. Configure OPENAI_API_KEY in backend environment to enable full GPT-4o intelligence."
    )

def generate_saathi_response(req: ChatRequest) -> ChatResponse:
    """
    Main entry point for JanSwasthya Setu AI Chatbot.
    1. First checks for acute Red-Flag medical emergencies (immediate 108/112 intervention).
    2. If OPENAI_API_KEY is available, queries OpenAI using Responses API / Chat Completions.
    3. If OPENAI_API_KEY is missing or fails, gracefully falls back to the safe clinical rule engine.
    """
    user_msg = req.message.strip()
    lang = req.language.lower()
    is_hi = lang.startswith("hi")

    # -------------------------------------------------------------
    # Step 1: Acute Red-Flag Screening Filter
    # -------------------------------------------------------------
    red_flag = screen_for_red_flags(user_msg)
    if red_flag:
        if is_hi:
            reply = (
                f"🚨 **अति आवश्यक चेतावनी: {red_flag} के संकेत मिले हैं!**\n\n"
                "यह एक संभावित आपातकालीन चिकित्सीय स्थिति (Medical Emergency) हो सकती है। "
                "घरेलू उपचार या चैटबॉट सलाह की प्रतीक्षा न करें। कृपया तुरंत कदम उठाएं:\n\n"
                "1. तुरंत **108** (सरकारी निःशुल्क एम्बुलेंस) या **112** (आपातकालीन सेवा) पर कॉल करें।\n"
                "2. मरीज को सुरक्षित, आरामदायक स्थिति में रखें और भीड़ न लगाएं।\n"
                "3. अपनी स्थानीय **आशा कार्यकर्ता (ASHA Worker)** को तुरंत फोन करें।\n"
                "4. निकटतम सामुदायिक स्वास्थ्य केंद्र (CHC) या जिला अस्पताल की इमरजेंसी में पहुंचें।"
            )
            actions = [
                "108 निःशुल्क एम्बुलेंस तुरंत कॉल करें",
                "स्थानीय आशा कार्यकर्ता को सूचित करें",
                "नजदीकी सीएचसी / जिला अस्पताल की इमरजेंसी में जाएं"
            ]
            followups = [
                "108 एम्बुलेंस बुलाई जा चुकी है",
                "नजदीकी अस्पताल का आपातकालीन नंबर",
                "मरीज को तुरंत क्या प्राथमिक उपचार दें?"
            ]
        else:
            reply = (
                f"🚨 **URGENT MEDICAL EMERGENCY ALERT: Detected {red_flag}!**\n\n"
                "Your reported symptom indicates a potentially life-threatening medical emergency. "
                "Do not wait for home remedies or online chat. Please take immediate action:\n\n"
                "1. Dial **108** (Free Emergency Ambulance) or **112** immediately.\n"
                "2. Keep the patient in a calm and safe posture; do not leave unattended.\n"
                "3. Notify your local **ASHA healthcare worker** or village health volunteer.\n"
                "4. Proceed to the nearest Community Health Centre (CHC) or District Hospital emergency department."
            )
            actions = [
                "Call 108 Emergency Ambulance immediately",
                "Alert local ASHA worker",
                "Proceed to nearest CHC or District Hospital emergency"
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
            summary_for_worker=summary,
            provider="safety-filter",
            model="red-flag-detector"
        )

    # -------------------------------------------------------------
    # Step 2: OpenAI API Integration
    # -------------------------------------------------------------
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    model_name = os.getenv("OPENAI_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL

    if api_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key, timeout=OPENAI_TIMEOUT)
            system_prompt = build_system_prompt(lang)

            raw_output = _call_openai_responses_api(
                client=client,
                model=model_name,
                system_prompt=system_prompt,
                user_msg=user_msg,
                history=req.history
            )

            if raw_output:
                clean_reply, urgency, followups = _parse_llm_output(raw_output, lang)
                summary = {
                    "urgency": urgency,
                    "query": user_msg,
                    "date": "Today",
                    "source": "OpenAI Healthcare Intelligence"
                }
                return ChatResponse(
                    reply=clean_reply,
                    is_emergency=(urgency == "RED"),
                    emergency_actions=[
                        "Call 108 Ambulance if symptoms worsen",
                        "Visit nearest Primary Health Centre (PHC)"
                    ] if urgency == "RED" else [],
                    suggested_followups=followups,
                    triage_urgency=urgency,
                    summary_for_worker=summary,
                    provider="openai",
                    model=model_name
                )
        except Exception as e:
            logger.error(f"OpenAI service call failed: {e}", exc_info=True)
            # Log error internally without exposing credentials or stack traces to client

    # -------------------------------------------------------------
    # Step 3: Fallback Clinical Engine (Zero-Crash Guarantee)
    # -------------------------------------------------------------
    return _generate_fallback_response(user_msg, lang)

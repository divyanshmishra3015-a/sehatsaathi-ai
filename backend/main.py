"""
JanSwasthya Setu AI - FastAPI Application
The AI-Powered Voice-First Healthcare Assistance Platform for Rural Bharat.

Tagline: "Bridging Bharat to Intelligent Healthcare" / "जन-जन तक स्वास्थ्य का डिजिटल सेतु"
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from triage_engine import evaluate_triage, SymptomAssessmentInput, TriageResult, RED_FLAG_CATALOG
from facilities_data import search_facilities, FACILITIES_DB
from report_parser import parse_report_text, SAMPLE_REPORTS, ReportAnalysisResponse
from ai_service import generate_saathi_response, ChatRequest, ChatResponse
import database as db

app = FastAPI(
    title="JanSwasthya Setu AI Backend",
    version="1.0.0",
    description="Multilingual Voice-First Healthcare & Triage API for Bharat"
)

# Enable CORS for frontend Vite development & local network access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def root():
    return {
        "project": "JanSwasthya Setu AI",
        "tagline": "Bridging Bharat to Intelligent Healthcare",
        "version": "1.0.0",
        "status": "online",
        "supported_languages": ["hi", "en"],
        "disclaimer": "Informational triage and healthcare navigation aid. Not a substitute for licensed medical evaluation."
    }

# 1. AI Health Saathi Chatbot Endpoint
@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    return generate_saathi_response(request)

# 2. Symptom Triage Assessment Endpoint
@app.post("/api/triage", response_model=TriageResult)
def triage_endpoint(data: SymptomAssessmentInput):
    result = evaluate_triage(data)
    # Save to history for ASHA worker and user review
    db.ASSESSMENTS_HISTORY.insert(0, {
        "assessment_id": result.assessment_id,
        "patient_name": data.patient_name,
        "age_group": data.age_group,
        "main_symptoms": data.main_symptoms,
        "duration_days": data.duration_days,
        "severity": data.severity,
        "urgency": result.urgency,
        "created_at": result.created_at,
        "summary": result.headline_en
    })
    return result

@app.get("/api/triage/red-flags")
def get_red_flag_catalog():
    return RED_FLAG_CATALOG

# 3. Medical Report Parser & Explainer
@app.get("/api/reports/samples")
def list_sample_reports():
    return {
        key: {
            "name": val["name"],
            "name_hi": val["name_hi"],
            "patient": val["patient"]
        }
        for key, val in SAMPLE_REPORTS.items()
    }

@app.get("/api/reports/sample/{sample_key}", response_model=ReportAnalysisResponse)
def get_sample_report_analysis(sample_key: str):
    if sample_key not in SAMPLE_REPORTS:
        raise HTTPException(status_code=404, detail="Sample report not found")
    sample = SAMPLE_REPORTS[sample_key]
    return parse_report_text(sample["raw_text"], sample["patient"]["name"])

@app.post("/api/reports/analyze", response_model=ReportAnalysisResponse)
async def analyze_report_upload(
    report_text: Optional[str] = Form(None),
    patient_name: Optional[str] = Form("Demo Citizen"),
    file: Optional[UploadFile] = File(None)
):
    text_content = ""
    if file:
        content_bytes = await file.read()
        try:
            # Decode utf-8 text or extract printable strings
            text_content = content_bytes.decode("utf-8", errors="ignore")
        except Exception:
            text_content = ""

    if report_text:
        text_content += "\n" + report_text

    if not text_content.strip():
        # Fallback to standard CBC sample if empty payload
        text_content = SAMPLE_REPORTS["cbc_anemia"]["raw_text"]

    return parse_report_text(text_content, patient_name)

# 4. Healthcare Facilities Finder
@app.get("/api/facilities")
def get_facilities(
    q: Optional[str] = Query(None),
    facility_type: Optional[str] = Query("ALL"),
    district: Optional[str] = Query(None),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None)
):
    return search_facilities(
        query=q,
        facility_type=facility_type,
        user_lat=lat,
        user_lng=lng,
        district=district
    )

# 5. ASHA & Healthcare Worker Endpoints
@app.get("/api/patients")
def list_patients(search: Optional[str] = None):
    if not search:
        return db.PATIENTS
    s = search.lower()
    return [p for p in db.PATIENTS if s in p["name"].lower() or s in p["village"].lower() or s in p.get("phone", "")]

@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: str):
    for p in db.PATIENTS:
        if p["id"] == patient_id:
            return p
    raise HTTPException(status_code=404, detail="Patient record not found")

@app.post("/api/patients")
def register_patient(patient_data: Dict[str, Any]):
    new_patient = {
        "id": f"pat_{str(uuid.uuid4())[:6]}",
        "name": patient_data.get("name", "New Citizen"),
        "age": patient_data.get("age", 30),
        "gender": patient_data.get("gender", "Female"),
        "village": patient_data.get("village", "Cholapur"),
        "phone": patient_data.get("phone", "+91 99999 00000"),
        "abha_id": patient_data.get("abha_id", f"91-{str(uuid.uuid4())[:4]}-4433"),
        "category": patient_data.get("category", "General"),
        "last_visit": datetime.now().strftime("%Y-%m-%d"),
        "triage_status": patient_data.get("triage_status", "GREEN"),
        "symptoms": patient_data.get("symptoms", "Routine registration"),
        "assigned_worker": "Radha Maurya",
        "notes": patient_data.get("notes", "New patient registered with informed consent.")
    }
    db.PATIENTS.insert(0, new_patient)
    return new_patient

# 6. Reminders System
@app.get("/api/reminders")
def get_reminders(patient_id: Optional[str] = None):
    if patient_id:
        return [r for r in db.REMINDERS if r.get("patient_id") == patient_id]
    return db.REMINDERS

@app.post("/api/reminders")
def create_reminder(reminder_data: Dict[str, Any]):
    new_reminder = {
        "id": f"rem_{str(uuid.uuid4())[:6]}",
        "patient_id": reminder_data.get("patient_id", "pat_01"),
        "patient_name": reminder_data.get("patient_name", "Sunita Devi"),
        "title": reminder_data.get("title", "Health Follow-up"),
        "title_hi": reminder_data.get("title_hi", reminder_data.get("title", "स्वास्थ्य जांच")),
        "due_date": reminder_data.get("due_date", (datetime.now()).strftime("%Y-%m-%d")),
        "type": reminder_data.get("type", "Follow-up"),
        "facility": reminder_data.get("facility", "PHC Cholapur"),
        "completed": False,
        "urgency": reminder_data.get("urgency", "normal")
    }
    db.REMINDERS.insert(0, new_reminder)
    return new_reminder

@app.patch("/api/reminders/{reminder_id}/toggle")
def toggle_reminder(reminder_id: str):
    for r in db.REMINDERS:
        if r["id"] == reminder_id:
            r["completed"] = not r.get("completed", False)
            return r
    raise HTTPException(status_code=404, detail="Reminder not found")

@app.delete("/api/reminders/{reminder_id}")
def delete_reminder(reminder_id: str):
    for idx, r in enumerate(db.REMINDERS):
        if r["id"] == reminder_id:
            return db.REMINDERS.pop(idx)
    raise HTTPException(status_code=404, detail="Reminder not found")

# 7. Assessments & Analytics
@app.get("/api/assessments")
def list_assessments():
    return db.ASSESSMENTS_HISTORY

@app.get("/api/admin/analytics")
def get_admin_analytics():
    return db.get_community_analytics()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


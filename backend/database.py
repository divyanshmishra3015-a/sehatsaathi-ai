"""
SehatSaathi AI - In-Memory / SQLite Database and Persistence Layer
Includes pre-seeded realistic rural Indian health records for ASHA workers,
patients, symptom assessments, follow-ups, and admin analytics.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid

# In-Memory persistent store for demonstration & production-style runtime
USERS = [
    {
        "id": "usr_patient_01",
        "email": "sunita.devi@ruralhealth.org",
        "name": "Sunita Devi",
        "role": "patient",
        "phone": "+91 98765 43210",
        "village": "Cholapur",
        "district": "Varanasi",
        "abha_id": "91-2345-6789-0123"
    },
    {
        "id": "usr_worker_01",
        "email": "asha.radha@ruralhealth.org",
        "name": "Radha Maurya (ASHA Worker)",
        "role": "asha_worker",
        "phone": "+91 94150 11223",
        "village": "Cholapur Cluster",
        "district": "Varanasi",
        "assigned_phc": "PHC Cholapur"
    },
    {
        "id": "usr_admin_01",
        "email": "dr.sharma@healthdept.gov.in",
        "name": "Dr. V. K. Sharma (CMO / Admin)",
        "role": "admin",
        "phone": "+91 94500 99887",
        "district": "Varanasi Division"
    }
]

PATIENTS: List[Dict[str, Any]] = [
    {
        "id": "pat_01",
        "name": "Sunita Devi",
        "age": 28,
        "gender": "Female",
        "village": "Cholapur, Tola 2",
        "phone": "+91 98765 43210",
        "abha_id": "91-2345-6789-0123",
        "category": "Pregnant (ANC 3rd Trimester)",
        "last_visit": (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"),
        "triage_status": "YELLOW",
        "symptoms": "Mild fever, fatigue, hemoglobin 9.2 g/dL",
        "assigned_worker": "Radha Maurya",
        "notes": "Prescribed iron-folic acid tablets. Advised rest and weekly BP monitoring."
    },
    {
        "id": "pat_02",
        "name": "Ramesh Chandra",
        "age": 54,
        "gender": "Male",
        "village": "Shivpur Rural",
        "phone": "+91 97920 88765",
        "abha_id": "91-8899-4455-1234",
        "category": "NCD / Type-2 Diabetic",
        "last_visit": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
        "triage_status": "YELLOW",
        "symptoms": "High fasting blood sugar (168 mg/dL), polyuria",
        "assigned_worker": "Radha Maurya",
        "notes": "Referral to CHC Kashi Rural for physician evaluation and diet plan."
    },
    {
        "id": "pat_03",
        "name": "Arjun Kumar (Child)",
        "age": 4,
        "gender": "Male",
        "village": "Babatpur Tola",
        "phone": "+91 94555 33441",
        "abha_id": "91-7711-2233-9988",
        "category": "Pediatric",
        "last_visit": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "triage_status": "GREEN",
        "symptoms": "Mild seasonal cough, active, good appetite",
        "assigned_worker": "Radha Maurya",
        "notes": "Home remedies, warm water, follow-up scheduled for routine measles booster."
    },
    {
        "id": "pat_04",
        "name": "Kailash Nath",
        "age": 67,
        "gender": "Male",
        "village": "Cholapur Ward 4",
        "phone": "+91 91234 56789",
        "abha_id": "91-5566-7788-9900",
        "category": "Elderly / Hypertension",
        "last_visit": (datetime.now() - timedelta(hours=18)).strftime("%Y-%m-%d"),
        "triage_status": "RED",
        "symptoms": "Sudden severe chest pressure, SpO2 91%, profuse sweating",
        "assigned_worker": "Radha Maurya",
        "notes": "Escalated immediately via 108 ambulance to District Hospital Trauma ICU."
    }
]

ASSESSMENTS_HISTORY: List[Dict[str, Any]] = [
    {
        "assessment_id": "SSA-20261004-98A1B2",
        "patient_name": "Sunita Devi",
        "age_group": "pregnant",
        "main_symptoms": ["fever", "fatigue"],
        "duration_days": 2,
        "severity": "moderate",
        "urgency": "YELLOW",
        "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "summary": "ANC patient with low-grade fever and mild fatigue. Advised PHC visit."
    },
    {
        "assessment_id": "SSA-20261005-44C9D3",
        "patient_name": "Kailash Nath",
        "age_group": "elderly",
        "main_symptoms": ["chest_pain", "breathing"],
        "duration_days": 1,
        "severity": "severe",
        "urgency": "RED",
        "created_at": (datetime.now() - timedelta(hours=6)).isoformat(),
        "summary": "Urgent escalation: Severe chest pain with dyspnea. Dialed 108 ambulance."
    },
    {
        "assessment_id": "SSA-20261005-11E2F5",
        "patient_name": "Arjun Kumar",
        "age_group": "child",
        "main_symptoms": ["cough"],
        "duration_days": 1,
        "severity": "mild",
        "urgency": "GREEN",
        "created_at": (datetime.now() - timedelta(hours=2)).isoformat(),
        "summary": "Mild cough. Hydration, warm fluids, observation at home."
    }
]

REMINDERS: List[Dict[str, Any]] = [
    {
        "id": "rem_01",
        "patient_id": "pat_01",
        "patient_name": "Sunita Devi",
        "title": "3rd Trimester ANC Checkup & Hb Re-test",
        "title_hi": "तीसरी तिमाही एएनसी जांच एवं हीमोग्लोबिन टेस्ट",
        "due_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
        "type": "Maternal Visit",
        "facility": "PHC Cholapur",
        "completed": False,
        "urgency": "high"
    },
    {
        "id": "rem_02",
        "patient_id": "pat_02",
        "patient_name": "Ramesh Chandra",
        "title": "Fasting Sugar & HbA1c Follow-up",
        "title_hi": "खाली पेट ब्लड शुगर एवं एचबीए1सी जांच",
        "due_date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "type": "NCD Follow-up",
        "facility": "CHC Kashi Rural",
        "completed": False,
        "urgency": "medium"
    },
    {
        "id": "rem_03",
        "patient_id": "pat_03",
        "patient_name": "Arjun Kumar",
        "title": "Measles-Rubella (MR) Booster Vaccination",
        "title_hi": "खसरा-रूबेला (एमआर) बूस्टर टीकाकरण",
        "due_date": (datetime.now() + timedelta(days=8)).strftime("%Y-%m-%d"),
        "type": "Immunization",
        "facility": "Arogya Mandir Babatpur",
        "completed": False,
        "urgency": "normal"
    }
]

def get_community_analytics() -> Dict[str, Any]:
    total_patients = len(PATIENTS)
    total_assessments = len(ASSESSMENTS_HISTORY)
    red_count = sum(1 for a in ASSESSMENTS_HISTORY if a.get("urgency") == "RED")
    yellow_count = sum(1 for a in ASSESSMENTS_HISTORY if a.get("urgency") == "YELLOW")
    green_count = sum(1 for a in ASSESSMENTS_HISTORY if a.get("urgency") == "GREEN")
    pending_reminders = sum(1 for r in REMINDERS if not r.get("completed"))

    urgency_distribution = [
        {"name": "Urgent (RED)", "value": red_count, "color": "#ef4444"},
        {"name": "Consult Doctor (YELLOW)", "value": yellow_count, "color": "#f59e0b"},
        {"name": "Self Care (GREEN)", "value": green_count, "color": "#10b981"}
    ]

    weekly_trends = [
        {"day": "Mon", "assessments": 14, "urgent": 2, "asha_visits": 8},
        {"day": "Tue", "assessments": 18, "urgent": 1, "asha_visits": 11},
        {"day": "Wed", "assessments": 22, "urgent": 3, "asha_visits": 15},
        {"day": "Thu", "assessments": 19, "urgent": 0, "asha_visits": 9},
        {"day": "Fri", "assessments": 25, "urgent": 4, "asha_visits": 14},
        {"day": "Sat", "assessments": 31, "urgent": 2, "asha_visits": 18},
        {"day": "Sun", "assessments": 16, "urgent": 1, "asha_visits": 7}
    ]

    top_symptoms = [
        {"symptom": "Fever / Bukhar", "count": 48},
        {"symptom": "Cough / Respiratory", "count": 32},
        {"symptom": "Diarrhea / GI", "count": 21},
        {"symptom": "High Blood Sugar", "count": 18},
        {"symptom": "Severe Chest Pain (Escalated)", "count": 6}
    ]

    return {
        "total_registered_patients": total_patients + 142, # Realistic cluster count
        "total_assessments_completed": total_assessments + 328,
        "active_followups_due": pending_reminders,
        "active_asha_workers": 12,
        "urgency_distribution": urgency_distribution,
        "weekly_trends": weekly_trends,
        "top_symptoms": top_symptoms,
        "facility_coverage": {
            "phcs_active": 4,
            "chcs_active": 2,
            "district_hospitals": 1,
            "sub_centres": 8
        },
        "is_demo_data": True
    }

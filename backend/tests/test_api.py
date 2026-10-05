"""
API integration tests for SehatSaathi AI backend
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_status():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "SehatSaathi AI"
    assert "disclaimer" in data

def test_facilities_search():
    response = client.get("/api/facilities?q=Varanasi")
    assert response.status_code == 200
    facilities = response.json()
    assert len(facilities) > 0
    assert any("Varanasi" in f["district"] for f in facilities)

def test_facilities_filter_by_type():
    response = client.get("/api/facilities?facility_type=PHC")
    assert response.status_code == 200
    facilities = response.json()
    assert all(f["type"] == "PHC" for f in facilities)

def test_reports_sample_cbc():
    response = client.get("/api/reports/sample/cbc_anemia")
    assert response.status_code == 200
    data = response.json()
    assert len(data["biomarkers"]) > 0
    # Hemoglobin 9.2 should be marked LOW
    hb = next(b for b in data["biomarkers"] if "Hemoglobin" in b["test_name"])
    assert hb["status"] == "LOW"

def test_chat_emergency_escalation():
    response = client.post("/api/chat", json={
        "message": "Patient is having severe chest pain and breathlessness",
        "language": "en"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["is_emergency"] is True
    assert data["triage_urgency"] == "RED"
    assert "108" in data["reply"]

def test_reminders_crud():
    # 1. Create reminder
    res = client.post("/api/reminders", json={
        "patient_name": "Test Citizen",
        "title": "ANC 2nd Visit",
        "due_date": "2026-10-10",
        "type": "ANC"
    })
    assert res.status_code == 200
    rem = res.json()
    rem_id = rem["id"]
    assert rem["completed"] is False

    # 2. Toggle reminder
    res_toggle = client.patch(f"/api/reminders/{rem_id}/toggle")
    assert res_toggle.status_code == 200
    assert res_toggle.json()["completed"] is True

    # 3. Delete reminder
    res_del = client.delete(f"/api/reminders/{rem_id}")
    assert res_del.status_code == 200

"""
Unit Tests for SehatSaathi AI Clinical Triage Engine
Validates red-flag safety escalations, conservative clinical triage paths, and bilingual generation.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from triage_engine import evaluate_triage, SymptomAssessmentInput, RED_FLAG_CATALOG
from ai_service import screen_for_red_flags

def test_explicit_red_flag_triggers_urgent_red():
    """Test that selecting any explicit emergency red flag guarantees RED urgency."""
    payload = SymptomAssessmentInput(
        patient_name="Test Patient",
        age_group="adult",
        main_symptoms=["chest_pain"],
        duration_days=1,
        severity="severe",
        has_red_flags=["chest_pain_severe"],
        language="en"
    )
    result = evaluate_triage(payload)
    assert result.urgency == "RED"
    assert "108" in result.emergency_contact
    assert any("chest pain" in r.lower() for r in result.reasoning_en)
    assert len(result.immediate_actions_en) > 0

def test_infant_high_fever_escalates_to_red():
    """Test that high fever in an infant (< 1 year) triggers emergency escalation."""
    payload = SymptomAssessmentInput(
        patient_name="Baby Rahul",
        age_group="infant",
        main_symptoms=["fever"],
        duration_days=1,
        severity="moderate",
        temperature_f=102.5,
        has_red_flags=[],
        language="hi"
    )
    result = evaluate_triage(payload)
    assert result.urgency == "RED"
    assert "शिशु" in result.reasoning_hi[0]

def test_critically_low_oxygen_escalates_to_red():
    """Test that blood oxygen saturation (SpO2) below 92% triggers RED urgency."""
    payload = SymptomAssessmentInput(
        patient_name="Elderly Citizen",
        age_group="elderly",
        main_symptoms=["breathing"],
        duration_days=1,
        severity="moderate",
        oxygen_saturation=89,
        has_red_flags=[],
        language="en"
    )
    result = evaluate_triage(payload)
    assert result.urgency == "RED"
    assert any("89%" in r for r in result.reasoning_en)

def test_moderate_symptom_yields_yellow_consultation():
    """Test that persistent symptoms (> 2 days) or moderate severity guide user to PHC doctor (YELLOW)."""
    payload = SymptomAssessmentInput(
        patient_name="Geeta Devi",
        age_group="adult",
        main_symptoms=["fever", "headache"],
        duration_days=3,
        severity="moderate",
        has_red_flags=[],
        language="hi"
    )
    result = evaluate_triage(payload)
    assert result.urgency == "YELLOW"
    assert "प्राथमिक स्वास्थ्य केंद्र" in result.recommendation_hi or "आशा" in result.recommendation_hi

def test_mild_symptom_yields_green_self_care():
    """Test that mild, short duration symptoms without red flags produce GREEN urgency."""
    payload = SymptomAssessmentInput(
        patient_name="Vijay",
        age_group="adult",
        main_symptoms=["mild_fatigue"],
        duration_days=1,
        severity="mild",
        has_red_flags=[],
        language="en"
    )
    result = evaluate_triage(payload)
    assert result.urgency == "GREEN"
    assert "Supportive Care" in result.headline_en

def test_chatbot_red_flag_screener_keyword_detection():
    """Test that the chatbot screening layer catches Hindi and English emergency phrases."""
    assert screen_for_red_flags("Mujhe chhati me dard ho raha hai") is not None
    assert screen_for_red_flags("Severe chest pain radiating to left arm") is not None
    assert screen_for_red_flags("Patient is unconscious") is not None
    assert screen_for_red_flags("मरीज को सांस लेने में बहुत तकलीफ हो रही है") is not None
    assert screen_for_red_flags("Normal cold and running nose") is None

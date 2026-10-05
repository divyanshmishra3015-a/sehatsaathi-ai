# SehatSaathi AI (सेहत साथी AI) 🩺🇮🇳
> **"Your Health, Your Language, Your Saathi"**  
> *आपकी सेहत, आपकी भाषा, आपका साथी*

[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 📖 Overview

**SehatSaathi AI** is an AI-powered, multilingual, voice-first healthcare assistance and navigation platform purpose-built for rural and semi-urban communities in India. It bridges the critical healthcare access gap caused by geographical isolation, low health literacy, and vernacular language barriers.

By combining voice AI in native languages with clinical triage protocols, simplified medical report explanations, geo-aware public healthcare facility locator, and dedicated workflows for frontline **ASHA (Accredited Social Health Activist)** workers, SehatSaathi AI empowers citizens to seek timely care while reducing preventable complications.

---

## 🌟 Key Features

### 1. 🎙️ Voice-First Multilingual AI Saathi
- Seamless **bi-directional voice interaction** in Hindi and English powered by Web Speech API.
- Converts complex medical jargon into warm, conversational, culturally sensitive health guidance.
- Instant **Emergency Red-Flag Escalation**: Automatically detects critical symptoms (severe chest pain, stroke signs, acute breathlessness) and directs users to dial **108** for emergency medical services.

### 2. 🚦 Clinical Symptom Triage Engine
- Interactive symptom assessment based on established triage protocols.
- Categorizes urgency into standardized triage levels:
  - 🔴 **Red (Emergency)**: Immediate hospital/trauma center transfer.
  - 🟡 **Yellow (Urgent)**: Examination at a Primary Health Centre (PHC) or Community Health Centre (CHC) within 24-48 hours.
  - 🟢 **Green (Routine/Home Care)**: Safe home remedies, hydration, and monitoring.
- Special risk weighting for vulnerable groups (infants, pregnant mothers, and the elderly).

### 3. 📄 Vernacular Medical Report Explainer
- Demystifies laboratory test results (Complete Blood Count, Lipid Panel, Blood Glucose, Urine Routine).
- Highlights abnormal biomarkers with clear indicators (`NORMAL`, `LOW`, `HIGH`).
- Explains findings in everyday language with actionable dietary and follow-up guidance.

### 4. 🗺️ Geo-Enabled Public Health Facility Finder
- Interactive map powered by Leaflet to locate nearby government and public healthcare centers:
  - **Ayushman Arogya Mandir** (Health & Wellness Sub-Centres)
  - **Primary Health Centres (PHCs)**
  - **Community Health Centres (CHCs)**
  - **Sub-District & District Hospitals**
- Displays operating hours, available beds, verified services, and direct contact numbers.

### 5. 👩‍⚕️ ASHA Worker Field Portal
- Digital patient roster with search and filtering by village and risk level.
- Automated reminders for Antenatal Care (ANC) checkups, immunizations, and chronic disease follow-ups.
- Designed for low-connectivity environments with responsive, mobile-first layouts.

### 6. 📊 Public Health Analytics & Surveillance
- Real-time community health metrics and syndromic trend monitoring for district health officers.
- Visual breakdowns of symptom prevalence, high-risk cases, and facility utilization.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Mapping:** Leaflet & React-Leaflet
- **Charts & Visualizations:** Recharts
- **Voice / Speech:** Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

### Backend
- **Framework:** FastAPI (Python 3.14+)
- **Server:** Uvicorn ASGI Server
- **Data Validation:** Pydantic v2
- **Testing:** Pytest + HTTPX

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm

### Quick Start (Windows)
Double-click the included script:
- `start_localhost.bat` — Launches both Backend (port 8000) and Frontend (port 5173), and automatically opens your browser.
- `stop_localhost.bat` — Gracefully stops both servers.

### Manual Setup

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs at: [http://localhost:8000](http://localhost:8000)*  
*Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)*

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
*Frontend runs at: [http://localhost:5173](http://localhost:5173)*

---

## 🔒 Medical Disclaimer

> **Important:** SehatSaathi AI is an educational, preliminary triage, and navigation assistance tool. It does **not** provide formal medical diagnoses or replace professional consultation with a qualified, licensed medical doctor. In medical emergencies, always call **108** or go to the nearest emergency medical facility immediately.

---

## 📄 License
This project is licensed under the MIT License.

# JanSwasthya Setu AI (जनस्वास्थ्य सेतु AI) 🩺🇮🇳
> **"Bridging Bharat to Intelligent Healthcare"**  
> *जन-जन तक स्वास्थ्य का डिजिटल सेतु*

[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-047857?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-047857?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdivyanshmishra3015-a%2Fsehatsaathi-ai)


---

## 📖 Overview

**JanSwasthya Setu AI (जनस्वास्थ्य सेतु AI)** is a voice-first, multilingual healthcare triage and navigation platform purpose-engineered for rural and semi-urban communities across Bharat (Tier-2/3/4 towns and villages). It builds a digital bridge across geographical distances, low digital literacy, and vernacular language barriers.

By combining voice AI in Hindi and English with clinical triage protocols, simplified pathology lab report explanations, geo-aware public healthcare facility locators, digital ABHA health ID generation, and dedicated workflows for frontline **ASHA (Accredited Social Health Activist)** workers, JanSwasthya Setu AI empowers citizens to seek timely care while reducing preventable clinical complications.

---

## 🌟 Unique Architecture & Zero-Break Deployment

### ⚡ Dual-Mode Hybrid Intelligence
JanSwasthya Setu AI features an intelligent dual-mode client:
- **Connected / Backend Mode:** When the FastAPI server runs (on `http://localhost:8000` or deployed to Render/Railway), API requests are processed through FastAPI and SQLite.
- **Embedded Client-Side Intelligence Core:** When deployed as a static site (on Vercel, Netlify, GitHub Pages, or offline in rural clinics), the built-in browser engine automatically handles clinical symptom triage, conversational AI guidance, verified facility directory calculations, lab report biomarker decoding, and local storage patient registers.
- **Result:** The web application **works 100% seamlessly anywhere**, both on localhost and live deployments, with zero missing screens or broken endpoints!

---

## 🚀 The 3-Portal "Setu" Architecture

1. **🏛️ Citizen Care Setu (नागरिक स्वास्थ्य सेतु):**
   - Natural voice and text healthcare assistant in Hindi & English.
   - Tri-color clinical symptom assessment (Emergency 🔴, Urgent PHC Visit 🟡, Supportive Home Care 🟢).
   - Vernacular pathology report explainer for CBC, Blood Sugar, and Lipid profiles.
   - Interactive Digital ABHA (Ayushman Bharat Health Account) card generator.
   - PM Jan Aushadhi generic medicine savings comparator (up to 80% savings).

2. **🩺 ASHA Field Setu (आशा सेतु साथी):**
   - Roster of rural patients with high-risk pregnancy (ANC) filters and risk badges.
   - Automated immunization and chronic disease follow-up reminders.
   - Offline-capable local registry designed for low-connectivity field environments.

3. **📊 District Health Surveillance (जिला स्वास्थ्य निगरानी):**
   - Real-time syndromic outbreak monitoring for Chief Medical Officers (CMO).
   - Fever and respiratory symptom cluster tracking.
   - Public health facility bed and resource utilization metrics.

---

## 🚨 Sanjeevani Emergency SOS Beacon

- **Live GPS Broadcast:** Instantly detects device latitude and longitude for emergency ambulance dispatch.
- **1-Click SOS Alert:** Generates pre-formatted emergency SMS/WhatsApp messages with a live Google Maps location link.
- **Emergency Sirens & Direct Helplines:** 1-tap calling for **108** (Ambulance), **104** (Health Advice), **102** (Mother & Child), and **112** (All Emergency).
- **Offline First-Aid Guides:** Life-saving protocols for severe bleeding, burns, and snake bites cached locally.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS v4 (Emerald & Saffron Indian Public Health Theme)
- **Icons:** Lucide React
- **Mapping:** Leaflet & React-Leaflet
- **Visualizations:** Recharts
- **Voice / Speech:** Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Server:** Uvicorn ASGI Server
- **Data Validation:** Pydantic v2
- **Testing:** Pytest + HTTPX

---

## 💻 Getting Started on Localhost

### Prerequisites
- **Node.js 18+** & npm
- **Python 3.10+**

### 1-Click Windows Launcher
Double-click:
- `start_localhost.bat` — Starts both Backend (Port 8000) and Frontend (Port 5173), and opens your browser.
- `stop_localhost.bat` — Gracefully stops both servers.

### Manual Setup

#### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)*

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
*Frontend URL: [http://localhost:5173](http://localhost:5173)*

---

## 🌐 Deploying to Production

### Option A: Vercel (Frontend & Embedded Engine)
1. Push this repository to GitHub.
2. In Vercel, import the repository.
3. The included `vercel.json` automatically configures Vite build (`frontend/dist`) and SPA routing.
4. Deployment completes with full functionality!

### Option B: Deploying Backend to Render / Railway
1. Create a Web Service pointing to `backend/main.py`.
2. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. In your Vercel frontend environment variables, set:
   ```
   VITE_API_BASE_URL=https://your-backend-service.onrender.com
   ```

---

## 🔒 Medical Governance & Safety Disclaimer

> **Important:** JanSwasthya Setu AI is an educational, preliminary clinical triage, and healthcare navigation assistance tool. It does **not** provide definitive medical diagnoses or replace professional evaluation by a licensed physician or Primary Health Centre Medical Officer. In medical emergencies, always call **108** or proceed immediately to the nearest hospital trauma center.

---

## 📄 License
This project is licensed under the MIT License.

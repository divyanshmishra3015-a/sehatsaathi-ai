import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { HealthSaathiChat } from './pages/HealthSaathiChat';
import { SymptomTriage } from './pages/SymptomTriage';
import { ReportExplainer } from './pages/ReportExplainer';
import { FacilityFinder } from './pages/FacilityFinder';
import { HealthHistory } from './pages/HealthHistory';
import { RemindersPage } from './pages/RemindersPage';
import { AshaDashboard } from './pages/AshaDashboard';
import { AshaPatients } from './pages/AshaPatients';
import { PatientDetails } from './pages/PatientDetails';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { PrivacyPage } from './pages/PrivacyPage';
import { EmergencyHelp } from './pages/EmergencyHelp';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* 1. Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* 2 & 3. Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<LoginPage />} />

                {/* 4. Patient Dashboard */}
                <Route path="/patient/dashboard" element={<PatientDashboard />} />

                {/* 5. AI Health Saathi Voice Chat */}
                <Route path="/patient/assistant" element={<HealthSaathiChat />} />

                {/* 6. Symptom Assessment & Clinical Triage */}
                <Route path="/patient/assessment" element={<SymptomTriage />} />

                {/* 7. Medical Report Explainer */}
                <Route path="/patient/reports" element={<ReportExplainer />} />

                {/* 8. Facilities Finder & Map */}
                <Route path="/facilities" element={<FacilityFinder />} />

                {/* 9. Patient Health History */}
                <Route path="/patient/history" element={<HealthHistory />} />

                {/* 10. Follow-up Reminders */}
                <Route path="/patient/reminders" element={<RemindersPage />} />

                {/* 11, 12, 13. ASHA Healthcare Worker Portal */}
                <Route path="/worker/dashboard" element={<AshaDashboard />} />
                <Route path="/worker/patients" element={<AshaPatients />} />
                <Route path="/worker/patients/:id" element={<PatientDetails />} />

                {/* 14. Admin Analytics */}
                <Route path="/admin/dashboard" element={<AdminAnalytics />} />

                {/* 15. Privacy & Data Ethics */}
                <Route path="/privacy" element={<PrivacyPage />} />

                {/* 16. Emergency & Offline Help */}
                <Route path="/help" element={<EmergencyHelp />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;

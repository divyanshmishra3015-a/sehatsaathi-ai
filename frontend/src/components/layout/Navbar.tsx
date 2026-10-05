import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Globe, PhoneCall, ShieldAlert, User, LogOut, Check } from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, role, loginAs, logout } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    loginAs(newRole);
    if (newRole === 'patient') navigate('/patient/dashboard');
    else if (newRole === 'asha_worker') navigate('/worker/dashboard');
    else if (newRole === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top emergency strip */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5 mx-auto">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>{language === 'hi' ? 'आपातकालीन एम्बुलेंस: 108 | स्वास्थ्य हेल्पलाइन: 104 | राष्ट्रीय आपातकाल: 112' : 'Emergency Ambulance: 108 | Health Advice: 104 | All Emergency: 112'}</span>
        </div>
        <a
          href="tel:108"
          className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition"
        >
          <PhoneCall className="w-3 h-3" />
          <span>{language === 'hi' ? 'कॉल 108' : 'Call 108'}</span>
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">SehatSaathi</span>
              <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-teal-100 text-teal-800">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {language === 'hi' ? 'आपका स्वास्थ्य, आपकी भाषा, आपका साथी' : 'Your Health, Your Language, Your Saathi'}
            </p>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/patient/dashboard"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
          >
            {t('nav_dashboard')}
          </Link>
          <Link
            to="/patient/assistant"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
          >
            {t('nav_assistant')}
          </Link>
          <Link
            to="/patient/assessment"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
          >
            {t('nav_assessment')}
          </Link>
          <Link
            to="/patient/reports"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
          >
            {t('nav_reports')}
          </Link>
          <Link
            to="/facilities"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
          >
            {t('nav_facilities')}
          </Link>
        </nav>

        {/* Controls: Language + Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                language === 'hi'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिंदी में बदलें"
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                language === 'en'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 rounded-lg px-2 py-1">
            <span className="text-[11px] font-bold text-amber-900 hidden sm:inline">Role:</span>
            <select
              value={role}
              onChange={handleRoleChange}
              className="bg-transparent text-xs font-semibold text-amber-900 focus:outline-hidden cursor-pointer"
              title="Switch role for demo inspection"
            >
              <option value="patient">👤 Patient (सुनीता देवी)</option>
              <option value="asha_worker">🩺 ASHA Worker (राधा मौर्या)</option>
              <option value="admin">📊 Administrator (CMO)</option>
            </select>
          </div>

          {/* Profile / Role Badge */}
          {role === 'asha_worker' && (
            <Link
              to="/worker/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
            >
              <span>आशा पोर्टल</span>
            </Link>
          )}

          {role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
            >
              <span>Admin Stats</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

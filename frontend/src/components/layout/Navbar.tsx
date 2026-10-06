import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Globe, PhoneCall, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, role, loginAs } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    loginAs(newRole);
    if (newRole === 'patient') navigate('/patient/dashboard');
    else if (newRole === 'asha_worker') navigate('/worker/dashboard');
    else if (newRole === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top National Health Emergency Strip */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs py-1 px-4 font-medium flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2 mx-auto">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span className="tracking-wide">
            {language === 'hi'
              ? 'आपातकालीन एम्बुलेंस: 108 | स्वास्थ्य परामर्श: 104 | जननी शिशु: 102 | राष्ट्रीय आपातकाल: 112'
              : 'Ambulance: 108 | Health Advice: 104 | Mother & Child: 102 | All Emergencies: 112'}
          </span>
        </div>
        <a
          href="tel:108"
          className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition shrink-0"
        >
          <PhoneCall className="w-3 h-3 text-amber-300" />
          <span>{language === 'hi' ? 'कॉल 108' : 'Call 108'}</span>
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
            <HeartPulse className="w-6 h-6 text-emerald-200" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                JanSwasthya<span className="text-emerald-700">Setu</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                AI
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 font-medium hidden sm:block">
              {language === 'hi' ? 'जन-जन तक स्वास्थ्य का डिजिटल सेतु' : 'Bridging Bharat to Intelligent Healthcare'}
            </p>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/patient/dashboard"
            className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
          >
            {t('nav_dashboard')}
          </Link>
          <Link
            to="/patient/assistant"
            className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('nav_assistant')}</span>
          </Link>
          <Link
            to="/patient/assessment"
            className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
          >
            {t('nav_assessment')}
          </Link>
          <Link
            to="/patient/reports"
            className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
          >
            {t('nav_reports')}
          </Link>
          <Link
            to="/facilities"
            className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
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
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                language === 'hi'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिंदी में बदलें"
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                language === 'en'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/90 rounded-lg px-2 py-1 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-900 hidden sm:inline">Setu Role:</span>
            <select
              value={role}
              onChange={handleRoleChange}
              className="bg-transparent text-xs font-bold text-amber-950 focus:outline-hidden cursor-pointer"
              title="Switch role for demo inspection"
            >
              <option value="patient">👤 Citizen (सुनीता देवी)</option>
              <option value="asha_worker">🩺 ASHA Setu (राधा मौर्या)</option>
              <option value="admin">📊 Health Officer (CMO)</option>
            </select>
          </div>

          {/* Role Direct Jump Button */}
          {role === 'asha_worker' && (
            <Link
              to="/worker/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-xs transition"
            >
              <span>आशा पोर्टल</span>
            </Link>
          )}

          {role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 shadow-xs transition"
            >
              <span>CMO Stats</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

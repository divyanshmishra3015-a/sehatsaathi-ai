import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  HeartPulse,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const LoginPage: React.FC = () => {
  const { language } = useLanguage();
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = location.pathname.includes('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  const handleDemoLogin = (role: UserRole) => {
    loginAs(role);
    if (role === 'patient') navigate('/patient/dashboard');
    else if (role === 'asha_worker') navigate('/worker/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole);
    if (selectedRole === 'patient') navigate('/patient/dashboard');
    else if (selectedRole === 'asha_worker') navigate('/worker/dashboard');
    else if (selectedRole === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-28 md:pb-12 space-y-6">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center mx-auto shadow-md">
          <HeartPulse className="w-8 h-8 text-emerald-100" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isRegister
            ? (language === 'hi' ? 'जनस्वास्थ्य सेतु में नया खाता बनाएं' : 'Join JanSwasthya Setu AI')
            : (language === 'hi' ? 'जनस्वास्थ्य सेतु में प्रवेश करें' : 'Sign in to JanSwasthya Setu AI')}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'hi' ? 'जन-जन तक स्वास्थ्य का डिजिटल सेतु' : 'Bridging Bharat to Intelligent Healthcare'}
        </p>
      </div>

      {/* 1-Click Fast Pass for Evaluators & Users */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            ⚡ Quick 1-Click Portal Switcher
          </span>
          <span className="text-[11px] text-amber-700 font-semibold">Instant Access Pass</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleDemoLogin('patient')}
            className="w-full p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-amber-200 hover:border-emerald-500 text-left transition flex items-center justify-between shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                👤
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  Sunita Devi (Citizen / Pregnant ANC)
                </div>
                <div className="text-[11px] text-slate-500">Voice AI chat, triage & ABHA card</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => handleDemoLogin('asha_worker')}
            className="w-full p-3 rounded-2xl bg-white hover:bg-teal-50 border border-amber-200 hover:border-teal-500 text-left transition flex items-center justify-between shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                🩺
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                  Radha Maurya (ASHA Field Worker)
                </div>
                <div className="text-[11px] text-slate-500">Village register & priority triage desk</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => handleDemoLogin('admin')}
            className="w-full p-3 rounded-2xl bg-white hover:bg-indigo-50 border border-amber-200 hover:border-indigo-500 text-left transition flex items-center justify-between shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                📊
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                  Dr. V. K. Sharma (CMO / Health Officer)
                </div>
                <div className="text-[11px] text-slate-500">District epidemic & syndromic surveillance</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Your Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
            >
              <option value="patient">👤 Rural Citizen / Patient</option>
              <option value="asha_worker">🩺 ASHA / Healthcare Worker</option>
              <option value="admin">📊 Administrator / Medical Officer</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mobile Number or Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 9876543210 or user@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            {isRegister
              ? (language === 'hi' ? 'खाता बनाएं' : 'Create Account')
              : (language === 'hi' ? 'लॉग इन करें' : 'Sign In')}
          </button>
        </form>
      </div>

      <MedicalSafetyNotice />
    </div>
  );
};

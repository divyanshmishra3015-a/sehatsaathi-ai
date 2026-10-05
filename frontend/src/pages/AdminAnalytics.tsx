import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Users,
  Activity,
  ShieldAlert,
  Calendar,
  Hospital,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const AdminAnalytics: React.FC = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading aggregated analytics...</div>;
  }

  const urgencyColors = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
              CMO & Health Department Analytics
            </span>
            <span className="text-xs text-indigo-300">
              {language === 'hi' ? 'गोपनीय समग्र आंकड़े' : 'De-identified Aggregate Population Metrics'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {language === 'hi' ? 'सामुदायिक स्वास्थ्य एवं ट्राइएज विश्लेषण' : 'Community Health & Triage Analytics'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Coverage Area: Varanasi Rural Division • Active PHCs: 4 • CHCs: 2 • Sub-Centres: 8
          </p>
        </div>

        <div className="bg-indigo-900/60 border border-indigo-700/60 rounded-2xl px-4 py-2 text-right">
          <div className="text-xs text-indigo-200">Active Field Workers</div>
          <div className="text-2xl font-extrabold text-white">12 ASHA Didi</div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {language === 'hi' ? 'कुल पंजीकृत नागरिक' : 'Registered Citizens'}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {data?.total_registered_patients || 146}
          </div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% this month
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {language === 'hi' ? 'संपन्न ट्राइएज जांच' : 'Triage Assessments'}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {data?.total_assessments_completed || 331}
          </div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1">
            Voice & Form Assessments
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {language === 'hi' ? 'आपातकालीन RED अलर्ट' : 'Escalated to 108 (RED)'}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">
            {data?.urgency_distribution?.[0]?.value || 7}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            Immediate Hospital Transport
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {language === 'hi' ? 'लंबित फॉलो-अप' : 'Active Follow-ups'}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">
            {data?.active_followups_due || 3}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            Scheduled within 7 days
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Weekly Triage Trends (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              <span>{language === 'hi' ? 'साप्ताहिक ट्राइएज एवं आशा भ्रमण रुझान' : 'Weekly Triage Volume & ASHA Visits'}</span>
            </h3>
            <span className="text-xs text-slate-400">Past 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weekly_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="assessments" fill="#0d9488" name="Assessments" radius={[4, 4, 0, 0]} />
                <Bar dataKey="asha_visits" fill="#8b5cf6" name="ASHA Visits" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Urgency Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-teal-600" />
              <span>{language === 'hi' ? 'ट्राइएज गंभीरता वितरण' : 'Urgency Breakdown'}</span>
            </h3>
            <span className="text-xs text-slate-400">Total Validated</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.urgency_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.urgency_distribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={urgencyColors[index % urgencyColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Reported Symptoms Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">
          {language === 'hi' ? 'क्लस्टर में शीर्ष रिपोर्ट किए गए लक्षण (Prevalent Symptoms)' : 'Most Prevalent Reported Symptoms in Cluster'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {(data?.top_symptoms || []).map((sym: any, idx: number) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-xs text-slate-500 font-semibold block">{sym.symptom}</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">{sym.count} cases</span>
            </div>
          ))}
        </div>
      </div>

      <MedicalSafetyNotice />
    </div>
  );
};

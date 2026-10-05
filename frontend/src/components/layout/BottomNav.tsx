import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Home, MessageSquarePlus, Activity, FileText, Hospital } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { language } = useLanguage();

  const links = [
    {
      to: '/patient/dashboard',
      icon: Home,
      label_hi: 'होम',
      label_en: 'Home'
    },
    {
      to: '/patient/assistant',
      icon: MessageSquarePlus,
      label_hi: 'साथी AI',
      label_en: 'Saathi AI'
    },
    {
      to: '/patient/assessment',
      icon: Activity,
      label_hi: 'जांच',
      label_en: 'Triage'
    },
    {
      to: '/patient/reports',
      icon: FileText,
      label_hi: 'रिपोर्ट',
      label_en: 'Reports'
    },
    {
      to: '/facilities',
      icon: Hospital,
      label_hi: 'अस्पताल',
      label_en: 'Hospitals'
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1 px-2 shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition duration-150 ${
                  isActive
                    ? 'text-teal-700 font-bold bg-teal-50'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight text-center">
                {language === 'hi' ? link.label_hi : link.label_en}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

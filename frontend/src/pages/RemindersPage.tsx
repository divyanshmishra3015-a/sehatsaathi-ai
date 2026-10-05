import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Reminder } from '../types';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Trash2,
  Plus,
  Clock,
  Hospital,
  AlertCircle
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const RemindersPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-10-10');
  const [newType, setNewType] = useState('Follow-up');
  const [newFacility, setNewFacility] = useState('PHC Cholapur');
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      const data = await api.getReminders();
      setReminders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const updated = await api.toggleReminder(id);
      setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const created = await api.createReminder({
        patient_name: 'Sunita Devi',
        title: newTitle,
        title_hi: newTitle,
        due_date: newDueDate,
        type: newType,
        facility: newFacility,
        urgency: 'medium'
      });
      setReminders((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('reminders_title')}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'दवा, नियमित टीका और अस्पताल जांच स्मरण' : 'Medication, vaccination, and doctor follow-up schedules'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add_reminder_btn')}</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition ${
                rem.completed ? 'bg-slate-50/80 opacity-70' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggle(rem.id)}
                  className={`w-6 h-6 rounded-lg mt-0.5 border flex items-center justify-center transition ${
                    rem.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-teal-500 text-transparent'
                  }`}
                  title={rem.completed ? 'Mark pending' : 'Mark completed'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rem.urgency === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rem.type}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {rem.due_date}
                    </span>
                  </div>
                  <h4
                    className={`font-semibold text-sm sm:text-base ${
                      rem.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {language === 'hi' ? rem.title_hi : rem.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Hospital className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rem.facility}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(rem.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'hi' ? 'नया रिमाइंडर जोड़ें' : 'Create Health Reminder'}
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Blood pressure checkup"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                >
                  <option value="Follow-up">Doctor Follow-up</option>
                  <option value="Maternal Visit">Maternal ANC Visit</option>
                  <option value="Immunization">Child Immunization</option>
                  <option value="Medication">Medicine Refill</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Healthcare Facility</label>
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MedicalSafetyNotice />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ReportAnalysis, Biomarker } from '../types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Sparkles,
  HelpCircle,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const ReportExplainer: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedSample, setSelectedSample] = useState<string>('cbc_anemia');
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  // Load default sample on mount
  useEffect(() => {
    loadSample('cbc_anemia');
  }, []);

  const loadSample = async (key: string) => {
    setSelectedSample(key);
    setLoading(true);
    try {
      const res = await api.getSampleReport(key);
      setAnalysis(res);
      setFileName(null);
    } catch (err) {
      console.error('Failed to load sample', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSelectedSample('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patient_name', 'Verified Citizen');
      const res = await api.analyzeReport(formData);
      setAnalysis(res);
    } catch (err) {
      console.error('Failed to analyze uploaded file', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualTextAnalyze = async () => {
    if (!uploadText.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('report_text', uploadText);
      formData.append('patient_name', 'Citizen Report');
      const res = await api.analyzeReport(formData);
      setAnalysis(res);
    } catch (err) {
      console.error('Text analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
              {language === 'hi' ? 'लैब रिपोर्ट विश्लेषक' : 'Lab Biomarker Parser'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {language === 'hi' ? 'सरल भाषा में अर्थ' : 'Plain Language Insights'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t('report_explainer_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('report_explainer_desc')}
          </p>
        </div>

        {analysis && (
          <button
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रिंट / डाउनलोड' : 'Print Summary'}</span>
          </button>
        )}
      </div>

      {/* Preset Samples Selector (For Instant Hackathon & User Testing) */}
      <div className="no-print bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t('choose_sample_report')}
          </span>
          <span className="text-xs text-teal-700 font-semibold">1-Click Live Demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              key: 'cbc_anemia',
              title_hi: 'खून की कमी (Anemia) व बुखार',
              title_en: 'CBC Anemia & Low Hemoglobin (Sunita Devi)'
            },
            {
              key: 'sugar_high',
              title_hi: 'उच्च ब्लड शुगर / डायबिटीज',
              title_en: 'High Blood Glucose & Creatinine (Ramesh C.)'
            },
            {
              key: 'normal_checkup',
              title_hi: 'सामान्य स्वास्थ्य जांच (Normal)',
              title_en: 'Routine Healthy Checkup (Pooja Verma)'
            }
          ].map((sample) => (
            <button
              key={sample.key}
              onClick={() => loadSample(sample.key)}
              className={`p-3 rounded-xl text-left border text-xs font-semibold transition ${
                selectedSample === sample.key
                  ? 'bg-white border-teal-600 text-teal-900 shadow-sm'
                  : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <div className="font-bold">
                {language === 'hi' ? sample.title_hi : sample.title_en}
              </div>
            </button>
          ))}
        </div>

        {/* Upload Own File or Paste Raw Text Option */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-teal-500 text-slate-700 text-xs font-bold transition shadow-2xs">
            <UploadCloud className="w-4 h-4 text-teal-600" />
            <span>{fileName ? `Uploaded: ${fileName}` : t('upload_own_report')}</span>
            <input
              type="file"
              accept=".pdf,image/*,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <span className="text-xs text-slate-400">
            {language === 'hi' ? 'समर्थित प्रारूप: PDF, JPG, PNG एवं टेक्स्ट' : 'Supported formats: PDF, Images & Text'}
          </span>
        </div>
      </div>

      {/* Analysis Results Display */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Sparkles className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">
            {language === 'hi' ? 'जांच रिपोर्ट का विश्लेषण जारी है...' : 'Extracting and parsing medical biomarkers...'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Checking clinical reference ranges and generating bilingual insights
          </p>
        </div>
      )}

      {!loading && analysis && (
        <div className="printable-area space-y-6">
          {/* Summary Banner */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border ${
              analysis.abnormal_count > 0
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl text-white shrink-0 ${
                  analysis.abnormal_count > 0 ? 'bg-amber-600' : 'bg-emerald-600'
                }`}
              >
                {analysis.abnormal_count > 0 ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <CheckCircle2 className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg">
                    {language === 'hi' ? 'रिपोर्ट सारांश' : 'Clinical Summary'}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      analysis.abnormal_count > 0
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {analysis.abnormal_count > 0
                      ? `${analysis.abnormal_count} ${language === 'hi' ? 'मापदंड सामान्य से बाहर' : 'Out of range'}`
                      : `${language === 'hi' ? 'सभी सामान्य' : 'All Normal'}`}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {language === 'hi' ? analysis.summary_hi : analysis.summary_en}
                </p>

                <div className="pt-2 text-xs font-bold text-slate-700">
                  {language === 'hi' ? 'डॉक्टर से परामर्श सलाह:' : 'Recommended Physician Action:'}
                  <span className="font-normal ml-1">
                    {language === 'hi' ? analysis.recommendation_hi : analysis.recommendation_en}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Biomarkers Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {t('extracted_biomarkers')}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Patient: <strong className="text-slate-800">{analysis.patient_info.name}</strong>
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {analysis.biomarkers.map((bio, idx) => {
                const isAbnormal = bio.status !== 'NORMAL';

                return (
                  <div key={idx} className="p-4 sm:p-5 hover:bg-slate-50/60 transition space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {language === 'hi' ? bio.test_name_hi : bio.test_name}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {language === 'hi' ? 'सामान्य सीमा:' : 'Reference range:'} {bio.reference_low} - {bio.reference_high} {bio.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-extrabold text-slate-900">
                            {bio.value} <span className="text-xs font-normal text-slate-500">{bio.unit}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            bio.status === 'HIGH'
                              ? 'bg-rose-100 text-rose-800'
                              : bio.status === 'LOW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {bio.status === 'HIGH' && <ArrowUpRight className="w-3.5 h-3.5" />}
                          {bio.status === 'LOW' && <ArrowDownRight className="w-3.5 h-3.5" />}
                          {bio.status === 'NORMAL' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>{language === 'hi' ? bio.status_label_hi : bio.status_label_en}</span>
                        </span>
                      </div>
                    </div>

                    {/* Rural-Friendly Simple Explanation */}
                    <div className="bg-slate-50 p-3 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed border border-slate-100">
                      <span className="font-bold text-teal-800 mr-1.5">
                        {language === 'hi' ? 'सरल अर्थ:' : 'Plain Explanation:'}
                      </span>
                      {language === 'hi' ? bio.explanation_hi : bio.explanation_en}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Medical Safety Notice */}
      <MedicalSafetyNotice />
    </div>
  );
};

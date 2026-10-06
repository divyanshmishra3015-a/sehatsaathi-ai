import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { api } from '../services/api';
import { ChatMessage } from '../types';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  ShieldAlert,
  PhoneCall,
  FileDown,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const HealthSaathiChat: React.FC = () => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं आपका **जनस्वास्थ्य सेतु AI (JanSwasthya Setu AI)** साथी हूँ।\n\nआप मुझसे बोलकर या लिखकर अपने लक्षणों (जैसे बुखार, खांसी, बदन दर्द), खून की जांच रिपोर्ट या घरेलू देखभाल के बारे में पूछ सकते हैं।\n\nआज आप या आपके परिवार में कैसा महसूस हो रहा है?'
          : 'Namaste! I am **JanSwasthya Setu AI** — your voice-first vernacular healthcare companion.\n\nYou can speak or type your symptoms, ask about lab results, maternal care, or seek advice on visiting your local PHC.\n\nHow may I help you today?',
      triage_urgency: 'GREEN',
      suggested_followups:
        language === 'hi'
          ? [
              'मुझे दो दिन से बुखार और कमजोरी है',
              'बच्चे को खांसी और जुकाम है',
              'खून की जांच रिपोर्ट का मतलब समझाइए',
              'नजदीकी पीएचसी अस्पताल कहां है?'
            ]
          : [
              'I have had fever and weakness for 2 days',
              'My child has cold and cough',
              'Help me understand my lab report',
              'Where is the nearest PHC hospital?'
            ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  // Speech Recognition hook
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: speechSupported
  } = useSpeechRecognition({
    language,
    onTranscriptChange: (text) => setInputText(text)
  });

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    if (isListening) {
      stopListening();
    }

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    resetTranscript();
    setLoading(true);

    try {
      const response = await api.sendChat(query, language, messages);

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        is_emergency: response.is_emergency,
        emergency_actions: response.emergency_actions,
        suggested_followups: response.suggested_followups,
        triage_urgency: response.triage_urgency,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);

      // Automatically speak the response for low digital literacy users
      speak(response.reply, language);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content:
          language === 'hi'
            ? 'क्षमा करें, नेटवर्क में अस्थायी रुकावट है। कृपया पुनः प्रयास करें अथवा आपात स्थिति में सीधे 108 या 104 पर कॉल करें।'
            : 'Apologies, temporary network timeout. Please try again or call emergency helpline 108 / 104 directly.',
        triage_urgency: 'YELLOW',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
            <HeartPulse className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
              <span>{language === 'hi' ? 'जनस्वास्थ्य सेतु AI वॉइस साथी' : 'JanSwasthya Setu Voice AI'}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Voice First
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'अपनी भाषा में बोलकर या लिखकर स्वास्थ्य परामर्श लें' : 'Voice-enabled rural health guidance'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={stop}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1 border border-rose-200 animate-pulse cursor-pointer"
              title="Stop Audio"
            >
              <VolumeX className="w-4 h-4" />
              <span className="hidden sm:inline">{t('stop_reading')}</span>
            </button>
          )}

          <button
            onClick={handlePrintSlip}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Download Summary Slip"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'hi' ? 'पर्ची डाउनलोड करें' : 'Print Slip'}</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isEmergency = msg.is_emergency || msg.triage_urgency === 'RED';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-br-xs'
                    : isEmergency
                    ? 'bg-rose-50 border-2 border-rose-400 text-slate-900 rounded-bl-xs'
                    : 'bg-slate-100 text-slate-900 rounded-bl-xs border border-slate-200/80'
                }`}
              >
                {/* Emergency Header if alert */}
                {isEmergency && !isUser && (
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-2 pb-2 border-b border-rose-200">
                    <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
                    <span>
                      {language === 'hi'
                        ? '🚨 आपातकालीन चेतावनी (Emergency Alert)'
                        : '🚨 URGENT MEDICAL EMERGENCY ALERT'}
                    </span>
                  </div>
                )}

                {/* Message Content */}
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Emergency Action Buttons */}
                {isEmergency && !isUser && (
                  <div className="mt-4 pt-3 border-t border-rose-200 space-y-2">
                    <div className="text-xs font-bold text-rose-900 uppercase">
                      {language === 'hi' ? 'तत्काल आवश्यक कदम:' : 'Immediate Required Actions:'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="tel:108"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>{language === 'hi' ? 'तुरंत 108 एम्बुलेंस कॉल करें' : 'Call 108 Ambulance'}</span>
                      </a>
                      <a
                        href="tel:112"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md transition"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>112</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Audio Read-Aloud Button for Assistant messages */}
                {!isUser && (
                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-200/60 text-xs">
                    <button
                      onClick={() => speak(msg.content, language)}
                      className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('read_aloud')}</span>
                    </button>
                    <span className="text-[11px] text-slate-500">{msg.timestamp}</span>
                  </div>
                )}
              </div>

              {/* Follow-up Suggestions Chips */}
              {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[85%]">
                  {msg.suggested_followups.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      💬 {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 max-w-sm text-emerald-800">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            <div className="text-xs font-semibold">
              {language === 'hi' ? 'सेतु साथी विचार कर रहा है...' : 'Setu Saathi is analyzing...'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Wave Animation when Recording */}
      {isListening && (
        <div className="bg-emerald-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 h-6">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 h-4 bg-emerald-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-6 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1 h-3 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0.05s' }} />
            </div>
            <span className="text-xs sm:text-sm font-semibold">
              {t('listening_now')}
            </span>
          </div>
          <button
            onClick={stopListening}
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold transition cursor-pointer"
          >
            {t('stop_recording')}
          </button>
        </div>
      )}

      {/* Input Form & Mic Button */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-2">
        {/* Large Touch Microphone */}
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition active:scale-95 cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white animate-bounce'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
          }`}
          title={isListening ? 'Stop listening' : 'Start speaking'}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Text Input Fallback */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={isListening ? 'Listening...' : t('type_message_placeholder')}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm sm:text-base text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || loading}
          className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition cursor-pointer"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Notice */}
      <MedicalSafetyNotice />
    </div>
  );
};

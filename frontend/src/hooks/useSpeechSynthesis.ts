import { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../types';

export interface UseTextToSpeechReturn {
  speak: (text: string, language?: Language, messageId?: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  speakingId: string | null;
  isSupported: boolean;
  error: string | null;
}

/**
 * Custom hook for User-Controlled Text-To-Speech playback.
 * 
 * Safety & Accessibility Rules:
 * 1. NEVER plays speech automatically on load, route change, or response arrival.
 * 2. Explicitly triggered ONLY when the user clicks a "Listen" button.
 * 3. Supports Hindi (hi-IN) and English (en-IN / en-US) with voice fallback.
 * 4. Strips markdown asterisks, hashes, and symbols before speaking.
 * 5. Automatically cancels ongoing speech when unmounting (e.g. navigating away).
 */
export const useSpeechSynthesis = (): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support and cleanup on unmount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    // Cancel any stray speech if user navigates away or component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (text: string, language: Language = 'hi', messageId?: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setIsSupported(false);
        setError('Speech synthesis is not supported in this browser.');
        return;
      }

      // Always stop previous speech before starting new one
      window.speechSynthesis.cancel();
      setError(null);

      // Clean markdown, symbols, and formatting for clean voice reading
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold **text** -> text
        .replace(/\*(.*?)\*/g, '$1')     // Italic *text* -> text
        .replace(/`([^`]+)`/g, '$1')     // Code `text` -> text
        .replace(/^#+\s+/gm, '')         // Headings # -> empty
        .replace(/^[-*•]\s+/gm, '')      // Bullet points
        .replace(/^\d+\.\s+/gm, '')      // Numbered lists
        .replace(/🚨|⚠️|•|💬|🩺|👤|📊|✨|⚡/g, '') // Emojis
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) {
        setIsSpeaking(false);
        setSpeakingId(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95; // Slightly measured pace for clear vernacular comprehension
      utterance.pitch = 1.0;

      // Select best matching voice from loaded voices
      const voices = window.speechSynthesis.getVoices();
      const targetPrefix = language === 'hi' ? 'hi' : 'en';
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix)) ||
        voices.find((v) => v.lang.toLowerCase().includes(targetPrefix));

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingId(messageId || 'active');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
      };

      utterance.onerror = (event) => {
        // 'interrupted' or 'canceled' are normal when user clicks Stop or switches message
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.warn('SpeechSynthesis error:', event.error);
          setError('Speech playback encountered an issue. You can try again.');
        }
        setIsSpeaking(false);
        setSpeakingId(null);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    []
  );

  return {
    speak,
    stop,
    isSpeaking,
    speakingId,
    isSupported,
    error
  };
};

// Also export as useTextToSpeech for semantic clarity
export const useTextToSpeech = useSpeechSynthesis;

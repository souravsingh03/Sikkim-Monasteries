import { useState, useEffect, useRef, useCallback } from 'react';

export type SpeechStatus = 'idle' | 'listening' | 'error' | 'unsupported';

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  status: SpeechStatus;
  isListening: boolean;
  isSupported: boolean;
  errorMessage: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
}

/**
 * useSpeechRecognition
 *
 * Robust hook that wraps the Web Speech API (SpeechRecognition /
 * webkitSpeechRecognition).  Handles:
 *   - Browser support detection
 *   - Microphone permission errors (NotAllowedError)
 *   - Network/service errors (no-speech, network, aborted)
 *   - Safari's webkit-prefixed API
 *   - Cleanup on unmount
 */
export function useSpeechRecognition({
  lang = 'en-US',
  continuous = false,
  onResult,
  onError,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const mountedRef = useRef(true);

  // Detect support once
  const SR = typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;
  const isSupported = Boolean(SR);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  const buildRecognition = useCallback(() => {
    if (!SR) return null;

    const rec = new SR();
    rec.lang = lang;
    rec.continuous = continuous;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      if (!mountedRef.current) return;
      setStatus('listening');
      setErrorMessage(null);
    };

    rec.onresult = (e: any) => {
      if (!mountedRef.current) return;
      const transcript = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript)
        .join(' ')
        .trim();
      onResult?.(transcript);
      setStatus('idle');
    };

    rec.onerror = (e: any) => {
      if (!mountedRef.current) return;
      let msg = 'Voice input error.';
      switch (e.error) {
        case 'not-allowed':
        case 'permission-denied':
          msg = 'Microphone access denied. Please allow microphone permission in your browser settings.';
          break;
        case 'no-speech':
          msg = 'No speech detected. Please speak clearly and try again.';
          break;
        case 'network':
          msg = 'Network error during speech recognition. Check your connection.';
          break;
        case 'audio-capture':
          msg = 'No microphone found. Please connect a microphone.';
          break;
        case 'aborted':
          // User stopped manually — not a real error
          setStatus('idle');
          return;
        default:
          msg = `Speech error: ${e.error}`;
      }
      setErrorMessage(msg);
      setStatus('error');
      onError?.(msg);
    };

    rec.onend = () => {
      if (!mountedRef.current) return;
      setStatus(prev => prev === 'listening' ? 'idle' : prev);
    };

    return rec;
  }, [SR, lang, continuous, onResult, onError]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setStatus('unsupported');
      setErrorMessage('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    // Abort any existing session
    recognitionRef.current?.abort();
    recognitionRef.current = buildRecognition();

    try {
      recognitionRef.current?.start();
    } catch (err: any) {
      // start() throws if already started
      console.warn('SpeechRecognition start error:', err);
    }
  }, [isSupported, buildRecognition]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus('idle');
  }, []);

  const toggleListening = useCallback(() => {
    if (status === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  }, [status, startListening, stopListening]);

  return {
    status,
    isListening: status === 'listening',
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
  };
}

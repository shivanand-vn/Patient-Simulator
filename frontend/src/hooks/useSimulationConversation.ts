import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ConversationMessage, 
  ConversationContext, 
  StudentInput 
} from '../services/conversation/types';
import { conversationService } from '../services/conversation/conversationService';
import { ttsService } from '../services/speech/ttsService';

interface UseSimulationConversationOptions {
  caseId?: string;
  scenarioTitle?: string;
  initialLanguage?: 'en' | 'kn' | 'hi';
}

const DEFAULT_PATIENT_PROFILE = {
  name: 'Robert Henderson',
  age: 58,
  gender: 'Male',
  chiefComplaint: 'Chest Pressure',
  allergies: 'Penicillin (Rash)',
  pastHistory: 'Hypertension, Smoker (30 pack-years)',
  currentMeds: 'Amlodipine 5mg'
};

const INITIAL_MESSAGES: ConversationMessage[] = [
  {
    id: 'msg-init-system',
    role: 'system',
    text: 'Simulation initiated: 58-year-old male presenting to ED triage with acute retrosternal chest pain. Virtual Patient ready.',
    timestamp: '14:30',
    speechStatus: 'idle'
  },
  {
    id: 'msg-init-student',
    role: 'student',
    text: 'Hello Mr. Henderson, I understand you are having chest pain. Can you tell me when this started?',
    timestamp: '14:31',
    speechStatus: 'idle'
  },
  {
    id: 'msg-init-patient',
    role: 'patient',
    text: 'Doctor, it started about 45 minutes ago while I was climbing the stairs. It feels like a heavy pressure right in the middle of my chest, and it aches down into my left arm.',
    timestamp: '14:31',
    speechStatus: 'idle'
  }
];

export function useSimulationConversation(options: UseSimulationConversationOptions = {}) {
  const [messages, setMessages] = useState<ConversationMessage[]>(INITIAL_MESSAGES);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(ttsService.isMuted());
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguageState] = useState<'en' | 'kn' | 'hi'>(options.initialLanguage || 'en');

  // Ref to track muted state in async speech callbacks
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Ref to track language for TTS
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
    const bcp47 = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    ttsService.setLanguage(bcp47);
  }, [language]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  /**
   * Speak a specific patient message using the TTS service.
   */
  const playMessageSpeech = useCallback((messageId: string, textOverride?: string) => {
    const targetMsg = messages.find(m => m.id === messageId);
    const textToSpeak = textOverride || targetMsg?.text;

    if (!textToSpeak) return;

    if (isMutedRef.current) {
      // Unmute if student explicitly clicks to play/replay speech
      setIsMuted(false);
      ttsService.setMuted(false);
    }

    setSpeakingMessageId(messageId);
    setSpeechStatus('speaking');

    // Update message status in transcript
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, speechStatus: 'speaking' } 
        : { ...m, speechStatus: m.speechStatus === 'speaking' ? 'idle' : m.speechStatus }
    ));

    const bcp47 = languageRef.current === 'kn' ? 'kn-IN' : languageRef.current === 'hi' ? 'hi-IN' : 'en-US';

    ttsService.speak(textToSpeak, {
      lang: bcp47,
      onStart: () => {
        setSpeakingMessageId(messageId);
        setSpeechStatus('speaking');
      },
      onPause: () => {
        setSpeechStatus('paused');
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, speechStatus: 'paused' } : m));
      },
      onResume: () => {
        setSpeechStatus('speaking');
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, speechStatus: 'speaking' } : m));
      },
      onEnd: () => {
        setSpeakingMessageId(null);
        setSpeechStatus('idle');
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, speechStatus: 'played' } : m));
      },
      onError: (errMsg) => {
        console.warn('[useSimulationConversation] TTS error:', errMsg);
        setSpeakingMessageId(null);
        setSpeechStatus('idle');
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, speechStatus: 'idle' } : m));
      }
    });
  }, [messages]);

  /**
   * Pause ongoing speech
   */
  const pauseSpeech = useCallback(() => {
    ttsService.pause();
    setSpeechStatus('paused');
    if (speakingMessageId) {
      setMessages(prev => prev.map(m => m.id === speakingMessageId ? { ...m, speechStatus: 'paused' } : m));
    }
  }, [speakingMessageId]);

  /**
   * Resume paused speech
   */
  const resumeSpeech = useCallback(() => {
    ttsService.resume();
    setSpeechStatus('speaking');
    if (speakingMessageId) {
      setMessages(prev => prev.map(m => m.id === speakingMessageId ? { ...m, speechStatus: 'speaking' } : m));
    }
  }, [speakingMessageId]);

  /**
   * Stop speech immediately
   */
  const stopSpeech = useCallback(() => {
    ttsService.stop();
    setSpeakingMessageId(null);
    setSpeechStatus('idle');
    setMessages(prev => prev.map(m => m.speechStatus === 'speaking' || m.speechStatus === 'paused' ? { ...m, speechStatus: 'idle' } : m));
  }, []);

  /**
   * Toggle global voice mute state
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      ttsService.setMuted(next);
      if (next) {
        stopSpeech();
      }
      return next;
    });
  }, [stopSpeech]);

  /**
   * Switch the simulation conversation language
   */
  const setLanguage = useCallback((newLang: 'en' | 'kn' | 'hi') => {
    setLanguageState(newLang);
    stopSpeech();

    let switchNote = '';
    if (newLang === 'kn') {
      switchNote = 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ರೋಗಿ ಈಗ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸುತ್ತಾರೆ.';
    } else if (newLang === 'hi') {
      switchNote = 'संवाद भाषा हिन्दी चुनी गई है। रोगी अब हिन्दी में उत्तर देंगे।';
    } else {
      switchNote = 'Simulation language switched to English. Patient will now respond in English.';
    }

    const systemMsg: ConversationMessage = {
      id: `sys-${Date.now()}`,
      role: 'system',
      text: switchNote,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      speechStatus: 'idle'
    };

    setMessages(prev => [...prev, systemMsg]);
  }, [stopSpeech]);

  /**
   * Send student message (text or voice)
   */
  const sendMessage = useCallback(async (text: string, type: 'text' | 'voice' = 'text') => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please enter a clinical question.');
      return;
    }

    if (isProcessing) {
      return; // Prevent duplicate concurrent requests
    }

    setError(null);
    setIsProcessing(true);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const studentMsgId = `student-${Date.now()}`;
    const studentMessage: ConversationMessage = {
      id: studentMsgId,
      role: 'student',
      text: trimmed,
      timestamp: timeStr,
      speechStatus: 'idle'
    };

    // 1. Immediately append student message to transcript
    setMessages(prev => [...prev, studentMessage]);

    // Build future-ready conversation context
    const studentInput: StudentInput = {
      type,
      text: trimmed,
      timestamp: timeStr
    };

    const context: ConversationContext = {
      caseId: options.caseId || 'SIM-8842-AX',
      scenarioTitle: options.scenarioTitle || 'Acute Chest Pain',
      patientProfile: DEFAULT_PATIENT_PROFILE,
      language: languageRef.current,
      history: [...messages, studentMessage]
    };

    try {
      // 2. Call conversation service orchestrator
      const patientResponse = await conversationService.sendMessage(studentInput, context);

      const patientMsgId = `patient-${Date.now()}`;
      const patientMessage: ConversationMessage = {
        id: patientMsgId,
        role: 'patient',
        text: patientResponse.text,
        timestamp: patientResponse.timestamp || timeStr,
        speechStatus: 'idle'
      };

      // 3. Append patient response to transcript
      setMessages(prev => [...prev, patientMessage]);
      setIsProcessing(false);

      // 4. Automatically trigger TTS if audio is not muted
      if (!isMutedRef.current && ttsService.isSupported()) {
        playMessageSpeech(patientMsgId, patientResponse.text);
      }
    } catch (err) {
      setIsProcessing(false);
      const friendlyError = err instanceof Error ? err.message : 'Unable to receive response from patient.';
      setError(friendlyError);

      const errorSysMsg: ConversationMessage = {
        id: `sys-err-${Date.now()}`,
        role: 'system',
        text: `Consultation Alert: ${friendlyError}`,
        timestamp: timeStr,
        speechStatus: 'idle'
      };
      setMessages(prev => [...prev, errorSysMsg]);
    }
  }, [isProcessing, messages, options.caseId, options.scenarioTitle, playMessageSpeech]);

  return {
    messages,
    isProcessing,
    speakingMessageId,
    speechStatus,
    isMuted,
    error,
    language,
    isTTSSupported: ttsService.isSupported(),
    sendMessage,
    playMessageSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    toggleMute,
    setLanguage
  };
}

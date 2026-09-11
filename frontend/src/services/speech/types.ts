/**
 * Text-to-Speech (TTS) Service Types and Interfaces
 */

export interface TTSOptions {
  /** Speech rate: 0.1 to 10 (default 0.95 for conversational pacing) */
  rate?: number;
  /** Speech pitch: 0 to 2 (default 0.9 for 58-year-old male patient) */
  pitch?: number;
  /** Volume: 0 to 1 (default 1.0) */
  volume?: number;
  /** BCP 47 language tag (e.g. 'en-US', 'kn-IN', 'hi-IN') */
  lang?: string;
  /** Optional specific voice name */
  voiceName?: string;
  /** Callback fired when speech synthesis starts */
  onStart?: () => void;
  /** Callback fired when speech synthesis ends naturally */
  onEnd?: () => void;
  /** Callback fired when speech synthesis is paused */
  onPause?: () => void;
  /** Callback fired when speech synthesis resumes */
  onResume?: () => void;
  /** Callback fired on speech synthesis error */
  onError?: (error: string) => void;
}

export type SpeechPlaybackStatus = 'idle' | 'speaking' | 'paused';

export interface ITTSService {
  /** Check if Web Speech API is supported in the current environment */
  isSupported(): boolean;
  /** Speak a given text string using configured voice and options */
  speak(text: string, options?: TTSOptions): Promise<void>;
  /** Stop any current speech synthesis immediately */
  stop(): void;
  /** Pause the current speech synthesis */
  pause(): void;
  /** Resume paused speech synthesis */
  resume(): void;
  /** Whether speech synthesis is currently actively speaking */
  isSpeaking(): boolean;
  /** Whether speech synthesis is currently paused */
  isPaused(): boolean;
  /** Get all available browser/system speech synthesis voices */
  getVoices(): SpeechSynthesisVoice[];
  /** Set or toggle global mute state */
  setMuted(muted: boolean): void;
  /** Get current global mute state */
  isMuted(): boolean;
  /** Set default language for speech */
  setLanguage(lang: string): void;
  /** Set default patient voice */
  setVoice(voice: SpeechSynthesisVoice | null): void;
  /** Get current selected voice */
  getCurrentVoice(): SpeechSynthesisVoice | null;
  /** Get currently active utterance reference */
  getCurrentUtterance(): SpeechSynthesisUtterance | null;
}

import { ITTSService, TTSOptions } from './types';

/**
 * Text-to-Speech (TTS) Service using Web Speech API (window.speechSynthesis).
 * 
 * Provides robust speech synthesis lifecycle management, custom callbacks,
 * default patient voice resolution, global mute support, and cleanup.
 */
class TTSService implements ITTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private activeSpeaking: boolean = false;
  private activePaused: boolean = false;
  private muted: boolean = false;
  private defaultLang: string = 'en-US';
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  /** Returns the active utterance reference (also keeps utterance alive against GC) */
  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();

      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.cachedVoices = this.synth.getVoices();
    if (!this.selectedVoice && this.cachedVoices.length > 0) {
      this.selectedVoice = this.pickDefaultPatientVoice(this.defaultLang);
    }
  }

  /**
   * Selects a natural patient voice based on language and persona (e.g. 58M English).
   */
  private pickDefaultPatientVoice(lang: string): SpeechSynthesisVoice | null {
    if (this.cachedVoices.length === 0) return null;

    const prefix = lang.slice(0, 2).toLowerCase();
    const matchingLangVoices = this.cachedVoices.filter(v => 
      v.lang.toLowerCase().startsWith(prefix)
    );

    if (matchingLangVoices.length > 0) {
      // Prioritize natural or male-sounding voices for a 58M patient persona
      const preferred = matchingLangVoices.find(v => 
        /david|mark|guy|george|natural|male/i.test(v.name)
      );
      return preferred || matchingLangVoices[0];
    }

    // Fallback to any default voice in the system
    return this.cachedVoices.find(v => v.default) || this.cachedVoices[0] || null;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(text: string, options?: TTSOptions): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isSupported() || !this.synth) {
        options?.onError?.('Text-to-Speech is not supported in this environment.');
        resolve();
        return;
      }

      if (this.muted) {
        // If muted, silently skip audio playback and immediately resolve
        options?.onEnd?.();
        resolve();
        return;
      }

      // Stop any ongoing speech before starting new utterance
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const targetLang = options?.lang || this.defaultLang;
      utterance.lang = targetLang;
      utterance.rate = options?.rate ?? 0.95;   // Conversational pacing
      utterance.pitch = options?.pitch ?? 0.9;  // Slightly mature voice
      utterance.volume = options?.volume ?? 1.0;

      // Select voice matching language if available
      const voiceForLang = this.pickDefaultPatientVoice(targetLang);
      if (voiceForLang) {
        utterance.voice = voiceForLang;
      } else if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onstart = () => {
        this.activeSpeaking = true;
        this.activePaused = false;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.activeSpeaking = false;
        this.activePaused = false;
        this.currentUtterance = null;
        options?.onEnd?.();
        resolve();
      };

      utterance.onpause = () => {
        this.activePaused = true;
        options?.onPause?.();
      };

      utterance.onresume = () => {
        this.activePaused = false;
        options?.onResume?.();
      };

      utterance.onerror = (event) => {
        this.activeSpeaking = false;
        this.activePaused = false;
        this.currentUtterance = null;
        
        // 'interrupted' or 'canceled' are normal when user stops or switches messages
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          options?.onError?.(`Speech synthesis error: ${event.error}`);
        }
        options?.onEnd?.();
        resolve();
      };

      try {
        this.synth.speak(utterance);
      } catch (err) {
        this.activeSpeaking = false;
        this.activePaused = false;
        this.currentUtterance = null;
        options?.onError?.(err instanceof Error ? err.message : 'Unknown TTS execution error');
        options?.onEnd?.();
        resolve();
      }
    });
  }

  public stop(): void {
    if (!this.synth) return;
    try {
      this.synth.cancel();
    } catch {
      // Ignore cancellation errors
    }
    this.activeSpeaking = false;
    this.activePaused = false;
    this.currentUtterance = null;
  }

  public pause(): void {
    if (!this.synth || !this.activeSpeaking) return;
    try {
      this.synth.pause();
      this.activePaused = true;
    } catch {
      // Ignore pause failure
    }
  }

  public resume(): void {
    if (!this.synth || !this.activePaused) return;
    try {
      this.synth.resume();
      this.activePaused = false;
    } catch {
      // Ignore resume failure
    }
  }

  public isSpeaking(): boolean {
    return this.activeSpeaking;
  }

  public isPaused(): boolean {
    return this.activePaused;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    if (this.cachedVoices.length === 0) {
      this.loadVoices();
    }
    return this.cachedVoices;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && this.activeSpeaking) {
      this.stop();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setLanguage(lang: string): void {
    this.defaultLang = lang;
    this.selectedVoice = this.pickDefaultPatientVoice(lang);
  }

  public setVoice(voice: SpeechSynthesisVoice | null): void {
    this.selectedVoice = voice;
  }

  public getCurrentVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }
}

// Export singleton instance
export const ttsService: ITTSService = new TTSService();
export default ttsService;

import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Languages, 
  Brain, 
  Mic, 
  Shield, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Save
} from 'lucide-react';

type SubTabId = 'appearance' | 'language' | 'simulation' | 'audio' | 'privacy';

export const Settings: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('appearance');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [uiScaling, setUiScaling] = useState('100');
  const [language, setLanguage] = useState('en');
  const [interactionMode, setInteractionMode] = useState<'voice' | 'text'>('voice');
  const [enableCaptions, setEnableCaptions] = useState(true);
  const [micDevice, setMicDevice] = useState('jabra-evolve-mic');
  const [speakerDevice, setSpeakerDevice] = useState('jabra-evolve-spk');
  const [volume, setVolume] = useState(80);
  const [anonymousTelemetry, setAnonymousTelemetry] = useState(true);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const scrollToSection = (id: SubTabId) => {
    setActiveSubTab(id);
    const element = document.getElementById(`settings-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Automatically update active tab when user scrolls through sections
  useEffect(() => {
    const sectionIds: SubTabId[] = ['appearance', 'language', 'simulation', 'audio', 'privacy'];
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('settings-section-', '') as SubTabId;
          setActiveSubTab(id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-15% 0px -65% 0px',
      threshold: 0.05
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(`settings-section-${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSave = () => {
    setSavedFeedback('Settings successfully saved to local workstation configuration.');
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  const handleTestMic = () => {
    setIsMicTesting(true);
    setTimeout(() => {
      setIsMicTesting(false);
      setSavedFeedback('Microphone hardware check passed: 48kHz / 24-bit input normal.');
      setTimeout(() => setSavedFeedback(null), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Section */}
      <div>
        <div className="text-xs font-semibold tracking-wider text-outline uppercase mb-1">
          SYSTEM CONTROL <span className="mx-1 text-slate-300">/</span> <span className="text-primary font-bold">Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface font-headline">Settings</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Manage your AI simulation parameters, audio hardware, accessibility, and regional interfaces.
        </p>
      </div>

      {/* Save Notification */}
      {savedFeedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sub-Navigation Menu (Sticky) */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4 lg:sticky lg:top-20 z-10">
          <div className="bg-surface-container-lowest rounded-xl p-2 border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col gap-1">
            <button
              onClick={() => scrollToSection('appearance')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeSubTab === 'appearance'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => scrollToSection('language')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeSubTab === 'language'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Languages className="w-4 h-4 shrink-0" />
              <span>Language</span>
            </button>

            <button
              onClick={() => scrollToSection('simulation')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeSubTab === 'simulation'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Brain className="w-4 h-4 shrink-0" />
              <span>Simulation Preferences</span>
            </button>

            <button
              onClick={() => scrollToSection('audio')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeSubTab === 'audio'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Mic className="w-4 h-4 shrink-0" />
              <span>Audio & Telemetry</span>
            </button>

            <button
              onClick={() => scrollToSection('privacy')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeSubTab === 'privacy'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Privacy & Data</span>
            </button>
          </div>
        </div>

        {/* Right Settings Cards Stack */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* 1. Appearance Card */}
          <section 
            id="settings-section-appearance" 
            className="scroll-mt-24 bg-surface-container-lowest rounded-xl p-6 border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-start justify-between pb-4 border-b border-surface-container/60">
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">Appearance</h3>
                <p className="text-xs text-outline mt-0.5">
                  Customize the visual workstation environment and density.
                </p>
              </div>
              <Palette className="w-5 h-5 text-outline" />
            </div>

            <div className="mt-4 space-y-4">
              {/* Theme Mode */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Theme Mode</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Switch between clinical light and high-contrast dark modes.
                  </p>
                </div>
                <div className="inline-flex rounded-lg bg-surface-container p-1 shrink-0">
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      themeMode === 'light'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      themeMode === 'dark'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* UI Scaling */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">UI Scaling & Density</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Adjust telemetry text scaling for multi-monitor workstations.
                  </p>
                </div>
                <select
                  value={uiScaling}
                  onChange={(e) => setUiScaling(e.target.value)}
                  className="px-3 py-1.5 bg-surface-container-lowest border border-surface-container rounded-lg text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 cursor-pointer"
                >
                  <option value="90">Compact (90%)</option>
                  <option value="100">Standard (100%)</option>
                  <option value="110">Large (110%)</option>
                </select>
              </div>
            </div>
          </section>

          {/* 2. Language Card */}
          <section 
            id="settings-section-language" 
            className="scroll-mt-24 bg-surface-container-lowest rounded-xl p-6 border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-start justify-between pb-4 border-b border-surface-container/60">
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">Language</h3>
                <p className="text-xs text-outline mt-0.5">
                  Set the default interface and AI patient communication dialect.
                </p>
              </div>
              <Languages className="w-5 h-5 text-outline" />
            </div>

            <div className="mt-4">
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Interface Language</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Primary language for menus, telemetry labels, and reports.
                  </p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1.5 bg-surface-container-lowest border border-surface-container rounded-lg text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 cursor-pointer"
                >
                  <option value="en">English (US / UK)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>
          </section>

          {/* 3. Simulation Preferences Card */}
          <section 
            id="settings-section-simulation" 
            className="scroll-mt-24 bg-surface-container-lowest rounded-xl p-6 border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-start justify-between pb-4 border-b border-surface-container/60">
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">Simulation Preferences</h3>
                <p className="text-xs text-outline mt-0.5">
                  Configure how you interact with virtual patients during scenarios.
                </p>
              </div>
              <Brain className="w-5 h-5 text-outline" />
            </div>

            <div className="mt-4 space-y-4">
              {/* Preferred Interaction Mode */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Preferred Interaction Mode</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Choose between real-time voice conversation or text chat input.
                  </p>
                </div>
                <div className="inline-flex rounded-lg bg-surface-container p-1 shrink-0">
                  <button
                    onClick={() => setInteractionMode('voice')}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      interactionMode === 'voice'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Voice
                  </button>
                  <button
                    onClick={() => setInteractionMode('text')}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      interactionMode === 'text'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Text
                  </button>
                </div>
              </div>

              {/* Enable Live Captions */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Enable Live Captions & Transcript</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Display real-time speech-to-text transcription during voice simulation.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={enableCaptions}
                    onChange={(e) => setEnableCaptions(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* 4. Audio & Telemetry Card */}
          <section 
            id="settings-section-audio" 
            className="scroll-mt-24 bg-surface-container-lowest rounded-xl p-6 border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-start justify-between pb-4 border-b border-surface-container/60">
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">Audio & Telemetry</h3>
                <p className="text-xs text-outline mt-0.5">
                  Configure microphone arrays, clinical headset output, and volume levels.
                </p>
              </div>
              <Mic className="w-5 h-5 text-outline" />
            </div>

            <div className="mt-4 space-y-4">
              {/* Microphone Device */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Microphone Device</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Input device for vocal patient examinations.
                  </p>
                </div>
                <select
                  value={micDevice}
                  onChange={(e) => setMicDevice(e.target.value)}
                  className="px-3 py-1.5 bg-surface-container-lowest border border-surface-container rounded-lg text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 cursor-pointer max-w-[220px]"
                >
                  <option value="jabra-evolve-mic">Jabra Evolve2 65 Link380a</option>
                  <option value="default-mic">Default System Microphone</option>
                </select>
              </div>

              {/* Speaker Output */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Speaker Output</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Audio device for AI patient responses and monitor alarms.
                  </p>
                </div>
                <select
                  value={speakerDevice}
                  onChange={(e) => setSpeakerDevice(e.target.value)}
                  className="px-3 py-1.5 bg-surface-container-lowest border border-surface-container rounded-lg text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 cursor-pointer max-w-[220px]"
                >
                  <option value="jabra-evolve-spk">Jabra Evolve2 65 Link380a (Stereo)</option>
                  <option value="default-spk">Default System Audio Output</option>
                </select>
              </div>

              {/* Volume Slider */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Voice Output Volume</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Master volume for virtual patient speech synthesis.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-56 shrink-0">
                  <VolumeX className="w-4 h-4 text-outline shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <Volume2 className="w-4 h-4 text-outline shrink-0" />
                </div>
              </div>

              {/* Mic Diagnostics */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Microphone Diagnostics</h4>
                  <p className="text-xs text-outline mt-0.5">
                    Test input levels and noise suppression algorithms.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestMic}
                  disabled={isMicTesting}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-lowest border border-surface-container hover:bg-surface-container text-xs font-semibold text-on-surface rounded-lg transition-colors shrink-0"
                >
                  <Mic className={`w-3.5 h-3.5 ${isMicTesting ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                  <span>{isMicTesting ? 'Testing Audio...' : 'Run Mic Test'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 5. Privacy & Data Card */}
          <section 
            id="settings-section-privacy" 
            className="scroll-mt-24 bg-surface-container-lowest rounded-xl p-6 border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-start justify-between pb-4 border-b border-surface-container/60">
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">Privacy & Data</h3>
                <p className="text-xs text-outline mt-0.5">
                  Review simulation recording compliance and data telemetry usage.
                </p>
              </div>
              <Shield className="w-5 h-5 text-outline" />
            </div>

            <div className="mt-4 space-y-4">
              {/* Session Recording Policy */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Session Recording Policy</h4>
                  <p className="text-xs text-outline mt-0.5 leading-relaxed max-w-lg">
                    Simulations are logged securely for instructor debriefing and grading. HIPAA-compliant encryption enabled.
                  </p>
                </div>
                <span className="px-3 py-1 bg-primary text-on-primary text-xs font-semibold rounded-full shrink-0 shadow-sm">
                  Active & Secure
                </span>
              </div>

              {/* Anonymous Diagnostic Telemetry */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container/60 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Anonymous Diagnostic Telemetry</h4>
                  <p className="text-xs text-outline mt-0.5 leading-relaxed max-w-lg">
                    Help improve AI simulation accuracy by sharing anonymized interaction performance metrics.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={anonymousTelemetry}
                    onChange={(e) => setAnonymousTelemetry(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-6">
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-sm font-semibold text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-sm font-semibold text-on-primary shadow-sm transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

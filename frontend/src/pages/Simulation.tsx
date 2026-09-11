import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  Pause, 
  Play, 
  Clock,
  Languages,
  User,
  Volume2,
  VolumeX
} from 'lucide-react';
import { NavTab } from '../types/navigation';
import { useSimulationConversation } from '../hooks/useSimulationConversation';
import { DialogueBubble } from '../components/simulation/DialogueBubble';
import { DialogueInput } from '../components/simulation/DialogueInput';

interface SimulationProps {
  onNavigate?: (tab: NavTab) => void;
}

type SimLanguage = 'en' | 'kn' | 'hi';

export const Simulation: React.FC<SimulationProps> = ({ onNavigate }) => {
  const [isPaused, setIsPaused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languageLabels: Record<SimLanguage, { name: string; native: string; placeholder: string }> = {
    en: { 
      name: 'English', 
      native: 'English (US)',
      placeholder: "Type your clinical question (e.g. 'Where does the pain start?')..."
    },
    kn: { 
      name: 'Kannada', 
      native: 'ಕನ್ನಡ',
      placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: 'ನೋವು ಎಲ್ಲಿ ಪ್ರಾರಂಭವಾಯಿತು?')..."
    },
    hi: { 
      name: 'Hindi', 
      native: 'हिन्दी',
      placeholder: "अपना प्रश्न यहाँ लिखें (उदा: 'दर्द कहाँ शुरू होता है?')..."
    }
  };

  const {
    messages,
    isProcessing,
    speakingMessageId,
    speechStatus,
    isMuted,
    language,
    sendMessage,
    playMessageSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    toggleMute,
    setLanguage
  } = useSimulationConversation({
    caseId: 'SIM-8842-AX',
    scenarioTitle: 'Acute Chest Pain',
    initialLanguage: 'en'
  });

  // Auto-scroll to bottom of conversation whenever messages change or processing starts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleLanguageChange = (newLang: SimLanguage) => {
    setLanguage(newLang);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Simulation Top Bar */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                ACTIVE ENCOUNTER
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                Case ID: SIM-8842-AX
              </span>
            </div>
            <h1 className="text-lg font-bold text-on-surface font-headline">
              Acute Chest Pain • Robert Henderson (58M)
            </h1>
          </div>
        </div>

        {/* Timer, Language & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selection: English, Kannada, Hindi */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container shadow-sm">
            <Languages className="w-3.5 h-3.5 text-primary shrink-0" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as SimLanguage)}
              aria-label="Simulation Language"
              className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer pr-1"
            >
              <option value="en">English</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
              <option value="hi">Hindi (हिन्दी)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold text-on-surface">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>08:42</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isPaused 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={() => onNavigate?.('assessments')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm"
          >
            <span>Conclude & Submit</span>
          </button>
        </div>
      </div>

      {/* Live Vitals Telemetry Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Heart Rate */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container/80 p-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-outline font-medium">Heart Rate</div>
            <div className="text-sm font-bold text-on-surface font-mono">94 bpm</div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container/80 p-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-primary flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-outline font-medium">Blood Pressure</div>
            <div className="text-sm font-bold text-on-surface font-mono">142/88 mmHg</div>
          </div>
        </div>

        {/* SpO2 */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container/80 p-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-outline font-medium">SpO2 (Room Air)</div>
            <div className="text-sm font-bold text-on-surface font-mono">97%</div>
          </div>
        </div>

        {/* Respiratory Rate */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container/80 p-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-outline font-medium">Resp. Rate</div>
            <div className="text-sm font-bold text-on-surface font-mono">20 / min</div>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container/80 p-3.5 flex items-center gap-3 shadow-sm col-span-2 sm:col-span-4 lg:col-span-1">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-outline font-medium">Core Temp</div>
            <div className="text-sm font-bold text-on-surface font-mono">37.1 °C</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Patient Avatar & Telemetry Profile */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/80 p-6 flex flex-col items-center text-center shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            {/* Patient Clinical Identity Avatar */}
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-teal-50 border-2 border-primary/20 flex items-center justify-center text-primary shadow-sm">
                <User className="w-12 h-12 text-primary" />
              </div>
              <span 
                title="Virtual Patient Telemetry Active"
                className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface-container-lowest shadow-sm"
              ></span>
            </div>

            <h2 className="text-base font-bold text-on-surface font-headline">Robert Henderson</h2>
            <p className="text-xs text-outline">58 Years • Male • Presenting in ED</p>

            <div className="w-full mt-4 pt-4 border-t border-surface-container text-left flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-outline font-medium">Chief Complaint:</span>
                <span className="text-on-surface font-semibold">Chest Pressure</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline font-medium">Known Allergies:</span>
                <span className="text-on-surface font-semibold">Penicillin (Rash)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline font-medium">Past History:</span>
                <span className="text-on-surface font-semibold">Hypertension, Smoker</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline font-medium">Current Meds:</span>
                <span className="text-on-surface font-semibold">Amlodipine 5mg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Consultation & Dialogue Transcript */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col h-[580px]">
            {/* Header: Patient Dialogue & TTS Controls */}
            <div className="flex items-center justify-between border-b border-surface-container pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-on-surface font-headline">
                  Patient Dialogue
                </h3>
                <span className="text-xs text-outline font-medium hidden sm:inline">
                  • Verbal consultation
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Global Patient Voice Mute / Unmute Toggle */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    isMuted
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-teal-50 text-primary border-teal-200/80 hover:bg-teal-100'
                  }`}
                  title={isMuted ? 'Patient voice is muted (click to unmute)' : 'Patient voice is active (click to mute)'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                      <span>Voice Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-primary" />
                      <span>Voice Active</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] font-semibold text-primary bg-teal-50 border border-teal-200/60 px-2.5 py-1 rounded-xl">
                  {languageLabels[language].native}
                </span>
              </div>
            </div>

            {/* Conversation Log View */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2">
              {messages.map((msg) => (
                <DialogueBubble
                  key={msg.id}
                  message={msg}
                  isSpeaking={speakingMessageId === msg.id}
                  isPaused={speakingMessageId === msg.id && speechStatus === 'paused'}
                  isMuted={isMuted}
                  onPlay={(id) => playMessageSpeech(id)}
                  onPause={pauseSpeech}
                  onResume={resumeSpeech}
                  onStop={stopSpeech}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Student Message Input Component */}
            <div className="mt-2">
              <DialogueInput
                placeholder={languageLabels[language].placeholder}
                isProcessing={isProcessing}
                onSend={(text) => sendMessage(text, 'text')}
                onVoiceRecordClick={() => {
                  // Prepared for future STT integration
                  alert('Voice dictation (STT) will be enabled when the speech recognition engine is connected.');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;

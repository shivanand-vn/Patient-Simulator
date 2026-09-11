import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  Mic, 
  Send, 
  Pause, 
  Play, 
  AlertCircle,
  Clock,
  Languages,
  User
} from 'lucide-react';
import { NavTab } from '../types/navigation';

interface SimulationProps {
  onNavigate?: (tab: NavTab) => void;
}

interface Message {
  sender: 'doctor' | 'patient' | 'system';
  text: string;
  time: string;
}

type SimLanguage = 'en' | 'kn' | 'hi';

export const Simulation: React.FC<SimulationProps> = ({ onNavigate }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [simulationLanguage, setSimulationLanguage] = useState<SimLanguage>('en');

  const languageLabels: Record<SimLanguage, { name: string; native: string; placeholder: string }> = {
    en: { 
      name: 'English', 
      native: 'English (US)',
      placeholder: "Type your clinical question (e.g. 'Can you rate your pain from 1 to 10?')..."
    },
    kn: { 
      name: 'Kannada', 
      native: 'ಕನ್ನಡ',
      placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: 'ನಿಮ್ಮ ಎದೆ ನೋವು ಹೇಗಿದೆ?')..."
    },
    hi: { 
      name: 'Hindi', 
      native: 'हिन्दी',
      placeholder: "अपना प्रश्न यहाँ लिखें (उदा: 'दर्द कितना तेज है?')..."
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'system',
      text: 'Simulation initiated: 58-year-old male presenting to ED triage with acute retrosternal chest pain. Virtual Patient ready.',
      time: '14:30'
    },
    {
      sender: 'doctor',
      text: 'Hello Mr. Henderson, I understand you are having chest pain. Can you tell me when this started?',
      time: '14:31'
    },
    {
      sender: 'patient',
      text: 'Doctor, it started about 45 minutes ago while I was climbing the stairs. It feels like a heavy pressure right in the middle of my chest, and it aches down into my left arm.',
      time: '14:31'
    }
  ]);

  const handleLanguageChange = (newLang: SimLanguage) => {
    setSimulationLanguage(newLang);
    let switchNote = '';
    if (newLang === 'kn') {
      switchNote = 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. AI ರೋಗಿ ಈಗ ಕನ್ನಡದಲ್ಲಿ ಸಂಭಾಷಣೆ ನಡೆಸುತ್ತಾರೆ.';
    } else if (newLang === 'hi') {
      switchNote = 'संवाद भाषा हिन्दी चुनी गई है। AI रोगी अब हिन्दी में बातचीत करेंगे।';
    } else {
      switchNote = 'Simulation language switched to English. Virtual Patient will now converse in English.';
    }
    setMessages((prev) => [
      ...prev,
      {
        sender: 'system',
        text: switchNote,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      sender: 'doctor',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulated patient response tailored to language
    setTimeout(() => {
      let patientReply = 'The pain hasn’t eased up at all, and I feel a bit short of breath and clammy.';
      if (simulationLanguage === 'kn') {
        patientReply = 'ನೋವು ಸ್ವಲ್ಪವೂ ಕಡಿಮೆಯಾಗಿಲ್ಲ ಡಾಕ್ಟರ್, ಉಸಿರಾಟಕ್ಕೂ ಕಷ್ಟವಾಗ್ತಿದೆ ಮತ್ತು ಮೈಯೆಲ್ಲಾ ಬೆವರು ಬರ್ತಿದೆ.';
      } else if (simulationLanguage === 'hi') {
        patientReply = 'दर्द बिल्कुल कम नहीं हुआ है डॉक्टर साहब, सांस लेने में भी तकलीफ हो रही है और पसीना आ रहा है।';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'patient',
          text: patientReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
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
              value={simulationLanguage}
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
            {/* Patient Clinical Identity Avatar (Lady image removed) */}
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
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col h-[560px]">
            {/* Header: Patient Dialogue */}
            <div className="flex items-center justify-between border-b border-surface-container pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-on-surface font-headline">
                  Patient Dialogue
                </h3>
                <span className="text-xs text-outline font-medium hidden sm:inline">
                  • Real-time verbal consultation
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-primary bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-md">
                  {languageLabels[simulationLanguage].native}
                </span>
                <span className="text-[11px] text-outline font-medium hidden sm:inline">
                  Speech Engine Active
                </span>
              </div>
            </div>

            {/* Conversation Log View */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3.5">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === 'doctor'
                      ? 'items-end'
                      : msg.sender === 'system'
                      ? 'items-center text-center'
                      : 'items-start'
                  }`}
                >
                  {msg.sender === 'system' ? (
                    <div className="p-2.5 bg-surface-container-low border border-surface-container rounded-xl text-[11px] text-outline max-w-md flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <div
                      className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'doctor'
                          ? 'bg-primary text-on-primary rounded-br-none'
                          : 'bg-surface-container-low text-on-surface border border-surface-container/60 rounded-bl-none'
                      }`}
                    >
                      <div className="font-semibold text-[10px] opacity-75 mb-1">
                        {msg.sender === 'doctor' ? 'You (Doctor)' : 'Patient (Robert Henderson)'} • {msg.time}
                      </div>
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Controls */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-surface-container flex items-center gap-2">
              <button
                type="button"
                title="Dictate with voice"
                className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors shrink-0"
              >
                <Mic className="w-4 h-4 text-primary" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={languageLabels[simulationLanguage].placeholder}
                className="flex-1 px-4 py-2.5 bg-surface-container-low/70 border border-surface-container rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary transition-colors shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;

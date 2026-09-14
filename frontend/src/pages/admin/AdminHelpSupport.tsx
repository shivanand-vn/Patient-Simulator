import React, { useState } from 'react';
import { 
  Headset, 
  Phone, 
  Search, 
  Activity, 
  Clock, 
  GraduationCap, 
  FileText, 
  Cpu, 
  ChevronRight, 
  ChevronDown, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const knowledgeItems: KnowledgeItem[] = [
  {
    id: 'k-1',
    icon: <Clock className="w-5 h-5 text-primary" />,
    title: 'OSCE Exam Setup & Timetables',
    desc: 'Cohort rotations, station pacing & bell timing sync protocols.'
  },
  {
    id: 'k-2',
    icon: <GraduationCap className="w-5 h-5 text-primary" />,
    title: 'Faculty Accounts & Onboarding',
    desc: 'SSO credential resets, evaluator role grants & rubric access.'
  },
  {
    id: 'k-3',
    icon: <FileText className="w-5 h-5 text-primary" />,
    title: 'Patient Scenario Scripting & Rubrics',
    desc: 'Vital sign logic branching, scoring criteria & trigger points.'
  },
  {
    id: 'k-4',
    icon: <Cpu className="w-5 h-5 text-primary" />,
    title: 'Rig Hardware & Telemetry Calibration',
    desc: 'SimMan 3G, Laerdal LLEAP bridges & serial sensor telemetry.'
  }
];

interface FAQItem {
  id: string;
  iconType: 'question' | 'alert';
  question: string;
  answer: string;
}

const faqList: FAQItem[] = [
  {
    id: 'faq-1',
    iconType: 'question',
    question: 'How do I reassign a lead faculty evaluator 1 hour before an exam?',
    answer: 'Navigate to Exam Scheduling > Select the active scheduled cohort > Click "Reschedule" > Choose any available verified faculty evaluator from the dropdown. Automated schedule changes are immediately broadcasted to candidate terminals and evaluator tablets.'
  },
  {
    id: 'faq-2',
    iconType: 'question',
    question: 'How to enroll backlog students into active cohort rotations?',
    answer: 'In Batch Management, select the target cohort > Click "Manage Students" > Filter by Backlog candidates > Assign candidate with their corresponding prerequisite clinical deficiency tag (e.g. Backlog-Cardio). The system balances station density automatically.'
  },
  {
    id: 'faq-3',
    iconType: 'alert',
    question: 'What to do if a station rig loses telemetry during an active exam?',
    answer: 'Immediately contact the Sim Lab Engineering Dispatch at Ext. 4400 or click "Run Self-Diagnostic Check" below to execute a soft bus reset on TCP/8080 without interrupting the examiner scoring rubric.'
  }
];

export const AdminHelpSupport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(prev => prev === id ? null : id);
  };

  const handleRunDiagnostics = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      showToast('All 12 telemetry station probes responded within 14ms. Zero packet loss.');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
          <span className="text-[11px] font-bold tracking-wider text-outline uppercase">
            SUPPORT PORTAL
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
          Help & Support Center
        </h1>
        <p className="text-xs sm:text-sm text-outline mt-0.5">
          Documentation, troubleshooting guides & clinical simulator emergency hotline
        </p>
      </div>

      {/* Emergency Desk Banner (High-Visibility Gradient Card) */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Exam Emergency Desk
            </span>
            <span className="text-[11px] text-teal-200 font-mono">24/7 Available</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-headline text-white">
            Sim Lab Engineering Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Direct priority bypass for technical lockouts & station telemetry drops during active OSCE runs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => showToast('Connecting to +1 (800) 555-SIMS (Simulation Dispatch)...')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-teal-950 font-bold text-xs hover:bg-teal-50 transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>+1 (800) 555-SIMS</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Direct extension 4400 connected to Senior Engineer on duty.')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700/60 hover:bg-teal-700 text-white border border-teal-500/40 font-semibold text-xs transition-colors"
            >
              <Headset className="w-3.5 h-3.5 text-emerald-300" />
              <span>Ext. 4400</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center pr-4 opacity-30 z-0">
          <Headset className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search troubleshooting guides, setup manuals, rig error codes..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-surface-container rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
        />
      </div>

      {/* Operational Status Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              SIM ENGINE TELEMETRY STATUS
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            99.9% Uptime
          </span>
        </div>

        <div className="z-10 mt-4">
          <h3 className="text-lg sm:text-xl font-bold font-headline text-white">
            All 12 Sim Labs Operational
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Telemetry pipelines, vital waveform streaming & hardware proctors operating nominally.
          </p>
        </div>
      </div>

      {/* Two-Column Grid: Knowledge Hub on Left, FAQ & Diagnostics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Knowledge Hub */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface font-headline">
              Knowledge Hub
            </h3>
            <span className="text-xs font-semibold text-outline">
              4 Specialized Disciplines
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {knowledgeItems.map(item => (
              <div
                key={item.id}
                onClick={() => showToast(`Opening documentation: ${item.title}`)}
                className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs flex items-center justify-between gap-3 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-outline mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Admin Runbook FAQ & Diagnostics */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Section: Admin Runbook FAQ */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="text-base font-bold text-on-surface font-headline">
                Admin Runbook FAQ
              </h3>
              <span className="text-[11px] font-semibold text-outline bg-surface-container-low px-2 py-0.5 rounded">
                Verified Protocols
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {faqList.map(faq => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-surface-container bg-surface-container-low/60 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-3.5 text-left flex items-start justify-between gap-3 text-xs sm:text-sm font-bold text-on-surface hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {faq.iconType === 'alert' ? (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        )}
                        <span>{faq.question}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-outline transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-3.5 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-surface-container/50 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: System Diagnostics & Ticketing */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-start justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-primary flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface font-headline">
                    System Diagnostics & Ticketing
                  </h3>
                  <p className="text-[11px] text-outline">
                    Generate hardware probe telemetry before requesting escalation
                  </p>
                </div>
              </div>
            </div>

            {/* Rig Bus Telemetry Snapshot Box */}
            <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-on-surface">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Rig Bus Telemetry Snapshot
                </span>
                <span className="text-[10px] text-outline font-mono">Synced 2m ago</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 bg-white rounded-lg border border-surface-container flex flex-col">
                  <span className="text-[10px] text-outline font-medium">Simulator Ping</span>
                  <span className="text-xs font-bold text-on-surface font-mono mt-0.5">12ms</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-surface-container flex flex-col">
                  <span className="text-[10px] text-outline font-medium">Packet Loss</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono mt-0.5">0.00%</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-surface-container flex flex-col">
                  <span className="text-[10px] text-outline font-medium">Audio Matrix</span>
                  <span className="text-xs font-bold text-teal-800 font-mono mt-0.5">Locked</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleRunDiagnostics}
                disabled={isDiagnosing}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-outline ${isDiagnosing ? 'animate-spin text-primary' : ''}`} />
                <span>{isDiagnosing ? 'Testing Probes...' : 'Run Self-Diagnostic Check'}</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Priority support escalation ticket synthesized and sent to IT Engineering.')}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Priority Support Ticket</span>
              </button>
            </div>
          </div>

          {/* Footer Release Notes Card */}
          <div className="p-4 bg-surface-container-lowest rounded-2xl border border-surface-container/90 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-primary flex items-center justify-center font-mono font-bold text-[10px]">
                v4.8
              </div>
              <div>
                <span className="font-bold text-on-surface block">SimAdmin Gateway v4.8.2</span>
                <span className="text-[11px] text-outline">Clinical Protocol Build 2025.03-LLEAP</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast('Displaying Release Notes for Build 2025.03-LLEAP')}
              className="text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>Release Notes</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 p-4 rounded-xl bg-emerald-900 text-white text-sm shadow-xl flex items-center gap-2 animate-fadeIn z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminHelpSupport;

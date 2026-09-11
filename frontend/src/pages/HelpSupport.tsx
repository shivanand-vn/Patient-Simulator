import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  Play, 
  Mic, 
  FileText, 
  ArrowRight, 
  ChevronDown, 
  CheckCircle2, 
  UploadCloud, 
  Send,
  BookOpen
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How are AI differential diagnoses graded?',
    answer: 'The grading engine evaluates your differential diagnoses against evidence-based clinical guidelines, ICD-10 diagnostic criteria, and case-specific gold standard rubrics. Points are awarded for primary diagnosis accuracy, relevant secondary differentials, and critical emergency rule-outs.'
  },
  {
    question: 'Can I pause a live simulation scenario?',
    answer: 'Yes. You can pause any encounter from the top simulation bar. The virtual patient vitals and state machine will freeze, and timer tracking will pause until you choose to resume or submit your debrief.'
  },
  {
    question: 'Where can I review evaluation rubrics and simulated encounter debriefs?',
    answer: 'Past simulation metrics, competency spider charts, and audio transcripts are saved in the My Results and My Sessions tabs. You can view step-by-step faculty debriefs and export clinical scorecards.'
  }
];

export const HelpSupport: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const [isAudioTesting, setIsAudioTesting] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleRunAudioTest = () => {
    setIsAudioTesting(true);
    setTimeout(() => {
      setIsAudioTesting(false);
      setSubmissionFeedback('Audio diagnostic check passed: Output latency 12ms, 0 packet loss.');
      setTimeout(() => setSubmissionFeedback(null), 3500);
    }, 1200);
  };

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType && !issueDescription) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionFeedback('Support ticket #TKT-2026-881 successfully submitted to clinical engineering.');
      setIssueType('');
      setIssueDescription('');
      setTimeout(() => setSubmissionFeedback(null), 4000);
    }, 1000);
  };

  const scrollToReport = () => {
    document.getElementById('report-issue-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      {/* Top Support Banner */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-8 bg-surface-container-lowest rounded-xl border border-surface-container/60 shadow-[0_1px_8px_rgba(0,102,102,0.04)]">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-outline mb-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Clinical Simulation Support Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface font-headline tracking-tight">
            How can we assist your clinical training today?
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Access comprehensive documentation, audio calibration guides, troubleshooting logs, and direct engineering support for the AI Patient Simulation Engine.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={scrollToReport}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98]"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Report an Issue</span>
          </button>
          
          <button
            onClick={() => setOpenFaq(0)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface text-sm font-semibold rounded-lg hover:bg-surface-container-highest transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse FAQ</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {submissionFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{submissionFeedback}</span>
        </div>
      )}

      {/* Section 1: Getting Started 3-Card Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface font-headline">Getting Started</h2>
          <span className="text-xs text-outline font-medium">Core Workflows & Navigation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-surface-container-lowest rounded-xl border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-base font-bold text-on-surface font-headline">
                How to Start a Simulation
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Navigate to the Practice Cases catalog, select a clinical difficulty tier, and click 'Launch Simulation' to initialize the virtual encounter room.
              </p>
            </div>
            <a 
              href="#report-issue-section" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>View step-by-step guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-surface-container-lowest rounded-xl border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-on-surface font-headline">
                Interacting with Virtual Patients
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Use natural voice dictation or the text input console to question patients about history of present illness, pain scale, and lifestyle factors.
              </p>
            </div>
            <a 
              href="#report-issue-section" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Learn voice syntax tips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-surface-container-lowest rounded-xl border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-on-surface font-headline">
                Examinations & Investigations
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Order CBC panels, chest radiographs, ECG traces, and execute physical touch exams directly from the workstation tool panel.
              </p>
            </div>
            <a 
              href="#report-issue-section" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Explore ordering manual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Section 2: Two Column (Voice Troubleshooting & Simulation Help FAQ) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Voice Troubleshooting */}
        <div className="p-6 bg-surface-container-lowest rounded-xl border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-container/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-on-surface font-headline">
                  Voice Troubleshooting
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-sm">
                Audio Check
              </span>
            </div>

            <p className="text-xs text-outline mt-3 leading-relaxed">
              Experiencing microphone latency or speech-to-text recognition delays? Follow these verification steps to calibrate your headset and system permissions.
            </p>

            <div className="mt-4 space-y-3">
              {/* Check 1 */}
              <div className="p-3.5 bg-surface-container-low/60 rounded-xl border border-surface-container/80 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">1. Microphone Permissions</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    Ensure your browser has explicit permission to access connected input devices in system privacy settings.
                  </p>
                </div>
              </div>

              {/* Check 2 */}
              <div className="p-3.5 bg-surface-container-low/60 rounded-xl border border-surface-container/80 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">2. Input Level Calibration</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    Speak at a normal conversational volume while observing the live waveform meter in the simulation toolbar.
                  </p>
                </div>
              </div>

              {/* Check 3 */}
              <div className="p-3.5 bg-surface-container-low/60 rounded-xl border border-surface-container/80 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">3. Noise Cancellation Conflicts</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    Disable external third-party software noise suppression that may filter out medical phonetics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-container/60 flex items-center justify-between text-xs">
            <span className="text-outline font-medium">Status: Input device detected (Jabra Evolve2)</span>
            <button
              onClick={handleRunAudioTest}
              disabled={isAudioTesting}
              className="px-4 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs transition-colors"
            >
              {isAudioTesting ? 'Testing...' : 'Run Audio Test'}
            </button>
          </div>
        </div>

        {/* Right: Simulation Help FAQ */}
        <div className="p-6 bg-surface-container-lowest rounded-xl border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-container/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-on-surface font-headline">
                  Simulation Help FAQ
                </h3>
              </div>
              <span className="text-xs text-outline font-medium">Common Queries</span>
            </div>

            <div className="mt-4 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-surface-container rounded-xl overflow-hidden bg-surface-container-lowest transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container-low/50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-on-surface pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-outline shrink-0 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-surface-container/40 bg-surface-container-low/20">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-surface-container/60 text-xs text-outline">
            Can't find what you're looking for? Submit a ticket below for 24/7 clinical lab assistance.
          </div>
        </div>
      </div>

      {/* Section 3: Technical Assistance Form (Report an Issue) */}
      <div id="report-issue-section" className="p-8 bg-surface-container-lowest rounded-xl border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-outline uppercase tracking-wider mb-1">
            <AlertCircle className="w-4 h-4 text-primary" />
            <span>Technical Assistance</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface font-headline">Report an Issue</h2>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Encountered a bug during simulation or have telemetry feedback? Submit a detailed report directly to our technical support desk.
          </p>
        </div>

        <form onSubmit={handleSubmitIssue} className="space-y-5">
          {/* Issue Type */}
          <div>
            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">
              Issue Type
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-surface-container rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="">Select issue category...</option>
              <option value="audio">Voice / Microphone Latency</option>
              <option value="ai-dialogue">Virtual Patient Dialogue Anomaly</option>
              <option value="vitals">Telemetry & Vitals Discrepancy</option>
              <option value="investigation">Lab Investigation Tool Ordering</option>
              <option value="scoring">Rubric Evaluation / Grading Issue</option>
              <option value="other">Other Workstation Glitch</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
              placeholder="Please describe the steps to reproduce the issue, patient case ID, and expected behavior..."
              className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-surface-container rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed resize-y"
            />
          </div>

          {/* Attach Screenshot Drag & Drop Box */}
          <div>
            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">
              Attach Screenshot <span className="text-outline font-normal">(Optional)</span>
            </label>
            <div className="p-6 border-2 border-dashed border-outline-variant hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 text-center bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors cursor-pointer">
              <UploadCloud className="w-7 h-7 text-primary" />
              <span className="text-xs font-semibold text-on-surface">Click to upload or drag and drop</span>
              <span className="text-[11px] text-outline">PNG, JPG, or WEBP up to 10MB</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98] disabled:opacity-75"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Issue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpSupport;

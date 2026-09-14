import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  SlidersHorizontal, 
  Bell, 
  Database, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Download, 
  ShieldCheck, 
  Clock, 
  Wifi, 
  Radio
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  // Environment & Rig Hardware States
  const [telemetrySync, setTelemetrySync] = useState(true);
  const [passingThreshold, setPassingThreshold] = useState(75);
  const [facultyBlind, setFacultyBlind] = useState(true);
  const [smsBroadcasts, setSmsBroadcasts] = useState(true);
  const [facultyWebhook, setFacultyWebhook] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('System parameters saved & broadcasted across all 12 simulation stations.');
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Top Banner: Environment Control */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-primary">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
                Environment Control
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-outline">
              Simulation environment parameters, scoring weights & telemetry sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Super Admin Policy</span>
          </span>
        </div>
      </div>

      {/* Latency / Stations / Sync State Ribbon */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Rig Latency */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-outline uppercase tracking-wider">
            RIG LATENCY
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-on-surface font-mono">14ms</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stable
            </span>
          </div>
        </div>

        {/* Stations */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-outline uppercase tracking-wider">
            STATIONS
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-on-surface font-mono">12 / 12</span>
            <span className="text-xs text-outline font-medium">Synchronized</span>
          </div>
        </div>

        {/* Sync State */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-outline uppercase tracking-wider">
            SYNC STATE
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-mono font-bold bg-teal-900 text-teal-100 px-2.5 py-1 rounded-lg">
              TCP:8080
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Connected</span>
          </div>
        </div>
      </div>

      {/* Main Settings Grid: 2 Columns for desktop layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Simulation & Hardware + OSCE Scoring */}
        <div className="flex flex-col gap-6">
          {/* Section 1: Simulation & Rig Hardware */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-primary flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-on-surface font-headline">
                  Simulation & Rig Hardware
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-outline bg-surface-container-low px-2.5 py-1 rounded-lg">
                Hardware Layer
              </span>
            </div>

            {/* Toggle: Automatic Mannequin Telemetry Sync */}
            <div className="flex items-center justify-between gap-4 py-1">
              <div>
                <div className="text-sm font-bold text-on-surface">Automatic Mannequin Telemetry Sync</div>
                <p className="text-xs text-outline mt-0.5">
                  Real-time biometric bidirectional pipeline with physical robotic rigs.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={telemetrySync}
                  onChange={(e) => setTelemetrySync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* SimMan Protocol Socket Info Box */}
            <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-on-surface">
                  <Radio className="w-4 h-4 text-primary" />
                  <span>SimMan 3G Rig Protocol</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-outline pt-1">
                <span>Target Socket:</span>
                <span className="text-on-surface font-bold bg-white px-2 py-0.5 rounded border border-surface-container">
                  TCP/IP Port 8080
                </span>
              </div>
            </div>

            {/* Vital Sign Anomaly Threshold */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface">Vital Sign Anomaly Threshold</span>
                <span className="text-primary font-semibold">Dynamic Curve</span>
              </div>
              <p className="text-xs text-outline">
                Real-time dynamic physiological curve thresholding with automatic damping.
              </p>

              {/* Graphical Waveform Simulation */}
              <div className="h-16 bg-surface-container-low rounded-xl border border-surface-container p-3 flex items-center justify-between relative overflow-hidden">
                <div className="flex items-center gap-1 w-full opacity-85">
                  <svg className="w-full h-10 stroke-primary fill-none" viewBox="0 0 500 50">
                    <path
                      d="M0,25 L100,25 L110,10 L120,40 L130,25 L200,25 L210,5 L225,45 L240,25 L350,25 L360,15 L370,35 L380,25 L500,25"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="absolute bottom-2 right-3 text-[10px] font-mono text-outline bg-white/80 px-2 py-0.5 rounded border border-surface-container shadow-xs">
                  ±2.4σ threshold
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: OSCE Scoring & Rubrics */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-primary flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-on-surface font-headline">
                  OSCE Scoring & Rubrics
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-outline bg-surface-container-low px-2.5 py-1 rounded-lg">
                Academic Rules
              </span>
            </div>

            {/* Passing Threshold Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface">Passing Threshold</span>
                <span className="text-base font-bold text-primary font-mono">{passingThreshold}%</span>
              </div>
              <p className="text-xs text-outline">
                Minimum Composite Score across all station domains.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-mono text-outline">50%</span>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={passingThreshold}
                  onChange={(e) => setPassingThreshold(Number(e.target.value))}
                  className="flex-1 accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
                />
                <span className="text-xs font-mono text-outline">95%</span>
              </div>
            </div>

            {/* Time Limit Per Station Cards */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-bold text-on-surface">Time Limit per Station</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex flex-col justify-between">
                  <span className="text-[11px] text-outline font-medium">Standard Station:</span>
                  <span className="text-sm font-bold text-on-surface mt-1 font-mono">15 Minutes</span>
                </div>
                <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex flex-col justify-between">
                  <span className="text-[11px] text-sky-900 font-medium">Countdown Alert:</span>
                  <span className="text-sm font-bold text-red-600 mt-1 font-mono">2 Min Warning</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-outline mt-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Station bells sync automated audio across testing cubicles.</span>
              </div>
            </div>

            {/* Toggle: Faculty Blind Evaluation */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-surface-container/60">
              <div>
                <div className="text-sm font-bold text-on-surface">Faculty Blind Evaluation</div>
                <p className="text-xs text-outline mt-0.5">
                  Student names anonymized with cryptographic tokens during live rubrics.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={facultyBlind}
                  onChange={(e) => setFacultyBlind(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications & Alerts + System & Backups */}
        <div className="flex flex-col gap-6">
          {/* Section 3: Notifications & Alerts */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-primary flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-on-surface font-headline">
                  Notifications & Alerts
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-outline bg-surface-container-low px-2.5 py-1 rounded-lg">
                Messaging
              </span>
            </div>

            {/* Toggle: SMS Exam Broadcasts */}
            <div className="flex items-center justify-between gap-4 py-1">
              <div>
                <div className="text-sm font-bold text-on-surface">SMS Exam Broadcasts</div>
                <p className="text-xs text-outline mt-0.5">
                  Transmit real-time station slot calls and delays to enrolled candidate devices.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={smsBroadcasts}
                  onChange={(e) => setSmsBroadcasts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Toggle: Faculty Assignment Webhook */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-surface-container/60">
              <div>
                <div className="text-sm font-bold text-on-surface">Faculty Assignment Webhook</div>
                <p className="text-xs text-outline mt-0.5">
                  Auto-dispatch confirmation endpoints when evaluators sign station check-ins.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={facultyWebhook}
                  onChange={(e) => setFacultyWebhook(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Section 4: System & Backups */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-primary flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-on-surface font-headline">
                  System & Backups
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-outline bg-surface-container-low px-2.5 py-1 rounded-lg">
                Core Ops
              </span>
            </div>

            {/* Automated Nightly Backup Box */}
            <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Wifi className="w-4 h-4 text-sky-700 shrink-0" />
                <div>
                  <div className="font-bold text-on-surface">Automated Nightly Backup</div>
                  <div className="text-[11px] text-outline font-mono mt-0.5">
                    Last snapshot: 03:00 AM UTC (AES-256)
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Healthy
              </span>
            </div>

            {/* System Core Version Box */}
            <div className="flex items-center justify-between py-1 text-xs">
              <div>
                <span className="text-outline font-medium">System Core Version</span>
                <div className="font-bold text-on-surface mt-0.5">Clinical Sim Engine Enterprise</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                v3.8.2 Online
              </span>
            </div>

            {/* Clear Cache & Export Audit Log Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-container/60">
              <button
                type="button"
                onClick={() => showToast('Station local cache purged successfully.')}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-outline" />
                <span>Clear Cache</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Audit trail exported (AES-256 encrypted .log).')}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-outline" />
                <span>Export Audit Log</span>
              </button>
            </div>
          </div>

          {/* Save All System Parameters Button */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All System Parameters</span>
            </button>
            <p className="text-[11px] text-outline text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span>Changes require Super Admin privileges to propagate</span>
            </p>
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

export default AdminSettings;

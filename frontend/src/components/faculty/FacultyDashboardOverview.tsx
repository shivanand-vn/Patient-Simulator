import React from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  ClipboardList, 
  Award, 
  Heart, 
  Wind,
  Activity
} from 'lucide-react';

interface FacultyDashboardOverviewProps {
  facultyName: string;
  onNavigateTab: (tab: 'assigned-exams' | 'teaching-mode' | 'assessment-mode') => void;
}

/**
 * Faculty Dashboard Overview Component
 * Provides comprehensive statistics, quick shortcuts, upcoming exam alerts, and recent evaluation metrics.
 */
export const FacultyDashboardOverview: React.FC<FacultyDashboardOverviewProps> = ({
  facultyName,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fadeIn text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Clinical Doctor (Faculty) Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-headline">
            Welcome back, {facultyName || 'Dr. Ramesh Kumar'}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl mt-1">
            You have <strong className="text-white">2 upcoming clinical examinations</strong> scheduled for Nursing Cohorts. 24 Nurse (Student) scorecards evaluated today.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => onNavigateTab('assessment-mode')}
            className="px-5 py-2.5 rounded-xl bg-white text-teal-950 font-bold text-xs hover:bg-teal-50 transition-all shadow-md flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4 text-teal-700" />
            <span>Start Assessment</span>
          </button>
          <button
            onClick={() => onNavigateTab('teaching-mode')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all backdrop-blur-md flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Teaching Demo</span>
          </button>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Assigned Exams */}
        <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Assigned Exams</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-on-surface font-headline">2</h3>
          <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
            Cardiology & Respiratory
          </span>
        </div>

        {/* Stat 2: Total Nurses */}
        <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Total Nurses (Students)</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-on-surface font-headline">118</h3>
          <span className="text-[11px] font-medium text-teal-600 flex items-center gap-1">
            ~59 per cohort (incl. backlogs)
          </span>
        </div>

        {/* Stat 3: Evaluations Completed */}
        <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Evaluated</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-on-surface font-headline">24 / 118</h3>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-500 h-full rounded-full w-[20%]" />
          </div>
        </div>

        {/* Stat 4: Average Score */}
        <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Batch Average</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-on-surface font-headline">86.4%</h3>
          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            Grade A (Pass rate: 96%)
          </span>
        </div>
      </div>

      {/* 2-Column Section: Next Upcoming Exam & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Scheduled Exam & Quick Clinical Cases */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Next Exam Scheduled Card */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-on-surface font-headline">
                  Next Scheduled Clinical Examination
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                Active Assessment
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary font-mono">EXAM-2026-001</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800">
                    Cardiology
                  </span>
                </div>
                <h4 className="text-base font-bold text-on-surface">
                  Acute Anterior STEMI (58yo Male)
                </h4>
                <p className="text-xs text-outline font-medium">
                  Cohort: <strong className="text-on-surface">2026 Nursing Cohort A</strong> (59 Nurses (Students), Regular & Backlogs)
                </p>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium mt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-outline" /> 2026-09-20
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-outline" /> 10:00 AM - 01:00 PM
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('assessment-mode')}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
              >
                <span>Launch Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Clinical Cases Reference */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Assigned Clinical Cases Repository
              </h3>
              <button
                onClick={() => onNavigateTab('teaching-mode')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Open Teaching Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigateTab('teaching-mode')}
                className="p-4 rounded-xl border border-surface-container hover:border-primary/50 hover:bg-surface-container-low/50 cursor-pointer transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono text-primary">CASE-CARD-001</span>
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <h4 className="text-xs font-bold text-on-surface">Acute Anterior STEMI</h4>
                <p className="text-[11px] text-outline line-clamp-2">
                  58M presenting with crushing substernal chest pain, diaphoresis, and hypertension.
                </p>
                <span className="text-[10px] font-semibold text-teal-700 mt-1">Ref: BP 145/95 • Pulse 104 bpm</span>
              </div>

              <div 
                onClick={() => onNavigateTab('teaching-mode')}
                className="p-4 rounded-xl border border-surface-container hover:border-primary/50 hover:bg-surface-container-low/50 cursor-pointer transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono text-primary">CASE-RESP-002</span>
                  <Wind className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="text-xs font-bold text-on-surface">Acute Severe Asthma Exacerbation</h4>
                <p className="text-[11px] text-outline line-clamp-2">
                  24F with acute dyspnea, expiratory wheeze, and tachycardia post viral infection.
                </p>
                <span className="text-[10px] font-semibold text-teal-700 mt-1">Ref: SpO₂ 91% • Pulse 118 bpm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Evaluations & Top Performers */}
        <div className="lg:col-span-1 bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-on-surface font-headline">
                  Recent Nurse (Student) Evaluations
                </h3>
              </div>
              <span className="text-[10px] text-outline font-medium">Nursing 2026</span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { name: 'Aditi Sharma', id: 'BMC2026001', case: 'Acute STEMI', score: 94, grade: 'A+' },
                { name: 'Rohan Deshmukh', id: 'BMC2026014', case: 'Acute STEMI', score: 86, grade: 'A' },
                { name: 'Kavya Nair (Backlog)', id: 'BMC2025044', case: 'Acute STEMI', score: 78, grade: 'B' },
                { name: 'Siddharth Rao', id: 'BMC2026029', case: 'Severe Asthma', score: 90, grade: 'A+' },
              ].map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-on-surface">{ev.name}</span>
                    <span className="text-[10px] text-outline">{ev.id} • {ev.case}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-on-surface font-headline">{ev.score}/100</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800">
                      {ev.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('assigned-exams')}
            className="w-full py-2.5 rounded-xl border border-surface-container hover:bg-surface-container text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>View Full Examination Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

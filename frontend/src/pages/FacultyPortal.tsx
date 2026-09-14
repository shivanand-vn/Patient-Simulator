import React from 'react';
import { 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  LogOut, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FacultyPortal: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-surface-container-lowest border-b border-surface-container px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-primary tracking-tight font-headline">
              AI Patient Simulation Engine
            </h1>
            <span className="text-[11px] text-teal-800 font-semibold uppercase tracking-wider">
              Faculty Evaluation Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
              MC
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-on-surface">{user.name || 'Dr. Marcus Chen'}</span>
              <span className="text-[10px] text-outline font-medium">Cardiology Faculty Lead</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-8 flex flex-col gap-6 animate-fadeIn">
        {/* Banner */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>OSCE Evaluator Terminal Online</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface font-headline">
              Welcome, {user.name || 'Dr. Marcus Chen'}
            </h2>
            <p className="text-xs sm:text-sm text-outline mt-1 max-w-xl">
              Faculty clinical evaluation terminal. Review assigned simulation cases, monitor active candidate cohorts, and complete OSCE assessment rubrics.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
              Assigned: Case-001 (Cardiology)
            </span>
          </div>
        </div>

        {/* Assigned Cohorts & Upcoming Evaluations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-outline uppercase font-mono">
                  UPCOMING OSCE EVALUATION
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Scheduled
                </span>
              </div>
              <h3 className="text-base font-bold text-on-surface font-headline">
                Chest Pain Assessment (CASE-001)
              </h3>
              <p className="text-xs text-outline mt-1">
                Batch 2026 - Year 3 Clinicals (59 candidates enrolled)
              </p>

              <div className="mt-4 p-3 bg-surface-container-low rounded-xl flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>18 Sep 2026 • 10:00 AM EST (Sim Center A - Rig 3)</span>
                </div>
                <div className="flex items-center gap-2 text-outline">
                  <Users className="w-3.5 h-3.5 text-outline" />
                  <span>Lead Evaluator Assigned</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container/60 flex items-center justify-between">
              <span className="text-xs text-outline font-mono">Standardized OSCE Rubric v2</span>
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors"
              >
                <span>Launch Rubric Evaluator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-outline uppercase font-mono">
                  PORTAL STATUS
                </span>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <h3 className="text-base font-bold text-on-surface font-headline">
                Faculty Debriefing & Scoring
              </h3>
              <p className="text-xs text-outline mt-1">
                Clinical evaluation tools, live OSCE observation dashboards, and debriefing notes modules are being integrated.
              </p>

              <div className="mt-4 p-3 bg-teal-50/60 border border-teal-100 rounded-xl flex items-center gap-2.5 text-xs text-teal-900">
                <ClipboardCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Examinations and timetable schedules are managed centrally by the Administrator.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container/60 flex items-center justify-between">
              <span className="text-xs text-outline">Role: Faculty</span>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Switch Role / Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacultyPortal;

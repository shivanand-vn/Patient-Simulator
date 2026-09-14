import React, { useState } from 'react';
import { 
  Stethoscope, 
  FolderGit2, 
  Users, 
  FileText, 
  Calendar, 
  Plus, 
  CalendarClock, 
  UserPlus, 
  ArrowRight, 
  GraduationCap, 
  UserCheck, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Activity
} from 'lucide-react';
import { AdminNavTab } from '../../types/navigation';
import { useAdminData } from '../../context/AdminDataContext';

interface AdminDashboardProps {
  onNavigate: (tab: AdminNavTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeBottomTab, setActiveBottomTab] = useState<'faculty' | 'batches' | 'cases'>('faculty');
  const { faculty, batches, cases, exams } = useAdminData();

  const totalStudents = batches.reduce((sum, b) => sum + (b.enrolled || 0), 0);
  const activeFacultyCount = faculty.filter(f => f.status === 'Active').length;
  const validatedCasesCount = cases.filter(c => c.status === 'Active').length;

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary shrink-0 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-outline">
              Overview of the simulation assessment system
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-3 py-1.5 rounded-xl shadow-xs">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>System Administrator Mode</span>
        </div>
      </div>

      {/* Engine Core Status Banner */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container/90 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-on-surface">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SIMulation Engine Core • v3.8.2 Online</span>
        </div>
        <div className="text-[11px] font-mono text-outline font-semibold">
          UTC -04:00
        </div>
      </div>

      {/* Stat Cards Grid (4 Top Metric Cards - Connected to live data with zero-state fallbacks) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Faculty */}
        <div 
          onClick={() => onNavigate('admin-faculty')}
          className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-outline">Total Faculty</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-primary border border-teal-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-on-surface font-mono">
              {faculty.length}
            </span>
            <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              activeFacultyCount > 0
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                : 'text-outline bg-surface-container-low'
            }`}>
              {activeFacultyCount > 0 && <CheckCircle2 className="w-3 h-3" />}
              {activeFacultyCount > 0 ? `${activeFacultyCount} Active` : '0 Active'}
            </span>
          </div>
        </div>

        {/* Total Batches */}
        <div 
          onClick={() => onNavigate('admin-batches')}
          className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-outline">Total Batches</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-on-surface font-mono">
              {batches.length}
            </span>
            <span className="text-[11px] font-medium text-outline bg-surface-container-low px-2 py-0.5 rounded-md">
              {batches.length > 0 ? `${batches.length} Cohorts` : 'No Batches'}
            </span>
          </div>
        </div>

        {/* Total Students */}
        <div 
          onClick={() => onNavigate('admin-batches')}
          className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-outline">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-on-surface font-mono">
              {totalStudents}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              totalStudents > 0
                ? 'text-teal-700 bg-teal-50 border border-teal-200'
                : 'text-outline bg-surface-container-low'
            }`}>
              {totalStudents > 0 ? '100% Synced' : '0 Enrolled'}
            </span>
          </div>
        </div>

        {/* Total Cases */}
        <div 
          onClick={() => onNavigate('admin-cases')}
          className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-outline">Total Cases</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-on-surface font-mono">
              {cases.length}
            </span>
            <span className="text-[11px] font-medium text-outline bg-surface-container-low px-2 py-0.5 rounded-md">
              {validatedCasesCount > 0 ? `${validatedCasesCount} Validated` : '0 Validated'}
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Exams Queued Banner */}
      <div 
        onClick={() => onNavigate('admin-scheduling')}
        className="bg-gradient-to-r from-teal-100/70 via-cyan-50/80 to-emerald-50/70 border border-teal-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs cursor-pointer hover:border-teal-400/80 transition-all group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-teal-900 uppercase">
              UPCOMING EXAMS
            </div>
            <div className="text-base sm:text-lg font-bold text-on-surface font-headline">
              {exams.length > 0 
                ? `${exams.length} Cohort${exams.length > 1 ? 's' : ''} Queued for Examination`
                : '0 Cohorts Queued for Examination'
              }
            </div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/90 border border-teal-300 text-teal-900 font-bold text-lg flex items-center justify-center font-mono shadow-xs">
          {exams.length}
        </div>
      </div>

      {/* Fast Actions Bar */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
          FAST ACTIONS
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('admin-scheduling')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm"
          >
            <CalendarClock className="w-4 h-4" />
            <span>Schedule Exam</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('admin-faculty')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-on-surface transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-primary" />
            <span>Add Faculty</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('admin-batches')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-on-surface transition-all shadow-xs"
          >
            <Users className="w-4 h-4 text-primary" />
            <span>Create Batch</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('admin-cases')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-on-surface transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span>Add Case</span>
          </button>
        </div>
      </div>

      {/* Upcoming Exams Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-on-surface font-headline">
              Upcoming Exams
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              exams.length > 0 
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'bg-surface-container-low text-outline border border-surface-container'
            }`}>
              {exams.length} Scheduled
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('admin-scheduling')}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-teal-800 transition-colors"
          >
            <span>Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Exams List or Empty State */}
        {exams.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container/90 p-8 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary border border-teal-100 flex items-center justify-center mb-3">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-on-surface font-headline mb-1">
              No Upcoming Exams Scheduled
            </h3>
            <p className="text-xs text-outline max-w-sm mb-4">
              There are currently no clinical exams or OSCE stations scheduled for any cohort.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('admin-scheduling')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule First Exam</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exams.map(exam => (
              <div 
                key={exam.id}
                className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-outline font-mono uppercase px-2 py-0.5 rounded bg-surface-container-low">
                      {exam.date} • {exam.time}
                    </span>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                      {exam.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface font-headline mb-3">
                    {exam.caseTitle}
                  </h3>

                  <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-xl flex flex-col gap-1.5 text-xs text-on-surface mb-3">
                    <div className="flex items-center gap-2 text-sky-950 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <span>{exam.batchName} ({exam.studentCount} Students)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sky-950">
                      <UserCheck className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <span>Lead Evaluator: {exam.evaluatorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sky-950">
                      <Clock className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <span>Station: {exam.rigLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-container/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-outline font-medium">
                    OSCE Session Active
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('admin-scheduling')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-100/70 hover:bg-sky-200 text-sky-950 text-xs font-semibold transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Segmented Tabbed Section (Faculty | Batches | Cases) */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        {/* Segmented Control Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-surface-container max-w-md">
          <button
            type="button"
            onClick={() => setActiveBottomTab('faculty')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeBottomTab === 'faculty'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Faculty
          </button>
          <button
            type="button"
            onClick={() => setActiveBottomTab('batches')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeBottomTab === 'batches'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Batches
          </button>
          <button
            type="button"
            onClick={() => setActiveBottomTab('cases')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeBottomTab === 'cases'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Cases
          </button>
        </div>

        {/* Tab 1: Faculty View */}
        {activeBottomTab === 'faculty' && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-surface-container">
              <span className="font-bold text-outline uppercase tracking-wider">
                ACTIVE CLINICAL FACULTY ({faculty.length} TOTAL)
              </span>
              <button
                type="button"
                onClick={() => onNavigate('admin-faculty')}
                className="text-primary font-semibold hover:underline"
              >
                View All Faculty
              </button>
            </div>

            {faculty.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary border border-teal-100 flex items-center justify-center mb-3">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-on-surface mb-1">
                  No Faculty Members Found
                </h4>
                <p className="text-xs text-outline max-w-sm mb-4">
                  No clinical faculty instructors or evaluators have been added yet.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-faculty')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-on-surface transition-all shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-primary" />
                  <span>Add Faculty Member</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-surface-container">
                {faculty.slice(0, 5).map(member => (
                  <div key={member.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-200">
                        {member.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-on-surface">{member.name}</h4>
                          <span className={`w-2 h-2 rounded-full ${
                            member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></span>
                        </div>
                        <p className="text-xs text-outline flex items-center gap-2 mt-0.5">
                          <span>{member.specialty}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {member.email}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:flex items-center gap-1 text-xs text-outline font-mono">
                        <Phone className="w-3 h-3" /> {member.phone}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Batches View */}
        {activeBottomTab === 'batches' && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-surface-container">
              <span className="font-bold text-outline uppercase tracking-wider">
                ACTIVE SIMULATION COHORTS ({batches.length} TOTAL)
              </span>
              <button
                type="button"
                onClick={() => onNavigate('admin-batches')}
                className="text-primary font-semibold hover:underline"
              >
                View All Batches
              </button>
            </div>

            {batches.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center mb-3">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-on-surface mb-1">
                  No Active Cohorts Found
                </h4>
                <p className="text-xs text-outline max-w-sm mb-4">
                  No student batches or academic cohorts have been initialized yet.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-batches')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-on-surface transition-all shadow-xs"
                >
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>Create First Batch</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {batches.map(batch => (
                  <div 
                    key={batch.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-on-surface">{batch.name}</h4>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {batch.status}
                        </span>
                      </div>
                      <p className="text-xs text-outline mt-0.5">{batch.yearTrack} • {batch.clinicalTrack}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-on-surface pt-2 border-t border-surface-container/60">
                      <span>{batch.enrolled} Students</span>
                      <span>{batch.casesBound} Scenarios</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cases View */}
        {activeBottomTab === 'cases' && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-surface-container">
              <span className="font-bold text-outline uppercase tracking-wider">
                VALIDATED CLINICAL SCENARIOS ({cases.length} TOTAL)
              </span>
              <button
                type="button"
                onClick={() => onNavigate('admin-cases')}
                className="text-primary font-semibold hover:underline"
              >
                View All Cases
              </button>
            </div>

            {cases.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary border border-teal-100 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-on-surface mb-1">
                  No Clinical Cases Found
                </h4>
                <p className="text-xs text-outline max-w-sm mb-4">
                  No validated simulation scenarios or clinical cases have been created yet.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-cases')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-on-surface transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>Add Clinical Case</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cases.map(c => (
                  <div 
                    key={c.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-2"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-outline font-mono uppercase">
                        {c.code} • {c.specialty}
                      </span>
                      <h4 className="text-sm font-bold text-on-surface mt-1">{c.title}</h4>
                    </div>
                    <div className="text-[11px] text-outline pt-2 border-t border-surface-container/60 flex items-center justify-between">
                      <span>{c.rubric}</span>
                      <span className="text-teal-700 font-semibold">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

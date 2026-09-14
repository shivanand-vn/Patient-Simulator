import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CalendarClock, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Activity, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  Stethoscope 
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const AdminExamScheduling: React.FC = () => {
  const { exams, batches, cases, faculty, scheduleExam, cancelExam } = useAdminData();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form selection states
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [examDate, setExamDate] = useState('2026-09-18');
  const [examTime, setExamTime] = useState('10:00 AM EST');
  const [rigNumber, setRigNumber] = useState('Sim Center A - Rig 3');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const batch = batches.find(b => b.id === selectedBatchId) || batches[0];
    const clinicalCase = cases.find(c => c.id === selectedCaseId) || cases[0];
    const evaluator = faculty.find(f => f.id === selectedFacultyId) || faculty[0];

    const batchName = batch ? batch.name : 'Cohort Session Alpha';
    const caseTitle = clinicalCase ? clinicalCase.title : 'Standard Clinical OSCE Assessment';
    const evaluatorName = evaluator ? evaluator.name : 'Lead Clinical Proctor';
    const studentCount = batch ? batch.enrolled : 30;

    scheduleExam({
      date: examDate,
      time: examTime,
      caseTitle,
      batchName,
      studentCount,
      rigLocation: rigNumber,
      evaluatorName,
      status: 'Scheduled'
    });

    showToast(`OSCE Examination scheduled successfully for ${batchName}.`);
  };

  const handleCancel = (id: string) => {
    cancelExam(id);
    showToast('Examination session removed from timetable.');
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
          <span className="text-[11px] font-bold tracking-wider text-outline uppercase">
            OSCE ORCHESTRATION PROTOCOL
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
          Exam Scheduling
        </h1>
        <p className="text-xs sm:text-sm text-outline mt-0.5">
          Coordinate OSCE examinations, assign faculty evaluators & timetable
        </p>
      </div>

      {/* Admin Access Level Info Card */}
      <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-950">Administrative Access Level</span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              Secured
            </span>
          </div>
          <p className="text-xs text-sky-900 mt-0.5 leading-relaxed">
            Only system administrators can schedule or modify exam cohorts. Faculty cannot edit date or assigned cohort.
          </p>
        </div>
      </div>

      {/* Main Grid: Form on Left, Telemetry & Scheduled List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 4-Step Session Builder Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container/80">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-on-surface font-headline">
                New OSCE Session Builder
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold text-outline uppercase bg-surface-container px-2 py-1 rounded">
              RIG CONFIG 4-STEP
            </span>
          </div>

          <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-4 text-xs">
            {/* Step 1: Target Cohort */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-primary font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Target Cohort / Student Batch</span>
                </label>
                <span className="text-[11px] font-medium text-emerald-700">
                  {batches.length > 0 ? `${batches.length} Available` : 'No Batches Found'}
                </span>
              </div>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer font-medium"
              >
                {batches.length === 0 ? (
                  <option value="">No batches created yet (Create a batch in Batches tab)</option>
                ) : (
                  batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.enrolled} candidates • {b.yearTrack})
                    </option>
                  ))
                )}
              </select>
              <span className="text-[11px] text-outline flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-outline" />
                <span>Synchronizes active candidate rosters and OSCE evaluation rubrics</span>
              </span>
            </div>

            {/* Step 2: Simulation Diagnostic Case */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-primary font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Simulation Diagnostic Case</span>
                </label>
                <span className="text-[11px] font-medium text-outline">
                  {cases.length > 0 ? `${cases.length} Validated` : 'No Cases Found'}
                </span>
              </div>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer font-medium"
              >
                {cases.length === 0 ? (
                  <option value="">No cases authored yet (Create a case in Cases tab)</option>
                ) : (
                  cases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title} [{c.specialty}]
                    </option>
                  ))
                )}
              </select>
              <div className="p-2.5 bg-sky-50/60 border border-sky-100 rounded-xl flex items-center justify-between text-[11px] text-sky-950 font-mono">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-700" />
                  Vitals Rig: Telemetry + Arterial Line
                </span>
                <span className="font-bold">EST. 18 MIN/STUDENT</span>
              </div>
            </div>

            {/* Step 3: Lead Evaluator / Faculty */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-primary font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Lead Evaluator / Faculty</span>
                </label>
                <span className="text-[11px] font-medium text-emerald-700">
                  {faculty.length > 0 ? `${faculty.length} Evaluators` : 'No Faculty Found'}
                </span>
              </div>
              <select
                value={selectedFacultyId}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer font-medium"
              >
                {faculty.length === 0 ? (
                  <option value="">No faculty registered (Add faculty in Faculty tab)</option>
                ) : (
                  faculty.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} - {f.specialty}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Step 4: Timetable & Rig Assignment */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-primary font-bold flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>Timetable & Rig Assignment</span>
                </label>
                <span className="text-[11px] font-mono text-outline">EST Zone</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-outline font-medium">Scheduled Date</span>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-outline font-medium">Start Time</span>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={examTime}
                      onChange={(e) => setExamTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[11px] text-outline font-medium">Simulation Lab & Rig Number</span>
                <select
                  value={rigNumber}
                  onChange={(e) => setRigNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer font-medium"
                >
                  <option value="Sim Center A - Rig 3 (High-Fidelity Adult)">Sim Center A - Rig 3 (High-Fidelity Adult)</option>
                  <option value="Sim Center B - Rig 1 (Critical Care Suite)">Sim Center B - Rig 1 (Critical Care Suite)</option>
                  <option value="Sim Center C - Rig 2 (Pediatric Resus)">Sim Center C - Rig 2 (Pediatric Resus)</option>
                </select>
              </div>
            </div>

            {/* Schedule Examination Submit Button */}
            <div className="pt-3 border-t border-surface-container/80 flex flex-col gap-1.5 mt-1">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Schedule Examination</span>
              </button>
              <span className="text-[11px] text-outline text-center">
                Broadcasts automated notifications to candidate devices and evaluator terminals.
              </span>
            </div>
          </form>
        </div>

        {/* Right Column: Station Telemetry Preview & Upcoming Cohorts */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Target Station Telemetry Card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 sm:p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-on-surface font-headline">
                  Station Hardware Telemetry
                </h3>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Online
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-0.5">
                <span className="text-[10px] text-outline font-medium">Station A1</span>
                <span className="font-bold text-emerald-700 font-mono text-xs">Ready</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-0.5">
                <span className="text-[10px] text-outline font-medium">Station B2</span>
                <span className="font-bold text-emerald-700 font-mono text-xs">Ready</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-0.5">
                <span className="text-[10px] text-outline font-medium">Station C1</span>
                <span className="font-bold text-emerald-700 font-mono text-xs">Ready</span>
              </div>
            </div>

            {/* Visual Mannequin Lab Card */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-white p-4 min-h-[140px] flex flex-col justify-end">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent z-0"></div>
              <div className="relative z-10">
                <span className="text-sm font-bold block">Rig 3 - High Fidelity</span>
                <span className="text-xs text-slate-300 block">
                  Sim Center Alpha • Station Calibrated
                </span>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>MANNEQUIN #44-A</span>
                  <span>ONLINE • TELEMETRY ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Scheduled Cohorts List */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 sm:p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-on-surface font-headline">
                  Upcoming Scheduled Cohorts
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-outline bg-surface-container px-2 py-0.5 rounded">
                {exams.length} Upcoming
              </span>
            </div>

            {exams.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center mb-2">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-on-surface mb-0.5">No Scheduled Exams</h4>
                <p className="text-[11px] text-outline max-w-xs">
                  Fill out the 4-step builder on the left to schedule an OSCE examination.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {exams.map(exam => (
                  <div
                    key={exam.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded">
                          {exam.date}
                        </span>
                        <span className="text-outline">{exam.time}</span>
                      </div>
                      <div className="w-6 h-6 rounded bg-teal-50 text-primary flex items-center justify-center">
                        <Stethoscope className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{exam.caseTitle}</h4>
                      <p className="text-xs text-outline mt-0.5">
                        {exam.batchName} ({exam.studentCount} students)
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium pt-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                        ● {exam.status}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-on-surface-variant border border-surface-container">
                        {exam.rigLocation}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold">
                        {exam.evaluatorName} Confirmed
                      </span>
                    </div>

                    <div className="pt-2 border-t border-surface-container/60 flex items-center justify-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => showToast(`Rescheduling flow opened for ${exam.caseTitle}`)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reschedule</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(exam.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

export default AdminExamScheduling;

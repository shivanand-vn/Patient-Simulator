import React, { useState } from 'react';
import { 
  UserCheck, 
  FileText, 
  CheckSquare, 
  Activity, 
  Award, 
  Printer, 
  ChevronRight, 
  ArrowLeft,
  Heart
} from 'lucide-react';
import { VoiceTranscript } from './VoiceTranscript';

interface StudentOption {
  id: string;
  name: string;
  studentId: string;
  batch: string;
  isBacklog: boolean;
}

const MOCK_STUDENTS: StudentOption[] = [
  { id: '1', name: 'Aditi Sharma', studentId: 'BMC2026001', batch: '2026 MBBS Batch A', isBacklog: false },
  { id: '2', name: 'Rohan Deshmukh', studentId: 'BMC2026014', batch: '2026 MBBS Batch A', isBacklog: false },
  { id: '3', name: 'Kavya Nair', studentId: 'BMC2025044', batch: '2026 MBBS Batch A', isBacklog: true }, // Backlog student
  { id: '4', name: 'Siddharth Rao', studentId: 'BMC2026029', batch: '2026 MBBS Batch A', isBacklog: false },
  { id: '5', name: 'Pooja Hegde', studentId: 'BMC2025052', batch: '2026 MBBS Batch A', isBacklog: true }, // Backlog student
];

interface CaseDetails {
  caseId: string;
  title: string;
  category: 'Cardiology' | 'Respiratory';
  patientName: string;
  age: number;
  gender: string;
  doctorName: string;
  chiefComplaint: string;
  targetVitals: {
    sysBp: number;
    diaBp: number;
    pulse: number;
    spo2: number;
    temp: number;
  };
}

const ACTIVE_CASE: CaseDetails = {
  caseId: 'CASE-CARD-001',
  title: 'Acute Anterior STEMI (Cardiology)',
  category: 'Cardiology',
  patientName: 'Ramesh Gowda',
  age: 58,
  gender: 'Male',
  doctorName: 'Dr. Ramesh Kumar (Cardiologist)',
  chiefComplaint: 'Severe substernal crushing chest pain radiating to left shoulder and jaw for 2 hours with profuse diaphoresis.',
  targetVitals: {
    sysBp: 145,
    diaBp: 95,
    pulse: 104,
    spo2: 93,
    temp: 37.1,
  },
};

/**
 * 4-Step Interactive Clinical Assessment Workflow for Faculty
 * Step 1: Patient Info & Student Selection
 * Step 2: Patient Complaint & Voice STT
 * Step 3: Predefined Sequence Checklist Verification
 * Step 4: Vital Signs Recording, Target Range Comparison & Grade Scorecard
 */
export const FacultyAssessmentWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [studentFilter, setStudentFilter] = useState<'all' | 'regular' | 'backlog'>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0].id);

  const selectedStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];

  // Checklist sequence state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'seq_1': true,
    'seq_2': true,
    'seq_3': true,
    'seq_4': false,
    'seq_5': true,
    'seq_6': false,
    'seq_7': false,
  });

  // Recorded Vitals Inputs
  const [sysBpInput, setSysBpInput] = useState<string>('140');
  const [diaBpInput, setDiaBpInput] = useState<string>('90');
  const [pulseInput, setPulseInput] = useState<string>('100');
  const [spo2Input, setSpo2Input] = useState<string>('94');
  const [tempInput, setTempInput] = useState<string>('37.0');

  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  const filteredStudents = MOCK_STUDENTS.filter((s) => {
    if (studentFilter === 'regular') return !s.isBacklog;
    if (studentFilter === 'backlog') return s.isBacklog;
    return true;
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Evaluation Score Calculation Logic
  const calculateScore = () => {
    const totalChecklistItems = Object.keys(checklist).length;
    const completedChecklistItems = Object.values(checklist).filter(Boolean).length;
    const sequenceScore = Math.round((completedChecklistItems / totalChecklistItems) * 50); // 50 marks max

    // Vitals accuracy scoring (50 marks max)
    const sysDiff = Math.abs((parseFloat(sysBpInput) || 0) - ACTIVE_CASE.targetVitals.sysBp);
    const diaDiff = Math.abs((parseFloat(diaBpInput) || 0) - ACTIVE_CASE.targetVitals.diaBp);
    const pulseDiff = Math.abs((parseFloat(pulseInput) || 0) - ACTIVE_CASE.targetVitals.pulse);
    const spo2Diff = Math.abs((parseFloat(spo2Input) || 0) - ACTIVE_CASE.targetVitals.spo2);

    let vitalsScore = 50;
    if (sysDiff > 10) vitalsScore -= 8;
    if (diaDiff > 10) vitalsScore -= 8;
    if (pulseDiff > 8) vitalsScore -= 10;
    if (spo2Diff > 3) vitalsScore -= 14;
    vitalsScore = Math.max(0, vitalsScore);

    const totalMarks = sequenceScore + vitalsScore;
    let grade = 'A+';
    if (totalMarks < 90 && totalMarks >= 80) grade = 'A';
    else if (totalMarks < 80 && totalMarks >= 70) grade = 'B';
    else if (totalMarks < 70 && totalMarks >= 60) grade = 'C';
    else if (totalMarks < 60) grade = 'Fail';

    return {
      sequenceScore,
      vitalsScore,
      totalMarks,
      grade,
      completedChecklistItems,
      totalChecklistItems,
    };
  };

  const scoreResult = calculateScore();

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fadeIn text-left">
      {/* 4-Step Progress Indicator Bar */}
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-4 shadow-xs flex items-center justify-between">
        {[
          { step: 1, label: 'Patient Info & Nurse (Student)', icon: UserCheck },
          { step: 2, label: 'Patient Complaint & Voice STT', icon: FileText },
          { step: 3, label: 'Predefined Sequence', icon: CheckSquare },
          { step: 4, label: 'Vitals & Scorecard', icon: Activity },
        ].map((s, idx) => {
          const IconComp = s.icon;
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;
          return (
            <React.Fragment key={s.step}>
              <button
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : isDone
                    ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                    : 'text-outline hover:bg-surface-container font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isDone
                      ? 'bg-teal-200 text-teal-900'
                      : 'bg-surface-container-high text-outline'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs hidden md:inline">{s.label}</span>
              </button>
              {idx < 3 && <div className="h-0.5 w-6 bg-surface-container-high hidden md:block" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: PATIENT INFO & STUDENT SELECTION */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Student Selector Card */}
          <div className="lg:col-span-1 bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Select Nurse (Student) for Exam
              </h3>
              <span className="text-xs text-outline font-medium">Assigned Nursing Cohort</span>
            </div>

            {/* Regular vs Backlog Filter */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              <button
                onClick={() => setStudentFilter('all')}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  studentFilter === 'all' ? 'bg-white text-on-surface shadow-xs' : 'text-outline'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStudentFilter('regular')}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  studentFilter === 'regular' ? 'bg-white text-on-surface shadow-xs' : 'text-outline'
                }`}
              >
                Regular
              </button>
              <button
                onClick={() => setStudentFilter('backlog')}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  studentFilter === 'backlog' ? 'bg-red-50 text-red-700 shadow-xs' : 'text-outline'
                }`}
              >
                Backlog
              </button>
            </div>

            {/* Student List */}
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {filteredStudents.map((stu) => (
                <button
                  key={stu.id}
                  onClick={() => setSelectedStudentId(stu.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedStudentId === stu.id
                      ? 'border-primary bg-primary-container/30 text-on-primary-container font-semibold shadow-xs'
                      : 'border-surface-container hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold">{stu.name}</span>
                    <span className="text-[10px] text-outline font-mono">{stu.studentId} • {stu.batch}</span>
                  </div>
                  {stu.isBacklog ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-800">
                      Backlog
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800">
                      Regular
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details Card */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                  Patient & Case Information
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  {ACTIVE_CASE.caseId}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                  <span className="text-xs font-semibold text-outline">Patient Name</span>
                  <span className="text-sm font-bold text-on-surface">{ACTIVE_CASE.patientName}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                  <span className="text-xs font-semibold text-outline">Age & Gender</span>
                  <span className="text-sm font-bold text-on-surface">{ACTIVE_CASE.age} Yrs • {ACTIVE_CASE.gender}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                  <span className="text-xs font-semibold text-outline">Doctor's Name</span>
                  <span className="text-sm font-bold text-on-surface">{ACTIVE_CASE.doctorName}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                  <span className="text-xs font-semibold text-outline">Assigned Nurse (Student)</span>
                  <span className="text-sm font-bold text-primary">{selectedStudent.name} ({selectedStudent.studentId})</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-container">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-2 hover:bg-primary-hover transition-all shadow-sm"
              >
                <span>Proceed to Patient Complaint</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PATIENT COMPLAINT & VOICE STT */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Main Patient Complaint</span>
            </div>
            <p className="text-sm font-semibold text-red-950 bg-red-50 border border-red-200 rounded-xl p-4 leading-relaxed">
              "{ACTIVE_CASE.chiefComplaint}"
            </p>
          </div>

          {/* Voice Speech-to-Text Transcript Component */}
          <VoiceTranscript caseTitle={ACTIVE_CASE.title} patientName={`${ACTIVE_CASE.patientName} (${ACTIVE_CASE.age}${ACTIVE_CASE.gender[0]})`} />

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl border border-surface-container text-on-surface text-xs font-semibold flex items-center gap-2 hover:bg-surface-container"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-2 hover:bg-primary-hover transition-all shadow-sm"
            >
              <span>Proceed to Predefined Sequence Verification</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PREDEFINED SEQUENCE VERIFICATION */}
      {currentStep === 3 && (
        <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div>
              <h3 className="text-base font-bold text-on-surface font-headline">
                Predefined Assessment Order Checklist
              </h3>
              <p className="text-xs text-outline font-medium mt-0.5">
                Verify whether Nurse (Student) {selectedStudent.name} followed the required clinical evaluation sequence.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              {Object.values(checklist).filter(Boolean).length} / {Object.keys(checklist).length} Completed
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { key: 'seq_1', label: '1. Hand Sanitization & Patient Identity Verification' },
              { key: 'seq_2', label: '2. Introduce Self & Obtain Informed Consent' },
              { key: 'seq_3', label: '3. Inquiry on Chief Complaint & Pain Duration' },
              { key: 'seq_4', label: '4. SOCRATES Pain Scale & Radiation Check (Left Arm/Jaw)' },
              { key: 'seq_5', label: '5. Past Medical & Medication History Inquiry' },
              { key: 'seq_6', label: '6. General Appearance Inspection & Diaphoresis Check' },
              { key: 'seq_7', label: '7. Clinical Vitals Inspection & Baseline Verification' },
            ].map((item) => (
              <label
                key={item.key}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  checklist[item.key]
                    ? 'bg-teal-50/70 border-teal-200 text-teal-950 font-semibold'
                    : 'bg-surface-container-low border-surface-container text-on-surface font-medium'
                }`}
              >
                <span className="text-xs">{item.label}</span>
                <input
                  type="checkbox"
                  checked={!!checklist[item.key]}
                  onChange={() => toggleChecklist(item.key)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-surface-container">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl border border-surface-container text-on-surface text-xs font-semibold flex items-center gap-2 hover:bg-surface-container"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-2 hover:bg-primary-hover transition-all shadow-sm"
            >
              <span>Proceed to Vital Signs Recording</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: VITAL SIGNS RECORDING & GRADE SCORECARD */}
      {currentStep === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
          {/* Vitals Recording Inputs */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">
                  Vital Signs Recording & Real-time Comparison
                </h3>
                <p className="text-xs text-outline font-medium mt-0.5">
                  Record Nurse (Student) values and compare against target reference ranges.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* BP */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">1. Blood Pressure (mmHg)</span>
                  <span className="text-[11px] font-semibold text-outline">Normal: 120/80 (Target: 145/95)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={sysBpInput}
                    onChange={(e) => setSysBpInput(e.target.value)}
                    placeholder="Systolic (e.g. 145)"
                    className="px-3 py-2 rounded-lg border border-surface-container-highest text-xs font-bold text-on-surface"
                  />
                  <input
                    type="number"
                    value={diaBpInput}
                    onChange={(e) => setDiaBpInput(e.target.value)}
                    placeholder="Diastolic (e.g. 95)"
                    className="px-3 py-2 rounded-lg border border-surface-container-highest text-xs font-bold text-on-surface"
                  />
                </div>
              </div>

              {/* Pulse */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">2. Pulse Rate (bpm)</span>
                  <span className="text-[11px] font-semibold text-outline">Normal: 60-100 (Target: 104)</span>
                </div>
                <input
                  type="number"
                  value={pulseInput}
                  onChange={(e) => setPulseInput(e.target.value)}
                  placeholder="Pulse bpm"
                  className="px-3 py-2 rounded-lg border border-surface-container-highest text-xs font-bold text-on-surface"
                />
              </div>

              {/* SpO2 */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">3. Oxygen Saturation (SpO₂ %)</span>
                  <span className="text-[11px] font-semibold text-outline">Normal: 95-100% (Target: 93%)</span>
                </div>
                <input
                  type="number"
                  value={spo2Input}
                  onChange={(e) => setSpo2Input(e.target.value)}
                  placeholder="SpO2 %"
                  className="px-3 py-2 rounded-lg border border-surface-container-highest text-xs font-bold text-on-surface"
                />
              </div>

              {/* Temperature */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">4. Body Temperature (°C)</span>
                  <span className="text-[11px] font-semibold text-outline">Normal: 36.5-37.5°C (Target: 37.1)</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  placeholder="Temp °C"
                  className="px-3 py-2 rounded-lg border border-surface-container-highest text-xs font-bold text-on-surface"
                />
              </div>
            </div>

            <button
              onClick={() => setIsEvaluated(true)}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-hover transition-all shadow-sm"
            >
              Generate Automated Scorecard & Evaluation Report
            </button>
          </div>

          {/* Grade Scorecard Output */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-on-surface font-headline">
                  Evaluation Scorecard
                </h3>
              </div>
              {isEvaluated && (
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg border border-surface-container hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-outline" />
                  <span>Print</span>
                </button>
              )}
            </div>

            {isEvaluated ? (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-xs text-teal-200 font-medium">Final Score</span>
                    <h2 className="text-3xl font-extrabold font-headline">
                      {scoreResult.totalMarks} / 100
                    </h2>
                    <p className="text-xs text-teal-100 font-medium mt-0.5">
                      Nurse (Student): {selectedStudent.name} ({selectedStudent.studentId})
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
                    <span className="text-[10px] uppercase font-bold text-teal-200">Grade</span>
                    <span className="text-2xl font-black">{scoreResult.grade}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs">
                    <span className="font-semibold text-outline">Sequence Order Checklist:</span>
                    <span className="font-bold text-on-surface">{scoreResult.sequenceScore} / 50 Marks ({scoreResult.completedChecklistItems}/{scoreResult.totalChecklistItems} Steps)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs">
                    <span className="font-semibold text-outline">Vitals Measurement Accuracy:</span>
                    <span className="font-bold text-on-surface">{scoreResult.vitalsScore} / 50 Marks</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-xs flex flex-col gap-1">
                  <span className="font-bold">Doctor (Faculty) Evaluator Remarks:</span>
                  <p className="font-medium text-[11px] leading-relaxed">
                    Nurse demonstrated good clinical history taking and vital signs accuracy. Re-emphasize pain radiation assessment sequence.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-outline gap-2">
                <Activity className="w-8 h-8 text-outline/40 animate-pulse" />
                <p className="text-xs font-medium">
                  Enter student recorded vitals on the left and click "Generate Automated Scorecard".
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-surface-container">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-xl border border-surface-container text-on-surface text-xs font-semibold flex items-center gap-2 hover:bg-surface-container"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

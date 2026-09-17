import React, { useState } from 'react';
import { BookOpen, Activity, User, Heart, Wind, CheckCircle2, ChevronRight } from 'lucide-react';

interface ClinicalCaseDemo {
  id: string;
  title: string;
  category: 'Cardiology' | 'Respiratory';
  patientName: string;
  age: number;
  gender: string;
  doctorName: string;
  chiefComplaint: string;
  history: string[];
  normalVitals: {
    bp: string;
    pulse: string;
    spo2: string;
    temp: string;
  };
  assessmentSequence: string[];
}

const DEMO_CASES: ClinicalCaseDemo[] = [
  {
    id: 'CASE-CARD-001',
    title: 'Acute Anterior STEMI (Cardiology)',
    category: 'Cardiology',
    patientName: 'Ramesh Gowda',
    age: 58,
    gender: 'Male',
    doctorName: 'Dr. Ramesh Kumar (Cardiologist)',
    chiefComplaint: 'Severe substernal crushing chest pain radiating to left shoulder and jaw for 2 hours, accompanied by diaphoresis.',
    history: [
      'Hypertension for 5 years on regular medication.',
      'Smoker for 15 years (1 pack/day).',
      'No previous surgical history.',
      'No known drug allergies.',
    ],
    normalVitals: {
      bp: '120/80 mmHg (Target Case Baseline: 145/95 mmHg during acute pain)',
      pulse: '60-100 bpm (Target Case Baseline: 104 bpm - Tachycardia)',
      spo2: '95-100% (Target Case Baseline: 93% on room air)',
      temp: '36.5-37.5 °C (Target Case Baseline: 37.1 °C)',
    },
    assessmentSequence: [
      '1. Hand Sanitization & Patient Identification',
      '2. Introduce Self & Obtain Informed Consent',
      '3. Assess Chief Complaint & Pain Intensity (SOCRATES scale)',
      '4. Check Pain Radiation (Left Arm, Neck, Jaw)',
      '5. Inspect General Appearance & Diaphoresis',
      '6. Record Complete Vital Signs (BP, Pulse, SpO₂, Temp)',
      '7. Perform 12-Lead ECG & Notify Senior Consultant',
    ],
  },
  {
    id: 'CASE-RESP-002',
    title: 'Acute Severe Asthma Exacerbation (Respiratory)',
    category: 'Respiratory',
    patientName: 'Priya Sharma',
    age: 24,
    gender: 'Female',
    doctorName: 'Dr. Marcus Chen (Pulmonologist)',
    chiefComplaint: 'Sudden onset shortness of breath, bilateral expiratory wheezing, and chest tightness following viral URI.',
    history: [
      'Known bronchial asthma since childhood.',
      'Uses Salbutamol inhaler PRN.',
      'Trigger: Cold weather & dust allergy.',
      'No history of ICU admission or intubation.',
    ],
    normalVitals: {
      bp: '120/80 mmHg (Target Case Baseline: 128/84 mmHg)',
      pulse: '60-100 bpm (Target Case Baseline: 118 bpm - Tachycardia)',
      spo2: '95-100% (Target Case Baseline: 91% on room air)',
      temp: '36.5-37.5 °C (Target Case Baseline: 36.8 °C)',
    },
    assessmentSequence: [
      '1. Assess Airway & Respiratory Effort (Tripod positioning check)',
      '2. Measure Oxygen Saturation (SpO₂)',
      '3. Auscultate Lung Fields (Bilateral expiratory wheeze)',
      '4. Measure Respiratory Rate & Pulse Rate',
      '5. Administer High-Flow Oxygen & Nebulized Bronchodilator',
      '6. Re-evaluate Vitals Post-Nebulization',
    ],
  },
];

/**
 * Teaching Mode Component
 * Provides interactive demonstration of clinical cases, history taking, and vitals baseline for Faculty.
 */
export const FacultyTeachingMode: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(DEMO_CASES[0].id);
  const currentCase = DEMO_CASES.find((c) => c.id === selectedCaseId) || DEMO_CASES[0];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">Clinical Teaching Mode for Doctors (Faculty)</h2>
            <p className="text-xs text-teal-100 font-medium mt-0.5">
              Interactive demonstration of clinical cases, history taking sequence, and vitals baseline for Nurses (Students).
            </p>
          </div>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl backdrop-blur-md">
          {DEMO_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCaseId === c.id
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-teal-100 hover:bg-white/10'
              }`}
            >
              {c.category === 'Cardiology' ? '❤️ Cardiology' : '🫁 Respiratory'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Overview & Complaint */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Patient Profile Card */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                Patient Demographics
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                {currentCase.id}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-bold text-base">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">
                  {currentCase.patientName}
                </h3>
                <p className="text-xs text-outline font-medium">
                  {currentCase.age} Yrs • {currentCase.gender}
                </p>
              </div>
            </div>

            <div className="text-xs text-on-surface-variant flex flex-col gap-1 border-t border-surface-container/60 pt-3">
              <span className="font-semibold text-outline text-[11px]">Attending Consultant:</span>
              <span className="font-bold text-on-surface">{currentCase.doctorName}</span>
            </div>
          </div>

          {/* Chief Complaint Card */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
              {currentCase.category === 'Cardiology' ? (
                <Heart className="w-4 h-4 text-red-500" />
              ) : (
                <Wind className="w-4 h-4 text-blue-500" />
              )}
              <span>Chief Complaint</span>
            </div>
            <p className="text-xs text-on-surface leading-relaxed font-medium bg-red-50/60 border border-red-100 rounded-xl p-3.5 text-red-950">
              "{currentCase.chiefComplaint}"
            </p>

            <div className="flex flex-col gap-1.5 pt-2">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                Relevant Medical History:
              </span>
              <ul className="flex flex-col gap-1 text-xs text-on-surface-variant font-medium">
                {currentCase.history.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Predefined Sequence & Vitals Baseline */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Predefined Sequence Order */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-on-surface font-headline">
                  Predefined Clinical Assessment Sequence
                </h3>
              </div>
              <span className="text-xs text-outline font-medium">Mandatory Protocol</span>
            </div>

            <div className="flex flex-col gap-2">
              {currentCase.assessmentSequence.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/80 border border-surface-container text-xs font-medium text-on-surface"
                >
                  <ChevronRight className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals Baseline Table */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2 border-b border-surface-container pb-3">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Vital Signs Reference & Target Case Baseline
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                <span className="text-xs font-semibold text-outline">Blood Pressure (BP)</span>
                <span className="text-xs font-bold text-on-surface">
                  {currentCase.normalVitals.bp}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                <span className="text-xs font-semibold text-outline">Pulse Rate</span>
                <span className="text-xs font-bold text-on-surface">
                  {currentCase.normalVitals.pulse}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                <span className="text-xs font-semibold text-outline">Oxygen Saturation (SpO₂)</span>
                <span className="text-xs font-bold text-on-surface">
                  {currentCase.normalVitals.spo2}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                <span className="text-xs font-semibold text-outline">Body Temperature</span>
                <span className="text-xs font-bold text-on-surface">
                  {currentCase.normalVitals.temp}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

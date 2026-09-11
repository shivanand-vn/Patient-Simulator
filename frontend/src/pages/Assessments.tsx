import React, { useState } from 'react';
import { 
  BarChart2, 
  Download, 
  SlidersHorizontal, 
  TrendingUp, 
  CheckCircle2, 
  X,
  FileText,
  Award
} from 'lucide-react';

interface CompetencyItem {
  domain: string;
  score: number;
  threshold: number;
}

const competencies: { left: CompetencyItem[]; right: CompetencyItem[] } = {
  left: [
    { domain: 'History Taking', score: 88, threshold: 75 },
    { domain: 'Clinical Reasoning', score: 82, threshold: 75 },
    { domain: 'Diagnosis', score: 84, threshold: 75 },
    { domain: 'Communication', score: 91, threshold: 75 },
  ],
  right: [
    { domain: 'Clinical Examination', score: 76, threshold: 75 },
    { domain: 'Investigations', score: 79, threshold: 75 },
    { domain: 'Treatment Planning', score: 73, threshold: 75 }, // below threshold -> red
    { domain: 'Patient Safety', score: 80, threshold: 75 },
  ]
};

export const Assessments: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Current Semester (Fall 2026)');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportTranscript = () => {
    showToast('Simulation performance transcript exported successfully (PDF).');
  };

  const handleDownloadPDF = () => {
    showToast('Downloading assessment report: SIM-8842-AX.pdf');
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface font-headline">My Results</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Review your clinical simulation performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPeriodModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-surface-container-lowest border border-surface-container hover:bg-surface-container text-on-surface-variant transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-outline" />
            <span>Filter Period</span>
          </button>

          <button
            onClick={handleExportTranscript}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Transcript</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Performance Highlights (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Overall Metric */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-6 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Metric Header with Circular Icon Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                OVERALL METRIC
              </span>
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant border border-surface-container/60">
                <BarChart2 className="w-5 h-5 text-on-surface-variant" />
              </div>
            </div>

            {/* Score & Upward Trend */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold text-on-surface font-headline tracking-tight">
                82%
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/50">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.2%</span>
              </span>
            </div>

            {/* Subtext */}
            <p className="text-xs text-on-surface-variant/80 mt-3 leading-relaxed">
              Overall Average Score across 24 completed simulation cases this semester.
            </p>
          </div>

          {/* Bottom Split Stats */}
          <div className="border-t border-surface-container/80 pt-4 mt-6 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-outline font-medium">Passed Cases</div>
              <div className="text-base font-bold text-on-surface font-headline mt-0.5">22 / 24</div>
            </div>
            <div>
              <div className="text-[11px] text-outline font-medium">Percentile Rank</div>
              <div className="text-base font-bold text-primary font-headline mt-0.5">Top 8%</div>
            </div>
          </div>
        </div>

        {/* Card 2: Recent Assessment Highlights */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-6 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Header & Date Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">
                  Recent Assessment Highlights
                </h3>
                <p className="text-xs text-outline mt-0.5">
                  Latest completed simulation case telemetry
                </p>
              </div>

              <span className="self-start sm:self-auto px-3 py-1 bg-primary text-on-primary text-xs font-semibold rounded-full shadow-sm">
                Completed Sep 9, 2026
              </span>
            </div>

            {/* 3 Metric Telemetry Sub-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              {/* Scenario */}
              <div className="bg-surface-container-low/70 rounded-xl p-3.5 border border-surface-container/60 flex flex-col justify-between">
                <span className="text-[11px] text-outline font-medium">Case Scenario</span>
                <div className="mt-1">
                  <div className="text-sm font-bold text-on-surface font-headline truncate">
                    Acute Chest Pain
                  </div>
                  <div className="text-[11px] text-outline font-mono mt-0.5">
                    ID: SIM-8842-AX
                  </div>
                </div>
              </div>

              {/* Final Score */}
              <div className="bg-surface-container-low/70 rounded-xl p-3.5 border border-surface-container/60 flex flex-col justify-between">
                <span className="text-[11px] text-outline font-medium">Final Score</span>
                <div className="mt-1">
                  <div className="text-sm font-bold text-primary font-headline">
                    84%
                  </div>
                  <div className="text-[11px] text-outline font-medium mt-0.5">
                    Grade: Distinction
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-surface-container-low/70 rounded-xl p-3.5 border border-surface-container/60 flex flex-col justify-between">
                <span className="text-[11px] text-outline font-medium">Duration</span>
                <div className="mt-1">
                  <div className="text-sm font-bold text-on-surface font-headline">
                    18m 42s
                  </div>
                  <div className="text-[11px] text-outline font-medium mt-0.5">
                    Optimal: 15m
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={() => setShowDetailsModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-colors"
            >
              View Detailed Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Card: Minimal Competency Breakdown */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-6 sm:p-7">
        {/* Header & Target Threshold Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-surface-container/80">
          <div>
            <h3 className="text-base font-bold text-on-surface font-headline">
              Minimal Competency Breakdown
            </h3>
            <p className="text-xs text-outline mt-0.5">
              Core clinical domains tracked across all AI patient interactions
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-outline font-medium self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
            <span>Target Threshold (&gt;75%)</span>
          </div>
        </div>

        {/* 2-Column Progress Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-6">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            {competencies.left.map((item) => {
              const isBelow = item.score < item.threshold;
              return (
                <div key={item.domain} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-on-surface">{item.domain}</span>
                    <span className={isBelow ? 'text-red-600 font-bold' : 'text-on-surface font-bold'}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBelow ? 'bg-red-600' : 'bg-primary'
                      }`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5">
            {competencies.right.map((item) => {
              const isBelow = item.score < item.threshold;
              return (
                <div key={item.domain} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-on-surface">{item.domain}</span>
                    <span className={isBelow ? 'text-red-600 font-bold' : 'text-on-surface font-bold'}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBelow ? 'bg-red-600' : 'bg-primary'
                      }`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Period Modal */}
      {showPeriodModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowPeriodModal(false)}
        >
          <div 
            className="bg-surface-container-lowest border border-surface-container/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface font-headline">
                    Select Evaluation Period
                  </h3>
                  <p className="text-xs text-outline">
                    Filter aggregate competency metrics
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPeriodModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {[
                'Current Semester (Fall 2026)',
                'Last 30 Days',
                'Last 90 Days',
                'Academic Year 2025-2026',
                'All-Time Cumulative'
              ].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowPeriodModal(false);
                    showToast(`Evaluation period updated: ${period}`);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedPeriod === period
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Assessment Modal */}
      {showDetailsModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowDetailsModal(false)}
        >
          <div 
            className="bg-surface-container-lowest border border-surface-container/80 rounded-2xl p-6 sm:p-7 max-w-xl w-full shadow-2xl flex flex-col gap-4 text-left max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-surface-container pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface font-headline">
                    Detailed Clinical Assessment
                  </h3>
                  <p className="text-xs text-outline">
                    Acute Chest Pain • SIM-8842-AX • Completed Sep 9, 2026
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/60 text-teal-900">
                <span className="font-bold">Faculty Evaluator Summary:</span> Strong elicitation of OPQRST pain characteristics and early ordering of 12-lead ECG and serial cardiac troponin. Consider accelerating secondary aspirin administration timeline.
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
                  <span className="font-medium text-on-surface-variant">Differential Diagnosis Precision</span>
                  <span className="font-bold text-primary">92%</span>
                </div>
                <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
                  <span className="font-medium text-on-surface-variant">Diagnostic Ordering Appropriateness</span>
                  <span className="font-bold text-primary">88%</span>
                </div>
                <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
                  <span className="font-medium text-on-surface-variant">Patient Reassurance & Communication</span>
                  <span className="font-bold text-primary">85%</span>
                </div>
                <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
                  <span className="font-medium text-on-surface-variant">Treatment Protocol Timing</span>
                  <span className="font-bold text-amber-600">74%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;


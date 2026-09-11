import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Play, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

interface CaseModule {
  id: string;
  title: string;
  specialty: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  tags: string[];
  status: 'Ready to start' | 'In Progress' | 'Completed' | 'Not Started';
  progress?: number;
  score?: number;
}

const initialCases: CaseModule[] = [
  {
    id: 'SIM-8842-AX',
    title: 'Acute Chest Pain',
    specialty: 'Cardiology',
    difficulty: 'Intermediate',
    duration: '15-20 min',
    description: '58-year-old male presenting to the emergency department with sudden-onset retrosternal chest pain radiating to left arm.',
    tags: ['History Taking', 'ECG', 'Clinical Reasoning'],
    status: 'Ready to start'
  },
  {
    id: 'SIM-8843-BR',
    title: 'Acute Breathlessness',
    specialty: 'Respiratory',
    difficulty: 'Intermediate',
    duration: '20-25 min',
    description: '42-year-old female with progressive dyspnea, wheezing, and a history of poorly controlled seasonal asthma.',
    tags: ['Auscultation', 'SpO2 Monitoring', 'Pharmacotherapy'],
    status: 'In Progress',
    progress: 45
  },
  {
    id: 'SIM-8844-GM',
    title: 'Abdominal Pain',
    specialty: 'General Medicine',
    difficulty: 'Beginner',
    duration: '10-15 min',
    description: '29-year-old male presenting with periumbilical pain migrating to the right lower quadrant, accompanied by low-grade fever.',
    tags: ['Physical Exam', 'Palpation', 'Differential Dx'],
    status: 'Completed',
    score: 92
  },
  {
    id: 'SIM-8845-EM',
    title: 'Altered Mental Status',
    specialty: 'Emergency Medicine',
    difficulty: 'Advanced',
    duration: '25-30 min',
    description: '71-year-old female brought in by family exhibiting sudden confusion, disorientation, and fluctuating level of alertness.',
    tags: ['Neurological Exam', 'Triage', 'Rapid Assessment'],
    status: 'Not Started'
  }
];

import { NavTab } from '../types/navigation';

interface PracticeCasesProps {
  onNavigate?: (tab: NavTab) => void;
}

export const PracticeCases: React.FC<PracticeCasesProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredCases = useMemo(() => {
    return initialCases.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesSpecialty = selectedSpecialty === 'All' || item.specialty === selectedSpecialty;
      const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
      const matchesDuration = selectedDuration === 'All' || item.duration.includes(selectedDuration);
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesSpecialty && matchesDifficulty && matchesDuration && matchesStatus;
    });
  }, [searchQuery, selectedSpecialty, selectedDifficulty, selectedDuration, selectedStatus]);

  const handleAction = (caseItem: CaseModule) => {
    if (caseItem.status === 'In Progress') {
      showToast(`Resuming simulation: ${caseItem.title} (${caseItem.id})`);
    } else if (caseItem.status === 'Completed') {
      showToast(`Restarting simulation: ${caseItem.title} (${caseItem.id})`);
    } else {
      showToast(`Starting new simulation: ${caseItem.title} (${caseItem.id})`);
    }
    setTimeout(() => {
      onNavigate?.('simulation');
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wider text-outline uppercase mb-1">
            CLINICAL CATALOG <span className="text-outline/40">•</span> <span className="text-primary font-bold">{initialCases.length} Active Modules</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface font-headline">Practice Cases</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Faculty-curated clinical simulation cases for student training and diagnostic evaluation.
          </p>
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by symptom, diagnosis..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-surface-container rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Specialty Filter */}
          <div className="relative">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              aria-label="Filter by Specialty"
              className="appearance-none bg-surface-container-lowest border border-surface-container hover:border-outline-variant text-on-surface px-3 py-2 pr-7 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <option value="All">Specialty</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Respiratory">Respiratory</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by Difficulty"
              className="appearance-none bg-surface-container-lowest border border-surface-container hover:border-outline-variant text-on-surface px-3 py-2 pr-7 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <option value="All">Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Duration Filter */}
          <div className="relative">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              aria-label="Filter by Duration"
              className="appearance-none bg-surface-container-lowest border border-surface-container hover:border-outline-variant text-on-surface px-3 py-2 pr-7 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <option value="All">Duration</option>
              <option value="10-15">10-15 min</option>
              <option value="15-20">15-20 min</option>
              <option value="20-25">20-25 min</option>
              <option value="25-30">25-30 min</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Status"
              className="appearance-none bg-surface-container-lowest border border-surface-container hover:border-outline-variant text-on-surface px-3 py-2 pr-7 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <option value="All">Status</option>
              <option value="Ready to start">Ready to start</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Not Started</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2x2 Grid of Clinical Cases */}
      {filteredCases.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest border border-surface-container rounded-2xl">
          <p className="text-sm font-semibold text-on-surface">No simulation cases match your search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('All');
              setSelectedDifficulty('All');
              setSelectedDuration('All');
              setSelectedStatus('All');
            }}
            className="mt-3 text-xs text-primary font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between hover:shadow-md hover:border-outline-variant/60 transition-all group"
            >
              <div>
                {/* Top Badges & Duration */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Specialty Pill */}
                    {caseItem.specialty === 'Emergency Medicine' ? (
                      <span className="bg-red-50 text-red-700 border border-red-200/60 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {caseItem.specialty}
                      </span>
                    ) : caseItem.specialty === 'General Medicine' ? (
                      <span className="bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-lg text-xs font-medium">
                        {caseItem.specialty}
                      </span>
                    ) : (
                      <span className="bg-[#004c4c] text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {caseItem.specialty}
                      </span>
                    )}

                    {/* Difficulty Pill */}
                    <span className="bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-lg text-xs font-medium">
                      {caseItem.difficulty}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5 text-xs text-outline font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{caseItem.duration}</span>
                  </div>
                </div>

                {/* Case Title */}
                <h3 className="text-base font-bold text-on-surface font-headline mt-3.5 mb-1.5 group-hover:text-primary transition-colors">
                  {caseItem.title}
                </h3>

                {/* Case Narrative Summary */}
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-4">
                  {caseItem.description}
                </p>

                {/* Clinical Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {caseItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant text-[11px] font-medium border border-surface-container/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Status & Action Button */}
              <div className="border-t border-surface-container/80 pt-4 mt-5 flex items-center justify-between gap-3">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs font-medium">
                  {caseItem.status === 'Ready to start' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      <span className="text-on-surface-variant">Ready to start</span>
                    </>
                  )}
                  {caseItem.status === 'In Progress' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                      <span className="text-on-surface-variant">In Progress ({caseItem.progress}%)</span>
                    </>
                  )}
                  {caseItem.status === 'Completed' && (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3]" />
                      <span className="text-on-surface-variant">Completed (Score: {caseItem.score}%)</span>
                    </>
                  )}
                  {caseItem.status === 'Not Started' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      <span className="text-on-surface-variant">Not Started</span>
                    </>
                  )}
                </div>

                {/* Action CTA Button */}
                {caseItem.status === 'In Progress' ? (
                  <button
                    onClick={() => handleAction(caseItem)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-colors"
                  >
                    <span>Continue</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                ) : caseItem.status === 'Completed' ? (
                  <button
                    onClick={() => handleAction(caseItem)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/60 transition-colors"
                  >
                    <span>Practice Again</span>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(caseItem)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-colors"
                  >
                    <span>Start Simulation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-outline pt-2">
        <span>Showing {filteredCases.length} of {initialCases.length} clinical simulation modules</span>
        
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            disabled
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-outline/60 cursor-not-allowed font-medium"
          >
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold shadow-sm">
            1
          </button>
          <button
            disabled
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-outline/60 cursor-not-allowed font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeCases;


import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LogOut,
  GraduationCap,
  HelpCircle,
  BookOpen,
  ClipboardList,
  Lock,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PasswordModal } from '../components/faculty/PasswordModal';
import { FacultyDashboardOverview } from '../components/faculty/FacultyDashboardOverview';
import { FacultyTeachingMode } from '../components/faculty/FacultyTeachingMode';
import { FacultyAssessmentWorkflow } from '../components/faculty/FacultyAssessmentWorkflow';

interface AssignedExamSchedule {
  id: string;
  batchName: string;
  caseId: string;
  caseTitle: string;
  category: string;
  examDate: string;
  examTime: string;
  assignedFaculty: string;
  studentCount: number;
}

const MOCK_ASSIGNED_EXAMS: AssignedExamSchedule[] = [
  {
    id: 'EXAM-2026-001',
    batchName: '2026 Nursing Cohort A',
    caseId: 'CASE-CARD-001',
    caseTitle: 'Acute Anterior STEMI',
    category: 'Cardiology',
    examDate: '2026-09-20',
    examTime: '10:00 AM - 01:00 PM',
    assignedFaculty: 'faculty.cardio@bmcri.edu.in',
    studentCount: 59,
  },
  {
    id: 'EXAM-2026-004',
    batchName: '2026 Nursing Cohort B',
    caseId: 'CASE-RESP-002',
    caseTitle: 'Acute Severe Asthma Exacerbation',
    category: 'Respiratory',
    examDate: '2026-09-22',
    examTime: '02:00 PM - 05:00 PM',
    assignedFaculty: 'faculty.cardio@bmcri.edu.in',
    studentCount: 59,
  },
];

/**
 * Doctor Portal Page
 * Complete Doctor / Clinical Evaluator Module implementation featuring Doctor Dashboard Overview,
 * Security Password Modal, Assigned Exam Schedule, Teaching Mode, and 4-Step Nurse Assessment Workflow.
 */
export const FacultyPortal: React.FC = () => {
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assigned-exams' | 'teaching-mode' | 'assessment-mode' | 'help-support'>('dashboard');
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Filter exams assigned to logged-in doctor
  const facultyExams = MOCK_ASSIGNED_EXAMS.filter(
    (e) => !user?.email || e.assignedFaculty === user.email || user.email.includes('faculty') || user.email.includes('doctor')
  );

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface">
      {/* Password Change Security Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        isFirstLogin={false}
      />

      {/* Fixed Left Navigation Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-6 px-4 select-none border-r border-surface-container">
        <div className="flex flex-col gap-8">
          {/* Brand Header */}
          <div className="px-2">
            <h1 className="font-semibold text-base text-primary tracking-tight font-headline">
              AI Patient Simulation Engine
            </h1>
            <span className="text-xs text-outline font-medium">Doctor (Faculty) Portal</span>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-1">
            <span className="px-2 text-[11px] font-semibold text-outline uppercase tracking-wider mb-1">
              Doctor (Faculty) Modules
            </span>
            <nav className="flex flex-col gap-1">
              {/* Dashboard Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left w-full ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>

              {/* Assigned Exams Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('assigned-exams')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left w-full ${
                  activeTab === 'assigned-exams'
                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Assigned Exam Schedule</span>
              </button>

              {/* Teaching Mode Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('teaching-mode')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left w-full ${
                  activeTab === 'teaching-mode'
                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Teaching Mode</span>
              </button>

              {/* Assessment Mode Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('assessment-mode')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left w-full ${
                  activeTab === 'assessment-mode'
                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Nurse (Student) Assessment Mode</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col gap-2 pt-4 border-t border-surface-container">
          {/* Change Password Security Trigger */}
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <Lock className="w-4 h-4 shrink-0 text-primary" />
            <span>Change Password</span>
          </button>

          {/* Help & Support */}
          <button
            type="button"
            onClick={() => setActiveTab('help-support')}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === 'help-support'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Help & Support</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-left group"
          >
            <LogOut className="w-4 h-4 shrink-0 text-red-500 group-hover:text-red-700 transition-colors" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Top Fixed Header Bar */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-surface-container/60 shadow-xs z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-xs text-outline">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="font-medium">Doctor (Faculty) Portal</span>
            <span className="text-outline/40">/</span>
            <span className="text-on-surface font-semibold capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-surface-container/80 text-on-surface">
              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200">
                {user.name ? user.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2) : 'RK'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-on-surface leading-tight">
                  {user.name || 'Dr. Ramesh Kumar'}
                </span>
                <span className="text-[10px] text-outline font-medium leading-tight">
                  Doctor (Faculty) - Cardiology
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 pt-20 p-8 flex flex-col items-center">
          {activeTab === 'dashboard' && (
            <FacultyDashboardOverview
              facultyName={user.name || 'Dr. Ramesh Kumar'}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'assigned-exams' && (
            <div className="w-full max-w-6xl flex flex-col gap-6 text-left animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-headline text-on-surface">
                    Assigned Examination Schedule
                  </h2>
                  <p className="text-xs text-outline font-medium mt-0.5">
                    Examinations scheduled by the System Administrator for your evaluation.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                  {facultyExams.length} Examinations Scheduled
                </span>
              </div>

              {facultyExams.length === 0 ? (
                <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                  <Calendar className="w-10 h-10 text-outline/40" />
                  <h3 className="text-base font-bold text-on-surface font-headline">
                    No Examinations Assigned
                  </h3>
                  <p className="text-xs text-outline font-medium max-w-md">
                    No clinical examination schedules are assigned to your doctor account at this time.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {facultyExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 hover:border-primary/40 transition-all"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-surface-container pb-3">
                          <span className="text-xs font-bold text-primary font-mono">
                            {exam.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                            {exam.category}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-on-surface font-headline">
                            {exam.caseTitle}
                          </h3>
                          <p className="text-xs text-outline font-medium mt-0.5">
                            Cohort: <strong className="text-on-surface">{exam.batchName}</strong> ({exam.studentCount} Nurses (Students))
                          </p>
                        </div>

                        <div className="flex flex-col gap-1.5 pt-2 text-xs text-on-surface-variant font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>Exam Date: <strong className="text-on-surface">{exam.examDate}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>Time Slot: <strong className="text-on-surface">{exam.examTime}</strong></span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('assessment-mode')}
                        className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Start Nurse (Student) Assessment</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'teaching-mode' && <FacultyTeachingMode />}

          {activeTab === 'assessment-mode' && <FacultyAssessmentWorkflow />}

          {activeTab === 'help-support' && (
            <div className="w-full max-w-4xl bg-surface-container-lowest border border-surface-container rounded-2xl p-8 text-left flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-surface-container pb-4">
                <h2 className="text-xl font-bold font-headline text-on-surface">
                  Doctor (Faculty) Help & Support Guidelines
                </h2>
                <p className="text-xs text-outline font-medium mt-0.5">
                  Reference protocols for clinical case demonstrations and Nurse (Student) assessment workflows.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-xs leading-relaxed text-on-surface-variant">
                <h3 className="text-sm font-bold text-on-surface">1. Password Security & Default Login</h3>
                <p>
                  Doctor (Faculty) accounts are created by the System Administrator with default passwords. Upon first login, update your password via the "Change Password" modal located at the bottom left menu.
                </p>

                <h3 className="text-sm font-bold text-on-surface mt-2">2. Conducting Nurse (Student) Assessment</h3>
                <p>
                  Select the assigned Nurse (Student) (Regular or Backlog) from your assigned cohort. Follow the 4-step workflow: Patient Info Verification, Patient Complaint with Live Voice STT, Predefined Sequence Verification, and Vital Signs Recording.
                </p>

                <h3 className="text-sm font-bold text-on-surface mt-2">3. Automated Scorecard Evaluation</h3>
                <p>
                  The system evaluates Nurse (Student) answers against predefined target reference ranges (BP: 120/80, Pulse: 60-100 bpm, SpO₂: 95-100%, Temp: 36.5-37.5°C) and generates a printable evaluation report.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="bg-surface-container-lowest border border-surface-container/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-on-surface font-headline">
                  Confirm Logout
                </h3>
                <p className="text-xs text-outline mt-0.5">
                  End Doctor (Faculty) session
                </p>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              Are you sure you want to log out from the Doctor (Faculty) portal?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-surface-container/60">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPortal;

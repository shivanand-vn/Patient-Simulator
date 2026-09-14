import React, { createContext, useContext, useState } from 'react';

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  email: string;
  phone: string;
  assignedCase: string;
  status: 'Active' | 'On Leave';
  statusNote?: string;
  lastAudit: string;
}

export interface Cohort {
  id: string;
  name: string;
  yearTrack: string;
  clinicalTrack: string;
  enrolled: number;
  backlogCount?: number;
  casesBound: number;
  progressPercent?: number;
  status: 'Active' | 'Archived';
  certifiedCount?: number;
}

export interface ClinicalCase {
  id: string;
  code: string;
  specialty: string;
  acuity: string;
  title: string;
  description: string;
  rubric: string;
  metaInfo: string;
  status: 'Active' | 'Draft / In Review';
}

export interface ScheduledExam {
  id: string;
  date: string;
  time: string;
  caseTitle: string;
  batchName: string;
  studentCount: number;
  rigLocation: string;
  evaluatorName: string;
  status: 'Scheduled' | 'Room Ready';
}

interface AdminDataContextType {
  faculty: FacultyMember[];
  batches: Cohort[];
  cases: ClinicalCase[];
  exams: ScheduledExam[];
  addFaculty: (member: Omit<FacultyMember, 'id'>) => FacultyMember;
  addBatch: (cohort: Omit<Cohort, 'id'>) => Cohort;
  addCase: (clinicalCase: Omit<ClinicalCase, 'id'>) => ClinicalCase;
  scheduleExam: (exam: Omit<ScheduledExam, 'id'>) => ScheduledExam;
  cancelExam: (id: string) => void;
  clearAllData: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // All initial states are empty arrays - zero static mock data
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [batches, setBatches] = useState<Cohort[]>([]);
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [exams, setExams] = useState<ScheduledExam[]>([]);

  const addFaculty = (memberData: Omit<FacultyMember, 'id'>): FacultyMember => {
    const newMember: FacultyMember = {
      ...memberData,
      id: `fac-${Date.now()}`
    };
    setFaculty(prev => [newMember, ...prev]);
    return newMember;
  };

  const addBatch = (cohortData: Omit<Cohort, 'id'>): Cohort => {
    const newCohort: Cohort = {
      ...cohortData,
      id: `batch-${Date.now()}`
    };
    setBatches(prev => [newCohort, ...prev]);
    return newCohort;
  };

  const addCase = (caseData: Omit<ClinicalCase, 'id'>): ClinicalCase => {
    const newCase: ClinicalCase = {
      ...caseData,
      id: `case-${Date.now()}`
    };
    setCases(prev => [newCase, ...prev]);
    return newCase;
  };

  const scheduleExam = (examData: Omit<ScheduledExam, 'id'>): ScheduledExam => {
    const newExam: ScheduledExam = {
      ...examData,
      id: `exam-${Date.now()}`
    };
    setExams(prev => [newExam, ...prev]);
    return newExam;
  };

  const cancelExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const clearAllData = () => {
    setFaculty([]);
    setBatches([]);
    setCases([]);
    setExams([]);
  };

  return (
    <AdminDataContext.Provider
      value={{
        faculty,
        batches,
        cases,
        exams,
        addFaculty,
        addBatch,
        addCase,
        scheduleExam,
        cancelExam,
        clearAllData
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextType => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

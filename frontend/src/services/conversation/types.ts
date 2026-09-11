/**
 * Conversation Service Types and Interfaces
 * 
 * Modular architectural boundaries ensuring future LLM/backend integration
 * (e.g. FastAPI + Clinical Truth Engine) can be connected seamlessly.
 */

export type ConversationRole = 'student' | 'patient' | 'system';
export type SpeechStatus = 'idle' | 'speaking' | 'paused' | 'played';

/** Represents an input from the student (supports text now, voice/STT in future) */
export interface StudentInput {
  type: 'text' | 'voice';
  text: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

/** Patient baseline clinical profile for simulation context */
export interface PatientProfile {
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  allergies?: string;
  pastHistory?: string;
  currentMeds?: string;
}

/** Full simulation context passed to the conversation service */
export interface ConversationContext {
  caseId: string;
  scenarioTitle?: string;
  patientProfile: PatientProfile;
  language: 'en' | 'kn' | 'hi';
  history?: ConversationMessage[];
}

/** A message within the conversation transcript */
export interface ConversationMessage {
  id: string;
  role: ConversationRole;
  text: string;
  timestamp: string;
  speechStatus?: SpeechStatus;
}

/** Structured patient response from the response service */
export interface PatientResponse {
  text: string;
  timestamp: string;
  isMock: boolean;
  suggestedActions?: string[];
  clinicalNotes?: string;
}

/**
 * Interface for patient response generation.
 * Currently implemented by MockPatientService.
 * In production, an ApiPatientService will implement this to communicate with the LLM backend.
 */
export interface IPatientResponseService {
  generateResponse(input: StudentInput, context: ConversationContext): Promise<PatientResponse>;
}

/**
 * Orchestrator service interface that coordinates student questions with patient response.
 */
export interface IConversationService {
  sendMessage(input: StudentInput, context: ConversationContext): Promise<PatientResponse>;
  setResponseService(service: IPatientResponseService): void;
  getResponseService(): IPatientResponseService;
}

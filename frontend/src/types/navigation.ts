export type NavTab = 
  | 'dashboard'
  | 'simulation'
  | 'practice-cases'
  | 'my-sessions'
  | 'assessments'
  | 'profile'
  | 'settings'
  | 'help-support';

export interface UserProfile {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  institution?: string;
}

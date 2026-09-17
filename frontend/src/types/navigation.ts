export type UserRole = 'Student' | 'Faculty' | 'Admin';

export type NavTab = 
  | 'dashboard'
  | 'simulation'
  | 'practice-cases'
  | 'my-sessions'
  | 'assessments'
  | 'profile'
  | 'settings'
  | 'help-support';

export type AdminNavTab =
  | 'admin-dashboard'
  | 'admin-faculty'
  | 'admin-batches'
  | 'admin-cases'
  | 'admin-scheduling'
  | 'admin-profile'
  | 'admin-settings'
  | 'admin-help';

export interface UserProfile {
  name: string;
  role: UserRole | string;
  email?: string;
  phone?: string;
  institution?: string;
}

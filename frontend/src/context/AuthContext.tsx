import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile;
  login: (role?: UserRole, identifier?: string, password?: string) => void;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
  name: 'Dr. Alex Mercer',
  role: 'Student',
  email: 'alex.mercer@hospital.edu',
  phone: '+1 (410) 555-0192',
  institution: 'Bangalore Medical College & Research Institute'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);

  // Development mode: Allow sign-in with role and optional identifier
  const login = (role: UserRole = 'Student', identifier?: string, _password?: string) => {
    let baseUser: UserProfile;

    if (role === 'Admin') {
      baseUser = {
        name: 'Dr. A. Vance',
        role: 'Admin',
        email: 'a.vance@medsim.edu',
        phone: '+1 (555) 019-2834',
        institution: 'Bangalore Medical College & Research Institute'
      };
    } else if (role === 'Faculty') {
      baseUser = {
        name: 'Dr. Marcus Chen',
        role: 'Faculty',
        email: 'm.chen@medsim.edu',
        phone: '+1 (555) 234-8901',
        institution: 'Bangalore Medical College & Research Institute'
      };
    } else {
      baseUser = {
        name: 'Dr. Alex Mercer',
        role: 'Student',
        email: 'alex.mercer@hospital.edu',
        phone: '+1 (410) 555-0192',
        institution: 'Bangalore Medical College & Research Institute'
      };
    }

    if (identifier && identifier.trim()) {
      baseUser.name = identifier.includes('@') ? identifier.split('@')[0] : identifier;
      baseUser.email = identifier;
    }

    setUser(baseUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updated
    }));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

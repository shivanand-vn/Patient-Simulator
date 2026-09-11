import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile;
  login: (identifier?: string, password?: string) => void;
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

  // Development mode: Allow sign-in with empty fields or any values immediately
  const login = (identifier?: string, _password?: string) => {
    if (identifier && identifier.trim()) {
      setUser((prev) => ({
        ...prev,
        name: identifier.includes('@') ? identifier.split('@')[0] : identifier
      }));
    }
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

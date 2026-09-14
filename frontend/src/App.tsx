import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavTab } from './types/navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PracticeCases from './pages/PracticeCases';
import MySessions from './pages/MySessions';
import Simulation from './pages/Simulation';
import Assessments from './pages/Assessments';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { AdminLayout } from './components/admin/AdminLayout';
import { FacultyPortal } from './pages/FacultyPortal';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isAuthenticated) {
    return <Login />;
  }

  // Role-based routing: Admin
  if (user.role === 'Admin') {
    return <AdminLayout />;
  }

  // Role-based routing: Faculty
  if (user.role === 'Faculty') {
    return <FacultyPortal />;
  }

  // Existing Student Dashboard & Navigation (Preserved 100%)
  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentTab} />;
      case 'simulation':
        return <Simulation onNavigate={setCurrentTab} />;
      case 'practice-cases':
        return <PracticeCases onNavigate={setCurrentTab} />;
      case 'my-sessions':
        return <MySessions />;
      case 'assessments':
        return <Assessments />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'help-support':
        return <HelpSupport />;
      default:
        return <Dashboard onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
      />

      {/* Main Content View shifted by sidebar width (72rem / 18rem = 288px) */}
      <div className="pl-72">
        {/* Top Fixed Header Bar */}
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigateProfile={() => setCurrentTab('profile')}
        />

        {/* Dynamic Page Content */}
        <main className="relative pt-20 px-8 pb-12 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

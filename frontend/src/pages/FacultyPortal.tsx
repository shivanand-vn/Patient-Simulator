import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LogOut,
  GraduationCap,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FacultyPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'help-support'>('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface">
      {/* Fixed Left Navigation Sidebar for Faculty (Directly visible on desktop) */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-6 px-4 select-none border-r border-surface-container">
        <div className="flex flex-col gap-8">
          {/* Brand Header */}
          <div className="px-2">
            <h1 className="font-semibold text-base text-primary tracking-tight font-headline">
              AI Patient Simulation Engine
            </h1>
            <span className="text-xs text-outline font-medium">Faculty Portal</span>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-1">
            <span className="px-2 text-[11px] font-semibold text-outline uppercase tracking-wider mb-1">
              Main
            </span>
            <nav className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left w-full ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span>Dashboard</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col gap-2 pt-4 border-t border-surface-container">
          {/* Help & Support */}
          <button
            type="button"
            onClick={() => setActiveTab('help-support')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
              activeTab === 'help-support'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <HelpCircle className="w-5 h-5 shrink-0" />
            <span>Help & Support</span>
          </button>

          {/* Logout Button below Help & Support */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-left group"
          >
            <LogOut className="w-5 h-5 shrink-0 text-red-500 group-hover:text-red-700 transition-colors" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Layout Area shifted by sidebar width (72 = 18rem = 288px) */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Top Fixed Header Bar */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-surface-container/60 shadow-[0_1px_8px_rgba(0,0,0,0.02)] z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-xs text-outline">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="font-medium">Faculty Portal</span>
            {activeTab === 'help-support' && (
              <>
                <span className="text-outline/40">/</span>
                <span className="text-on-surface font-semibold">Help & Support</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-surface-container/80 text-on-surface">
              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200 shadow-xs">
                {user.name ? user.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2) : 'MC'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-on-surface leading-tight">
                  {user.name || 'Dr. Marcus Chen'}
                </span>
                <span className="text-[10px] text-outline font-medium leading-tight">
                  Faculty
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content: Clean and Centered */}
        <main className="flex-1 pt-16 flex items-center justify-center p-8">
          {activeTab === 'dashboard' ? (
            <div className="text-center flex flex-col items-center justify-center animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface font-headline mb-2">
                Faculty Dashboard
              </h1>
              <p className="text-sm sm:text-base text-outline font-medium">
                Under Development
              </p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center justify-center animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface font-headline mb-2">
                Help & Support
              </h1>
              <p className="text-sm sm:text-base text-outline font-medium">
                Under Development
              </p>
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
                  End faculty session
                </p>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              Are you sure you want to log out from the Faculty portal?
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

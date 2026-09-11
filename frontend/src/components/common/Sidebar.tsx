import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity,
  BriefcaseMedical, 
  FileEdit, 
  ClipboardList, 
  User, 
  Settings, 
  HelpCircle,
  LogOut
} from 'lucide-react';
import { NavTab } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const mainNavItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'practice-cases', label: 'Practice Cases', icon: <BriefcaseMedical className="w-5 h-5" /> },
    { id: 'simulation', label: 'Simulation', icon: <Activity className="w-5 h-5" /> },
    { id: 'my-sessions', label: 'Drafts', icon: <FileEdit className="w-5 h-5" /> },
    { id: 'assessments', label: 'My Results', icon: <ClipboardList className="w-5 h-5" /> },
  ];

  const accountNavItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-6 px-4 select-none border-r border-surface-container">
        <div className="flex flex-col gap-8">
          {/* Brand Header */}
          <div className="px-2">
            <h1 className="font-semibold text-base text-primary tracking-tight font-headline">
              AI Patient Simulation Engine
            </h1>
            <span className="text-xs text-outline font-medium">Student Portal</span>
          </div>

          {/* Navigation Sections */}
          <div className="flex flex-col gap-6">
            {/* Main Section */}
            <div className="flex flex-col gap-1">
              <span className="px-2 text-[11px] font-semibold text-outline uppercase tracking-wider mb-1">
                Main
              </span>
              <nav className="flex flex-col gap-1">
                {mainNavItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Account Section */}
            <div className="flex flex-col gap-1">
              <span className="px-2 text-[11px] font-semibold text-outline uppercase tracking-wider mb-1">
                Account
              </span>
              <nav className="flex flex-col gap-1">
                {accountNavItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col gap-2 pt-4 border-t border-surface-container">
          {/* Help & Support */}
          <button
            onClick={() => onSelectTab('help-support')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
              currentTab === 'help-support'
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
                  End current active session
                </p>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              Are you sure you want to log out? Any unsaved progress in active simulations will be lost.
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
    </>
  );
};

export default Sidebar;


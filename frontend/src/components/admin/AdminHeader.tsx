import React from 'react';
import { Search, Bell, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onNavigateProfile?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  searchQuery = '', 
  onSearchChange,
  onNavigateProfile 
}) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-surface-container/60 shadow-[0_1px_8px_rgba(0,0,0,0.02)] z-40 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-80">
        <Search className="w-4 h-4 text-outline shrink-0" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search faculty, cohorts, cases, exams..."
          className="bg-transparent border-none outline-none text-xs sm:text-sm text-on-surface placeholder:text-outline w-full focus:ring-0"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* UTC Time Tag */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low border border-surface-container text-[11px] font-mono text-outline">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>UTC -04:00</span>
        </div>

        {/* Notification Bell Badge */}
        <button 
          type="button" 
          aria-label="Admin Notifications"
          className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600"></span>
        </button>

        {/* Administrator Profile Pill */}
        <button
          type="button"
          onClick={onNavigateProfile}
          title={`Administrator Profile - ${user.name}`}
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full hover:bg-surface-container-high transition-colors border border-surface-container/80 text-on-surface group"
        >
          <div className="w-7 h-7 rounded-full bg-teal-800 text-teal-100 flex items-center justify-center font-bold text-xs border border-teal-700 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-on-surface leading-tight hidden sm:inline group-hover:text-primary transition-colors">
              {user.name || 'Dr. A. Vance'}
            </span>
            <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-1.5 rounded text-center leading-tight hidden sm:inline">
              Administrator
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

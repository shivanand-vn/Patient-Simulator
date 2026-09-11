import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onNavigateProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  searchQuery = '', 
  onSearchChange,
  onNavigateProfile 
}) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl border-b border-surface-container/60 shadow-[0_1px_8px_rgba(0,0,0,0.02)] z-40 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-72">
        <Search className="w-5 h-5 text-outline shrink-0" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search cases, sessions..."
          className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-full focus:ring-0"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Badge */}
        <button 
          type="button" 
          aria-label="Notifications"
          className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600"></span>
        </button>

        {/* Profile Icon / Pill near notification badge */}
        <button
          type="button"
          onClick={onNavigateProfile}
          title={`Profile - ${user.name}`}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-surface-container-high transition-colors border border-surface-container/80 text-on-surface group"
        >
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120"
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-outline-variant/60 shadow-sm"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-on-surface leading-tight hidden sm:inline group-hover:text-primary transition-colors">
              {user.name}
            </span>
            <span className="text-[10px] text-outline font-normal leading-tight hidden sm:inline">
              {user.role}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;


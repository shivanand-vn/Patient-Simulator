import React from 'react';
import { Play, Filter } from 'lucide-react';

interface HeroBannerProps {
  onBrowseCases?: () => void;
  onFilterSpecialties?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onBrowseCases, 
  onFilterSpecialties 
}) => {
  const telemetryImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAgL0mfMzSM9P46_TMb_8dmYHqgtIbLHApfVijNb4Yv4fiP3nt_IBI0xcSARdrMtCeHJ8tqoP8yBLaygtgUXeOeXqYLPpB8d2n9--VU9-2Di2lpz7rMwEsJikhQS-k_F6Zfuvtjnw1Gu8He7IVOyMAYEvEhsJpPTTB7Y55naApevUz0qzaG5iaJ21gHp_ID4Q2wPvsd3IuofV84cvO0muv6X3DzSNeIcoQz5SXucvl22iPwixdqSDbm";

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-8 bg-surface-container-lowest rounded-xl shadow-[0_1px_8px_rgba(0,102,102,0.06)] relative overflow-hidden border border-surface-container/60">
      {/* Subtle Background Glow */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Left Content */}
      <div className="flex flex-col gap-3 max-w-2xl relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-primary-container/15 text-primary text-xs font-semibold rounded">
            Active Simulation Engine
          </span>
          <span className="text-xs text-outline font-medium">• v4.2 Clinical Build</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight font-headline">
          Start a New Simulation
        </h2>

        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
          Practice clinical history taking, examination, investigations, diagnosis and treatment planning with virtual patients.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onBrowseCases}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-[0_2px_6px_rgba(0,76,76,0.2)] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Browse Cases</span>
          </button>
          
          <button
            onClick={onFilterSpecialties}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface text-sm font-semibold rounded-lg hover:bg-surface-container-highest transition-all active:scale-[0.98]"
          >
            <Filter className="w-4 h-4" />
            <span>Filter Specialties</span>
          </button>
        </div>
      </div>

      {/* Right Telemetry Media Preview */}
      <div className="relative w-full md:w-80 h-48 rounded-lg overflow-hidden shadow-sm shrink-0 bg-slate-900 border border-slate-200">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${telemetryImageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
          <span className="text-white text-xs font-medium bg-black/50 backdrop-blur-md px-2.5 py-1 rounded">
            Live Telemetry Feed
          </span>
        </div>
      </div>
    </div>
  );
};

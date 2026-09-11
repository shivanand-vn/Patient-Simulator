import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

interface ContinueSimulationCardProps {
  onContinue?: () => void;
}

export const ContinueSimulationCard: React.FC<ContinueSimulationCardProps> = ({ onContinue }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-on-surface font-headline">
          Continue Simulation
        </h3>
        <span className="text-xs text-outline font-medium">
          Active Session Found
        </span>
      </div>

      {/* Main Card */}
      <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-surface-container/60">
        <div className="flex items-start gap-4">
          {/* Heart Icon Container */}
          <div className="w-12 h-12 rounded-lg bg-tertiary-container/15 text-tertiary flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-primary" />
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Title and Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-on-surface font-headline">
                Acute Chest Pain
              </span>
              <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-xs font-semibold rounded">
                Cardiology
              </span>
              <span className="px-2 py-0.5 bg-primary-container/15 text-primary text-xs font-semibold rounded">
                Intermediate
              </span>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              Patient presenting with retrosternal pressure radiating to left arm. Diagnostic phase ongoing.
            </p>

            {/* Progress Bar */}
            <div className="flex items-center gap-4 mt-1">
              <div className="w-48 h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: '65%' }} />
              </div>
              <span className="text-xs text-outline font-medium">
                Progress: 65%
              </span>
            </div>
          </div>
        </div>

        {/* Continue Action Button */}
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shrink-0 active:scale-[0.98] shadow-sm"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

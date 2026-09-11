import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  subtextIcon?: React.ReactNode;
  highlightSubtext?: boolean;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  subtextIcon,
  highlightSubtext = false,
  icon
}) => {
  return (
    <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex items-center justify-between border border-surface-container/60">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-outline tracking-tight">
          {label}
        </span>
        <span className="text-2xl sm:text-3xl font-bold text-on-surface font-headline">
          {value}
        </span>
        <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${
          highlightSubtext ? 'text-primary' : 'text-outline'
        }`}>
          {subtextIcon}
          <span>{subtext}</span>
        </div>
      </div>

      <div className="w-14 h-14 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
    </div>
  );
};

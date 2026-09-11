import React from 'react';
import { History, Clock } from 'lucide-react';

export const MySessions: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="p-8 bg-surface-container-lowest rounded-xl border border-surface-container/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface font-headline">Drafts</h2>
            <p className="text-xs text-outline font-medium">Saved simulation sessions, paused encounters, and case draft notes</p>
          </div>
        </div>
        <div className="mt-6 p-6 rounded-lg bg-surface-container-low/60 border border-dashed border-outline-variant flex items-center gap-3 text-sm text-on-surface-variant">
          <Clock className="w-5 h-5 text-primary shrink-0" />
          <span>Active paused encounters, unfinished clinical investigations, and case drafts will appear here.</span>
        </div>
      </div>
    </div>
  );
};

export default MySessions;

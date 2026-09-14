import React from 'react';
import { Sliders, Clock, Construction } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-outline mt-0.5">
              System configuration and simulation environment parameters
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
          Admin Settings
        </span>
      </div>

      {/* Under Development Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs min-h-[420px]">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-primary border border-teal-100 flex items-center justify-center mb-5 shadow-xs">
          <Construction className="w-8 h-8 text-primary" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
          <Clock className="w-3.5 h-3.5" />
          Under Development
        </span>

        <h2 className="text-lg sm:text-xl font-bold text-on-surface font-headline mb-2">
          This Page is Under Development
        </h2>

        <p className="text-xs sm:text-sm text-outline max-w-md leading-relaxed">
          System settings and simulation environment controls are currently being engineered and will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;

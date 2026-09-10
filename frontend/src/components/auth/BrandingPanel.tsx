import React from 'react';
import { 
  ShieldCheck, 
  Bot, 
  Languages, 
  ClipboardCheck, 
  CheckCircle2 
} from 'lucide-react';

export const BrandingPanel: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between p-8 sm:p-10 lg:p-12 bg-clinical-850 text-white rounded-l-2xl sm:rounded-l-3xl overflow-hidden select-none">
      {/* Top Branding Section */}
      <div>
        {/* Clinical Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clinical-900/80 border border-clinical-700/60 text-emerald-300 text-xs font-medium tracking-wide mb-8">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Clinical Simulation Platform</span>
        </div>

        {/* Headings */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug mb-3">
          AI Patient Simulation Engine
        </h1>
        <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed font-normal mb-10">
          Practice clinical decision-making with realistic AI-powered virtual patients.
        </p>

        {/* Feature List - Minimal text/icon rows without cards or background noise */}
        <div className="space-y-6">
          {/* Feature 1 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-clinical-800/90 border border-clinical-700/50 flex items-center justify-center text-emerald-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                AI Patient Interaction
              </h2>
              <p className="text-xs text-emerald-100/75 mt-0.5 leading-relaxed">
                Natural conversations with context-aware virtual patients.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-clinical-800/90 border border-clinical-700/50 flex items-center justify-center text-emerald-300">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Multilingual Simulation
              </h2>
              <p className="text-xs text-emerald-100/75 mt-0.5 leading-relaxed">
                Interact with virtual patients in supported languages.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-clinical-800/90 border border-clinical-700/50 flex items-center justify-center text-emerald-300">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Clinical Assessment
              </h2>
              <p className="text-xs text-emerald-100/75 mt-0.5 leading-relaxed">
                Practice history taking, examination, investigation, diagnosis and treatment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Medical Compliance & Security Badges */}
      <div className="pt-10 mt-8 border-t border-clinical-700/40 flex items-center justify-between text-xs text-emerald-200/70 font-medium">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Secure Enterprise SSO
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          HIPAA Compliant
        </span>
      </div>
    </div>
  );
};

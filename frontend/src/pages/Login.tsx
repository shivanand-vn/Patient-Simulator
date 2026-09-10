import React from 'react';
import { BrandingPanel } from '../components/auth/BrandingPanel';
import { LoginForm } from '../components/auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Centered Main Login Container Card */}
      <main className="w-full max-w-4xl lg:max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-clinical-card border border-slate-200/80 overflow-hidden my-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          {/* Left Branding Panel (Solid Dark Teal / Green, Clean, Zero Ghosted UI) */}
          <section className="md:col-span-5 flex flex-col h-full" aria-label="Branding and Information">
            <BrandingPanel />
          </section>

          {/* Right Login Panel (White Form Container) */}
          <section className="md:col-span-7 flex flex-col h-full" aria-label="Sign In Form">
            <LoginForm />
          </section>
        </div>
      </main>

      {/* Subtle Bottom System Disclaimer for Desktop Window */}
      <footer className="mt-4 text-center text-xs text-slate-400 select-none">
        <p>AI Patient Simulation Engine • Desktop Workstation</p>
      </footer>
    </div>
  );
};

export default Login;

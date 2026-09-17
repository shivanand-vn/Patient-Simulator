import React, { useState, FormEvent } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  Stethoscope, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/navigation';

interface FormErrors {
  identifier?: string;
  password?: string;
}

export const LoginForm: React.FC = () => {
  const [role, setRole] = useState<UserRole>('Student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ identifier?: boolean; password?: boolean }>({});
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (field: 'identifier' | 'password', value: string): string | undefined => {
    if (field === 'identifier') {
      const trimmed = value.trim();
      if (!trimmed) {
        return 'Email or ID is required.';
      }
      // If it contains an '@' symbol, validate standard email format
      if (trimmed.includes('@') && !emailRegex.test(trimmed)) {
        return 'Enter a valid email address.';
      }
      return undefined;
    }

    if (field === 'password') {
      if (!value) {
        return 'Password is required.';
      }
      return undefined;
    }
  };

  const handleBlur = (field: 'identifier' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, field === 'identifier' ? identifier : password);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIdentifier(val);
    if (feedbackMessage) setFeedbackMessage(null);
    if (touched.identifier) {
      setErrors((prev) => ({ ...prev, identifier: validateField('identifier', val) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (feedbackMessage) setFeedbackMessage(null);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField('password', val) }));
    }
  };

  const { login } = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Development mode authentication: Immediately consider authenticated and navigate based on selected role
    login(role, identifier, password);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setFeedbackMessage({
      type: 'info',
      text: 'Password recovery is managed by your institution’s clinical simulation administrator.'
    });
  };

  return (
    <div className="flex flex-col justify-between h-full p-8 sm:p-10 lg:p-12 bg-white rounded-r-2xl sm:rounded-r-3xl">
      <div className="my-auto w-full py-2">
        {/* Header with Medical Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-clinical-850 flex items-center justify-center text-white shadow-sm ring-1 ring-clinical-900/10">
            <Stethoscope className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Sign in to continue your clinical simulation practice.
            </p>
          </div>
        </div>

        {/* Feedback Notifications */}
        {feedbackMessage && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-5 p-3 rounded-lg flex items-start gap-2.5 text-xs sm:text-sm transition-all animate-fadeIn ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Role Selection Field */}
          <div>
            <label 
              htmlFor="role-select" 
              className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5"
            >
              Role
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ShieldCheck className="w-4 h-4 text-clinical-850" />
              </div>
              <select
                id="role-select"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={isLoading}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/75 text-slate-900 font-medium rounded-lg border border-slate-200 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:border-clinical-800 focus:ring-clinical-800/15 cursor-pointer appearance-none transition-all duration-150"
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Email or ID Field */}
          <div>
            <label 
              htmlFor="identifier" 
              className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5"
            >
              {role === 'Student' ? 'Email or Student ID' : role === 'Faculty' ? 'Faculty Email / ID' : 'Administrator Email / ID'}
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={handleIdentifierChange}
                onBlur={() => handleBlur('identifier')}
                disabled={isLoading}
                placeholder={
                  role === 'Student' 
                    ? 'Enter your email or student ID' 
                    : role === 'Faculty' 
                    ? 'Enter faculty email (e.g. m.chen@medsim.edu)' 
                    : 'Enter admin email (e.g. a.vance@medsim.edu)'
                }
                aria-invalid={errors.identifier ? 'true' : 'false'}
                aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/75 text-slate-900 placeholder:text-slate-400 rounded-lg border transition-all duration-150 focus:bg-white focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
                  errors.identifier
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200/60'
                    : 'border-slate-200 hover:border-slate-300 focus:border-clinical-800 focus:ring-clinical-800/15'
                }`}
              />
            </div>
            {errors.identifier && (
              <p id="identifier-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.identifier}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="password" 
                className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
              >
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-medium text-clinical-800 hover:text-clinical-900 hover:underline focus:outline-none focus:ring-2 focus:ring-clinical-800/20 rounded px-1 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                disabled={isLoading}
                placeholder="Enter your password"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/75 text-slate-900 placeholder:text-slate-400 rounded-lg border transition-all duration-150 focus:bg-white focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
                  errors.password
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200/60'
                    : 'border-slate-200 hover:border-slate-300 focus:border-clinical-800 focus:ring-clinical-800/15'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none focus:text-clinical-800 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Login Options (Remember Me & Status) */}
          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-slate-300 text-clinical-850 focus:ring-clinical-800 focus:ring-offset-0 transition duration-150 cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-medium">
                Remember me
              </span>
            </label>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-medium text-slate-500">Server Online</span>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white tracking-wide shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-clinical-800 focus:ring-offset-2 ${
              isLoading
                ? 'bg-clinical-850/80 cursor-wait opacity-90'
                : 'bg-clinical-850 hover:bg-clinical-900 active:scale-[0.99] active:bg-clinical-950 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer System Diagnostics / Info */}
      <div className="pt-6 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>v1.0.0-clinical-build</span>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setFeedbackMessage({ type: 'info', text: 'Diagnostic system: all local neural simulation microservices healthy.' })}
            className="hover:text-slate-600 font-sans hover:underline focus:outline-none"
          >
            System Diagnostics
          </button>
          <span>•</span>
          <button 
            type="button" 
            onClick={() => setFeedbackMessage({ type: 'info', text: 'Support Portal: Clinical documentation available in docs.' })}
            className="hover:text-slate-600 font-sans hover:underline focus:outline-none"
          >
            Support Portal
          </button>
        </div>
      </div>
    </div>
  );
};

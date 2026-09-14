import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Check, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  X, 
  Copy 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminProfile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || 'Dr. Alexander Vance',
    email: user.email || 'a.vance@medsim.edu',
    phone: user.phone || '+1 (555) 890-1234'
  });

  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(formData.email);
    setCopied(true);
    showToast('Email address copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInputChange = (field: 'name' | 'email' | 'phone', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required.');
      return;
    }

    updateUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim()
    });

    setIsEditing(false);
    showToast('Administrator profile updated successfully.');
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || 'Dr. Alexander Vance',
      email: user.email || 'a.vance@medsim.edu',
      phone: user.phone || '+1 (555) 890-1234'
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
              Admin Profile
            </h1>
            <p className="text-xs sm:text-sm text-outline mt-0.5">
              Manage administrator personal information and contact details
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl self-start md:self-auto">
          System Administrator Mode
        </span>
      </div>

      {/* Main Grid: Admin Profile Card on Left (no edit button), Administrator Information Card on Right (has Edit Profile button) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Admin Profile Card (No edit button) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-6 shadow-xs flex flex-col items-center text-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=240"
              alt={formData.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-teal-200 shadow-sm"
            />
            <span 
              title="Verified Administrator"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-on-surface font-headline">
              {formData.name}
            </h2>
            <p className="text-xs font-semibold text-primary mt-0.5">
              System Administrator
            </p>
            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Administrator ID
            </span>
          </div>

          <div className="w-full pt-4 border-t border-surface-container/80 flex flex-col gap-2 text-xs text-outline">
            <div className="flex items-center justify-between">
              <span>Account Role</span>
              <span className="font-semibold text-on-surface">Administrator</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Account Status</span>
              <span className="font-semibold text-emerald-700">Active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Administrator Information Card (With Edit Profile button & Editable fields) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-6 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container/80">
            <div>
              <h3 className="text-base font-bold text-on-surface font-headline">
                Administrator Information
              </h3>
              <p className="text-xs text-outline mt-0.5">
                {isEditing 
                  ? 'Update your administrator name, institutional email, and mobile contact number.'
                  : 'Current administrator contact and identification parameters.'}
              </p>
            </div>

            {/* Edit Profile Button on Administrator Information card */}
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all shadow-xs shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          {isEditing ? (
            /* Editable Form Mode */
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Dr. Alexander Vance"
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Institutional Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="e.g. a.vance@medsim.edu"
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>

              {/* Mobile Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>Mobile Contact Number</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g. +1 (555) 890-1234"
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-outline hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            /* Read-Only View Mode */
            <div className="flex flex-col gap-4">
              {/* Name Display */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-primary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-outline uppercase font-semibold block">
                      Full Name
                    </span>
                    <span className="text-sm font-bold text-on-surface">
                      {formData.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Display */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-outline uppercase font-semibold block">
                      Institutional Email Address
                    </span>
                    <span className="text-sm font-bold text-on-surface font-mono">
                      {formData.email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                  title="Copy email address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Mobile Display */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-outline uppercase font-semibold block">
                      Mobile Contact Number
                    </span>
                    <span className="text-sm font-bold text-on-surface font-mono">
                      {formData.phone || 'Not provided'}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Direct Line
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 p-4 rounded-xl bg-emerald-900 text-white text-sm shadow-xl flex items-center gap-2 animate-fadeIn z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

import React, { useState } from 'react';
import { 
  Download, 
  Edit3, 
  Check, 
  X, 
  BadgeCheck, 
  Mail, 
  Phone, 
  Building2, 
  Lock, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || 'Dr. Alex Mercer',
    email: user.email || 'alex.mercer@hospital.edu',
    phone: user.phone || '+1 (410) 555-0192',
    institution: user.institution || 'Bangalore Medical College & Research Institute'
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      institution: formData.institution
    });
    setIsEditing(false);
    showToast('Profile information successfully updated.');
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || 'Dr. Alex Mercer',
      email: user.email || 'alex.mercer@hospital.edu',
      phone: user.phone || '+1 (410) 555-0192',
      institution: user.institution || 'Bangalore Medical College & Research Institute'
    });
    setIsEditing(false);
  };

  const handleExport = () => {
    showToast(`Simulation transcript for ${user.name} exported successfully.`);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wider text-outline uppercase mb-1">
            USER MANAGEMENT
          </div>
          <h1 className="text-2xl font-bold text-on-surface font-headline">My Profile</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-surface-container-high transition-colors"
          >
            <Download className="w-4 h-4 text-outline" />
            <span>Export Transcript</span>
          </button>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast feedback notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 w-full">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col items-center text-center">
            {/* Avatar with Verified Status */}
            <div className="relative mb-4">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-surface-container-low shadow-sm"
              />
              <span 
                title="Verified Student Identity" 
                className="absolute bottom-1 right-2 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center border-2 border-surface-container-lowest shadow-sm"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            {/* Name & ID */}
            <h2 className="text-xl font-bold text-on-surface font-headline">{user.name}</h2>
            <p className="text-xs text-outline font-medium tracking-wide mt-0.5">#STU-8842</p>

            {/* Badges */}
            <div className="flex items-center justify-center gap-2 mt-3.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                Active Student
              </span>
            </div>

            {/* Performance Statistics Overview */}
            <div className="border-t border-surface-container/80 pt-4 mt-6 grid grid-cols-3 divide-x divide-surface-container/80 w-full text-center">
              <div className="px-2">
                <div className="text-base font-bold text-on-surface font-headline">48</div>
                <div className="text-[11px] text-outline font-medium">Simulations</div>
              </div>
              <div className="px-2">
                <div className="text-base font-bold text-primary font-headline">94.2%</div>
                <div className="text-[11px] text-outline font-medium">Avg. Score</div>
              </div>
              <div className="px-2">
                <div className="text-base font-bold text-on-surface font-headline">120h</div>
                <div className="text-[11px] text-outline font-medium">Logged</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scoped Personal & Academic Information (Strictly 4 Fields) */}
        <div className="lg:col-span-8 w-full">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-6 sm:p-7">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-surface-container/80 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-primary">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface font-headline">
                    Personal & Academic Information
                  </h3>
                  <p className="text-xs text-outline">
                    Core institutional identity credentials for clinical evaluation.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-outline font-medium bg-surface-container-low px-2.5 py-1 rounded-lg self-start sm:self-auto">
                <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>ID Verified via Institutional SSO</span>
              </div>
            </div>

            {/* Form Fields: View Mode vs Edit Mode */}
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Dr. Alex Mercer"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low/70 border border-surface-container rounded-xl text-sm font-medium text-on-surface">
                      <span>{user.name}</span>
                      <Lock className="w-4 h-4 text-outline/70 shrink-0" />
                    </div>
                  )}
                </div>

                {/* 2. Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. +1 (410) 555-0192"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low/70 border border-surface-container rounded-xl text-sm font-medium text-on-surface">
                      <span>{user.phone || '+1 (410) 555-0192'}</span>
                      <Phone className="w-4 h-4 text-outline/70 shrink-0" />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Institutional Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">
                  Institutional Email
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="e.g. alex.mercer@hospital.edu"
                      required
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low/70 border border-surface-container rounded-xl text-sm font-medium text-on-surface">
                    <span>{user.email || 'alex.mercer@hospital.edu'}</span>
                    <Mail className="w-4 h-4 text-outline/70 shrink-0" />
                  </div>
                )}
              </div>

              {/* 4. Institution Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">
                  Institution Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="e.g. Bangalore Medical College & Research Institute"
                      required
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low/70 border border-surface-container rounded-xl text-sm font-medium text-on-surface">
                    <div className="flex items-center gap-2.5 truncate">
                      <Building2 className="w-4 h-4 text-outline shrink-0" />
                      <span className="truncate">{user.institution || 'Bangalore Medical College & Research Institute'}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  </div>
                )}
              </div>

              {/* Edit Mode Actions */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container/80 mt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


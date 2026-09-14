import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Phone, 
  Mail, 
  KeyRound, 
  Edit3, 
  CheckCircle2, 
  X,
  GraduationCap
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const AdminFaculty: React.FC = () => {
  const { faculty, addFaculty } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New faculty form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('TempPass@2026');
  const [newSpecialty, setNewSpecialty] = useState('Cardiology');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const specialties = ['All', 'Cardiology', 'Pulmonology', 'Neurology', 'Emergency Medicine'];

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.assignedCase.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All' || f.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const added = addFaculty({
      name: newName.trim(),
      role: `${newSpecialty} Instructor`,
      specialty: newSpecialty,
      email: newEmail.trim(),
      phone: newPhone.trim() || '+1 (555) 000-0000',
      assignedCase: 'Unassigned',
      status: 'Active',
      lastAudit: 'Just added'
    });

    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    showToast(`Faculty added: ${added.name}. Login credentials generated.`);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider text-outline uppercase">
              STAFF ACCREDITATION & ACCESS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Directory Live
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
            Faculty Management
          </h1>
          <p className="text-xs sm:text-sm text-outline mt-0.5">
            Manage clinical instructors, departments & evaluation access across all simulation tracks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Exporting Faculty Directory (CSV)...')}
            className="p-2.5 rounded-xl border border-surface-container bg-surface-container-lowest hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
            title="Export Directory"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Roster Counters */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="text-xs font-semibold text-outline">Total Roster</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface font-mono">{faculty.length}</span>
            <span className="text-xs text-outline font-medium">faculty</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-outline">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Active</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              {faculty.filter(f => f.status === 'Active').length}
            </span>
            <span className="text-xs text-outline font-medium">ready</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-outline">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>On Leave</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-700 font-mono">
              {faculty.filter(f => f.status === 'On Leave').length}
            </span>
            <span className="text-xs text-outline font-medium">inactive</span>
          </div>
        </div>
      </div>

      {/* Search Bar & Specialty Filter Chips */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by instructor name, email, or case..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-surface-container rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {specialties.map(spec => (
            <button
              key={spec}
              type="button"
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedSpecialty === spec
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-outline'
              }`}
            >
              {spec === 'All' ? 'All Specializations' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid or Empty State */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container/90 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary border border-teal-100 flex items-center justify-center mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-on-surface font-headline mb-1">
            No Faculty Members Found
          </h3>
          <p className="text-xs text-outline max-w-sm mb-4">
            {searchQuery || selectedSpecialty !== 'All'
              ? "No faculty members match your active filters or search criteria."
              : "No clinical instructors or faculty evaluators have been added yet."}
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Faculty Member</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFaculty.map(member => (
            <div
              key={member.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 font-bold text-sm flex items-center justify-center shrink-0 border border-teal-200">
                      {member.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-on-surface font-headline flex items-center gap-2">
                        {member.name}
                      </h3>
                      <p className="text-xs text-primary font-medium">{member.role}</p>
                      <p className="text-xs text-outline flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-semibold shrink-0 ${
                      member.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <Phone className="w-3.5 h-3.5 text-outline" />
                    {member.phone}
                  </span>
                  <span className="text-outline">
                    Assigned: <strong className="text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">{member.assignedCase}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-outline">
                  {member.statusNote || `Last audit: ${member.lastAudit}`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast(`Password reset link dispatched to ${member.email}`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-surface-container text-outline hover:text-on-surface font-medium transition-colors"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Reset Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`Opening editor for ${member.name}`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-semibold transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Faculty Modal Dialog */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-surface-container-lowest border border-surface-container/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface font-headline">
                    Add Clinical Faculty
                  </h3>
                  <p className="text-xs text-outline">
                    Register faculty evaluator profile and generate portal access credentials.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaculty} className="flex flex-col gap-3.5 mt-2 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Faculty Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Pendelton, MD"
                  className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Institutional Email ID (Login ID)</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. a.pendelton@medsim.edu"
                  className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">Contact Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">Specialization</label>
                  <select
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Endocrinology">Endocrinology</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Default Temporary Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-mono"
                />
                <span className="text-[10px] text-outline">
                  The faculty will be prompted to change this on their initial simulation portal login.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-container mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-medium text-outline hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
                >
                  Save & Issue Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default AdminFaculty;

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  FileEdit, 
  Eye, 
  Check, 
  Network, 
  FileText, 
  X, 
  BriefcaseMedical 
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const AdminCases: React.FC = () => {
  const { cases, addCase } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New case form state
  const [newTitle, setNewTitle] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('Cardiology');
  const [newAcuity, setNewAcuity] = useState('High-Acuity');
  const [newDescription, setNewDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const specialties = ['All', 'Cardiology', 'Respiratory', 'Neurology', 'Endocrinology'];

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All' || c.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const caseNum = cases.length + 1;
    const added = addCase({
      code: `CASE-00${caseNum}`,
      specialty: newSpecialty,
      acuity: newAcuity,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Customized clinical diagnostic case scenario authored by administration.',
      rubric: 'Standardized OSCE Rubric v2',
      metaInfo: 'Newly Authored Case',
      status: 'Active'
    });

    setShowNewModal(false);
    setNewTitle('');
    setNewDescription('');
    showToast(`Case scenario ${added.code} (${added.title}) authored and validated.`);
  };

  const validatedCount = cases.filter(c => c.status === 'Active').length;
  const draftCount = cases.filter(c => c.status !== 'Active').length;
  const rigsLinkedCount = cases.length > 0 ? cases.length : 0;

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-outline uppercase mb-1">
            CLINICAL LIBRARY
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
            Case Management
          </h1>
          <p className="text-xs sm:text-sm text-outline mt-0.5">
            Simulated patient scenarios, OSCE rubrics, and clinical deployment tracks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Case</span>
        </button>
      </div>

      {/* Case Counters */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-outline">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validated</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-on-surface font-mono">{validatedCount}</div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-outline">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>In Draft</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-on-surface font-mono">{draftCount}</div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-outline">
            <Network className="w-3.5 h-3.5 text-sky-600" />
            <span>Rigs Linked</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-on-surface font-mono">{rigsLinkedCount}</div>
        </div>
      </div>

      {/* Search & Specialty Filter Chips */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scenario, ID, rubric or cohort..."
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
              {spec === 'All' ? 'All Specialties' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Cards Grid or Empty State */}
      {filteredCases.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container/90 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary border border-teal-100 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-on-surface font-headline mb-1">
            No Clinical Cases Found
          </h3>
          <p className="text-xs text-outline max-w-sm mb-4">
            {searchQuery || selectedSpecialty !== 'All'
              ? "No clinical scenarios match your active search filters."
              : "No validated simulation scenarios or clinical cases have been created yet."}
          </p>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Case</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map(item => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-outline font-mono uppercase bg-surface-container-low px-2 py-0.5 rounded">
                    {item.code} • {item.specialty}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {item.acuity}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-on-surface font-headline mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="mt-4 p-3 bg-surface-container-low rounded-xl flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Rubric:</span>
                    <span className="font-semibold text-on-surface">{item.rubric}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Deployment:</span>
                    <span className="font-semibold text-primary">{item.metaInfo}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container/60 flex items-center gap-2 text-xs">
                {item.status === 'Draft / In Review' ? (
                  <button
                    type="button"
                    onClick={() => showToast(`Continuing authoring script for ${item.code}`)}
                    className="w-full py-2 rounded-xl font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit Details & Continue Authoring</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => showToast(`Opening parameters editor for ${item.code}`)}
                      className="flex-1 py-2 rounded-xl font-semibold bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(`Previewing dialogue tree script for ${item.code}`)}
                      className="flex-1 py-2 rounded-xl font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Script</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hardware Rig Sync Status Footer Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-on-surface">Hardware Rig Sync Status</div>
            <div className="text-[11px] text-outline">
              All 12 SimMan 3G rigs synced to OSCERuntime v4.2 telemetry feed
            </div>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Synchronized
        </span>
      </div>

      {/* New Case Modal */}
      {showNewModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowNewModal(false)}
        >
          <div 
            className="bg-surface-container-lowest border border-surface-container/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary">
                  <BriefcaseMedical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface font-headline">
                    Author New Clinical Case
                  </h3>
                  <p className="text-xs text-outline">
                    Specify clinical case vignette, medical area, and rubric parameters.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="flex flex-col gap-3.5 mt-2 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Case Scenario Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Acute Appendicitis with Sepsis"
                  className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">Specialty</label>
                  <select
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">Acuity Level</label>
                  <select
                    value={newAcuity}
                    onChange={(e) => setNewAcuity(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                  >
                    <option value="High-Acuity">High-Acuity</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Case Description & Clinical Vignette</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe patient presenting chief complaint, vital signs, and diagnostic challenges..."
                  className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-container mt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl font-medium text-outline hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
                >
                  Validate & Save Case
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

export default AdminCases;

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  X,
  GraduationCap,
  FolderGit2
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const AdminBatches: React.FC = () => {
  const { batches, addBatch } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal inputs
  const [newBatchName, setNewBatchName] = useState('');
  const [newYearTrack, setNewYearTrack] = useState('Year 1 Clinical Foundations');
  const [newTrackName, setNewTrackName] = useState('General Medicine Track');
  const [newEnrolledCount, setNewEnrolledCount] = useState('45');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredCohorts = batches.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.yearTrack.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clinicalTrack.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    const count = parseInt(newEnrolledCount, 10) || 0;
    const added = addBatch({
      name: newBatchName.trim(),
      yearTrack: newYearTrack,
      clinicalTrack: newTrackName,
      enrolled: count,
      casesBound: 0,
      progressPercent: 0,
      status: 'Active'
    });

    setShowCreateModal(false);
    setNewBatchName('');
    showToast(`Cohort created: ${added.name}. Enrollment roster ready.`);
  };

  const totalEnrolled = batches.reduce((acc, c) => acc + (c.enrolled || 0), 0);
  const totalCasesBound = batches.reduce((acc, c) => acc + (c.casesBound || 0), 0);
  const activeCohortsCount = batches.filter(c => c.status === 'Active').length;

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
            Batch Management
          </h1>
          <p className="text-xs sm:text-sm text-outline mt-0.5">
            Cohorts, student enrollment lists and graduation tracks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Batch</span>
        </button>
      </div>

      {/* Cohort Density Metric Counters */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="text-xs font-semibold text-outline">Active Cohorts</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface font-mono">
              {activeCohortsCount}
            </span>
            <span className="text-xs text-outline font-medium">Batches</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="text-xs font-semibold text-outline">Enrolled Students</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface font-mono">
              {totalEnrolled}
            </span>
            <span className="text-xs text-outline font-medium">Candidates</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-4 shadow-xs">
          <div className="text-xs font-semibold text-outline">Cases Bound</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface font-mono">
              {totalCasesBound}
            </span>
            <span className="text-xs text-outline font-medium">Modules</span>
          </div>
        </div>
      </div>

      {/* Search & Active Cohorts Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batch, year, track or clinical focus..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-surface-container rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
            />
          </div>

          <span className="text-xs font-semibold text-outline self-end sm:self-auto">
            Showing {filteredCohorts.length} of {batches.length} cohorts
          </span>
        </div>

        {/* Cohort Cards Grid or Empty State */}
        {filteredCohorts.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container/90 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center mb-3">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-on-surface font-headline mb-1">
              No Simulation Cohorts Found
            </h3>
            <p className="text-xs text-outline max-w-sm mb-4">
              {searchQuery
                ? "No student batches match your search query."
                : "No academic cohorts or student batches have been created yet."}
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Batch</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCohorts.map(cohort => (
              <div
                key={cohort.id}
                className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-on-surface font-headline">
                          {cohort.name}
                        </h3>
                        <p className="text-xs text-outline mt-0.5">
                          {cohort.yearTrack} • {cohort.clinicalTrack}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-semibold shrink-0 ${
                        cohort.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-surface-container-low text-outline border border-surface-container'
                      }`}
                    >
                      {cohort.status}
                    </span>
                  </div>

                  <div className="mt-4 p-3.5 bg-sky-50/60 border border-sky-100 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-sky-950 font-medium block">
                        {cohort.status === 'Archived' ? 'Final Graduation Count' : 'Enrolled Students'}
                      </span>
                      <div className="font-bold text-on-surface text-sm mt-0.5 font-mono">
                        {cohort.status === 'Archived' ? (
                          `${cohort.certifiedCount} Certified`
                        ) : (
                          <>
                            {cohort.enrolled}{' '}
                            {cohort.backlogCount && (
                              <span className="text-red-600 font-semibold text-xs">
                                ({cohort.backlogCount} Backlog)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-sky-950 font-medium block">
                        {cohort.status === 'Archived' ? 'Status' : 'Sim Cases Bound'}
                      </span>
                      <div className="font-bold text-on-surface text-sm mt-0.5 font-mono">
                        {cohort.status === 'Archived' ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed
                          </span>
                        ) : (
                          `${cohort.casesBound} Scenarios`
                        )}
                      </div>
                    </div>
                  </div>

                  {cohort.progressPercent !== undefined && (
                    <div className="mt-3 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-medium text-outline">
                        <span>OSCE Simulation Milestones</span>
                        <span className="font-bold text-primary font-mono">{cohort.progressPercent}% Completed</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${cohort.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-surface-container/60 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast(`Managing student roster for ${cohort.name}`)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Manage Students</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`Editing parameters for ${cohort.name}`)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roster Snapshot Section */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/90 p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            <h3 className="text-base font-bold text-on-surface font-headline">
              Active Cohort Roster Snapshot
            </h3>
          </div>
          {batches.length > 0 && (
            <button
              type="button"
              onClick={() => showToast('Opening complete roster view...')}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Expand All</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {batches.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center text-center text-xs text-outline">
            <p>No student enrollment records available. Create an academic batch to initialize student rosters.</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-on-surface">{batches[0].name} Roster</span>
              <p className="text-outline mt-0.5">{batches[0].enrolled} enrolled candidates in {batches[0].yearTrack}</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
              Active Sync
            </span>
          </div>
        )}
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowCreateModal(false)}
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
                    Create New Simulation Batch
                  </h3>
                  <p className="text-xs text-outline">
                    Establish student cohort group and assign clinical curriculum tracks.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="flex flex-col gap-3.5 mt-2 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Batch Name / Identifier</label>
                <input
                  type="text"
                  required
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  placeholder="e.g. Batch 2028 - Clinical Juniors"
                  className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">Year Track Level</label>
                  <input
                    type="text"
                    value={newYearTrack}
                    onChange={(e) => setNewYearTrack(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">Student Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={newEnrolledCount}
                    onChange={(e) => setNewEnrolledCount(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Clinical Specialty Track</label>
                <input
                  type="text"
                  value={newTrackName}
                  onChange={(e) => setNewTrackName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-container mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl font-medium text-outline hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
                >
                  Create Cohort
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

export default AdminBatches;

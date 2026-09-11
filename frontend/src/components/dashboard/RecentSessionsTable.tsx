import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface RecentSessionItem {
  id: string;
  caseTitle: string;
  specialty: string;
  difficulty: string;
  date: string;
  score: string;
  status: 'Completed' | 'In Progress' | 'Aborted';
}

interface RecentSessionsTableProps {
  onViewAll?: () => void;
  onViewResults?: (sessionId: string) => void;
}

const defaultSessions: RecentSessionItem[] = [
  {
    id: 'sess-1',
    caseTitle: 'Type 2 Diabetes Mellitus Management',
    specialty: 'Endocrinology',
    difficulty: 'Advanced',
    date: 'May 24, 2024',
    score: '88%',
    status: 'Completed'
  },
  {
    id: 'sess-2',
    caseTitle: 'Community-Acquired Pneumonia',
    specialty: 'Pulmonology',
    difficulty: 'Beginner',
    date: 'May 21, 2024',
    score: '74%',
    status: 'Completed'
  },
  {
    id: 'sess-3',
    caseTitle: 'Acute Appendicitis Triage',
    specialty: 'Surgery',
    difficulty: 'Intermediate',
    date: 'May 18, 2024',
    score: '91%',
    status: 'Completed'
  },
  {
    id: 'sess-4',
    caseTitle: 'Major Depressive Disorder Assessment',
    specialty: 'Psychiatry',
    difficulty: 'Beginner',
    date: 'May 14, 2024',
    score: '85%',
    status: 'Completed'
  }
];

export const RecentSessionsTable: React.FC<RecentSessionsTableProps> = ({
  onViewAll,
  onViewResults
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Table Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-on-surface font-headline">
          Recent Sessions
        </h3>
        <button 
          onClick={onViewAll}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All Sessions
        </button>
      </div>

      {/* Table Card Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.02)] overflow-hidden border border-surface-container/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline text-xs font-semibold uppercase tracking-wider border-b border-surface-container/80">
                <th className="py-3 px-6 font-semibold">Case</th>
                <th className="py-3 px-6 font-semibold">Date</th>
                <th className="py-3 px-6 font-semibold">Score</th>
                <th className="py-3 px-6 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {defaultSessions.map((session) => (
                <tr 
                  key={session.id}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  {/* Case Info */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface">
                        {session.caseTitle}
                      </span>
                      <span className="text-xs text-outline">
                        {session.specialty} · {session.difficulty}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 text-sm text-on-surface-variant font-medium">
                    {session.date}
                  </td>

                  {/* Score */}
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-on-surface font-headline">
                      {session.score}
                    </span>
                  </td>

                  {/* Status Pill Badge */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-container/10 text-primary text-xs font-semibold rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {session.status}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onViewResults?.(session.id)}
                      className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
                    >
                      <span>View Results</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

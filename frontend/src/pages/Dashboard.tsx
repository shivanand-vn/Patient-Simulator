import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  BriefcaseMedical, 
  BarChart3, 
  FolderOpen 
} from 'lucide-react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { StatCard } from '../components/dashboard/StatCard';
import { ContinueSimulationCard } from '../components/dashboard/ContinueSimulationCard';
import { RecentSessionsTable } from '../components/dashboard/RecentSessionsTable';
import { NavTab } from '../types/navigation';

interface DashboardProps {
  onNavigate?: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full gap-8">
      {/* Hero / Banner Section */}
      <HeroBanner 
        onBrowseCases={() => onNavigate?.('practice-cases')}
        onFilterSpecialties={() => onNavigate?.('practice-cases')}
      />

      {/* Performance Summary 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Simulations Completed"
          value="24"
          subtext="+3 this week"
          subtextIcon={<TrendingUp className="w-4 h-4" />}
          highlightSubtext={true}
          icon={<BriefcaseMedical className="w-7 h-7" />}
        />

        <StatCard
          label="Average Score"
          value="82%"
          subtext="Top 15% cohort"
          subtextIcon={<CheckCircle2 className="w-4 h-4" />}
          highlightSubtext={true}
          icon={<BarChart3 className="w-7 h-7" />}
        />

        <StatCard
          label="Cases Practiced"
          value="18"
          subtext="Across 6 medical specialties"
          highlightSubtext={false}
          icon={<FolderOpen className="w-7 h-7" />}
        />
      </div>

      {/* Continue Simulation Section */}
      <ContinueSimulationCard 
        onContinue={() => onNavigate?.('simulation')}
      />

      {/* Recent Sessions Table */}
      <RecentSessionsTable 
        onViewAll={() => onNavigate?.('my-sessions')}
        onViewResults={(_sessionId) => onNavigate?.('assessments')}
      />
    </div>
  );
};

export default Dashboard;

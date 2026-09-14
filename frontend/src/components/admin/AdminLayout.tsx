import React, { useState } from 'react';
import { AdminNavTab } from '../../types/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminFaculty } from '../../pages/admin/AdminFaculty';
import { AdminBatches } from '../../pages/admin/AdminBatches';
import { AdminCases } from '../../pages/admin/AdminCases';
import { AdminExamScheduling } from '../../pages/admin/AdminExamScheduling';
import { AdminSettings } from '../../pages/admin/AdminSettings';
import { AdminHelpSupport } from '../../pages/admin/AdminHelpSupport';
import { AdminProfile } from '../../pages/admin/AdminProfile';
import { AdminDataProvider } from '../../context/AdminDataContext';

export const AdminLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AdminNavTab>('admin-dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={setCurrentTab} />;
      case 'admin-faculty':
        return <AdminFaculty />;
      case 'admin-batches':
        return <AdminBatches />;
      case 'admin-cases':
        return <AdminCases />;
      case 'admin-scheduling':
        return <AdminExamScheduling />;
      case 'admin-profile':
        return <AdminProfile />;
      case 'admin-settings':
        return <AdminSettings />;
      case 'admin-help':
        return <AdminHelpSupport />;
      default:
        return <AdminDashboard onNavigate={setCurrentTab} />;
    }
  };

  return (
    <AdminDataProvider>
      <div className="min-h-screen w-full bg-surface text-on-surface">
        {/* Fixed Left Navigation Sidebar for Admin (Directly visible on desktop) */}
        <AdminSidebar 
          currentTab={currentTab} 
          onSelectTab={setCurrentTab} 
        />

        {/* Main Content View shifted by sidebar width (72 = 18rem = 288px) */}
        <div className="pl-72">
          {/* Top Fixed Header Bar */}
          <AdminHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigateProfile={() => setCurrentTab('admin-profile')}
          />

          {/* Dynamic Page Content */}
          <main className="relative pt-20 px-8 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {renderActiveTab()}
            </div>
          </main>
        </div>
      </div>
    </AdminDataProvider>
  );
};

export default AdminLayout;

import React from 'react';
import DashboardHeader from './DashboardHeader';
import Footer from '../layouts/Footer';
import BackToTop from '../ui/BackToTop';
import BackToDashboard from '../ui/BackToDashboard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <Footer />
      <BackToTop />
      <BackToDashboard />
    </div>
  );
};

export default DashboardLayout; 
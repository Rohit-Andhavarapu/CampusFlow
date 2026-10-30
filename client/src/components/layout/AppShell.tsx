import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/ToastContainer';
import { useApp } from '../../context/AppContext';

export const AppShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { currentRole, switchRole } = useApp();

  useEffect(() => {
    if (location.pathname.startsWith('/recruiter') && currentRole !== 'recruiter') {
      switchRole('recruiter', true);
    } else if (location.pathname.startsWith('/admin') && currentRole !== 'admin') {
      switchRole('admin', true);
    } else if (location.pathname.startsWith('/student') && currentRole !== 'student') {
      switchRole('student', true);
    }
  }, [location.pathname, currentRole, switchRole]);

  return (
    <div className="min-h-screen flex bg-background text-primary-text">
      {/* Sidebar navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

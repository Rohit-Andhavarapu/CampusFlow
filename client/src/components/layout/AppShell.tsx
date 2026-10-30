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
    <div className="min-h-screen flex bg-[#F4F5F7] text-slate-900 antialiased selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden w-full max-w-full">
      {/* Sidebar navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Workspace: Framed-Sheet Inset Canvas */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full lg:p-2.5 lg:pl-0 overflow-x-hidden">
        <div className="flex-1 bg-white lg:rounded-2xl border border-slate-200/90 flex flex-col min-w-0 w-full shadow-2xs overflow-hidden">
          <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-y-auto overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Interactive Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

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
  const { currentRole, setCurrentRole } = useApp();

  // Keep currentRole in sync with URL without re-authenticating as demo users
  useEffect(() => {
    if (location.pathname.startsWith('/recruiter') && currentRole !== 'recruiter') {
      setCurrentRole?.('recruiter');
    } else if (location.pathname.startsWith('/admin') && currentRole !== 'admin') {
      setCurrentRole?.('admin');
    } else if (location.pathname.startsWith('/student') && currentRole !== 'student') {
      setCurrentRole?.('student');
    }
  }, [location.pathname, currentRole, setCurrentRole]);

  return (
    <div className="h-screen w-full max-w-full flex bg-[#F4F5F7] text-slate-900 antialiased selection:bg-teal-100 selection:text-teal-900 overflow-hidden">
      {/* Fixed Sidebar navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Workspace Canvas — Independent Scroll Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:p-2.5 lg:pl-0">
        <div className="flex-1 bg-white lg:rounded-2xl border border-slate-200/90 flex flex-col min-w-0 h-full shadow-2xs overflow-hidden">
          <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-y-auto overflow-x-hidden scroll-smooth">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Interactive Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

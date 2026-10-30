import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileText,
  Calendar,
  UserCheck,
  Bell,
  Settings,
  Building2,
  Users,
  Briefcase,
  BarChart3,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  unreadBadge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { currentRole, currentUser, switchRole, notifications } = useApp();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const studentNav: NavItem[] = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Explore Opportunities', path: '/student/opportunities', icon: Compass, badge: 'New' },
    { label: 'My Applications', path: '/student/applications', icon: FileText },
    { label: 'Interviews', path: '/student/interviews', icon: Calendar },
    { label: 'Profile & Resume', path: '/student/profile', icon: UserCheck },
    { label: 'Notifications', path: '/student/notifications', icon: Bell, unreadBadge: unreadCount },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const recruiterNav: NavItem[] = [
    { label: 'Recruiter Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'Job Postings', path: '/recruiter/jobs', icon: Briefcase },
    { label: 'Applicant Pipeline', path: '/recruiter/applicants', icon: Users },
    { label: 'Scheduled Interviews', path: '/recruiter/interviews', icon: Calendar },
    { label: 'Company Profile', path: '/recruiter/company', icon: Building2 },
    { label: 'Hiring Analytics', path: '/recruiter/analytics', icon: BarChart3 },
  ];

  const adminNav: NavItem[] = [
    { label: 'Admin Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Student Directory', path: '/admin/students', icon: GraduationCap },
    { label: 'Partner Companies', path: '/admin/companies', icon: Building2 },
    { label: 'Placement Drives', path: '/admin/drives', icon: Layers },
    { label: 'Application Oversight', path: '/admin/applications', icon: FileText },
    { label: 'Interview Schedules', path: '/admin/interviews', icon: Calendar },
    { label: 'Campus Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Accreditation Reports', path: '/admin/reports', icon: Sparkles },
  ];

  const navItems =
    currentRole === 'student'
      ? studentNav
      : currentRole === 'recruiter'
      ? recruiterNav
      : adminNav;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen bg-surface border-r border-border flex flex-col justify-between transition-all duration-300 ease-in-out select-none',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-border/80">
            <NavLink
              to={`/${currentRole}/dashboard`}
              className="flex items-center gap-2.5 overflow-hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-dark to-brand flex items-center justify-center text-white shadow-sm shadow-brand/30 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-base text-primary-text tracking-tight font-sans">
                    Campus<span className="text-brand">Flow</span>
                  </span>
                  <span className="text-[10px] text-muted-text -mt-0.5 tracking-wider uppercase font-semibold">
                    {currentRole} Portal
                  </span>
                </div>
              )}
            </NavLink>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1 rounded-md text-muted-text hover:text-primary-text hover:bg-surface-secondary transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-4 px-3 space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-muted-text uppercase tracking-wider mb-2">
                Menu
              </p>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== `/${currentRole}/dashboard` &&
                  location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-button text-sm font-medium transition-all group relative',
                    isActive
                      ? 'bg-brand text-white shadow-sm shadow-brand/20 font-semibold'
                      : 'text-secondary-text hover:text-primary-text hover:bg-surface-secondary'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-text'
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {!isCollapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-brand-surface text-brand px-1.5 py-0.5 rounded-badge">
                      {item.badge}
                    </span>
                  )}

                  {!isCollapsed && item.unreadBadge !== undefined && item.unreadBadge > 0 && (
                    <span className="ml-auto text-[11px] font-semibold bg-brand text-white px-1.5 py-0.2 rounded-full min-w-5 text-center">
                      {item.unreadBadge}
                    </span>
                  )}

                  {/* Collapsed dot indicators */}
                  {isCollapsed && item.unreadBadge !== undefined && item.unreadBadge > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom User & Persona Info */}
        <div className="p-3 border-t border-border/80">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-card bg-surface-secondary/70 border border-border/50',
              isCollapsed && 'justify-center p-1.5'
            )}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-brand/20 flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-primary-text truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-muted-text truncate capitalize">
                  {currentUser.companyName || currentUser.collegeName || currentRole}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

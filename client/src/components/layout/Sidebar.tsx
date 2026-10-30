import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Layers,
  LogOut,
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
  const { currentRole, currentUser, notifications, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const studentNav: NavItem[] = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Explore Opportunities', path: '/student/opportunities', icon: Compass },
    { label: 'My Applications', path: '/student/applications', icon: FileText },
    { label: 'Interview Schedule', path: '/student/interviews', icon: Calendar },
    { label: 'Profile & Resume', path: '/student/profile', icon: UserCheck },
    { label: 'Notifications', path: '/student/notifications', icon: Bell, unreadBadge: unreadCount },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const recruiterNav: NavItem[] = [
    { label: 'Recruiter Overview', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'Job Postings', path: '/recruiter/jobs', icon: Briefcase },
    { label: 'Applicant Pipeline', path: '/recruiter/applicants', icon: Users },
    { label: 'Interview Schedule', path: '/recruiter/interviews', icon: Calendar },
    { label: 'Company Profile', path: '/recruiter/company', icon: Building2 },
    { label: 'Hiring Analytics', path: '/recruiter/analytics', icon: BarChart3 },
  ];

  const adminNav: NavItem[] = [
    { label: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Student Directory', path: '/admin/students', icon: GraduationCap },
    { label: 'Corporate Partners', path: '/admin/companies', icon: Building2 },
    { label: 'Placement Drives', path: '/admin/drives', icon: Layers },
    { label: 'Application Oversight', path: '/admin/applications', icon: FileText },
    { label: 'Interview Monitoring', path: '/admin/interviews', icon: Calendar },
    { label: 'Campus Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'NIRF / NAAC Reports', path: '/admin/reports', icon: Sparkles },
  ];

  const navItems =
    currentRole === 'student'
      ? studentNav
      : currentRole === 'recruiter'
      ? recruiterNav
      : adminNav;

  const roleLabels = {
    student: 'Student Workspace',
    recruiter: 'Talent Acquisition',
    admin: 'Placement Cell Admin',
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell: Fixed Desktop & Slide-Out Mobile Drawer */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen bg-[#F8FAFC] text-slate-800 border-r border-slate-200 flex flex-col transition-all duration-200 ease-out select-none overflow-hidden flex-shrink-0',
          isCollapsed ? 'w-20' : 'w-[256px]',
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Header & Branding (Fixed height, pinned) */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 flex-shrink-0">
          <NavLink
            to={`/${currentRole}/dashboard`}
            className="flex items-center gap-3 overflow-hidden group"
            onClick={() => setIsMobileOpen(false)}
          >
            {/* Distinctive Logo Symbol: Precision Teal Emblem */}
            <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white border border-teal-800 shadow-xs flex-shrink-0 group-hover:bg-teal-600 transition-colors">
              <span className="font-extrabold text-sm tracking-tight">CF</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 tracking-tight leading-none">
                    CampusFlow
                  </span>
                  <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-1 py-0.2 rounded border border-teal-200 font-semibold">
                    v3.1
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 truncate leading-none font-normal">
                  {roleLabels[currentRole]}
                </span>
              </div>
            )}
          </NavLink>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links — Independent Scroll Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Workspace
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
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors relative group',
                  isActive
                    ? 'bg-slate-200/80 text-slate-900 font-semibold shadow-2xs border border-slate-300/50'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-700'
                  )}
                />
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="ml-auto text-[10px] font-medium uppercase tracking-wider bg-teal-50 text-teal-800 px-1.5 py-0.2 rounded border border-teal-200">
                    {item.badge}
                  </span>
                )}

                {!isCollapsed && item.unreadBadge !== undefined && item.unreadBadge > 0 && (
                  <span className="ml-auto text-[11px] font-mono font-semibold bg-teal-700 text-white px-1.5 py-0.2 rounded-full min-w-5 text-center">
                    {item.unreadBadge}
                  </span>
                )}

                {isCollapsed && item.unreadBadge !== undefined && item.unreadBadge > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-600" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User Persona Card (Pinned at bottom) */}
        <div className="p-3 border-t border-slate-200/80 flex-shrink-0 bg-[#F8FAFC]">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors',
              isCollapsed && 'justify-center p-1.5'
            )}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                  {currentUser.role === 'student'
                    ? (currentUser as any).rollNo || currentUser.email
                    : (currentUser as any).company || (currentUser as any).designation || 'admin'}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

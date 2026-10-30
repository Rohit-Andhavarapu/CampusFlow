import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  CheckCircle2,
  Calendar,
  Briefcase,
  Layers,
  ChevronDown,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { cn } from '../../utils/cn';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    currentRole,
    currentUser,
    switchRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
    navigate(`/${role}/dashboard`);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-md text-secondary-text hover:text-primary-text hover:bg-surface-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (Linear style subtle search) */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 text-muted-text absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search roles, companies, applications... (Ctrl+K)"
            className="w-72 lg:w-96 pl-9 pr-3 py-1.5 text-xs bg-surface-secondary/70 border border-border/80 rounded-button text-primary-text placeholder:text-muted-text focus-ring transition-all"
          />
        </div>
      </div>

      {/* Right: Quick Role Switcher, Notifications, User Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* JUDGES / DEMO ROLE SWITCHER PILL */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-brand/20 text-brand text-xs font-semibold hover:bg-brand/10 transition-all shadow-subtle"
            title="Switch demo role perspective"
          >
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="capitalize hidden sm:inline">Role: {currentRole}</span>
            <span className="capitalize sm:hidden">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-card shadow-dropdown p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-border/60">
                <p className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">
                  Select Active Persona
                </p>
              </div>
              <button
                onClick={() => handleSelectRole('student')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-button transition-colors',
                  currentRole === 'student'
                    ? 'bg-brand text-white font-semibold'
                    : 'text-primary-text hover:bg-surface-secondary'
                )}
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <div className="text-left">
                    <p className="leading-tight">Student</p>
                    <p className={cn("text-[10px]", currentRole === 'student' ? 'text-white/80' : 'text-muted-text')}>
                      Aarav Sharma (B.Tech)
                    </p>
                  </div>
                </div>
                {currentRole === 'student' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleSelectRole('recruiter')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-button transition-colors',
                  currentRole === 'recruiter'
                    ? 'bg-brand text-white font-semibold'
                    : 'text-primary-text hover:bg-surface-secondary'
                )}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <div className="text-left">
                    <p className="leading-tight">Recruiter</p>
                    <p className={cn("text-[10px]", currentRole === 'recruiter' ? 'text-white/80' : 'text-muted-text')}>
                      Priya Nair (NovaTech)
                    </p>
                  </div>
                </div>
                {currentRole === 'recruiter' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleSelectRole('admin')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-button transition-colors',
                  currentRole === 'admin'
                    ? 'bg-brand text-white font-semibold'
                    : 'text-primary-text hover:bg-surface-secondary'
                )}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <div className="text-left">
                    <p className="leading-tight">Placement Admin</p>
                    <p className={cn("text-[10px]", currentRole === 'admin' ? 'text-white/80' : 'text-muted-text')}>
                      Dr. Rajesh Rao (Placement Head)
                    </p>
                  </div>
                </div>
                {currentRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-button text-secondary-text hover:text-primary-text hover:bg-surface-secondary transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-card shadow-dropdown z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3.5 border-b border-border/80 flex items-center justify-between bg-surface-secondary/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary-text">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] font-bold bg-brand text-white px-1.5 py-0.2 rounded-full">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-brand hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-text">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setIsNotifOpen(false);
                      }}
                      className={cn(
                        'p-3.5 text-xs transition-colors cursor-pointer hover:bg-surface-secondary/70 flex gap-3',
                        !n.read && 'bg-brand-surface/40'
                      )}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {n.type === 'interview' ? (
                          <Calendar className="w-4 h-4 text-warning" />
                        ) : n.type === 'application' ? (
                          <Briefcase className="w-4 h-4 text-brand" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-info" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-primary-text truncate">{n.title}</p>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                        </div>
                        <p className="text-secondary-text mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Identity Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/80">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover border border-border"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-primary-text leading-tight">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-muted-text leading-tight">
              {currentUser.collegeId || currentUser.companyTitle || 'CampusFlow User'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

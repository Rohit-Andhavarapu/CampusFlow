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
    switchRole(role, false);
    setIsRoleDropdownOpen(false);
    navigate(`/${role}/dashboard`);
  };

  const roleMeta = {
    student: { title: 'Student', sub: 'Aarav Sharma • Class of 2026' },
    recruiter: { title: 'Recruiter', sub: 'Priya Nair • NovaTech Systems' },
    admin: { title: 'Placement Admin', sub: 'Dr. Rajesh Rao • Head of T&P' },
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-surface/90 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Global Search input */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-ink-600 hover:text-ink-950 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search roles, companies, or verified records..."
            className="w-72 lg:w-80 pl-8 pr-12 py-1.5 text-xs bg-slate-100/70 border border-slate-200 rounded-button text-ink-950 placeholder:text-slate-400 focus-ring-refined transition-all"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-surface border border-slate-200 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Demo Role Switcher, Notifications, Persona Chip */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* DEMO / JUDGES PERSONA SWITCHER */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="btn-press flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-ink-800 text-xs font-medium hover:border-slate-300 hover:bg-slate-200/50 transition-colors"
            title="Switch demo role perspective"
          >
            <span className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0 animate-pulse" />
            <span className="capitalize">{roleMeta[currentRole].title}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface rounded-card shadow-elevation-3 border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 origin-top-right duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Demo Perspectives
                </p>
                <p className="text-[11px] text-slate-500">
                  Switch viewpoint instantly to test role-based access.
                </p>
              </div>

              {(['student', 'recruiter', 'admin'] as UserRole[]).map((role) => {
                const isCurrent = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleSelectRole(role)}
                    className={cn(
                      'w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 transition-colors',
                      isCurrent && 'bg-teal-50/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                        isCurrent ? 'bg-teal-600' : 'bg-transparent border border-slate-300'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            'text-xs font-semibold',
                            isCurrent ? 'text-teal-900' : 'text-ink-950'
                          )}
                        >
                          {roleMeta[role].title}
                        </p>
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-medium text-teal-700 bg-teal-50 px-1 rounded border border-teal-200">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {roleMeta[role].sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="btn-press p-2 rounded-full text-slate-500 hover:text-ink-950 hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-surface" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-surface rounded-card shadow-elevation-3 border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right duration-150">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-ink-950">Notifications</h4>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full font-semibold">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-[11px] text-teal-700 hover:text-teal-800 font-medium hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={cn(
                        'p-3 hover:bg-slate-50 transition-colors cursor-pointer text-left',
                        !notif.read && 'bg-teal-50/30'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-ink-950 leading-snug">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {notif.createdAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Persona Chip */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-ink-950 leading-none">
              {currentUser.name}
            </p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5 leading-none">
              {currentUser.role === 'student'
                ? (currentUser as any).rollNo
                : (currentUser as any).designation || 'Placement Office'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

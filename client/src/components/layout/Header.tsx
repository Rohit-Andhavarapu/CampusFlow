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
    switchRole(role, false); // explicit user click
    setIsRoleDropdownOpen(false);
    navigate(`/${role}/dashboard`);
  };

  const roleMeta = {
    student: { title: 'Student', sub: 'Aarav Sharma • Class of 2026' },
    recruiter: { title: 'Recruiter', sub: 'Priya Nair • NovaTech Systems' },
    admin: { title: 'Placement Admin', sub: 'Dr. Rajesh Rao • Head of T&P' },
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Global Search input */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-ink-600 hover:text-ink-950 hover:bg-surface-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search roles, companies, or verified records..."
            className="w-72 lg:w-80 pl-8 pr-12 py-1.5 text-xs bg-surface-secondary/70 border border-border rounded-button text-ink-950 placeholder:text-ink-400 focus-ring-refined transition-all"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono text-ink-400 bg-surface border border-border rounded">
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
            className="btn-press flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-secondary border border-border text-ink-800 text-xs font-medium hover:border-border-strong hover:bg-slate-200/50 transition-colors"
            title="Switch demo role perspective"
          >
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span className="font-semibold text-ink-950 capitalize">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-ink-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-card shadow-dropdown p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-border">
                <p className="text-[10px] font-mono font-medium text-ink-400 uppercase tracking-wider">
                  Switch Active Persona
                </p>
              </div>

              {(['student', 'recruiter', 'admin'] as UserRole[]).map((role) => {
                const isCurrent = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleSelectRole(role)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-xs rounded-button transition-colors text-left my-0.5',
                      isCurrent
                        ? 'bg-brand text-white font-medium'
                        : 'text-ink-800 hover:bg-surface-secondary'
                    )}
                  >
                    <div>
                      <p className="font-semibold leading-tight capitalize">{roleMeta[role].title}</p>
                      <p
                        className={cn(
                          'text-[10px] leading-tight mt-0.5',
                          isCurrent ? 'text-white/80' : 'text-ink-400'
                        )}
                      >
                        {roleMeta[role].sub}
                      </p>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-button text-ink-600 hover:text-ink-950 hover:bg-surface-secondary transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-card shadow-dropdown z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-border flex items-center justify-between bg-surface-subtle">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink-950">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] font-mono font-semibold bg-brand text-white px-1.5 py-0.2 rounded-full">
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

              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-ink-400">
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
                        'p-3 text-xs transition-colors cursor-pointer hover:bg-surface-secondary flex gap-3',
                        !n.read && 'bg-brand-surface/40'
                      )}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {n.type === 'interview' ? (
                          <Calendar className="w-3.5 h-3.5 text-warning" />
                        ) : n.type === 'application' ? (
                          <Briefcase className="w-3.5 h-3.5 text-brand" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-info" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-ink-950 truncate">{n.title}</p>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                        </div>
                        <p className="text-ink-600 mt-0.5 line-clamp-2 leading-relaxed">
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
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover border border-border"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-ink-950 leading-tight">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-ink-500 leading-tight">
              {currentUser.collegeId || currentUser.companyTitle || 'CampusFlow'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

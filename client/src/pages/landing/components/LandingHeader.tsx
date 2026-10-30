import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UserRole } from '../../../types';

export const LandingHeader: React.FC = () => {
  const { currentRole, currentUser, isAuthenticated, switchRole, logout } = useApp();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    switchRole(role, false);
    setIsRoleDropdownOpen(false);
    navigate(`/${role}/dashboard`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Overview', href: '#hero' },
    { label: 'Architecture', href: '#story' },
    { label: 'Three Worlds', href: '#roles' },
    { label: 'Eligibility Sandbox', href: '#eligibility' },
    { label: 'Career Journey', href: '#journey' },
    { label: 'Ecosystem', href: '#ecosystem' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060B12]/90 backdrop-blur-xl shadow-lg shadow-black/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0F766E] to-[#72F4D1] p-0.5 shadow-lg shadow-[#0F766E]/30 group-hover:shadow-[#72F4D1]/40 transition-shadow">
            <div className="w-full h-full bg-[#060B12] rounded-[6px] flex items-center justify-center">
              <span className="text-[#72F4D1] font-black text-sm tracking-tighter">CF</span>
            </div>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-white tracking-tight font-sans">
            Campus<span className="text-[#72F4D1]">Flow</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-300 hover:text-[#72F4D1] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Role Switcher & Auth Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Hackathon Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
              title="Switch demo persona"
            >
              <span className="w-2 h-2 rounded-full bg-[#72F4D1] animate-pulse" />
              <span className="capitalize font-semibold text-xs">Demo: {currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0B111B] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-xs text-[#72F4D1] uppercase font-bold">Judges Demo Switcher</p>
                  <p className="text-xs text-slate-400">Instantly switch role viewpoint.</p>
                </div>
                {(['student', 'recruiter', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleSelectRole(r)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <span className="capitalize">{r === 'admin' ? 'Placement Admin' : r}</span>
                    <span className="text-xs text-slate-400">
                      {r === 'student' ? 'Aarav' : r === 'recruiter' ? 'Priya' : 'Dr. Rao'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate(`/${currentRole}/dashboard`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-bold border border-[#72F4D1]/40 transition-all active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                title="Log Out of Supabase Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-bold border border-[#72F4D1]/40 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0B111B] border-b border-white/10 px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-300 hover:text-[#72F4D1]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              to={`/${currentRole}/dashboard`}
              className="w-full text-center py-2.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold"
            >
              Enter Workspace ({currentRole})
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="text-center py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-center py-2 rounded-xl bg-white/10 text-white text-xs font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  X,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  User as UserIcon,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const LandingHeader: React.FC = () => {
  const { currentRole, currentUser, isAuthenticated, logout } = useApp();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'For Students', href: '#students' },
    { label: 'For Recruiters', href: '#recruiters' },
    { label: 'Eligibility', href: '#eligibility' },
    { label: 'Journey', href: '#journey' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060B12]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] border border-[#72F4D1]/40 flex items-center justify-center transition-transform group-hover:scale-105">
            <ShieldCheck className="w-4 h-4 text-[#72F4D1]" />
          </div>
          <span className="text-base sm:text-lg font-extrabold text-white tracking-tight font-sans">
            Campus<span className="text-[#72F4D1]">Flow</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Clean Production Authentication Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/${currentRole}/dashboard`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold border border-[#72F4D1]/30 transition-all active:scale-[0.98]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors active:scale-95"
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
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold border border-[#72F4D1]/40 transition-all active:scale-[0.98]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0B111B] border-b border-white/10 px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(`/${currentRole}/dashboard`);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-[#0F766E] text-white text-xs font-semibold"
                >
                  Open Dashboard ({currentRole})
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-white/5 text-rose-300 text-xs font-semibold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

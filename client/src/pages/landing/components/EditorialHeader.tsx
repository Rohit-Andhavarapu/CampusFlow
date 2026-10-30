import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { Menu, X, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const EditorialHeader: React.FC = () => {
  const { isAuthenticated, currentRole, logout } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-[#E8E4DC] shadow-[0_4px_20px_-4px_rgba(20,67,42,0.05)]'
          : 'bg-[#FAF8F5] border-[#ECE8E0]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Monogram Brand Crest */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-9 h-9 rounded-md bg-[#14432A] flex items-center justify-center text-[#EBE5D8] font-serif-prestige font-semibold text-lg shadow-sm border border-[#0F3521] transition-transform group-hover:scale-105">
            CF
          </div>
          <div>
            <span className="font-serif-prestige font-semibold text-xl tracking-tight text-[#14432A] block leading-none">
              CampusFlow
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#6B7280] font-semibold block mt-1">
              University Talent Folio
            </span>
          </div>
        </Link>

        {/* Editorial Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-[13px] font-medium text-[#4B5563]">
          <a
            href="#platform"
            className="hover:text-[#14432A] transition-colors"
          >
            The Platform
          </a>
          <a
            href="#dossier"
            className="hover:text-[#14432A] transition-colors"
          >
            Credential Dossier
          </a>
          <a
            href="#cutoff"
            className="hover:text-[#14432A] transition-colors"
          >
            Cutoff Matching
          </a>
          <a
            href="#journey"
            className="hover:text-[#14432A] transition-colors"
          >
            Career Journey
          </a>
          <a
            href="#three-worlds"
            className="hover:text-[#14432A] transition-colors"
          >
            Workstations
          </a>
          <a
            href="#preview"
            className="hover:text-[#14432A] transition-colors"
          >
            Live Preview
          </a>
        </nav>

        {/* Authenticated Gateway / Login Controls */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={`/${currentRole}/dashboard`}
                className="text-[13px] font-semibold text-[#14432A] bg-[#14432A]/8 border border-[#14432A]/20 hover:bg-[#14432A]/15 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[#14432A]" />
                <span>Go to Dashboard</span>
              </Link>
              <button
                onClick={() => logout()}
                className="text-[13px] font-medium text-[#6B7280] hover:text-[#14432A] px-2 py-1.5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-[13px] font-medium text-[#4B5563] hover:text-[#14432A] px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-[13px] font-semibold text-white bg-[#14432A] hover:bg-[#0F3521] px-4 sm:px-5 py-2.5 rounded-md transition-all shadow-sm flex items-center gap-1.5 active:scale-95 border border-[#0F3521]"
              >
                <span>Student Signup</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#14432A] hover:bg-[#14432A]/5 rounded-md transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E4DC] bg-[#FAF8F5] px-6 py-5 space-y-4 shadow-lg animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#4B5563]">
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#14432A] font-semibold"
            >
              The Platform
            </a>
            <a
              href="#dossier"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#14432A]"
            >
              Credential Dossier
            </a>
            <a
              href="#cutoff"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#14432A]"
            >
              Cutoff Matching
            </a>
            <a
              href="#journey"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#14432A]"
            >
              Career Journey
            </a>
            <a
              href="#three-worlds"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#14432A]"
            >
              Workstations
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#14432A]"
            >
              Live Preview
            </a>
          </nav>

          <div className="pt-4 border-t border-[#E8E4DC] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/${currentRole}/dashboard`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#14432A] text-white text-center text-sm font-semibold rounded-md shadow-sm"
                >
                  Return to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-[#6B7280]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] text-center text-sm font-semibold text-[#14432A] rounded-md"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#14432A] text-white text-center text-sm font-semibold rounded-md shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Student Signup</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

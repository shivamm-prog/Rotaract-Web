import React, { useState } from 'react';
import { Menu, X, LogIn, LayoutDashboard, Sparkles, ChevronRight, User } from 'lucide-react';
import { District3131Logo } from '../logos/District3131Logo';
import { RotaractRSCOELogo } from '../logos/RotaractRSCOELogo';
import { useAuth } from '../../context/AuthContext';

interface PublicHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Team', path: '/team' },
    { label: 'Events', path: '/events' },
    { label: 'Projects', path: '/projects' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Join Us', path: '/join-us' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-red-900/60 bg-[#800000] text-white shadow-lg backdrop-blur-md">
      {/* Top micro-banner */}
      <div className="bg-[#660000] text-red-100 text-[11px] sm:text-xs py-1 px-4 sm:px-8 border-b border-red-950/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">RIY 2026–27 Theme:</span>
            <span className="text-red-200 font-semibold tracking-wider">“कर्म • कौशलम् • कर्तव्य”</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-red-200 font-medium">
            <span>District 3131</span>
            <span>•</span>
            <span>9th Year of Excellence</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Top-Left: Rotaract District 3131 Logo */}
          <div
            onClick={() => handleLinkClick('/')}
            className="cursor-pointer flex-shrink-0 transition-opacity hover:opacity-90 py-1"
            title="Rotaract District 3131"
          >
            <District3131Logo variant="white" className="h-10 sm:h-12" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-[#800000] shadow-sm font-bold'
                      : 'text-red-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Top-Right: Rotaract Club of RSCOE branding logo + Login/Dashboard button */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* RSCOE Branding Logo */}
            <div
              onClick={() => handleLinkClick('/')}
              className="cursor-pointer hidden sm:flex items-center transition-opacity hover:opacity-90"
              title="Rotaract Club of RSCOE"
            >
              <RotaractRSCOELogo variant="white" className="h-10 sm:h-11" showSubtext={false} />
            </div>

            {/* Portal Action Button */}
            {currentUser ? (
              <button
                onClick={() => handleLinkClick('/dashboard')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-[#800000] hover:bg-red-50 text-xs sm:text-sm font-extrabold shadow-md transition-all active:scale-95 border border-white/80"
              >
                <LayoutDashboard className="w-4 h-4 text-[#800000]" />
                <span className="hidden md:inline">Dashboard</span>
                <span className="md:hidden">Portal</span>
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('/login')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-[#800000] hover:bg-red-50 text-xs sm:text-sm font-extrabold shadow-md transition-all active:scale-95 border border-white/80"
              >
                <LogIn className="w-4 h-4 text-[#800000]" />
                <span>Portal Login</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-red-200 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-red-900 bg-[#730000] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="py-2 mb-2 border-b border-red-800/80">
            <RotaractRSCOELogo variant="white" className="h-10" showSubtext={true} />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition ${
                    active
                      ? 'bg-white text-[#800000] font-bold shadow-xs'
                      : 'text-red-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-red-800/80">
            {currentUser ? (
              <button
                onClick={() => handleLinkClick('/dashboard')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#800000] font-bold text-sm shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Management Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('/login')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#800000] font-bold text-sm shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Club Portal Login (Members / BOD / Core)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


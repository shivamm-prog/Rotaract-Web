import React from 'react';
import { Menu, Plus, Search, LogOut, Shield, Layers, User } from 'lucide-react';
import { ActiveNavTab } from '../types/rotaract';
import { useAuth } from '../context/AuthContext';

interface TopHeaderProps {
  activeTab: ActiveNavTab;
  onOpenMobileMenu: () => void;
  onOpenCreateEvent: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onReturnToWebsite?: () => void;
}

const TAB_TITLES: Record<ActiveNavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard Overview',
    subtitle: 'Real-time activities, statistics, and schedule at a glance',
  },
  calendar: {
    title: 'Organizational Calendar',
    subtitle: 'Monthly and daily view of all club projects and meetings',
  },
  events: {
    title: 'Event Management',
    subtitle: 'Manage upcoming, live, and past activities of RAC RSCOE',
  },
  create_event: {
    title: 'Create New Event',
    subtitle: 'Register an upcoming project, seminar, camp, or meeting',
  },
  projects: {
    title: 'Club Projects & Flagships',
    subtitle: 'Manage and showcase community initiatives and project reports',
  },
  achievements: {
    title: 'Achievements & Recognition',
    subtitle: 'Record book entries, district trophies, and leadership honors',
  },
  gallery: {
    title: 'Media & Photo Gallery',
    subtitle: 'Upload and manage event albums, films, and impact photography',
  },
  approvals: {
    title: 'BOD Registrations & Approvals',
    subtitle: 'Review and approve Board of Directors applicants',
  },
  members: {
    title: 'Club Roster & Roles',
    subtitle: 'Board of Directors, Committee Chairs, and Access Management',
  },
  reports: {
    title: 'Activity Reports & Analytics',
    subtitle: 'District reporting metrics, avenue distributions, and impacts',
  },
  settings: {
    title: 'Club Settings & Cloud',
    subtitle: 'Cloud Firestore storage, backup migration, and configuration',
  },
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenCreateEvent,
  searchQuery,
  onSearchChange,
  onReturnToWebsite,
}) => {
  const {
    userProfile,
    signOut,
    isCoreTeam,
    assignedAvenue,
    simulatedRole,
    setSimulatedRole,
  } = useAuth();

  const current = TAB_TITLES[activeTab] || {
    title: 'Rotaract Club of RSCOE',
    subtitle: 'Management Platform',
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-[#4d0000] bg-[#660000] px-4 sm:px-6 lg:px-8 py-2 text-white shadow-xs gap-3">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-red-200 hover:bg-[#7a0a0a] hover:text-white lg:hidden"
          aria-label="Open sidebar navigation"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
            {current.title}
          </h1>
          <p className="hidden text-sm text-red-200 sm:block font-medium mt-0.5">{current.subtitle}</p>
        </div>
      </div>

      {/* Right: Search, Role Status Badge, Create Event, and Logout */}
      <div className="flex items-center gap-2 sm:gap-3.5 flex-wrap justify-end">
        {/* Global Search Bar */}
        <div className="relative w-36 sm:w-60">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-200" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events, venues..."
            className="w-full rounded-xl border border-red-400/40 bg-[#520000] py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-red-300 font-medium focus:border-white focus:bg-[#470000] focus:outline-none shadow-xs"
          />
        </div>

        {/* Create Event Quick Action */}
        <button
          type="button"
          onClick={onOpenCreateEvent}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-black text-[#660000] shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Event</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* Switch back to Public Website button */}
        {onReturnToWebsite && (
          <button
            type="button"
            onClick={onReturnToWebsite}
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-red-300/40 bg-[#520000] px-3 py-2 text-xs font-bold text-red-100 hover:bg-[#470000] hover:text-white transition"
          >
            <span>Website</span>
          </button>
        )}

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => signOut()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/40 bg-[#520000] text-red-200 hover:bg-[#7a0a0a] hover:text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
          title="Sign out of management portal"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

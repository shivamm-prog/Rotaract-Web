import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  PlusCircle,
  Users,
  FileBarChart,
  Settings,
  X,
  Award,
  Globe,
  Briefcase,
  Trophy,
  Image,
  UserCheck,
  ArrowLeft,
} from 'lucide-react';
import { ActiveNavTab } from '../types/rotaract';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  upcomingCount: number;
  liveCount: number;
  pendingApprovalsCount?: number;
  onReturnToWebsite?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  upcomingCount,
  liveCount,
  pendingApprovalsCount = 0,
  onReturnToWebsite,
}) => {
  const { userProfile, isCoreTeam, isBOD, isMember, assignedAvenue } = useAuth();

  const navItems: {
    id: ActiveNavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    coreOnly?: boolean;
    hideForMember?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    {
      id: 'events',
      label: 'Events',
      icon: Layers,
      badge: liveCount > 0 ? liveCount : upcomingCount,
    },
    { id: 'create_event', label: 'Create Event', icon: PlusCircle, hideForMember: true },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'gallery', label: 'Gallery', icon: Image },
    {
      id: 'approvals',
      label: 'BOD Approvals',
      icon: UserCheck,
      badge: pendingApprovalsCount,
      coreOnly: true,
    },
    { id: 'members', label: 'Club Roster', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileBarChart, hideForMember: true },
    { id: 'settings', label: 'Settings', icon: Settings, coreOnly: true },
  ];

  const handleNavClick = (tabId: ActiveNavTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container: Deep Dark Red */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#5c0000] text-white border-r border-[#420000] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#470000] px-5 bg-[#4d0000]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#5c0000] font-black shadow-xs">
              <Award className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-200">
                Rotaract Club of
              </div>
              <div className="text-lg font-black tracking-tight text-white leading-tight">
                RSCOE
              </div>
              <div className="text-[11px] text-red-200 tracking-wide font-medium">
                Dist. 3131 • 2026–27
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded p-1 text-red-200 hover:bg-[#6b0606] hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Back to public website link */}
        {onReturnToWebsite && (
          <div className="p-3 border-b border-[#470000] bg-[#420000]">
            <button
              onClick={onReturnToWebsite}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Public Website</span>
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-3 py-3 overflow-y-auto">
          {navItems
            .filter((item) => {
              if (item.coreOnly && !isCoreTeam) return false;
              if (item.hideForMember && isMember) return false;
              return true;
            })
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#5c0000] shadow-md'
                      : 'text-red-100 hover:bg-[#730808] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-[#5c0000]' : 'text-red-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                        isActive
                          ? 'bg-[#5c0000] text-white'
                          : 'bg-white text-[#5c0000]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>

        {/* User Role Card */}
        <div className="border-t border-[#470000] p-4 bg-[#4d0000]/60 space-y-2">
          {userProfile ? (
            <div className="rounded-xl border border-red-300/30 bg-[#3d0000] p-3 text-xs text-white">
              <div className="flex items-center justify-between">
                <span className="font-black truncate max-w-[130px]">{userProfile.displayName}</span>
                <span className="rounded bg-white px-2 py-0.5 text-[9px] font-black uppercase text-[#5c0000]">
                  {isCoreTeam ? 'Core Team' : isBOD ? 'BOD' : 'Member'}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-red-200">
                {isCoreTeam ? (
                  <span className="text-white font-bold">Full Admin • All Avenues</span>
                ) : isBOD ? (
                  <span>
                    Avenue: <strong className="text-white">{assignedAvenue}</strong>
                    {userProfile.bodStatus === 'pending' && (
                      <span className="block text-amber-300 font-bold mt-0.5">⚠️ Pending Core Approval</span>
                    )}
                  </span>
                ) : (
                  <span>General Club Member</span>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-red-300/30 bg-[#3d0000] p-2.5 text-xs text-red-200">
              Browsing as Guest
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

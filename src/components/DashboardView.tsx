import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Radio,
  ArrowRight,
  PlusCircle,
  FileText,
  CalendarDays,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  Trophy,
  Image,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { RotaractEvent, ActiveNavTab } from '../types/rotaract';
import {
  formatFullDate,
  formatReadableDate,
  formatTime12h,
  getEventEffectiveStatus,
  getTodayString,
  MONTH_NAMES,
} from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';

interface DashboardViewProps {
  events: RotaractEvent[];
  onNavigateToTab: (tab: ActiveNavTab) => void;
  onOpenEventDetails: (event: RotaractEvent) => void;
  onSelectEventDateInCalendar: (dateStr: string) => void;
  pendingApprovalsCount?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  onNavigateToTab,
  onOpenEventDetails,
  onSelectEventDateInCalendar,
  pendingApprovalsCount = 0,
}) => {
  const { userProfile, isCoreTeam, isBOD, isMember, assignedAvenue } = useAuth();
  const todayStr = getTodayString();

  // Calculate statistics
  const totalEventsCount = events.length;
  const liveEvents = events.filter((e) => getEventEffectiveStatus(e) === 'live');
  const upcomingEvents = events
    .filter((e) => getEventEffectiveStatus(e) === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date));
  const completedEvents = events
    .filter((e) => getEventEffectiveStatus(e) === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));

  const todayEvents = events.filter((e) => e.date === todayStr);

  // Compact monthly calendar calculation for current month
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasEvent = events.some((e) => e.date === dStr);
    const isToday = dStr === todayStr;
    calendarDays.push({ dayNumber: d, dateStr: dStr, hasEvent, isToday });
  }

  return (
    <div className="space-y-6">
      {/* 1. ROLE-SPECIFIC GREETING & ANNOUNCEMENT BANNER */}
      {isCoreTeam && pendingApprovalsCount > 0 && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white flex-shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-900">
                Action Required: {pendingApprovalsCount} Pending BOD Registration(s)
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                New Board of Directors applicants are awaiting Core Team review and avenue authorization.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('approvals')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition shrink-0"
          >
            <span>Review Applicants</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isBOD && (
        <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#990000] text-white flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#990000]">
                  Director Dashboard
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    userProfile?.bodStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {userProfile?.bodStatus || 'Active'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Welcome, {userProfile?.displayName || 'Director'}
              </h3>
              <p className="text-xs text-slate-600">
                Authorized Avenue: <strong>{assignedAvenue || 'All Avenues'}</strong>. You can view all club activities and manage events/projects within your assigned domain.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('create_event')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold uppercase tracking-wider shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create {assignedAvenue} Event</span>
          </button>
        </div>
      )}

      {/* MEMBER AREA (Requirement 12) */}
      {isMember && (
        <div className="rounded-3xl border-2 border-red-200 bg-gradient-to-br from-white via-red-50/40 to-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#990000] to-[#6b0000] text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-red-100 flex-shrink-0">
                {userProfile?.displayName
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'RT'}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-[#990000] text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Official Member Credential</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{userProfile?.displayName}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {userProfile?.email} • Rotaract District 3131 • RSCOE Chapter
                </p>
                <p className="text-xs font-bold text-[#990000] pt-1">
                  RIY 2026–27 Theme: “कर्म • कौशलम् • कर्तव्य”
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => onNavigateToTab('calendar')}
                className="px-4 py-2 rounded-xl bg-[#990000] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#800000] transition"
              >
                Browse Club Calendar
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab('projects')}
                className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition"
              >
                Explore Projects
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATISTICS CARDS ROW */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Events */}
        <div className="rounded-2xl border border-red-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5c0000]">
              Total Events
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-[#5c0000]">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {totalEventsCount}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Rotary Year 2026–27</p>
          </div>
        </div>

        {/* Live Events */}
        <div className="rounded-2xl border border-red-300 bg-white p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-[#800000]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#800000] flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#800000]"></span>
              </span>
              Live Events
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-[#800000]">
              <Radio className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#800000]">
              {liveEvents.length}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Happening today</p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-2xl border border-red-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5c0000]">
              Upcoming
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-[#5c0000]">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {upcomingEvents.length}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Scheduled on calendar</p>
          </div>
        </div>

        {/* Completed Events */}
        <div className="rounded-2xl border border-red-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Completed
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {completedEvents.length}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Archived & reported</p>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS & WEBSITE MANAGEMENT BAR (Requirement 12) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-400/40 bg-[#660000] p-4 text-white">
        <div>
          <h2 className="text-sm font-bold text-white">Platform Quick Actions</h2>
          <p className="text-xs text-red-200">Execute frequent administrative workflows with one click</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isMember && (
            <button
              type="button"
              onClick={() => onNavigateToTab('create_event')}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-[#5c0000] hover:bg-red-50 shadow-xs transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Event</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigateToTab('calendar')}
            className="flex items-center gap-1.5 rounded-xl border border-white/40 bg-[#520000] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#470000] transition"
          >
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </button>

          {isCoreTeam && (
            <>
              <button
                type="button"
                onClick={() => onNavigateToTab('projects')}
                className="flex items-center gap-1.5 rounded-xl border border-white/40 bg-[#520000] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#470000] transition"
              >
                <Briefcase className="h-4 w-4" />
                <span>Projects</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab('achievements')}
                className="flex items-center gap-1.5 rounded-xl border border-white/40 bg-[#520000] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#470000] transition"
              >
                <Trophy className="h-4 w-4" />
                <span>Achievements</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab('gallery')}
                className="flex items-center gap-1.5 rounded-xl border border-white/40 bg-[#520000] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#470000] transition"
              >
                <Image className="h-4 w-4" />
                <span>Gallery</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab('approvals')}
                className="flex items-center gap-1.5 rounded-xl border border-white/40 bg-[#520000] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#470000] transition"
              >
                <UserCheck className="h-4 w-4" />
                <span>Approvals</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4. MAIN SPLIT: Today & Upcoming Events + Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Today & Upcoming */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Events Happening Today */}
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-[#800000]" />
                  Events Happening Today
                </h3>
                <p className="text-xs text-gray-500">{formatFullDate(todayStr)}</p>
              </div>
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-[#800000]">
                {todayEvents.length} Active
              </span>
            </div>

            <div className="mt-4">
              {todayEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
                  <p className="text-sm font-medium text-gray-600">No club events scheduled for today.</p>
                  <p className="text-xs text-gray-400 mt-1">Check the upcoming activities below or explore the calendar.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onOpenEventDetails(event)}
                      className="cursor-pointer rounded-xl border border-red-200 bg-red-50/50 p-4 hover:border-[#800000] transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#990000] text-white">
                          {event.avenue}
                        </span>
                        <span className="text-xs font-bold text-[#800000]">
                          {formatTime12h(event.startTime)} – {formatTime12h(event.endTime)}
                        </span>
                      </div>
                      <h4 className="mt-1 text-base font-bold text-slate-900">{event.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-1">{event.venue}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: Upcoming Events */}
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Upcoming Activities</h3>
                <p className="text-xs text-gray-500">Chronological schedule of confirmed events</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('events')}
                className="text-xs font-bold text-[#800000] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-gray-100">
              {upcomingEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  onClick={() => onOpenEventDetails(event)}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition px-2 rounded-lg"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-[#990000] tracking-wider">
                      {event.avenue}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate">{event.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatReadableDate(event.date)} • {event.venue}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 flex-shrink-0">
                    {formatTime12h(event.startTime)}
                  </span>
                </div>
              ))}

              {upcomingEvents.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No upcoming activities currently listed.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Mini Calendar & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Calendar Widget */}
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <h4 className="text-sm font-bold text-slate-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h4>
              <button
                type="button"
                onClick={() => onNavigateToTab('calendar')}
                className="text-[11px] font-bold text-[#990000] hover:underline"
              >
                Full Calendar →
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="text-[10px] font-black text-slate-400 py-1">
                  {d}
                </span>
              ))}
              {calendarDays.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="p-1.5" />;
                }
                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => {
                      onSelectEventDateInCalendar(cell.dateStr);
                      onNavigateToTab('calendar');
                    }}
                    className={`p-1.5 rounded-lg text-xs font-bold transition ${
                      cell.isToday
                        ? 'bg-[#990000] text-white shadow-xs'
                        : cell.hasEvent
                        ? 'bg-red-100 text-[#990000] font-black'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cell.dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* District & College Info */}
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#990000]">
              Affiliation & Chapter
            </span>
            <div className="space-y-1 text-xs text-slate-600">
              <p className="font-bold text-slate-900">Rotaract District 3131</p>
              <p>JSPM's Rajarshi Shahu College of Engineering</p>
              <p className="text-slate-400">Tathawade, Pune - 411033</p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-[#990000] font-bold">
              RIY 2026–27 Theme: “कर्म • कौशलम् • कर्तव्य”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

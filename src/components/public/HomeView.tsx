import React from 'react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Award,
  Users,
  Compass,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { RotaractEvent, ProjectItem, AchievementItem } from '../../types/rotaract';
import { District3131Logo } from '../logos/District3131Logo';

interface HomeViewProps {
  events: RotaractEvent[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  onNavigate: (path: string) => void;
  onSelectEvent: (event: RotaractEvent) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  events,
  projects,
  achievements,
  onNavigate,
  onSelectEvent,
}) => {
  // Sort projects: pinned first, then featured, up to 3 projects
  const featuredProjects = [...projects]
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
    .slice(0, 3);

  // Filter 2-3 upcoming or live events
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = [...events]
    .filter((e) => e.date >= todayStr || e.status === 'live' || e.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Fallback to latest events if no upcoming
  const displayedEvents =
    upcomingEvents.length > 0 ? upcomingEvents : [...events].slice(0, 3);

  // Top achievements (up to 3)
  const topAchievements = achievements.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8a0000] via-[#990000] to-[#600000] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">
        {/* Subtle background decorative geometry */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Theme & District Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-red-100 text-xs sm:text-sm font-bold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
            <span>RIY 2026–27 Theme: “कर्म • कौशलम् • कर्तव्य”</span>
            <span className="hidden sm:inline text-white/50">•</span>
            <span className="hidden sm:inline text-white">RID 3131</span>
          </div>

          {/* Main Hero Header */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-none drop-shadow-md">
            CREATE LASTING IMPACT
          </h1>

          {/* Strong Professional Subheading */}
          <p className="mt-6 text-base sm:text-xl lg:text-2xl text-red-100 max-w-3xl font-medium leading-relaxed">
            Empowering youth, serving communities, and shaping visionary leaders at JSPM's Rajarshi Shahu College of Engineering, Tathawade under Rotary International District 3131.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => onNavigate('/join-us')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#990000] font-black text-sm uppercase tracking-wider hover:bg-red-50 transition shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Join Rotaract RSCOE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/events')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-950/70 hover:bg-red-950 text-white font-bold text-sm uppercase tracking-wider border-2 border-white/40 transition hover:border-white flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore Our Events</span>
            </button>
          </div>

          {/* Official Stats (ONLY the 2 authorized stats) */}
          <div className="mt-14 grid grid-cols-2 gap-6 sm:gap-12 w-full max-w-xl border-t border-white/20 pt-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">9+</span>
              <span className="text-xs sm:text-sm font-bold text-red-200 uppercase tracking-widest mt-1">
                Years of Impact
              </span>
            </div>
            <div className="flex flex-col items-center border-l border-white/20">
              <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">100+</span>
              <span className="text-xs sm:text-sm font-bold text-red-200 uppercase tracking-widest mt-1">
                Rotaractors
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS ROTARACT? SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Global Fellowship & Community Impact
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What is Rotaract?
            </h2>
            <div className="mt-2 h-1 w-20 bg-[#990000] mx-auto rounded-full" />
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Rotaract is a global community of young adults who come together to take action, develop leadership skills, build meaningful connections, and create positive change in their communities and beyond.
            </p>
          </div>

          {/* 3 Rotaract Core Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50/60 rounded-2xl p-6 border border-red-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#990000] text-white flex items-center justify-center font-black text-base mb-4 shadow-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Community Service</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Turning ideas into meaningful service projects that address real community needs.
              </p>
            </div>

            <div className="bg-red-50/60 rounded-2xl p-6 border border-red-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#990000] text-white flex items-center justify-center font-black text-base mb-4 shadow-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Leadership & Professional Development</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Building leadership, communication, teamwork, and professional skills through hands-on experiences.
              </p>
            </div>

            <div className="bg-red-50/60 rounded-2xl p-6 border border-red-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#990000] text-white flex items-center justify-center font-black text-base mb-4 shadow-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Fellowship & Global Connections</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Connecting with like-minded young people, building friendships, and becoming part of a global Rotaract community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT CLUB PREVIEW + "Discover Our Club" */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#990000]">
                About Rotaract Club of RSCOE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                9 Glorious Years of Youth Excellence in District 3131
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Chartered at JSPM's Rajarshi Shahu College of Engineering in Tathawade, the Rotaract Club of RSCOE is one of the premier collegiate youth service bodies in Rotaract District 3131. Our record of service spans landmark humanitarian projects such as Project Saptarishi, Rotaract ki Pathshala, and Drishti, recognized by our historic induction into the India Book of Records and 13 District Awards.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/about')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#990000] hover:bg-[#800000] text-white font-bold text-sm shadow-md transition hover:translate-x-1"
                >
                  <span>Discover Our Club</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick highlight cards */}
            <div className="w-full lg:w-96 flex flex-col gap-3.5">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3.5">
                <ShieldCheck className="w-6 h-6 text-[#990000] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">India Book of Records</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Historic national recognition for institutional youth social impact drive.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3.5">
                <Award className="w-6 h-6 text-[#990000] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">13 District Awards</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Celebrated across multiple avenues in District 3131 during RIY 2025–26.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3.5">
                <Users className="w-6 h-6 text-[#990000] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dynamic Board & Core Team</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Led by President Rtr. Shrishail Chavan & Secretary Rtr. Soham Shinde.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED / UPCOMING EVENTS + "View All Events" */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#990000]">
                Real-Time Calendar
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured & Upcoming Events
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/events')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#990000] hover:text-[#780000] transition self-start sm:self-auto"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className="group cursor-pointer rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden hover:border-red-300 hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Status & Avenue badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100 text-[#990000]">
                      {ev.avenue}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        ev.status === 'live'
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : ev.status === 'completed'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#990000] transition line-clamp-2">
                    {ev.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="p-6 pt-0 border-t border-slate-200/80 mt-auto bg-slate-50/50">
                  <div className="space-y-1.5 text-xs text-slate-600 pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#990000]" />
                      <span>{ev.date}</span>
                      <span className="text-slate-300">•</span>
                      <Clock className="w-3.5 h-3.5 text-[#990000]" />
                      <span>{ev.startTime} - {ev.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#990000] flex-shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR IMPACT / FEATURED PROJECTS (2-3 projects) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#990000]">
                Signature Initiatives
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Our Impact & Featured Projects
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/projects')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#990000] hover:text-[#780000] transition self-start sm:self-auto"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-[#990000] border border-red-200">
                      {p.avenue}
                    </span>
                    {p.isPinned && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{p.description}</p>
                </div>

                <div className="p-6 pt-3 bg-red-50/50 border-t border-red-100">
                  <p className="text-xs font-bold text-[#990000] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#990000]" />
                    <span>{p.impact}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ACHIEVEMENTS & RECOGNITION + "View Achievements" */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#990000]">
                Excellence & Honors
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Achievements & Recognition
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/achievements')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#990000] hover:text-[#780000] transition self-start sm:self-auto"
            >
              <span>View All Achievements</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topAchievements.map((ach) => (
              <div
                key={ach.id}
                className="rounded-2xl p-6 bg-gradient-to-br from-red-50/80 to-white border-2 border-red-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#990000] bg-white px-3 py-1 rounded-full shadow-xs border border-red-100">
                      {ach.year}
                    </span>
                    <Award className="w-5 h-5 text-[#990000]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{ach.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{ach.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-red-100 text-[11px] font-semibold text-slate-500">
                  Recognized by: {ach.recognizedBy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. JOIN ROTARACT CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#800000] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-red-200 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
            Become a Leader of Tomorrow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight">
            Ready to Create Lasting Impact?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
            Discover a world of hands-on leadership, community transformation, and lifelong networking with the Rotaract Club of RSCOE.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/join-us')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#800000] font-black text-sm uppercase tracking-wider hover:bg-red-50 transition shadow-xl hover:scale-105 active:scale-95"
            >
              Apply to Join Rotaract RSCOE
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-transparent hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider border-2 border-white/60 transition"
            >
              Contact Club Leadership
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};


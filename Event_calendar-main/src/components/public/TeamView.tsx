import React, { useState } from 'react';
import { Shield, Users, Mail, Sparkles, Award, UserCheck } from 'lucide-react';
import { OFFICIAL_CORE_TEAM, OFFICIAL_BOD } from '../../utils/rotaractData';

export const TeamView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'core' | 'bod'>('all');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#8a0000] via-[#990000] to-[#6e0000] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-widest text-red-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mb-3">
            RIY 2026–27 Leadership Roster
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Meet Our Leadership Team
          </h1>
          <p className="mt-3 text-red-100 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Dedicated youth leaders guiding Rotaract Club of RSCOE under the theme “कर्म • कौशलम् • कर्तव्य”.
          </p>

          {/* Quick Filter Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeFilter === 'all'
                  ? 'bg-white text-[#990000] shadow-md'
                  : 'text-white hover:text-red-100'
              }`}
            >
              All Leadership ({OFFICIAL_CORE_TEAM.length + OFFICIAL_BOD.length})
            </button>
            <button
              onClick={() => setActiveFilter('core')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeFilter === 'core'
                  ? 'bg-white text-[#990000] shadow-md'
                  : 'text-white hover:text-red-100'
              }`}
            >
              Core Team ({OFFICIAL_CORE_TEAM.length})
            </button>
            <button
              onClick={() => setActiveFilter('bod')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeFilter === 'bod'
                  ? 'bg-white text-[#990000] shadow-md'
                  : 'text-white hover:text-red-100'
              }`}
            >
              Board of Directors ({OFFICIAL_BOD.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* CORE TEAM SECTION */}
        {(activeFilter === 'all' || activeFilter === 'core') && (
          <section>
            <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-red-200">
              <div className="w-10 h-10 rounded-xl bg-[#990000] text-white flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Core Team 2026–27
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Executive governance & strategic club administration
                </p>
              </div>
              <span className="ml-auto text-xs font-black uppercase text-[#990000] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                {OFFICIAL_CORE_TEAM.length} Officers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {OFFICIAL_CORE_TEAM.map((member) => {
                const initials = member.name
                  .replace('Rtr.', '')
                  .trim()
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase();

                const isTopOfficer =
                  member.position === 'Club President' ||
                  member.position === 'Club Secretary' ||
                  member.position === 'Club Vice President';

                return (
                  <div
                    key={member.position}
                    className={`rounded-2xl p-6 bg-white border ${
                      isTopOfficer
                        ? 'border-red-300 shadow-md ring-1 ring-red-200'
                        : 'border-slate-200 shadow-xs'
                    } flex flex-col justify-between hover:shadow-lg transition group`}
                  >
                    <div>
                      {/* Photo Placeholder */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#990000] to-[#730000] text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-red-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                          {initials}
                        </div>
                        <div>
                          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-50 px-2 py-0.5 rounded border border-red-200 mb-1">
                            Core Team
                          </span>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-[#990000] transition">
                            {member.name}
                          </h3>
                          <p className="text-xs font-bold text-slate-600 mt-0.5">
                            {member.position}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded ml-2 flex-shrink-0">
                        Active
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* BOD SECTION */}
        {(activeFilter === 'all' || activeFilter === 'bod') && (
          <section>
            <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-red-200">
              <div className="w-10 h-10 rounded-xl bg-[#990000] text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Board of Directors (BOD) 2026–27
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Avenue leadership, project execution & committee coordinators
                </p>
              </div>
              <span className="ml-auto text-xs font-black uppercase text-[#990000] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                {OFFICIAL_BOD.length} Directors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {OFFICIAL_BOD.map((bod) => {
                const initials = bod.name
                  .replace('Rtr.', '')
                  .trim()
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase();

                return (
                  <div
                    key={`${bod.position}-${bod.name}`}
                    className="rounded-2xl p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-red-300 transition group"
                  >
                    <div>
                      {/* Photo Placeholder */}
                      <div className="flex items-center gap-3.5 mb-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#800000] to-[#5a0000] text-white flex items-center justify-center font-black text-lg shadow-sm border border-red-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                          {initials}
                        </div>
                        <div className="overflow-hidden">
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#990000] bg-red-50 px-2 py-0.5 rounded border border-red-200 mb-0.5 truncate max-w-full">
                            {bod.avenue}
                          </span>
                          <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-[#990000] transition">
                            {bod.name}
                          </h3>
                          <p className="text-[11px] font-bold text-slate-600 line-clamp-1 mt-0.5">
                            {bod.position}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{bod.email}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

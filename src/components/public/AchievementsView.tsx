import React, { useState } from 'react';
import { Award, ShieldCheck, Trophy, Sparkles, Plus, Trash2, Calendar, Star } from 'lucide-react';
import { AchievementItem } from '../../types/rotaract';
import { useAuth } from '../../context/AuthContext';

interface AchievementsViewProps {
  achievements: AchievementItem[];
  onOpenCreateAchievement?: () => void;
  onDeleteAchievement?: (id: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  onOpenCreateAchievement,
  onDeleteAchievement,
}) => {
  const { isCoreTeam } = useAuth();
  const [selectedYear, setSelectedYear] = useState<string>('All');

  const years = ['All', ...Array.from(new Set(achievements.map((a) => a.year)))];

  const filtered =
    selectedYear === 'All'
      ? achievements
      : achievements.filter((a) => a.year === selectedYear);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#8a0000] via-[#990000] to-[#6e0000] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-widest text-red-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mb-3">
            Accolades & Record Book Inductions
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Achievements & Recognitions
          </h1>
          <p className="mt-3 text-red-100 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Honored across Rotary International District 3131 and inducted into the India Book of Records for historic youth-driven impact.
          </p>

          {isCoreTeam && onOpenCreateAchievement && (
            <div className="mt-6">
              <button
                onClick={onOpenCreateAchievement}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-[#990000] font-black text-xs uppercase tracking-wider hover:bg-red-50 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Achievement Record</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Year Filter Chips */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 hidden sm:inline">
              Filter by Term:
            </span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedYear === y
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-500">
            Showing {filtered.length} honors
          </span>
        </div>

        {/* Major Highlighting Card: India Book of Records & 13 Awards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#800000] to-[#550000] text-white shadow-xl border-4 border-red-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
              <ShieldCheck className="w-64 h-64" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider mb-4 border border-white/20">
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>National Record Entry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                India Book of Records Induction
              </h2>
              <p className="text-xs font-semibold text-red-200 mt-1 uppercase tracking-wider">
                Rotary International Year 2024–25
              </p>
              <p className="mt-4 text-xs sm:text-sm text-red-100 leading-relaxed">
                Rotaract Club of RSCOE achieved historic national acclaim by earning official induction into the India Book of Records. Recognized for mobilizing one of the largest synchronized youth-led community and environmental impact campaigns ever recorded by an institution-based club.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 text-xs font-bold text-white flex items-center justify-between">
              <span>Verified Record Authority</span>
              <span className="text-red-200">India Book of Records Editorial Board</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#800000] to-[#550000] text-white shadow-xl border-4 border-red-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
              <Trophy className="w-64 h-64" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider mb-4 border border-white/20">
                <Trophy className="w-3.5 h-3.5" />
                <span>District 3131 Triumph</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                13 Prestigious District Awards
              </h2>
              <p className="text-xs font-semibold text-red-200 mt-1 uppercase tracking-wider">
                Rotary International Year 2025–26
              </p>
              <p className="mt-4 text-xs sm:text-sm text-red-100 leading-relaxed">
                Sweeping the Annual District 3131 Awards Assembly with an astonishing tally of 13 top awards. Honors included Outstanding College-Based Club, Best Flagship Project (Project Saptarishi), Exemplary Community Service, and Premier Digital Media Publication.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 text-xs font-bold text-white flex items-center justify-between">
              <span>District Conformance</span>
              <span className="text-red-200">Rotaract District Organization 3131</span>
            </div>
          </div>
        </div>

        {/* All Achievement Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-red-300 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-[#990000] border border-red-200">
                    {ach.year}
                  </span>
                  <Award className="w-5 h-5 text-[#990000] group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#990000] transition">
                  {ach.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>By: {ach.recognizedBy}</span>

                {isCoreTeam && onDeleteAchievement && (
                  <button
                    onClick={() => onDeleteAchievement(ach.id)}
                    className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    title="Delete achievement record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Layers,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Pin,
  ExternalLink,
  ChevronRight,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import { AvenueOfService, ProjectItem } from '../../types/rotaract';
import { useAuth } from '../../context/AuthContext';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onOpenCreateProject?: () => void;
  onEditProject?: (project: ProjectItem) => void;
  onDeleteProject?: (id: string, title: string, avenue: AvenueOfService) => void;
}

const AVENUES: (AvenueOfService | 'All')[] = [
  'All',
  'Community Service',
  'Professional Development',
  'Club Service',
  'International Service',
  'Technical & Innovations',
  'Public Relations',
];

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenCreateProject,
  onEditProject,
  onDeleteProject,
}) => {
  const [selectedAvenue, setSelectedAvenue] = useState<AvenueOfService | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const { isCoreTeam, canManageAvenue } = useAuth();

  const filtered = projects.filter((p) => {
    const matchAvenue = selectedAvenue === 'All' || p.avenue === selectedAvenue;
    const matchQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.impact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAvenue && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#8a0000] via-[#990000] to-[#6e0000] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-widest text-red-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mb-3">
            Flagship Initiatives & Community Impact
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Club Projects & Missions
          </h1>
          <p className="mt-3 text-red-100 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            From Project Saptarishi to Rotaract ki Pathshala, explore how Rotaract RSCOE turns compassion into real sustainable action.
          </p>

          {isCoreTeam && onOpenCreateProject && (
            <div className="mt-6">
              <button
                onClick={onOpenCreateProject}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-[#990000] font-black text-xs uppercase tracking-wider hover:bg-red-50 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Avenue Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {AVENUES.map((av) => (
              <button
                key={av}
                onClick={() => setSelectedAvenue(av)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedAvenue === av
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {av}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const canEdit = isCoreTeam || canManageAvenue(proj.avenue);

            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-red-300 transition flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Avenue & Pinned Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-[#990000] border border-red-200">
                      {proj.avenue}
                    </span>
                    {proj.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Pin className="w-3 h-3 fill-amber-700" />
                        <span>Pinned</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#990000] transition">
                    {proj.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{proj.date}</span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  {/* Impact Highlight */}
                  <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 mb-4">
                    <span className="text-[10px] font-black uppercase text-[#990000] tracking-wider block mb-0.5">
                      Impact Achieved
                    </span>
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {proj.impact}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#990000] hover:text-[#780000] transition"
                    >
                      <span>Read Project Case Study</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {canEdit && (
                      <div className="flex items-center gap-1">
                        {onEditProject && (
                          <button
                            onClick={() => onEditProject(proj)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            title="Edit project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteProject && (
                          <button
                            onClick={() => onDeleteProject(proj.id, proj.title, proj.avenue)}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No projects found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filter or search query</p>
          </div>
        )}
      </div>

      {/* Case Study Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#990000] bg-red-50 px-2.5 py-1 rounded-full border border-red-200 inline-block mb-1">
                  {selectedProject.avenue}
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {selectedProject.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Date: {selectedProject.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                <span className="text-xs font-black uppercase text-[#990000] tracking-wider block mb-1">
                  Key Impact Metric
                </span>
                <p className="text-sm font-bold text-slate-900">{selectedProject.impact}</p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                  Overview
                </h4>
                <p>{selectedProject.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                  Detailed Implementation & Case Study
                </h4>
                <p className="whitespace-pre-line">{selectedProject.details}</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

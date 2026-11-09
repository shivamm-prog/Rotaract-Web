import React, { useState } from 'react';
import { X, Sparkles, Calendar, Layers, Image as ImageIcon } from 'lucide-react';
import { AvenueOfService, ProjectItem } from '../../types/rotaract';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => Promise<void>;
  editingProject?: ProjectItem | null;
  allowedAvenue?: AvenueOfService;
}

const AVENUES: AvenueOfService[] = [
  'Community Service',
  'Professional Development',
  'Club Service',
  'International Service',
  'Technical & Innovations',
  'Sports & Cultural',
  'Public Relations',
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject,
  allowedAvenue,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(editingProject?.title || '');
  const [avenue, setAvenue] = useState<AvenueOfService>(
    allowedAvenue || editingProject?.avenue || 'Community Service'
  );
  const [date, setDate] = useState(
    editingProject?.date || new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(editingProject?.description || '');
  const [impact, setImpact] = useState(editingProject?.impact || '');
  const [details, setDetails] = useState(editingProject?.details || '');
  const [isPinned, setIsPinned] = useState(editingProject?.isPinned || false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(
        {
          title,
          avenue,
          date,
          description,
          impact,
          details,
          isPinned,
          featured: true,
        },
        editingProject?.id
      );
      onClose();
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Showcase signature initiatives on the official public website
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Project Saptarishi 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Avenue
              </label>
              <select
                disabled={Boolean(allowedAvenue)}
                value={avenue}
                onChange={(e) => setAvenue(e.target.value as AvenueOfService)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000] bg-white disabled:bg-slate-100"
              >
                {AVENUES.map((av) => (
                  <option key={av} value={av}>
                    {av}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Impact Highlight Metric *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Reached 4,500+ citizens across 7 specialized social development domains"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Brief Description *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Short summary displayed on public cards..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Full Implementation Details / Case Study *
            </label>
            <textarea
              rows={4}
              required
              placeholder="In-depth breakdown of activities, partners, volunteer mobilization..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded text-[#990000] focus:ring-[#990000]"
            />
            <label htmlFor="isPinned" className="text-xs font-bold text-slate-700">
              Pin project to top of website / Home impact section
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


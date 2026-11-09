import React, { useState } from 'react';
import { X, Award } from 'lucide-react';
import { AchievementItem } from '../../types/rotaract';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AchievementItem, 'id' | 'createdAt'>) => Promise<void>;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('RIY 2026–27');
  const [category, setCategory] = useState('District Recognition');
  const [recognizedBy, setRecognizedBy] = useState('Rotaract District Organization 3131');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        title,
        year,
        category,
        recognizedBy,
        description,
      });
      onClose();
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">Add Achievement Record</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Record new district trophies, national records, and citations
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
              Award / Record Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Best College-Based Club Citation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Rotary Year / Term *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RIY 2026–27"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000] bg-white"
              >
                <option>District Recognition</option>
                <option>National Record</option>
                <option>Project Excellence</option>
                <option>Club Performance</option>
                <option>Media & Editorial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Conferred / Recognized By *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rotaract District Organization 3131"
              value={recognizedBy}
              onChange={(e) => setRecognizedBy(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Citation Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Summary of the honor, citation, or record achieved..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
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
              {submitting ? 'Saving...' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

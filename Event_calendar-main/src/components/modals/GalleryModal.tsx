import React, { useState } from 'react';
import { X, Image as ImageIcon, Film } from 'lucide-react';
import { GalleryItem } from '../../types/rotaract';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<GalleryItem, 'id' | 'createdAt'>) => Promise<void>;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [category, setCategory] = useState<'events' | 'projects' | 'general'>('projects');
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) {
      alert('Please provide an image or video URL.');
      return;
    }
    setSubmitting(true);
    try {
      await onSave({
        title,
        type,
        category,
        mediaUrl: mediaUrl.trim(),
        caption,
        date,
      });
      onClose();
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">Upload Media Item</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Add photographs or video links to the official club album
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
              Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Project Saptarishi Tree Stewardship Drive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Media Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'photo' | 'video')}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000] bg-white"
              >
                <option value="photo">Photograph</option>
                <option value="video">Video Film / Reel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Album Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'events' | 'projects' | 'general')}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000] bg-white"
              >
                <option value="projects">Project Album</option>
                <option value="events">Event Album</option>
                <option value="general">General Fellowship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Image / Media URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/... or cloud storage URL"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Caption / Brief Story
            </label>
            <input
              type="text"
              placeholder="Describe the moment or team involved..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#990000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Date Captured *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
              {submitting ? 'Uploading...' : 'Save Media'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

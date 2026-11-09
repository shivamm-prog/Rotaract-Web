import React, { useState } from 'react';
import {
  Image,
  Video,
  Plus,
  Trash2,
  Calendar,
  Maximize2,
  X,
  Sparkles,
  Layers,
  Film,
} from 'lucide-react';
import { GalleryItem } from '../../types/rotaract';
import { useAuth } from '../../context/AuthContext';

interface GalleryViewProps {
  galleryItems: GalleryItem[];
  onOpenCreateItem?: () => void;
  onDeleteItem?: (id: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  galleryItems,
  onOpenCreateItem,
  onDeleteItem,
}) => {
  const { isCoreTeam } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video' | 'events' | 'projects'>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filtered = galleryItems.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'photo') return item.type === 'photo';
    if (filterType === 'video') return item.type === 'video';
    if (filterType === 'events') return item.category === 'events';
    if (filterType === 'projects') return item.category === 'projects';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#8a0000] via-[#990000] to-[#6e0000] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-widest text-red-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mb-3">
            Moments, Milestones & Fellowship
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Club Media & Albums
          </h1>
          <p className="mt-3 text-red-100 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Witness the energy, fellowship, and ground reality of our service projects and events in photos and films.
          </p>

          {isCoreTeam && onOpenCreateItem && (
            <div className="mt-6">
              <button
                onClick={onOpenCreateItem}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-[#990000] font-black text-xs uppercase tracking-wider hover:bg-red-50 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Media Item</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-[#990000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Media ({galleryItems.length})
            </button>
            <button
              onClick={() => setFilterType('photo')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === 'photo'
                  ? 'bg-[#990000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === 'video'
                  ? 'bg-[#990000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Videos & Reels
            </button>
            <button
              onClick={() => setFilterType('events')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === 'events'
                  ? 'bg-[#990000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Event Albums
            </button>
            <button
              onClick={() => setFilterType('projects')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === 'projects'
                  ? 'bg-[#990000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Project Albums
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Showing {filtered.length} items
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-red-300 transition aspect-4/3 flex flex-col justify-end cursor-pointer"
              onClick={() => setActiveItem(item)}
            >
              {/* Media Preview Image */}
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback pleasant gradient if offline or link broken
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Top Tag & Media type icon */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/50 text-white backdrop-blur-md border border-white/20">
                  {item.category}
                </span>

                <div className="flex items-center gap-1">
                  {item.type === 'video' ? (
                    <span className="p-1 rounded-md bg-[#990000] text-white shadow-sm">
                      <Film className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-md bg-white/20 text-white backdrop-blur-md">
                      <Image className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {isCoreTeam && onDeleteItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1 rounded-md bg-red-600 hover:bg-red-700 text-white shadow-sm"
                      title="Delete media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Caption & Title */}
              <div className="relative p-3.5 text-white z-10">
                <h3 className="text-sm font-bold line-clamp-1 group-hover:text-red-200 transition">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                    {item.caption}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No media items found</p>
            <p className="text-xs text-slate-500 mt-1">Try another category filter</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700 flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-[#ff6666] tracking-wider">
                  {activeItem.category} • {activeItem.type}
                </span>
                <h3 className="text-base font-bold">{activeItem.title}</h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center min-h-[300px] max-h-[60vh]">
              <img
                src={activeItem.mediaUrl}
                alt={activeItem.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
              <p className="flex-1 font-medium">{activeItem.caption || activeItem.title}</p>
              <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date: {activeItem.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { AvenueOfService, EventStatus, RotaractEvent } from '../../types/rotaract';
import { CalendarView } from '../CalendarView';
import { EventsView } from '../EventsView';
import { useAuth } from '../../context/AuthContext';

interface PublicEventsViewProps {
  events: RotaractEvent[];
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  onOpenEventDetails: (event: RotaractEvent) => void;
  onOpenCreateEvent: (dateStr?: string) => void;
  onEditEvent: (event: RotaractEvent) => void;
  onDeleteEvent: (id: string, title: string) => void;
  onStatusChange: (id: string, newStatus: EventStatus) => void;
}

export const PublicEventsView: React.FC<PublicEventsViewProps> = ({
  events,
  selectedDateStr,
  onSelectDate,
  onOpenEventDetails,
  onOpenCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onStatusChange,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { isCoreTeam, isApprovedBOD, userProfile } = useAuth();
  const canCreate = isCoreTeam || isApprovedBOD;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#8a0000] via-[#990000] to-[#6e0000] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-red-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mb-2">
              Official Schedule & Activities
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Events & Organizational Calendar
            </h1>
            <p className="mt-2 text-red-100 text-sm max-w-xl">
              Explore all upcoming initiatives, live humanitarian camps, and past projects synchronized directly with our real-time portal.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Switcher */}
            <div className="inline-flex rounded-xl bg-black/25 p-1 border border-white/20">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'calendar'
                    ? 'bg-white text-[#990000] shadow-sm'
                    : 'text-white hover:text-red-100'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendar View</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'list'
                    ? 'bg-white text-[#990000] shadow-sm'
                    : 'text-white hover:text-red-100'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List / Filter View</span>
              </button>
            </div>

            {/* If logged in with permission, show Create Event */}
            {canCreate && (
              <button
                onClick={() => onOpenCreateEvent(selectedDateStr)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#990000] font-black text-xs uppercase tracking-wider hover:bg-red-50 shadow-md transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {viewMode === 'calendar' ? (
          <CalendarView
            events={events}
            selectedDateStr={selectedDateStr}
            onSelectDate={onSelectDate}
            onOpenEventDetails={onOpenEventDetails}
            onOpenCreateEventOnDate={(date) => {
              if (canCreate) {
                onOpenCreateEvent(date);
              } else {
                onSelectDate(date);
              }
            }}
          />
        ) : (
          <EventsView
            events={events}
            onOpenEventDetails={onOpenEventDetails}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
            onStatusChange={onStatusChange}
            onOpenCreateEvent={() => onOpenCreateEvent(selectedDateStr)}
          />
        )}
      </main>
    </div>
  );
};

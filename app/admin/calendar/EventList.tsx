"use client";

import { DeleteFormButton } from "@/components/admin/DeleteFormButton";
import { adminDeleteEvent } from "../_actions";
import { EventForm } from "./EventForm";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string | null;
  isUpcoming: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingEvent = editingId ? events.find(e => e.id === editingId) : null;

  if (editingEvent) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Upravit termín</h2>
        <EventForm event={editingEvent} onCancel={() => setEditingId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const eventDate = new Date(event.date);
        const isPast = eventDate < new Date();
        
        return (
          <div 
            key={event.id} 
            className={`border p-5 rounded-2xl bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:shadow-md transition-shadow ${
              isPast ? 'opacity-60' : ''
            }`}
          >
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <div className="font-bold text-lg">{event.title}</div>
                {event.isUpcoming && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                    Nadcházející
                  </span>
                )}
                {isPast && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                    Proběhlo
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">
                    {format(eventDate, "d. M. yyyy 'v' HH:mm", { locale: cs })}
                  </span>
                </div>
                <div className="text-gray-500">
                  📍 {event.venue}
                </div>
                {event.description && (
                  <div className="text-gray-500 text-xs mt-2 line-clamp-2">
                    {event.description}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingId(event.id)}
                className="text-yellow-600 hover:bg-yellow-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Upravit
              </button>
              <DeleteFormButton
                action={async (formData) => await adminDeleteEvent(null, formData)}
                itemId={event.id}
                itemName={event.title}
              />
            </div>
          </div>
        );
      })}
      {events.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          Zatím nejsou žádné termíny. Vytvořte první termín výše.
        </div>
      )}
    </div>
  );
}

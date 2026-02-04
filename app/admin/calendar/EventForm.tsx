"use client";

import { ActionForm } from "@/components/admin/ActionForm";
import { adminCreateEvent, adminUpdateEvent } from "../_actions";
import { X } from "lucide-react";
import type { Event } from "@/lib/types";

interface EventFormProps {
  event?: Event;
  onCancel?: () => void;
}

export function EventForm({ event, onCancel }: EventFormProps) {
  const isEdit = !!event;
  
  // Convert ISO date to datetime-local format for input
  const dateValue = event?.date 
    ? new Date(event.date).toISOString().slice(0, 16)
    : '';

  return (
    <ActionForm
      action={async (prevState, formData) => {
        if (isEdit) {
          formData.append("id", event.id);
          return await adminUpdateEvent(prevState, formData);
        }
        return await adminCreateEvent(prevState, formData);
      }}
      successMessage={isEdit ? "Termín byl úspěšně upraven" : "Termín byl úspěšně vytvořen"}
      submitButtonText={isEdit ? "Uložit změny" : "Vytvořit termín"}
      submitButtonClassName="w-full bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 font-medium transition-colors disabled:opacity-50"
      onSuccess={onCancel}
    >
      <div className="space-y-4">
        {isEdit && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-xl text-sm">
            Upravujete termín: <strong>{event.title}</strong>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Název akce</label>
          <input 
            name="title" 
            placeholder="Např. Kvíz v hospodě U Zlatého lva" 
            required 
            defaultValue={event?.title}
            className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum a čas</label>
            <input 
              type="datetime-local"
              name="date" 
              required 
              defaultValue={dateValue}
              className="w-full p-3 border rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Místo konání</label>
            <input 
              name="venue" 
              placeholder="Např. Hospoda U Zlatého lva" 
              required 
              defaultValue={event?.venue}
              className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Popis (volitelné)</label>
          <textarea 
            name="description" 
            rows={3}
            placeholder="Další informace o akci..."
            defaultValue={event?.description || undefined}
            className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" 
          />
        </div>

        <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
          <input 
            type="checkbox" 
            name="isUpcoming" 
            defaultChecked={event?.isUpcoming}
            className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500" 
          />
          <span className="font-medium">Nadcházející (zobrazit v kalendáři na hlavní stránce)</span>
        </label>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Zrušit úpravu
          </button>
        )}
      </div>
    </ActionForm>
  );
}

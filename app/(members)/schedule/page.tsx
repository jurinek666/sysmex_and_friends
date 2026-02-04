import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { getEventsForCalendar } from "@/lib/queries/events";
import { getParticipantsByEventId } from "@/lib/queries/team";
import { createClient } from "@/lib/supabase/server";
import EventParticipation from "@/components/team/EventParticipation";

export const revalidate = 60;

export default async function SchedulePage() {
  const events = await getEventsForCalendar(100);
  const supabase = await createClient();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calendar className="text-neon-cyan" />
          Kalendář a účast
        </h1>
        <p className="text-gray-400 mt-1">
          Potvrď účast na nadcházejících kvízech.
        </p>
      </header>

      {events.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">Zatím nejsou naplánované žádné akce.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event, index) => {
            const isCyan = index % 2 === 0;
            const borderClass = isCyan
              ? "border-neon-cyan"
              : "border-neon-magenta";
            const badgeClass = isCyan
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "bg-neon-magenta/20 text-neon-magenta";
            return (
              <div
                key={event.id}
                className={`bento-card p-6 border-l-4 ${borderClass}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {event.title}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {format(new Date(event.date), "d. M. yyyy 'v' HH:mm", {
                        locale: cs,
                      })}
                    </p>
                    <p className="text-gray-500 text-sm">{event.venue}</p>
                    {event.description && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <ScheduleEventRSVP
                    eventId={event.id}
                    supabase={supabase}
                    badgeClass={badgeClass}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

async function ScheduleEventRSVP({
  eventId,
  supabase,
  badgeClass,
}: {
  eventId: string;
  supabase: Awaited<ReturnType<typeof createClient>>;
  badgeClass: string;
}) {
  const participants = await getParticipantsByEventId(supabase, eventId);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className={`shrink-0 rounded-lg p-4 ${badgeClass}`}>
      <EventParticipation
        eventId={eventId}
        initialParticipants={participants}
        isLoggedIn={!!user}
      />
    </div>
  );
}

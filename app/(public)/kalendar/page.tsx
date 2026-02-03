import { Metadata } from "next";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { getEventsForCalendar } from "@/lib/queries/events";

export const metadata: Metadata = {
  title: "Kalendář | SYSMEX & Friends Quiz Team",
  description: "Kalendář akcí a turnajů SYSMEX & Friends Quiz Team",
};

export const revalidate = 60;

export default async function KalendarPage() {
  const events = await getEventsForCalendar(100);

  return (
    <main className="min-h-screen pt-36 md:pt-44 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10 text-neon-cyan" strokeWidth={2} />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-neon-cyan via-white to-neon-magenta bg-clip-text text-transparent">
              Kalendář
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Nadchazející turnaje, tréninky a akce SYSMEX & Friends Quiz Team
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="grid gap-6">
          {events.length > 0 ? (
            <>
              <h2 className="text-xl font-bold text-white">Nadcházející akce</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {events.map((event, index) => {
                  const eventDate = new Date(event.date);
                  const isCyan = index % 2 === 0;
                  const borderClass = isCyan ? "border-neon-cyan" : "border-neon-magenta";
                  const textClass = isCyan ? "text-neon-cyan" : "text-neon-magenta";
                  const badgeClass = isCyan
                    ? "bg-neon-cyan/20 text-neon-cyan"
                    : "bg-neon-magenta/20 text-neon-magenta";
                  return (
                    <div
                      key={event.id}
                      className={`bento-card p-6 border-l-4 ${borderClass}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {event.title}
                            </h3>
                            <p className={`text-sm ${textClass}`}>
                              {format(eventDate, "d. M. yyyy 'v' HH:mm", {
                                locale: cs,
                              })}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 ${badgeClass} text-xs font-bold rounded-full`}
                          >
                            Nadcházející
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {event.venue}
                        </p>
                        {event.description && (
                          <p className="text-gray-500 text-sm line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bento-card p-8 text-center">
              <div className="space-y-4">
                <Calendar
                  className="w-16 h-16 text-neon-cyan/50 mx-auto"
                  strokeWidth={1.5}
                />
                <h2 className="text-2xl font-bold text-white">
                  Zatím nejsou naplánované žádné akce
                </h2>
                <p className="text-gray-400">
                  Kalendář bude doplněn o nadcházející turnaje a události.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

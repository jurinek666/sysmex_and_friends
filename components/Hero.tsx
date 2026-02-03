import Image from "next/image";
import Link from "next/link";
import { format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { cs } from "date-fns/locale";
import { Calendar, MapPin } from "lucide-react";

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string | null;
}

interface HeroProps {
  upcomingEvent?: UpcomingEvent | null;
}

export function Hero({ upcomingEvent }: HeroProps) {
  const eventDate = upcomingEvent ? new Date(upcomingEvent.date) : null;
  const isEventToday = eventDate ? isToday(eventDate) : false;
  const isEventTomorrow = eventDate ? isTomorrow(eventDate) : false;
  const daysUntil = eventDate ? differenceInDays(eventDate, new Date()) : 0;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50" />
      <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-neon-cyan/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-neon-magenta/10 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-16 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-100 text-sysmex-900 text-xs font-bold uppercase tracking-wider w-fit">
              SYSMEX & FRIENDS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-sysmex-900 leading-tight">
              Kvízový tým, který píše historii
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl">
              Novinky, statistiky a galerie v jednom dashboardu. Přidej se k fanouškům SYSMEX & Friends.
            </p>
            <div className="flex flex-wrap gap-3">
          <Link
            href="/onas"
            className="px-5 py-3 rounded-xl bg-sysmex-900 text-white font-semibold hover:bg-sysmex-800 transition-colors"
          >
            Poznej náš tým
          </Link>
            </div>

            {upcomingEvent && eventDate ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Calendar className="h-4 w-4 text-neon-gold" />
                      Nejbližší akce
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-sysmex-900">
                      {upcomingEvent.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span className="font-mono">
                        {format(eventDate, "d. M. yyyy", { locale: cs })} ·{" "}
                        {format(eventDate, "HH:mm", { locale: cs })}
                      </span>
                      {upcomingEvent.venue ? (
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="h-4 w-4" />
                          {upcomingEvent.venue}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {(isEventToday || isEventTomorrow || daysUntil <= 7) && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isEventToday
                          ? "bg-neon-gold text-black"
                          : isEventTomorrow
                          ? "bg-neon-cyan/20 text-neon-cyan"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isEventToday
                        ? "Dnes"
                        : isEventTomorrow
                        ? "Zítra"
                        : `Za ${daysUntil} dnů`}
                    </span>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <div className="absolute -bottom-8 right-6 h-20 w-20 rounded-full border border-neon-magenta/30 bg-neon-magenta/10 blur-[2px]" />

            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-2xl">
              <Image
                src="/hero/4.png"
                alt="SYSMEX & Friends týmový vizuál"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 92vw, 620px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sysmex-950/80 via-transparent to-transparent" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

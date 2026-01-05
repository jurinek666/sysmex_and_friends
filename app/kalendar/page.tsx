import { Metadata } from "next";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalendář | SYSMEX & Friends Quiz Team",
  description: "Kalendář akcí a turnajů SYSMEX & Friends Quiz Team",
};

export const revalidate = 60;

export default function KalendarPage() {
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
          {/* Placeholder for upcoming events */}
          <div className="bento-card p-8 text-center">
            <div className="space-y-4">
              <Calendar className="w-16 h-16 text-neon-cyan/50 mx-auto" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-white">Brzy zde najdete kalendář akcí</h2>
              <p className="text-gray-400">
                Pracujeme na integraci kalendáře s nadcházejícími turnaji a událostmi
              </p>
            </div>
          </div>

          {/* Sample event cards - will be replaced with real data */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bento-card p-6 border-l-4 border-neon-cyan">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Příklad akce</h3>
                    <p className="text-sm text-neon-cyan">15. ledna 2026</p>
                  </div>
                  <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-xs font-bold rounded-full">
                    Nadcházející
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Místo konání • 19:00
                </p>
              </div>
            </div>

            <div className="bento-card p-6 border-l-4 border-neon-magenta">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Další akce</h3>
                    <p className="text-sm text-neon-magenta">22. ledna 2026</p>
                  </div>
                  <span className="px-3 py-1 bg-neon-magenta/20 text-neon-magenta text-xs font-bold rounded-full">
                    Plánováno
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Místo konání • 18:30
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

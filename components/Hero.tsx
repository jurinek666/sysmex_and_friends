import Image from "next/image";
import Link from "next/link";

export function Hero() {
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
                href="#kalendar"
                className="px-5 py-3 rounded-xl bg-sysmex-900 text-white font-semibold hover:bg-sysmex-800 transition-colors"
              >
                Nadcházející akce
              </Link>
            </div>
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

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart,
  ChartConfiguration,
  ChartTypeRegistry,
  registerables,
} from "chart.js";
import { Sparkles } from "lucide-react";
import { generateQuestionAction, generateStrategyAction } from "./actions";

Chart.register(...registerables);

type ChartRef = React.MutableRefObject<HTMLCanvasElement | null>;

function useChart(
  ref: ChartRef,
  config: ChartConfiguration<keyof ChartTypeRegistry>,
) {
  useEffect(() => {
    if (!ref.current) return;
    let chart: Chart | null = null;

    const ctx = ref.current.getContext("2d");
    if (!ctx) return;

    chart = new Chart(ctx, config);

    return () => {
      chart?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, JSON.stringify(config.data)]);
}

export default function AboutPage() {
  const lineRef = useRef<HTMLCanvasElement | null>(null);
  const radarRef = useRef<HTMLCanvasElement | null>(null);
  const scatterRef = useRef<HTMLCanvasElement | null>(null);

  const [aiQuestion, setAiQuestion] = useState<string>(
    'Klikněte na "Trénovat slabiny" pro záludné otázky...',
  );
  const [aiStrategy, setAiStrategy] = useState<string>(
    'Klikněte na "Strategie" pro doporučení na příští kolo.',
  );
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingStrategy, setLoadingStrategy] = useState(false);

  useChart(lineRef, {
    type: "line",
    data: {
      labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10"],
      datasets: [
        {
          label: "Body",
          data: [42, 45, 48, 44, 51, 38, 49, 53, 55, 56.5],
          borderColor: "#46D6FF",
          backgroundColor: "rgba(70,214,255,0.12)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#cbd5f5" },
        },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
        y: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
      },
    },
  });

  useChart(radarRef, {
    type: "radar",
    data: {
      labels: ["Biologie", "Historie", "Sport", "Kultura", "Popkultura", "Gastronomie"],
      datasets: [
        {
          label: "Náš tým",
          data: [95, 80, 65, 70, 50, 85],
          borderColor: "#FF4FD8",
          backgroundColor: "rgba(255,79,216,0.12)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: "rgba(148,163,184,0.2)" },
          grid: { color: "rgba(148,163,184,0.2)" },
          ticks: { color: "#9ca3af", backdropColor: "transparent" },
          pointLabels: {
            color: "#cbd5f5",
            font: { size: 12 },
          },
        },
      },
      plugins: {
        legend: {
          labels: { color: "#cbd5f5" },
        },
      },
    },
  });

  useChart(scatterRef, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Pivo vs. Body",
          data: [
            { x: 2, y: 38 },
            { x: 4, y: 48 },
            { x: 6, y: 56 },
            { x: 7, y: 54 },
            { x: 9, y: 35 },
          ],
          backgroundColor: "#FBD986",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#cbd5f5" },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Počet piv",
            color: "#9ca3af",
          },
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
        y: {
          title: {
            display: true,
            text: "Body",
            color: "#9ca3af",
          },
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
      },
    },
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const plotly = await import("plotly.js-dist-min");
      if (!mounted) return;

      const traces = [
        {
          y: [7, 8, 6, 9, 7],
          type: "box",
          name: "Kolo 1",
          marker: { color: "#46D6FF" },
        },
        {
          y: [5, 6, 4, 7, 5],
          type: "box",
          name: "Kolo 2",
          marker: { color: "#FF4FD8" },
        },
      ];

      plotly.newPlot(
        "plotlyBoxChart",
        traces,
        {
          margin: { l: 30, r: 10, t: 10, b: 30 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "#cbd5f5" },
        },
        { displayModeBar: false },
      );
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const generateAIQuestion = async () => {
    setLoadingQuestion(true);
    try {
      const result = await generateQuestionAction();
      setAiQuestion(result);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Chyba při komunikaci s AI.";
      setAiQuestion(`Chyba při komunikaci s AI. ${msg}`);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const generateStrategy = async () => {
    setLoadingStrategy(true);
    try {
      const result = await generateStrategyAction();
      setAiStrategy(result);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Chyba při komunikaci s AI.";
      setAiStrategy(`Chyba při komunikaci s AI. ${msg}`);
    } finally {
      setLoadingStrategy(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-sysmex-950 pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-sysmex-950 via-sysmex-900 to-sysmex-950" />
      <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-neon-cyan/20 blur-[140px]" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-neon-magenta/20 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 space-y-16">
        {/* HERO */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/80 text-sm font-semibold uppercase tracking-widest">
            a.k.a. Legenda Sborovny
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            SYSMEX & Friends
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
            Kvízový tým, který kombinuje laboratorní disciplínu s pubovou kreativitou. Poznej náš příběh, čísla a rituály.
          </p>
          <div className="flex justify-center gap-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            <span>📍 Sborovna, Brno Veveří</span>
            <span>📅 Každý čtvrtek</span>
            <span>🧠 Mozky Sysmexu</span>
          </div>
        </header>

        {/* INTRO + KPI */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 bento-card p-8 border-white/10 bg-white/5 text-white space-y-6">
            <h2 className="text-2xl font-bold">
              O týmu
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Jsme nesourodá, ale sehraná parta ze Sysmexu a jejich přátel. Každý čtvrtek vybojujeme ve Sborovně další kapitolu brněnské kvízové historie.
            </p>
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 text-gray-300 italic">
              „Není důležité vyhrát, ale porazit tým u vedlejšího stolu.“
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🏆", value: "12", label: "Stupňů vítězů", colors: "from-neon-cyan/30 to-neon-cyan/50" },
              { icon: "🧠", value: "54.5", label: "Průměrné body", colors: "from-neon-magenta/40 to-neon-magenta/60" },
              { icon: "🍺", value: "~850", label: "Vypitých piv", colors: "from-neon-gold/40 to-neon-gold/60" },
            ].map((card, idx) => (
              <div
                key={card.label}
                className={`rounded-2xl p-6 text-white text-center shadow-[0_10px_40px_rgba(8,145,178,0.25)] bg-gradient-to-br ${card.colors} backdrop-blur`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-5xl mb-2">{card.icon}</div>
                <span className="text-4xl font-black">{card.value}</span>
                <span className="block text-sm uppercase tracking-wide mt-2 text-white/80">
                  {card.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* AI CENTRUM */}
        <section className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-sysmex-900/80 to-sysmex-950/90 p-10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 right-10 h-56 w-56 bg-neon-cyan/20 blur-[120px]" />
          <div className="absolute -bottom-32 left-10 h-72 w-72 bg-neon-magenta/20 blur-[120px]" />
          </div>
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neon-cyan">
            <Sparkles className="h-3 w-3" />
            AI podpora
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">AI Strategické centrum</h2>
          <p className="text-gray-300 max-w-xl">
            Vyzkoušej generátor záludných otázek a nech si doporučit taktiku na příští kolo.
          </p>
          <p className="text-sm text-gray-500">
            Výstupy jsou nyní poháněny Google Gemini AI.
          </p>
        </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={generateAIQuestion}
                disabled={loadingQuestion}
                className="px-6 py-3 rounded-xl bg-neon-cyan/20 text-neon-cyan font-bold hover:bg-neon-cyan/30 transition-colors border border-neon-cyan/40"
              >
                {loadingQuestion ? "Generuji..." : "Trénovat slabiny"}
              </button>
              <button
                onClick={generateStrategy}
                disabled={loadingStrategy}
                className="px-6 py-3 rounded-xl bg-neon-magenta/20 text-neon-magenta font-bold hover:bg-neon-magenta/30 transition-colors border border-neon-magenta/40"
              >
                {loadingStrategy ? "Analyzuji..." : "Strategie"}
              </button>
            </div>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div
              className={`rounded-2xl border p-6 min-h-[150px] ${
                aiQuestion.includes("AI nemá") || aiQuestion.startsWith("Chyba")
                  ? "border-amber-500/50 bg-amber-950/20 text-amber-200"
                  : "border-white/10 bg-black/30 text-gray-200"
              }`}
            >
              {aiQuestion}
            </div>
            <div
              className={`rounded-2xl border p-6 min-h-[150px] ${
                aiStrategy.includes("AI nemá") || aiStrategy.startsWith("Chyba")
                  ? "border-amber-500/50 bg-amber-950/20 text-amber-200"
                  : "border-white/10 bg-black/30 text-gray-200"
              }`}
            >
              {aiStrategy}
            </div>
          </div>
        </section>

        {/* GRAFY */}
        <section className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Cesta sezónou</h2>
            <div className="bento-card p-6 md:p-8 h-[320px] md:h-[380px] border-white/10 bg-white/5">
              <canvas ref={lineRef} className="w-full h-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bento-card p-6 md:p-8 h-[360px] md:h-[420px] border-white/10 bg-white/5">
              <canvas ref={radarRef} className="w-full h-full" />
            </div>
            <div className="space-y-4 text-gray-300">
              <h2 className="text-3xl font-bold text-white">Anatomie našeho mozku</h2>
              <p>
                Díky SYSMEXu excelujeme ve vědě a analytice, ale popkultura je stále Achillova pata. AI nám pomáhá mapovat slabiny a připravit se na dotazy moderátora.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "🧬", title: "Biologie & věda", text: "95 % úspěšnosti" },
                  { icon: "🎶", title: "Popkultura", text: "70 % – stoupáme!" },
                  { icon: "📺", title: "Aktuality & média", text: "50 % – čas trénovat" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bento-card p-6 md:p-8 h-[320px] border-white/10 bg-white/5">
              <h3 className="text-xl font-semibold text-white mb-3">Pivo vs. Body</h3>
              <canvas ref={scatterRef} className="w-full h-full" />
            </div>
            <div className="bento-card p-6 md:p-8 h-[320px] border-white/10 bg-white/5">
              <h3 className="text-xl font-semibold text-white mb-3">Rozptyl výkonu</h3>
              <div id="plotlyBoxChart" className="w-full h-full" />
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="relative rounded-3xl border border-white/10 bg-black/30 px-6 md:px-10 py-12 text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-sysmex-900/30 via-transparent to-sysmex-950/40" />
            <div className="absolute top-10 left-20 w-24 h-24 bg-neon-cyan/20 blur-3xl" />
            <div className="absolute bottom-10 right-20 w-24 h-24 bg-neon-magenta/20 blur-3xl" />
          </div>
          <div className="relative text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold">Náš čtvrteční rituál</h2>
            <p className="text-gray-400">
              Co se děje v Sborovně, zůstává v Sborovně. Přesto odhalíme pár tajemství.
            </p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/20" />
            {[
              {
                time: "18:45",
                title: "Sraz & první pivo",
                side: "left",
                icon: "🍻",
                text: "Naladění, sdílení drbů z laboratoře, první rozcvička mozkových závitů.",
              },
              {
                time: "19:00",
                title: "Start kvízu",
                side: "right",
                icon: "🔥",
                text: "Taktická porada u první otázky. Někdo přinese logaritmické pravítko.",
              },
              {
                time: "21:30",
                title: "Sudden death & afterparty",
                side: "left",
                icon: "🎉",
                text: "Finálová otázka, výpočty v hlavě a u baru doladíme plán na další týden.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`relative flex items-center mb-12 ${item.side === "left" ? "justify-end" : "justify-start"} gap-6`}
              >
                {item.side === "left" ? (
                  <>
                    <div className="w-5/12 text-right">
                      <h3 className="text-lg font-bold text-neon-cyan">{item.time}</h3>
                      <p className="text-gray-300 font-semibold">{item.title}</p>
                      <p className="text-gray-400 text-sm mt-1">{item.text}</p>
                    </div>
                    <div className="relative w-12 h-12 rounded-full bg-sysmex-900 border-2 border-neon-cyan flex items-center justify-center text-2xl">
                      {item.icon}
                      <div className="absolute inset-0 rounded-full border border-neon-cyan/60 blur-sm" />
                    </div>
                    <div className="w-5/12" />
                  </>
                ) : (
                  <>
                    <div className="w-5/12" />
                    <div className="relative w-12 h-12 rounded-full bg-sysmex-900 border-2 border-neon-magenta flex items-center justify-center text-2xl">
                      {item.icon}
                      <div className="absolute inset-0 rounded-full border border-neon-magenta/60 blur-sm" />
                    </div>
                    <div className="w-5/12">
                      <h3 className="text-lg font-bold text-neon-magenta">{item.time}</h3>
                      <p className="text-gray-300 font-semibold">{item.title}</p>
                      <p className="text-gray-400 text-sm mt-1">{item.text}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

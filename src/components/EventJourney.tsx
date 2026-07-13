import { Flag, Gamepad2, Cake, Music, Trophy, CarFront, Sparkles, Star } from "lucide-react";

const CHECKPOINTS = [
  {
    icon: Flag,
    flag: "Starting Grid",
    title: "Welcome, Little Champion",
    time: "4:00 PM",
    desc: "The birthday crew welcomes every guest. Collect your golden wristband, sign the champion's book and get ready for an unforgettable celebration.",
    accent: "from-amber-400/40 via-primary/30 to-transparent",
    ring: "border-amber-400/50",
    glow: "shadow-[0_0_30px_oklch(0.75_0.19_55/0.55)]",
  },
  {
    icon: Gamepad2,
    flag: "Fun Zone",
    title: "Games & Giggles",
    time: "4:45 PM",
    desc: "Mini races, party challenges, surprise prizes and giant balloon battles. Every guest picks a team colour and joins the fun.",
    accent: "from-fuchsia-400/40 via-accent/30 to-transparent",
    ring: "border-fuchsia-400/50",
    glow: "shadow-[0_0_30px_oklch(0.65_0.2_320/0.55)]",
  },
  {
    icon: Cake,
    flag: "Birthday Pit Stop",
    title: "Cake Cutting Ceremony",
    time: "6:00 PM",
    desc: "The birthday car pulls in beside a ten-candle cake. Sparklers glow, everyone sings, and Aarav makes the wish of the season.",
    accent: "from-rose-400/50 via-amber-300/40 to-transparent",
    hero: true,
    ring: "border-rose-400/50",
    glow: "shadow-[0_0_40px_oklch(0.65_0.25_25/0.65)]",
  },
  {
    icon: Music,
    flag: "Celebration Arena",
    title: "Music, Dance & Memories",
    time: "6:45 PM",
    desc: "Confetti in the air, party lights on the dance floor, a photo booth full of props and gift boxes stacked sky-high.",
    accent: "from-violet-400/40 via-neon-blue/30 to-transparent",
    ring: "border-violet-400/50",
    glow: "shadow-[0_0_30px_oklch(0.55_0.2_280/0.55)]",
  },
  {
    icon: Trophy,
    flag: "Champion's Celebration",
    title: "10 Amazing Years",
    time: "7:30 PM",
    desc: "Fireworks light the finish line. The trophy isn't for winning a race — it's for a decade of joy. Family cheers, gold confetti falls.",
    accent: "from-yellow-300/50 via-mclaren-orange/40 to-transparent",
    ring: "border-yellow-400/50",
    glow: "shadow-[0_0_40px_oklch(0.85_0.15_90/0.65)]",
  },
];

export function EventJourney() {
  return (
    <section id="journey" className="relative overflow-hidden py-28 bg-[#050505]">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(239,68,68,0.15),transparent)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,rgba(234,179,8,0.1),transparent)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.4em] text-primary backdrop-blur shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <Flag className="h-3 w-3" /> Section 03 · Schedule <Flag className="h-3 w-3" />
          </div>
          <h2 className="font-display text-4xl uppercase leading-none text-white md:text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            The Birthday <span className="text-transparent bg-clip-text bg-gradient-to-r from-fire via-primary to-mclaren-orange">Pit Stop Schedule</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Live telemetry from the main event. Five high-speed pit stops filled with games, cake, and celebration.
          </p>
        </div>

        {/* The Track */}
        <div className="relative">
          {/* Animated Neon Track Line */}
          <div className="absolute left-6 top-0 h-[100%] w-[4px] rounded-full md:left-1/2 md:-translate-x-1/2 bg-white/5 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-primary to-transparent animate-[ej-track-flow_3s_linear_infinite]" />
            <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-accent to-transparent animate-[ej-track-flow_3s_linear_infinite_1.5s]" />
          </div>

          <div className="relative space-y-16 md:space-y-28 pt-10">
            {CHECKPOINTS.map((c, i) => {
              const left = i % 2 === 0;
              const Icon = c.icon;
              return (
                <div key={c.title} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${left ? "" : "md:flex-row-reverse"}`}>
                  
                  {/* Glowing Node on Track */}
                  <div className="absolute left-6 z-20 -translate-x-1/2 md:left-1/2">
                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 bg-black/80 backdrop-blur-xl ${c.ring} ${c.glow}`}>
                      <Icon className={`h-7 w-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />
                      <div className="absolute -bottom-8 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] text-white/60">
                        Stop 0{i + 1}
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Card */}
                  <div className={`ml-20 flex-1 w-[calc(100%-5rem)] md:ml-0 md:w-[calc(50%-4rem)] ${left ? "md:text-right" : "md:text-left"}`}>
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-6 md:p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_20px_40px_-20px_rgba(239,68,68,0.4)]">
                      {/* Telemetry Accent Lines */}
                      <div className={`absolute top-0 h-1 w-full bg-gradient-to-r ${c.accent} ${left ? "right-0 bg-gradient-to-l" : "left-0"}`} />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)" }} />
                      
                      <div className={`mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${left ? "md:flex-row-reverse" : ""}`}>
                        <div className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 border border-white/10">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> {c.flag}
                        </div>
                        <div className="font-mono text-sm font-bold uppercase tracking-widest text-primary">{c.time}</div>
                      </div>

                      <h3 className="font-display text-2xl uppercase leading-tight text-white md:text-4xl drop-shadow-md">{c.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">{c.desc}</p>

                      <div className={`mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 ${left ? "md:justify-end" : "md:justify-start"}`}>
                        <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-accent" /> Memories</span>
                        <span className="flex items-center gap-1.5"><Star className="h-3 w-3 text-yellow-400" /> Fun</span>
                        <span className="flex items-center gap-1.5"><CarFront className="h-3 w-3 text-primary" /> Racing</span>
                      </div>

                      {c.hero && (
                        <div className={`mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary/20 to-transparent px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/90 border border-primary/30 ${left ? "md:flex-row-reverse md:from-transparent md:to-primary/20" : ""}`}>
                          <Cake className="h-4 w-4 text-primary animate-pulse" /> Main Event: Cake Cutting
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-[calc(50%-4rem)]" />
                </div>
              );
            })}

            {/* Checkered Finish Line at the end of the track */}
            <div className="relative mt-20 flex flex-col items-center pt-10 pb-10">
              <div className="absolute -top-10 left-6 md:left-1/2 md:-translate-x-1/2 h-16 w-16 flex items-center justify-center">
                <Flag className="h-10 w-10 text-white animate-pulse" />
              </div>
              <div className="h-4 w-64 md:w-96 rounded-sm opacity-60 bg-[repeating-linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff),repeating-linear-gradient(45deg,#fff_25%,#000_25%,#000_75%,#fff_75%,#fff)] bg-[length:20px_20px]" />
              <div className="mt-6 flex items-center gap-3 rounded-md border border-white/20 bg-white/5 px-6 py-3 font-display text-lg uppercase tracking-[0.2em] text-white backdrop-blur shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Finish Line
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes ej-track-flow {
          0% { top: -20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}

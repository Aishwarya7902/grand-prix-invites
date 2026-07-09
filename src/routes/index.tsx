import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flag, MapPin, Phone, MessageCircle, Trophy, Zap, Timer, Users, Gauge, Sparkles, Mail } from "lucide-react";
import heroRace from "@/assets/hero-race.jpg";
import pitLane from "@/assets/pit-lane.jpg";
import helmet from "@/assets/helmet.jpg";
import { CinematicIntro } from "@/components/CinematicIntro";
import { GrandCountdown } from "@/components/GrandCountdown";
import { MemoryWorld } from "@/components/MemoryWorld";
import BlessingWall from "@/components/BlessingWall";

export const Route = createFileRoute("/")({
  component: Index,
});

const RACER_NAME = "Aarav";
const RACE_DATE = "Saturday, 14 December 2026";
const RACE_TIME = "4:00 PM — Green Flag";
const VENUE = "Speedway Grand Ballroom, Bandra";
const DRESS_CODE = "Racing Colors — Red, Orange, Neon";




function SpeedMarquee({ text }: { text: string }) {
  const items = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="relative overflow-hidden border-y border-border bg-carbon py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.concat(items).map((i) => (
          <span key={i} className="mx-8 flex items-center gap-4 font-display text-2xl tracking-widest text-accent">
            <Flag className="h-5 w-5" /> {text}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center border-2 border-primary bg-primary/10 font-mono text-lg font-bold text-primary">
        {num}
      </div>
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Checkpoint {num}</div>
        <h2 className="font-display text-4xl uppercase text-foreground md:text-5xl">{title}</h2>
      </div>
    </div>
  );
}

function DashItem({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="group relative overflow-hidden border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-[var(--shadow-glow)]">
      <div className="absolute right-0 top-0 h-1 w-16 bg-primary" />
      <Icon className="mb-4 h-8 w-8 text-accent" />
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl text-foreground">{value}</div>
    </div>
  );
}

// Dev: always play the intro on every load. To reintroduce "skip for returning
// visitors" later, gate the initial `useState(true)` on a stored flag and set it
// inside `finishIntro`.
const ALWAYS_PLAY_INTRO = true;

function Index() {
  const [intro, setIntro] = useState(ALWAYS_PLAY_INTRO);
  const [rsvpState, setRsvpState] = useState<'idle' | 'animating' | 'confirmed'>('idle');
  
  const finishIntro = () => setIntro(false);
  
  const handleRsvp = () => {
    setRsvpState('animating');
    setTimeout(() => setRsvpState('confirmed'), 1500);
  };

  const checkpoints = [
    {
      emoji: "🏁",
      flag: "Starting Grid",
      title: "Welcome, Little Champion",
      time: "4:00 PM",
      desc: "The birthday crew welcomes every guest. Collect your golden wristband, sign the champion's book and get ready for an unforgettable celebration.",
      accent: "from-amber-400/40 via-primary/30 to-transparent",
    },
    {
      emoji: "🎮",
      flag: "Fun Zone",
      title: "Games & Giggles",
      time: "4:45 PM",
      desc: "Mini races, party challenges, surprise prizes and giant balloon battles. Every guest picks a team colour and joins the fun.",
      accent: "from-fuchsia-400/40 via-accent/30 to-transparent",
    },
    {
      emoji: "🎂",
      flag: "Birthday Pit Stop",
      title: "Cake Cutting Ceremony",
      time: "6:00 PM",
      desc: "The birthday car pulls in beside a ten-candle cake. Sparklers glow, everyone sings, and Aarav makes the wish of the season.",
      accent: "from-rose-400/50 via-amber-300/40 to-transparent",
      hero: true,
    },
    {
      emoji: "🎁",
      flag: "Celebration Arena",
      title: "Music, Dance & Memories",
      time: "6:45 PM",
      desc: "Confetti in the air, party lights on the dance floor, a photo booth full of props and gift boxes stacked sky-high.",
      accent: "from-violet-400/40 via-neon-blue/30 to-transparent",
    },
    {
      emoji: "🏆",
      flag: "Champion's Celebration",
      title: "10 Amazing Years",
      time: "7:30 PM",
      desc: "Fireworks light the finish line. The trophy isn't for winning a race — it's for a decade of joy. Family cheers, gold confetti falls.",
      accent: "from-yellow-300/50 via-mclaren-orange/40 to-transparent",
    },
  ];


  return (
    <div className="relative min-h-screen bg-background">
      {intro && <CinematicIntro racerName={RACER_NAME} onDone={finishIntro} />}

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <img
          src={heroRace}
          alt="Red Formula racing car speeding through neon-lit city"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-x-0 top-0 z-10">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2 font-display text-xl tracking-widest text-foreground">
              <Flag className="h-5 w-5 text-primary" /> GRAND CELEBRATION
            </div>
            <div className="hidden gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex">
              <a href="#invitation" className="hover:text-accent">Invitation</a>
              <a href="#journey" className="hover:text-accent">Race Day</a>
              <a href="#memories" className="hover:text-accent">Hall of Fame</a>
              <a href="#rsvp" className="hover:text-accent">RSVP</a>
            </div>
          </nav>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24">
          <div className="max-w-3xl animate-race-in">
            <div className="mb-6 inline-flex items-center gap-3 border border-primary/60 bg-background/60 px-4 py-2 backdrop-blur">
              <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground">Season 2026 · Round 10</span>
            </div>
            <h1 className="font-display text-6xl uppercase leading-[0.9] text-foreground md:text-8xl">
              {RACER_NAME}'s <br />
              <span className="text-fire">10th Birthday</span> <br />
              Grand Celebration
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              You're on the VIP list, driver. Lock in your helmet, warm up the tyres and prepare for the fastest championship of the year.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#invitation" className="group relative inline-flex items-center gap-3 overflow-hidden bg-primary px-8 py-4 font-display text-lg uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
                <Zap className="h-5 w-5" /> Enter the Championship
                <span className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-full" />
              </a>
              <a href="#rsvp" className="inline-flex items-center gap-2 border border-border bg-background/50 px-6 py-4 font-mono text-xs uppercase tracking-widest text-foreground backdrop-blur hover:border-accent hover:text-accent">
                Get your race pass →
              </a>
            </div>

            <div className="mt-16 grid max-w-2xl grid-cols-3 gap-4 border border-border bg-background/60 p-4 backdrop-blur">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Top Speed</div>
                <div className="font-display text-3xl text-primary">340 <span className="text-sm text-muted-foreground">km/h</span></div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Laps</div>
                <div className="font-display text-3xl text-accent">10</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Podium</div>
                <div className="font-display text-3xl text-foreground">P1</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
              style={{
                top: `${(i * 8) + 5}%`,
                left: 0,
                right: 0,
                animation: `speed-lines ${1 + (i % 3) * 0.4}s linear infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </section>

      <SpeedMarquee text="WELCOME · DRIVER · READY · SET · GO" />

      {/* PIT LANE */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionLabel num="01" title="Welcome to the Party" />
            <div className="relative border border-border bg-card p-8">
              <div className="absolute -top-3 left-8 bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">
                Party Central · Live
              </div>
              <div className="carbon-fiber rounded-sm p-8 text-center">
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Welcome</div>
                <div className="mt-3 font-display text-5xl uppercase text-foreground animate-flicker">
                  Racer, <span className="text-fire">It's Party Time!</span>
                </div>
                <div className="mt-4 font-mono text-sm text-muted-foreground">Cake ready · Balloons up · Fun starts now</div>
              </div>
              <p className="mt-6 text-muted-foreground">
                Step into the party zone! Grab your VIP pass, the games are set up, and {RACER_NAME}'s championship celebration is about to begin.
              </p>
            </div>
          </div>
          <div className="relative">
            <img src={pitLane} alt="Luxury pit lane garage" width={1600} height={1024} loading="lazy" className="w-full border border-border" />
            <div className="absolute -bottom-6 -right-6 border-2 border-accent bg-background px-4 py-3 font-mono text-xs uppercase tracking-widest text-accent shadow-[var(--shadow-orange-glow)]">
              Party Zone · Bay 10
            </div>
          </div>
        </div>
      </section>

      {/* VIP PASS — Telemetry Dashboard + Holographic Credential */}
      <section id="invitation" className="relative overflow-hidden py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionLabel num="02" title="VIP Party Pass" />

          {/* Telemetry Header Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-border bg-carbon/70 px-5 py-3 backdrop-blur">
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: "indicator-blink 1.6s infinite", color: "rgb(52,211,153)" }} />
                Party Link · Active
              </span>
              <span className="hidden sm:inline">Vibes 100%</span>
              <span className="hidden md:inline">Uplink · Party HQ</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              PASS · AARAV-10 · VVIP
            </div>
          </div>

          {/* Telemetry rows */}
          <div className="mb-10 grid gap-px border border-border bg-border">
            {[
              { label: "DATE", value: RACE_DATE, status: "READY", pct: 100, hue: "primary" },
              { label: "TIME", value: RACE_TIME, status: "SET", pct: 100, hue: "accent" },
              { label: "VENUE", value: VENUE, status: "SECURED", pct: 96, hue: "primary" },
              { label: "DRESS CODE", value: DRESS_CODE, status: "LOOKING SHARP", pct: 88, hue: "accent" },
              { label: "RSVP", value: "AWAITING GUEST CONFIRM", status: "PENDING", pct: 42, hue: "primary" },
            ].map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-[110px_1fr_auto] items-center gap-4 bg-card/80 px-5 py-4 backdrop-blur transition-colors hover:bg-card md:grid-cols-[140px_1fr_1fr_auto]"
                style={{ animation: `digit-tick 0.5s ${i * 0.12}s both` }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {row.label}
                </div>
                <div className="font-display text-lg uppercase tracking-wider text-foreground md:text-xl">
                  {row.value}
                </div>
                <div className="hidden h-1.5 w-full max-w-[220px] overflow-hidden bg-background md:block">
                  <div
                    className={`h-full ${row.hue === "primary" ? "bg-primary" : "bg-accent"}`}
                    style={{
                      ["--fill" as string]: `${row.pct}%`,
                      animation: `telemetry-fill 1.4s ${0.2 + i * 0.12}s cubic-bezier(.2,.9,.2,1) both`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${row.status === "PENDING" ? "bg-accent" : "bg-emerald-400"}`}
                    style={{
                      animation: "indicator-blink 1.6s infinite",
                      color: row.status === "PENDING" ? "oklch(0.75 0.19 55)" : "rgb(52,211,153)",
                    }}
                  />
                  <span className={row.status === "PENDING" ? "text-accent" : "text-emerald-400"}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Holographic Credential */}
          <div className="relative mx-auto max-w-3xl" style={{ animation: "credential-float 8s ease-in-out infinite" }}>
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-70 blur-2xl"
                 style={{ background: "radial-gradient(60% 60% at 30% 40%, var(--racing-red), transparent 60%), radial-gradient(50% 50% at 80% 70%, var(--mclaren-orange), transparent 60%)" }} />

            <div className="relative overflow-hidden border border-primary/40 bg-carbon/90 shadow-[var(--shadow-glow)] backdrop-blur">
              {/* Holo foil layer */}
              <div className="pointer-events-none absolute inset-0 holo-foil mix-blend-overlay" style={{ animation: "holo-shine 6s ease-in-out infinite" }} />
              {/* Scanline */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-accent/40 to-transparent"
                     style={{ animation: "scanline 5s linear infinite" }} />
              </div>
              {/* Perforation edge */}
              <div className="pointer-events-none absolute inset-y-0 left-[38%] hidden w-px border-l border-dashed border-border md:block" />

              <div className="relative grid gap-6 p-8 md:grid-cols-[38%_1fr] md:p-10">
                {/* Left — driver identity */}
                <div className="relative">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    <span>◆ Party Pass</span>
                    <span>No. 010</span>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-accent/60 bg-background">
                      <img src={helmet} alt="Driver helmet" loading="lazy" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 holo-foil mix-blend-color-dodge opacity-70" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Birthday Boy
                      </div>
                      <div className="font-display text-3xl uppercase leading-none text-foreground">
                        {RACER_NAME}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                        Turning Ten · Champion Class
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="border border-border bg-background/60 p-3">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Table</div>
                      <div className="font-display text-lg text-foreground">VVIP</div>
                    </div>
                    <div className="border border-border bg-background/60 p-3">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Entry</div>
                      <div className="font-display text-lg text-foreground">Red Carpet</div>
                    </div>
                  </div>

                  {/* Mini radar */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-accent/50 bg-background">
                      <div className="absolute inset-1 rounded-full border border-accent/30" />
                      <div className="absolute inset-3 rounded-full border border-accent/20" />
                      <div
                        className="absolute inset-0 origin-center"
                        style={{
                          background:
                            "conic-gradient(from 0deg, oklch(0.75 0.19 55 / 0.55), transparent 25%)",
                          animation: "radar-sweep 3.5s linear infinite",
                        }}
                      />
                      <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
                    </div>
                    <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.25em] text-muted-foreground">
                      Scanning guest list…<br />
                      <span className="text-accent">VIP verified</span>
                    </div>
                  </div>
                </div>

                {/* Right — event ticket */}
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        VIP Driver Pass
                      </div>
                      <div className="font-display text-2xl uppercase leading-tight text-foreground md:text-3xl">
                        Aarav's 10th Birthday
                      </div>
                      <div className="font-display text-lg uppercase tracking-wider text-fire">
                        Grand Celebration
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Season</div>
                      <div className="font-display text-3xl leading-none text-foreground">2026</div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-px bg-border">
                    <div className="bg-background/70 p-4">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Date</div>
                      <div className="mt-1 font-display text-base text-foreground">{RACE_DATE}</div>
                    </div>
                    <div className="bg-background/70 p-4">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Green Flag</div>
                      <div className="mt-1 font-display text-base text-foreground">{RACE_TIME}</div>
                    </div>
                    <div className="col-span-2 bg-background/70 p-4">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Circuit</div>
                      <div className="mt-1 font-display text-base text-foreground">{VENUE}</div>
                    </div>
                    <div className="col-span-2 bg-background/70 p-4">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Dress Code</div>
                      <div className="mt-1 font-display text-base text-foreground">{DRESS_CODE}</div>
                    </div>
                  </div>

                  {/* Barcode strip */}
                  <div className="mt-6 flex items-end gap-[2px] overflow-hidden">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-foreground/80"
                        style={{
                          width: (i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1) + "px",
                          height: 28 + ((i * 37) % 14) + "px",
                          opacity: i % 7 === 0 ? 0.35 : 0.9,
                        }}
                      />
                    ))}
                    <div className="ml-3 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                      GC · 010 · 2026
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer strip */}
              <div className="relative flex items-center justify-between border-t border-border bg-background/80 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: "indicator-blink 1.6s infinite", color: "rgb(52,211,153)" }} />
                  Credential Verified
                </span>
                <span className="hidden sm:inline">Present at Gate 01 · Non-transferable</span>
                <span className="text-accent">◇ Holo-secured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN — Grand Celebration Race Control */}
      <GrandCountdown targetIso="2026-12-14T16:00:00+05:30" />

      {/* JOURNEY — Birthday Grand Celebration Journey */}
      <section id="journey" className="relative overflow-hidden py-28">
        {/* Warm ambient birthday glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.75_0.19_55/0.22),transparent)] blur-2xl" />
          <div className="absolute bottom-0 left-0 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,oklch(0.62_0.24_25/0.18),transparent)] blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,oklch(0.85_0.16_90/0.16),transparent)] blur-3xl" />
        </div>

        {/* Floating balloons + confetti */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => {
            const palette = ["#f59e0b", "#ef4444", "#ec4899", "#a78bfa", "#22d3ee", "#facc15"];
            const c = palette[i % palette.length];
            return (
              <span
                key={`bal-${i}`}
                className="absolute block"
                style={{
                  left: `${(i * 73) % 100}%`,
                  top: `${((i * 41) % 90) + 5}%`,
                  animation: `bday-float ${8 + (i % 5)}s ease-in-out ${i * 0.4}s infinite`,
                  opacity: 0.55,
                }}
              >
                <span
                  className="block h-6 w-5 rounded-full"
                  style={{ background: `radial-gradient(circle at 30% 30%, #fff6, ${c})`, boxShadow: `0 0 18px ${c}66` }}
                />
                <span className="mx-auto block h-6 w-px" style={{ background: `${c}88` }} />
              </span>
            );
          })}
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={`conf-${i}`}
              className="absolute block h-1.5 w-1.5"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                background: ["#facc15", "#f97316", "#ef4444", "#ec4899", "#a78bfa"][i % 5],
                transform: `rotate(${(i * 47) % 360}deg)`,
                animation: `bday-confetti ${6 + (i % 4)}s linear ${i * 0.15}s infinite`,
                opacity: 0.55,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-amber-300/30 bg-amber-300/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.35em] text-amber-200/90 backdrop-blur">
              <span>🎉</span> Section 03 · The Journey <span>🎂</span>
            </div>
            <h2 className="font-display text-4xl uppercase leading-none text-foreground md:text-6xl">
              The Birthday <span className="text-fire">Grand Celebration</span> Journey
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
              Five checkpoints. One unforgettable evening. Follow the little birthday racer as it winds through every moment of Aarav's tenth year celebration.
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-10 bg-amber-300/60" />
              <span className="text-amber-200/80">Turning Ten · 2026</span>
              <span className="h-px w-10 bg-amber-300/60" />
            </div>
          </div>

          {/* Circuit */}
          <div className="relative">
            {/* Winding track spine (desktop) */}
            <svg
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[280px] -translate-x-1/2 md:block"
              viewBox="0 0 280 1200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="track-glow" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.75 0.19 55)" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="oklch(0.85 0.16 90)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="oklch(0.62 0.24 25)" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path
                d="M140 0 C 40 150, 240 300, 140 450 S 40 750, 140 900 S 220 1080, 140 1200"
                fill="none"
                stroke="oklch(0.75 0.19 55)"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.08"
              />
              <path
                d="M140 0 C 40 150, 240 300, 140 450 S 40 750, 140 900 S 220 1080, 140 1200"
                fill="none"
                stroke="url(#track-glow)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1 14"
                opacity="0.9"
              />
            </svg>

            {/* Mobile vertical soft rail */}
            <div className="absolute left-6 top-0 h-full w-[3px] rounded-full md:hidden" style={{ background: "linear-gradient(to bottom, oklch(0.75 0.19 55), oklch(0.62 0.24 25))", opacity: 0.55 }} />

            <div className="relative space-y-14 md:space-y-24">
              {checkpoints.map((c, i) => {
                const left = i % 2 === 0;
                return (
                  <div key={c.title} className={`relative flex items-center gap-6 md:gap-10 ${left ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Node marker */}
                    <div className="absolute left-6 z-20 -translate-x-1/2 md:left-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 -m-3 rounded-full bg-amber-300/30 blur-md animate-pulse" />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-300/70 bg-gradient-to-br from-background to-carbon text-2xl shadow-[0_0_30px_oklch(0.75_0.19_55/0.55)]">
                          {c.emoji}
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] text-amber-200/70">
                          Stop {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </div>

                    {/* Card */}
                    <div className="ml-20 flex-1 md:ml-0 md:w-[calc(50%-3rem)]">
                      <div className="group relative overflow-hidden rounded-2xl border border-amber-200/20 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-200/50 md:p-8">
                        <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${c.accent} opacity-60`} />
                        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(115deg, transparent 30%, oklch(0.95 0.05 90 / 0.15) 50%, transparent 70%)" }} />
                        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />

                        <div className="relative">
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-200/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-amber-100/90">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
                              {c.flag}
                            </div>
                            <div className="font-mono text-xs uppercase tracking-widest text-amber-200/90">{c.time}</div>
                          </div>

                          <h3 className="font-display text-2xl uppercase leading-tight text-foreground md:text-3xl">{c.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">{c.desc}</p>

                          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/5 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            <span className="flex items-center gap-1.5 text-amber-200/80">🎈 <span>Balloons</span></span>
                            <span className="text-white/20">•</span>
                            <span className="flex items-center gap-1.5 text-rose-200/80">🎁 <span>Surprises</span></span>
                            <span className="text-white/20">•</span>
                            <span className="flex items-center gap-1.5 text-fuchsia-200/80">✨ <span>Memories</span></span>
                          </div>

                          {c.hero && (
                            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400/20 via-rose-400/20 to-amber-400/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-100">
                              ★ Hero Moment · Cake Cutting
                            </div>
                          )}
                        </div>

                        <div className="pointer-events-none absolute -bottom-2 right-4 text-3xl opacity-70 transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-100 md:right-6">
                          🏎️
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                  </div>
                );
              })}

              {/* Finish line finale */}
              <div className="relative flex flex-col items-center pt-6">
                <div className="checker-flag h-3 w-40 rounded-sm opacity-80" />
                <div className="mt-5 flex items-center gap-3 rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-400/10 via-rose-400/10 to-amber-400/10 px-5 py-2 font-display text-sm uppercase tracking-[0.3em] text-amber-100">
                  🎆 Finish Line · Celebrating 10 Years 🎆
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes bday-float {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-24px) rotate(3deg); }
          }
          @keyframes bday-confetti {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
            10% { opacity: 0.7; }
            100% { transform: translateY(140px) rotate(360deg); opacity: 0; }
          }
        `}</style>
      </section>

      {/* MEMORY WORLD — immersive scroll journey through Aarav's years */}
      <MemoryWorld />

      {/* BLESSING WALL — Champions' Blessing Wall */}
      <BlessingWall />

      {/* RSVP */}
      <section id="rsvp" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at center, var(--racing-red), transparent 70%)" }} />
        <div className="relative mx-auto max-w-4xl px-6">
          <SectionLabel num="06" title="Birthday RSVP" />
          <div className="border-2 border-primary bg-card p-10 shadow-[var(--shadow-glow)]">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
              <div className="relative h-40 w-40 shrink-0 border-4 border-accent bg-carbon">
                <img src={helmet} alt="Driver helmet" loading="lazy" className="h-full w-full object-cover" />
                <div className={`absolute inset-x-0 bottom-0 py-1 text-center font-mono text-[10px] uppercase tracking-widest transition-colors duration-500 ${rsvpState === 'confirmed' ? 'bg-emerald-500 text-black' : 'bg-primary/90 text-primary-foreground'}`}>
                  {rsvpState === 'confirmed' ? 'Confirmed' : 'VIP Guest'}
                </div>
              </div>
              <div className="flex-1">
                {rsvpState === 'idle' ? (
                  <>
                    <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Turning 10 · Champion Class</div>
                    <h3 className="mt-2 font-display text-4xl uppercase text-foreground">RSVP to Aarav's 10th Birthday</h3>
                    <p className="mt-3 text-muted-foreground">
                      Hit the button below to confirm your attendance at the biggest celebration of the year. The pit crew will be notified and the gates will open for you!
                    </p>
                    <form className="mt-6 grid gap-3">
                      <button
                        type="button"
                        onClick={handleRsvp}
                        className="group relative overflow-hidden bg-primary px-8 py-4 font-display text-xl uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02]"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <Trophy className="h-5 w-5" /> Join the Celebration
                        </span>
                        <span className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-full" />
                      </button>
                    </form>
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      See you at the party, racer.
                    </div>
                  </>
                ) : rsvpState === 'animating' ? (
                  <div className="relative mt-8 flex h-24 w-full items-center overflow-hidden border border-primary/40 bg-primary/10">
                    <div className="absolute left-0 text-5xl animate-drive-fast drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">🏎️💨</div>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(239,68,68,0.1)_50%,transparent_100%)] animate-scanline" />
                  </div>
                ) : (
                  <div className="relative mt-4 overflow-hidden border-2 border-emerald-500/50 bg-emerald-500/10 p-8 text-center shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-in fade-in zoom-in duration-700">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i} className="absolute block h-2 w-2 bg-emerald-400" 
                              style={{ left: `${(i*27)%100}%`, top: '-10px', animation: `fall ${2+(i%3)}s linear infinite`, animationDelay: `${i*0.15}s`}} />
                      ))}
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-display text-3xl uppercase text-emerald-400">Birthday Pass Secured!</h4>
                      <p className="mt-4 font-mono text-sm uppercase leading-relaxed tracking-widest text-emerald-100">
                        Thank you for RSVPing!<br/>We can't wait to celebrate Aarav's 10th birthday with you! 🎂🎈
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTY HEADQUARTERS */}
      <section className="relative bg-carbon py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel num="07" title="Party Headquarters" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1 - Venue */}
            <a href="#" className="group relative overflow-hidden border-2 border-border bg-black p-6 transition-all duration-500 hover:border-accent hover:shadow-[0_0_30px_rgba(255,107,53,0.2)] hover:-translate-y-1 rounded-lg">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="absolute block h-1.5 w-1.5 bg-accent rounded-full" 
                        style={{ left: `${(i*31)%100}%`, top: '-10px', animation: `fall ${1.5+(i%2)}s linear infinite`, animationDelay: `${i*0.2}s`}} />
                ))}
              </div>
              <div className="relative z-10">
                <MapPin className="mb-4 h-8 w-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">Party Venue</div>
                <div className="mt-2 font-display text-xl text-foreground">{VENUE}</div>
              </div>
            </a>

            {/* Card 2 - WhatsApp */}
            <a href="https://wa.me/910000000000" className="group relative overflow-hidden border-2 border-border bg-black p-6 transition-all duration-500 hover:border-[#25D366] hover:shadow-[0_0_30px_rgba(37,211,102,0.2)] hover:-translate-y-1 rounded-lg">
              <div className="absolute inset-0 bg-[#25D366]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="absolute block h-1.5 w-1.5 bg-[#25D366] rounded-full" 
                        style={{ left: `${(i*31)%100}%`, top: '-10px', animation: `fall ${1.5+(i%2)}s linear infinite`, animationDelay: `${i*0.2}s`}} />
                ))}
              </div>
              <div className="relative z-10">
                <MessageCircle className="mb-4 h-8 w-8 text-[#25D366] group-hover:scale-110 transition-transform duration-300" />
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-[#25D366] transition-colors">WhatsApp</div>
                <div className="mt-2 font-display text-xl text-foreground">Message the Hosts</div>
              </div>
            </a>

            {/* Card 3 - Call */}
            <a href="tel:+910000000000" className="group relative overflow-hidden border-2 border-border bg-black p-6 transition-all duration-500 hover:border-primary hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:-translate-y-1 rounded-lg">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="absolute block h-1.5 w-1.5 bg-primary rounded-full" 
                        style={{ left: `${(i*31)%100}%`, top: '-10px', animation: `fall ${1.5+(i%2)}s linear infinite`, animationDelay: `${i*0.2}s`}} />
                ))}
              </div>
              <div className="relative z-10">
                <Phone className="mb-4 h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Call</div>
                <div className="mt-2 font-display text-xl text-foreground">+91 00000 00000</div>
              </div>
            </a>

            {/* Card 4 - Email */}
            <a href="mailto:party@example.com" className="group relative overflow-hidden border-2 border-border bg-black p-6 transition-all duration-500 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-1 rounded-lg">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="absolute block h-1.5 w-1.5 bg-blue-500 rounded-full" 
                        style={{ left: `${(i*31)%100}%`, top: '-10px', animation: `fall ${1.5+(i%2)}s linear infinite`, animationDelay: `${i*0.2}s`}} />
                ))}
              </div>
              <div className="relative z-10">
                <Mail className="mb-4 h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-blue-500 transition-colors">Email</div>
                <div className="mt-2 font-display text-xl text-foreground">party@example.com</div>
              </div>
            </a>

          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-4 font-display text-3xl tracking-widest text-foreground">
            <Flag className="h-8 w-8 text-primary" /> {RACER_NAME}'S GRAND CELEBRATION · 2026
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground md:text-sm">
            © Race Crew · All laps reserved
          </div>
        </div>
        <div className="mt-12 h-6 checker-flag" />
      </footer>

      <style>{`
        @keyframes drive-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        .animate-drive-fast {
          animation: drive-fast 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

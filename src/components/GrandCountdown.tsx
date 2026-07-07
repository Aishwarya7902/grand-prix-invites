import { useEffect, useMemo, useState } from "react";
import { Sparkles, Trophy, Cake, Users, PartyPopper, Flag } from "lucide-react";

type TimeParts = { days: number; hours: number; minutes: number; seconds: number; totalMs: number };

function getParts(target: number): TimeParts {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    totalMs: diff,
  };
}

/** Flip-board digit — flips whenever the value changes. */
function FlipDigit({ value }: { value: string }) {
  return (
    <span
      key={value}
      className="relative inline-block"
      style={{ animation: "gc-flip 420ms cubic-bezier(.2,.9,.2,1) both" }}
    >
      {value}
    </span>
  );
}

/** Thin gold accent ring rendered behind a unit. */
function ThinRing({ pct, size = 220 }: { pct: number; size?: number }) {
  const stroke = 1.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  return (
    <svg width={size} height={size} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90" aria-hidden>
      <defs>
        <linearGradient id="gc-thin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="oklch(0.92 0.13 90)" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 55)" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(0.85 0.12 85 / 0.10)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#gc-thin)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 700ms cubic-bezier(.2,.9,.2,1)", filter: "drop-shadow(0 0 6px oklch(0.85 0.15 85 / 0.5))" }}
      />
    </svg>
  );
}

function BigUnit({ value, label, pct }: { value: number; label: string; pct: number }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="relative flex flex-col items-center">
      <ThinRing pct={pct} />
      <div
        className="relative font-display leading-none tracking-tight text-transparent tabular-nums"
        style={{
          fontSize: "clamp(4.5rem, 14vw, 11rem)",
          backgroundImage: "linear-gradient(180deg, oklch(0.99 0.04 85) 0%, oklch(0.88 0.13 80) 45%, oklch(0.68 0.18 55) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          textShadow: "0 0 40px oklch(0.75 0.19 55 / 0.35)",
        }}
      >
        <FlipDigit value={str[0]} />
        <FlipDigit value={str[1]} />
      </div>
      <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.5em] text-amber-200/80">
        {label}
      </div>
    </div>
  );
}

const PREP = [
  { label: "Circuit Ready",   icon: Flag,     target: 85 },
  { label: "Decorations",     icon: Sparkles, target: 92 },
  { label: "Cake Ready",      icon: Cake,     target: 78 },
  { label: "Guests Ready",    icon: Users,    target: 100 },
] as const;

function PrepStrip() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 1000), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mx-auto mt-14 w-full max-w-3xl">
      <div className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-amber-200/70">
        Birthday preparations are almost complete
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[oklch(0.82_0.15_85/0.25)] bg-[oklch(0.14_0.02_30/0.5)] p-3 backdrop-blur md:grid-cols-4">
        {PREP.map((p, i) => {
          const drift = Math.sin((tick + i * 3) / 2) * 3;
          const pct = Math.max(0, Math.min(100, p.target + drift));
          const Icon = p.icon;
          return (
            <div key={p.label} className="flex items-center gap-2 rounded-md px-2 py-1.5">
              <Icon className="h-3.5 w-3.5 flex-none text-amber-300/80" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-amber-100/70">
                  <span className="truncate">{p.label}</span>
                  <span className="tabular-nums text-amber-200">{pct.toFixed(0)}%</span>
                </div>
                <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full transition-[width] duration-[1600ms] ease-out"
                    style={{
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, oklch(0.88 0.15 85), oklch(0.72 0.18 55))",
                      boxShadow: "0 0 8px oklch(0.85 0.15 85 / 0.5)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Ambient() {
  const balloons = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        left: `${(i * 97) % 100}%`,
        delay: `${(i * 0.7) % 6}s`,
        dur: `${9 + (i % 5)}s`,
      })),
    []
  );
  const confetti = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${(i * 0.31) % 8}s`,
        dur: `${7 + (i % 6)}s`,
        color: ["#facc15", "#f59e0b", "#fbbf24", "#fde68a", "#fcd34d"][i % 5],
        size: 3 + (i % 3),
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-40 left-1/4 h-[140vh] w-[180px] origin-top opacity-[0.10]"
        style={{
          background: "linear-gradient(180deg, oklch(0.95 0.1 90 / 0.7), transparent 70%)",
          filter: "blur(20px)",
          animation: "gc-sweep-l 11s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -top-40 right-1/4 h-[140vh] w-[180px] origin-top opacity-[0.09]"
        style={{
          background: "linear-gradient(180deg, oklch(0.85 0.15 55 / 0.7), transparent 70%)",
          filter: "blur(20px)",
          animation: "gc-sweep-r 13s ease-in-out infinite",
        }}
      />
      <div className="absolute left-1/2 top-1/3 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.85_0.15_85/0.14),transparent)] blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-40" style={{
        background:
          "radial-gradient(60% 100% at 50% 100%, oklch(0.22 0.02 30) 0%, transparent 70%), linear-gradient(180deg, transparent, oklch(0.08 0.01 30) 90%)",
      }} />

      {balloons.map((b, i) => (
        <div key={`bl-${i}`} className="absolute -bottom-24 opacity-70" style={{ left: b.left, animation: `gc-float ${b.dur} ease-in-out ${b.delay} infinite` }}>
          <div className="relative h-9 w-7 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, oklch(1 0 0 / 0.5), oklch(0.75 0.18 55))", boxShadow: "0 0 14px oklch(0.75 0.18 55 / 0.5)" }} />
          <div className="mx-auto h-14 w-px bg-white/15" />
        </div>
      ))}

      {confetti.map((c, i) => (
        <span
          key={`cf-${i}`}
          className="absolute top-[-10%] block rounded-[1px]"
          style={{
            left: c.left,
            width: c.size,
            height: c.size * 2,
            background: c.color,
            transform: "rotate(20deg)",
            animation: `gc-confetti ${c.dur} linear ${c.delay} infinite`,
            opacity: 0.7,
          }}
        />
      ))}

      <div className="absolute inset-x-0 top-8 flex justify-between px-8 opacity-60">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={`fl-${i}`}
            className="h-1 w-1 rounded-full bg-amber-300"
            style={{ animation: `indicator-blink ${1.4 + (i % 5) * 0.3}s ${(i % 7) * 0.2}s infinite`, boxShadow: "0 0 8px oklch(0.9 0.15 85 / 0.9)" }}
          />
        ))}
      </div>
    </div>
  );
}

function FinaleOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[oklch(0.1_0.02_30/0.85)] backdrop-blur-md" style={{ animation: "gc-fadein 800ms ease-out both" }}>
      <div className="relative">
        <Trophy className="h-24 w-24 text-amber-300 drop-shadow-[0_0_30px_oklch(0.85_0.16_85/0.9)]" />
        <PartyPopper className="absolute -right-6 -top-6 h-8 w-8 text-rose-400" />
      </div>
      <div className="mt-6 font-mono text-xs uppercase tracking-[0.5em] text-amber-200">It's Race Day</div>
      <h3
        className="mt-4 text-center font-display text-5xl uppercase leading-tight text-transparent md:text-7xl"
        style={{
          backgroundImage: "linear-gradient(180deg, oklch(0.98 0.05 85), oklch(0.72 0.2 45))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          textShadow: "0 0 40px oklch(0.75 0.19 55 / 0.5)",
        }}
      >
        Welcome to Aarav's<br />10th Birthday Grand Celebration
      </h3>
      <div className="mt-4 text-sm text-amber-100/80">🎉 The champion has arrived 🎉</div>
    </div>
  );
}

export function GrandCountdown({ targetIso }: { targetIso: string }) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [parts, setParts] = useState<TimeParts>(() => getParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(getParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const finale = parts.totalMs === 0;
  const finalTen = parts.totalMs > 0 && parts.totalMs <= 10_000;

  const secPct = 1 - parts.seconds / 60;
  const minPct = 1 - parts.minutes / 60;
  const hrPct = 1 - parts.hours / 24;
  const dayPct = Math.min(1, Math.max(0, 1 - parts.days / 60));

  return (
    <section
      id="countdown"
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-24"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, oklch(0.18 0.03 45) 0%, oklch(0.09 0.02 30) 55%, oklch(0.06 0.01 260) 100%)",
      }}
    >
      <Ambient />

      <div className={`relative z-10 mx-auto w-full max-w-6xl px-6 ${finalTen ? "animate-pulse-glow" : ""}`}>
        {/* Compact header — gives breathing room above the timer */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[oklch(0.82_0.15_85/0.4)] bg-[oklch(0.14_0.02_30/0.55)] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.5em] text-amber-200/90 backdrop-blur">
            <Sparkles className="h-3 w-3" /> 🎉 Aarav Turns 10
          </div>
          <h2
            className="font-display text-3xl uppercase leading-[1] text-transparent md:text-5xl"
            style={{
              backgroundImage: "linear-gradient(180deg, oklch(0.99 0.03 85), oklch(0.78 0.17 55))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 0 24px oklch(0.75 0.19 55 / 0.3)",
            }}
          >
            Aarav's 10th Birthday
            <br />
            <span className="text-amber-100/70 text-xl md:text-2xl tracking-[0.4em]">— starts in —</span>
          </h2>
        </div>

        {/* THE HERO — huge scoreboard */}
        <div className="relative">
          {/* Soft gold underlay */}
          <div className="pointer-events-none absolute inset-x-8 top-1/2 h-40 -translate-y-1/2 rounded-[40px] bg-[radial-gradient(closest-side,oklch(0.85_0.15_85/0.14),transparent)] blur-2xl" />

          <div className="relative grid grid-cols-4 items-start gap-2 md:gap-6">
            <BigUnit value={parts.days}    label="Days"    pct={dayPct} />
            <BigUnit value={parts.hours}   label="Hours"   pct={hrPct} />
            <BigUnit value={parts.minutes} label="Minutes" pct={minPct} />
            <BigUnit value={parts.seconds} label="Seconds" pct={secPct} />
          </div>

          {/* Thin gold rules top & bottom */}
          <div className="mx-auto mt-6 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        </div>

        {/* Supporting message */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-base text-amber-100/80 md:text-lg">
          Every second brings us closer to Aarav's biggest celebration.
        </p>

        {/* Secondary preparation strip — below the hero */}
        <PrepStrip />
      </div>

      {finale && <FinaleOverlay />}

      <style>{`
        @keyframes gc-flip {
          0%   { transform: rotateX(-90deg) translateY(-4px); opacity: 0; filter: blur(2px); }
          60%  { transform: rotateX(10deg); opacity: 1; filter: blur(0); }
          100% { transform: rotateX(0);    opacity: 1; }
        }
        @keyframes gc-float {
          0%   { transform: translateY(0) translateX(0); }
          50%  { transform: translateY(-40vh) translateX(20px); }
          100% { transform: translateY(-90vh) translateX(-10px); opacity: 0; }
        }
        @keyframes gc-confetti {
          0%   { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(720deg); }
        }
        @keyframes gc-sweep-l {
          0%, 100% { transform: rotate(-14deg); }
          50%      { transform: rotate(10deg); }
        }
        @keyframes gc-sweep-r {
          0%, 100% { transform: rotate(12deg); }
          50%      { transform: rotate(-8deg); }
        }
        @keyframes gc-fadein {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

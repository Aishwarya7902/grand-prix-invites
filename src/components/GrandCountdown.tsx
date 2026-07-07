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

/** Digital flip-board style digit — flips whenever the value changes. */
function FlipDigit({ value }: { value: string }) {
  return (
    <span
      key={value}
      className="relative inline-block"
      style={{
        animation: "gc-flip 420ms cubic-bezier(.2,.9,.2,1) both",
        backgroundImage: "linear-gradient(180deg, oklch(0.98 0.05 85), oklch(0.78 0.16 65))",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        textShadow: "0 0 24px oklch(0.75 0.19 55 / 0.35)",
      }}
    >
      {value}
    </span>
  );
}

function ProgressRing({ pct, size = 168, stroke = 3, color = "gold" }: { pct: number; size?: number; stroke?: number; color?: "gold" | "red" | "orange" | "neon" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const stops: Record<string, [string, string]> = {
    gold:   ["oklch(0.88 0.15 90)",  "oklch(0.72 0.19 55)"],
    red:    ["oklch(0.72 0.24 25)",  "oklch(0.55 0.22 25)"],
    orange: ["oklch(0.82 0.18 55)",  "oklch(0.62 0.20 40)"],
    neon:   ["oklch(0.78 0.19 230)", "oklch(0.55 0.20 260)"],
  };
  const [a, b] = stops[color];
  const gid = `gc-ring-${color}`;
  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.06)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={`url(#${gid})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 700ms cubic-bezier(.2,.9,.2,1)" }}
      />
    </svg>
  );
}

function CountModule({
  value,
  label,
  pct,
  color,
}: {
  value: number;
  label: string;
  pct: number;
  color: "gold" | "red" | "orange" | "neon";
}) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="group relative">
      <div
        className="relative flex h-44 w-44 items-center justify-center rounded-2xl border border-[oklch(0.82_0.15_85/0.55)] bg-[linear-gradient(160deg,oklch(0.22_0.03_45/0.55),oklch(0.12_0.02_30/0.7))] shadow-[0_20px_60px_-25px_oklch(0.72_0.19_55/0.6),inset_0_1px_0_oklch(1_0_0/0.08)] backdrop-blur-xl transition-transform duration-500 group-hover:[transform:perspective(900px)_rotateX(6deg)_rotateY(-6deg)]"
      >
        {/* Holographic sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-70"
        >
          <div
            className="absolute -inset-y-4 -left-1/3 w-1/2 rotate-12 bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.14),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ animation: "gc-shine 3.6s ease-in-out infinite" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_-10%,oklch(0.88_0.15_90/0.18),transparent_60%)]" />
        </div>

        {/* Progress ring */}
        <ProgressRing pct={pct} color={color} />

        {/* LED accent bar */}
        <div className="absolute left-4 right-4 top-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-[oklch(0.85_0.12_85)]">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-emerald-400" style={{ animation: "indicator-blink 1.6s infinite" }} />
            LIVE
          </span>
          <span className="opacity-60">CH · {label.slice(0, 2)}</span>
        </div>

        {/* Number */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="font-display text-6xl leading-none text-transparent"
            style={{
              backgroundImage: "linear-gradient(180deg, oklch(0.98 0.05 85), oklch(0.78 0.16 65))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 0 24px oklch(0.75 0.19 55 / 0.35)",
            }}
          >
            <FlipDigit value={str[0]} />
            <FlipDigit value={str[1]} />
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[oklch(0.82_0.08_85)]">
            {label}
          </div>
        </div>

        {/* Corner filaments */}
        <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-[oklch(0.85_0.15_85/0.7)]" />
        <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-[oklch(0.85_0.15_85/0.7)]" />
        <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[oklch(0.85_0.15_85/0.7)]" />
        <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[oklch(0.85_0.15_85/0.7)]" />
      </div>
    </div>
  );
}

const PREP = [
  { label: "Birthday Circuit", icon: Flag,        target: 85,  color: "from-amber-300 to-rose-500" },
  { label: "Decorations",      icon: Sparkles,    target: 92,  color: "from-fuchsia-400 to-amber-300" },
  { label: "Cake Ready",       icon: Cake,        target: 78,  color: "from-rose-400 to-orange-400" },
  { label: "Guests Ready",     icon: Users,       target: 100, color: "from-emerald-300 to-amber-300" },
] as const;

function PrepPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 1000), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mx-auto mb-10 w-full max-w-4xl rounded-2xl border border-[oklch(0.82_0.15_85/0.35)] bg-[oklch(0.14_0.02_30/0.6)] p-5 shadow-[0_20px_60px_-30px_oklch(0.72_0.19_55/0.5)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.82_0.08_85)]">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: "indicator-blink 1.6s infinite" }} />
          Race Control · Preparation Feed
        </span>
        <span className="opacity-60">Aarav · GC-2026-010</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {PREP.map((p, i) => {
          // Small looping fluctuation around target so it feels alive
          const drift = Math.sin((tick + i * 3) / 2) * 3;
          const pct = Math.max(0, Math.min(100, p.target + drift));
          const Icon = p.icon;
          return (
            <div key={p.label} className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[oklch(0.82_0.15_85/0.14)] text-[oklch(0.88_0.14_85)]">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[oklch(0.82_0.08_85)]">
                  <span>{p.label}</span>
                  <span className="tabular-nums text-[oklch(0.92_0.05_85)]">{pct.toFixed(0)}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/40">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${p.color} transition-[width] duration-[1600ms] ease-out`}
                    style={{ width: `${pct}%`, boxShadow: "0 0 12px oklch(0.85 0.15 85 / 0.4)" }}
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
      Array.from({ length: 10 }).map((_, i) => ({
        left: `${(i * 97) % 100}%`,
        delay: `${(i * 0.7) % 6}s`,
        dur: `${8 + (i % 5)}s`,
        color: ["#f59e0b", "#ef4444", "#ec4899", "#facc15", "#a78bfa"][i % 5],
      })),
    []
  );
  const confetti = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${(i * 0.31) % 8}s`,
        dur: `${6 + (i % 6)}s`,
        color: ["#facc15", "#f59e0b", "#ef4444", "#fbbf24", "#fde68a"][i % 5],
        size: 3 + (i % 4),
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Stadium searchlights */}
      <div
        className="absolute -top-40 left-1/4 h-[140vh] w-[180px] origin-top opacity-[0.14]"
        style={{
          background: "linear-gradient(180deg, oklch(0.95 0.1 90 / 0.7), transparent 70%)",
          filter: "blur(18px)",
          animation: "gc-sweep-l 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -top-40 right-1/4 h-[140vh] w-[180px] origin-top opacity-[0.12]"
        style={{
          background: "linear-gradient(180deg, oklch(0.85 0.15 55 / 0.7), transparent 70%)",
          filter: "blur(18px)",
          animation: "gc-sweep-r 11s ease-in-out infinite",
        }}
      />
      {/* Warm gold halo */}
      <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.85_0.15_85/0.18),transparent)] blur-2xl" />
      <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,oklch(0.62_0.24_25/0.18),transparent)] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,oklch(0.72_0.19_230/0.14),transparent)] blur-3xl" />

      {/* Distant stadium silhouette */}
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-40" style={{
        background:
          "radial-gradient(60% 100% at 50% 100%, oklch(0.22 0.02 30) 0%, transparent 70%), linear-gradient(180deg, transparent, oklch(0.09 0.01 30) 90%)",
      }} />

      {/* Balloons */}
      {balloons.map((b, i) => (
        <div key={`bl-${i}`} className="absolute -bottom-24" style={{ left: b.left, animation: `gc-float ${b.dur} ease-in-out ${b.delay} infinite` }}>
          <div className="relative h-10 w-8 rounded-full opacity-80" style={{ background: `radial-gradient(circle at 30% 30%, oklch(1 0 0 / 0.6), ${b.color})`, boxShadow: `0 0 18px ${b.color}66` }} />
          <div className="mx-auto h-16 w-px bg-white/20" />
        </div>
      ))}

      {/* Confetti */}
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
            opacity: 0.85,
          }}
        />
      ))}

      {/* Fairy lights row */}
      <div className="absolute inset-x-0 top-8 flex justify-between px-8 opacity-70">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={`fl-${i}`}
            className="h-1.5 w-1.5 rounded-full bg-amber-300"
            style={{ animation: `indicator-blink ${1.4 + (i % 5) * 0.3}s ${(i % 7) * 0.2}s infinite`, boxShadow: "0 0 10px oklch(0.9 0.15 85 / 0.9)" }}
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
      <h3 className="mt-4 text-center font-display text-5xl uppercase leading-tight text-transparent md:text-7xl"
        style={{
          backgroundImage: "linear-gradient(180deg, oklch(0.98 0.05 85), oklch(0.72 0.2 45))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          textShadow: "0 0 40px oklch(0.75 0.19 55 / 0.5)",
        }}>
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

  // Rings: fraction of the *next larger* unit
  const secPct = 1 - parts.seconds / 60;
  const minPct = 1 - parts.minutes / 60;
  const hrPct = 1 - parts.hours / 24;
  // Days ring: progress toward event across the last ~60 days window
  const dayWindow = 60;
  const dayPct = Math.min(1, Math.max(0, 1 - parts.days / dayWindow));

  return (
    <section
      id="countdown"
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-24"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, oklch(0.18 0.03 45) 0%, oklch(0.09 0.02 30) 55%, oklch(0.06 0.01 260) 100%)",
      }}
    >
      {/* Carbon + gold texture wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.9 0.14 85) 0 1px, transparent 1px 6px), repeating-linear-gradient(-45deg, oklch(0.9 0.14 85) 0 1px, transparent 1px 6px)",
        }}
      />
      <Ambient />

      <div className={`relative z-10 mx-auto w-full max-w-6xl px-6 ${finalTen ? "animate-pulse-glow" : ""}`}>
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[oklch(0.82_0.15_85/0.5)] bg-[oklch(0.14_0.02_30/0.6)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-200 backdrop-blur">
            <Sparkles className="h-3 w-3" /> Grand Celebration · Race Control
          </div>
          <h2 className="font-display text-4xl uppercase leading-tight text-transparent md:text-6xl"
            style={{
              backgroundImage: "linear-gradient(180deg, oklch(0.98 0.05 85), oklch(0.72 0.2 55))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 0 30px oklch(0.75 0.19 55 / 0.35)",
            }}>
            The Grand Celebration Starts In
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-amber-100/70 md:text-base">
            Every second brings us closer to celebrating Aarav's 10th Birthday Grand Celebration.
          </p>
        </div>

        {/* Preparation panel */}
        <PrepPanel />

        {/* Countdown modules */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 place-items-center gap-6 md:grid-cols-4">
          <CountModule value={parts.days}    label="Days"    pct={dayPct} color="gold" />
          <CountModule value={parts.hours}   label="Hours"   pct={hrPct}  color="orange" />
          <CountModule value={parts.minutes} label="Minutes" pct={minPct} color="red" />
          <CountModule value={parts.seconds} label="Seconds" pct={secPct} color="neon" />
        </div>

        {/* Footer credential strip */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-between gap-3 rounded-xl border border-[oklch(0.82_0.15_85/0.3)] bg-[oklch(0.14_0.02_30/0.55)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-200/80 backdrop-blur">
          <span className="flex items-center gap-2">
            <Flag className="h-3 w-3 text-amber-300" /> Circuit · Aarav's 10 · Season 2026
          </span>
          <span className="hidden sm:inline">Green Flag · Saturday 14 Dec · 4:00 PM</span>
          <span className="text-amber-300">◇ Holo-Secured</span>
        </div>
      </div>

      {finale && <FinaleOverlay />}

      {/* Scoped keyframes */}
      <style>{`
        @keyframes gc-flip {
          0%   { transform: rotateX(-90deg) translateY(-4px); opacity: 0; filter: blur(2px); }
          60%  { transform: rotateX(10deg); opacity: 1; filter: blur(0); }
          100% { transform: rotateX(0);    opacity: 1; }
        }
        @keyframes gc-shine {
          0%, 100% { transform: translateX(-30%) rotate(12deg); }
          50%      { transform: translateX(260%) rotate(12deg); }
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

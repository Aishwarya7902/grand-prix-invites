import { useEffect, useMemo, useState } from "react";

/**
 * Story-driven cinematic intro (~18s).
 *
 * Narrative arc:
 *   Championship Announcement → Champion Found → Car Arrives →
 *   Race Progression → Finish Line & Fireworks → "10 Amazing Years" →
 *   Birthday Invitation Reveal.
 *
 * The race is a storytelling device. The birthday is the destination.
 */

type StageKey =
  | "announce"   // stadium LED powers on: "Grand Prix Championship — Today's Special Event"
  | "champion"   // "Searching for today's champion…" → "Champion Found · Driver #10 · AARAV"
  | "arrival"    // Car #10 rolls in with birthday livery
  | "lights"     // F1 start lights → GO
  | "race"       // Progression through Training → Mountain → City → Final Straight
  | "finish"     // Finish line, fireworks, "CHAMPION · DRIVER #10 · AARAV"
  | "years"      // "Celebrating 10 Amazing Years"
  | "reveal";    // Welcome to AARAV's 10th Birthday Grand Prix (with paddock banners)

// Reveal stage has no end — it holds until the user clicks the CTA.
const STAGES: { key: StageKey; at: number; end: number }[] = [
  { key: "announce", at:     0, end:  2200 },
  { key: "champion", at:  2000, end:  4600 },
  { key: "arrival",  at:  4400, end:  6400 },
  { key: "lights",   at:  6200, end:  7800 },
  { key: "race",     at:  7600, end: 10600 },
  { key: "finish",   at: 10400, end: 12200 },
  { key: "years",    at: 12000, end: 13400 },
  { key: "reveal",   at: 13200, end: 10_000_000 },
];
const CTA_READY_AT = 14200; // when the title has fully settled
const CELEBRATION_MS = 3600;
const FADE = 550;
const SKIP_AT = 2500;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

const CIRCUITS = [
  { label: "STAGE 01", loc: "TRAINING TRACK" },
  { label: "STAGE 02", loc: "MOUNTAIN PASS" },
  { label: "STAGE 03", loc: "CITY CIRCUIT" },
  { label: "STAGE 04", loc: "FINAL STRAIGHT" },
];

function useElapsed(active: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setT(now - start);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return t;
}

export function CinematicIntro({ onDone, racerName }: { onDone: () => void; racerName: string }) {
  const [running, setRunning] = useState(true);
  const t = useElapsed(running);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShowSkip(true), SKIP_AT);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setRunning(false);
      onDone();
    }, TOTAL);
    return () => clearTimeout(id);
  }, [onDone]);

  const opacityFor = (key: StageKey) => {
    const s = STAGES.find((x) => x.key === key)!;
    if (t < s.at || t > s.end) return 0;
    if (t < s.at + FADE) return (t - s.at) / FADE;
    if (t > s.end - FADE) return Math.max(0, (s.end - t) / FADE);
    return 1;
  };
  const stageProgress = (key: StageKey) => {
    const s = STAGES.find((x) => x.key === key)!;
    return Math.max(0, Math.min(1, (t - s.at) / (s.end - s.at)));
  };

  // F1 lights: 5 reds fill 0–60%, hold, GO at 90%
  const light = (() => {
    const p = stageProgress("lights");
    if (p < 0.6) return Math.min(5, Math.floor((p / 0.6) * 5) + 1);
    if (p < 0.9) return 5;
    return 6;
  })();

  const circuit = Math.min(CIRCUITS.length - 1, Math.floor(stageProgress("race") * CIRCUITS.length));
  const raceSpeed = 120 + Math.round(stageProgress("race") * 220); // 120 → 340
  const lapPct = Math.round(stageProgress("race") * 100);

  // champion phase micro-states
  const champP = stageProgress("champion");
  const champPhase: "search" | "match" | "reveal" =
    champP < 0.45 ? "search" : champP < 0.7 ? "match" : "reveal";

  const skip = () => {
    setRunning(false);
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-foreground">
      {/* SKIP */}
      <button
        onClick={skip}
        className="absolute right-4 top-4 z-50 border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.35em] text-white/70 backdrop-blur transition-all hover:border-white/60 hover:text-white"
        style={{
          opacity: showSkip ? 1 : 0,
          transform: showSkip ? "translateY(0)" : "translateY(-6px)",
          transition: `opacity 600ms ${EASE}, transform 600ms ${EASE}, border-color 200ms, color 200ms`,
          pointerEvents: showSkip ? "auto" : "none",
        }}
      >
        Skip Intro →
      </button>

      {/* Persistent vignette */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%)" }} />

      {/* ─────────── 1 · ANNOUNCEMENT (Stadium LED powers on) ─────────── */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: opacityFor("announce"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(30,10,10,0.55), #000 70%)" }} />
        {/* stadium LED board */}
        <div className="relative mx-auto w-[92%] max-w-3xl"
          style={{ animation: `ci-led-boot 1600ms ${EASE} both` }}>
          <div className="border-2 border-primary/60 bg-black p-8 shadow-[0_0_80px_rgba(255,60,40,0.35)]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,60,40,0.05) 0 2px, transparent 2px 4px)",
            }}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> LIVE
              </span>
              <span>SEASON 2026 · ROUND 10</span>
            </div>
            <div className="mt-6 text-center font-display uppercase leading-[0.95]"
              style={{ textShadow: "0 0 24px rgba(255,60,40,0.7)" }}>
              <div className="text-3xl text-fire md:text-5xl">GRAND PRIX</div>
              <div className="mt-1 text-3xl text-white md:text-5xl">CHAMPIONSHIP</div>
            </div>
            <div className="mt-6 border-t border-primary/30 pt-4 text-center font-mono text-xs uppercase tracking-[0.5em] text-accent">
              Today&apos;s Special Event
            </div>
            {/* scanlines */}
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)" }} />
          </div>
          <div className="absolute -bottom-6 left-1/2 h-2 w-40 -translate-x-1/2 checker-flag opacity-70" />
        </div>
      </div>

      {/* ─────────── 2 · CHAMPION FOUND ─────────── */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: opacityFor("champion"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(30,10,10,0.75), #000 70%)" }} />
        <div className="relative w-[92%] max-w-2xl">
          {/* SEARCH */}
          {champPhase === "search" && (
            <div style={{ animation: `ci-line-in 450ms ${EASE} both` }}>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em] text-accent">
                <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                Championship Database
              </div>
              <div className="font-display text-2xl uppercase text-white md:text-4xl">
                Searching for today&apos;s champion
                <span className="text-fire">…</span>
              </div>
              <div className="mt-6 h-1.5 w-full overflow-hidden border border-white/15 bg-black">
                <div className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                  style={{ width: `${Math.min(100, (champP / 0.45) * 100)}%`, transition: `width 200ms linear` }} />
              </div>
              <div className="mt-3 space-y-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <div>▸ Scanning grid · 128 drivers</div>
                <div>▸ Cross-referencing calendar · birthday flag</div>
                <div>▸ Match probability rising…</div>
              </div>
            </div>
          )}
          {/* MATCH */}
          {champPhase === "match" && (
            <div style={{ animation: `ci-line-in 350ms ${EASE} both` }}>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em] text-accent">
                Match Detected
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-6">
                <div className="relative flex h-24 w-24 items-center justify-center border-2 border-primary bg-black md:h-32 md:w-32"
                  style={{ boxShadow: "0 0 40px rgba(255,60,40,0.5)" }}>
                  <div className="font-display text-4xl text-fire md:text-6xl">#10</div>
                  <div className="absolute -top-2 left-2 border border-accent bg-black px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-accent">
                    CAR
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">Champion Profile</div>
                  <div className="font-display text-2xl uppercase text-white md:text-3xl">Verifying identity</div>
                  <div className="mt-3 space-y-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                    <div>▓▓▓▓▓▓▓▓▓░ 92%</div>
                    <div className="text-white/50">Age · 10 · confirmed</div>
                    <div className="text-white/50">Class · Birthday Champion</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* REVEAL */}
          {champPhase === "reveal" && (
            <div className="text-center" style={{ animation: `ci-title 700ms ${EASE} both` }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent md:text-xs">Champion Found</div>
              <div className="mt-3 font-mono text-xs uppercase tracking-[0.4em] text-white/60">Driver #10</div>
              <div className="mt-4 font-display text-6xl uppercase leading-[0.9] text-white md:text-8xl"
                style={{ textShadow: "0 0 40px rgba(255,60,40,0.6)" }}>
                {racerName.toUpperCase()}
              </div>
              <div className="mx-auto mt-6 h-1 w-40 checker-flag opacity-80" />
            </div>
          )}
        </div>
      </div>

      {/* ─────────── 3 · CAR ARRIVAL (with birthday livery) ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("arrival"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #0a0505 0%, #1a0a0a 60%, #050505 100%)" }} />
        {/* pit lane light strips */}
        {[25, 50, 75].map((y, i) => (
          <div key={i} className="absolute inset-x-0 h-px"
            style={{
              top: `${y}%`,
              background: "linear-gradient(90deg, transparent, rgba(255,60,40,0.6), transparent)",
              animation: `ci-strip 1400ms ${EASE} ${i * 120}ms both`,
            }} />
        ))}
        {/* fog / smoke */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="absolute h-24 w-24 rounded-full bg-white/8 blur-2xl"
            style={{
              left: `${10 + i * 9}%`,
              bottom: `${(i * 17) % 35}%`,
              animation: `ci-smoke-drift ${4 + (i % 3)}s ${EASE} ${i * 0.15}s infinite`,
            }} />
        ))}
        {/* rolling car (right → center) */}
        <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2"
          style={{ animation: `ci-arrive 2200ms ${EASE} both` }}>
          {/* car "silhouette" plate with birthday livery */}
          <div className="relative flex h-24 w-64 items-center justify-center border-2 border-primary bg-gradient-to-r from-primary via-fire to-accent shadow-[0_20px_60px_rgba(255,60,40,0.5)]">
            {/* confetti decals */}
            {[15, 40, 65, 82].map((x, i) => (
              <span key={i} className="absolute h-2 w-2 rotate-45"
                style={{ left: `${x}%`, top: `${15 + (i * 17) % 60}%`, background: ["#fff", "#00ff88", "#ffa040", "#fff"][i] }} />
            ))}
            <div className="absolute inset-y-2 left-2 w-2 checker-flag opacity-90" />
            <div className="absolute inset-y-2 right-2 w-2 checker-flag opacity-90" />
            <div className="font-display text-5xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">#10</div>
            <div className="absolute -top-3 right-4 border border-white bg-black px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-white">
              BIRTHDAY CHAMPION
            </div>
          </div>
          {/* ground shadow */}
          <div className="mx-auto mt-2 h-3 w-72 rounded-full bg-black/70 blur-md" />
        </div>
        {/* label */}
        <div className="absolute inset-x-0 top-10 text-center"
          style={{ animation: `ci-line-in 700ms ${EASE} 300ms both` }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent">Car #10 Entering the Grid</div>
          <div className="mt-1 font-display text-2xl uppercase text-white md:text-3xl">{racerName.toUpperCase()} · CHAMPION LIVERY</div>
        </div>
      </div>

      {/* ─────────── 4 · RACE START LIGHTS ─────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: opacityFor("lights"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${light === 6 ? "rgba(0,210,106,0.35)" : "rgba(255,60,40,0.22)"}, transparent 60%)`,
            transition: `background 400ms ${EASE}`,
          }} />
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">Formation Complete</div>
        <div className="mt-6 flex gap-3 md:gap-5">
          {[0, 1, 2, 3, 4].map((i) => {
            const on = light !== 6 && i < light;
            const green = light === 6;
            return (
              <div key={i} className="flex h-16 w-12 items-center justify-center rounded-md border border-white/10 bg-black md:h-20 md:w-16">
                <div
                  className="h-10 w-10 rounded-full md:h-12 md:w-12"
                  style={{
                    background: green ? "#00ff88" : on ? "#ff2020" : "#1a0505",
                    boxShadow: green
                      ? "0 0 34px #00ff88, 0 0 70px #00ff88"
                      : on
                      ? "0 0 28px #ff2020, 0 0 55px #ff2020"
                      : "inset 0 0 8px rgba(255,255,255,0.05)",
                    transition: `background 260ms ${EASE}, box-shadow 260ms ${EASE}`,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-10 h-20">
          {light === 6 && (
            <div className="font-display text-6xl uppercase md:text-8xl"
              style={{ color: "#00ff88", textShadow: "0 0 50px #00ff88", animation: `ci-go 700ms ${EASE} both` }}>
              GO
            </div>
          )}
        </div>
      </div>

      {/* ─────────── 5 · RACE PROGRESSION ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("race"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <CircuitScene index={circuit} />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-6 top-6 border border-primary/40 bg-black/50 px-3 py-2 backdrop-blur">
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Speed KM/H</div>
            <div className="font-display text-3xl text-fire tabular-nums">{raceSpeed}</div>
          </div>
          <div className="absolute right-6 top-6 border border-accent/40 bg-black/50 px-3 py-2 text-right backdrop-blur">
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Progress</div>
            <div className="font-display text-2xl text-accent tabular-nums">{lapPct}%</div>
          </div>
          <div className="absolute bottom-6 left-6">
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Journey</div>
            <div className="mt-1 flex items-center gap-1.5">
              {CIRCUITS.map((_, i) => (
                <div key={i} className="h-1 w-8 border border-white/20"
                  style={{ background: i <= circuit ? "#ff3c28" : "transparent" }} />
              ))}
            </div>
          </div>
          <div className="absolute left-1/2 top-6 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">
            ◉ CAR #10 · {CIRCUITS[circuit].label}
          </div>
        </div>
      </div>

      {/* ─────────── 6 · FINISH LINE + FIREWORKS ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("finish"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(255,60,40,0.4), #000 70%)" }} />
        {/* checker banner sweeps down */}
        <div className="absolute inset-x-0 top-0 h-20 checker-flag"
          style={{ animation: `ci-banner 900ms ${EASE} both` }} />
        <div className="absolute inset-x-0 bottom-0 h-20 checker-flag"
          style={{ animation: `ci-banner 900ms ${EASE} both` }} />
        {/* fireworks */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute h-4 w-4 rounded-full"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 15}%`,
              background: ["#ff3c28", "#ffa040", "#00ff88", "#fff", "#ffcc40"][i],
              boxShadow: `0 0 60px 20px ${["#ff3c28", "#ffa040", "#00ff88", "#fff", "#ffcc40"][i]}`,
              animation: `ci-firework 1600ms ${EASE} ${i * 180}ms both`,
            }} />
        ))}
        {/* confetti */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute h-2 w-1"
            style={{
              left: `${(i * 37) % 100}%`,
              top: "-5%",
              background: ["#ff3c28", "#ffa040", "#ffffff", "#00ff88"][i % 4],
              animation: `ci-confetti ${2.4 + (i % 3) * 0.4}s linear ${i * 0.04}s infinite`,
            }} />
        ))}
        {/* Champion LED */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ animation: `ci-title 900ms ${EASE} 400ms both` }}>
          <div className="border-4 border-primary bg-black px-10 py-8 text-center shadow-[0_0_120px_rgba(255,60,40,0.6)]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,60,40,0.05) 0 2px, transparent 2px 4px)" }}>
            <div className="font-display text-6xl md:text-7xl">🏆</div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.5em] text-accent">Race Complete</div>
            <div className="mt-3 font-display text-4xl uppercase text-white md:text-6xl"
              style={{ textShadow: "0 0 30px rgba(255,60,40,0.7)" }}>
              CHAMPION
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-[0.4em] text-white/70">Driver #10</div>
            <div className="mt-2 font-display text-5xl uppercase text-fire md:text-7xl"
              style={{ textShadow: "0 0 40px rgba(255,60,40,0.8)" }}>
              {racerName.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── 7 · CELEBRATING 10 AMAZING YEARS ─────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: opacityFor("years"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(60,20,20,0.7), #000 70%)" }} />
        {/* soft confetti drift */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute h-2 w-1"
            style={{
              left: `${(i * 53) % 100}%`,
              top: "-5%",
              background: ["#ff3c28", "#ffa040", "#ffffff", "#00ff88"][i % 4],
              animation: `ci-confetti ${4 + (i % 3)}s linear ${i * 0.1}s infinite`,
              opacity: 0.7,
            }} />
        ))}
        <div className="relative text-center" style={{ animation: `ci-title 900ms ${EASE} both` }}>
          <div className="font-mono text-xs uppercase tracking-[0.5em] text-accent">Celebrating</div>
          <div className="mt-4 font-display uppercase leading-[0.9] text-white">
            <span className="block text-8xl text-fire drop-shadow-[0_0_40px_rgba(255,60,40,0.7)] md:text-[10rem]">10</span>
            <span className="mt-2 block text-3xl text-white md:text-5xl">Amazing Years</span>
          </div>
          <div className="mx-auto mt-6 h-1 w-40 checker-flag opacity-80" />
        </div>
      </div>

      {/* ─────────── 8 · INVITATION REVEAL (paddock + banners) ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("reveal"), transition: `opacity ${FADE}ms ${EASE}` }}>
        {/* searchlights */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute left-1/2 top-0 h-[120%] w-40 origin-top -translate-x-1/2"
            style={{
              background: "linear-gradient(180deg, rgba(255,220,150,0.35), transparent 70%)",
              animation: `ci-search 5s ${EASE} ${i * 0.5}s infinite`,
              transform: `translateX(-50%) rotate(${(i - 1) * 20}deg)`,
              filter: "blur(6px)",
            }} />
        ))}
        {/* stadium floor / crowd bar */}
        <div className="absolute inset-x-0 bottom-0 h-28"
          style={{
            background: "repeating-linear-gradient(90deg, #0a0505 0 6px, #1a0a0a 6px 12px)",
            boxShadow: "inset 0 20px 40px rgba(0,0,0,0.7)",
          }} />
        {/* Happy Birthday banner */}
        <div className="absolute inset-x-0 top-6 z-10 flex justify-center"
          style={{ animation: `ci-line-in 800ms ${EASE} 300ms both` }}>
          <div className="border border-accent/60 bg-black/70 px-6 py-2 font-mono text-xs uppercase tracking-[0.5em] text-accent backdrop-blur">
            🎉 HAPPY BIRTHDAY {racerName.toUpperCase()} 🎉
          </div>
        </div>
        {/* balloons integrated w/ racing colors */}
        {[10, 22, 78, 90].map((x, i) => (
          <div key={i} className="absolute h-8 w-6 rounded-full"
            style={{
              left: `${x}%`,
              bottom: `${20 + (i * 9) % 22}%`,
              background: ["#ff3c28", "#ffa040", "#00ff88", "#fff"][i],
              boxShadow: "0 0 16px rgba(255,60,40,0.4)",
              animation: `ci-float ${3 + i * 0.4}s ${EASE} ${i * 0.2}s infinite`,
            }} />
        ))}
        {/* confetti */}
        {Array.from({ length: 26 }).map((_, i) => (
          <div key={i} className="absolute h-2 w-1"
            style={{
              left: `${(i * 41) % 100}%`,
              top: "-5%",
              background: ["#ff3c28", "#ffa040", "#ffffff", "#00ff88"][i % 4],
              animation: `ci-confetti ${3 + (i % 3)}s linear ${i * 0.08}s infinite`,
            }} />
        ))}
        {/* gate glow */}
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(255,220,120,0.7), rgba(255,80,40,0.25) 30%, transparent 60%)",
            animation: `ci-gate-glow 2600ms ${EASE} 200ms both`,
          }} />
        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ animation: `ci-title 1400ms ${EASE} 600ms both` }}>
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-[0.5em] text-accent md:text-sm">Welcome To</div>
            <div className="mt-4 font-display text-6xl uppercase leading-[0.9] text-white md:text-8xl">
              {racerName.toUpperCase()}&apos;S
            </div>
            <div className="mt-2 font-display text-5xl uppercase leading-[0.9] text-fire drop-shadow-[0_0_40px_rgba(255,60,40,0.6)] md:text-7xl">
              10<span className="text-white/90">TH</span> BIRTHDAY
            </div>
            <div className="mt-3 font-display text-4xl uppercase tracking-[0.15em] text-white md:text-6xl">
              GRAND PRIX
            </div>
            <div className="mx-auto mt-6 h-2 w-64 checker-flag opacity-80" />
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.5em] text-white/60">
              You&apos;re invited to the celebration
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ci-line-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ci-go {
          0% { transform: scale(2.2); opacity: 0; filter: blur(20px); }
          45% { transform: scale(1); opacity: 1; filter: blur(0); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ci-led-boot {
          0% { opacity: 0; transform: scale(0.94); filter: blur(14px) brightness(0.4); }
          40% { opacity: 1; filter: blur(0) brightness(1.2); }
          60% { filter: brightness(0.7); }
          100% { opacity: 1; transform: scale(1); filter: blur(0) brightness(1); }
        }
        @keyframes ci-smoke-drift {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.3; }
          50% { transform: translate(24px,-34px) scale(1.4); opacity: 0.6; }
        }
        @keyframes ci-arrive {
          0% { transform: translate(120%, 0) scale(0.7); opacity: 0; filter: blur(6px); }
          60% { transform: translate(-50%, 0) scale(1); opacity: 1; filter: blur(0); }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        @keyframes ci-strip {
          from { opacity: 0; transform: scaleX(0.3); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes ci-streak {
          from { transform: translateX(0) scaleX(1); }
          to   { transform: translateX(700%) scaleX(2); }
        }
        @keyframes ci-search {
          0%, 100% { transform: translateX(-50%) rotate(-25deg); }
          50%      { transform: translateX(-50%) rotate(25deg); }
        }
        @keyframes ci-confetti {
          0%   { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.6; }
        }
        @keyframes ci-firework {
          0%   { transform: scale(0.2); opacity: 0; }
          40%  { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes ci-banner {
          from { transform: translateY(-100%); }
          to   { transform: translateY(0); }
        }
        @keyframes ci-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes ci-gate-glow { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ci-title {
          0%   { opacity: 0; transform: scale(0.9); filter: blur(20px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes ci-car-travel {
          0%   { transform: translate(-55%, 0); opacity: 0.7; }
          50%  { transform: translate(-50%, -4%); opacity: 1; }
          100% { transform: translate(-45%, 0); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

function CircuitScene({ index }: { index: number }) {
  const stop = CIRCUITS[index];
  const streaks = useMemo(() => Array.from({ length: 26 }), []);
  const bg = (() => {
    switch (stop.loc) {
      case "TRAINING TRACK":
        return "radial-gradient(ellipse at center, rgba(0,210,140,0.18), transparent 55%), linear-gradient(180deg, #05100a 0%, #050505 100%)";
      case "MOUNTAIN PASS":
        return "linear-gradient(180deg, #0a0f1a 0%, #1a1010 60%, #050505 100%)";
      case "CITY CIRCUIT":
        return "radial-gradient(ellipse at 50% 40%, rgba(255,60,40,0.28), transparent 55%), linear-gradient(180deg, #0a0510 0%, #000 100%)";
      case "FINAL STRAIGHT":
        return "radial-gradient(ellipse at 50% 60%, rgba(255,220,120,0.35), transparent 55%), linear-gradient(180deg, #150808 0%, #000 100%)";
      default:
        return "#000";
    }
  })();
  return (
    <div key={index} className="absolute inset-0" style={{ animation: `ci-title 600ms ${EASE} both` }}>
      <div className="absolute inset-0" style={{ background: bg, transition: `background 500ms ${EASE}` }} />
      <div className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,60,40,0.35), transparent 70%)" }} />
      {streaks.map((_, i) => {
        const top = (i * 137) % 100;
        const dur = 0.35 + ((i * 13) % 40) / 80;
        const delay = ((i * 71) % 100) / 100;
        const hue = i % 5 === 0 ? "#ff3c28" : i % 4 === 0 ? "#ffa040" : "#ffffff";
        return (
          <div
            key={i}
            className="absolute h-[2px] rounded-full"
            style={{
              top: `${top}%`,
              left: "-20%",
              width: `${20 + (i % 5) * 10}%`,
              background: `linear-gradient(90deg, transparent, ${hue}, transparent)`,
              opacity: 0.7,
              animation: `ci-streak ${dur}s linear ${delay}s infinite`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 32%, rgba(0,0,0,0.78) 92%)" }} />
      {/* Car #10 travelling naturally across the frame with birthday livery hint */}
      <div className="absolute bottom-[16%] left-1/2"
        style={{ animation: `ci-car-travel 3s ${EASE} both`, transform: "translate(-50%, 0)" }}>
        <div className="relative flex h-14 w-40 items-center justify-center border-2 border-primary bg-gradient-to-r from-primary via-fire to-accent shadow-[0_10px_40px_rgba(255,60,40,0.6)]">
          <div className="font-display text-2xl text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">#10</div>
          <div className="absolute inset-y-1 left-1 w-1.5 checker-flag opacity-90" />
          <div className="absolute inset-y-1 right-1 w-1.5 checker-flag opacity-90" />
        </div>
        <div className="mx-auto mt-1 h-2 w-44 rounded-full bg-black/70 blur-md" />
      </div>
      <div className="absolute inset-x-0 bottom-24 text-center"
        style={{ animation: `ci-line-in 700ms ${EASE} 150ms both` }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/50">Now Racing</div>
        <div className="mt-2 font-display text-4xl uppercase text-white md:text-6xl"
          style={{ textShadow: "0 0 30px rgba(255,60,40,0.8)" }}>
          {stop.loc}
        </div>
      </div>
    </div>
  );
}

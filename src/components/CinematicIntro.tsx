import { useEffect, useMemo, useState } from "react";

/**
 * Premium cinematic intro (~14s). Every phase overlaps its neighbours with a
 * cross-fade so transitions feel like a film cut on an easing curve rather than
 * a hard scene swap.
 */

type StageKey = "boot" | "dashboard" | "headlights" | "lights" | "launch" | "cuts" | "arena";

// Absolute timeline (ms). Each stage fades in at `at`, fully visible by `at + fadeIn`,
// starts fading out at `end - fadeOut`, gone by `end`.
const STAGES: { key: StageKey; at: number; end: number }[] = [
  { key: "boot",       at:     0, end:  2200 },
  { key: "dashboard",  at:  1900, end:  4900 },
  { key: "headlights", at:  4600, end:  7400 },
  { key: "lights",     at:  7100, end:  9600 },
  { key: "launch",     at:  9300, end: 10800 },
  { key: "cuts",       at: 10600, end: 13400 },
  { key: "arena",      at: 13100, end: 16600 },
];
const TOTAL = 16600; // ~13.5s of active scenes + 3s title hold before onDone
const FADE = 550;    // cross-fade window
const SKIP_AT = 2500;

const CUTS = [
  { label: "REAR CHASE", loc: "TUNNEL" },
  { label: "DRONE SHOT", loc: "BRIDGE" },
  { label: "SIDE TRACK", loc: "NIGHT HIGHWAY" },
  { label: "COCKPIT",    loc: "PIT LANE" },
];

const BOOT_LINES = [
  "▓░░░░░░░░░░░  INITIALIZING RACE SYSTEMS",
  "▓▓▓▓░░░░░░░  LOADING TELEMETRY",
  "▓▓▓▓▓▓▓░░░░  CALIBRATING DRIVER #10",
  "▓▓▓▓▓▓▓▓▓▓▓  SYSTEMS ONLINE",
];

const SYSTEMS = ["RPM", "SPEEDO", "FUEL", "GEAR", "ABS", "TC", "ENGINE", "NITRO"];

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

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

  // Derived per-scene state
  const bootLine = Math.min(BOOT_LINES.length - 1, Math.floor(stageProgress("boot") * BOOT_LINES.length));
  const sysOn = Math.min(SYSTEMS.length, Math.floor(stageProgress("dashboard") * (SYSTEMS.length + 1)));
  // RPM: slow sweep up over 70% of the dashboard stage, then settle to idle
  const rpm = (() => {
    const p = stageProgress("dashboard");
    if (p < 0.75) return (p / 0.75) * 0.95;
    return 0.95 - (p - 0.75) * 2.6; // settle to ~idle
  })();
  const rpmClamped = Math.max(0.05, Math.min(1, rpm));

  // F1 start lights: 5 reds light up sequentially, hold, then all-out → GO
  const light = (() => {
    const p = stageProgress("lights");
    // 5 reds fill over first 60% of scene, hold, then GO at 90%
    if (p < 0.6) return Math.min(5, Math.floor((p / 0.6) * 5) + 1);
    if (p < 0.9) return 5;
    return 6;
  })();

  const cut = Math.min(CUTS.length - 1, Math.floor(stageProgress("cuts") * CUTS.length));
  const cutsSpeed = 90 + stageProgress("cuts") * 240; // 90 → 330
  const launchSpeed = Math.round(stageProgress("launch") * 90);
  const speed = Math.round(t > STAGES.find((s) => s.key === "cuts")!.at ? cutsSpeed : launchSpeed);

  const skip = () => {
    setRunning(false);
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-foreground">
      {/* SKIP — appears after ~2.5s */}
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

      {/* ─────────── PHASE 1 · BOOT ─────────── */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: opacityFor("boot"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="w-full max-w-lg px-6 font-mono text-[11px] text-primary/90">
          <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/50">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            GRAND PRIX OS · v10.0
          </div>
          {BOOT_LINES.slice(0, bootLine + 1).map((l, i) => (
            <div key={i} className="mb-1" style={{ animation: `ci-line-in 500ms ${EASE} both` }}>
              <span className="text-white/40">$</span> {l}
            </div>
          ))}
          <div className="mt-3">
            <span className="text-white/40">$</span>
            <span className="ml-2 inline-block h-3 w-2 translate-y-0.5 animate-pulse bg-primary" />
          </div>
          <div className="absolute left-6 top-6 font-mono text-[9px] uppercase tracking-widest text-white/40">◉ REC · 00:00</div>
          <div className="absolute bottom-6 right-6 font-mono text-[9px] uppercase tracking-widest text-white/40">DRIVER #10</div>
        </div>
      </div>

      {/* ─────────── PHASE 2 · DASHBOARD ─────────── */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: opacityFor("dashboard"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(30,10,10,0.9), #000 70%)" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="relative grid w-full max-w-5xl grid-cols-3 items-center gap-6 px-6">
          <div className="space-y-2">
            {SYSTEMS.slice(0, 4).map((s, i) => (
              <SysRow key={s} label={s} on={sysOn > i} />
            ))}
          </div>
          <div className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center rounded-full border-2 border-primary/40 bg-black shadow-[0_0_60px_rgba(255,60,40,0.35)_inset]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
              {Array.from({ length: 21 }).map((_, i) => {
                const a = (-135 + i * 13.5) * (Math.PI / 180);
                const x1 = 100 + Math.cos(a) * 82;
                const y1 = 100 + Math.sin(a) * 82;
                const x2 = 100 + Math.cos(a) * (i > 14 ? 68 : 74);
                const y2 = 100 + Math.sin(a) * (i > 14 ? 68 : 74);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i > 14 ? "#ff3c28" : "#888"} strokeWidth={i % 5 === 0 ? 2 : 1} />;
              })}
              <line
                x1="100" y1="100"
                x2={100 + Math.cos((-135 + rpmClamped * 270) * (Math.PI / 180)) * 78}
                y2={100 + Math.sin((-135 + rpmClamped * 270) * (Math.PI / 180)) * 78}
                stroke="#ff3c28" strokeWidth="3" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 6px #ff3c28)", transition: `all 120ms ${EASE}` }}
              />
              <circle cx="100" cy="100" r="6" fill="#ff3c28" />
            </svg>
            <div className="absolute bottom-8 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">RPM ×1000</div>
              <div className="font-display text-3xl text-fire tabular-nums">{Math.round(rpmClamped * 12)}</div>
            </div>
          </div>
          <div className="space-y-2 text-right">
            {SYSTEMS.slice(4).map((s, i) => (
              <SysRow key={s} label={s} on={sysOn > i + 4} right />
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
          Car #10 · Systems Online
        </div>
      </div>

      {/* ─────────── PHASE 3 · HEADLIGHTS ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("headlights"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-x-0 bottom-0 h-2/3"
          style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.05) 60%, rgba(255,180,120,0.08) 100%)" }} />
        <div className="absolute inset-0 opacity-70"
          style={{
            background: "radial-gradient(ellipse at 30% 70%, rgba(200,200,220,0.28), transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(180,180,200,0.22), transparent 60%)",
            animation: `ci-fog 4s ${EASE} both`,
          }} />
        {[0, 1].map((i) => (
          <div
            key={i}
            className="absolute top-1/2 h-24 w-24 -translate-y-1/2 rounded-full"
            style={{
              left: `calc(50% + ${i === 0 ? -80 : 80}px - 48px)`,
              background: "radial-gradient(circle, #fff, rgba(255,240,200,0.9) 30%, rgba(255,180,80,0.2) 60%, transparent 75%)",
              boxShadow: "0 0 120px 40px rgba(255,220,150,0.5)",
              animation: `ci-headlight 2200ms ${EASE} ${300 + i * 200}ms both`,
            }}
          />
        ))}
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,240,200,0.8), transparent)",
            animation: `ci-flare 2200ms ${EASE} 900ms both`,
          }} />
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-16 w-16 rounded-full bg-white/10 blur-2xl"
            style={{
              left: `${8 + i * 7}%`,
              bottom: `${(i * 13) % 40}%`,
              animation: `ci-smoke-drift ${4 + (i % 3)}s ${EASE} ${i * 0.15}s infinite`,
            }}
          />
        ))}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.5em] text-white/40"
          style={{ animation: `ci-line-in 800ms ${EASE} 1400ms both` }}>
          Car #10 · Standing By
        </div>
      </div>

      {/* ─────────── PHASE 4 · RACE START LIGHTS ─────────── */}
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
            <div
              className="font-display text-6xl uppercase md:text-8xl"
              style={{ color: "#00ff88", textShadow: "0 0 50px #00ff88", animation: `ci-go 700ms ${EASE} both` }}
            >
              GO
            </div>
          )}
        </div>
      </div>

      {/* ─────────── PHASE 5 · TIRE LAUNCH ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("launch"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #050505 40%, #1a0a0a 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-3/4"
          style={{
            background: "radial-gradient(ellipse at 50% 90%, rgba(240,240,255,0.9), rgba(200,200,220,0.35) 40%, transparent 70%)",
            animation: `ci-tire-smoke 1400ms ${EASE} both`,
          }} />
        {[-1, 1].map((s) => (
          <div key={s} className="absolute bottom-[8%] h-24 w-24 rounded-full border-4 border-white/20 bg-black"
            style={{
              left: `calc(50% + ${s * 80}px - 48px)`,
              boxShadow: "inset 0 0 20px rgba(255,60,40,0.6), 0 0 30px rgba(255,60,40,0.4)",
              animation: "ci-spin 0.18s linear infinite",
            }}>
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/30" />
          </div>
        ))}
        {Array.from({ length: 22 }).map((_, i) => (
          <div key={i} className="absolute h-1.5 w-1.5 rounded-full bg-orange-300/80"
            style={{
              bottom: "12%",
              left: "50%",
              animation: `ci-rock 1200ms ${EASE} ${i * 0.05}s forwards`,
              ["--rx" as string]: `${(i - 11) * 32}px`,
              ["--ry" as string]: `${-90 - (i % 6) * 22}px`,
            }} />
        ))}
        <div className="absolute left-6 top-6 font-mono text-xs text-primary"
          style={{ animation: `ci-line-in 500ms ${EASE} 300ms both` }}>
          SPEED · <span className="font-display text-2xl text-fire tabular-nums">{launchSpeed}</span> KM/H
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-4xl uppercase text-fire"
          style={{ animation: `ci-line-in 600ms ${EASE} 200ms both`, textShadow: "0 0 20px rgba(255,60,40,0.7)" }}>
          #10 LAUNCH
        </div>
      </div>

      {/* ─────────── PHASES 6 + 7 · CAMERA CUTS + HUD ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("cuts"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <CutScene index={cut} />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-6 top-6 border border-primary/40 bg-black/50 px-3 py-2 backdrop-blur">
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Speed KM/H</div>
            <div className="font-display text-3xl text-fire tabular-nums">{speed}</div>
          </div>
          <div className="absolute right-6 top-6 border border-accent/40 bg-black/50 px-3 py-2 text-right backdrop-blur">
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Lap</div>
            <div className="font-display text-2xl text-accent tabular-nums">01 / 10</div>
          </div>
          <div className="absolute bottom-6 left-6 space-y-2">
            <div className="border border-white/20 bg-black/50 px-3 py-1 backdrop-blur">
              <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Gear</div>
              <div className="font-display text-2xl text-white">{Math.min(6, Math.max(1, Math.floor(speed / 55)))}</div>
            </div>
            <div className="w-40">
              <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-white/50">
                <span>Nitro</span><span>{Math.min(100, Math.max(0, Math.round((speed - 80) / 2.6)))}%</span>
              </div>
              <div className="h-1.5 border border-white/20 bg-black/50">
                <div className="h-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${Math.min(100, Math.max(0, Math.round((speed - 80) / 2.6)))}%`, transition: `width 200ms ${EASE}` }} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 h-24 w-32 border border-white/20 bg-black/60 p-1 backdrop-blur">
            <svg viewBox="0 0 120 80" className="h-full w-full">
              <path d="M10,60 C20,10 60,10 70,40 C80,70 110,60 110,30" stroke="#ff3c28" strokeWidth="2" fill="none" />
              <circle cx={10 + (cut / (CUTS.length - 1)) * 100} cy={60 - (cut / (CUTS.length - 1)) * 30} r="4" fill="#00ff88"
                style={{ transition: `all 500ms ${EASE}` }}>
                <animate attributeName="r" values="3;5;3" dur="1.1s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <div className="absolute left-1/2 top-6 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">
            ◉ CAM · {CUTS[cut].label}
          </div>
        </div>
      </div>

      {/* ─────────── PHASE 8 · ARENA / GATE ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("arena"), transition: `opacity ${FADE}ms ${EASE}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute left-1/2 top-0 h-[120%] w-40 origin-top -translate-x-1/2"
            style={{
              background: "linear-gradient(180deg, rgba(255,220,150,0.35), transparent 70%)",
              animation: `ci-search 5s ${EASE} ${i * 0.5}s infinite`,
              transform: `translateX(-50%) rotate(${(i - 1) * 20}deg)`,
              filter: "blur(6px)",
            }} />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-24"
          style={{
            background: "repeating-linear-gradient(90deg, #000 0 10px, #0a0a0a 10px 18px, #000 18px 24px)",
            maskImage: "radial-gradient(ellipse at 50% 100%, black 60%, transparent 100%)",
          }} />
        {Array.from({ length: 34 }).map((_, i) => (
          <div key={i} className="absolute h-2 w-1"
            style={{
              left: `${(i * 37) % 100}%`,
              top: "-5%",
              background: ["#ff3c28", "#ffa040", "#ffffff", "#00ff88"][i % 4],
              animation: `ci-confetti ${3 + (i % 3)}s linear ${i * 0.06}s infinite`,
            }} />
        ))}
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(255,220,120,0.9), rgba(255,80,40,0.3) 30%, transparent 60%)",
            animation: `ci-gate-glow 2600ms ${EASE} 600ms both`,
          }} />
        <div className="absolute inset-y-0 left-0 w-1/2 origin-left"
          style={{
            background: "linear-gradient(90deg, #0a0a0a, #1a1a1a 60%, #2a1010)",
            borderRight: "4px solid #ff3c28",
            boxShadow: "8px 0 40px rgba(255,60,40,0.5)",
            animation: `ci-gate-left 2400ms ${EASE} 900ms both`,
          }}>
          <div className="absolute inset-y-0 right-0 w-2 checker-flag opacity-80" />
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 origin-right"
          style={{
            background: "linear-gradient(-90deg, #0a0a0a, #1a1a1a 60%, #2a1010)",
            borderLeft: "4px solid #ff3c28",
            boxShadow: "-8px 0 40px rgba(255,60,40,0.5)",
            animation: `ci-gate-right 2400ms ${EASE} 900ms both`,
          }}>
          <div className="absolute inset-y-0 left-0 w-2 checker-flag opacity-80" />
        </div>
        <div className="absolute inset-x-0 top-4 z-10 flex justify-center"
          style={{ animation: `ci-line-in 700ms ${EASE} 2500ms both` }}>
          <div className="border border-accent/50 bg-black/70 px-4 py-1 font-mono text-[10px] uppercase tracking-[0.4em] text-accent backdrop-blur">
            ◉ CHAMPION DRIVER · #10
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ animation: `ci-title 1400ms ${EASE} 2700ms both` }}>
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-[0.5em] text-accent md:text-sm">Welcome To</div>
            <div className="mt-4 font-display text-6xl uppercase leading-[0.9] text-white md:text-8xl">
              {racerName.toUpperCase()}'S
            </div>
            <div className="mt-2 font-display text-5xl uppercase leading-[0.9] text-fire drop-shadow-[0_0_40px_rgba(255,60,40,0.6)] md:text-7xl">
              10<span className="text-white/90">TH</span> BIRTHDAY
            </div>
            <div className="mt-3 font-display text-4xl uppercase tracking-[0.15em] text-white md:text-6xl">
              GRAND PRIX
            </div>
            <div className="mx-auto mt-6 h-2 w-64 checker-flag opacity-80" />
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
        @keyframes ci-headlight {
          0% { opacity: 0; transform: translateY(-50%) scale(0.3); filter: blur(24px); }
          70% { opacity: 1; transform: translateY(-50%) scale(1.05); filter: blur(0); }
          100% { opacity: 1; transform: translateY(-50%) scale(1); }
        }
        @keyframes ci-flare {
          0% { opacity: 0; transform: translateY(-50%) scaleX(0); }
          50% { opacity: 1; transform: translateY(-50%) scaleX(1); }
          100% { opacity: 0.4; transform: translateY(-50%) scaleX(1); }
        }
        @keyframes ci-fog {
          0% { opacity: 0; transform: translateX(-14px); }
          100% { opacity: 0.75; transform: translateX(14px); }
        }
        @keyframes ci-smoke-drift {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.3; }
          50% { transform: translate(24px,-34px) scale(1.4); opacity: 0.6; }
        }
        @keyframes ci-tire-smoke {
          0% { opacity: 0; transform: scale(0.6) translateY(30%); }
          100% { opacity: 0.9; transform: scale(1) translateY(0); }
        }
        @keyframes ci-spin { to { transform: rotate(360deg); } }
        @keyframes ci-rock {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--rx), var(--ry)) scale(0.3); opacity: 0; }
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
        @keyframes ci-gate-glow  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ci-gate-left  { from { transform: translateX(0); } to { transform: translateX(-105%); } }
        @keyframes ci-gate-right { from { transform: translateX(0); } to { transform: translateX(105%); } }
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

function SysRow({ label, on, right }: { label: string; on: boolean; right?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${right ? "justify-end" : ""}`}
      style={{ transition: `opacity 300ms ${EASE}` }}>
      {right && (
        <span className={`font-display text-lg tabular-nums transition-colors ${on ? "text-fire" : "text-white/15"}`}>
          {on ? "ONLINE" : "----"}
        </span>
      )}
      <div className={`h-2 w-2 rounded-full transition-all ${on ? "bg-primary shadow-[0_0_10px_#ff3c28]" : "bg-white/10"}`} />
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</div>
      {!right && (
        <span className={`font-display text-lg tabular-nums transition-colors ${on ? "text-fire" : "text-white/15"}`}>
          {on ? "ONLINE" : "----"}
        </span>
      )}
    </div>
  );
}

function CutScene({ index }: { index: number }) {
  const cut = CUTS[index];
  const streaks = useMemo(() => Array.from({ length: 28 }), []);
  const bg = (() => {
    switch (cut.loc) {
      case "TUNNEL":
        return "radial-gradient(ellipse at center, rgba(255,220,150,0.35), transparent 45%), linear-gradient(180deg, #0a0a12 0%, #050508 100%)";
      case "BRIDGE":
        return "linear-gradient(180deg, #0a1220 0%, #05080f 60%, #1a0a0a 100%)";
      case "NIGHT HIGHWAY":
        return "radial-gradient(ellipse at 50% 40%, rgba(255,60,40,0.25), transparent 55%), #000";
      case "PIT LANE":
        return "linear-gradient(180deg, #1a0a0a 0%, #2a1414 40%, #0a0505 100%)";
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
        const dur = 0.35 + ((i * 13) % 40) / 80; // slower streaks — more filmic
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
      {/* car silhouette travelling naturally across the frame */}
      <div className="absolute bottom-[14%] left-1/2 h-20 w-56"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,60,40,0.85), transparent 70%)",
          filter: "blur(4px)",
          animation: `ci-car-travel 2.6s ${EASE} both`,
        }} />
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 font-display text-2xl text-white"
        style={{ textShadow: "0 0 10px rgba(0,0,0,0.9)" }}>#10</div>
      <div className="absolute inset-x-0 bottom-24 text-center"
        style={{ animation: `ci-line-in 700ms ${EASE} 150ms both` }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/50">Now Entering</div>
        <div className="mt-2 font-display text-4xl uppercase text-white md:text-6xl"
          style={{ textShadow: "0 0 30px rgba(255,60,40,0.8)" }}>
          {cut.loc}
        </div>
      </div>
    </div>
  );
}

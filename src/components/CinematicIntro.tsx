import { useEffect, useMemo, useState } from "react";

type Stage =
  | "boot"
  | "dashboard"
  | "headlights"
  | "lights"
  | "launch"
  | "cuts"
  | "arena"
  | "done";

const CUTS = [
  { label: "REAR CHASE", loc: "TUNNEL" },
  { label: "WHEEL CAM", loc: "BRIDGE" },
  { label: "FRONT BUMPER", loc: "CITY" },
  { label: "DRONE SHOT", loc: "MOUNTAIN" },
  { label: "SIDE TRACK", loc: "NIGHT HIGHWAY" },
  { label: "COCKPIT", loc: "PIT LANE" },
];

const BOOT_LINES = [
  "▓░░░░░░░░░░░  INITIALIZING RACE SYSTEMS",
  "▓▓▓▓░░░░░░░  LOADING TELEMETRY",
  "▓▓▓▓▓▓▓░░░░  CALIBRATING DRIVER #10",
  "▓▓▓▓▓▓▓▓▓▓▓  SYSTEMS ONLINE",
];

const SYSTEMS = ["RPM", "SPEEDO", "FUEL", "GEAR", "ABS", "TC", "ENGINE", "NITRO"];

export function CinematicIntro({ onDone, racerName }: { onDone: () => void; racerName: string }) {
  const [stage, setStage] = useState<Stage>("boot");
  const [bootLine, setBootLine] = useState(0);
  const [sysOn, setSysOn] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [light, setLight] = useState(0); // 0..5 red lights on; 6 = GO
  const [cut, setCut] = useState(0);
  const [speed, setSpeed] = useState(0);

  // Stage scheduler
  useEffect(() => {
    const t: number[] = [];
    t.push(window.setTimeout(() => setStage("dashboard"), 1200));
    t.push(window.setTimeout(() => setStage("headlights"), 3400));
    t.push(window.setTimeout(() => setStage("lights"), 4900));
    t.push(window.setTimeout(() => setStage("launch"), 8300));
    t.push(window.setTimeout(() => setStage("cuts"), 9500));
    t.push(window.setTimeout(() => setStage("arena"), 13000));
    t.push(window.setTimeout(() => onDone(), 17500));
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  // Boot loader lines
  useEffect(() => {
    if (stage !== "boot") return;
    const id = setInterval(() => setBootLine((n) => Math.min(n + 1, BOOT_LINES.length - 1)), 280);
    return () => clearInterval(id);
  }, [stage]);

  // Dashboard: systems power on + RPM sweep
  useEffect(() => {
    if (stage !== "dashboard") return;
    setSysOn(0);
    const id = setInterval(() => setSysOn((n) => Math.min(n + 1, SYSTEMS.length)), 160);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 2000);
      const eased = p < 0.75 ? p / 0.75 : 1 - (p - 0.75) * 0.7;
      setRpm(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { clearInterval(id); cancelAnimationFrame(raf); };
  }, [stage]);

  // F1 start lights: 5 reds light up sequentially, hold, then GO
  useEffect(() => {
    if (stage !== "lights") return;
    setLight(0);
    let i = 0;
    const on = setInterval(() => {
      i++;
      setLight(i);
      if (i >= 5) {
        clearInterval(on);
        window.setTimeout(() => setLight(6), 900); // random-feeling hold, then all out → GO
      }
    }, 420);
    return () => clearInterval(on);
  }, [stage]);

  // Camera cuts
  useEffect(() => {
    if (stage !== "cuts") return;
    setCut(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i >= CUTS.length) { clearInterval(id); return; }
      setCut(i);
    }, 540);
    return () => clearInterval(id);
  }, [stage]);

  // Speed HUD number ramps during launch + cuts
  useEffect(() => {
    if (stage !== "launch" && stage !== "cuts") return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 4200);
      setSpeed(Math.round(80 + p * 260));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  const skip = () => onDone();

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-foreground">
      <button
        onClick={skip}
        className="absolute right-4 top-4 z-50 border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70 backdrop-blur transition-colors hover:border-white/60 hover:text-white"
      >
        Skip →
      </button>

      {/* Persistent film grain + vignette */}
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, #000 100%)" }} />

      {/* ─────────── PHASE 1 · BOOT ─────────── */}
      {stage === "boot" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-lg px-6 font-mono text-[11px] text-primary/90">
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/50">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              GRAND PRIX OS · v10.0
            </div>
            {BOOT_LINES.slice(0, bootLine + 1).map((l, i) => (
              <div key={i} className="opacity-0" style={{ animation: "ci-fade-in 0.2s ease-out forwards" }}>
                <span className="text-white/40">$</span> {l}
              </div>
            ))}
            <div className="mt-2">
              <span className="text-white/40">$</span>
              <span className="ml-2 inline-block h-3 w-2 translate-y-0.5 animate-pulse bg-primary" />
            </div>
            {/* tiny HUD corner blips */}
            <div className="absolute left-6 top-6 font-mono text-[9px] uppercase tracking-widest text-white/40">◉ REC · 00:00</div>
            <div className="absolute bottom-6 right-6 font-mono text-[9px] uppercase tracking-widest text-white/40">DRIVER #10</div>
          </div>
        </div>
      )}

      {/* ─────────── PHASE 2 · DASHBOARD ─────────── */}
      {stage === "dashboard" && (
        <div className="absolute inset-0 flex items-center justify-center">
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
                  x2={100 + Math.cos((-135 + rpm * 270) * (Math.PI / 180)) * 78}
                  y2={100 + Math.sin((-135 + rpm * 270) * (Math.PI / 180)) * 78}
                  stroke="#ff3c28" strokeWidth="3" strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px #ff3c28)" }}
                />
                <circle cx="100" cy="100" r="6" fill="#ff3c28" />
              </svg>
              <div className="absolute bottom-8 text-center">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">RPM ×1000</div>
                <div className="font-display text-3xl text-fire">{Math.round(rpm * 12)}</div>
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
      )}

      {/* ─────────── PHASE 3 · HEADLIGHTS ─────────── */}
      {stage === "headlights" && (
        <div className="absolute inset-0 overflow-hidden bg-black">
          {/* wet asphalt reflection */}
          <div className="absolute inset-x-0 bottom-0 h-2/3"
            style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.05) 60%, rgba(255,180,120,0.08) 100%)" }} />
          {/* drifting fog */}
          <div className="absolute inset-0 opacity-70"
            style={{
              background: "radial-gradient(ellipse at 30% 70%, rgba(200,200,220,0.25), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(180,180,200,0.2), transparent 55%)",
              animation: "ci-fog 3s ease-out both",
            }} />
          {/* headlights */}
          {[0, 1].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 h-24 w-24 -translate-y-1/2 rounded-full"
              style={{
                left: `calc(50% + ${i === 0 ? -80 : 80}px - 48px)`,
                background: "radial-gradient(circle, #fff, rgba(255,240,200,0.9) 30%, rgba(255,180,80,0.2) 60%, transparent 75%)",
                boxShadow: "0 0 120px 40px rgba(255,220,150,0.5)",
                opacity: 0,
                animation: `ci-headlight 1.5s ease-out ${0.1 + i * 0.1}s forwards`,
              }}
            />
          ))}
          {/* lens flare beam */}
          <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 opacity-0"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,240,200,0.8), transparent)",
              animation: "ci-flare 1.5s ease-out 0.5s forwards",
            }} />
          {/* smoke particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-16 w-16 rounded-full bg-white/10 blur-2xl"
              style={{
                left: `${10 + i * 7}%`,
                bottom: `${(i * 13) % 40}%`,
                animation: `ci-smoke-drift ${3 + (i % 3)}s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.5em] text-white/40 opacity-0"
            style={{ animation: "ci-fade-in 0.6s ease-out 0.9s forwards" }}>
            Car #10 · Standing By
          </div>
        </div>
      )}

      {/* ─────────── PHASE 4 · RACE START LIGHTS ─────────── */}
      {stage === "lights" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${light === 6 ? "rgba(0,210,106,0.35)" : "rgba(255,60,40,0.25)"}, transparent 60%)` }} />
          <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">Formation Complete</div>
          <div className="mt-6 flex gap-3 md:gap-5">
            {[0, 1, 2, 3, 4].map((i) => {
              const on = light !== 6 && i < light;
              const green = light === 6;
              return (
                <div
                  key={i}
                  className="flex h-16 w-12 items-center justify-center rounded-md border border-white/10 bg-black md:h-20 md:w-16"
                >
                  <div
                    className="h-10 w-10 rounded-full transition-all md:h-12 md:w-12"
                    style={{
                      background: green ? "#00ff88" : on ? "#ff2020" : "#1a0505",
                      boxShadow: green
                        ? "0 0 30px #00ff88, 0 0 60px #00ff88"
                        : on
                        ? "0 0 25px #ff2020, 0 0 50px #ff2020"
                        : "inset 0 0 8px rgba(255,255,255,0.05)",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-10 h-16">
            {light === 6 && (
              <div
                className="font-display text-6xl uppercase md:text-8xl"
                style={{ color: "#00ff88", textShadow: "0 0 50px #00ff88", animation: "ci-count 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                GO
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────── PHASE 5 · TIRE LAUNCH ─────────── */}
      {stage === "launch" && (
        <div className="absolute inset-0 overflow-hidden bg-black">
          {/* asphalt */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #050505 40%, #1a0a0a 100%)" }} />
          {/* tire smoke bloom */}
          <div className="absolute inset-x-0 bottom-0 h-3/4"
            style={{
              background: "radial-gradient(ellipse at 50% 90%, rgba(240,240,255,0.85), rgba(200,200,220,0.3) 40%, transparent 70%)",
              animation: "ci-tire-smoke 1.2s ease-out both",
            }} />
          {/* two tires */}
          {[-1, 1].map((s) => (
            <div key={s} className="absolute bottom-[8%] h-24 w-24 rounded-full border-4 border-white/20 bg-black"
              style={{
                left: `calc(50% + ${s * 80}px - 48px)`,
                boxShadow: "inset 0 0 20px rgba(255,60,40,0.6), 0 0 30px rgba(255,60,40,0.4)",
                animation: "ci-spin 0.15s linear infinite",
              }}>
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/30" />
            </div>
          ))}
          {/* rocks */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute h-1.5 w-1.5 rounded-full bg-orange-300/80"
              style={{
                bottom: "12%",
                left: "50%",
                animation: `ci-rock 1s ease-out ${i * 0.04}s forwards`,
                ["--rx" as string]: `${(i - 10) * 30}px`,
                ["--ry" as string]: `${-80 - (i % 6) * 20}px`,
              }} />
          ))}
          {/* speed number wake-up */}
          <div className="absolute left-6 top-6 font-mono text-xs text-primary opacity-0"
            style={{ animation: "ci-fade-in 0.4s ease-out 0.4s forwards" }}>
            SPEED · <span className="font-display text-2xl text-fire">{speed}</span> KM/H
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-4xl uppercase text-fire"
            style={{ animation: "ci-fade-in 0.5s ease-out 0.2s forwards", textShadow: "0 0 20px rgba(255,60,40,0.7)" }}>
            #10 LAUNCH
          </div>
        </div>
      )}

      {/* ─────────── PHASES 6 + 7 · CAMERA CUTS + HUD ─────────── */}
      {stage === "cuts" && (
        <div className="absolute inset-0 overflow-hidden bg-black">
          <CutScene index={cut} />
          {/* Racing HUD overlay */}
          <div className="pointer-events-none absolute inset-0">
            {/* top-left speed */}
            <div className="absolute left-6 top-6 border border-primary/40 bg-black/50 px-3 py-2 backdrop-blur">
              <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Speed KM/H</div>
              <div className="font-display text-3xl text-fire tabular-nums">{speed}</div>
            </div>
            {/* top-right lap */}
            <div className="absolute right-6 top-6 border border-accent/40 bg-black/50 px-3 py-2 text-right backdrop-blur">
              <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Lap</div>
              <div className="font-display text-2xl text-accent tabular-nums">01 / 10</div>
            </div>
            {/* bottom-left gear + nitro */}
            <div className="absolute bottom-6 left-6 space-y-2">
              <div className="border border-white/20 bg-black/50 px-3 py-1 backdrop-blur">
                <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">Gear</div>
                <div className="font-display text-2xl text-white">{Math.min(6, Math.max(1, Math.floor(speed / 55)))}</div>
              </div>
              <div className="w-40">
                <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-white/50">
                  <span>Nitro</span><span>{Math.min(100, Math.round((speed - 80) / 2.6))}%</span>
                </div>
                <div className="h-1.5 border border-white/20 bg-black/50">
                  <div className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${Math.min(100, Math.round((speed - 80) / 2.6))}%` }} />
                </div>
              </div>
            </div>
            {/* bottom-right minimap */}
            <div className="absolute bottom-6 right-6 h-24 w-32 border border-white/20 bg-black/60 p-1 backdrop-blur">
              <svg viewBox="0 0 120 80" className="h-full w-full">
                <path d="M10,60 C20,10 60,10 70,40 C80,70 110,60 110,30" stroke="#ff3c28" strokeWidth="2" fill="none" />
                <circle cx={10 + (cut / (CUTS.length - 1)) * 100} cy={60 - (cut / (CUTS.length - 1)) * 30} r="4" fill="#00ff88">
                  <animate attributeName="r" values="3;5;3" dur="0.8s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            {/* cam label */}
            <div className="absolute left-1/2 top-6 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">
              ◉ CAM · {CUTS[cut].label}
            </div>
          </div>
        </div>
      )}

      {/* ─────────── PHASE 8 · ARENA / GATE ─────────── */}
      {stage === "arena" && (
        <div className="absolute inset-0 overflow-hidden bg-black">
          {/* searchlights */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="absolute left-1/2 top-0 h-[120%] w-40 origin-top -translate-x-1/2"
              style={{
                background: "linear-gradient(180deg, rgba(255,220,150,0.35), transparent 70%)",
                animation: `ci-search 4s ease-in-out ${i * 0.4}s infinite`,
                transform: `translateX(-50%) rotate(${(i - 1) * 20}deg)`,
                filter: "blur(6px)",
              }} />
          ))}
          {/* crowd silhouettes */}
          <div className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background: "repeating-linear-gradient(90deg, #000 0 10px, #0a0a0a 10px 18px, #000 18px 24px)",
              maskImage: "radial-gradient(ellipse at 50% 100%, black 60%, transparent 100%)",
            }} />
          {/* confetti */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="absolute h-2 w-1"
              style={{
                left: `${(i * 37) % 100}%`,
                top: "-5%",
                background: ["#ff3c28", "#ffa040", "#ffffff", "#00ff88"][i % 4],
                animation: `ci-confetti ${2 + (i % 3)}s linear ${i * 0.05}s infinite`,
              }} />
          ))}
          {/* gate glow */}
          <div className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, rgba(255,220,120,0.9), rgba(255,80,40,0.3) 30%, transparent 60%)",
              opacity: 0,
              animation: "ci-gate-glow 2.5s ease-out 0.4s forwards",
            }} />
          {/* gate doors */}
          <div className="absolute inset-y-0 left-0 w-1/2 origin-left"
            style={{
              background: "linear-gradient(90deg, #0a0a0a, #1a1a1a 60%, #2a1010)",
              borderRight: "4px solid #ff3c28",
              boxShadow: "8px 0 40px rgba(255,60,40,0.5)",
              animation: "ci-gate-left 2s cubic-bezier(0.7,0,0.3,1) 0.6s both",
            }}>
            <div className="absolute inset-y-0 right-0 w-2 checker-flag opacity-80" />
          </div>
          <div className="absolute inset-y-0 right-0 w-1/2 origin-right"
            style={{
              background: "linear-gradient(-90deg, #0a0a0a, #1a1a1a 60%, #2a1010)",
              borderLeft: "4px solid #ff3c28",
              boxShadow: "-8px 0 40px rgba(255,60,40,0.5)",
              animation: "ci-gate-right 2s cubic-bezier(0.7,0,0.3,1) 0.6s both",
            }}>
            <div className="absolute inset-y-0 left-0 w-2 checker-flag opacity-80" />
          </div>
          {/* LED marquee at top */}
          <div className="absolute inset-x-0 top-4 z-10 flex justify-center opacity-0"
            style={{ animation: "ci-fade-in 0.5s ease-out 2.1s forwards" }}>
            <div className="border border-accent/50 bg-black/70 px-4 py-1 font-mono text-[10px] uppercase tracking-[0.4em] text-accent backdrop-blur">
              ◉ CHAMPION DRIVER · #10
            </div>
          </div>
          {/* Title */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0"
            style={{ animation: "ci-title 1.2s cubic-bezier(0.16,1,0.3,1) 2.3s forwards" }}>
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
      )}

      {/* Local keyframes */}
      <style>{`
        @keyframes ci-fade-in { to { opacity: 1; } }
        @keyframes ci-count {
          0% { transform: scale(2.4); opacity: 0; filter: blur(20px); }
          40% { transform: scale(1); opacity: 1; filter: blur(0); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ci-headlight {
          0% { opacity: 0; transform: scale(0.3); filter: blur(20px); }
          60% { opacity: 1; transform: scale(1.1); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ci-flare {
          0% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0.4; transform: scaleX(1); }
        }
        @keyframes ci-fog {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 0.7; transform: translateX(10px); }
        }
        @keyframes ci-smoke-drift {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.3; }
          50% { transform: translate(20px,-30px) scale(1.4); opacity: 0.6; }
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
          to { transform: translateX(700%) scaleX(2); }
        }
        @keyframes ci-search {
          0%, 100% { transform: translateX(-50%) rotate(-25deg); }
          50% { transform: translateX(-50%) rotate(25deg); }
        }
        @keyframes ci-confetti {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.6; }
        }
        @keyframes ci-gate-glow { to { opacity: 1; } }
        @keyframes ci-gate-left { to { transform: translateX(-105%); } }
        @keyframes ci-gate-right { to { transform: translateX(105%); } }
        @keyframes ci-title {
          0% { opacity: 0; transform: scale(0.85); filter: blur(20px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes ci-cut-in {
          0% { opacity: 0; transform: scale(1.08); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

function SysRow({ label, on, right }: { label: string; on: boolean; right?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${right ? "justify-end" : ""}`}>
      {right && (
        <span className={`font-display text-lg tabular-nums ${on ? "text-fire" : "text-white/15"}`}>
          {on ? "ONLINE" : "----"}
        </span>
      )}
      <div className={`h-2 w-2 rounded-full ${on ? "bg-primary shadow-[0_0_10px_#ff3c28]" : "bg-white/10"}`} />
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</div>
      {!right && (
        <span className={`font-display text-lg tabular-nums ${on ? "text-fire" : "text-white/15"}`}>
          {on ? "ONLINE" : "----"}
        </span>
      )}
    </div>
  );
}

function CutScene({ index }: { index: number }) {
  // Each cut renders a distinct camera/environment vignette using pure CSS
  const cut = CUTS[index];
  const streaks = useMemo(() => Array.from({ length: 32 }), []);
  const bg = (() => {
    switch (cut.loc) {
      case "TUNNEL":
        return "radial-gradient(ellipse at center, rgba(255,220,150,0.35), transparent 40%), linear-gradient(180deg, #0a0a12 0%, #050508 100%)";
      case "BRIDGE":
        return "linear-gradient(180deg, #0a1220 0%, #05080f 60%, #1a0a0a 100%)";
      case "CITY":
        return "radial-gradient(ellipse at 30% 60%, rgba(80,120,255,0.25), transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(255,80,120,0.25), transparent 50%), #05050a";
      case "MOUNTAIN":
        return "linear-gradient(180deg, #1a0d2a 0%, #0a0510 60%, #0a0a10 100%)";
      case "NIGHT HIGHWAY":
        return "radial-gradient(ellipse at 50% 40%, rgba(255,60,40,0.25), transparent 55%), #000";
      case "PIT LANE":
        return "linear-gradient(180deg, #1a0a0a 0%, #2a1414 40%, #0a0505 100%)";
      default:
        return "#000";
    }
  })();
  return (
    <div key={index} className="absolute inset-0" style={{ animation: "ci-cut-in 0.35s ease-out both" }}>
      <div className="absolute inset-0" style={{ background: bg }} />
      {/* horizon glow */}
      <div className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,60,40,0.35), transparent 70%)" }} />
      {/* streaks */}
      {streaks.map((_, i) => {
        const top = (i * 137) % 100;
        const dur = 0.18 + ((i * 13) % 40) / 100;
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
              opacity: 0.75,
              animation: `ci-streak ${dur}s linear ${delay}s infinite`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
      {/* motion vignette */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 90%)" }} />
      {/* car hint silhouette */}
      <div className="absolute bottom-[12%] left-1/2 h-20 w-56 -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,60,40,0.85), transparent 70%)",
          filter: "blur(4px)",
        }} />
      {/* #10 badge on car */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 font-display text-2xl text-white"
        style={{ textShadow: "0 0 10px rgba(0,0,0,0.9)" }}>#10</div>
      {/* location label */}
      <div className="absolute inset-x-0 bottom-24 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/50">Now Entering</div>
        <div className="mt-2 font-display text-4xl uppercase text-white md:text-6xl"
          style={{ textShadow: "0 0 30px rgba(255,60,40,0.8)" }}>
          {cut.loc}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

type Stage = "ignition" | "dashboard" | "countdown" | "launch" | "gate" | "done";

const LOCATIONS = ["CITY", "TUNNEL", "BRIDGE", "MOUNTAIN", "PIT LANE"];

export function CinematicIntro({ onDone, racerName }: { onDone: () => void; racerName: string }) {
  const [stage, setStage] = useState<Stage>("ignition");
  const [count, setCount] = useState<string>("3");
  const [rpm, setRpm] = useState(0);
  const [loc, setLoc] = useState(0);

  // Stage scheduler
  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStage("dashboard"), 1600));
    timers.push(window.setTimeout(() => setStage("countdown"), 4200));
    timers.push(window.setTimeout(() => setCount("2"), 4900));
    timers.push(window.setTimeout(() => setCount("1"), 5600));
    timers.push(window.setTimeout(() => setCount("GO"), 6300));
    timers.push(window.setTimeout(() => setStage("launch"), 7000));
    timers.push(window.setTimeout(() => setStage("gate"), 12200));
    timers.push(window.setTimeout(() => onDone(), 15200));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  // RPM needle sweep during dashboard stage
  useEffect(() => {
    if (stage !== "dashboard") return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 2200);
      // sweep up, blip, settle
      const eased = p < 0.7 ? p / 0.7 : 1 - (p - 0.7) * 0.6;
      setRpm(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  // Cycle locations during launch
  useEffect(() => {
    if (stage !== "launch") return;
    setLoc(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i >= LOCATIONS.length) { clearInterval(id); return; }
      setLoc(i);
    }, 950);
    return () => clearInterval(id);
  }, [stage]);

  const skip = () => onDone();

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-foreground">
      {/* SKIP */}
      <button
        onClick={skip}
        className="absolute right-4 top-4 z-50 border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70 backdrop-blur transition-colors hover:border-white/60 hover:text-white"
      >
        Skip →
      </button>

      {/* STAGE 1 · IGNITION */}
      {stage === "ignition" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-0"
            style={{
              background: "radial-gradient(circle at 50% 60%, rgba(255,60,40,0.35), transparent 60%)",
              animation: "ci-ignite 1.6s ease-out forwards",
            }}
          />
          <div className="relative text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/40 opacity-0"
              style={{ animation: "ci-fade-in 0.6s ease-out 0.2s forwards" }}>
              System · Boot
            </div>
            <div
              className="mt-4 font-display text-3xl uppercase tracking-[0.3em] text-white/80 opacity-0"
              style={{ animation: "ci-fade-in 0.8s ease-out 0.7s forwards" }}
            >
              Ignition…
            </div>
            <div
              className="mt-6 font-display text-6xl uppercase text-fire opacity-0 md:text-8xl"
              style={{ animation: "ci-vroom 1.1s ease-out 1.1s forwards" }}
            >
              vroom
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2 · DASHBOARD */}
      {stage === "dashboard" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(30,10,10,0.9), #000 70%)" }} />
          {/* Windshield reflection */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="relative grid w-full max-w-5xl grid-cols-3 items-center gap-6 px-8">
            {/* Left digital readout */}
            <div className="space-y-2 opacity-0" style={{ animation: "ci-fade-in 0.5s ease-out 0.1s forwards" }}>
              <DashRow label="OIL" value="98°C" />
              <DashRow label="FUEL" value="100%" />
              <DashRow label="GEAR" value="N" />
              <DashRow label="TURBO" value="READY" />
            </div>
            {/* Center RPM */}
            <div className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center rounded-full border-2 border-primary/40 bg-black shadow-[0_0_60px_rgba(255,60,40,0.35)_inset]">
              {/* tick marks */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
                {Array.from({ length: 21 }).map((_, i) => {
                  const a = (-135 + i * 13.5) * (Math.PI / 180);
                  const x1 = 100 + Math.cos(a) * 82;
                  const y1 = 100 + Math.sin(a) * 82;
                  const x2 = 100 + Math.cos(a) * (i > 14 ? 68 : 74);
                  const y2 = 100 + Math.sin(a) * (i > 14 ? 68 : 74);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i > 14 ? "#ff3c28" : "#888"} strokeWidth={i % 5 === 0 ? 2 : 1} />;
                })}
                {/* needle */}
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
            {/* Right digital readout */}
            <div className="space-y-2 text-right opacity-0" style={{ animation: "ci-fade-in 0.5s ease-out 0.3s forwards" }}>
              <DashRow label="SPEED" value={`${Math.round(rpm * 340)} KM/H`} right />
              <DashRow label="LAP" value="00:00.000" right />
              <DashRow label="MODE" value="RACE" right />
              <DashRow label="DRS" value={rpm > 0.5 ? "OPEN" : "CLOSED"} right />
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
            Systems Online · Driver Ready
          </div>
        </div>
      )}

      {/* STAGE 3 · COUNTDOWN */}
      {stage === "countdown" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at center, ${count === "GO" ? "#00d26a" : "#ff3c28"}55, transparent 60%)` }} />
          {/* 3 traffic lights */}
          <div className="absolute top-1/4 flex gap-4">
            {[0, 1, 2].map((i) => {
              const on = count === "GO" ? false : Number(count) <= 3 - i;
              return (
                <div key={i} className={`h-8 w-8 rounded-full border-2 border-white/20 transition-all ${on ? "bg-red-500 shadow-[0_0_20px_#ff3c28]" : "bg-white/5"}`} />
              );
            })}
          </div>
          <div
            key={count}
            className="font-display text-[10rem] leading-none md:text-[16rem]"
            style={{
              color: count === "GO" ? "#00ff88" : "#ff3c28",
              textShadow: count === "GO" ? "0 0 60px #00ff88" : "0 0 60px #ff3c28",
              animation: "ci-count 0.7s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            {count}
          </div>
        </div>
      )}

      {/* STAGE 4 · LAUNCH */}
      {stage === "launch" && (
        <div className="absolute inset-0 overflow-hidden bg-black">
          {/* road perspective */}
          <div className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #000 0%, #0a0510 45%, #1a0808 55%, #000 100%)",
            }}
          />
          {/* horizon glow */}
          <div className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2"
            style={{ background: "radial-gradient(ellipse at center, rgba(255,60,40,0.5), transparent 70%)" }} />
          {/* streaks */}
          <div className="absolute inset-0">
            {Array.from({ length: 40 }).map((_, i) => {
              const top = (i * 137) % 100;
              const dur = 0.25 + ((i * 13) % 40) / 100;
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
          </div>
          {/* motion blur radial */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 90%)" }} />
          {/* car silhouette (bottom) */}
          <div className="absolute bottom-[8%] left-1/2 h-24 w-64 -translate-x-1/2"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,60,40,0.9), transparent 70%)",
              filter: "blur(4px)",
              animation: "ci-car-shake 0.15s ease-in-out infinite",
            }} />
          {/* location label */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/50">Now Entering</div>
            <div
              key={loc}
              className="mt-3 font-display text-6xl uppercase text-white md:text-8xl"
              style={{
                textShadow: "0 0 30px rgba(255,60,40,0.8)",
                animation: "ci-loc 0.9s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {LOCATIONS[loc]}
            </div>
          </div>
          {/* HUD corners */}
          <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-widest text-primary">
            ▲ 340 KM/H
          </div>
          <div className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-widest text-accent">
            LAP 01 / 10
          </div>
        </div>
      )}

      {/* STAGE 5 · GATE */}
      {stage === "gate" && (
        <div className="absolute inset-0 overflow-hidden bg-black">
          {/* Smoke */}
          <div className="absolute inset-0 opacity-70"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, rgba(200,200,220,0.4), transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(255,255,255,0.15), transparent 50%)",
              animation: "ci-smoke 2.5s ease-out both",
            }} />
          {/* Gate light behind */}
          <div className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, rgba(255,220,120,0.9), rgba(255,80,40,0.3) 30%, transparent 60%)",
              opacity: 0,
              animation: "ci-gate-glow 2.5s ease-out 0.4s forwards",
            }} />
          {/* Gate doors */}
          <div className="absolute inset-y-0 left-0 w-1/2 origin-left"
            style={{
              background: "linear-gradient(90deg, #0a0a0a, #1a1a1a 60%, #2a1010)",
              borderRight: "4px solid #ff3c28",
              boxShadow: "8px 0 40px rgba(255,60,40,0.5)",
              animation: "ci-gate-left 2s cubic-bezier(0.7,0,0.3,1) 0.3s both",
            }}>
            <div className="absolute inset-y-0 right-0 w-2 checker-flag opacity-80" />
          </div>
          <div className="absolute inset-y-0 right-0 w-1/2 origin-right"
            style={{
              background: "linear-gradient(-90deg, #0a0a0a, #1a1a1a 60%, #2a1010)",
              borderLeft: "4px solid #ff3c28",
              boxShadow: "-8px 0 40px rgba(255,60,40,0.5)",
              animation: "ci-gate-right 2s cubic-bezier(0.7,0,0.3,1) 0.3s both",
            }}>
            <div className="absolute inset-y-0 left-0 w-2 checker-flag opacity-80" />
          </div>
          {/* Title revealed through gate */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0"
            style={{ animation: "ci-title 1.2s cubic-bezier(0.16,1,0.3,1) 1.3s forwards" }}>
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
        @keyframes ci-ignite {
          0% { opacity: 0; }
          40% { opacity: 0.2; }
          55% { opacity: 0.9; }
          70% { opacity: 0.4; }
          100% { opacity: 0.7; }
        }
        @keyframes ci-vroom {
          0% { opacity: 0; transform: scale(0.6) translateY(20px); letter-spacing: 0.5em; filter: blur(20px); }
          60% { opacity: 1; transform: scale(1.1) translateY(0); letter-spacing: 0.1em; filter: blur(0); }
          100% { opacity: 0.9; transform: scale(1) translateY(0); letter-spacing: 0.15em; }
        }
        @keyframes ci-count {
          0% { transform: scale(2.4); opacity: 0; filter: blur(30px); }
          40% { transform: scale(1); opacity: 1; filter: blur(0); }
          100% { transform: scale(0.7); opacity: 0; filter: blur(6px); }
        }
        @keyframes ci-streak {
          from { transform: translateX(0) scaleX(1); }
          to { transform: translateX(700%) scaleX(2); }
        }
        @keyframes ci-car-shake {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-49%) translateY(-2px); }
        }
        @keyframes ci-loc {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); filter: blur(20px); letter-spacing: 0.5em; }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); letter-spacing: 0.05em; }
        }
        @keyframes ci-smoke {
          0% { opacity: 0; transform: scale(1.3); }
          40% { opacity: 0.9; }
          100% { opacity: 0.3; transform: scale(1); }
        }
        @keyframes ci-gate-glow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes ci-gate-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-105%); }
        }
        @keyframes ci-gate-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(105%); }
        }
        @keyframes ci-title {
          0% { opacity: 0; transform: scale(0.85); filter: blur(20px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

function DashRow({ label, value, right }: { label: string; value: string; right?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${right ? "justify-end" : ""}`}>
      {right && <div className="font-display text-lg text-fire tabular-nums">{value}</div>}
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">{label}</div>
      {!right && <div className="font-display text-lg text-fire tabular-nums">{value}</div>}
    </div>
  );
}

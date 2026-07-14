import { useEffect, useState } from "react";
import { Flag, Trophy, Gift, PartyPopper } from "lucide-react";

type StageKey =
  | "headlight"  // Phase 1: Mystery, dark screen, distant rev, two headlights
  | "delivery"   // Phase 2: Car slowly drives forward, carrying balloons/gifts
  | "journey"    // Phase 3: Magical birthday world (colorful raceway, stars)
  | "countdown"  // Phase 4: Giant illuminated gate, 3...2...1
  | "reveal"     // Phase 5: Gate opens, "HAPPY 10TH BIRTHDAY AARAV"
  | "welcome"    // Phase 6: Personalized welcome message
  | "champion"   // Phase 7: Car drifts gently into scene under the message
  | "celebration"; // Phase 8 & 9: Confetti, balloons, and the CTA button

const STAGES: { key: StageKey; at: number; end: number }[] = [
  { key: "headlight",   at: 0,     end: 3500 },
  { key: "delivery",    at: 3000,  end: 7500 },
  { key: "journey",     at: 7000,  end: 13000 },
  { key: "countdown",   at: 12500, end: 17500 },
  { key: "reveal",      at: 17000, end: 23000 },
  { key: "welcome",     at: 22500, end: 28000 },
  { key: "champion",    at: 27500, end: 33000 },
  { key: "celebration", at: 32500, end: 10_000_000 },
];

const CTA_READY_AT = 33000;
const FADE = 600;
const SKIP_AT = 4000;
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

function F1Car({ mirror = false }: { mirror?: boolean }) {
  return (
    <svg width="360" height="140" viewBox="0 0 360 140" style={{ overflow: "visible", filter: mirror ? "none" : "drop-shadow(0 8px 18px rgba(255,60,40,0.35))" }}>
      <defs>
        <linearGradient id="f1body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6a3d" />
          <stop offset="0.35" stopColor="#e0261a" />
          <stop offset="1" stopColor="#3a0606" />
        </linearGradient>
        <linearGradient id="f1nose" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a1a1a" />
          <stop offset="0.5" stopColor="#e0261a" />
          <stop offset="1" stopColor="#ff8a5a" />
        </linearGradient>
        <radialGradient id="f1tire" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2a2a" />
          <stop offset="0.7" stopColor="#0a0a0a" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <linearGradient id="f1glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a2540" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
      </defs>

      {/* Underglow */}
      <ellipse cx="180" cy="118" rx="140" ry="6" fill="#ff3c28" opacity="0.55" filter="blur(6px)" />
      <ellipse cx="180" cy="120" rx="110" ry="3" fill="#ffcc40" opacity="0.6" filter="blur(3px)" />

      {/* Front wing (low, wide) */}
      <path d="M8 108 L60 108 L70 96 L58 96 L52 100 L14 100 Z" fill="#111" stroke="#e0261a" strokeWidth="1.2" />
      <rect x="6" y="106" width="60" height="3" fill="#e0261a" />
      <rect x="10" y="98" width="12" height="2" fill="#ffcc40" />

      {/* Nose cone (long, pointed) */}
      <path d="M40 96 Q95 84, 150 82 L150 96 L60 96 Z" fill="url(#f1nose)" />
      <path d="M40 96 Q95 84, 150 82" stroke="#ffb090" strokeWidth="0.6" fill="none" opacity="0.6" />

      {/* Sidepods */}
      <path d="M150 96 Q180 78, 230 78 L280 82 L285 100 L150 100 Z" fill="url(#f1body)" stroke="#000" strokeWidth="0.6" />
      {/* Sidepod intake */}
      <path d="M158 92 Q175 84, 210 84 L210 92 Z" fill="#000" />
      <path d="M162 90 Q178 86, 206 86" stroke="#ff8a5a" strokeWidth="0.8" fill="none" />

      {/* Engine cover ridge */}
      <path d="M195 78 Q235 66, 275 78 L275 84 Q235 74, 195 84 Z" fill="#1a1a1a" stroke="#e0261a" strokeWidth="0.6" />
      {/* Airbox above cockpit */}
      <path d="M195 78 Q205 60, 225 60 L235 62 L235 76 Z" fill="#0a0a0a" stroke="#e0261a" strokeWidth="0.6" />

      {/* Cockpit + Halo */}
      <path d="M160 82 Q180 68, 200 70 L200 84 L160 84 Z" fill="url(#f1glass)" stroke="#e0261a" strokeWidth="0.8" />
      {/* Halo bar */}
      <path d="M150 78 Q180 56, 210 78" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M150 78 Q180 56, 210 78" stroke="#ff8a5a" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Halo center strut */}
      <line x1="180" y1="60" x2="180" y2="72" stroke="#000" strokeWidth="2.5" />

      {/* Racing #10 on sidepod */}
      <text x="205" y="97" fontFamily="Impact, 'Racing Sans One', sans-serif" fontSize="18" fill="#ffcc40" stroke="#000" strokeWidth="0.6" fontStyle="italic" fontWeight="900">10</text>
      {/* Aarav GP decal */}
      <text x="230" y="97" fontFamily="ui-monospace, monospace" fontSize="6" fill="#fff" opacity="0.9" letterSpacing="1.5">AARAV GP</text>

      {/* Rear wing (large, dramatic) */}
      <rect x="295" y="52" width="8" height="52" fill="#111" stroke="#e0261a" strokeWidth="0.5" />
      <rect x="278" y="50" width="44" height="10" rx="1" fill="url(#f1body)" stroke="#000" strokeWidth="0.5" />
      <rect x="282" y="62" width="36" height="4" rx="1" fill="#e0261a" opacity="0.85" />
      <rect x="286" y="70" width="28" height="3" rx="1" fill="#3a0606" />
      {/* DRS gap highlight */}
      <line x1="280" y1="56" x2="320" y2="56" stroke="#ffcc40" strokeWidth="0.4" opacity="0.7" />

      {/* Rear diffuser + brake light */}
      <rect x="286" y="100" width="30" height="6" fill="#0a0a0a" stroke="#333" strokeWidth="0.4" />
      <circle cx="301" cy="80" r="3" fill="#ff2020">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
      </circle>

      {/* Headlight signature (LED strip on nose) */}
      <path d="M52 92 L64 92" stroke="#e6f4ff" strokeWidth="1.8" strokeLinecap="round" opacity="0.95" />
      <circle cx="58" cy="92" r="2.4" fill="#fff" opacity="0.95">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <path d="M42 92 L54 92" stroke="#7ecbff" strokeWidth="0.6" opacity="0.7" />

      {/* Front wheel */}
      <g>
        <circle cx="90" cy="110" r="20" fill="url(#f1tire)" />
        <circle cx="90" cy="110" r="20" fill="none" stroke="#000" strokeWidth="1" />
        <circle cx="90" cy="110" r="10" fill="#181818" stroke="#e0261a" strokeWidth="1.2" />
        <g style={{ transformOrigin: "90px 110px", animation: "ci-wheel-spin 0.35s linear infinite" }}>
          <line x1="80" y1="110" x2="100" y2="110" stroke="#ff8a5a" strokeWidth="1.2" />
          <line x1="90" y1="100" x2="90" y2="120" stroke="#ff8a5a" strokeWidth="1.2" />
          <line x1="83" y1="103" x2="97" y2="117" stroke="#ff8a5a" strokeWidth="0.8" />
          <line x1="97" y1="103" x2="83" y2="117" stroke="#ff8a5a" strokeWidth="0.8" />
        </g>
        <circle cx="90" cy="110" r="2.5" fill="#ffcc40" />
      </g>

      {/* Rear wheel */}
      <g>
        <circle cx="280" cy="112" r="24" fill="url(#f1tire)" />
        <circle cx="280" cy="112" r="24" fill="none" stroke="#000" strokeWidth="1" />
        <circle cx="280" cy="112" r="12" fill="#181818" stroke="#e0261a" strokeWidth="1.4" />
        <g style={{ transformOrigin: "280px 112px", animation: "ci-wheel-spin 0.35s linear infinite" }}>
          <line x1="268" y1="112" x2="292" y2="112" stroke="#ff8a5a" strokeWidth="1.4" />
          <line x1="280" y1="100" x2="280" y2="124" stroke="#ff8a5a" strokeWidth="1.4" />
          <line x1="271" y1="103" x2="289" y2="121" stroke="#ff8a5a" strokeWidth="0.9" />
          <line x1="289" y1="103" x2="271" y2="121" stroke="#ff8a5a" strokeWidth="0.9" />
        </g>
        <circle cx="280" cy="112" r="3" fill="#ffcc40" />
      </g>

      {/* Suspension arms */}
      <line x1="90" y1="110" x2="120" y2="98" stroke="#222" strokeWidth="2" />
      <line x1="90" y1="110" x2="120" y2="104" stroke="#222" strokeWidth="2" />
      <line x1="280" y1="112" x2="260" y2="96" stroke="#222" strokeWidth="2" />
      <line x1="280" y1="112" x2="260" y2="104" stroke="#222" strokeWidth="2" />
    </svg>
  );
}

export function CinematicIntro({ onDone, racerName, guestName }: { onDone: () => void; racerName: string; guestName: string }) {
  const [running, setRunning] = useState(true);
  const t = useElapsed(running);
  const [showSkip, setShowSkip] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShowSkip(true), SKIP_AT);
    return () => clearTimeout(id);
  }, []);

  const opacityFor = (key: StageKey) => {
    const s = STAGES.find((x) => x.key === key)!;
    if (t < s.at) return 0;
    if (t < s.at + FADE) return (t - s.at) / FADE;
    if (key === "celebration") return 1; 
    if (t > s.end) return 0;
    if (t > s.end - FADE) return Math.max(0, (s.end - t) / FADE);
    return 1;
  };
  const stageProgress = (key: StageKey) => {
    const s = STAGES.find((x) => x.key === key)!;
    return Math.max(0, Math.min(1, (t - s.at) / (s.end - s.at)));
  };

  const skip = () => {
    setRunning(false);
    onDone();
  };

  const ctaReady = t >= CTA_READY_AT && !celebrating;

  const enterCelebration = () => {
    if (celebrating) return;
    setCelebrating(true);
    window.setTimeout(() => {
      setRunning(false);
      onDone();
    }, 1200); // Quick fade out to main site
  };

  // derived countdown number
  const cP = stageProgress("countdown");
  const count = cP < 0.3 ? 3 : cP < 0.6 ? 2 : cP < 0.9 ? 1 : 0;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-foreground">
      {/* SKIP */}
      <button
        onClick={skip}
        className="absolute right-4 top-4 z-50 border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.35em] text-white/70 backdrop-blur transition-all hover:border-white/60 hover:text-white"
        style={{
          opacity: showSkip ? 1 : 0,
          transform: showSkip ? "translateY(0)" : "translateY(-6px)",
          transition: `opacity 600ms ${EASE}, transform 600ms ${EASE}`,
          pointerEvents: showSkip ? "auto" : "none",
        }}
      >
        Skip Intro →
      </button>

      {/* Persistent vignette */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.95) 100%)" }} />

      {/* ─────────── 1 · HEADLIGHT REVEAL ─────────── */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: opacityFor("headlight"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="relative flex w-64 justify-between">
           {/* Two bright headlights */}
           <div className="relative h-12 w-20 rounded-[50%] bg-white blur-md" style={{ boxShadow: "0 0 80px 30px rgba(255,255,255,0.8), 0 0 150px 40px rgba(100,200,255,0.4)", animation: "ci-headlight 2.5s ease-out both" }}>
              <div className="absolute inset-2 rounded-full bg-white blur-[2px] shadow-[0_0_20px_10px_#fff]" />
           </div>
           <div className="relative h-12 w-20 rounded-[50%] bg-white blur-md" style={{ boxShadow: "0 0 80px 30px rgba(255,255,255,0.8), 0 0 150px 40px rgba(100,200,255,0.4)", animation: "ci-headlight 2.5s ease-out both" }}>
              <div className="absolute inset-2 rounded-full bg-white blur-[2px] shadow-[0_0_20px_10px_#fff]" />
           </div>
        </div>
      </div>

      {/* ─────────── 2 · THE SPECIAL DELIVERY ─────────── */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: opacityFor("delivery"), transition: `opacity ${FADE}ms ${EASE}` }}>
        {/* Racing tunnel environment */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 65%, rgba(255,60,40,0.18), transparent 70%)" }} />
        {/* Tunnel light strips converging to vanishing point */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`ts-${i}`} className="absolute left-1/2 top-1/2 h-[2px] w-[120vw] -translate-x-1/2 origin-center"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0,210,255,0.5), transparent)",
                transform: `translate(-50%, -50%) rotate(${(i - 3.5) * 6}deg)`,
                animation: `ci-tunnel-streak 1.4s linear ${i * 0.12}s infinite`,
              }} />
          ))}
        </div>
        {/* Ground plane with reflection gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(255,60,40,0.05) 40%, rgba(0,0,0,0.9) 100%)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-[38%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="absolute bottom-16 text-center font-display text-xl uppercase tracking-widest text-accent sm:text-2xl md:text-3xl" style={{ textShadow: "0 0 20px rgba(255,220,100,0.5)" }}>
           A Special Delivery Arrives...
        </div>

        <div className="relative" style={{ animation: "ci-drive-forward 5s ease-out both" }}>
          {/* Subtle vibration wrapper */}
          <div style={{ animation: "ci-vibrate 0.12s ease-in-out infinite" }}>

            {/* Ground reflection of the car (mirrored, blurred, faded) */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 opacity-30 blur-[3px]"
              style={{ transform: "translateX(-50%) scaleY(-0.6)", maskImage: "linear-gradient(180deg, black, transparent 80%)" }}>
              <F1Car mirror />
            </div>

            {/* Main F1 car */}
            <F1Car />

            {/* Headlight beams sweeping ground */}
            <div className="pointer-events-none absolute left-[-40px] top-[54%] h-24 w-40 origin-left"
              style={{ background: "conic-gradient(from 200deg at 0% 50%, transparent 0deg, rgba(200,230,255,0.35) 8deg, transparent 20deg)", filter: "blur(6px)" }} />

            {/* Cargo platform on rear — celebration crate with gifts */}
            <div className="absolute" style={{ left: "58%", top: "-6px" }}>
              {/* Crate */}
              <div className="relative h-10 w-24 rounded-md border border-accent/60 bg-gradient-to-b from-zinc-800 to-black shadow-[0_0_25px_rgba(255,60,40,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
                <div className="absolute inset-x-2 top-1 h-px bg-white/20" />
                <div className="absolute inset-x-2 bottom-1 h-px bg-white/10" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-[0.25em] text-accent">Team Aarav</div>
              </div>
              {/* Stacked glowing gifts */}
              <div className="absolute -top-6 left-3 h-8 w-10 rounded-sm border border-primary/80 bg-primary/30 shadow-[0_0_18px_rgba(255,60,40,0.7)] backdrop-blur-sm">
                <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-accent" />
                <div className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-accent" />
              </div>
              <div className="absolute -top-10 left-12 h-10 w-8 rounded-sm border border-accent/80 bg-accent/30 shadow-[0_0_18px_rgba(255,220,100,0.7)] backdrop-blur-sm">
                <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-primary" />
                <div className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-primary" />
              </div>
            </div>

            {/* Balloons tied to the cargo with visible strings, swaying from speed */}
            <div className="absolute" style={{ left: "62%", top: "-140px" }}>
              <div className="relative flex items-end gap-3" style={{ transformOrigin: "bottom center", animation: "ci-balloon-sway 2.4s ease-in-out infinite" }}>
                {[
                  { c: "#34d399", h: 44, d: 0 },
                  { c: "#60a5fa", h: 56, d: 0.4 },
                  { c: "#c084fc", h: 44, d: 0.2 },
                ].map((b, i) => (
                  <div key={`bl-${i}`} className="relative" style={{ animation: `ci-float 3s ease-in-out ${b.d}s infinite` }}>
                    <div className="rounded-[50%]"
                      style={{ width: b.h * 0.75, height: b.h, background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), ${b.c} 55%, rgba(0,0,0,0.3) 100%)`, boxShadow: `0 0 24px ${b.c}` }}>
                      <div className="mx-auto mt-[100%] h-1 w-2 -translate-y-2 rounded-b-sm" style={{ background: b.c, filter: "brightness(0.7)" }} />
                    </div>
                    {/* String */}
                    <svg className="absolute left-1/2 top-full -translate-x-1/2" width="20" height="80" viewBox="0 0 20 80">
                      <path d={`M10 0 Q ${10 + (i - 1) * 4} 40, ${10 + (i - 1) * 6} 80`} stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─────────── 3 · BIRTHDAY JOURNEY ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ opacity: opacityFor("journey"), transition: `opacity ${FADE}ms ${EASE}` }}>
         <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a0826 0%, #050110 100%)" }} />
         
         {/* Birthday arches flying by */}
         {Array.from({ length: 6 }).map((_, i) => (
           <div key={i} className="absolute inset-0 flex items-center justify-center border-t-8 border-transparent"
             style={{ 
               borderTopColor: ["#ff3c28", "#ffa040", "#00ff88", "#00d2ff", "#ff00d2", "#ffcc00"][i],
               borderRadius: "50% 50% 0 0",
               transformOrigin: "bottom center",
               animation: `ci-arch-flyby 4s ease-in infinite ${i * 0.7}s`,
               opacity: 0
             }} 
           />
         ))}
         {/* Floating glowing stars */}
         {Array.from({ length: 30 }).map((_, i) => (
           <div key={i} className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#fff]"
             style={{
               left: `${(i * 17) % 100}%`,
               top: `${(i * 23) % 100}%`,
               animation: `ci-star-twinkle ${2 + (i % 3)}s ease-in-out infinite ${i * 0.1}s`,
             }} />
         ))}
         {/* Ground line */}
         <div className="absolute inset-x-0 bottom-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
         
         <div className="absolute inset-x-0 top-1/4 px-4 text-center font-display text-2xl uppercase text-white/80 md:text-4xl" style={{ animation: "ci-pulse 3s infinite" }}>
            The Celebration Begins
         </div>
      </div>

      {/* ─────────── 4 · COUNTDOWN MOMENT ─────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: opacityFor("countdown"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(circle at center, rgba(255,220,100,0.1), transparent 60%)" }} />
        <div className="font-mono text-sm uppercase tracking-[0.5em] text-white/50">Approaching Party Gates</div>
        <div className="mt-10 flex h-40 w-40 items-center justify-center rounded-full border-4 border-white/20"
             style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.1), 0 0 60px rgba(255,255,255,0.1)" }}>
          {count > 0 && (
             <div className="font-display text-8xl text-white drop-shadow-[0_0_20px_#fff]" key={count} style={{ animation: "ci-pop 1s ease-out both" }}>
               {count}
             </div>
          )}
        </div>
      </div>

      {/* ─────────── 5 · THE GRAND REVEAL ─────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity: opacityFor("reveal"), transition: `opacity ${FADE}ms ${EASE}` }}>
        
        {/* Flash */}
        <div className="absolute inset-0 bg-white" style={{ animation: "ci-flash-fade 2s ease-out both" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,60,40,0.3), #000 80%)" }} />
        
        {/* Fireworks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`fw1-${i}`} className="absolute h-6 w-6 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 4) * 15}%`,
              background: ["#ff3c28", "#ffa040", "#00ff88", "#00d2ff", "#ff00d2", "#fff", "#ffcc40", "#ff3c28"][i],
              boxShadow: `0 0 100px 30px ${["#ff3c28", "#ffa040", "#00ff88", "#00d2ff", "#ff00d2", "#fff", "#ffcc40", "#ff3c28"][i]}`,
              animation: `ci-firework 2.5s ${EASE} ${i * 0.2}s both`,
            }} />
        ))}

        <div className="relative px-4 text-center" style={{ animation: "ci-title-up 1.5s ease-out both 0.5s" }}>
          <div className="font-mono text-xs uppercase tracking-[0.6em] text-accent">Gate Open</div>
          <div className="mt-4 font-display text-4xl uppercase leading-[0.9] text-white sm:text-6xl md:text-8xl"
            style={{ textShadow: "0 0 40px rgba(255,60,40,0.6)" }}>
            HAPPY 10<span className="text-white/80">TH</span> BIRTHDAY
          </div>
          <div className="mt-4 font-display text-6xl uppercase text-fire sm:text-7xl md:text-9xl"
            style={{ textShadow: "0 0 60px rgba(255,60,40,0.8)" }}>
            {racerName}
          </div>
        </div>
      </div>

      {/* ─────────── 6 · PERSONALIZED WELCOME ─────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity: opacityFor("welcome"), transition: `opacity ${FADE}ms ${EASE}` }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(10,30,50,0.5), #000 70%)" }} />
        
        {/* Dynamic background element */}
        <div className="absolute inset-x-0 top-[40%] h-40 -skew-y-3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute inset-x-0 top-[48%] h-2 border-y border-white/10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] opacity-20" />

        <div className="relative z-10 px-4 text-center" style={{ animation: "ci-fade-up 1.5s ease-out both" }}>
           <div className="mb-4 flex justify-center gap-4 text-4xl sm:text-5xl items-center">
             <Flag className="animate-bounce h-10 w-10 sm:h-12 sm:w-12 text-white" style={{ animationDelay: "0s", animationDuration: "2s" }} />
             <Trophy className="animate-bounce h-10 w-10 sm:h-12 sm:w-12 text-yellow-400" style={{ animationDelay: "0.2s", animationDuration: "2s" }} />
             <Gift className="animate-bounce h-10 w-10 sm:h-12 sm:w-12 text-primary" style={{ animationDelay: "0.4s", animationDuration: "2s" }} />
           </div>
           
           <div className="font-display text-3xl uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] sm:text-5xl md:text-7xl">
              Welcome to <span className="text-fire">{racerName}'s</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,200,0,0.5)]">
                Birthday Grand Prix
              </span>
           </div>
           
           <div className="mx-auto mt-8 max-w-lg rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs uppercase tracking-widest text-white/80 backdrop-blur-sm sm:text-sm md:text-base">
              Your presence makes this celebration
              <br />
              <span className="text-accent">even more special.</span>
           </div>
        </div>
      </div>

      {/* ─────────── 7, 8 & 9 · CHAMPION ARRIVAL, CELEBRATION MOMENT & CTA ─────────── */}
      <div className="absolute inset-0 overflow-hidden"
        style={{ 
          opacity: opacityFor("champion") || opacityFor("celebration") ? 1 : 0, 
          transition: `opacity ${FADE}ms ${EASE}` 
        }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom, rgba(255,60,40,0.15), #000 80%)" }} />

        {/* Confetti & Balloons background */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={`c2-${i}`} className="absolute h-3 w-1.5"
            style={{
              left: `${(i * 31) % 100}%`,
              top: "-5%",
              background: ["#ff3c28", "#ffa040", "#ffffff", "#00ff88", "#00d2ff"][i % 5],
              animation: `ci-confetti-fall ${4 + (i % 4)}s linear ${i * 0.1}s infinite`,
            }} />
        ))}
        {[15, 30, 70, 85].map((x, i) => (
          <div key={`b-${i}`} className="absolute h-10 w-8 rounded-full"
            style={{
              left: `${x}%`,
              bottom: "-10%",
              background: ["#ff3c28", "#ffa040", "#00ff88", "#00d2ff"][i],
              boxShadow: `0 0 20px ${["#ff3c28", "#ffa040", "#00ff88", "#00d2ff"][i]}`,
              animation: `ci-balloon-rise ${6 + i}s ease-in-out infinite ${i * 1.5}s`,
            }} />
        ))}

        {/* Unified Typography Block */}
        <div className="absolute inset-x-0 top-[38%] flex -translate-y-1/2 flex-col items-center gap-10 px-4 text-center sm:gap-14">
          {/* Guest Welcome */}
          <div style={{ animation: "ci-fade-down 1.5s ease-out both" }}>
            <div className="font-mono text-xs uppercase tracking-widest text-white/70 sm:text-sm">
              Welcome to the Celebration,
            </div>
            <div className="mt-4 font-display text-3xl uppercase text-accent sm:text-5xl" style={{ textShadow: "0 0 20px rgba(255,220,100,0.4)" }}>
              {guestName}
            </div>
          </div>

          {/* Happy Birthday Wish */}
          <div style={{ animation: "ci-title-up 1.5s ease-out both 0.5s" }}>
            <div className="font-display text-4xl uppercase text-white sm:text-6xl md:text-8xl" style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}>
               HAPPY 10TH BIRTHDAY
               <br />
               <span className="text-fire">{racerName}</span>
            </div>
          </div>

          {/* CTA Button placed right below Happy Birthday */}
          <div
            className="mt-8 sm:mt-12"
            style={{
              opacity: ctaReady ? 1 : 0,
              transform: ctaReady ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 1.5s ${EASE}, transform 1.5s ${EASE}`,
              pointerEvents: ctaReady ? "auto" : "none",
            }}
          >
            <button
              onClick={enterCelebration}
              className="group relative flex overflow-hidden rounded-full bg-gradient-to-r from-fire via-primary to-fire bg-[length:200%_auto] px-6 py-4 font-display text-xs uppercase tracking-widest text-white shadow-[0_0_40px_rgba(255,60,40,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,60,40,0.8)] sm:px-10 sm:text-lg md:px-12 md:py-5 md:text-2xl"
              style={{ animation: "ci-gradient-shift 3s linear infinite" }}
            >
              {/* Glowing border ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              <div className="absolute inset-0 rounded-full opacity-0 outline outline-4 outline-white/40 transition-opacity group-hover:opacity-100" style={{ animation: "ci-pulse 2s infinite" }} />
              
              <span className="relative z-10 flex items-center justify-center gap-2 text-center drop-shadow-md sm:gap-4">
                 <Flag aria-hidden className="h-5 w-5 sm:h-7 sm:w-7" /> 
                 <span>Enter The Birthday Celebration</span>
                 <PartyPopper aria-hidden className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
              
              {/* Shimmer sweep */}
              <span className="absolute inset-y-0 -left-[100%] w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 group-hover:left-[200%]" />
            </button>
          </div>
        </div>

        {/* The Car Drifting gently into the scene */}
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2" style={{ animation: "ci-gentle-park 4s cubic-bezier(0.2, 0.8, 0.2, 1) both" }}>
           <div className="relative flex h-20 w-64 items-center justify-center rounded-xl border border-primary bg-black/80 shadow-[0_20px_60px_rgba(255,60,40,0.3)] backdrop-blur">
              <div className="font-display text-4xl text-white">#10</div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 border border-white/30 bg-black px-3 py-1 font-mono text-[8px] uppercase tracking-widest text-accent whitespace-nowrap">
                 PARTY VEHICLE
              </div>
           </div>
           {/* Soft glow underneath */}
           <div className="mx-auto mt-4 h-4 w-56 rounded-full bg-primary/40 blur-xl" />
        </div>
      </div>

      {/* FINAL EXIT FADE */}
      {celebrating && (
        <div className="absolute inset-0 z-50 bg-black" style={{ animation: "ci-fade-to-black 1s ease-in forwards" }} />
      )}

      <style>{`
        @keyframes ci-headlight {
          0% { opacity: 0; transform: scale(0.2) translateY(20px); filter: brightness(0.5); }
          50% { opacity: 1; transform: scale(1.1) translateY(-5px); filter: brightness(1.5); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
        }
        @keyframes ci-drive-forward {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes ci-arch-flyby {
          0% { transform: scale(0.1) translateY(100px); opacity: 0; border-width: 2px; }
          20% { opacity: 1; }
          100% { transform: scale(15) translateY(-50px); opacity: 0; border-width: 20px; }
        }
        @keyframes ci-star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes ci-pop {
          0% { transform: scale(0.5); opacity: 0; }
          20% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ci-flash-fade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes ci-firework {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes ci-title-up {
          0% { transform: translateY(40px); opacity: 0; filter: blur(10px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes ci-fade-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes ci-fade-down {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes ci-confetti-fall {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.6; }
        }
        @keyframes ci-balloon-rise {
          0% { transform: translateY(0) rotate(-5deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-120vh) rotate(5deg); opacity: 0; }
        }
        @keyframes ci-gentle-park {
          0% { transform: translate(-150%, 0) scale(0.9); opacity: 0; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        @keyframes ci-fade-to-black {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes ci-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ci-pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes ci-gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes ci-wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ci-vibrate {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.6px); }
        }
        @keyframes ci-tunnel-streak {
          0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) scaleX(0.2); }
          40% { opacity: 0.8; }
          100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) scaleX(1.4); }
        }
        @keyframes ci-balloon-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}

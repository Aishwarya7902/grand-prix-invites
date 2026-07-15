import { useEffect, useRef, useState } from "react";
import { Trophy, Sparkles, Flag, Medal } from "lucide-react";
import confetti from "canvas-confetti";

import memYear1 from "@/assets/year1.webp";
import memYear3 from "@/assets/year3.webp";
import memYear5 from "@/assets/year5.avif";
import memYear8 from "@/assets/year8.webp";
import memYear10 from "@/assets/year10.webp";

const MEMORIES = [
  {
    age: "1",
    title: "First Steps",
    caption: "Every great champion begins with one tiny step.",
    img: memYear1,
    progress: 0.15,
  },
  {
    age: "3",
    title: "Little Explorer",
    caption: "The adventure had only just begun. Always curious.",
    img: memYear3,
    progress: 0.35,
  },
  {
    age: "5",
    title: "Halfway Champion",
    caption: "A milestone reached with boundless energy and the brightest smiles.",
    img: memYear5,
    progress: 0.55,
  },
  {
    age: "8",
    title: "Dreams Take Flight",
    caption: "Growing fast, dreaming big, and conquering every turn.",
    img: memYear8,
    progress: 0.75,
  },
  {
    age: "10",
    title: "The Grand Champion",
    caption: "A decade of incredible memories. The ultimate birthday champion!",
    img: memYear10,
    progress: 0.90,
  },
];

const TRACK_PATH = "M 50 -5 C 90 15, 90 25, 50 40 C 10 55, 10 65, 50 80 C 90 95, 50 105, 50 105";

export function MemoryWorld({ racerName }: { racerName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  
  const [activeMemory, setActiveMemory] = useState(-1);
  const [showFinish, setShowFinish] = useState(false);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const len = path.getTotalLength();
    
    // Precompute checkpoint positions
    const pts = MEMORIES.map(m => {
       const p = path.getPointAtLength(len * m.progress);
       return { x: p.x, y: p.y };
    });
    setPoints(pts);

    let lastProgress = 0;

    const onScroll = () => {
      if (!containerRef.current || !pathRef.current || !carRef.current || !glowPathRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = -rect.top;
      // We want the scroll to start when the container hits the top of the viewport
      // and end when the bottom of the container hits the bottom of the viewport.
      const maxScroll = rect.height - window.innerHeight;
      
      let p = scrollY / maxScroll;
      p = Math.max(0, Math.min(1, p));

      // Fire confetti if we just crossed the finish line
      if (p > 0.95 && lastProgress <= 0.95) {
         confetti({
           particleCount: 150,
           spread: 100,
           origin: { y: 0.6 },
           colors: ['#ff2020', '#ffcc40', '#00d2ff', '#ffffff', '#34d399']
         });
      }
      lastProgress = p;

      // Update React state sparsely
      let active = -1;
      MEMORIES.forEach((m, i) => {
         // Activate memory when car is near it
         if (p >= m.progress - 0.05 && p <= m.progress + 0.15) active = i;
      });
      setActiveMemory(active);
      setShowFinish(p > 0.95);

      // DOM Mutations for smooth 60fps tracking
      const currentLen = len * p;
      const pt = path.getPointAtLength(currentLen);
      
      // Calculate angle by looking slightly ahead
      const nextPt = path.getPointAtLength(Math.min(currentLen + 1, len));
      const dx = (nextPt.x - pt.x) * (window.innerWidth / 100);
      const dy = (nextPt.y - pt.y) * (window.innerHeight / 100);
      
      // SVG Car points UP. To rotate it correctly:
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      carRef.current.style.transform = `translate(-50%, -50%) translate(${pt.x}vw, ${pt.y}vh) rotate(${angle}deg)`;
      
      // Animate track glow
      glowPathRef.current.style.strokeDasharray = `${len}`;
      glowPathRef.current.style.strokeDashoffset = `${len - currentLen}`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial call to set positions
    onScroll(); 
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="memories" ref={containerRef} className="relative w-full h-[600vh] bg-black text-white">
      
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .checkpoint-active {
          box-shadow: 0 0 30px 10px rgba(255, 60, 40, 0.6);
          background: #ff3c28;
          border-color: #fff;
        }
      `}</style>

      {/* Sticky Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Intro Message (fades out as we scroll) */}
        <div 
          className="absolute inset-x-0 top-[15vh] flex flex-col items-center text-center z-10 transition-opacity duration-1000"
          style={{ opacity: activeMemory === -1 && !showFinish ? 1 : 0, pointerEvents: "none" }}
        >
           <h2 className="font-display text-4xl sm:text-6xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] uppercase">
             {racerName}'s Journey <br/> <span className="text-accent text-3xl sm:text-5xl">To The Championship</span>
           </h2>
           <p className="mt-4 max-w-md mx-auto text-white/70 font-mono text-sm sm:text-base px-4">
             Every champion starts somewhere. Let's travel through the incredible journey from Age 1 to Age 10.
           </p>
        </div>

        {/* The Racetrack */}
        <div className="absolute inset-0 opacity-80" style={{ filter: showFinish ? "brightness(0.3)" : "none", transition: "filter 1s ease" }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            {/* Background Track Line */}
            <path 
              d={TRACK_PATH} 
              fill="none" stroke="#222" strokeWidth={isMobile ? "2" : "1.5"} 
            />
            {/* Dashed Center Line */}
            <path 
              d={TRACK_PATH} 
              fill="none" stroke="#444" strokeWidth="0.2" strokeDasharray="1 2"
            />
            {/* Glowing Active Track */}
            <path 
              ref={glowPathRef}
              d={TRACK_PATH} 
              fill="none" stroke="#ff3c28" strokeWidth={isMobile ? "2" : "1.5"} 
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 8px #ff3c28)" }}
            />
            {/* Invisible path for length calculations */}
            <path 
              ref={pathRef}
              d={TRACK_PATH} 
              fill="none" stroke="transparent" strokeWidth="1" 
            />
          </svg>
        </div>

        {/* Checkpoints */}
        {points.map((pt, i) => {
          const isActive = activeMemory === i;
          return (
            <div key={`cp-${i}`} className="absolute z-20 transition-all duration-500"
                 style={{ 
                   left: `${pt.x}vw`, 
                   top: `${pt.y}vh`,
                   transform: 'translate(-50%, -50%)',
                   opacity: showFinish ? 0 : 1
                 }}>
              
              {/* Checkpoint Dot */}
              <div className={`relative w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white/40 bg-zinc-900 transition-all duration-500 ${isActive ? 'checkpoint-active scale-125' : ''}`}>
                 {isActive && (
                   <div className="absolute inset-0 rounded-full border border-white" style={{ animation: "pulse-ring 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite" }} />
                 )}
              </div>

              {/* Memory Card */}
              <div className={`absolute w-[85vw] sm:w-[400px] p-4 sm:p-6 bg-zinc-900/95 border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-700 z-40
                              ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
                   style={{
                     ...(isMobile 
                        ? { 
                            left: `calc(50vw - ${pt.x}vw)`, 
                            top: `calc(50vh - ${pt.y}vh)`, 
                            transform: 'translate(-50%, -50%)',
                            marginTop: pt.y > 50 ? '-15vh' : '15vh' // offset so car is visible
                          } 
                        : { 
                            top: '50%', transform: 'translateY(-50%)',
                            ...(pt.x > 50 ? { right: '200%' } : { left: '200%' })
                          }
                     )
                   }}
              >
                 <div className="flex items-center gap-2 font-mono text-accent text-xs sm:text-sm tracking-widest mb-2">
                    <Flag className="w-3 h-3" />
                    PIT STOP 0{i + 1} · AGE {MEMORIES[i].age}
                 </div>
                 <h3 className="font-display text-2xl sm:text-3xl text-white mb-4">{MEMORIES[i].title}</h3>
                 
                 <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl mb-4 border border-white/10 group">
                   <div className="absolute inset-0 bg-accent/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
                   <img src={MEMORIES[i].img} alt={MEMORIES[i].title} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                 </div>
                 
                 <p className="text-white/80 text-sm sm:text-base leading-relaxed">{MEMORIES[i].caption}</p>
                 
                 {isActive && (
                   <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-accent animate-pulse" />
                 )}
              </div>
            </div>
          );
        })}

        {/* The Journey Car */}
        <div ref={carRef} className="absolute left-0 top-0 z-30 transition-opacity duration-500" style={{ opacity: showFinish ? 0 : 1 }}>
          {/* Subtle neon trail */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-16 bg-gradient-to-t from-transparent to-[#ff3c28] blur-md opacity-60" />
          
          <svg width={isMobile ? "30" : "40"} height={isMobile ? "60" : "80"} viewBox="0 0 40 80" style={{ filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))" }}>
            <rect x="15" y="10" width="10" height="60" fill="#ff3c28" rx="2" />
            {/* Front Wing */}
            <path d="M 5 15 L 35 15 L 35 22 L 5 22 Z" fill="#111" stroke="#ff3c28" strokeWidth="0.5" />
            {/* Rear Wing */}
            <path d="M 5 65 L 35 65 L 35 75 L 5 75 Z" fill="#111" stroke="#ff3c28" strokeWidth="0.5" />
            {/* Wheels */}
            <rect x="3" y="25" width="6" height="12" fill="#000" rx="1" />
            <rect x="31" y="25" width="6" height="12" fill="#000" rx="1" />
            <rect x="3" y="55" width="6" height="12" fill="#000" rx="1" />
            <rect x="31" y="55" width="6" height="12" fill="#000" rx="1" />
            {/* Driver Helmet */}
            <circle cx="20" cy="40" r="4.5" fill="#ffcc40" stroke="#000" strokeWidth="1" />
            {/* Number 10 */}
            <text x="20" y="52" fontSize="6" textAnchor="middle" fill="#fff" fontFamily="Impact" fontStyle="italic">10</text>
          </svg>
        </div>

        {/* Grand Finish Line */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center z-40 bg-black/80 backdrop-blur-sm transition-all duration-1000 ${showFinish ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="relative" style={{ animation: showFinish ? "ci-scale-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) both" : "none" }}>
            <div className="absolute inset-0 bg-accent blur-[100px] opacity-30 rounded-full" />
            <Medal className="w-32 h-32 sm:w-48 sm:h-48 text-accent mx-auto mb-8 drop-shadow-[0_0_30px_rgba(255,200,60,0.8)]" />
          </div>
          
          <h2 className="font-display text-5xl sm:text-8xl text-white text-center uppercase drop-shadow-2xl" style={{ animation: showFinish ? "ci-slide-up 1s ease-out 0.3s both" : "none" }}>
            Aarav
            <br/>
            <span className="text-fire text-4xl sm:text-7xl">The Birthday Champion</span>
          </h2>
          
          <p className="mt-8 text-white/80 font-mono text-sm sm:text-lg max-w-2xl text-center px-4 leading-relaxed" style={{ animation: showFinish ? "ci-slide-up 1s ease-out 0.6s both" : "none" }}>
            From first steps to becoming a 10-year-old champion. <br/> What an incredible journey.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-4 text-accent animate-pulse">
            <Flag className="w-6 h-6" />
            <span className="font-display text-2xl tracking-widest">FINISH LINE</span>
            <Flag className="w-6 h-6" />
          </div>
        </div>

      </div>
    </section>
  );
}

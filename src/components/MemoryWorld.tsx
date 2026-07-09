import { useEffect, useRef, useState } from "react";
import helmet from "@/assets/helmet.jpg";
import memYear1 from "@/assets/year1.webp";
import memYear3 from "@/assets/year3.webp";
import memYear5 from "@/assets/year5.avif";
import memYear8 from "@/assets/year8.webp";
import memYear10 from "@/assets/year10.webp";

const MEMORY_IMAGES: Record<string, string> = {
  "1": memYear1,
  "3": memYear3,
  "5": memYear5,
  "8": memYear8,
  "10": memYear10,
};

type Chapter = {
  age: string;
  chapter: string;
  title: string;
  caption: string;
  scene: "nursery" | "playroom" | "outdoors" | "dreams" | "grand";
};

const CHAPTERS: Chapter[] = [
  {
    age: "1",
    chapter: "Chapter One",
    title: "First Steps",
    caption: "Every great journey begins with one tiny step.",
    scene: "nursery",
  },
  {
    age: "3",
    chapter: "Chapter Two",
    title: "Curious Explorer",
    caption: "Every day became a new adventure filled with curiosity and laughter.",
    scene: "playroom",
  },
  {
    age: "5",
    chapter: "Chapter Three",
    title: "Adventure Begins",
    caption: "From little adventures to unforgettable memories — every moment shaped the champion he is today.",
    scene: "outdoors",
  },
  {
    age: "8",
    chapter: "Chapter Four",
    title: "Dreams Take Flight",
    caption: "Bigger dreams, brighter smiles, and a heart full of celebration.",
    scene: "dreams",
  },
  {
    age: "10",
    chapter: "The Grand Celebration",
    title: "Today · Aarav Turns 10",
    caption: "The biggest celebration begins. The grid is lit. The champion has arrived.",
    scene: "grand",
  },
];

/* --------------------------- SCENES --------------------------- */

function NurseryScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, rgba(255,214,153,0.55), transparent 55%), radial-gradient(ellipse at 20% 90%, rgba(255,183,120,0.25), transparent 60%), linear-gradient(180deg, #2a1a12 0%, #1a0f0a 100%)",
        }}
      />
      {/* window light */}
      <div
        className="absolute right-8 top-10 h-56 w-40 rotate-6 rounded-md"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,220,160,0.35), rgba(255,220,160,0.05))",
          boxShadow: "0 0 80px 20px rgba(255,220,160,0.25)",
          filter: "blur(2px)",
        }}
      />
      {/* stars */}
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="mw-star absolute"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 19) % 90}%`,
            animationDelay: `${(i % 6) * 0.4}s`,
          }}
        />
      ))}
      {/* butterflies */}
      <span className="mw-butterfly absolute left-[12%] top-[40%]">✿</span>
      <span className="mw-butterfly absolute right-[18%] top-[65%]" style={{ animationDelay: "1.2s" }}>❋</span>
    </div>
  );
}

function PlayroomScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,180,200,0.35), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(180,220,255,0.30), transparent 55%), linear-gradient(180deg, #1d1526 0%, #120b1a 100%)",
        }}
      />
      {/* balloons */}
      {["#f472b6", "#fbbf24", "#60a5fa", "#a78bfa", "#f87171"].map((c, i) => (
        <span
          key={i}
          className="mw-balloon absolute"
          style={{
            left: `${8 + i * 18}%`,
            top: `${20 + (i % 3) * 10}%`,
            background: `radial-gradient(circle at 35% 30%, #ffffff88, ${c})`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      {/* mini toy car */}
      <span className="mw-toycar absolute bottom-8 left-0 text-3xl">🏎️</span>
      <span className="mw-toycar absolute bottom-14 left-0 text-2xl" style={{ animationDelay: "3s", animationDuration: "14s" }}>🚗</span>
    </div>
  );
}

function OutdoorsScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #3a2410 0%, #2a1a08 50%, #1a1206 100%), radial-gradient(ellipse at 70% 30%, rgba(255,190,110,0.5), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 75% 25%, rgba(255,180,90,0.55), transparent 55%)",
        }}
      />
      {/* sun */}
      <div
        className="absolute right-16 top-16 h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle, #ffd97a, #f59e0b 60%, transparent 75%)",
          boxShadow: "0 0 120px 30px rgba(251,191,36,0.5)",
        }}
      />
      {/* fireflies */}
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="mw-firefly absolute"
          style={{
            left: `${(i * 43) % 100}%`,
            top: `${30 + ((i * 17) % 60)}%`,
            animationDelay: `${(i % 8) * 0.5}s`,
          }}
        />
      ))}
      {/* grass silhouette */}
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background: "linear-gradient(180deg, transparent, #0a0704 90%)",
        }}
      />
    </div>
  );
}

function DreamsScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.35), transparent 60%), linear-gradient(180deg, #1a1024 0%, #0d0714 100%)",
        }}
      />
      {/* floating frames */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="mw-floatframe absolute rounded-md border border-amber-200/40 bg-black/40 backdrop-blur"
          style={{
            width: 90 + (i % 3) * 20,
            height: 70 + (i % 3) * 15,
            left: `${8 + i * 17}%`,
            top: `${15 + (i * 11) % 55}%`,
            animationDelay: `${i * 0.6}s`,
            boxShadow: "0 0 30px rgba(251,191,36,0.25)",
          }}
        />
      ))}
      {/* confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="mw-confetti absolute"
          style={{
            left: `${(i * 29) % 100}%`,
            top: `-10px`,
            background: ["#fbbf24", "#f472b6", "#60a5fa", "#a78bfa", "#f87171"][i % 5],
            animationDelay: `${(i % 10) * 0.5}s`,
            animationDuration: `${8 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}

function GrandScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(255,220,140,0.45), transparent 55%), radial-gradient(ellipse at 20% 90%, rgba(220,38,38,0.30), transparent 55%), linear-gradient(180deg, #1a0f0a 0%, #0a0605 100%)",
        }}
      />
      {/* stadium lights */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="mw-spotbeam absolute"
          style={{
            left: `${20 + i * 30}%`,
            top: 0,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
      {/* checker ribbon */}
      <div
        className="absolute inset-x-0 bottom-8 h-6 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(45deg,#fff 25%,transparent 25%),linear-gradient(-45deg,#fff 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#fff 75%),linear-gradient(-45deg,transparent 75%,#fff 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
          backgroundColor: "#000",
        }}
      />
      {/* balloons */}
      {["#fbbf24", "#f59e0b", "#fde68a", "#dc2626", "#f97316", "#fbbf24"].map((c, i) => (
        <span
          key={i}
          className="mw-balloon absolute"
          style={{
            left: `${5 + i * 15}%`,
            top: `${10 + (i % 3) * 8}%`,
            background: `radial-gradient(circle at 35% 30%, #ffffff88, ${c})`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      {/* fireworks */}
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="mw-firework absolute"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 15}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
    </div>
  );
}

function Scene({ scene }: { scene: Chapter["scene"] }) {
  switch (scene) {
    case "nursery": return <NurseryScene />;
    case "playroom": return <PlayroomScene />;
    case "outdoors": return <OutdoorsScene />;
    case "dreams": return <DreamsScene />;
    case "grand": return <GrandScene />;
  }
}

/* --------------------------- CHAPTER PANEL --------------------------- */

function ChapterPanel({ c, index, onActive }: { c: Chapter; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) onActive(index);
        });
      },
      { threshold: [0.5, 0.75] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, onActive]);

  const isGrand = c.scene === "grand";
  return (
    <section
      ref={ref}
      className="relative flex min-h-[100vh] items-center justify-center overflow-hidden py-24"
      data-chapter={index}
    >
      <Scene scene={c.scene} />
      {/* atmosphere overlays */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(0,0,0,0.55) 100%)" }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
        {/* Frame */}
        <div className={`relative ${index % 2 ? "md:order-2" : ""}`}>
          <div
            className={`mw-frame relative mx-auto overflow-hidden ${isGrand ? "aspect-[4/5] max-w-md md:max-w-lg" : "aspect-[4/5] max-w-sm md:max-w-md"}`}
            style={{
              borderRadius: 20,
            }}
          >
            <img src={MEMORY_IMAGES[c.age] ?? helmet} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 25%, transparent 45%, rgba(20,10,5,0.75) 100%)" }}
            />
            <div className="mw-shine pointer-events-none absolute inset-0" aria-hidden />
            {/* trophy corners */}
            <span className="absolute left-2 top-2 h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-amber-300/70" />
            <span className="absolute right-2 top-2 h-6 w-6 rounded-tr-xl border-r-2 border-t-2 border-amber-300/70" />
            <span className="absolute bottom-2 left-2 h-6 w-6 rounded-bl-xl border-b-2 border-l-2 border-amber-300/70" />
            <span className="absolute bottom-2 right-2 h-6 w-6 rounded-br-xl border-b-2 border-r-2 border-amber-300/70" />
            {/* age tag */}
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-amber-200/40 bg-black/50 px-3 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300 shadow-[0_0_8px_#fbbf24]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-100">Age {c.age}</span>
            </div>
            {isGrand && (
              <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-300 bg-black/70 font-display text-2xl text-amber-200 shadow-[0_0_20px_#fbbf24]">
                10
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        <div className={`relative ${index % 2 ? "md:order-1 md:text-right" : ""}`}>
          <div className="font-mono text-[11px] uppercase tracking-[0.5em] text-amber-200/80">
            {c.chapter}
          </div>
          <h3
            className={`mw-title mt-3 font-display uppercase leading-[1.02] ${isGrand ? "text-5xl md:text-7xl" : "text-4xl md:text-6xl"}`}
          >
            {c.title}
          </h3>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-amber-50/85 md:text-xl">
            {c.caption}
          </p>
          {isGrand ? (
            <div className={`mt-8 flex flex-wrap items-center gap-3 ${index % 2 ? "md:justify-end" : ""}`}>
              <a
                href="#rsvp"
                className="rounded-full border border-amber-300/60 bg-gradient-to-r from-amber-400 to-amber-200 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] text-black transition-transform hover:scale-[1.04]"
              >
                Reserve Your Seat →
              </a>
              <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-amber-100">
                🏁 The Biggest Celebration Begins
              </span>
            </div>
          ) : (
            <div className={`mt-6 flex items-center gap-3 ${index % 2 ? "md:justify-end" : ""}`}>
              <span className="h-px w-20 bg-gradient-to-r from-amber-300/70 to-transparent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
                Memory · {c.age} years
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- MAIN --------------------------- */

export function MemoryWorld() {
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="memories" className="relative overflow-hidden">
      {/* Intro */}
      <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden py-24">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(253,230,138,0.28), transparent 60%), linear-gradient(180deg, #14090a 0%, #0a0605 100%)",
          }}
        />
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="mw-goldparticle absolute"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i % 10) * 0.5}s`,
              animationDuration: `${10 + (i % 6)}s`,
            }}
          />
        ))}
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.6em] text-amber-200/80">
            — Exhibition 04 —
          </div>
          <h2 className="mw-title mt-5 font-display text-5xl uppercase leading-[1.02] md:text-7xl">
            Aarav's Memory World
          </h2>
          <div className="mx-auto mt-6 flex max-w-md items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.4em] text-amber-100/80">
              10 Years of Smiles
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
          </div>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-amber-50/80 md:text-lg">
            Every champion has a story. Let's revisit the unforgettable moments
            that made Aarav's journey so special.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-200/60">
              Begin the Journey
            </span>
            <span className="mw-arrow text-2xl text-amber-200">↓</span>
          </div>
        </div>
      </div>

      {/* Chapters wrapper with sticky navigator */}
      <div ref={wrapRef} className="relative">
        {/* Sticky navigator */}
        <div className="pointer-events-none sticky top-0 z-30 hidden h-0 md:block">
          <div className="pointer-events-auto absolute right-6 top-1/2 flex -translate-y-1/2 flex-col items-center gap-4">
            <div className="relative h-64 w-[2px] overflow-hidden rounded-full bg-amber-200/15">
              <div
                className="absolute inset-x-0 top-0 rounded-full"
                style={{
                  height: `${progress * 100}%`,
                  background:
                    "linear-gradient(180deg, #fde68a, #f59e0b)",
                  boxShadow: "0 0 12px rgba(251,191,36,0.7)",
                }}
              />
              {/* mini race car */}
              <span
                className="absolute -left-3 text-base"
                style={{
                  top: `calc(${progress * 100}% - 10px)`,
                  transition: "top 0.15s linear",
                }}
              >
                🏎️
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              {CHAPTERS.map((c, i) => (
                <a
                  key={c.age}
                  href={`#mw-${i}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] transition ${
                    active === i
                      ? "border-amber-300 bg-amber-300 text-black shadow-[0_0_16px_#fbbf24]"
                      : "border-amber-200/40 bg-black/40 text-amber-200/70 hover:border-amber-200/70"
                  }`}
                  aria-label={`Age ${c.age}`}
                >
                  {c.age}
                </a>
              ))}
            </div>
          </div>
        </div>

        {CHAPTERS.map((c, i) => (
          <div key={c.age} id={`mw-${i}`}>
            <ChapterPanel c={c} index={i} onActive={setActive} />
          </div>
        ))}
      </div>

      <style>{`
        .mw-title {
          background: linear-gradient(180deg,#fff8e1 0%,#fde68a 45%,#f59e0b 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 0 30px rgba(251,191,36,0.28));
        }
        .mw-frame {
          border: 1px solid rgba(253,230,138,.55);
          box-shadow:
            0 0 0 1px rgba(253,230,138,.12) inset,
            0 40px 80px -20px rgba(0,0,0,.8),
            0 0 80px -10px rgba(251,191,36,.45);
          background: linear-gradient(135deg, rgba(253,230,138,.1), rgba(0,0,0,0));
          transition: transform .8s cubic-bezier(.16,1,.3,1);
        }
        .mw-frame:hover { transform: translateY(-6px) scale(1.01); }
        .mw-shine::before {
          content:""; position:absolute; inset:-20%;
          background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,.22) 50%, transparent 65%);
          transform: translateX(-120%);
          animation: mw-shine 6s ease-in-out infinite;
        }
        @keyframes mw-shine {
          0%, 40% { transform: translateX(-120%); }
          70%, 100% { transform: translateX(120%); }
        }
        .mw-star {
          width:3px; height:3px; border-radius:9999px;
          background:#fff8dc; box-shadow: 0 0 8px #fde68a;
          animation: mw-twinkle 3s ease-in-out infinite;
        }
        @keyframes mw-twinkle {
          0%,100% { opacity:.2; transform: scale(.7); }
          50% { opacity:1; transform: scale(1.2); }
        }
        .mw-butterfly {
          font-size: 22px; color: #fde68a;
          animation: mw-fly 8s ease-in-out infinite;
          text-shadow: 0 0 12px rgba(251,191,36,.5);
        }
        @keyframes mw-fly {
          0%,100% { transform: translate(0,0) rotate(-5deg); }
          50% { transform: translate(40px,-30px) rotate(10deg); }
        }
        .mw-balloon {
          width: 44px; height: 56px; border-radius: 50%;
          filter: drop-shadow(0 8px 12px rgba(0,0,0,.4));
          animation: mw-balloon 6s ease-in-out infinite;
        }
        .mw-balloon::after {
          content:""; position:absolute; left:50%; bottom:-30px;
          width:1px; height:30px; background: rgba(255,255,255,.25);
        }
        @keyframes mw-balloon {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-18px) rotate(4deg); }
        }
        .mw-toycar {
          animation: mw-drive 10s linear infinite;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,.5));
        }
        @keyframes mw-drive {
          0% { transform: translateX(-10%); }
          100% { transform: translateX(110vw); }
        }
        .mw-firefly {
          width:4px; height:4px; border-radius:9999px;
          background:#fff2b0; box-shadow: 0 0 12px #fbbf24, 0 0 24px #f59e0b;
          animation: mw-firefly 4s ease-in-out infinite;
        }
        @keyframes mw-firefly {
          0%,100% { opacity:0; transform: translateY(0); }
          50% { opacity:1; transform: translateY(-20px); }
        }
        .mw-floatframe {
          animation: mw-floatframe 7s ease-in-out infinite;
        }
        @keyframes mw-floatframe {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-16px) rotate(3deg); }
        }
        .mw-confetti {
          width: 8px; height: 12px; border-radius: 1px;
          animation: mw-confetti linear infinite;
        }
        @keyframes mw-confetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity:0; }
          10% { opacity:.9; }
          100% { transform: translateY(80vh) rotate(720deg); opacity:0; }
        }
        .mw-spotbeam {
          width: 200px; height: 100vh;
          background: linear-gradient(180deg, rgba(255,220,140,.35), transparent 70%);
          filter: blur(20px);
          transform-origin: top center;
          animation: mw-spotbeam 6s ease-in-out infinite;
        }
        @keyframes mw-spotbeam {
          0%,100% { transform: rotate(-8deg); opacity:.6; }
          50% { transform: rotate(8deg); opacity:1; }
        }
        .mw-firework {
          width: 6px; height: 6px; border-radius: 9999px;
          background: #fde68a;
          box-shadow:
            0 0 0 0 rgba(251,191,36,.8),
            20px -10px 0 rgba(244,114,182,.9),
            -18px -12px 0 rgba(96,165,250,.9),
            10px 18px 0 rgba(167,139,250,.9),
            -14px 16px 0 rgba(251,146,60,.9);
          animation: mw-firework 2.5s ease-out infinite;
        }
        @keyframes mw-firework {
          0% { opacity:0; transform: scale(.2); }
          40% { opacity:1; transform: scale(1); }
          100% { opacity:0; transform: scale(2.2); }
        }
        .mw-goldparticle {
          width:3px; height:3px; border-radius:9999px;
          background: radial-gradient(circle, #fde68a, transparent 70%);
          box-shadow: 0 0 10px rgba(253,230,138,.9);
          animation: mw-gold linear infinite;
          opacity:.6;
        }
        @keyframes mw-gold {
          0% { transform: translate(0,0) scale(.8); opacity:0; }
          15% { opacity:.9; }
          100% { transform: translate(20px,-160px) scale(1.3); opacity:0; }
        }
        .mw-arrow {
          animation: mw-arrow 1.8s ease-in-out infinite;
        }
        @keyframes mw-arrow {
          0%,100% { transform: translateY(0); opacity:.6; }
          50% { transform: translateY(10px); opacity:1; }
        }
      `}</style>
    </section>
  );
}

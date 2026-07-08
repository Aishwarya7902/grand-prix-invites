import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Gift, Send, Heart, PartyPopper } from "lucide-react";

type Blessing = {
  id: string;
  message: string;
  isNew?: boolean;
};

const SEED: Blessing[] = [
  { id: "s1", message: "Happy Birthday Aarav! May your life always be filled with happiness and success." },
  { id: "s2", message: "Ten years of joy and only accelerating from here. Keep chasing every dream, champ!" },
  { id: "s3", message: "You bring so much light to everyone around you. Have the most magical birthday ever." },
  { id: "s4", message: "Wishing you cake, laughter, and a whole garage full of memories today!" },
  { id: "s5", message: "Pole position on every birthday. Never slow down, little champion." },
  { id: "s6", message: "My darling boy, may every year sparkle brighter than the last. All my love." },
];

const STORAGE_KEY = "aarav-blessings-v2";
const MAX_LEN = 240;
const ROTATE_MS = 3800;

const TRANSITIONS = ["slide", "fade", "flip", "scale"] as const;
type Trans = typeof TRANSITIONS[number];

export default function BlessingWall() {
  const [blessings, setBlessings] = useState<Blessing[]>(SEED);
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "celebrating" | "flying">("idle");
  const [flyingCard, setFlyingCard] = useState<Blessing | null>(null);
  const [current, setCurrent] = useState(0);
  const [trans, setTrans] = useState<Trans>("slide");
  const [confetti, setConfetti] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const flyTargetRef = useRef<HTMLDivElement>(null);
  const flySourceRef = useRef<HTMLDivElement>(null);
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties | null>(null);

  // Load persisted
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Blessing[];
        if (Array.isArray(stored) && stored.length) {
          setBlessings((prev) => [...stored, ...prev]);
        }
      }
    } catch {}
  }, []);

  // Auto-rotate carousel — one card at a time
  useEffect(() => {
    if (phase !== "idle" && phase !== "flying") return;
    const t = setInterval(() => {
      setTrans(TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)]);
      setCurrent((s) => (s + 1) % Math.max(blessings.length, 1));
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [blessings.length, phase]);

  // Auto-expand textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [message]);

  const currentBlessing = blessings.length ? blessings[current % blessings.length] : null;

  const persist = (list: Blessing[]) => {
    try {
      const custom = list.filter((b) => !b.id.startsWith("s"));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    } catch {}
  };

  const handleSubmit = async () => {
    const m = message.trim();
    if (!m || phase !== "idle") return;

    setPhase("sending");
    await new Promise((r) => setTimeout(r, 900));

    const fresh: Blessing = {
      id: `u_${Date.now()}`,
      message: m,
      isNew: true,
    };

    setPhase("celebrating");
    setConfetti(true);
    setFlyingCard(fresh);

    setTimeout(() => {
      const src = flySourceRef.current?.getBoundingClientRect();
      const tgt = flyTargetRef.current?.getBoundingClientRect();
      if (src && tgt) {
        const dx = tgt.left + tgt.width / 2 - (src.left + src.width / 2);
        const dy = tgt.top + tgt.height / 2 - (src.top + src.height / 2);
        setFlyStyle({
          position: "fixed",
          left: src.left,
          top: src.top,
          width: src.width,
          height: src.height,
          zIndex: 60,
          transform: "translate(0,0) scale(1)",
          transition: "transform 1.2s cubic-bezier(0.65,0,0.35,1), opacity 1.2s ease",
          opacity: 1,
        });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setFlyStyle((s) =>
              s
                ? {
                    ...s,
                    transform: `translate(${dx}px, ${dy}px) scale(0.5) rotate(6deg)`,
                    opacity: 0.2,
                  }
                : s,
            );
          });
        });
      }
    }, 1600);

    setTimeout(() => {
      setBlessings((prev) => {
        const next = [fresh, ...prev];
        persist(next);
        return next;
      });
      setCurrent(0);
      setMessage("");
      setFlyingCard(null);
      setFlyStyle(null);
      setPhase("idle");
      setConfetti(false);
      setTimeout(() => {
        setBlessings((prev) => prev.map((b) => (b.id === fresh.id ? { ...b, isNew: false } : b)));
      }, 5000);
    }, 3200);
  };

  const remaining = MAX_LEN - message.length;
  const empty = blessings.length === 0;

  return (
    <section id="blessings" className="relative overflow-hidden py-24">
      {/* Ambient warm background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, oklch(0.75 0.19 55 / 0.18), transparent 55%), radial-gradient(ellipse at 80% 70%, oklch(0.62 0.26 25 / 0.15), transparent 60%), linear-gradient(180deg, transparent, oklch(0.08 0.02 260 / 0.6))",
        }}
      />
      {/* Floating ambient particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="bw-particle absolute rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${4 + (i % 4) * 2}px`,
              height: `${4 + (i % 4) * 2}px`,
              background: i % 3 === 0 ? "oklch(0.85 0.15 90 / 0.7)" : i % 3 === 1 ? "oklch(0.75 0.19 55 / 0.5)" : "oklch(0.95 0.05 90 / 0.4)",
              animationDelay: `${(i % 8) * 0.7}s`,
              animationDuration: `${8 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.4em] text-accent">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-accent" />
            <span>Section · 05</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-accent" />
          </div>
          <h2 className="font-display text-4xl uppercase leading-tight text-foreground sm:text-6xl">
            <span className="mr-3 inline-block animate-pulse">💛</span>
            <span className="bw-gold-text">Blessings for our Champion</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Leave a heartfelt message for Aarav and become a part of his unforgettable celebration.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm italic text-accent/80">
            Every wish adds another beautiful memory to Aarav's special day.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT — Blessing Station */}
          <div className="relative">
            {/* Balloon corners */}
            <div className="bw-balloon absolute -left-4 -top-6 text-3xl" style={{ animationDelay: "0s" }}>🎈</div>
            <div className="bw-balloon absolute -right-4 -top-8 text-3xl" style={{ animationDelay: "1.2s" }}>🎈</div>
            <div className="bw-balloon absolute -left-6 bottom-6 text-2xl" style={{ animationDelay: "2s" }}>🎈</div>

            <div
              className="relative overflow-hidden rounded-3xl border p-8 backdrop-blur-xl"
              style={{
                borderColor: "oklch(0.85 0.15 90 / 0.4)",
                background: "linear-gradient(160deg, oklch(0.22 0.03 60 / 0.55), oklch(0.14 0.02 20 / 0.7))",
                boxShadow: "0 30px 80px -30px oklch(0.75 0.19 55 / 0.5), inset 0 0 60px oklch(0.85 0.15 90 / 0.08)",
              }}
            >
              {/* Inner confetti bits */}
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className="bw-confetti absolute h-1.5 w-1.5"
                    style={{
                      left: `${10 + i * 9}%`,
                      top: `${(i * 13) % 90}%`,
                      background: ["#f4c430", "#f97316", "#fef3c7", "#e94560"][i % 4],
                      animationDelay: `${i * 0.4}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-mclaren-orange text-carbon shadow-lg">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Blessing Station</div>
                    <div className="font-display text-2xl uppercase text-foreground">Write your wish</div>
                  </div>
                </div>


                {/* Message */}
                <label className="bw-field mt-5 block">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, MAX_LEN))}
                    placeholder="Write your heartfelt birthday wishes for Aarav..."
                    disabled={phase !== "idle"}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-4 font-sans text-base text-foreground outline-none transition-all focus:border-accent focus:shadow-[0_0_25px_oklch(0.75_0.19_55/0.35)]"
                  />
                  <div className="mt-1 flex justify-end font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className={remaining < 30 ? "text-accent" : ""}>{remaining} / {MAX_LEN}</span>
                  </div>
                </label>

                {/* CTA */}
                <button
                  ref={flySourceRef as never}
                  type="button"
                  onClick={handleSubmit}
                  disabled={phase !== "idle" || !message.trim()}
                  className="bw-cta group relative mt-4 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl px-8 py-4 font-display text-lg uppercase tracking-wider text-carbon transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #f4c430, #f97316)",
                    boxShadow: "0 15px 40px -10px oklch(0.75 0.19 55 / 0.6), inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {phase === "sending" ? (
                      <>
                        <span className="bw-spinner h-5 w-5 rounded-full border-2 border-carbon border-t-transparent" />
                        Sending Blessing…
                      </>
                    ) : phase === "celebrating" ? (
                      <>
                        <Sparkles className="h-5 w-5 animate-pulse" />
                        Celebrating…
                      </>
                    ) : (
                      <>
                        <PartyPopper className="h-5 w-5" />
                        Add My Blessing
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/40 transition-all duration-700 group-hover:left-full" />
                </button>

                {/* Confirmation overlay */}
                {phase === "celebrating" && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-carbon/70 backdrop-blur-md">
                    <div className="bw-confirm text-center">
                      <div className="mx-auto mb-3 text-6xl">💛</div>
                      <div className="font-display text-3xl uppercase text-foreground">Thank you!</div>
                      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                        Your blessing has become a part of Aarav's celebration.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Wishing Wall */}
          <div ref={flyTargetRef} className="relative">
            <div
              className="relative min-h-[520px] overflow-hidden rounded-3xl border p-6 backdrop-blur-xl"
              style={{
                borderColor: "oklch(0.85 0.15 90 / 0.35)",
                background:
                  "linear-gradient(180deg, oklch(0.18 0.02 20 / 0.7), oklch(0.10 0.02 260 / 0.85))",
                boxShadow: "0 30px 90px -30px oklch(0.62 0.26 25 / 0.5), inset 0 0 80px oklch(0.75 0.19 55 / 0.1)",
              }}
            >
              {/* Fairy lights top */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 overflow-hidden">
                <svg className="absolute inset-x-0 top-2 h-6 w-full" viewBox="0 0 400 20" preserveAspectRatio="none">
                  <path d="M0 4 Q100 20 200 4 T400 4" stroke="oklch(0.85 0.15 90 / 0.4)" strokeWidth="0.6" fill="none" />
                </svg>
                {Array.from({ length: 14 }).map((_, i) => (
                  <span
                    key={i}
                    className="bw-fairy absolute h-2 w-2 rounded-full"
                    style={{
                      left: `${(i / 13) * 100}%`,
                      top: `${8 + Math.sin(i) * 6}px`,
                      background: i % 2 ? "oklch(0.85 0.18 90)" : "oklch(0.75 0.19 55)",
                      boxShadow: "0 0 8px currentColor",
                      color: i % 2 ? "oklch(0.85 0.18 90)" : "oklch(0.75 0.19 55)",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                  Live · Blessing Wall
                </span>
                <span>{blessings.length} wishes</span>
              </div>

              {empty ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
                  <div className="text-6xl">💛</div>
                  <p className="max-w-xs text-muted-foreground">
                    Be the first to bless Aarav and make his celebration even more special.
                  </p>
                  <div className="flex gap-3 text-3xl">
                    <span className="bw-balloon" style={{ animationDelay: "0s" }}>🎈</span>
                    <span className="bw-balloon" style={{ animationDelay: "1s" }}>🎈</span>
                    <span className="bw-balloon" style={{ animationDelay: "2s" }}>🎈</span>
                  </div>
                </div>
              ) : (
                <div className="relative min-h-[320px]">
                  {currentBlessing && (
                    <WishCard
                      key={currentBlessing.id + "-" + current}
                      blessing={currentBlessing}
                      transition={trans}
                    />
                  )}
                </div>
              )}

              {/* Bottom soft glow */}
              <div
                className="pointer-events-none absolute inset-x-6 bottom-4 h-16 rounded-full opacity-60 blur-2xl"
                style={{ background: "radial-gradient(ellipse, oklch(0.75 0.19 55 / 0.5), transparent 70%)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Flying card */}
      {flyingCard && flyStyle && (
        <div style={flyStyle}>
          <div className="h-full w-full rounded-2xl border border-yellow-300/70 bg-gradient-to-br from-yellow-200/30 to-mclaren-orange/30 p-4 shadow-[0_0_40px_oklch(0.75_0.19_55/0.8)] backdrop-blur-lg">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">{flyingCard.name}</div>
            <div className="mt-1 line-clamp-3 text-sm text-foreground">{flyingCard.message}</div>
          </div>
        </div>
      )}

      {/* Celebration confetti burst */}
      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className="bw-burst absolute"
              style={{
                left: "50%",
                top: "50%",
                width: `${6 + (i % 4) * 3}px`,
                height: `${6 + (i % 4) * 3}px`,
                background: ["#f4c430", "#f97316", "#e94560", "#fef3c7", "#22d3ee"][i % 5],
                transform: `rotate(${(i * 37) % 360}deg)`,
                ["--tx" as never]: `${(Math.random() - 0.5) * 900}px`,
                ["--ty" as never]: `${(Math.random() - 0.5) * 700}px`,
                animationDelay: `${(i % 10) * 0.02}s`,
              }}
            />
          ))}
          {/* Floating balloons */}
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={"b" + i}
              className="bw-rise absolute text-4xl"
              style={{
                left: `${10 + i * 10}%`,
                bottom: "-60px",
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {i % 2 ? "🎈" : "🎊"}
            </span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes bw-float { 0%,100%{transform:translateY(0) translateX(0);opacity:.5} 50%{transform:translateY(-30px) translateX(10px);opacity:1} }
        .bw-particle { animation: bw-float ease-in-out infinite; }
        @keyframes bw-balloon { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        .bw-balloon { display:inline-block; animation: bw-balloon 3.5s ease-in-out infinite; }
        @keyframes bw-confetti { 0%{transform:translateY(-20px) rotate(0);opacity:0} 20%{opacity:1} 100%{transform:translateY(30px) rotate(360deg);opacity:0} }
        .bw-confetti { animation: bw-confetti 5s linear infinite; border-radius: 2px; }
        @keyframes bw-fairy { 0%,100%{opacity:.4} 50%{opacity:1} }
        .bw-fairy { animation: bw-fairy 1.6s ease-in-out infinite; }
        @keyframes bw-spin { to { transform: rotate(360deg); } }
        .bw-spinner { animation: bw-spin 0.7s linear infinite; }
        @keyframes bw-confirm { 0%{transform:scale(.6);opacity:0} 40%{transform:scale(1.05);opacity:1} 100%{transform:scale(1);opacity:1} }
        .bw-confirm { animation: bw-confirm .5s cubic-bezier(.16,1,.3,1) both; }
        @keyframes bw-burst { 0%{transform:translate(-50%,-50%) rotate(0);opacity:1} 100%{transform:translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(720deg);opacity:0} }
        .bw-burst { animation: bw-burst 2s cubic-bezier(.2,.7,.3,1) forwards; border-radius: 2px; }
        @keyframes bw-rise { 0%{transform:translateY(0) rotate(-5deg);opacity:0} 20%{opacity:1} 100%{transform:translateY(-110vh) rotate(15deg);opacity:0} }
        .bw-rise { animation: bw-rise 3s ease-in forwards; }
        .bw-gold-text {
          background: linear-gradient(90deg, #fef3c7, #f4c430, #f97316, #f4c430, #fef3c7);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: bw-shine 6s linear infinite;
        }
        @keyframes bw-shine { to { background-position: 200% center; } }

        @keyframes wc-slide { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes wc-fade { from{opacity:0} to{opacity:1} }
        @keyframes wc-flip { from{transform:rotateY(80deg);opacity:0} to{transform:rotateY(0);opacity:1} }
        @keyframes wc-scale { from{transform:scale(.85);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes wc-drift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .wc-in-slide { animation: wc-slide .7s cubic-bezier(.16,1,.3,1) both, wc-drift 6s ease-in-out infinite 1s; }
        .wc-in-fade  { animation: wc-fade  .8s ease both, wc-drift 6s ease-in-out infinite 1s; }
        .wc-in-flip  { animation: wc-flip  .8s cubic-bezier(.16,1,.3,1) both, wc-drift 6s ease-in-out infinite 1s; }
        .wc-in-scale { animation: wc-scale .7s cubic-bezier(.16,1,.3,1) both, wc-drift 6s ease-in-out infinite 1s; }
        @keyframes wc-newglow { 0%,100%{box-shadow: 0 0 30px oklch(0.85 0.18 90 / .5)} 50%{box-shadow: 0 0 60px oklch(0.85 0.18 90 / .9)} }
        .wc-new { animation: wc-newglow 1.8s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

function WishCard({
  blessing,
  index,
  total,
  transition,
}: {
  blessing: Blessing;
  index: number;
  total: number;
  transition: Trans;
}) {
  // Vertical stagger
  const top = `${(index / Math.max(total, 1)) * 70 + 4}%`;
  const left = index % 2 === 0 ? "4%" : "18%";
  const rotate = index % 2 === 0 ? -2 : 2;
  const cls = `wc-in-${transition}`;

  return (
    <div
      className={`absolute w-[78%] max-w-md ${cls}`}
      style={{ top, left, transform: `rotate(${rotate}deg)`, animationDelay: `${index * 0.12}s` }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl ${blessing.isNew ? "wc-new" : ""}`}
        style={{
          borderColor: "oklch(0.85 0.15 90 / 0.5)",
          background:
            "linear-gradient(140deg, oklch(0.28 0.03 60 / 0.7), oklch(0.18 0.02 20 / 0.75))",
          boxShadow: "0 20px 50px -20px oklch(0.62 0.26 25 / 0.5)",
        }}
      >
        {blessing.isNew && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-yellow-300 to-mclaren-orange px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-carbon shadow-lg">
            ✨ New
          </span>
        )}
        <Heart className="mb-2 h-4 w-4 text-accent" fill="currentColor" />
        <p className="font-sans text-[15px] leading-relaxed text-foreground">
          "{blessing.message}"
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
          <span className="font-display text-sm uppercase tracking-wider text-accent">— {blessing.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Blessing</span>
        </div>
        <span className="absolute -right-2 -bottom-2 text-2xl opacity-40">🎊</span>
      </div>
    </div>
  );
}

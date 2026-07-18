import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Flag, MapPin, Phone, MessageCircle, Trophy, Zap, Timer, Users, Gauge, Sparkles, Mail, Gift, PartyPopper, Heart } from "lucide-react";
import heroRace from "@/assets/hero-race.jpg";
import pitLane from "@/assets/pit-lane.jpg";
import helmet from "@/assets/helmet.jpg";
import { CinematicIntro } from "@/components/CinematicIntro";
import { GrandCountdown } from "@/components/GrandCountdown";
import { MemoryWorld } from "@/components/MemoryWorld";
import BlessingWall from "@/components/BlessingWall";
import { BirthdayWelcome } from "@/components/BirthdayWelcome";
import { BirthdayInvitationPass } from "@/components/BirthdayInvitationPass";
import { PartyFinale } from "@/components/PartyFinale";
import { EventJourney } from "@/components/EventJourney";
import { VictoryLapFooter } from "@/components/VictoryLapFooter";

export const Route = createFileRoute("/")({
  component: Index,
});

const RACER_NAME = "Aarav";
const RACE_DATE = "Saturday, 14 December 2026";
const RACE_TIME = "4:00 PM — Green Flag";
const VENUE = "Speedway Grand Ballroom, Bandra";
const DRESS_CODE = "Racing Colors — Red, Orange, Neon";




function SpeedMarquee({ text }: { text: string }) {
  const items = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="relative overflow-hidden border-y border-border bg-carbon py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.concat(items).map((i) => (
          <span key={i} className="mx-8 flex items-center gap-4 font-display text-2xl tracking-widest text-accent">
            <Flag className="h-5 w-5" /> {text}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center border-2 border-primary bg-primary/10 font-mono text-lg font-bold text-primary">
        {num}
      </div>
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Checkpoint {num}</div>
        <h2 className="font-display text-4xl uppercase text-foreground md:text-5xl">{title}</h2>
      </div>
    </div>
  );
}

function DashItem({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="group relative overflow-hidden border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-[var(--shadow-glow)]">
      <div className="absolute right-0 top-0 h-1 w-16 bg-primary" />
      <Icon className="mb-4 h-8 w-8 text-accent" />
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl text-foreground">{value}</div>
    </div>
  );
}

// Dev: always play the intro on every load. To reintroduce "skip for returning
// visitors" later, gate the initial `useState(true)` on a stored flag and set it
// inside `finishIntro`.
const ALWAYS_PLAY_INTRO = true;

function Index() {
  const [intro, setIntro] = useState(ALWAYS_PLAY_INTRO);
  const [rsvpState, setRsvpState] = useState<'idle' | 'animating' | 'confirmed'>('idle');
  const [guestName, setGuestName] = useState("Rohan");
  const rsvpRef = useRef<HTMLElement>(null);
  const rsvpConfettiFired = useRef(false);

  useEffect(() => {
    if (!rsvpRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !rsvpConfettiFired.current) {
          rsvpConfettiFired.current = true;
          // Fire from bottom left
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0, y: 1 },
            colors: ['#ff0000', '#ffa500', '#ffff00', '#ff007f']
          });
          // Fire from bottom right
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 1, y: 1 },
            colors: ['#ff0000', '#ffa500', '#ffff00', '#ff007f']
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(rsvpRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get("guest");
    if (guest) setGuestName(guest);
  }, []);
  
  const finishIntro = () => setIntro(false);
  
  const handleRsvp = () => {
    setRsvpState('animating');
    setTimeout(() => setRsvpState('confirmed'), 1500);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {intro && <CinematicIntro racerName={RACER_NAME} guestName={guestName} onDone={finishIntro} />}

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <img
          src={heroRace}
          alt="Red Formula racing car speeding through neon-lit city"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-x-0 top-0 z-10">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2 font-display text-xl tracking-widest text-foreground">
              <Flag className="h-5 w-5 text-primary" /> GRAND CELEBRATION
            </div>
            <div className="hidden gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex">
              <a href="#invitation" className="hover:text-accent">Invitation</a>
              <a href="#journey" className="hover:text-accent">Race Day</a>
              <a href="#memories" className="hover:text-accent">Hall of Fame</a>
              <a href="#rsvp" className="hover:text-accent">RSVP</a>
            </div>
          </nav>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24">
          <div className="max-w-3xl animate-race-in">
            <div className="mb-6 inline-flex items-center gap-3 border border-primary/60 bg-background/60 px-4 py-2 backdrop-blur">
              <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground">Season 2026 · Round 10</span>
            </div>
            <h1 className="font-display text-6xl uppercase leading-[0.9] text-foreground md:text-8xl">
              {RACER_NAME}'s <br />
              <span className="text-fire">10th Birthday</span> <br />
              Grand Celebration
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              You're on the VIP list, driver. Lock in your helmet, warm up the tyres and prepare for the fastest championship of the year.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#invitation" className="group relative inline-flex items-center gap-3 overflow-hidden bg-primary px-8 py-4 font-display text-lg uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
                <Zap className="h-5 w-5" /> Enter the Championship
                <span className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-full" />
              </a>
              <a href="#rsvp" className="inline-flex items-center gap-2 border border-border bg-background/50 px-6 py-4 font-mono text-xs uppercase tracking-widest text-foreground backdrop-blur hover:border-accent hover:text-accent">
                Get your race pass →
              </a>
            </div>

            <div className="mt-16 grid max-w-2xl grid-cols-3 gap-4 border border-border bg-background/60 p-4 backdrop-blur">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Top Speed</div>
                <div className="font-display text-3xl text-primary">340 <span className="text-sm text-muted-foreground">km/h</span></div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Laps</div>
                <div className="font-display text-3xl text-accent">10</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Podium</div>
                <div className="font-display text-3xl text-foreground">P1</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
              style={{
                top: `${(i * 8) + 5}%`,
                left: 0,
                right: 0,
                animation: `speed-lines ${1 + (i % 3) * 0.4}s linear infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </section>

      <SpeedMarquee text="WELCOME · DRIVER · READY · SET · GO" />

      {/* BIRTHDAY WELCOME SECTION */}
      <div id="invitation" className="scroll-mt-10" />
      <BirthdayWelcome racerName={RACER_NAME} guestName={guestName} />

      {/* VIP PASS — Magical Ticket Assembly */}
      <BirthdayInvitationPass
        racerName={RACER_NAME}
        guestName={guestName}
        raceDate={RACE_DATE}
        raceTime={RACE_TIME}
        venue={VENUE}
        dressCode={DRESS_CODE}
      />

      {/* COUNTDOWN — Grand Celebration Race Control */}
      <GrandCountdown targetIso="2026-12-14T16:00:00+05:30" />

      {/* JOURNEY — Birthday Grand Celebration Journey */}
      <div id="journey" className="scroll-mt-10" />
      <EventJourney />

      {/* MEMORY WORLD — immersive scroll journey through Aarav's years */}
      <div id="memories" className="scroll-mt-10" />
      <MemoryWorld racerName={RACER_NAME} />

      {/* BLESSING WALL — Champions' Blessing Wall */}
      <BlessingWall />

      {/* RSVP */}
      <section id="rsvp" ref={rsvpRef} className="relative overflow-hidden py-24">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at center, oklch(0.75 0.19 55 / 0.5), transparent 70%)" }} />
        <div className="relative mx-auto max-w-4xl px-6">
          <SectionLabel num="06" title="Birthday RSVP" />
          <div className="rounded-3xl border border-white/10 bg-black/80 p-10 shadow-[0_0_50px_rgba(255,60,40,0.15)] backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-red-900/40 to-black shadow-[0_0_30px_rgba(255,60,40,0.4)]">
                {/* Floating SVG instead of generic helmet */}
                <PartyPopper className="h-16 w-16 animate-pulse text-accent drop-shadow-[0_0_20px_rgba(255,220,100,0.8)]" />
                <div className="absolute -left-2 -top-2 animate-[bw-float_3s_ease-in-out_infinite] text-2xl">🎈</div>
                <div className="absolute -bottom-2 -right-2 animate-[bw-float_4s_ease-in-out_infinite] text-2xl" style={{ animationDelay: "1s" }}>🎊</div>
                
                <div className={`absolute inset-x-0 bottom-0 py-1 text-center font-mono text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${rsvpState === 'confirmed' ? 'bg-emerald-500 text-black' : 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,60,40,0.8)]'}`}>
                  {rsvpState === 'confirmed' ? 'Confirmed' : 'VIP Guest'}
                </div>
              </div>
              <div className="flex-1">
                {rsvpState === 'idle' ? (
                  <>
                    <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Turning 10 · Champion Class</div>
                    <h3 className="mt-2 font-display text-4xl uppercase text-foreground">RSVP to Aarav's <span className="text-fire animate-flicker">10th Birthday</span></h3>
                    <p className="mt-3 text-muted-foreground">
                      Hit the button below to confirm your attendance at the biggest celebration of the year. The pit crew will be notified and the gates will open for you!
                    </p>
                    <form className="mt-6 grid gap-3">
                      <button
                        type="button"
                        onClick={handleRsvp}
                        className="group relative flex w-full md:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-fire via-primary to-fire bg-[length:200%_auto] px-8 py-4 font-display text-xl uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,60,40,0.5)] transition-all hover:bg-[position:100%_center] hover:shadow-[0_0_40px_rgba(255,60,40,0.8)]"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <Gift className="h-5 w-5" /> Join the Celebration
                        </span>
                      </button>
                    </form>
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      See you at the party, racer.
                    </div>
                  </>
                ) : rsvpState === 'animating' ? (
                  <div className="relative mt-8 flex h-24 w-full items-center overflow-hidden border border-primary/40 bg-primary/10">
                    <div className="absolute left-0 text-5xl animate-drive-fast drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">🏎️💨</div>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(239,68,68,0.1)_50%,transparent_100%)] animate-scanline" />
                  </div>
                ) : (
                  <div className="relative mt-4 overflow-hidden border-2 border-emerald-500/50 bg-emerald-500/10 p-8 text-center shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-in fade-in zoom-in duration-700">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i} className="absolute block h-2 w-2 bg-emerald-400" 
                              style={{ left: `${(i*27)%100}%`, top: '-10px', animation: `fall ${2+(i%3)}s linear infinite`, animationDelay: `${i*0.15}s`}} />
                      ))}
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-display text-3xl uppercase text-emerald-400">Birthday Pass Secured!</h4>
                      <p className="mt-4 font-mono text-sm uppercase leading-relaxed tracking-widest text-emerald-100">
                        Thank you for RSVPing!<br/>We can't wait to celebrate Aarav's 10th birthday with you! 🎂🎈
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTY HEADQUARTERS & FINISH LINE */}
      <PartyFinale />

      <VictoryLapFooter />

      <style>{`
        @keyframes drive-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        .animate-drive-fast {
          animation: drive-fast 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

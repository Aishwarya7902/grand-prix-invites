import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flag, MapPin, Phone, MessageCircle, Trophy, Zap, Timer, Users, Gauge, Sparkles } from "lucide-react";
import heroRace from "@/assets/hero-race.jpg";
import pitLane from "@/assets/pit-lane.jpg";
import helmet from "@/assets/helmet.jpg";
import { CinematicIntro } from "@/components/CinematicIntro";

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
  const finishIntro = () => setIntro(false);

  const checkpoints = [
    { icon: Users, title: "Driver Check-In", time: "4:00 PM", desc: "Sign your racing license and grab your helmet." },
    { icon: Zap, title: "Warm-Up Games", time: "4:30 PM", desc: "High-speed challenges and pit crew missions." },
    { icon: Timer, title: "Birthday Pit Stop", time: "5:30 PM", desc: "Refuel with food, drinks and racing tunes." },
    { icon: Sparkles, title: "Cake Celebration", time: "6:30 PM", desc: "Light the sparklers. Rev the engines." },
    { icon: Trophy, title: "Podium Ceremony", time: "7:00 PM", desc: "Trophies, gifts and the winner's photo wall." },
  ];

  const messages = [
    { name: "Coach Rohan", text: "Fastest driver in the paddock. Full throttle, kiddo!" },
    { name: "Team Sharma", text: "Ten years old and already lapping us. Legend." },
    { name: "Pit Crew Priya", text: "Championship material. See you on the grid!" },
    { name: "Uncle Vikram", text: "Pole position on every birthday. Never slow down." },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {intro && <CinematicIntro racerName={RACER_NAME} onDone={finishIntro} />}

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

      {/* PIT LANE */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionLabel num="01" title="Pit Lane Welcome" />
            <div className="relative border border-border bg-card p-8">
              <div className="absolute -top-3 left-8 bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">
                LED Display · Live
              </div>
              <div className="carbon-fiber rounded-sm p-8 text-center">
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Welcome</div>
                <div className="mt-3 font-display text-5xl uppercase text-foreground animate-flicker">
                  Driver, <span className="text-fire">You're In</span>
                </div>
                <div className="mt-4 font-mono text-sm text-muted-foreground">Crew standing by · Engine warm · Grid ready</div>
              </div>
              <p className="mt-6 text-muted-foreground">
                Step into the pit lane. Crew members wave you in, tyres are hot, and {RACER_NAME}'s championship car is waiting on the grid.
              </p>
            </div>
          </div>
          <div className="relative">
            <img src={pitLane} alt="Luxury pit lane garage" width={1600} height={1024} loading="lazy" className="w-full border border-border" />
            <div className="absolute -bottom-6 -right-6 border-2 border-accent bg-background px-4 py-3 font-mono text-xs uppercase tracking-widest text-accent shadow-[var(--shadow-orange-glow)]">
              Garage · Bay 10
            </div>
          </div>
        </div>
      </section>

      {/* VIP PASS */}
      <section id="invitation" className="relative py-24 racing-stripe">
        <div className="mx-auto max-w-6xl px-6">
          <SectionLabel num="02" title="VIP Race Pass" />
          <div className="relative overflow-hidden border-2 border-primary bg-card shadow-[var(--shadow-glow)]">
            <div className="grid md:grid-cols-[1fr_2fr]">
              <div className="relative flex flex-col justify-between bg-primary p-8 text-primary-foreground">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">Championship Pass</div>
                  <div className="mt-2 font-display text-3xl">GRAND CELEBRATION</div>
                  <div className="font-display text-6xl leading-none">10</div>
                  <div className="mt-1 font-mono text-xs uppercase tracking-widest opacity-80">Round · Season 2026</div>
                </div>
                <div className="mt-8">
                  <div className="font-mono text-[10px] uppercase tracking-widest opacity-80">Driver</div>
                  <div className="font-display text-2xl">{RACER_NAME}</div>
                </div>
                <div className="mt-6 h-16 w-full checker-flag opacity-90" />
              </div>
              <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
                <DashItem label="Race Day" value={RACE_DATE} icon={Flag} />
                <DashItem label="Green Flag" value={RACE_TIME} icon={Timer} />
                <DashItem label="Race Circuit" value={VENUE} icon={MapPin} />
                <DashItem label="Dress Code" value={DRESS_CODE} icon={Gauge} />
              </div>
            </div>
            <div className="border-t border-border bg-carbon px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Pass ID · GP-2026-010 · Non-transferable · Present at gate
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel num="03" title="Race Day Circuit" />
          <div className="relative">
            <div className="absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary md:left-1/2 md:-translate-x-1/2" />
            <div className="space-y-8">
              {checkpoints.map((c, i) => (
                <div key={c.title} className={`relative flex items-center gap-6 md:gap-12 ${i % 2 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                  <div className="absolute left-8 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-[var(--shadow-glow)] md:left-1/2">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  </div>
                  <div className="ml-16 flex-1 md:ml-0 md:w-1/2">
                    <div className="group border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-accent">
                            <c.icon className="h-5 w-5" />
                          </div>
                          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                            Checkpoint {String(i + 1).padStart(2, "0")}
                          </div>
                        </div>
                        <div className="font-mono text-sm text-accent">{c.time}</div>
                      </div>
                      <h3 className="font-display text-2xl uppercase text-foreground">{c.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                    </div>
                  </div>
                  <div className="hidden flex-1 md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HALL OF FAME */}
      <section id="memories" className="relative bg-carbon py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel num="04" title="Hall of Fame Garage" />
          <p className="mb-10 max-w-2xl text-muted-foreground">Trophy posters from past seasons — hover to bring them under the spotlight.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { year: "2024", title: "Rookie of the Year" },
              { year: "2025", title: "Fastest Lap" },
              { year: "2026", title: "Championship Contender" },
            ].map((p, i) => (
              <div key={i} className="group relative aspect-[3/4] overflow-hidden border border-border bg-card">
                <img src={helmet} alt={p.title} loading="lazy" className="h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-110 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="font-mono text-xs uppercase tracking-widest text-accent">Season {p.year}</div>
                  <div className="mt-1 font-display text-2xl uppercase text-foreground">{p.title}</div>
                </div>
                <div className="absolute right-4 top-4 border border-border bg-background/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
                  Poster · 0{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PIT BOARD */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel num="05" title="Pit Board Messages" />
          <div className="relative overflow-hidden border-2 border-accent bg-carbon p-2">
            <div className="carbon-fiber p-8">
              <div className="mb-6 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-accent">
                <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> Live Feed</span>
                <span>Fans · {messages.length}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {messages.map((m) => (
                  <div key={m.name} className="border border-border bg-background/60 p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Transmission</div>
                    <p className="mt-2 font-display text-xl uppercase leading-snug text-foreground">"{m.text}"</p>
                    <div className="mt-4 flex items-center justify-between font-mono text-xs text-muted-foreground">
                      <span>— {m.name}</span>
                      <span>OVER</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at center, var(--racing-red), transparent 70%)" }} />
        <div className="relative mx-auto max-w-4xl px-6">
          <SectionLabel num="06" title="Racing License" />
          <div className="border-2 border-primary bg-card p-10 shadow-[var(--shadow-glow)]">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
              <div className="relative h-40 w-40 border-4 border-accent bg-carbon">
                <img src={helmet} alt="Driver helmet" loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-primary/90 py-1 text-center font-mono text-[10px] uppercase tracking-widest text-primary-foreground">
                  Verified
                </div>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">FIA Certified · Class A</div>
                <h3 className="mt-2 font-display text-4xl uppercase text-foreground">Confirm your seat on the grid</h3>
                <p className="mt-3 text-muted-foreground">
                  Hit the button below to print your personalized racing license. The pit crew will be notified and the gate will open on race day.
                </p>
                <form className="mt-6 grid gap-3 sm:grid-cols-2">
                  <input placeholder="Driver name" className="border border-border bg-background px-4 py-3 font-mono text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
                  <input placeholder="Team / +1" className="border border-border bg-background px-4 py-3 font-mono text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
                  <button
                    type="button"
                    className="sm:col-span-2 group relative overflow-hidden bg-primary px-8 py-4 font-display text-xl uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Trophy className="h-5 w-5" /> Join the Race
                    </span>
                    <span className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-full" />
                  </button>
                </form>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  See you on race day, driver.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RACE CONTROL */}
      <section className="relative bg-carbon py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionLabel num="07" title="Race Control" />
          <div className="grid gap-6 md:grid-cols-3">
            <a href="tel:+910000000000" className="group border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-[var(--shadow-glow)]">
              <Phone className="mb-4 h-6 w-6 text-primary" />
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Contact</div>
              <div className="mt-1 font-display text-xl text-foreground">+91 00000 00000</div>
            </a>
            <a href="#" className="group border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-[var(--shadow-orange-glow)]">
              <MapPin className="mb-4 h-6 w-6 text-accent" />
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Venue / Maps</div>
              <div className="mt-1 font-display text-xl text-foreground">{VENUE}</div>
            </a>
            <a href="https://wa.me/910000000000" className="group border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-[var(--shadow-glow)]">
              <MessageCircle className="mb-4 h-6 w-6 text-primary" />
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</div>
              <div className="mt-1 font-display text-xl text-foreground">Message the crew</div>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3 font-display text-lg tracking-widest text-foreground">
            <Flag className="h-4 w-4 text-primary" /> {RACER_NAME}'S GRAND CELEBRATION · 2026
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            © Race Crew · All laps reserved
          </div>
        </div>
        <div className="mt-8 h-4 checker-flag" />
      </footer>
    </div>
  );
}

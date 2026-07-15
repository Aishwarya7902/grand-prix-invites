import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, MapPin, Ticket, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface BirthdayInvitationPassProps {
  racerName: string;
  guestName?: string;
  raceDate: string;
  raceTime: string;
  venue: string;
  dressCode: string;
}

export function BirthdayInvitationPass({ racerName, guestName, raceDate, raceTime, venue, dressCode }: BirthdayInvitationPassProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Magical assembly sequence
          setTimeout(() => setStep(1), 500); // Show header
          setTimeout(() => setStep(2), 1500); // Show details
          setTimeout(() => setStep(3), 2500); // Show barcode
          setTimeout(() => {
            setStep(4); // Final reveal and confetti
            const duration = 2000;
            const end = Date.now() + duration;

            (function frame() {
              confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']
              });
              confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']
              });

              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            }());
          }, 3500);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section id="invitation" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#050505]">
      {/* Celebration background layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.1)_0%,transparent_60%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <h3 className="font-mono text-sm uppercase tracking-[0.4em] text-muted-foreground">You Are Invited</h3>
          <h2 className="mt-2 font-display text-4xl uppercase text-white md:text-5xl">VIP <span className="text-accent">Birthday Pass</span></h2>
        </div>

        {/* The Magical Ticket */}
        <div className={`relative mx-auto w-full transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/80 shadow-[0_0_50px_rgba(255,107,53,0.3)] backdrop-blur-xl">
            
            {/* Ambient inner glow */}
            <div className={`absolute -inset-20 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 blur-3xl transition-opacity duration-1000 ${step >= 4 ? 'opacity-100' : ''}`} />

            <div className="relative grid md:grid-cols-[1fr_300px]">
              
              {/* Left Side: Invitation Details */}
              <div className="flex flex-col p-8 md:p-12 md:pr-16 z-10">
                <div className={`transition-all duration-700 transform ${step >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                  <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
                    <Sparkles className="h-4 w-4" /> Grand Celebration
                  </div>
                  <h3 className="mt-4 font-display text-4xl uppercase leading-none text-white md:text-6xl">
                    {racerName}'s <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fire via-primary to-fire animate-flicker">10th Birthday</span>
                  </h3>
                  
                  {guestName && (
                    <div className="mt-6 inline-block rounded-full border border-white/20 bg-white/5 px-6 py-2 font-mono text-sm uppercase tracking-widest text-white">
                      Admit One: <span className="text-accent">{guestName}</span>
                    </div>
                  )}
                </div>

                <div className={`mt-10 grid gap-6 transition-all duration-700 transform ${step >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="flex items-center gap-5 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-primary transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Date</div>
                      <div className="font-display text-xl text-white">{raceDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-accent transition-colors group-hover:bg-accent/20 group-hover:text-accent">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Time</div>
                      <div className="font-display text-xl text-white">{raceTime}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-blue-400 transition-colors group-hover:bg-blue-400/20 group-hover:text-blue-400">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Location</div>
                      <div className="font-display text-xl text-white">{venue}</div>
                    </div>
                  </div>
                </div>

                <div className={`mt-10 text-center transition-all duration-1000 delay-500 ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="font-display text-2xl tracking-widest text-accent drop-shadow-[0_0_10px_rgba(255,107,53,0.5)] flex items-center justify-center gap-3">
          <Sparkles className="h-6 w-6" /> We can't wait to celebrate with you! <Sparkles className="h-6 w-6" />
        </p>
      </div>
                </div>

              {/* Right Side: Ticket Stub */}
              <div className="relative flex flex-col justify-between border-t border-dashed border-white/20 bg-white/5 p-8 md:border-l md:border-t-0 md:p-12 z-10">
                {/* Perforation cutouts */}
                <div className="absolute -left-4 -top-4 hidden h-8 w-8 rounded-full bg-[#050505] md:block" />
                <div className="absolute -bottom-4 -left-4 hidden h-8 w-8 rounded-full bg-[#050505] md:block" />
                
                <div className={`flex h-full flex-col items-center justify-center gap-8 mt-10 md:mt-0 transition-all duration-700 transform ${step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent text-center flex items-center justify-center gap-2 md:-rotate-90">
                    <Sparkles className="h-4 w-4" /> VIP ACCESS GRANTED <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { MapPin, MessageCircle, Phone, Mail, CarFront, Wind, PartyPopper, Trophy, Gift } from "lucide-react";
import confetti from "canvas-confetti";

export function PartyFinale() {
  const [hasCrossed, setHasCrossed] = useState(false);
  const finishLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasCrossed) {
          // Trigger the car crossing animation
          setTimeout(() => {
            setHasCrossed(true);
            
            // Blast confetti
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            (function frame() {
              confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
              });
              confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
              });

              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            }());
          }, 1000); // 1 second after scrolling into view
        }
      },
      { threshold: 0.5 }
    );

    if (finishLineRef.current) {
      observer.observe(finishLineRef.current);
    }

    return () => observer.disconnect();
  }, [hasCrossed]);

  return (
    <div className="relative w-full">
      {/* 🏁 THE FINISH LINE */}
      <section 
        ref={finishLineRef}
        className="relative flex h-[40vh] min-h-[400px] w-full flex-col items-center justify-center overflow-hidden bg-zinc-950"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,60,40,0.15)_0%,transparent_70%)]" />
        
        {/* The Checkered Finish Line */}
        <div className="absolute left-0 right-0 top-1/2 h-16 -translate-y-1/2 pattern-checkered opacity-30" 
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), repeating-linear-gradient(45deg, #fff 25%, #000 25%, #000 75%, #fff 75%, #fff)', backgroundPosition: '0 0, 20px 20px', backgroundSize: '40px 40px' }} />

        <div 
          className={`absolute top-1/2 -translate-y-1/2 text-[100px] transition-all duration-[1500ms] ease-in-out ${hasCrossed ? 'left-[120%] drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]' : '-left-40'}`}
        >
          <div className="flex items-center text-primary drop-shadow-2xl">
            <CarFront className="h-24 w-24 md:h-32 md:w-32" />
            <Wind className="h-16 w-16 md:h-20 md:w-20 text-white/50 -ml-4" />
          </div>
        </div>

        <div className={`relative z-10 transition-all duration-1000 ${hasCrossed ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
          <h2 className="text-center font-display text-5xl uppercase tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] md:text-7xl">
            Race <span className="text-fire animate-flicker">Complete!</span>
          </h2>
          <p className="mt-4 text-center font-mono text-sm uppercase tracking-[0.3em] text-accent">
            Enter the Party Garage below
          </p>
        </div>
      </section>

      {/* 🚗 THE PARTY GARAGE */}
      <section className="relative min-h-screen overflow-hidden bg-[#050505] py-24">
        {/* Garage Environment */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_90%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6">
          
          <div className="text-center mb-10 md:mb-20">
            <h3 className="font-mono text-sm uppercase tracking-[0.4em] text-muted-foreground">Checkpoint 07</h3>
            <h2 className="mt-2 font-display text-4xl uppercase text-white md:text-5xl">Aarav's Party <span className="text-primary">Garage</span></h2>
          </div>

          {/* Central Garage Setup */}
          <div className="relative flex w-full flex-col items-center gap-12 md:h-[600px] md:max-w-4xl md:flex-row md:justify-center">
            
            {/* The Giant 10 */}
            <div className="relative z-10 flex h-48 w-48 shrink-0 items-center justify-center rounded-full border-4 border-primary/30 bg-black/80 shadow-[0_0_80px_rgba(239,68,68,0.3)] backdrop-blur-md md:h-64 md:w-64">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent" />
              <span className="font-display text-7xl text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] md:text-9xl">10</span>
              
              {/* Floating elements inside */}
              <div className="absolute -left-4 -top-4 animate-[bw-float_3s_ease-in-out_infinite] md:-left-6 md:-top-6"><PartyPopper className="h-10 w-10 md:h-14 md:w-14 text-accent" /></div>
              <div className="absolute -bottom-2 -right-2 animate-[bw-float_4s_ease-in-out_infinite] md:-bottom-4 md:-right-4" style={{ animationDelay: '1s' }}><Trophy className="h-10 w-10 md:h-14 md:w-14 text-yellow-400" /></div>
              <div className="absolute -right-4 top-8 animate-[bw-float_3.5s_ease-in-out_infinite] md:-right-6 md:top-10" style={{ animationDelay: '0.5s' }}><Gift className="h-8 w-8 md:h-12 md:w-12 text-primary" /></div>
            </div>

            {/* Orbiting / Positioned Stations */}
            <div className="grid w-full grid-cols-2 gap-4 sm:gap-8 md:absolute md:inset-0 md:block md:w-auto md:gap-0">
              
              {/* 1. Venue Station (Top Left) */}
              <a href="#" className="group relative flex flex-col items-center transition-transform hover:scale-105 md:absolute md:left-20 md:top-20 md:hover:scale-110">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 shadow-[0_0_30px_rgba(255,107,53,0.3)] backdrop-blur-md group-hover:bg-accent/20 group-hover:shadow-[0_0_50px_rgba(255,107,53,0.6)] md:h-24 md:w-24">
                  <MapPin className="h-8 w-8 text-accent md:h-12 md:w-12" />
                </div>
                <div className="mt-4 rounded-full bg-black/60 px-3 py-1 text-center backdrop-blur-md border border-white/10 md:px-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent md:text-xs">Venue</div>
                  <div className="font-display text-sm text-white md:text-xl">Speedway Grand</div>
                </div>
              </a>

              {/* 2. WhatsApp Station (Top Right) */}
              <a href="https://wa.me/910000000000" className="group relative flex flex-col items-center transition-transform hover:scale-105 md:absolute md:right-20 md:top-20 md:hover:scale-110">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 shadow-[0_0_30px_rgba(37,211,102,0.3)] backdrop-blur-md group-hover:bg-[#25D366]/20 group-hover:shadow-[0_0_50px_rgba(37,211,102,0.6)] md:h-24 md:w-24">
                  <MessageCircle className="h-8 w-8 text-[#25D366] md:h-12 md:w-12" />
                </div>
                <div className="mt-4 rounded-full bg-black/60 px-3 py-1 text-center backdrop-blur-md border border-white/10 md:px-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#25D366] md:text-xs">WhatsApp</div>
                  <div className="font-display text-sm text-white md:text-xl">Message Hosts</div>
                </div>
              </a>

              {/* 3. Call Station (Bottom Left) */}
              <a href="tel:+910000000000" className="group relative flex flex-col items-center transition-transform hover:scale-105 md:absolute md:bottom-20 md:left-20 md:hover:scale-110">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 shadow-[0_0_30px_rgba(239,68,68,0.3)] backdrop-blur-md group-hover:bg-primary/20 group-hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] md:h-24 md:w-24">
                  <Phone className="h-8 w-8 text-primary md:h-12 md:w-12" />
                </div>
                <div className="mt-4 rounded-full bg-black/60 px-3 py-1 text-center backdrop-blur-md border border-white/10 md:px-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary md:text-xs">Call</div>
                  <div className="font-display text-sm text-white md:text-xl">+91 00000</div>
                </div>
              </a>

              {/* 4. Email Station (Bottom Right) */}
              <a href="mailto:party@example.com" className="group relative flex flex-col items-center transition-transform hover:scale-105 md:absolute md:bottom-20 md:right-20 md:hover:scale-110">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md group-hover:bg-blue-500/20 group-hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] md:h-24 md:w-24">
                  <Mail className="h-8 w-8 text-blue-500 md:h-12 md:w-12" />
                </div>
                <div className="mt-4 rounded-full bg-black/60 px-3 py-1 text-center backdrop-blur-md border border-white/10 md:px-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-blue-500 md:text-xs">Email</div>
                  <div className="font-display text-sm text-white md:text-xl">party@example</div>
                </div>
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

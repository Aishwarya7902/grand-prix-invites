import { useEffect, useState, useRef } from "react";
import { Flag, PartyPopper, Gift, Trophy, Star } from "lucide-react";

export function BirthdayWelcome({ racerName, guestName }: { racerName: string; guestName: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 bg-black">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        {/* Left: Birthday Hero Card */}
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center border-2 border-accent bg-accent/20 text-accent rounded-full shadow-[0_0_15px_rgba(255,200,0,0.5)]">
              <PartyPopper size={24} />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Celebration Station</div>
              <h2 className="font-display text-4xl uppercase text-white md:text-5xl" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
                {racerName}'s 10th <br/><span className="text-fire">Birthday Championship</span>
              </h2>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-red-900/40 to-black p-8 shadow-2xl backdrop-blur-md">
            {/* SVG Decorations */}
            <div className="absolute -top-4 -right-4 text-accent/10"><Star size={100} /></div>
            <div className="absolute -bottom-4 -left-4 text-primary/10"><Gift size={100} /></div>
            
            <div className="absolute -top-3 left-8 bg-gradient-to-r from-accent to-yellow-500 px-4 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest text-black font-bold shadow-[0_0_10px_rgba(255,200,0,0.5)]">
              Birthday Headquarters
            </div>
            
            <div className="relative z-10 text-center pt-4">
              <div className="font-mono text-sm uppercase tracking-[0.2em] text-blue-300">Welcome, {guestName}!</div>
              <div className="mt-4 font-display text-4xl uppercase text-white drop-shadow-md leading-tight">
                Turning 10 and ready for the <span className="text-accent">biggest adventure</span> of the year!
              </div>
              
              <div className="mt-6 flex justify-center gap-4 text-accent">
                <PartyPopper className="animate-pulse" />
                <Trophy className="animate-pulse" style={{ animationDelay: "0.2s" }} />
                <Gift className="animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              
              <p className="mt-6 font-mono text-sm leading-relaxed text-gray-300">
                Join us for games, laughter, surprises, cake, and an epic championship celebration. {racerName} is excited to celebrate with you. Your VIP Birthday Pass is ready.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Birthday Party Garage (CSS Animated) */}
        <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
          <div className="relative h-[450px] w-full rounded-2xl border border-white/10 bg-[#050505] overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.15)]">
            
            {/* Garage Environment */}
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(transparent 95%, rgba(0,255,255,0.05) 100%)", backgroundSize: "100% 40px" }} />
            
            {/* Glowing #10 Sign */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
               <Flag className="text-primary/50 h-8 w-8" />
               <div className="font-display text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 opacity-20">10</div>
               <Flag className="text-primary/50 h-8 w-8" />
               <div className="absolute inset-0 flex items-center justify-center font-display text-8xl text-accent drop-shadow-[0_0_30px_rgba(255,200,0,0.8)] animate-pulse">
                 10
               </div>
            </div>

            {/* Banners */}
            <div className="absolute top-0 inset-x-0 flex justify-around p-2">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className={`w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] ${i%2===0 ? 'border-t-primary' : 'border-t-blue-500'} drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`} style={{ transformOrigin: 'top center', animation: `bw-swing ${2 + i*0.1}s ease-in-out infinite alternate` }} />
               ))}
            </div>

            {/* The Birthday Car */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative h-28 w-80">
                {/* Underglow */}
                <div className="absolute -bottom-4 left-4 right-4 h-8 rounded-[100%] bg-blue-500/60 blur-xl animate-pulse" />
                <div className="absolute -bottom-2 left-10 right-10 h-6 rounded-[100%] bg-primary/80 blur-lg animate-pulse" style={{ animationDelay: "0.5s" }} />
                
                {/* Car Body */}
                <div className="absolute bottom-4 left-16 h-12 w-48 rounded-t-full bg-gradient-to-t from-red-800 to-primary shadow-[inset_0_2px_10px_rgba(255,255,255,0.5)]">
                  {/* Cockpit */}
                  <div className="absolute -top-4 left-1/2 h-8 w-16 -translate-x-1/2 rounded-t-3xl bg-black border border-white/20" />
                  {/* #10 Decal */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl text-accent drop-shadow-md">10</div>
                </div>
                
                {/* Front Wing */}
                <div className="absolute bottom-2 left-0 h-4 w-24 rounded-l-full bg-primary" />
                <div className="absolute bottom-6 left-4 h-2 w-12 -rotate-12 bg-red-700" />
                
                {/* Rear Wing */}
                <div className="absolute bottom-8 right-8 h-10 w-4 bg-primary" />
                <div className="absolute bottom-16 right-0 h-4 w-24 rounded-sm bg-gradient-to-b from-primary to-red-900" />
                
                {/* Wheels */}
                <div className="absolute -bottom-2 left-8 h-14 w-14 rounded-full border-4 border-gray-800 bg-black shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-2 rounded-full border-2 border-red-500/50" />
                  <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
                </div>
                <div className="absolute -bottom-2 right-12 h-16 w-16 rounded-full border-4 border-gray-800 bg-black shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-2 rounded-full border-2 border-red-500/50" />
                  <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
                </div>

                {/* Smoke (using CSS blurs) */}
                {isVisible && (
                  <>
                    <div className="absolute -bottom-2 -left-4 h-8 w-16 bg-white/20 blur-xl rounded-full animate-[bw-smoke_3s_ease-out_infinite]" />
                    <div className="absolute -bottom-2 -right-4 h-8 w-16 bg-white/20 blur-xl rounded-full animate-[bw-smoke_3s_ease-out_infinite_1s]" />
                  </>
                )}
              </div>
            </div>

            {/* WOW Effects (only when visible) */}
            {isVisible && (
              <>
                {/* Confetti */}
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="absolute h-2 w-1.5 rounded-sm"
                    style={{
                      left: `${(i * 37) % 100}%`,
                      top: "-5%",
                      background: ["#ff3c28", "#ffa040", "#ffffff", "#00ff88", "#00d2ff"][i % 5],
                      animation: `bw-confetti-fall ${2.5 + (i % 3)}s linear ${i * 0.1}s forwards`,
                    }} />
                ))}
                {/* Balloons */}
                {[15, 30, 70, 85].map((x, i) => (
                  <div key={`b-${i}`} className="absolute h-12 w-10 rounded-full"
                    style={{
                      left: `${x}%`,
                      bottom: "-20%",
                      background: ["#ff3c28", "#ffa040", "#00ff88", "#00d2ff"][i],
                      boxShadow: `0 0 20px ${["#ff3c28", "#ffa040", "#00ff88", "#00d2ff"][i]}`,
                      animation: `bw-balloon-rise 6s ease-in-out forwards ${i * 0.5}s`,
                    }} />
                ))}
              </>
            )}
            
            {/* Celebration Zone Label */}
            <div className="absolute -bottom-6 -right-6 border-2 border-accent bg-background px-4 py-3 font-mono text-xs uppercase tracking-widest text-accent shadow-[var(--shadow-orange-glow)]">
              Celebration Zone · Bay 10
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bw-confetti-fall {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
        @keyframes bw-balloon-rise {
          0% { transform: translateY(0) rotate(-5deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-700px) rotate(5deg); opacity: 0; }
        }
        @keyframes bw-swing {
          0% { transform: rotate(-10deg); }
          100% { transform: rotate(10deg); }
        }
        @keyframes bw-smoke {
          0% { transform: scale(0.5) translateX(0); opacity: 0.8; }
          100% { transform: scale(2) translateX(-20px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

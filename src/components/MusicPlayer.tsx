import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

interface MusicPlayerProps {
  url?: string;
}

export function MusicPlayer({ url = "/assets/premium-birthday.mp3" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<any>(null);
  const isPlayingRef = useRef(false);

  // Generative Soft Music Box (Happy Birthday)
  const playNote = (ctx: AudioContext, freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Soft music box tone (sine wave with a hint of triangle)
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Gentle pluck envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.05);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const playMelody = () => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)() as any;
    }
    const ctx = audioRef.current as unknown as AudioContext;
    if (ctx.state === 'suspended') ctx.resume();

    const melody = [
      { f: 261.6, d: 0.5 }, { f: 261.6, d: 0.5 }, { f: 293.7, d: 1 }, { f: 261.6, d: 1 }, { f: 349.2, d: 1 }, { f: 329.6, d: 2 },
      { f: 261.6, d: 0.5 }, { f: 261.6, d: 0.5 }, { f: 293.7, d: 1 }, { f: 261.6, d: 1 }, { f: 392.0, d: 1 }, { f: 349.2, d: 2 },
      { f: 261.6, d: 0.5 }, { f: 261.6, d: 0.5 }, { f: 523.3, d: 1 }, { f: 440.0, d: 1 }, { f: 349.2, d: 1 }, { f: 329.6, d: 1 }, { f: 293.7, d: 1 },
      { f: 466.2, d: 0.5 }, { f: 466.2, d: 0.5 }, { f: 440.0, d: 1 }, { f: 349.2, d: 1 }, { f: 392.0, d: 1 }, { f: 349.2, d: 2 }
    ];

    let time = ctx.currentTime + 0.1;
    const beatDuration = 0.5; // 120 BPM

    melody.forEach(note => {
      playNote(ctx, note.f, time, note.d * beatDuration);
      time += note.d * beatDuration;
    });

    // Loop
    const timeout = setTimeout(() => {
      if (isPlayingRef.current) playMelody();
    }, (time - ctx.currentTime) * 1000 + 1000); // 1 sec pause before loop
    
    (window as any).musicLoopTimeout = timeout;
  };

  const togglePlay = () => {
    if (isPlaying) {
      if ((window as any).musicLoopTimeout) clearTimeout((window as any).musicLoopTimeout);
      if (audioRef.current) {
        (audioRef.current as unknown as AudioContext).suspend();
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      playMelody();
    }
    setHasInteracted(true);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] group">
      {/* Replaced <audio> with Web Audio API generative music */}
      
      <button
        onClick={togglePlay}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-110 
          ${isPlaying ? 'bg-black/60 text-accent hover:border-accent/50 hover:shadow-[0_0_30px_rgba(255,220,100,0.3)]' : 'bg-black/80 text-white/50 hover:text-white/80'}`}
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {/* Animated equalizer waves when playing */}
        {isPlaying && (
          <div className="absolute -inset-2 animate-pulse rounded-full bg-accent/20 blur-xl" />
        )}
        
        <div className="relative z-10 flex items-center justify-center">
          {isPlaying ? (
            <div className="relative flex items-end gap-[3px] h-5 w-5">
              <span className="w-1 bg-accent rounded-full animate-[music-bar_1s_ease-in-out_infinite_alternate]" style={{ height: '40%' }} />
              <span className="w-1 bg-accent rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_alternate]" style={{ height: '80%', animationDelay: '0.2s' }} />
              <span className="w-1 bg-accent rounded-full animate-[music-bar_0.8s_ease-in-out_infinite_alternate]" style={{ height: '60%', animationDelay: '0.4s' }} />
              <span className="w-1 bg-accent rounded-full animate-[music-bar_1.5s_ease-in-out_infinite_alternate]" style={{ height: '100%', animationDelay: '0.1s' }} />
            </div>
          ) : (
            <VolumeX className="h-6 w-6" />
          )}
        </div>
      </button>

      {/* Tooltip */}
      <div className="absolute left-full top-1/2 ml-4 -translate-y-1/2 rounded-lg border border-white/10 bg-black/80 px-4 py-2 text-xs font-mono tracking-widest text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
        {isPlaying ? "MUTE MUSIC" : "PLAY MUSIC"}
      </div>
    </div>
  );
}

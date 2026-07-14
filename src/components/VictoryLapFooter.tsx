import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Trophy, Star, Gift, PartyPopper, Zap } from "lucide-react";
import confetti from "canvas-confetti";

const ITEM_TYPES = [
  { type: "cake", icon: "🎂", points: 10, color: "text-rose-400" },
  { type: "balloon", icon: "🎈", points: 15, color: "text-red-400" },
  { type: "gift", icon: "🎁", points: 20, color: "text-purple-400" },
  { type: "star", icon: "⭐", points: 30, color: "text-yellow-400" },
  { type: "trophy", icon: "🏆", points: 50, color: "text-amber-400" },
];

const LANES = [16.66, 50, 83.33]; // percentage left positions for 3 lanes
const TRACK_HEIGHT = 600; // virtual height in px

type Entity = {
  id: number;
  type: "item" | "ai";
  lane: number;
  y: number; // px from top
  active: boolean;
  def?: typeof ITEM_TYPES[0]; // for items
  color?: string; // for AI cars
};

export function VictoryLapFooter() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // Player state
  const playerLaneRef = useRef(1);
  const [playerVisualLane, setPlayerVisualLane] = useState(1);

  // Engine Refs
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  
  // Game Logic State
  const gameSpeedRef = useRef(300); // pixels per second
  const distanceTraveledRef = useRef(0);
  const lastSpawnDistanceRef = useRef(0);
  const entitiesRef = useRef<Entity[]>([]);
  const nextEntityIdRef = useRef(0);
  
  // Trigger a render when entities are added/removed
  const [renderTick, setRenderTick] = useState(0);

  // DOM Refs for direct manipulation
  const entityNodesRef = useRef<Record<number, HTMLDivElement | null>>({});
  const scoreDisplayRef = useRef<HTMLDivElement>(null);
  const trackBgRef = useRef<HTMLDivElement>(null);
  const backgroundYRef = useRef(0);

  const spawnEntity = useCallback(() => {
    const isAi = Math.random() > 0.7; // 30% chance for an obstacle (AI car)
    const lane = Math.floor(Math.random() * 3);
    
    if (isAi) {
      entitiesRef.current.push({
        id: nextEntityIdRef.current++,
        type: "ai",
        lane,
        y: -100,
        active: true,
        color: ["bg-red-500", "bg-blue-500", "bg-fuchsia-500", "bg-green-500"][Math.floor(Math.random() * 4)],
      });
    } else {
      entitiesRef.current.push({
        id: nextEntityIdRef.current++,
        type: "item",
        lane,
        y: -100,
        active: true,
        def: ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)],
      });
    }
    setRenderTick(t => t + 1); // Trigger render to mount the new DOM node
  }, []);

  const lastMoveTimeRef = useRef(0);

  const handleMoveLeft = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 150) return;
    if (gameState !== "finished" && playerLaneRef.current > 0) {
      playerLaneRef.current -= 1;
      setPlayerVisualLane(playerLaneRef.current);
      lastMoveTimeRef.current = now;
    }
  }, [gameState]);

  const handleMoveRight = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 150) return;
    if (gameState !== "finished" && playerLaneRef.current < 2) {
      playerLaneRef.current += 1;
      setPlayerVisualLane(playerLaneRef.current);
      lastMoveTimeRef.current = now;
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") handleMoveLeft();
      if (e.key === "ArrowRight" || e.key === "d") handleMoveRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMoveLeft, handleMoveRight]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(30);
    playerLaneRef.current = 1;
    setPlayerVisualLane(1);
    gameSpeedRef.current = 350;
    distanceTraveledRef.current = 0;
    lastSpawnDistanceRef.current = 0;
    entitiesRef.current = [];
    nextEntityIdRef.current = 0;
    setRenderTick(t => t + 1);
  };

  const update = useCallback((time: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    const currentSpeed = gameSpeedRef.current;

    // Scroll Background
    backgroundYRef.current += currentSpeed * dt;
    if (trackBgRef.current) {
      trackBgRef.current.style.backgroundPositionY = `${backgroundYRef.current}px`;
    }

    if (gameState === "playing") {
      // Accelerate over time
      gameSpeedRef.current = Math.min(800, gameSpeedRef.current + dt * 15);
      
      // Spawning
      distanceTraveledRef.current += currentSpeed * dt;
      const spawnInterval = Math.max(300, 1000 - gameSpeedRef.current); // spawn faster as we speed up
      
      if (distanceTraveledRef.current - lastSpawnDistanceRef.current > spawnInterval) {
        spawnEntity();
        lastSpawnDistanceRef.current = distanceTraveledRef.current;
      }
    } else if (gameState === "idle") {
      // Idle mode: constant speed, occasional spawns
      gameSpeedRef.current = 200;
      distanceTraveledRef.current += currentSpeed * dt;
      if (distanceTraveledRef.current - lastSpawnDistanceRef.current > 600) {
        spawnEntity();
        lastSpawnDistanceRef.current = distanceTraveledRef.current;
      }
    } else if (gameState === "finished" || gameState === "gameover") {
      // Slow down to a stop
      gameSpeedRef.current = Math.max(0, gameSpeedRef.current - dt * 500);
    }

    // Update Entities
    let currentScore = score;
    const playerY = TRACK_HEIGHT - 120; // Player fixed near bottom

    for (let i = 0; i < entitiesRef.current.length; i++) {
      const entity = entitiesRef.current[i];
      if (!entity.active) continue;

      // Move entity down (AI cars move slower relative to ground, so they appear to move down towards player)
      const entitySpeed = entity.type === "ai" ? currentSpeed * 0.4 : currentSpeed; 
      entity.y += entitySpeed * dt;

      const node = entityNodesRef.current[entity.id];
      if (node) {
        node.style.transform = `translate(-50%, ${entity.y}px)`;
      }

      // Collision Detection
      if (gameState === "playing") {
        if (entity.lane === playerLaneRef.current) {
          // Check vertical overlap
          if (entity.y > playerY - 40 && entity.y < playerY + 40) {
            entity.active = false;
            if (node) node.style.display = "none"; // Hide immediately

            if (entity.type === "item" && entity.def) {
              currentScore += entity.def.points;
              // Little pop effect
              if (scoreDisplayRef.current) {
                scoreDisplayRef.current.innerText = currentScore.toString();
                scoreDisplayRef.current.style.transform = "scale(1.5)";
                setTimeout(() => {
                  if (scoreDisplayRef.current) scoreDisplayRef.current.style.transform = "scale(1)";
                }, 150);
              }
            } else if (entity.type === "ai") {
              // Game Over!
              setGameState("gameover");
              setTimeLeft(0);
              
              // Screen shake effect on track
              if (trackBgRef.current) {
                trackBgRef.current.style.transform = "translateX(20px)";
                setTimeout(() => {
                  if (trackBgRef.current) trackBgRef.current.style.transform = "translateX(-20px)";
                  setTimeout(() => {
                    if (trackBgRef.current) trackBgRef.current.style.transform = "translateX(0)";
                  }, 50);
                }, 50);
              }
            }
          }
        }
      }

      // Cleanup off-screen
      if (entity.y > TRACK_HEIGHT + 100) {
        entity.active = false;
        if (node) node.style.display = "none";
      }
    }

    // Clean up inactive array periodically
    let removed = false;
    for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
      if (!entitiesRef.current[i].active) {
        entitiesRef.current.splice(i, 1);
        removed = true;
      }
    }
    if (removed) {
      setRenderTick(t => t + 1);
    }

    if (currentScore !== score) {
      setScore(currentScore);
    }

    requestRef.current = requestAnimationFrame(update);
  }, [gameState, score, spawnEntity]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  // Timer Effect
  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState("finished");
            
            // Grand Finale Celebration
            const duration = 5 * 1000;
            const end = Date.now() + duration;
            (function frame() {
              confetti({ particleCount: 8, angle: 60, spread: 80, origin: { x: 0 }, zIndex: 100, colors: ['#facc15', '#ef4444', '#3b82f6'] });
              confetti({ particleCount: 8, angle: 120, spread: 80, origin: { x: 1 }, zIndex: 100, colors: ['#facc15', '#ef4444', '#3b82f6'] });
              if (Date.now() < end) requestAnimationFrame(frame);
            }());
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  return (
    <footer className="relative w-full border-t-4 border-primary bg-black font-sans select-none overflow-hidden" style={{ height: TRACK_HEIGHT }}>
      
      {/* 🏎️ TRACK ENVIRONMENT */}
      <div className="absolute inset-0 mx-auto max-w-4xl overflow-hidden bg-zinc-900 border-x-4 border-zinc-800 shadow-2xl">
        
        {/* Scrolling Asphalt Background */}
        <div 
          ref={trackBgRef}
          className="absolute inset-0 w-full h-[200%] -top-[100%]"
          style={{
            backgroundImage: "linear-gradient(to bottom, #18181b 50%, #27272a 50%)",
            backgroundSize: "100% 120px",
            willChange: "background-position",
          }}
        />

        {/* Track Markings (Dotted lines separating 3 lanes) */}
        <div className="absolute top-0 bottom-0 left-[33.33%] w-1 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4)_50%,transparent_50%)] bg-[length:100%_80px]" 
             style={{ animation: gameState !== 'finished' ? `track-lines ${1000 / (gameSpeedRef.current || 1)}s linear infinite` : 'none' }} />
        <div className="absolute top-0 bottom-0 left-[66.66%] w-1 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4)_50%,transparent_50%)] bg-[length:100%_80px]"
             style={{ animation: gameState !== 'finished' ? `track-lines ${1000 / (gameSpeedRef.current || 1)}s linear infinite` : 'none' }} />
        
        {/* Kerbs (Red/White edges) */}
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-[linear-gradient(to_bottom,#ef4444_50%,#ffffff_50%)] bg-[length:100%_60px]"
             style={{ animation: gameState !== 'finished' ? `track-lines ${1000 / (gameSpeedRef.current || 1)}s linear infinite` : 'none' }} />
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-[linear-gradient(to_bottom,#ef4444_50%,#ffffff_50%)] bg-[length:100%_60px]"
             style={{ animation: gameState !== 'finished' ? `track-lines ${1000 / (gameSpeedRef.current || 1)}s linear infinite` : 'none' }} />

        {/* DOM Entities (Items & AI Cars) */}
        {entitiesRef.current.map((entity) => (
          <div
            key={entity.id}
            ref={(el) => { entityNodesRef.current[entity.id] = el; }}
            className={`absolute top-0 transform -translate-x-1/2 will-change-transform ${entity.active ? 'opacity-100' : 'opacity-0'}`}
            style={{ left: `${LANES[entity.lane]}%`, transform: `translate(-50%, ${entity.y}px)` }}
          >
            {entity.type === "item" ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)] backdrop-blur text-3xl">
                {entity.def?.icon}
              </div>
            ) : (
              // AI Car (Obstacle)
              <div className={`relative flex h-20 w-12 flex-col items-center justify-between rounded-lg ${entity.color} p-1 shadow-lg`}>
                <div className="h-4 w-8 rounded-sm bg-black/60" /> {/* Rear window */}
                <div className="h-6 w-8 rounded-sm bg-black/60" /> {/* Windshield */}
                {/* Taillights */}
                <div className="absolute bottom-0 left-1 h-1 w-2 bg-red-300 shadow-[0_0_10px_red]" />
                <div className="absolute bottom-0 right-1 h-1 w-2 bg-red-300 shadow-[0_0_10px_red]" />
              </div>
            )}
          </div>
        ))}

        {/* 🏎️ PLAYER CAR */}
        <div 
          className="absolute bottom-[80px] w-14 h-24 transform -translate-x-1/2 transition-all duration-200 ease-out z-20"
          style={{ left: `${LANES[playerVisualLane]}%` }}
        >
          <div className="relative w-full h-full bg-gradient-to-b from-yellow-300 to-amber-500 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-2 border-amber-200">
            {/* Decals */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-10 bg-black/80 rounded flex items-center justify-center font-display text-white text-xl">
              10
            </div>
            {/* Windshield */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-6 bg-blue-900/80 rounded-sm" />
            {/* Spoiler */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-sm" />
            
            {/* Headlights (Glow when playing) */}
            <div className={`absolute -top-1 left-1 w-3 h-2 bg-white rounded-t-sm transition-all ${gameState === 'playing' ? 'shadow-[0_-15px_20px_rgba(255,255,255,0.8)]' : 'shadow-none'}`} />
            <div className={`absolute -top-1 right-1 w-3 h-2 bg-white rounded-t-sm transition-all ${gameState === 'playing' ? 'shadow-[0_-15px_20px_rgba(255,255,255,0.8)]' : 'shadow-none'}`} />
            
            {/* Exhaust Flames */}
            {gameState === "playing" && (
              <>
                <div className="absolute -bottom-4 left-2 w-2 h-4 bg-orange-500 rounded-full animate-pulse blur-[1px]" />
                <div className="absolute -bottom-4 right-2 w-2 h-4 bg-orange-500 rounded-full animate-pulse blur-[1px]" />
              </>
            )}

            {/* Crown for Birthday Boy */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">👑</div>
          </div>
        </div>

      </div>

      {/* 🎮 UI OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none p-4 md:p-6 flex flex-col justify-between max-w-5xl mx-auto z-30">
        
        {/* HUD (Heads Up Display) */}
        <div className="flex justify-between items-start">
          {/* Score */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-md shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-400">
              <Star className="h-6 w-6 fill-yellow-400" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Birthday Score</div>
              <div className="font-display text-3xl leading-none text-white transition-transform" ref={scoreDisplayRef}>
                {score}
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-md shadow-xl">
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Time Left</div>
              <div className={`font-display text-3xl leading-none ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Center Screens */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {gameState === "idle" && (
            <div className="pointer-events-auto w-[90%] max-w-md rounded-3xl border border-white/10 bg-black/80 p-8 text-center shadow-[0_0_50px_rgba(255,60,40,0.2)] backdrop-blur-xl transition-all hover:scale-[1.02]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-display text-3xl uppercase text-white">Victory Lap Experience</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                The fun isn't over! Take control of Aarav's Champion Car. Dodge traffic and collect birthday gifts for a high score.
              </p>
              
              <button
                onClick={startGame}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-fire via-primary to-fire bg-[length:200%_auto] px-8 py-4 font-display text-xl uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,60,40,0.5)] transition-all hover:bg-[position:100%_center] hover:shadow-[0_0_40px_rgba(255,60,40,0.8)]"
              >
                🏎️ Start Your Engine
              </button>
              
              <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="hidden md:block">Use ⬅️ Arrow Keys ➡️ to steer</span>
                <span className="block md:hidden">Tap Left / Right sides to steer</span>
              </div>
            </div>
          )}

          {gameState === "finished" && (
            <div className="pointer-events-auto w-[90%] max-w-md rounded-3xl border border-yellow-500/30 bg-black/80 p-8 text-center shadow-[0_0_50px_rgba(250,204,21,0.2)] backdrop-blur-xl animate-in zoom-in duration-500">
              <Trophy className="mx-auto mb-4 h-20 w-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
              <h3 className="mb-1 font-display text-4xl uppercase text-white">Race Complete!</h3>
              <div className="mb-6 font-mono text-xl uppercase text-primary">
                Final Score: <span className="text-3xl text-yellow-400">{score}</span>
              </div>
              <p className="mb-8 font-sans text-sm italic text-muted-foreground">
                "Thank you for being part of Aarav's special day. Your seat on the starting grid is waiting. See you at the party!"
              </p>
              <button
                onClick={startGame}
                className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 font-display text-lg uppercase tracking-wider text-white transition-all hover:bg-white/20"
              >
                Race Again
              </button>
              <button
                onClick={() => setGameState("idle")}
                className="mt-3 w-full rounded-full border border-white/10 bg-transparent px-6 py-3 font-display text-sm uppercase tracking-wider text-muted-foreground transition-all hover:bg-white/5 hover:text-white"
              >
                Close Game
              </button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="pointer-events-auto w-[90%] max-w-md rounded-3xl border border-red-500/30 bg-black/80 p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] backdrop-blur-xl animate-in zoom-in duration-500">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                <span className="text-5xl">💥</span>
              </div>
              <h3 className="mb-1 font-display text-4xl uppercase text-red-500">Game Over!</h3>
              <div className="mb-6 font-mono text-xl uppercase text-primary">
                Final Score: <span className="text-3xl text-yellow-400">{score}</span>
              </div>
              <p className="mb-8 font-sans text-sm italic text-muted-foreground">
                "Ouch! You hit the traffic. Better luck next lap!"
              </p>
              <button
                onClick={startGame}
                className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 font-display text-lg uppercase tracking-wider text-white transition-all hover:bg-white/20 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-100"
              >
                Try Again
              </button>
              <button
                onClick={() => setGameState("idle")}
                className="mt-3 w-full rounded-full border border-white/10 bg-transparent px-6 py-3 font-display text-sm uppercase tracking-wider text-muted-foreground transition-all hover:bg-white/5 hover:text-white"
              >
                Close Game
              </button>
            </div>
          )}
        </div>

        {/* Mobile Touch Zones */}
        {gameState === "playing" && (
          <div className="absolute inset-0 z-10 flex pointer-events-auto md:hidden">
            <div className="flex-1 h-full flex items-end justify-start p-4 pb-20" onTouchStart={handleMoveLeft}>
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur active:bg-white/30 transition-colors shadow-lg pointer-events-none">
                <ChevronLeft className="w-10 h-10 text-white/70" />
              </div>
            </div>
            <div className="flex-1 h-full flex items-end justify-end p-4 pb-20" onTouchStart={handleMoveRight}>
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur active:bg-white/30 transition-colors shadow-lg pointer-events-none">
                <ChevronRight className="w-10 h-10 text-white/70" />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes track-lines {
          from { background-position: 0 0; }
          to { background-position: 0 80px; }
        }
      `}</style>
    </footer>
  );
}

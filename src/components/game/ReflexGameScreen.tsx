import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReflexState } from "@/hooks/useReflexGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

interface Props {
  game: ReflexState; time: string;
  onClickTarget: (id: number) => void;
  onMissTarget: (id: number) => void;
  onHint: () => void; onPeek: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const ReflexGameScreen = ({ game, time, onClickTarget, onMissTarget, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = (game.score / game.totalTargets) * 100;

  useEffect(() => {
    if (!game.target?.active || game.won || game.lost) return;
    const targetId = game.target.id;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onMissTarget(targetId);
    }, game.targetMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [game.target?.id, game.target?.active, game.targetMs, game.won, game.lost, onMissTarget]);

  const cellSize = Math.min(48, Math.floor(280 / game.gridSize));

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Reflex</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Score</label><span className="tabular-nums font-semibold text-base">{game.score}/{game.totalTargets}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Lives</label><span className="tabular-nums font-semibold text-base text-destructive">{"❤️".repeat(game.lives)}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>
      <Progress value={progress} className="h-1.5 mb-6 [&>div]:bg-primary" />

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-3">
          {game.won ? "🎉 All targets hit!" : game.lost ? "💀 Out of lives!" : `Tap the target! (${game.remaining} left)`}
        </p>
        {game.hintText && <p className="text-accent text-sm font-semibold mb-3">💡 {game.hintText}</p>}

        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${game.gridSize}, ${cellSize}px)` }}>
          {Array.from({ length: game.gridSize }, (_, r) =>
            Array.from({ length: game.gridSize }, (_, c) => {
              const isTarget = game.target?.active && game.target.row === r && game.target.col === c;
              return (
                <AnimatePresence key={`${r}-${c}`}>
                  <motion.div
                    style={{ width: cellSize, height: cellSize }}
                    className={`rounded-full border-2 transition-all ${isTarget ? "border-primary cursor-pointer" : "border-border bg-card/30"}`}
                    initial={isTarget ? { scale: 0 } : undefined}
                    animate={isTarget ? { scale: 1 } : undefined}
                    exit={isTarget ? { scale: 0 } : undefined}
                    onClick={() => isTarget && game.target && onClickTarget(game.target.id)}
                    whileTap={isTarget ? { scale: 0.8 } : undefined}
                  >
                    {isTarget && (
                      <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white font-bold" style={{ fontSize: cellSize * 0.4 }}>●</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              );
            })
          )}
        </div>
      </div>

      {game.lost && (
        <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-[var(--radius-inner)] p-4 text-center">
          <p className="text-destructive font-bold">💀 Out of lives! Final score: {game.score}/{game.totalTargets}</p>
          <button onClick={onRestart} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-inner)] text-sm font-semibold">Try Again</button>
        </div>
      )}

      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={() => {}} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.score} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default ReflexGameScreen;

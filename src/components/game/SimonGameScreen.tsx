import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SimonState } from "@/hooks/useSimonGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

const COLOR_BG: Record<string, string> = {
  red: "bg-red-500", green: "bg-green-500", blue: "bg-blue-500", yellow: "bg-yellow-400",
  purple: "bg-purple-500", orange: "bg-orange-500", cyan: "bg-cyan-400", pink: "bg-pink-400",
};

interface Props {
  game: SimonState; time: string;
  onPressColor: (i: number) => void;
  onAdvanceShow: () => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const SimonGameScreen = ({ game, time, onPressColor, onAdvanceShow, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const progress = (game.currentRound / game.maxRounds) * 100;
  const flashingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (game.phase !== "showing") return;
    if (flashingRef.current) clearTimeout(flashingRef.current);
    flashingRef.current = setTimeout(() => {
      onAdvanceShow();
    }, game.showSpeedMs + 200);
    return () => { if (flashingRef.current) clearTimeout(flashingRef.current); };
  }, [game.phase, game.showIndex, game.showSpeedMs, onAdvanceShow]);

  const flashingColor = game.phase === "showing" ? game.sequence[game.showIndex] : -1;
  const nextInput = game.phase === "input" ? game.sequence[game.playerInput.length] : -1;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Simon Says</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Round</label><span className="tabular-nums font-semibold text-base">{game.currentRound}/{game.maxRounds}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>
      <Progress value={progress} className="h-1.5 mb-6 [&>div]:bg-primary" />

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {game.phase === "showing" ? `Watch the sequence (step ${game.showIndex + 1}/${game.sequence.length})...` :
           game.phase === "input" ? `Repeat! ${game.playerInput.length}/${game.sequence.length} entered` :
           game.phase === "won" ? "🎉 Excellent!" : "❌ Wrong button!"}
        </p>

        {game.peeking && (
          <p className="text-accent font-semibold text-sm mb-3">
            👁 Sequence: {game.sequence.map(i => game.colors[i]).join(" → ")}
          </p>
        )}
        {game.hintText && !game.peeking && (
          <p className="text-accent font-semibold text-sm mb-3">💡 {game.hintText}</p>
        )}

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {game.colors.map((color, i) => {
            const isFlashing = flashingColor === i;
            const isNext = game.phase === "input" && nextInput === i && game.peeking;
            return (
              <motion.button
                key={i}
                onClick={() => game.phase === "input" && onPressColor(i)}
                disabled={game.phase !== "input"}
                animate={isFlashing ? { scale: 1.15, opacity: 1 } : { scale: 1, opacity: 0.7 }}
                whileHover={game.phase === "input" ? { scale: 1.1, opacity: 1 } : undefined}
                whileTap={game.phase === "input" ? { scale: 0.92 } : undefined}
                className={`h-16 rounded-[var(--radius-inner)] border-2 transition-all ${COLOR_BG[color]} ${isFlashing ? "border-white shadow-lg" : isNext ? "border-yellow-300" : "border-white/20"} ${game.phase !== "input" ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="text-white font-bold text-xs capitalize">{color}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {game.lost && (
        <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-[var(--radius-inner)] p-4 text-center">
          <p className="text-destructive font-bold">❌ Wrong! The sequence was: {game.sequence.map(i => game.colors[i]).join(" → ")}</p>
          <button onClick={onRestart} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-inner)] text-sm font-semibold">Try Again</button>
        </div>
      )}

      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default SimonGameScreen;

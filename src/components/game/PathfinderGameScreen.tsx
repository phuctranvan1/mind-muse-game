import { motion } from "framer-motion";
import { PathfinderState } from "@/hooks/usePathfinderGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

interface Props {
  game: PathfinderState; time: string;
  onFlipArrow: (row: number, col: number) => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const PathfinderGameScreen = ({ game, time, onFlipArrow, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const pathSet = new Set<number>(
    (game.currentPath ?? []).map(([r, c]) => r * game.size + c)
  );

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Pathfinder</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Flips</label><span className="tabular-nums font-semibold text-base">{game.flipsUsed}/{game.maxFlips}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mb-3">
        Flip arrows (rotate 90°) to create a path from 🟢 top-left to 🔴 bottom-right
      </p>

      {game.hintText && (
        <p className="text-center text-sm text-accent font-semibold mb-3">💡 {game.hintText}</p>
      )}
      {game.won && <p className="text-center text-sm font-bold text-green-500 mb-3">🎉 Path found! You win!</p>}
      {game.lost && <p className="text-center text-sm font-bold text-destructive mb-3">💀 No flips left — no valid path!</p>}

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4">
        <div
          className="grid gap-1 mx-auto"
          style={{ gridTemplateColumns: `repeat(${game.size}, 1fr)`, maxWidth: `${game.size * 52}px` }}
        >
          {game.grid.map((row, r) =>
            row.map((dir, c) => {
              const key = r * game.size + c;
              const isStart = r === 0 && c === 0;
              const isEnd = r === game.size - 1 && c === game.size - 1;
              const onPath = pathSet.has(key);
              const isFlipped = game.flipped.has(key);

              let bg = "bg-card border-border";
              if (isStart) bg = "bg-green-500/20 border-green-500/60";
              else if (isEnd) bg = "bg-red-500/20 border-red-500/60";
              else if (onPath) bg = "bg-primary/10 border-primary/40";

              return (
                <motion.button
                  key={`${r}-${c}`}
                  onClick={() => !game.won && !game.lost && onFlipArrow(r, c)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={`Flip arrow at (${r + 1},${c + 1})`}
                  disabled={game.won || game.lost}
                  className={`w-12 h-12 rounded-[var(--radius-inner)] border-2 flex items-center justify-center text-xl font-bold transition-all ${bg} ${isFlipped ? "ring-2 ring-accent/60" : ""}`}
                >
                  {isStart ? "🟢" : isEnd ? "🔴" : game.dirEmoji[dir]}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 mb-2">
        <PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} />
      </div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default PathfinderGameScreen;

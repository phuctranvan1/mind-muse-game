import { motion } from "framer-motion";
import { FloodFillState, FLOOD_COLORS } from "@/hooks/useFloodFillGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

interface Props {
  game: FloodFillState; time: string;
  onFill: (colorIdx: number) => void;
  onHint: () => void; onPeek: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const FloodFillGameScreen = ({ game, time, onFill, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellPx = Math.min(32, Math.floor(300 / game.size));
  const progress = (1 - game.movesLeft / game.maxMoves) * 100;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Flood Fill</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label><span className={`tabular-nums font-semibold text-base ${game.movesLeft <= 3 ? "text-destructive" : ""}`}>{game.movesLeft}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>
      <Progress value={progress} className="h-1.5 mb-4 [&>div]:bg-primary" />

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4 flex flex-col items-center">
        <p className="text-xs text-muted-foreground mb-3">
          {game.won ? "🎉 Board cleared!" : game.lost ? "❌ Out of moves!" : `Fill entire board · ${game.movesLeft} moves left`}
        </p>
        {game.hintText && <p className="text-accent text-xs font-semibold mb-3">💡 {game.hintText}</p>}

        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${game.size}, ${cellPx}px)` }}>
          {game.grid.map((row, r) =>
            row.map((colorIdx, c) => (
              <div key={`${r}-${c}`} style={{ width: cellPx, height: cellPx, backgroundColor: FLOOD_COLORS[colorIdx] }} className="transition-colors" />
            ))
          )}
        </div>

        {/* Color palette */}
        {!game.won && !game.lost && (
          <div className="flex gap-2 mt-4">
            {Array.from({ length: game.colors }, (_, ci) => (
              <motion.button
                key={ci}
                onClick={() => onFill(ci)}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                disabled={game.grid[0][0] === ci}
                style={{ backgroundColor: FLOOD_COLORS[ci] }}
                className={`w-10 h-10 rounded-full border-3 border-white/50 transition-all ${game.grid[0][0] === ci ? "opacity-40 cursor-default ring-2 ring-white" : "cursor-pointer hover:shadow-lg"}`}
              />
            ))}
          </div>
        )}
      </div>

      {game.lost && (
        <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-[var(--radius-inner)] p-3 text-center">
          <p className="text-destructive font-bold text-sm">Out of moves! Try again.</p>
          <button onClick={onRestart} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-inner)] text-sm font-semibold">Restart</button>
        </div>
      )}

      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={() => {}} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default FloodFillGameScreen;

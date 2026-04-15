import { useEffect } from "react";
import { motion } from "framer-motion";
import { MazeState } from "@/hooks/useMazeGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

type Dir = "N" | "E" | "S" | "W";

interface Props {
  game: MazeState; time: string;
  onMove: (dir: Dir) => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const MazeGameScreen = ({ game, time, onMove, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (game.won) return;
      const map: Record<string, Dir> = { ArrowUp: "N", ArrowDown: "S", ArrowLeft: "W", ArrowRight: "E", w: "N", s: "S", a: "W", d: "E" };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); onMove(dir); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [game.won, onMove]);

  const cellPx = Math.min(22, Math.floor(320 / game.size));
  const solutionSet = new Set(game.solutionPath?.map(([r, c]) => r * game.size + c) ?? []);

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Maze</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label><span className="tabular-nums font-semibold text-base">{game.moves}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {game.hintText && <p className="text-accent text-sm font-semibold mb-3 text-center">💡 {game.hintText}</p>}

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4 flex flex-col items-center">
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${game.size}, ${cellPx}px)`, gap: 0 }}>
          {game.grid.map((row, r) =>
            row.map((cell, c) => {
              const isPlayer = r === game.playerRow && c === game.playerCol;
              const isGoal = r === game.goalRow && c === game.goalCol;
              const isSolution = solutionSet.has(r * game.size + c);
              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    width: cellPx,
                    height: cellPx,
                    borderTop: cell.N ? "2px solid var(--color-border, #ccc)" : "none",
                    borderRight: cell.E ? "2px solid var(--color-border, #ccc)" : "none",
                    borderBottom: cell.S ? "2px solid var(--color-border, #ccc)" : "none",
                    borderLeft: cell.W ? "2px solid var(--color-border, #ccc)" : "none",
                    backgroundColor: isPlayer ? "hsl(var(--primary))" : isGoal ? "hsl(var(--accent))" : isSolution ? "hsl(var(--primary)/0.2)" : "transparent",
                    position: "relative",
                  }}
                >
                  {isPlayer && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: cellPx * 0.6, color: "white" }}>●</span>}
                  {isGoal && !isPlayer && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: cellPx * 0.7 }}>★</span>}
                </div>
              );
            })
          )}
        </div>

        {/* Arrow controls */}
        <div className="mt-5 grid grid-cols-3 gap-1 w-28">
          <div />
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => onMove("N")} className="h-10 rounded-[var(--radius-inner)] bg-card border border-border flex items-center justify-center font-bold text-lg hover:bg-muted">↑</motion.button>
          <div />
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => onMove("W")} className="h-10 rounded-[var(--radius-inner)] bg-card border border-border flex items-center justify-center font-bold text-lg hover:bg-muted">←</motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => onMove("S")} className="h-10 rounded-[var(--radius-inner)] bg-card border border-border flex items-center justify-center font-bold text-lg hover:bg-muted">↓</motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => onMove("E")} className="h-10 rounded-[var(--radius-inner)] bg-card border border-border flex items-center justify-center font-bold text-lg hover:bg-muted">→</motion.button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Arrow keys or WASD also work</p>
      </div>

      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default MazeGameScreen;

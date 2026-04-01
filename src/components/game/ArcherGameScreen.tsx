import { motion } from "framer-motion";
import { useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { ArcherState } from "@/hooks/useArcherGame";

interface Props {
  game: ArcherState;
  time: string;
  onShoot: (dir: "up" | "down" | "left" | "right") => void;
  onMoveArcher: (dir: "left" | "right") => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const ArcherGameScreen = ({ game, time, onShoot, onMoveArcher, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellSize = Math.min(Math.floor(320 / game.size), 36);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") { e.preventDefault(); onShoot("up"); }
      if (e.key === "ArrowDown" || e.key === "s") { e.preventDefault(); onShoot("down"); }
      if (e.key === "ArrowLeft" || e.key === "a") { e.preventDefault(); onMoveArcher("left"); }
      if (e.key === "ArrowRight" || e.key === "d") { e.preventDefault(); onMoveArcher("right"); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onShoot, onMoveArcher]);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Archer</h2>
          <p className="text-xs text-muted-foreground">Hit all targets 🏹</p>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      <div className="flex justify-between text-sm mb-3">
        <span className="text-muted-foreground">
          🏹 <span className="font-bold text-foreground">{game.arrows - game.arrowsUsed}</span> left
        </span>
        <span className="text-muted-foreground">
          🎯 <span className="font-bold text-foreground">{game.targetsHit}/{game.totalTargets}</span>
        </span>
        <span className="text-muted-foreground">⏱ {time}</span>
      </div>

      {game.hintDir && (
        <div className="text-center mb-2 text-xs text-accent font-semibold">💡 Shoot {game.hintDir}!</div>
      )}

      <div className="flex justify-center mb-4">
        <div
          className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-1"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${game.size}, ${cellSize}px)`,
            gap: "2px",
          }}
        >
          {game.grid.flatMap((row, r) =>
            row.map((cell, c) => {
              const isArrowPath = game.lastArrowPath?.some(p => p.r === r && p.c === c);
              const isPeek = game.peekTargets?.some(p => p.r === r && p.c === c);

              return (
                <motion.div
                  key={`${r}-${c}`}
                  className={`flex items-center justify-center rounded-sm text-xs font-bold select-none ${
                    cell === "wall"
                      ? "bg-muted-foreground/40"
                      : cell === "archer"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : cell === "target"
                      ? isPeek
                        ? "bg-accent text-accent-foreground ring-2 ring-accent"
                        : "bg-red-500/20 text-red-500 border border-red-500/30"
                      : cell === "hit"
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : isArrowPath
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-card border border-border"
                  }`}
                  style={{ width: cellSize, height: cellSize }}
                  animate={cell === "hit" ? { scale: [1, 1.3, 1] } : cell === "archer" ? { y: [0, -2, 0] } : undefined}
                  transition={{ duration: 0.5 }}
                >
                  {cell === "archer" ? "🏹" : cell === "target" ? "🎯" : cell === "wall" ? "🧱" : cell === "hit" ? "✓" : isArrowPath ? "·" : ""}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-4">
        <motion.button onClick={() => onMoveArcher("left")} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-lg bg-muted text-muted-foreground border border-border font-bold text-lg">←</motion.button>
        <motion.button onClick={() => onShoot("up")} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold text-lg">↑🏹</motion.button>
        <motion.button onClick={() => onMoveArcher("right")} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-lg bg-muted text-muted-foreground border border-border font-bold text-lg">→</motion.button>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        <motion.button onClick={() => onShoot("left")} whileTap={{ scale: 0.9 }} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/25 font-semibold text-xs">←🏹</motion.button>
        <motion.button onClick={() => onShoot("down")} whileTap={{ scale: 0.9 }} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/25 font-semibold text-xs">↓🏹</motion.button>
        <motion.button onClick={() => onShoot("right")} whileTap={{ scale: 0.9 }} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/25 font-semibold text-xs">→🏹</motion.button>
      </div>

      <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />

      <div className="flex gap-2 justify-center mt-4">
        <button onClick={onRestart} className="text-xs px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-semibold">🔄 Restart</button>
        <button onClick={onMenu} className="text-xs px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-semibold">☰ Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} onRestart={onRestart} onMenu={onMenu} />}
      {game.lost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-[var(--radius-outer)] border border-border shadow-xl text-center">
            <p className="text-lg font-bold text-foreground mb-2">🏹 Out of arrows!</p>
            <p className="text-sm text-muted-foreground mb-4">{game.targetsHit}/{game.totalTargets} targets hit</p>
            <div className="flex gap-2 justify-center">
              <button onClick={onRestart} className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm">Retry</button>
              <button onClick={onMenu} className="px-4 py-2 rounded-full bg-muted text-muted-foreground font-semibold text-sm">Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArcherGameScreen;

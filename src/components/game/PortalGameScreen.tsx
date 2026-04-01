import { motion } from "framer-motion";
import { useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { PortalState } from "@/hooks/usePortalGame";

const PORTAL_COLORS = ["text-blue-500", "text-green-500", "text-purple-500", "text-pink-500", "text-orange-500", "text-cyan-500", "text-red-500", "text-yellow-500", "text-teal-500", "text-indigo-500"];

interface Props {
  game: PortalState;
  time: string;
  onMove: (dir: "up" | "down" | "left" | "right") => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const PortalGameScreen = ({ game, time, onMove, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellSize = Math.min(Math.floor(320 / game.size), 36);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); onMove(dir); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onMove]);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Portal Maze</h2>
          <p className="text-xs text-muted-foreground">Navigate through portals 🌀</p>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      <div className="flex justify-between text-sm mb-3">
        <span className="text-muted-foreground">Moves: <span className="font-bold text-foreground">{game.moves}</span>
          {game.moveLimit && <span className="text-muted-foreground">/{game.moveLimit}</span>}
        </span>
        <span className="text-muted-foreground">⏱ {time}</span>
      </div>

      {game.hintDir && (
        <div className="text-center mb-2 text-xs text-accent font-semibold">💡 Go {game.hintDir}!</div>
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
              const isPlayer = game.player.r === r && game.player.c === c;
              const isEnd = game.end.r === r && game.end.c === c;
              const isPeek = game.peekPath?.some(p => p.r === r && p.c === c);
              const portalColor = cell.type === "portal" && cell.portalId !== undefined
                ? PORTAL_COLORS[cell.portalId % PORTAL_COLORS.length]
                : "";

              return (
                <motion.div
                  key={`${r}-${c}`}
                  className={`flex items-center justify-center rounded-sm text-xs font-bold select-none ${
                    cell.type === "wall"
                      ? "bg-muted-foreground/40"
                      : isPlayer
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isEnd
                      ? "bg-accent text-accent-foreground"
                      : cell.type === "portal"
                      ? `bg-card border border-border ${portalColor}`
                      : isPeek
                      ? "bg-accent/20 border border-accent/40"
                      : "bg-card border border-border"
                  }`}
                  style={{ width: cellSize, height: cellSize }}
                  animate={isPlayer ? { scale: [1, 1.1, 1] } : cell.type === "portal" ? { rotate: [0, 360] } : undefined}
                  transition={cell.type === "portal" ? { duration: 3, repeat: Infinity } : { duration: 0.3 }}
                >
                  {isPlayer ? "🧑" : isEnd ? "🏁" : cell.type === "wall" ? "█" : cell.type === "portal" ? "🌀" : ""}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* D-pad */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-3 gap-1" style={{ width: "120px" }}>
          <div />
          <motion.button onClick={() => onMove("up")} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold text-lg">↑</motion.button>
          <div />
          <motion.button onClick={() => onMove("left")} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold text-lg">←</motion.button>
          <div />
          <motion.button onClick={() => onMove("right")} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold text-lg">→</motion.button>
          <div />
          <motion.button onClick={() => onMove("down")} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold text-lg">↓</motion.button>
          <div />
        </div>
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
            <p className="text-lg font-bold text-foreground mb-2">💥 Out of moves!</p>
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

export default PortalGameScreen;

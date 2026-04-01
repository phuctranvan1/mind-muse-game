import { motion } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { RicochetState } from "@/hooks/useRicochetGame";

interface Props {
  game: RicochetState;
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

const DIRECTION_ARROWS = [
  { dir: "up" as const, label: "↑", row: 0, col: 1 },
  { dir: "left" as const, label: "←", row: 1, col: 0 },
  { dir: "right" as const, label: "→", row: 1, col: 2 },
  { dir: "down" as const, label: "↓", row: 2, col: 1 },
];

const RicochetGameScreen = ({ game, time, onMove, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellSize = Math.min(Math.floor(320 / game.size), 40);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Ricochet</h2>
          <p className="text-xs text-muted-foreground">Slide to the target ⭐</p>
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
        <div className="text-center mb-2 text-xs text-accent font-semibold">💡 Try sliding {game.hintDir}!</div>
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
              const isTarget = game.target.r === r && game.target.c === c;
              const isPeek = game.peekPath?.some(p => p.r === r && p.c === c);

              return (
                <motion.div
                  key={`${r}-${c}`}
                  className={`flex items-center justify-center rounded-sm text-xs font-bold select-none ${
                    cell.obstacle
                      ? "bg-muted-foreground/30"
                      : isPlayer
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isTarget
                      ? "bg-accent text-accent-foreground"
                      : isPeek
                      ? "bg-accent/20 border border-accent/40"
                      : "bg-card border border-border"
                  }`}
                  style={{ width: cellSize, height: cellSize }}
                  animate={isPlayer ? { scale: [1, 1.1, 1] } : undefined}
                  transition={{ duration: 0.3 }}
                >
                  {isPlayer ? "●" : isTarget ? "⭐" : cell.obstacle ? "█" : ""}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* D-pad controls */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-3 gap-1" style={{ width: "120px" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
            const arrow = DIRECTION_ARROWS.find(a => a.row === Math.floor(i / 3) && a.col === i % 3);
            if (!arrow) return <div key={i} />;
            return (
              <motion.button
                key={arrow.dir}
                onClick={() => onMove(arrow.dir)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold text-lg hover:bg-primary/20 transition-colors ${
                  game.hintDir === arrow.dir ? "ring-2 ring-accent" : ""
                }`}
              >
                {arrow.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />

      <div className="flex gap-2 justify-center mt-4">
        <button onClick={onRestart} className="text-xs px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-semibold">🔄 Restart</button>
        <button onClick={onMenu} className="text-xs px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-semibold">☰ Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} onClose={onMenu} />}
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

export default RicochetGameScreen;

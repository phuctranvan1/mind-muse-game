import { motion } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { ChainBlastState } from "@/hooks/useChainBlastGame";

interface Props {
  game: ChainBlastState;
  time: string;
  onPlaceBomb: (r: number, c: number) => void;
  onDetonate: () => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const ChainBlastGameScreen = ({ game, time, onPlaceBomb, onDetonate, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellSize = Math.min(Math.floor(320 / game.size), 36);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Chain Blast</h2>
          <p className="text-xs text-muted-foreground">Place bombs & detonate 💣</p>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      <div className="flex justify-between text-sm mb-3">
        <span className="text-muted-foreground">
          Bombs: <span className="font-bold text-foreground">{game.bombsPlaced}/{game.bombs}</span>
        </span>
        <span className="text-muted-foreground">
          Targets: <span className="font-bold text-foreground">{game.destroyedTargets}/{game.totalTargets}</span>
        </span>
        <span className="text-muted-foreground">⏱ {time}</span>
      </div>

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
              const isHint = game.hintCell?.r === r && game.hintCell?.c === c;

              return (
                <motion.button
                  key={`${r}-${c}`}
                  onClick={() => onPlaceBomb(r, c)}
                  disabled={game.detonated || game.won || game.lost}
                  className={`flex items-center justify-center rounded-sm text-xs font-bold select-none transition-colors ${
                    cell === "target"
                      ? "bg-red-500/20 text-red-500 border border-red-500/30"
                      : cell === "bomb"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : cell === "destroyed"
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : cell === "exploded"
                      ? "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                      : isHint
                      ? "bg-accent/30 border-2 border-accent"
                      : "bg-card border border-border hover:bg-primary/5"
                  }`}
                  style={{ width: cellSize, height: cellSize }}
                  whileHover={cell === "empty" ? { scale: 1.1 } : undefined}
                  whileTap={cell === "empty" ? { scale: 0.9 } : undefined}
                  animate={cell === "destroyed" ? { scale: [1, 1.3, 0.8, 1] } : cell === "exploded" ? { rotate: [0, 15, -15, 0] } : undefined}
                >
                  {cell === "target" ? "🎯" : cell === "bomb" ? "💣" : cell === "destroyed" ? "💥" : cell === "exploded" ? "🔥" : ""}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {!game.detonated && !game.won && !game.lost && (
        <div className="flex justify-center mb-4">
          <motion.button
            onClick={onDetonate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={game.bombsPlaced === 0}
            className="px-6 py-3 rounded-full bg-red-500 text-white font-bold text-sm shadow-lg hover:bg-red-600 disabled:opacity-40 transition-all"
          >
            💥 DETONATE!
          </motion.button>
        </div>
      )}

      <PowerUpButtons onHint={onHint} onUndo={!game.detonated ? onUndo : undefined} onPeek={onPeek} />

      <div className="flex gap-2 justify-center mt-4">
        <button onClick={onRestart} className="text-xs px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-semibold">🔄 Restart</button>
        <button onClick={onMenu} className="text-xs px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-semibold">☰ Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} onClose={onMenu} />}
      {game.lost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-[var(--radius-outer)] border border-border shadow-xl text-center">
            <p className="text-lg font-bold text-foreground mb-2">💥 Not all targets destroyed!</p>
            <p className="text-sm text-muted-foreground mb-4">{game.destroyedTargets}/{game.totalTargets} targets hit</p>
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

export default ChainBlastGameScreen;

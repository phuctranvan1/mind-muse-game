import { motion } from "framer-motion";
import { LightsOutState } from "@/hooks/useLightsOutGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: LightsOutState;
  time: string;
  onToggleCell: (row: number, col: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const LightsOutGameScreen = ({ game, time, onToggleCell, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const diffLabels: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert", master: "Master", grandmaster: "Grandmaster", genius: "Genius" };

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Lights Out</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{diffLabels[game.difficulty]}</span>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex gap-6">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
              <span className="tabular-nums font-semibold text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.moves}</span>
            </div>
          </div>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      <p className="text-xs text-muted-foreground mb-4 text-center">Turn off all the lights! Clicking a cell toggles it and its neighbors.</p>

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Peeking — all lights off is the goal!</p>
      )}

      <div
        className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] aspect-square"
        style={{ padding: "var(--gap)", display: "grid", gridTemplateColumns: `repeat(${game.gridSize}, 1fr)`, gap: "var(--gap)" }}
      >
        {(game.peeking
          ? Array.from({ length: game.gridSize }, () => Array(game.gridSize).fill(false))
          : game.board
        ).map((row, r) =>
          row.map((lit, c) => {
            const isHint = game.hintCell?.[0] === r && game.hintCell?.[1] === c;
            return (
              <motion.div
                key={`${r}-${c}`}
                onClick={() => onToggleCell(r, c)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-[var(--radius-inner)] cursor-pointer border transition-all duration-200 ${
                  isHint
                    ? "bg-accent text-accent-foreground border-accent/50 shadow-[0_0_20px_hsl(var(--accent)/0.6)] animate-pulse"
                    : lit
                    ? "bg-accent text-accent-foreground border-accent/50 shadow-[0_0_16px_hsl(var(--accent)/0.4)]"
                    : "bg-muted border-border shadow-[var(--tile-shadow)]"
                }`}
              />
            );
          })
        )}
      </div>

      <div className="mt-4 mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} onClose={onMenu} />}
    </div>
  );
};

export default LightsOutGameScreen;

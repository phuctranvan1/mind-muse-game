import { motion } from "framer-motion";
import { LightsInState } from "@/hooks/useLightsInGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: LightsInState;
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

const LightsInGameScreen = ({ game, time, onToggleCell, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const diffLabels: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert", master: "Master", grandmaster: "Grandmaster", genius: "Genius", legend: "Legend", mythic: "Mythic", immortal: "Immortal", divine: "Divine" };

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Lights In</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{diffLabels[game.difficulty]}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.moves}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4 text-center">Turn on all the lights! Clicking a cell toggles it and its neighbors.</p>

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Peeking — all lights on is the goal!</p>
      )}

      <div
        className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] aspect-square"
        style={{ padding: "var(--gap)", display: "grid", gridTemplateColumns: `repeat(${game.gridSize}, 1fr)`, gap: "var(--gap)" }}
      >
        {(game.peeking
          ? Array.from({ length: game.gridSize }, () => Array(game.gridSize).fill(true))
          : game.board
        ).map((row, r) =>
          row.map((lit: boolean, c: number) => {
            const isHint = game.hintCell?.[0] === r && game.hintCell?.[1] === c;
            return (
              <motion.div
                key={`${r}-${c}`}
                onClick={() => onToggleCell(r, c)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-[var(--radius-inner)] cursor-pointer border transition-all duration-200 ${
                  isHint
                    ? "bg-primary text-primary-foreground border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.6)] animate-pulse"
                    : lit
                    ? "bg-primary text-primary-foreground border-primary/50 shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
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

      {game.won && <WinModal moves={game.moves} time={time} difficulty={diffLabels[game.difficulty]} onClose={onMenu} />}
    </div>
  );
};

export default LightsInGameScreen;

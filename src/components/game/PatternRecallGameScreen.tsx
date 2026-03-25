import { motion } from "framer-motion";
import { PatternRecallState } from "@/hooks/usePatternRecallGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: PatternRecallState;
  onTap: (index: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onNextRound: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const PatternRecallGameScreen = ({ game, onTap, onHint, onUndo, onPeek, onNextRound, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const diffLabels: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert", master: "Master", grandmaster: "Grandmaster", genius: "Genius", legend: "Legend" };
  const total = game.gridSize * game.gridSize;
  const isShowingCell = (idx: number) => game.phase === "showing" && game.pattern[game.currentShowIndex] === idx;
  const isPlayerHit = (idx: number) => game.phase === "input" && game.playerPattern.includes(idx);
  const isHintCell = (idx: number) => game.hintCell === idx;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Pattern</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{diffLabels[game.difficulty]} · Round {game.round}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Score</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.score}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Progress</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.playerPattern.length}/{game.pattern.length}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4 text-center">
        {game.phase === "showing" ? "Watch the pattern..." : game.phase === "input" ? "Repeat the pattern!" : game.phase === "won" ? "🎉 Perfect!" : "❌ Wrong!"}
      </p>

      <div
        className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] aspect-square"
        style={{ padding: "var(--gap)", display: "grid", gridTemplateColumns: `repeat(${game.gridSize}, 1fr)`, gap: "var(--gap)" }}
      >
        {Array.from({ length: total }, (_, idx) => (
          <motion.div
            key={idx}
            onClick={() => game.phase === "input" && onTap(idx)}
            whileHover={game.phase === "input" ? { scale: 1.05 } : undefined}
            whileTap={game.phase === "input" ? { scale: 0.9 } : undefined}
            animate={isShowingCell(idx) ? { scale: [1, 1.1, 1] } : {}}
            className={`rounded-[var(--radius-inner)] border transition-all duration-200 ${
              isHintCell(idx)
                ? "bg-accent border-accent/50 shadow-[0_0_20px_hsl(var(--accent)/0.6)] animate-pulse"
                : isShowingCell(idx)
                ? "bg-primary border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                : isPlayerHit(idx)
                ? "bg-accent border-accent/50 shadow-[0_0_12px_hsl(var(--accent)/0.4)]"
                : game.phase === "input"
                ? "bg-tile border-tile-border shadow-[var(--tile-shadow)] cursor-pointer hover:shadow-[var(--tile-shadow-hover)]"
                : "bg-muted border-border"
            }`}
          />
        ))}
      </div>

      {game.phase === "input" && (
        <div className="mt-4 mb-2">
          <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
        </div>
      )}

      <div className="flex justify-center gap-6 mt-4">
        {game.phase === "won" && (
          <button onClick={onNextRound} className="text-sm font-semibold text-accent hover:brightness-110 transition-all">Next Round</button>
        )}
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
    </div>
  );
};

export default PatternRecallGameScreen;

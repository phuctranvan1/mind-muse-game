import { motion } from "framer-motion";
import { PatternRecallState } from "@/hooks/usePatternRecallGame";
import DarkModeToggle from "./DarkModeToggle";

interface Props {
  game: PatternRecallState;
  onTap: (index: number) => void;
  onNextRound: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const PatternRecallGameScreen = ({ game, onTap, onNextRound, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const diffLabels: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert", master: "Master" };
  const total = game.gridSize * game.gridSize;
  const isShowingCell = (idx: number) => game.phase === "showing" && game.pattern[game.currentShowIndex] === idx;
  const isPlayerHit = (idx: number) => game.phase === "input" && game.playerPattern.includes(idx);

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Pattern</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{diffLabels[game.difficulty]} · Round {game.round}</span>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Score</label>
            <span className="tabular-nums font-semibold text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.score}</span>
          </div>
          <div>
            <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Progress</label>
            <span className="tabular-nums font-semibold text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.playerPattern.length}/{game.pattern.length}</span>
          </div>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
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
              isShowingCell(idx)
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

      <div className="flex justify-center gap-6 mt-6">
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

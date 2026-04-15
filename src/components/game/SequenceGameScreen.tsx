import { motion } from "framer-motion";
import { SequenceState } from "@/hooks/useSequenceGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

interface Props {
  game: SequenceState;
  time: string;
  onAnswer: (answer: number) => void;
  onHint: () => void;
  onPeek: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const OPTION_COLORS = ["bg-tile-1", "bg-tile-3", "bg-tile-5", "bg-tile-6"];

const SequenceGameScreen = ({
  game, time, onAnswer, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark,
}: Props) => {
  const problem = game.problems[game.currentIndex];
  const progress = (game.currentIndex / game.problems.length) * 100;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Number Sequence</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base text-foreground">{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Score</label>
              <span className="tabular-nums font-semibold text-base text-foreground">{game.score}/{game.problems.length}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <Progress value={progress} className="h-1.5 mb-6 [&>div]:bg-primary" />

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-6">
        <p className="text-xs text-muted-foreground text-center mb-3">
          Question {game.currentIndex + 1} of {game.problems.length} — What comes next?
        </p>

        {/* Sequence display */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          {problem.terms.map((term, i) => (
            <div
              key={i}
              className="px-3 py-2 rounded-[var(--radius-inner)] bg-card border border-border font-mono font-bold text-lg sm:text-xl text-foreground tabular-nums min-w-[3rem] text-center"
            >
              {term}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-bold text-xl">→</span>
            <div className="px-3 py-2 rounded-[var(--radius-inner)] border-2 border-dashed border-primary/60 bg-primary/8 font-mono font-bold text-xl text-primary min-w-[3rem] text-center">
              ?
            </div>
          </div>
        </div>

        {game.peeking && (
          <p className="text-center text-accent font-bold mb-3 animate-pulse">
            👁 Answer: {problem.answer}
          </p>
        )}

        {game.hintText && !game.peeking && (
          <p className="text-center text-sm text-accent font-semibold mb-3">
            💡 {game.hintText}
          </p>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {problem.options.map((opt, i) => {
            const isSelected = game.selectedAnswer === opt;
            const isCorrect = opt === problem.answer;
            let colorClass = `${OPTION_COLORS[i]} text-white border-white/15`;
            if (isSelected && game.wasCorrect) colorClass = "bg-accent text-accent-foreground border-accent/50";
            if (isSelected && game.wasCorrect === false) colorClass = "bg-destructive text-white border-destructive/50";
            if (!isSelected && game.selectedAnswer !== null && isCorrect) colorClass = "bg-accent text-accent-foreground border-accent/50 opacity-70";

            return (
              <motion.button
                key={i}
                onClick={() => game.selectedAnswer === null && onAnswer(opt)}
                whileHover={game.selectedAnswer === null ? { scale: 1.03 } : undefined}
                whileTap={game.selectedAnswer === null ? { scale: 0.95 } : undefined}
                disabled={game.selectedAnswer !== null}
                className={`py-4 rounded-[var(--radius-inner)] font-bold text-lg border shadow-[var(--tile-shadow)] transition-all tabular-nums ${colorClass} ${game.selectedAnswer !== null ? "cursor-default" : "cursor-pointer"}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 mb-2">
        <PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && <WinModal moves={game.score} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default SequenceGameScreen;

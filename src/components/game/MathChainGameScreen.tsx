import { motion } from "framer-motion";
import { MathChainState } from "@/hooks/useMathChainGame";
import DarkModeToggle from "./DarkModeToggle";
import { Progress } from "@/components/ui/progress";
import PowerUpButtons from "./PowerUpButtons";

const OPTION_COLORS = ["bg-tile-1", "bg-tile-3", "bg-tile-5", "bg-tile-6"];

interface Props {
  game: MathChainState;
  time: string;
  onAnswer: (answer: number) => void;
  onHint: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const MathChainGameScreen = ({ game, time, onAnswer, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const diffLabels: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert", master: "Master", grandmaster: "Grandmaster", genius: "Genius", legend: "Legend" };
  const problem = game.problems[game.currentIndex];
  const progress = ((game.currentIndex) / game.problems.length) * 100;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Math Chain</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{diffLabels[game.difficulty]}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Score</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.score}/{game.problems.length}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <Progress value={progress} className="h-1.5 mb-6 [&>div]:bg-primary" />

      {game.finished ? (
        <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-8 text-center">
          <p className="text-4xl mb-3">{game.score === game.problems.length ? "🏆" : game.score >= game.problems.length * 0.7 ? "👏" : "💪"}</p>
          <p className="text-xl font-bold text-foreground">{game.score} / {game.problems.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Completed in {time}</p>
          <p className="text-xs text-muted-foreground mt-1">{game.wrong} wrong answers</p>
        </div>
      ) : (
        <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-6">
          <p className="text-xs text-muted-foreground text-center mb-2">Question {game.currentIndex + 1} of {game.problems.length}</p>
          <p className="text-3xl font-bold text-center text-foreground mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {problem.question} = ?
          </p>

          {game.peekAnswer !== null && (
            <p className="text-center text-accent font-bold mb-3 animate-pulse">
              👁 Answer: {game.peekAnswer}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {problem.options.map((opt, i) => {
              const isEliminated = game.eliminatedOptions.includes(opt);
              const isSelected = game.selectedAnswer === opt;
              const isCorrect = opt === problem.answer;
              let colorClass = `${OPTION_COLORS[i]} text-white border-white/15`;
              if (isSelected && game.wasCorrect) colorClass = "bg-accent text-accent-foreground border-accent/50";
              if (isSelected && game.wasCorrect === false) colorClass = "bg-danger text-white border-danger/50";
              if (!isSelected && game.selectedAnswer !== null && isCorrect) colorClass = "bg-accent text-accent-foreground border-accent/50 opacity-70";
              if (isEliminated) colorClass = "bg-muted text-muted-foreground border-border opacity-40";

              return (
                <motion.button
                  key={i}
                  onClick={() => !isEliminated && onAnswer(opt)}
                  whileHover={!isEliminated ? { scale: 1.03 } : undefined}
                  whileTap={!isEliminated ? { scale: 0.95 } : undefined}
                  disabled={game.selectedAnswer !== null || isEliminated}
                  className={`py-4 rounded-[var(--radius-inner)] font-bold text-lg border shadow-[var(--tile-shadow)] transition-all ${colorClass} ${game.selectedAnswer !== null || isEliminated ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {isEliminated ? "✕" : opt}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {!game.finished && (
        <div className="mt-4 mb-2">
          <PowerUpButtons onHint={onHint} onPeek={onPeek} />
        </div>
      )}

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
    </div>
  );
};

export default MathChainGameScreen;

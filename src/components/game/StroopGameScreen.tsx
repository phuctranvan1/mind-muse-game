import { motion } from "framer-motion";
import { StroopState } from "@/hooks/useStroopGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

interface Props {
  game: StroopState;
  time: string;
  onAnswer: (colorName: string) => void;
  onHint: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const StroopGameScreen = ({ game, time, onAnswer, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const round = game.rounds[game.currentRound];
  const timerPct = (game.timeLeft / game.timePerRound) * 100;
  const timerDanger = timerPct < 30;
  const progress = (game.currentRound / game.rounds.length) * 100;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Stroop Test</h1>
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
              <span className="tabular-nums font-semibold text-base text-foreground">{game.score}/{game.rounds.length}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {/* Overall round progress */}
      <Progress value={progress} className="h-1.5 mb-4 [&>div]:bg-primary" />

      {/* Per-round timer bar */}
      <div className="mb-5">
        <Progress
          value={timerPct}
          className={`h-2 [&>div]:transition-none ${timerDanger ? "[&>div]:bg-destructive" : "[&>div]:bg-accent"}`}
        />
        <p className={`text-[0.65rem] text-right mt-0.5 tabular-nums ${timerDanger ? "text-destructive font-bold" : "text-muted-foreground"}`}>
          {game.timeLeft.toFixed(1)}s
        </p>
      </div>

      {/* Word display */}
      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-8 mb-5 text-center">
        <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-4">
          Click the button matching the <strong>ink color</strong> — ignore the word
        </p>
        {game.peeking && (
          <p className="text-sm text-accent font-bold mb-2 animate-pulse">
            👁 Ink color: {round.inkName}
          </p>
        )}
        <motion.p
          key={game.currentRound}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-6xl sm:text-7xl font-black select-none"
          style={{ color: round.inkHex }}
        >
          {round.word}
        </motion.p>
        <p className="text-[0.65rem] text-muted-foreground mt-3">
          Round {game.currentRound + 1} of {game.rounds.length} · {game.wrong} missed
        </p>
      </div>

      {/* Color option buttons */}
      <motion.div
        key={`opts-${game.currentRound}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={`grid gap-3 mb-4 ${
          round.options.length <= 4 ? "grid-cols-2 sm:grid-cols-4" : round.options.length <= 6 ? "grid-cols-3" : "grid-cols-4"
        }`}
      >
        {round.options.map((opt) => {
          const isSelected = game.selectedAnswer === opt.name;
          const isCorrect = opt.name === round.inkName;
          let ringClass = "";
          if (isSelected && game.wasCorrect) ringClass = "ring-2 ring-white ring-offset-2";
          if (isSelected && game.wasCorrect === false) ringClass = "ring-2 ring-destructive ring-offset-2 opacity-60";
          if (!isSelected && game.selectedAnswer !== null && isCorrect) ringClass = "ring-2 ring-white ring-offset-2 opacity-90";

          return (
            <motion.button
              key={opt.name}
              onClick={() => game.selectedAnswer === null && onAnswer(opt.name)}
              whileHover={game.selectedAnswer === null ? { scale: 1.05, y: -2 } : undefined}
              whileTap={game.selectedAnswer === null ? { scale: 0.95 } : undefined}
              disabled={game.selectedAnswer !== null}
              className={`py-3.5 rounded-[var(--radius-inner)] font-bold text-white text-sm shadow-[var(--tile-shadow)] border-2 border-white/20 transition-all ${ringClass} ${game.selectedAnswer === null ? "cursor-pointer" : "cursor-default"}`}
              style={{ backgroundColor: opt.hex }}
            >
              {isSelected && game.wasCorrect ? "✓" : isSelected && game.wasCorrect === false ? "✗" : opt.name}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mb-2">
        <PowerUpButtons onHint={onHint} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && (
        <WinModal moves={game.score} time={time} difficulty={game.difficulty} onClose={onMenu} />
      )}
    </div>
  );
};

export default StroopGameScreen;

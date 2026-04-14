import { SieveState } from "@/hooks/useSieveGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { motion } from "framer-motion";

interface Props {
  game: SieveState;
  time: string;
  onToggleMark: (index: number) => void;
  onSubmitRound: () => void;
  onNextRound: () => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const SieveGameScreen = ({ game, time, onToggleMark, onSubmitRound, onNextRound, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cols = game.limit <= 30 ? 5 : game.limit <= 50 ? 7 : game.limit <= 100 ? 10 : game.limit <= 200 ? 14 : game.limit <= 300 ? 18 : 22;
  const matchCount = game.correct.filter(Boolean).length;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Number Theory</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-3">
            <div>
              <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">Round</label>
              <span className="tabular-nums font-semibold text-sm text-foreground">{game.round}/{game.totalRounds}</span>
            </div>
            <div>
              <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-sm text-foreground">{time}</span>
            </div>
            <div>
              <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">Score</label>
              <span className="tabular-nums font-semibold text-sm text-foreground">{game.score}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {/* Mistakes bar */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">Lives:</span>
        {Array.from({ length: game.maxMistakes }, (_, i) => (
          <span key={i} className={`text-sm ${i < game.maxMistakes - game.mistakes ? "text-destructive" : "text-muted-foreground/30"}`}>
            ♥
          </span>
        ))}
      </div>

      {/* Current Rule */}
      <motion.div
        key={game.round}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 mb-4"
      >
        <p className="text-[0.65rem] uppercase text-primary/70 font-semibold tracking-wider mb-1">Select all numbers matching:</p>
        <p className="text-sm font-bold text-primary leading-snug">{game.currentRule.description}</p>
        <p className="text-[0.6rem] text-muted-foreground mt-1">{matchCount} numbers match this rule</p>
      </motion.div>

      {game.lost && (
        <div className="text-center mb-3 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm font-bold text-destructive">💀 Too many mistakes! Game Over</p>
          <p className="text-xs text-muted-foreground mt-1">Score: {game.score}</p>
        </div>
      )}

      {game.roundComplete && !game.won && (
        <div className="text-center mb-3">
          <p className="text-sm font-bold text-accent mb-2">✓ Round {game.round} complete!</p>
          <button
            onClick={onNextRound}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Next Round →
          </button>
        </div>
      )}

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Showing solution...</p>
      )}

      <div className="flex justify-center mb-4 overflow-x-auto">
        <div
          className="inline-grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {game.grid.map((num, i) => {
            const isMarked = game.marked[i];
            const isHint = game.hintCell === i;
            const isCorrect = game.correct[i];
            const peekMatch = game.peeking && isCorrect;
            const peekNoMatch = game.peeking && !isCorrect;

            return (
              <button
                key={num}
                onClick={() => !game.won && !game.lost && !game.roundComplete && onToggleMark(i)}
                disabled={game.won || game.lost || game.roundComplete}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-[0.65rem] sm:text-xs font-semibold transition-all border ${
                  game.peeking
                    ? peekMatch
                      ? "bg-primary/25 border-primary/50 text-primary ring-1 ring-primary/30"
                      : "bg-card border-border text-muted-foreground/40"
                    : isMarked
                      ? "bg-primary/20 border-primary/40 text-primary shadow-sm"
                      : isHint
                        ? "bg-accent/20 border-accent/50 text-accent ring-2 ring-accent animate-pulse"
                        : "bg-card border-border text-foreground hover:bg-primary/10 hover:border-primary/30"
                } disabled:cursor-default`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {!game.won && !game.lost && !game.roundComplete && (
        <div className="flex justify-center mb-4">
          <button
            onClick={onSubmitRound}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-md"
          >
            Submit Answer
          </button>
        </div>
      )}

      <div className="mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default SieveGameScreen;

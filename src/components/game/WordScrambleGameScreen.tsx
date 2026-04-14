import { motion, AnimatePresence } from "framer-motion";
import { WordScrambleState } from "@/hooks/useWordScrambleGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import PowerUpButtons from "./PowerUpButtons";
import { XPGain } from "@/hooks/useXPSystem";

interface Props {
  game: WordScrambleState;
  time: string;
  onPlaceLetter: (index: number) => void;
  onRemoveLast: () => void;
  onRetryRound: () => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
  xpGain?: XPGain | null;
}

const DIFF_LABELS: Record<string, string> = {
  easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert",
  master: "Master", grandmaster: "Grandmaster", genius: "Genius",
  legend: "Legend", mythic: "Mythic", immortal: "Immortal", divine: "Divine",
};

const WordScrambleGameScreen = ({
  game, time, onPlaceLetter, onRemoveLast, onRetryRound,
  onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark, xpGain,
}: Props) => {
  const round = game.rounds[game.currentRound];
  const solvedCount = game.rounds.filter(r => r.solved).length;
  const totalRounds = game.rounds.length;
  const diffLabel = DIFF_LABELS[game.difficulty] ?? game.difficulty;

  // Determine which letter index in placed is the "hint" next letter
  const hintLetterIndex = game.hintActive && round
    ? (() => {
        const needed = round.target[round.placed.length]?.toUpperCase();
        if (!needed) return -1;
        return round.remaining.findIndex(l => l === needed);
      })()
    : -1;

  return (
    <div className="py-6 sm:py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Word Scramble</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{diffLabel}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Words</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{solvedCount}/{totalRounds}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-5 justify-center">
        {game.rounds.map((r, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              r.solved
                ? "bg-accent w-6"
                : i === game.currentRound
                ? "bg-primary w-6"
                : "bg-border w-2"
            }`}
          />
        ))}
      </div>

      {round && !game.won && (
        <div className="flex flex-col items-center gap-5">
          {/* Peek: show target word */}
          {game.peeking && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-accent tracking-widest animate-pulse uppercase"
            >
              👁 {round.target}
            </motion.p>
          )}

          {/* Hint text */}
          {game.hintActive && !game.peeking && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-semibold text-primary"
            >
              💡 Next letter highlighted below
            </motion.p>
          )}

          {/* Placed letters (answer area) */}
          <div className="flex flex-wrap justify-center gap-2 min-h-[56px]">
            <AnimatePresence mode="popLayout">
              {round.placed.map((letter, i) => (
                <motion.button
                  key={`placed-${i}-${letter}`}
                  layout
                  initial={{ scale: 0.5, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  onClick={onRemoveLast}
                  title="Remove last letter"
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center border-2 transition-all shadow-md ${
                    round.failed
                      ? "bg-destructive/10 border-destructive/50 text-destructive"
                      : round.solved
                      ? "bg-accent/10 border-accent/50 text-accent"
                      : "bg-primary/10 border-primary/40 text-primary hover:bg-primary/20 active:scale-95"
                  }`}
                >
                  {letter}
                </motion.button>
              ))}
              {/* Empty slots */}
              {Array.from({ length: round.target.length - round.placed.length }).map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  layout
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-dashed border-border bg-muted/30"
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {round.failed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-sm font-bold text-destructive">✗ Not quite! Try again.</p>
                <button
                  onClick={onRetryRound}
                  className="mt-1.5 text-xs font-semibold text-primary hover:text-primary/80 underline"
                >
                  Clear & retry
                </button>
              </motion.div>
            )}
            {round.solved && !game.won && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-bold text-accent"
              >
                ✓ Correct! Next word →
              </motion.p>
            )}
          </AnimatePresence>

          {/* Scrambled letter bank */}
          <div>
            <p className="text-[0.7rem] text-center text-muted-foreground uppercase tracking-widest mb-3">
              Tap letters to spell the word
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <AnimatePresence mode="popLayout">
                {round.remaining.map((letter, i) => {
                  const isHint = i === hintLetterIndex;
                  return (
                    <motion.button
                      key={`rem-${i}-${letter}`}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onPlaceLetter(i)}
                      disabled={round.solved || round.failed}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center border-2 transition-all shadow-md cursor-pointer ${
                        isHint
                          ? "bg-accent text-accent-foreground border-accent shadow-[0_0_16px_hsl(var(--accent)/0.5)] animate-pulse"
                          : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5 active:scale-95"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {letter}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {round.remaining.length === 0 && !round.solved && !round.failed && (
                <p className="text-sm text-muted-foreground">All letters placed!</p>
              )}
            </div>
          </div>

          {/* Remove last button */}
          {round.placed.length > 0 && !round.solved && (
            <button
              onClick={onRemoveLast}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              ← Remove last
            </button>
          )}
        </div>
      )}

      <div className="mt-5 mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && (
        <WinModal
          moves={game.moves}
          time={time}
          difficulty={diffLabel}
          xpGain={xpGain}
          onClose={onMenu}
        />
      )}
    </div>
  );
};

export default WordScrambleGameScreen;

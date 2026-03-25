import { SieveState } from "@/hooks/useSieveGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

interface Props {
  game: SieveState;
  time: string;
  onToggleMark: (index: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const SieveGameScreen = ({ game, time, onToggleMark, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  // Determine grid columns based on limit
  const cols = game.limit <= 30 ? 5 : game.limit <= 50 ? 7 : game.limit <= 100 ? 10 : game.limit <= 200 ? 10 : 15;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Sieve of Eratosthenes</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base text-foreground">{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
              <span className="tabular-nums font-semibold text-base text-foreground">{game.moves}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mb-3">
        Cross out all <span className="font-semibold text-destructive">composite</span> numbers. Leave <span className="font-semibold text-primary">primes</span> unmarked.
      </p>

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Showing solution...</p>
      )}

      <div className="flex justify-center mb-5 overflow-x-auto">
        <div
          className="inline-grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {game.grid.map((num, i) => {
            const isPrime = game.primes[num];
            const isMarked = game.marked[i];
            const isHint = game.hintCell === i;
            const peekCorrect = game.peeking && !isPrime;
            const peekPrime = game.peeking && isPrime;

            return (
              <button
                key={num}
                onClick={() => !game.won && onToggleMark(i)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-xs sm:text-sm font-semibold transition-all border ${
                  game.peeking
                    ? peekCorrect
                      ? "bg-destructive/20 border-destructive/40 text-destructive line-through"
                      : "bg-primary/20 border-primary/40 text-primary"
                    : isMarked
                      ? "bg-destructive/15 border-destructive/30 text-destructive line-through opacity-60"
                      : isHint
                        ? "bg-accent/20 border-accent/50 text-accent ring-2 ring-accent animate-pulse"
                        : "bg-card border-border text-foreground hover:bg-primary/10 hover:border-primary/30"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

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

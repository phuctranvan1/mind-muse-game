import { BabylonianState } from "@/hooks/useBabylonianGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

interface Props {
  game: BabylonianState;
  time: string;
  onSetGuess: (val: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const BabylonianGameScreen = ({ game, time, onSetGuess, onSubmit, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Babylonian Method</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base text-foreground">{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Round</label>
              <span className="tabular-nums font-semibold text-base text-foreground">{game.round + 1}/{game.totalRounds}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <div className="text-center mb-5">
        <p className="text-xs text-muted-foreground mb-2">Find the square root of:</p>
        <div className="text-4xl font-bold text-primary tabular-nums mb-1">√{game.targetNumber}</div>
        <p className="text-[0.65rem] text-muted-foreground">
          Tolerance: ±{game.tolerance} · Score: {game.scores}/{game.totalRounds}
        </p>
      </div>

      {game.peeking && (
        <p className="text-sm text-accent text-center mb-3 font-semibold animate-pulse">
          👁 Answer: {game.targetSqrt.toFixed(6)}
        </p>
      )}

      {game.hintValue !== null && (
        <p className="text-sm text-accent text-center mb-3 font-semibold">
          💡 Try: {game.hintValue}
        </p>
      )}

      {/* Previous guesses */}
      {game.guesses.length > 0 && (
        <div className="mb-4 max-w-xs mx-auto">
          <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1.5 text-center">Guesses</p>
          <div className="space-y-1">
            {game.guesses.map((g, i) => {
              const diff = Math.abs(g - game.targetSqrt);
              const close = diff <= game.tolerance * 5;
              const veryClose = diff <= game.tolerance * 2;
              return (
                <div key={i} className={`flex justify-between items-center px-3 py-1.5 rounded-lg border text-sm ${
                  veryClose ? "bg-accent/10 border-accent/30" : close ? "bg-primary/10 border-primary/30" : "bg-card border-border"
                }`}>
                  <span className="font-mono tabular-nums">{g}</span>
                  <span className={`text-xs font-semibold ${
                    veryClose ? "text-accent" : close ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {veryClose ? "🔥 Very close!" : close ? "Getting warm" : diff > game.targetSqrt * 0.5 ? "Far off" : "Keep going"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      {!game.won && (
        <div className="flex gap-2 max-w-xs mx-auto mb-4">
          <input
            type="number"
            step="any"
            value={game.currentGuess}
            onChange={e => onSetGuess(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your guess..."
            className="flex-1 px-3 py-2.5 rounded-[var(--radius-inner)] bg-card border border-border text-foreground text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
          />
          <button
            onClick={onSubmit}
            className="px-4 py-2.5 rounded-[var(--radius-inner)] bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
          >
            Submit
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

export default BabylonianGameScreen;

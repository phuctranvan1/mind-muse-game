import { useEffect, useCallback } from "react";
import { Game2048State } from "@/hooks/use2048Game";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: Game2048State;
  time: string;
  onSlide: (dir: "up" | "down" | "left" | "right") => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const TILE_COLORS: Record<number, string> = {
  2:    "bg-[#eee4da] text-[#776e65]",
  4:    "bg-[#ede0c8] text-[#776e65]",
  8:    "bg-[#f2b179] text-white",
  16:   "bg-[#f59563] text-white",
  32:   "bg-[#f67c5f] text-white",
  64:   "bg-[#f65e3b] text-white",
  128:  "bg-[#edcf72] text-white",
  256:  "bg-[#edcc61] text-white",
  512:  "bg-[#edc850] text-white",
  1024: "bg-[#edc53f] text-white",
  2048: "bg-[#edc22e] text-white",
  4096: "bg-[#3c3a32] text-white",
  8192: "bg-[#3c3a32] text-white",
};

const DIR_ARROWS: Record<string, string> = {
  left: "←", right: "→", up: "↑", down: "↓",
};

function getTileColor(val: number): string {
  if (val in TILE_COLORS) return TILE_COLORS[val];
  return "bg-primary text-primary-foreground";
}

function getTileFontSize(val: number, size: number): string {
  const digits = String(val).length;
  if (size <= 4) return digits >= 5 ? "text-xs" : digits >= 4 ? "text-sm" : "text-base";
  return digits >= 5 ? "text-[0.6rem]" : digits >= 4 ? "text-xs" : "text-sm";
}

const Game2048Screen = ({
  game, time, onSlide, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark,
}: Props) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (game.won || game.lost) return;
    const map: Record<string, "up" | "down" | "left" | "right"> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right",
    };
    const dir = map[e.key];
    if (dir) { e.preventDefault(); onSlide(dir); }
  }, [game.won, game.lost, onSlide]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const cellSize = game.size <= 4 ? "w-16 h-16" : game.size <= 5 ? "w-12 h-12" : "w-10 h-10";

  const moveLimitPct = game.moveLimit ? (game.moves / game.moveLimit) : 0;
  const nearLimit = moveLimitPct >= 0.8;

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">2048</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {game.difficulty} · target {game.target.toLocaleString()}
          </span>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">Score</label>
            <span className="tabular-nums font-semibold text-base text-foreground">{game.score.toLocaleString()}</span>
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">Best</label>
            <span className="tabular-nums font-semibold text-base text-foreground">{game.bestScore.toLocaleString()}</span>
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">Time</label>
            <span className="tabular-nums font-semibold text-base text-foreground">{time}</span>
          </div>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      {/* Move limit bar */}
      {game.moveLimit !== null && (
        <div className="mb-3">
          <div className="flex justify-between text-[0.65rem] text-muted-foreground mb-1">
            <span>Moves: {game.moves}</span>
            <span className={nearLimit ? "text-destructive font-semibold" : ""}>
              Limit: {game.moveLimit}
            </span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${nearLimit ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${Math.min(moveLimitPct * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Hint indicator */}
      {game.hintDir && (
        <div className="text-center mb-2">
          <span className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/30">
            Hint: slide {DIR_ARROWS[game.hintDir]} {game.hintDir}
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="flex justify-center mb-4">
        <div
          className="inline-grid gap-2 p-2 rounded-xl bg-muted/60"
          style={{ gridTemplateColumns: `repeat(${game.size}, 1fr)` }}
        >
          {game.grid.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`${cellSize} flex items-center justify-center rounded-lg font-extrabold transition-all duration-150 shadow-sm ${
                  val ? getTileColor(val) : "bg-muted/80"
                }`}
              >
                {val !== null && (
                  <span className={getTileFontSize(val, game.size)}>
                    {val.toLocaleString()}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Direction buttons for touch/click */}
      <div className="flex flex-col items-center gap-1 mb-4">
        <button
          onClick={() => onSlide("up")}
          className="w-12 h-8 flex items-center justify-center rounded-lg bg-card border border-border hover:bg-primary/10 text-lg font-bold transition-colors"
        >↑</button>
        <div className="flex gap-1">
          <button
            onClick={() => onSlide("left")}
            className="w-12 h-8 flex items-center justify-center rounded-lg bg-card border border-border hover:bg-primary/10 text-lg font-bold transition-colors"
          >←</button>
          <button
            onClick={() => onSlide("down")}
            className="w-12 h-8 flex items-center justify-center rounded-lg bg-card border border-border hover:bg-primary/10 text-lg font-bold transition-colors"
          >↓</button>
          <button
            onClick={() => onSlide("right")}
            className="w-12 h-8 flex items-center justify-center rounded-lg bg-card border border-border hover:bg-primary/10 text-lg font-bold transition-colors"
          >→</button>
        </div>
      </div>

      {game.won && (
        <div className="text-center mb-3">
          <p className="text-primary font-bold text-lg">🎉 You reached {game.target.toLocaleString()}!</p>
        </div>
      )}
      {game.lost && (
        <div className="text-center mb-3">
          <p className="text-destructive font-bold text-lg">😞 No more moves! Score: {game.score.toLocaleString()}</p>
        </div>
      )}
      {!game.won && !game.lost && (
        <p className="text-center text-xs text-muted-foreground mb-3">
          Use arrow keys or buttons to slide tiles. Merge same numbers to reach {game.target.toLocaleString()}!
        </p>
      )}

      <div className="mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          Restart
        </button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          Menu
        </button>
      </div>
    </div>
  );
};

export default Game2048Screen;

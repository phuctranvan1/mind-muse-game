import { NQueensState } from "@/hooks/useNQueensGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: NQueensState;
  onToggleQueen: (row: number, col: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const NQueensGameScreen = ({ game, onToggleQueen, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const placed = game.queens.filter(q => q !== null).length;
  const cellSize = game.boardSize <= 6 ? "w-12 h-12" : game.boardSize <= 8 ? "w-10 h-10" : "w-8 h-8";
  const fontSize = game.boardSize <= 6 ? "text-xl" : game.boardSize <= 8 ? "text-lg" : "text-sm";
  const displayQueens = game.peeking && game.solution ? game.solution : game.queens;

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">N-Queens</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty} · {game.boardSize}×{game.boardSize}</span>
        </div>
        <div>
          <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Placed</label>
          <span className="tabular-nums font-semibold text-lg text-foreground">{placed}/{game.boardSize}</span>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Peeking at solution...</p>
      )}

      <div className="flex justify-center mb-6">
        <div
          className="inline-grid border-2 border-foreground/30 rounded-lg overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${game.boardSize}, 1fr)` }}
        >
          {Array.from({ length: game.boardSize }, (_, row) =>
            Array.from({ length: game.boardSize }, (_, col) => {
              const hasQueen = displayQueens[row] === col;
              const isConflict = !game.peeking && game.conflicts.has(row) && hasQueen;
              const isDark = (row + col) % 2 === 1;
              const isHint = game.hintQueen?.[0] === row && game.hintQueen?.[1] === col;

              return (
                <button
                  key={`${row}-${col}`}
                  onClick={() => onToggleQueen(row, col)}
                  className={`${cellSize} ${fontSize} flex items-center justify-center font-bold transition-all border border-border/50 ${
                    isDark ? "bg-muted/60" : "bg-card"
                  } ${
                    isHint
                      ? "bg-accent/30 text-accent animate-pulse"
                      : isConflict
                      ? "bg-destructive/20 text-destructive"
                      : hasQueen
                      ? game.peeking ? "text-accent" : "text-primary"
                      : "hover:bg-primary/10"
                  }`}
                >
                  {hasQueen ? "♛" : isHint ? "◇" : ""}
                </button>
              );
            })
          )}
        </div>
      </div>

      {game.won && (
        <div className="text-center mb-4">
          <p className="text-primary font-bold text-lg">🎉 All Queens Placed!</p>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mb-4">
        Place {game.boardSize} queens so no two attack each other
      </p>

      <div className="mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
    </div>
  );
};

export default NQueensGameScreen;

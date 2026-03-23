import { NQueensState } from "@/hooks/useNQueensGame";
import DarkModeToggle from "./DarkModeToggle";

interface Props {
  game: NQueensState;
  onToggleQueen: (row: number, col: number) => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const NQueensGameScreen = ({ game, onToggleQueen, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const placed = game.queens.filter(q => q !== null).length;
  const cellSize = game.boardSize <= 6 ? "w-12 h-12" : game.boardSize <= 8 ? "w-10 h-10" : "w-8 h-8";
  const fontSize = game.boardSize <= 6 ? "text-xl" : game.boardSize <= 8 ? "text-lg" : "text-sm";

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

      <div className="flex justify-center mb-6">
        <div
          className="inline-grid border-2 border-foreground/30 rounded-lg overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${game.boardSize}, 1fr)` }}
        >
          {Array.from({ length: game.boardSize }, (_, row) =>
            Array.from({ length: game.boardSize }, (_, col) => {
              const hasQueen = game.queens[row] === col;
              const isConflict = game.conflicts.has(row) && hasQueen;
              const isDark = (row + col) % 2 === 1;

              return (
                <button
                  key={`${row}-${col}`}
                  onClick={() => onToggleQueen(row, col)}
                  className={`${cellSize} ${fontSize} flex items-center justify-center font-bold transition-all border border-border/50 ${
                    isDark ? "bg-muted/60" : "bg-card"
                  } ${isConflict ? "bg-destructive/20 text-destructive" : hasQueen ? "text-primary" : "hover:bg-primary/10"}`}
                >
                  {hasQueen ? "♛" : ""}
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

      <div className="flex justify-center gap-6">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
    </div>
  );
};

export default NQueensGameScreen;

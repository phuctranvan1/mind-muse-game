import { SudokuState } from "@/hooks/useSudokuGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: SudokuState;
  time: string;
  onSelectCell: (row: number, col: number) => void;
  onEnterNumber: (num: number) => void;
  onClear: () => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const SudokuGameScreen = ({ game, time, onSelectCell, onEnterNumber, onClear, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const blockSize = game.size === 4 ? 2 : 3;
  const cellSize = game.size === 4 ? "w-14 h-14 text-xl" : "w-9 h-9 text-sm";
  const displayGrid = game.peeking ? game.solution : game.playerGrid;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Sudoku</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base text-foreground">{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Errors</label>
              <span className={`tabular-nums font-semibold text-base ${game.mistakes > 0 ? "text-destructive" : "text-foreground"}`}>{game.mistakes}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Peeking at solution...</p>
      )}

      <div className="flex justify-center mb-5 sm:mb-6 overflow-x-auto">
        <div className="touch-none">
          <div
            className="inline-grid border-2 border-foreground/40 rounded-lg overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${game.size}, 1fr)` }}
          >
            {displayGrid.map((row, ri) =>
              row.map((val, ci) => {
                const isSelected = game.selectedCell?.[0] === ri && game.selectedCell?.[1] === ci;
                const isFixed = game.fixedCells[ri][ci];
                const isWrong = !game.peeking && val !== 0 && val !== game.solution[ri][ci];
                const borderRight = (ci + 1) % blockSize === 0 && ci < game.size - 1 ? "border-r-2 border-r-foreground/30" : "border-r border-r-border";
                const borderBottom = (ri + 1) % blockSize === 0 && ri < game.size - 1 ? "border-b-2 border-b-foreground/30" : "border-b border-b-border";

                return (
                  <button
                    key={`${ri}-${ci}`}
                    onClick={() => onSelectCell(ri, ci)}
                    className={`${cellSize} flex items-center justify-center font-semibold transition-all ${borderRight} ${borderBottom} ${
                      isSelected ? "bg-primary/20 ring-2 ring-primary" : isFixed ? "bg-muted/50" : "bg-card hover:bg-primary/10"
                    } ${isWrong ? "text-destructive" : isFixed ? "text-foreground" : game.peeking ? "text-accent" : "text-primary"}`}
                  >
                    {val !== 0 ? val : ""}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mb-4 flex-wrap max-w-xs mx-auto">
        {Array.from({ length: game.size }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            onClick={() => onEnterNumber(num)}
            className="w-9 h-9 rounded-lg bg-card border border-border text-foreground font-bold hover:bg-primary/20 hover:border-primary/40 transition-all text-sm"
          >
            {num}
          </button>
        ))}
        <button
          onClick={onClear}
          className="w-9 h-9 rounded-lg bg-card border border-border text-muted-foreground font-bold hover:bg-destructive/20 transition-all text-xs"
        >
          ✕
        </button>
      </div>

      {game.won && (
        <div className="text-center mb-4">
          <p className="text-primary font-bold text-lg">🎉 Puzzle Solved!</p>
        </div>
      )}

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

export default SudokuGameScreen;

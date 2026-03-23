import { KnightTourState } from "@/hooks/useKnightTourGame";
import DarkModeToggle from "./DarkModeToggle";

interface Props {
  game: KnightTourState;
  time: string;
  onSelectCell: (row: number, col: number) => void;
  onUndo: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const KnightTourGameScreen = ({ game, time, onSelectCell, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const totalCells = game.boardSize * game.boardSize;
  const cellSize = game.boardSize <= 5 ? "w-12 h-12" : game.boardSize <= 6 ? "w-10 h-10" : "w-8 h-8";
  const fontSize = game.boardSize <= 6 ? "text-sm" : "text-xs";
  const currentPos = game.path.length > 0 ? game.path[game.path.length - 1] : null;

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Knight's Tour</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty} · {game.boardSize}×{game.boardSize}</span>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
            <span className="tabular-nums font-semibold text-lg text-foreground">{time}</span>
          </div>
          <div>
            <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Visited</label>
            <span className="tabular-nums font-semibold text-lg text-foreground">{game.path.length}/{totalCells}</span>
          </div>
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
              const isVisited = game.visited[row][col];
              const isCurrent = currentPos?.[0] === row && currentPos?.[1] === col;
              const isValidMove = game.validMoves.some(([r, c]) => r === row && c === col);
              const isDarkCell = (row + col) % 2 === 1;
              const moveIndex = game.path.findIndex(([r, c]) => r === row && c === col);

              return (
                <button
                  key={`${row}-${col}`}
                  onClick={() => onSelectCell(row, col)}
                  className={`${cellSize} ${fontSize} flex items-center justify-center font-bold transition-all border border-border/50 ${
                    isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary"
                      : isVisited
                      ? "bg-primary/20 text-primary/70"
                      : isValidMove
                      ? "bg-accent/20 border-accent/50 hover:bg-accent/30 animate-pulse"
                      : isDarkCell
                      ? "bg-muted/60"
                      : "bg-card"
                  } ${!isVisited && game.path.length === 0 ? "hover:bg-primary/10 cursor-pointer" : ""}`}
                >
                  {isCurrent ? "♞" : isVisited ? moveIndex + 1 : isValidMove ? "·" : ""}
                </button>
              );
            })
          )}
        </div>
      </div>

      {game.won && (
        <div className="text-center mb-4">
          <p className="text-primary font-bold text-lg">🎉 Complete Tour!</p>
        </div>
      )}
      {game.stuck && !game.won && (
        <div className="text-center mb-4">
          <p className="text-destructive font-semibold">No valid moves! Try undoing.</p>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mb-4">
        {game.path.length === 0 ? "Click any cell to place the knight" : "Visit every cell with knight moves"}
      </p>

      <div className="flex justify-center gap-6">
        {game.path.length > 0 && (
          <button onClick={onUndo} className="text-sm font-semibold text-accent hover:brightness-110 transition-all">Undo</button>
        )}
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
    </div>
  );
};

export default KnightTourGameScreen;

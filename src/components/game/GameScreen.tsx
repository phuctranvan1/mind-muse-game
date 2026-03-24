import { GameState } from "@/hooks/useShiftGame";
import PuzzleGrid from "./PuzzleGrid";
import DarkModeToggle from "./DarkModeToggle";
import { Progress } from "@/components/ui/progress";
import PowerUpButtons from "./PowerUpButtons";

interface GameScreenProps {
  game: GameState;
  time: string;
  difficultyLabel: string;
  onMoveTile: (index: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const GameScreen = ({ game, time, difficultyLabel, onMoveTile, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: GameScreenProps) => {
  const movePct = game.moveLimit ? Math.min((game.moves / game.moveLimit) * 100, 100) : null;
  const isLow = movePct !== null && movePct > 80;

  // When peeking, show the solved state
  const displayTiles = game.peeking
    ? Array.from({ length: game.gridSize * game.gridSize }, (_, i) => i < game.gridSize * game.gridSize - 1 ? i + 1 : null)
    : game.tiles;

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Shift</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{difficultyLabel}</span>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex gap-6">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
              <span className={`tabular-nums font-semibold text-lg ${isLow ? 'text-danger' : 'text-foreground'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {game.moves}{game.moveLimit ? `/${game.moveLimit}` : ''}
              </span>
            </div>
          </div>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      {movePct !== null && (
        <div className="mb-4">
          <Progress value={100 - movePct} className={`h-1.5 ${isLow ? '[&>div]:bg-danger' : '[&>div]:bg-primary'}`} />
        </div>
      )}

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Peeking at solution...</p>
      )}

      <PuzzleGrid tiles={displayTiles} gridSize={game.gridSize} hintTile={game.hintTile} onTileClick={onMoveTile} />

      {game.lost && (
        <div className="mt-4 text-center">
          <p className="text-danger font-semibold text-lg">Out of moves!</p>
          <p className="text-sm text-muted-foreground mt-1">Try again or pick a different difficulty.</p>
        </div>
      )}

      <div className="mt-4 mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
    </div>
  );
};

export default GameScreen;

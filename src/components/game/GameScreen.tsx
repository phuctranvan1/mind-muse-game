import { GameState } from "@/hooks/useShiftGame";
import PuzzleGrid from "./PuzzleGrid";
import DarkModeToggle from "./DarkModeToggle";

interface GameScreenProps {
  game: GameState;
  time: string;
  difficultyLabel: string;
  onMoveTile: (index: number) => void;
  onHint: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const GameScreen = ({ game, time, difficultyLabel, onMoveTile, onHint, onRestart, onMenu, dark, onToggleDark }: GameScreenProps) => {
  return (
    <div className="py-8">
      {/* Header */}
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
            <span className="tabular-nums font-semibold text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.moves}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <PuzzleGrid tiles={game.tiles} gridSize={game.gridSize} hintTile={game.hintTile} onTileClick={onMoveTile} />

      {/* Controls */}
      <div className="flex justify-center gap-6 mt-6">
        <button onClick={onHint} className="text-sm font-semibold text-accent hover:brightness-110 transition-all">
          Hint
        </button>
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

export default GameScreen;

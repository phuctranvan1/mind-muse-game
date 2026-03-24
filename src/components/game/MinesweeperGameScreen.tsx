import { useState } from "react";
import { MinesweeperState } from "@/hooks/useMinesweeperGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: MinesweeperState;
  time: string;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const NUMBER_COLORS = ["", "text-blue-500", "text-green-500", "text-red-500", "text-purple-700",
  "text-red-700", "text-cyan-600", "text-black", "text-gray-500"];

const MinesweeperGameScreen = ({
  game, time, onReveal, onFlag, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark,
}: Props) => {
  const [flagMode, setFlagMode] = useState(false);

  const cellSize = game.cols <= 8 ? "w-9 h-9 text-sm" :
    game.cols <= 12 ? "w-7 h-7 text-xs" :
    game.cols <= 16 ? "w-6 h-6 text-[0.6rem]" : "w-5 h-5 text-[0.55rem]";

  const handleCellClick = (row: number, col: number) => {
    if (flagMode) {
      onFlag(row, col);
    } else {
      onReveal(row, col);
    }
  };

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    onFlag(row, col);
  };

  const minesLeft = game.mines - game.flagsPlaced;

  return (
    <div className="py-5 sm:py-6">
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Minesweeper</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {game.difficulty} · {game.rows}×{game.cols}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-2 sm:gap-3">
            <div>
              <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-sm text-foreground">{time}</span>
            </div>
            <div>
              <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">💣</label>
              <span className={`tabular-nums font-semibold text-sm ${minesLeft < 0 ? "text-destructive" : "text-foreground"}`}>
                {minesLeft}
              </span>
            </div>
            <div>
              <label className="block text-[0.65rem] uppercase text-muted-foreground mb-0.5">Safe</label>
              <span className="tabular-nums font-semibold text-sm text-foreground">
                {game.revealedCount}/{game.totalSafe}
              </span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {/* Flag mode toggle */}
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setFlagMode(f => !f)}
          className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all ${
            flagMode
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {flagMode ? "🚩 Flag Mode ON" : "🖱 Reveal Mode"}
        </button>
      </div>

      {/* Grid */}
      <div className="flex justify-center mb-4 overflow-x-auto">
        <div
          className="inline-grid border-2 border-foreground/20 rounded-lg overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${game.cols}, 1fr)` }}
        >
          {game.grid.map((row, r) =>
            row.map((cell, c) => {
              const isHint = game.hintCell?.[0] === r && game.hintCell?.[1] === c;
              const isPeek = game.peeking && cell.isMine && !cell.isRevealed;

              let cellClass = "";
              let content: React.ReactNode = "";

              if (cell.isRevealed) {
                if (cell.isMine) {
                  cellClass = game.lost ? "bg-destructive/80" : "bg-destructive/60";
                  content = "💣";
                } else {
                  cellClass = "bg-background";
                  if (cell.neighborCount > 0) {
                    content = (
                      <span className={`font-bold ${NUMBER_COLORS[cell.neighborCount] ?? ""}`}>
                        {cell.neighborCount}
                      </span>
                    );
                  }
                }
              } else if (cell.isFlagged) {
                cellClass = "bg-card hover:bg-card/80";
                content = "🚩";
              } else if (isHint) {
                cellClass = "bg-accent/30 ring-2 ring-accent animate-pulse";
                content = "★";
              } else if (isPeek) {
                cellClass = "bg-destructive/20";
                content = "💣";
              } else {
                cellClass = "bg-muted hover:bg-muted/70 cursor-pointer";
                content = "";
              }

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleCellRightClick(e, r, c)}
                  disabled={game.won || game.lost || cell.isRevealed}
                  className={`${cellSize} flex items-center justify-center border border-border/30 transition-all ${cellClass}`}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>
      </div>

      {game.won && (
        <div className="text-center mb-3">
          <p className="text-primary font-bold text-lg">🎉 You cleared the minefield!</p>
        </div>
      )}
      {game.lost && (
        <div className="text-center mb-3">
          <p className="text-destructive font-bold text-lg">💥 Boom! Hit a mine!</p>
        </div>
      )}
      {!game.won && !game.lost && (
        <p className="text-center text-xs text-muted-foreground mb-3">
          {game.firstClick ? "Click any cell to start — first click is always safe" : "Right-click or use Flag Mode to mark mines"}
        </p>
      )}

      <div className="mb-2">
        <PowerUpButtons
          onHint={!game.won && !game.lost && !game.firstClick ? onHint : undefined}
          onUndo={game.lost ? onUndo : undefined}
          onPeek={!game.won && !game.lost ? onPeek : undefined}
        />
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

export default MinesweeperGameScreen;

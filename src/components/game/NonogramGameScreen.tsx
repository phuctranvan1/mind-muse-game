import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { NonogramState, CellState } from "@/hooks/useNonogramGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import PowerUpButtons from "./PowerUpButtons";
import { XPGain } from "@/hooks/useXPSystem";

interface Props {
  game: NonogramState;
  time: string;
  onToggleCell: (row: number, col: number, markMode?: boolean) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
  xpGain?: XPGain | null;
}

const DIFF_LABELS: Record<string, string> = {
  easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert",
  master: "Master", grandmaster: "Grandmaster", genius: "Genius",
  legend: "Legend", mythic: "Mythic", immortal: "Immortal", divine: "Divine",
};

const NonogramGameScreen = ({
  game, time, onToggleCell, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark, xpGain,
}: Props) => {
  const [markMode, setMarkMode] = useState(false);
  const diffLabel = DIFF_LABELS[game.difficulty] ?? game.difficulty;

  // Compute cell size based on grid size
  const maxGridPx = 560;
  const cellPx = Math.max(22, Math.floor(maxGridPx / game.size));
  const clueFontSize = Math.max(9, Math.min(13, Math.floor(cellPx * 0.6)));
  const clueLineH = clueFontSize + 5;
  const maxColClueCount = Math.max(1, ...game.colClues.map(c => c.length));
  const maxRowClueCount = Math.max(1, ...game.rowClues.map(r => r.length));
  const colClueAreaH = Math.max(40, maxColClueCount * clueLineH + 10);
  const rowClueAreaW = Math.max(40, maxRowClueCount * (clueFontSize * 0.7 + 6) + 6);

  const handleCellClick = useCallback((r: number, c: number) => {
    onToggleCell(r, c, markMode);
  }, [onToggleCell, markMode]);

  const displayGrid = game.peeking ? game.solution : null;

  return (
    <div className="py-6 sm:py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Nonogram</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{diffLabel} · {game.size}×{game.size}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.moves}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mb-3">
        Fill cells to match row &amp; column clues. Numbers = consecutive filled groups.
      </p>

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Showing solution...</p>
      )}

      {/* Mark mode toggle */}
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setMarkMode(m => !m)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            markMode
              ? "bg-destructive/15 border-destructive/40 text-destructive"
              : "bg-primary/10 border-primary/30 text-primary"
          }`}
        >
          {markMode ? "✗ Mark mode (X)" : "■ Fill mode"}
        </button>
        {game.mistakes > 0 && (
          <span className="ml-3 text-xs font-semibold text-destructive self-center">
            {game.mistakes} mistake{game.mistakes > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Nonogram grid with clues */}
      <div className="overflow-auto pb-2">
        <div
          className="mx-auto"
          style={{ display: "grid", gridTemplateColumns: `${rowClueAreaW}px repeat(${game.size}, ${cellPx}px)`, gridTemplateRows: `${colClueAreaH}px repeat(${game.size}, ${cellPx}px)`, gap: 1 }}
        >
          {/* Top-left empty corner */}
          <div style={{ gridColumn: "1", gridRow: "1" }} />

          {/* Column clues */}
          {game.colClues.map((clue, c) => (
            <div
              key={`col-${c}`}
              style={{ gridColumn: c + 2, gridRow: 1 }}
              className="flex flex-col items-center justify-end pb-1 gap-0"
            >
              {clue.map((n, i) => (
                <span
                  key={i}
                  className="text-foreground font-bold leading-none"
                  style={{ fontSize: clueFontSize, lineHeight: `${clueLineH}px` }}
                >
                  {n}
                </span>
              ))}
            </div>
          ))}

          {/* Rows */}
          {game.grid.map((row, r) => (
            <React.Fragment key={`row-${r}`}>
              {/* Row clue */}
              <div
                style={{ gridColumn: 1, gridRow: r + 2 }}
                className="flex items-center justify-end pr-1.5 gap-0.5"
              >
                {game.rowClues[r].map((n, i) => (
                  <span
                    key={i}
                    className="text-foreground font-bold"
                    style={{ fontSize: clueFontSize }}
                  >
                    {n}
                  </span>
                ))}
              </div>

              {/* Cells */}
              {row.map((cell, c) => {
                const isHint = game.hintCell?.[0] === r && game.hintCell?.[1] === c;
                const peekFilled = displayGrid ? displayGrid[r][c] : false;
                const displayCell: CellState = displayGrid
                  ? (peekFilled ? "filled" : "empty")
                  : cell;

                return (
                  <motion.button
                    key={`${r}-${c}`}
                    style={{ gridColumn: c + 2, gridRow: r + 2, width: cellPx, height: cellPx }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleCellClick(r, c)}
                    className={`rounded-sm border transition-colors duration-100 touch-manipulation ${
                      isHint
                        ? "bg-accent/70 border-accent animate-pulse"
                        : displayCell === "filled"
                        ? "bg-foreground border-foreground"
                        : displayCell === "marked"
                        ? "bg-muted/50 border-border"
                        : "bg-card border-border hover:bg-muted/30"
                    }`}
                  >
                    {displayCell === "marked" && (
                      <span
                        className="text-muted-foreground font-bold flex items-center justify-center"
                        style={{ fontSize: Math.max(7, cellPx * 0.55), lineHeight: 1 }}
                      >
                        ✗
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-4 mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && (
        <WinModal
          moves={game.moves}
          time={time}
          difficulty={diffLabel}
          xpGain={xpGain}
          onClose={onMenu}
        />
      )}
    </div>
  );
};

export default NonogramGameScreen;

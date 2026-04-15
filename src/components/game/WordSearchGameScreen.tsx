import { useState } from "react";
import { motion } from "framer-motion";
import { WordSearchState, WordInGrid } from "@/hooks/useWordSearchGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

interface Props {
  game: WordSearchState; time: string;
  onSelectCell: (r: number, c: number) => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

function getCellsInWord(w: WordInGrid): Set<number> {
  const cells = new Set<number>();
  for (let i = 0; i < w.word.length; i++) {
    cells.add((w.startRow + i * w.dirRow) * 100 + (w.startCol + i * w.dirCol));
  }
  return cells;
}

const WordSearchGameScreen = ({ game, time, onSelectCell, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const progress = (game.words.filter(w => w.found).length / game.words.length) * 100;
  const cellSize = Math.min(36, Math.floor(320 / game.gridSize));

  const foundCells = new Set<number>();
  for (const w of game.words) if (w.found) for (const c of getCellsInWord(w)) foundCells.add(c);

  const peekCells = game.peeking ? (() => {
    const s = new Set<number>();
    for (const w of game.words) if (!w.found) for (const c of getCellsInWord(w)) s.add(c);
    return s;
  })() : new Set<number>();

  const selectionKey = game.selection ? game.selection.row * 100 + game.selection.col : -1;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Word Search</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Found</label><span className="tabular-nums font-semibold text-base">{game.words.filter(w=>w.found).length}/{game.words.length}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>
      <Progress value={progress} className="h-1.5 mb-4 [&>div]:bg-primary" />

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4">
        {game.hintText && <p className="text-accent text-xs font-semibold mb-3 text-center">💡 {game.hintText}</p>}
        <p className="text-xs text-muted-foreground text-center mb-2">Click start then end of a word to select</p>

        <div className="flex justify-center mb-4">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${game.gridSize}, ${cellSize}px)` }}>
            {game.grid.map((row, r) =>
              row.map((letter, c) => {
                const key = r * 100 + c;
                const isFound = foundCells.has(key);
                const isPeek = peekCells.has(key);
                const isSelected = selectionKey === key;
                return (
                  <motion.button
                    key={`${r}-${c}`}
                    onClick={() => onSelectCell(r, c)}
                    whileTap={{ scale: 0.85 }}
                    style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.45 }}
                    className={`flex items-center justify-center rounded font-bold font-mono transition-all border
                      ${isFound ? "bg-accent/70 text-accent-foreground border-accent" :
                        isSelected ? "bg-primary text-primary-foreground border-primary" :
                        isPeek ? "bg-yellow-400/50 text-foreground border-yellow-400" :
                        "bg-card text-foreground border-border hover:bg-muted"}`}
                  >
                    {letter}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {game.words.map((w, i) => (
            <span key={i} className={`px-2 py-1 text-xs font-mono font-bold rounded border ${w.found ? "bg-accent/20 text-accent border-accent/40 line-through" : "bg-card text-foreground border-border"}`}>
              {w.word}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default WordSearchGameScreen;

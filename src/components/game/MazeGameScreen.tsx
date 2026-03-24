import { useEffect } from "react";
import { motion } from "framer-motion";
import { MazeState } from "@/hooks/useMazeGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: MazeState;
  time: string;
  onMove: (dr: number, dc: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const DIFF_LABELS: Record<string, string> = {
  easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert",
  master: "Master", grandmaster: "Grandmaster", genius: "Genius",
};

const MazeGameScreen = ({ game, time, onMove, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = {
        ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
        w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1],
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); onMove(dir[0], dir[1]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onMove]);

  const cellSize = Math.max(10, Math.min(28, Math.floor(300 / game.rows)));

  const peekPath = game.peeking ? (() => {
    // BFS solution path cells
    const visited = new Set<string>();
    const queue: { r: number; c: number; path: [number, number][] }[] = [{ r: 0, c: 0, path: [] }];
    visited.add("0,0");
    let solutionCells = new Set<string>();
    while (queue.length > 0) {
      const { r, c, path } = queue.shift()!;
      const np = [...path, [r, c] as [number, number]];
      if (r === game.endRow && c === game.endCol) {
        np.forEach(([pr, pc]) => solutionCells.add(`${pr},${pc}`));
        break;
      }
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols && game.grid[nr][nc] && !visited.has(`${nr},${nc}`)) {
          visited.add(`${nr},${nc}`);
          queue.push({ r: nr, c: nc, path: np });
        }
      }
    }
    return solutionCells;
  })() : null;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Maze</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{DIFF_LABELS[game.difficulty]}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
              <span className="tabular-nums font-semibold text-base text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.moves}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 text-center">
        Navigate from <span className="font-semibold text-primary">Start</span> to <span className="font-semibold text-accent">Finish</span>. Use arrow keys or the D-pad below.
      </p>

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Peeking — solution path highlighted!</p>
      )}

      {/* Maze grid */}
      <div className="overflow-auto flex justify-center mb-4">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${game.cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${game.rows}, ${cellSize}px)`,
            gap: 0,
          }}
        >
          {Array.from({ length: game.rows }, (_, r) =>
            Array.from({ length: game.cols }, (_, c) => {
              const isPlayer = r === game.playerRow && c === game.playerCol;
              const isEnd = r === game.endRow && c === game.endCol;
              const isHint = game.hintCell?.[0] === r && game.hintCell?.[1] === c;
              const isPassage = game.grid[r][c];
              const isVisited = game.visitedPath.has(`${r},${c}`);
              const isSolutionPath = peekPath?.has(`${r},${c}`);

              let bg = "#1a1a2e"; // wall dark
              if (!dark && !isPassage) bg = "#d1d5db"; // wall light
              if (isPassage) bg = dark ? "#2d2d44" : "#f9fafb";
              if (isVisited && isPassage) bg = dark ? "#3d3a5c" : "#ede9fe";
              if (isSolutionPath) bg = dark ? "#7c3aed44" : "#ddd6fe";
              if (isHint) bg = "#f97316";
              if (isEnd) bg = dark ? "#059669" : "#10b981";
              if (isPlayer) bg = "#7c3aed";

              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: cellSize > 16 ? cellSize * 0.6 : 0,
                    transition: "background 0.1s",
                  }}
                >
                  {isPlayer ? "●" : isEnd ? "★" : ""}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* D-pad controls */}
      <div className="flex flex-col items-center gap-1 mb-4">
        <button
          onClick={() => onMove(-1, 0)}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-card border border-border shadow-sm hover:bg-primary/10 active:scale-95 text-lg font-bold transition-all"
        >▲</button>
        <div className="flex gap-1">
          <button
            onClick={() => onMove(0, -1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-card border border-border shadow-sm hover:bg-primary/10 active:scale-95 text-lg font-bold transition-all"
          >◀</button>
          <div className="w-10 h-10" />
          <button
            onClick={() => onMove(0, 1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-card border border-border shadow-sm hover:bg-primary/10 active:scale-95 text-lg font-bold transition-all"
          >▶</button>
        </div>
        <button
          onClick={() => onMove(1, 0)}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-card border border-border shadow-sm hover:bg-primary/10 active:scale-95 text-lg font-bold transition-all"
        >▼</button>
      </div>

      <div className="mt-2 mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} onClose={onMenu} />}
    </div>
  );
};

export default MazeGameScreen;

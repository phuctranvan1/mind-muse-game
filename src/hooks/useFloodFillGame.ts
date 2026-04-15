import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

interface FloodFillConfig {
  size: number;
  colors: number;
  maxMoves: number;
}

const CONFIGS: Record<Difficulty, FloodFillConfig> = {
  easy:        { size: 6,  colors: 3, maxMoves: 15 },
  medium:      { size: 7,  colors: 4, maxMoves: 16 },
  hard:        { size: 8,  colors: 4, maxMoves: 17 },
  expert:      { size: 9,  colors: 5, maxMoves: 18 },
  master:      { size: 10, colors: 5, maxMoves: 20 },
  grandmaster: { size: 11, colors: 6, maxMoves: 22 },
  genius:      { size: 12, colors: 6, maxMoves: 24 },
  legend:      { size: 12, colors: 6, maxMoves: 20 },
  mythic:      { size: 13, colors: 7, maxMoves: 22 },
  immortal:    { size: 13, colors: 7, maxMoves: 20 },
  divine:      { size: 14, colors: 7, maxMoves: 22 },
};

export const FLOOD_COLORS = ["#ef4444","#3b82f6","#22c55e","#f59e0b","#a855f7","#ec4899","#14b8a6"];

function generateGrid(size: number, colors: number, rand: () => number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(rand() * colors))
  );
}

function floodFillBFS(grid: number[][], size: number, newColor: number): number[][] {
  const currentColor = grid[0][0];
  if (currentColor === newColor) return grid;
  const newGrid = grid.map(row => [...row]);
  const queue: [number, number][] = [[0, 0]];
  const visited = new Set<number>([0]);
  while (queue.length) {
    const [r, c] = queue.shift()!;
    newGrid[r][c] = newColor;
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size || visited.has(nr * size + nc)) continue;
      if (grid[nr][nc] === currentColor) {
        visited.add(nr * size + nc);
        queue.push([nr, nc]);
      }
    }
  }
  return newGrid;
}

function isComplete(grid: number[][]): boolean {
  const first = grid[0][0];
  return grid.every(row => row.every(c => c === first));
}

export interface FloodFillState {
  grid: number[][];
  size: number;
  colors: number;
  maxMoves: number;
  movesLeft: number;
  won: boolean;
  lost: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
}

export function useFloodFillGame() {
  const [game, setGame] = useState<FloodFillState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const grid = generateGrid(cfg.size, cfg.colors, rand);
    setGame({ grid, size: cfg.size, colors: cfg.colors, maxMoves: cfg.maxMoves, movesLeft: cfg.maxMoves, won: false, lost: false, moves: 0, difficulty, hintText: null, peeking: false });
  }, []);

  const fill = useCallback((colorIdx: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (prev.grid[0][0] === colorIdx) return prev;
      const newGrid = floodFillBFS(prev.grid, prev.size, colorIdx);
      const won = isComplete(newGrid);
      const newMovesLeft = prev.movesLeft - 1;
      const lost = !won && newMovesLeft <= 0;
      return { ...prev, grid: newGrid, movesLeft: newMovesLeft, won, lost, moves: prev.moves + 1, hintText: null };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      // Count cells by color adjacent to current region
      const currentColor = prev.grid[0][0];
      const regionCells = new Set<number>();
      const queue: [number, number][] = [[0, 0]];
      regionCells.add(0);
      while (queue.length) {
        const [r, c] = queue.shift()!;
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= prev.size || nc < 0 || nc >= prev.size || regionCells.has(nr * prev.size + nc)) continue;
          if (prev.grid[nr][nc] === currentColor) { regionCells.add(nr * prev.size + nc); queue.push([nr, nc]); }
        }
      }
      const colorCounts: Record<number, number> = {};
      for (const idx of regionCells) {
        const r = Math.floor(idx / prev.size), c = idx % prev.size;
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= prev.size || nc < 0 || nc >= prev.size || regionCells.has(nr * prev.size + nc)) continue;
          const adj = prev.grid[nr][nc];
          colorCounts[adj] = (colorCounts[adj] ?? 0) + 1;
        }
      }
      const best = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0];
      if (best) return { ...prev, hintText: `Color ${Number(best[0]) + 1} has the most adjacent cells!` };
      return { ...prev, hintText: "Fill towards the largest cluster of the same color" };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 2000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const grid = generateGrid(cfg.size, cfg.colors, Math.random);
      return { ...prev, grid, movesLeft: cfg.maxMoves, won: false, lost: false, moves: 0, hintText: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, fill, hint, peek, restart, goToMenu };
}

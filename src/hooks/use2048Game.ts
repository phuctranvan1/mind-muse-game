import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius" | "legend";

interface Config { size: number; target: number; moveLimit: number | null }

const CONFIGS: Record<Difficulty, Config> = {
  easy:        { size: 4, target: 2048,  moveLimit: null },
  medium:      { size: 4, target: 4096,  moveLimit: null },
  hard:        { size: 4, target: 8192,  moveLimit: 500  },
  expert:      { size: 5, target: 2048,  moveLimit: null },
  master:      { size: 5, target: 4096,  moveLimit: 600  },
  grandmaster: { size: 5, target: 8192,  moveLimit: 700  },
  genius:      { size: 6, target: 2048,  moveLimit: 600  },
  legend:      { size: 6, target: 4096,  moveLimit: 800  },
};

export interface Game2048State {
  grid: (number | null)[][];
  size: number;
  target: number;
  score: number;
  bestScore: number;
  moves: number;
  moveLimit: number | null;
  won: boolean;
  lost: boolean;
  difficulty: Difficulty;
  hintDir: "up" | "down" | "left" | "right" | null;
  peeking: boolean;
}

function emptyGrid(size: number): (number | null)[][] {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function getEmptyCells(grid: (number | null)[][]): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === null) cells.push([r, c]);
    }
  }
  return cells;
}

function spawnTile(grid: (number | null)[][], rng: () => number): (number | null)[][] {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;
  const idx = Math.floor(rng() * empty.length);
  const [r, c] = empty[idx];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = rng() < 0.9 ? 2 : 4;
  return newGrid;
}

// Slide a single row to the left, merging equal tiles; returns { row, gained }
function slideLeft(row: (number | null)[]): { row: (number | null)[]; gained: number } {
  const nums = row.filter((v): v is number => v !== null);
  const merged: (number | null)[] = [];
  let gained = 0;
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const val = nums[i] * 2;
      merged.push(val);
      gained += val;
      i += 2;
    } else {
      merged.push(nums[i]);
      i++;
    }
  }
  while (merged.length < row.length) merged.push(null);
  return { row: merged, gained };
}

function rotateGridCW(grid: (number | null)[][]): (number | null)[][] {
  const size = grid.length;
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => grid[size - 1 - c][r])
  );
}

function rotateGridCCW(grid: (number | null)[][]): (number | null)[][] {
  const size = grid.length;
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => grid[c][size - 1 - r])
  );
}

function rotate180(grid: (number | null)[][]): (number | null)[][] {
  return rotateGridCW(rotateGridCW(grid));
}

type Dir = "left" | "right" | "up" | "down";

function applyMove(
  grid: (number | null)[][],
  dir: Dir
): { grid: (number | null)[][]; gained: number; moved: boolean } {
  let work = grid.map(r => [...r]);
  if (dir === "right") work = work.map(r => r.slice().reverse());
  if (dir === "up") work = rotateGridCCW(work);
  if (dir === "down") work = rotateGridCW(work);

  let totalGained = 0;
  let moved = false;
  const slid = work.map(row => {
    const before = JSON.stringify(row);
    const { row: newRow, gained } = slideLeft(row);
    totalGained += gained;
    if (JSON.stringify(newRow) !== before) moved = true;
    return newRow;
  });

  let result = slid;
  if (dir === "right") result = result.map(r => r.slice().reverse());
  if (dir === "up") result = rotateGridCW(result);
  if (dir === "down") result = rotateGridCCW(result);

  return { grid: result, gained: totalGained, moved };
}

function hasValidMoves(grid: (number | null)[][]): boolean {
  const size = grid.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) return true;
      if (c + 1 < size && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < size && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function hasReached(grid: (number | null)[][], target: number): boolean {
  return grid.some(row => row.some(v => v !== null && v >= target));
}

function getBestMove(grid: (number | null)[][]): Dir {
  const dirs: Dir[] = ["left", "up", "right", "down"];
  let bestDir: Dir = "left";
  let bestScore = -Infinity;
  for (const dir of dirs) {
    const { moved, gained } = applyMove(grid, dir);
    if (moved && gained > bestScore) {
      bestScore = gained;
      bestDir = dir;
    }
  }
  // If no direction gains points, pick any valid move
  if (bestScore === 0) {
    for (const dir of dirs) {
      const { moved } = applyMove(grid, dir);
      if (moved) { bestDir = dir; break; }
    }
  }
  return bestDir;
}

export function use2048Game() {
  const [game, setGame] = useState<Game2048State | null>(null);
  const rngRef = useRef<() => number>(Math.random);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyRef = useRef<{ grid: (number | null)[][]; score: number; moves: number }[]>([]);

  const startGame = useCallback((difficulty: Difficulty, rng?: () => number) => {
    rngRef.current = rng ?? Math.random;
    historyRef.current = [];
    const { size, target, moveLimit } = CONFIGS[difficulty];
    let grid = emptyGrid(size);
    grid = spawnTile(grid, rngRef.current);
    grid = spawnTile(grid, rngRef.current);

    const bestScore = parseInt(localStorage.getItem("2048_best") ?? "0", 10);
    setGame({
      grid, size, target, score: 0, bestScore,
      moves: 0, moveLimit, won: false, lost: false,
      difficulty, hintDir: null, peeking: false,
    });
  }, []);

  const slide = useCallback((dir: Dir) => {
    setGame(prev => {
      if (!prev || prev.lost) return prev;
      if (prev.won) return prev;
      const { grid: movedGrid, gained, moved } = applyMove(prev.grid, dir);
      if (!moved) return prev;

      // Save history for undo (score and moves before this move)
      historyRef.current = [
        ...historyRef.current,
        { grid: prev.grid.map(r => [...r]), score: prev.score, moves: prev.moves },
      ];
      if (historyRef.current.length > 20) historyRef.current.shift();

      const newGrid = spawnTile(movedGrid, rngRef.current);
      const newScore = prev.score + gained;
      const newMoves = prev.moves + 1;
      const won = hasReached(newGrid, prev.target);
      const lost = !won && (!hasValidMoves(newGrid) || (prev.moveLimit !== null && newMoves >= prev.moveLimit));

      const best = Math.max(newScore, prev.bestScore);
      if (best > prev.bestScore) localStorage.setItem("2048_best", String(best));

      return {
        ...prev, grid: newGrid, score: newScore, bestScore: best,
        moves: newMoves, won, lost, hintDir: null,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || historyRef.current.length === 0) return prev;
      const { grid: lastGrid, score: lastScore, moves: lastMoves } = historyRef.current.pop()!;
      return { ...prev, grid: lastGrid, score: lastScore, moves: lastMoves, won: false, lost: false, hintDir: null };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.lost) return prev;
      const dir = getBestMove(prev.grid);
      return { ...prev, hintDir: dir };
    });
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, hintDir: null } : prev);
    }, 2000);
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    peekTimeout.current = setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      rngRef.current = Math.random;
      historyRef.current = [];
      const { size, target, moveLimit } = CONFIGS[prev.difficulty];
      let grid = emptyGrid(size);
      grid = spawnTile(grid, rngRef.current);
      grid = spawnTile(grid, rngRef.current);
      return { ...prev, grid, size, target, score: 0, moves: 0, moveLimit, won: false, lost: false, hintDir: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => {
    historyRef.current = [];
    setGame(null);
  }, []);

  return { game, startGame, slide, undo, hint, peek, restart, goToMenu };
}

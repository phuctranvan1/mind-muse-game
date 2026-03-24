import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const SIZES: Record<Difficulty, number> = {
  easy: 7, medium: 11, hard: 15, expert: 19, master: 23, grandmaster: 27, genius: 31,
};
const TIME_LIMITS: Record<Difficulty, number | null> = {
  easy: null, medium: null, hard: 180, expert: 240, master: 300, grandmaster: 360, genius: 420,
};

// Maze uses odd dimensions so walls/cells alternate properly
// Cell positions are even-indexed, walls odd-indexed
export interface MazeState {
  grid: boolean[][]; // true = passage, false = wall
  rows: number;
  cols: number;
  playerRow: number;
  playerCol: number;
  endRow: number;
  endCol: number;
  moves: number;
  won: boolean;
  difficulty: Difficulty;
  timeLimit: number | null;
  hintCell: [number, number] | null;
  peeking: boolean;
  visitedPath: Set<string>;
}

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return ((s >>> 0) / 0xffffffff);
  };
}

function generateMaze(rows: number, cols: number, rand: () => number): boolean[][] {
  // All cells start as walls
  const grid: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  const visited = new Set<string>();
  const key = (r: number, c: number) => `${r},${c}`;

  function carve(r: number, c: number) {
    visited.add(key(r, c));
    grid[r][c] = true;
    const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]];
    // Shuffle dirs
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(key(nr, nc))) {
        grid[r + dr / 2][c + dc / 2] = true; // carve the wall between
        carve(nr, nc);
      }
    }
  }

  carve(0, 0);
  return grid;
}

// BFS to find shortest path from (sr,sc) to (er,ec)
function bfsPath(grid: boolean[][], sr: number, sc: number, er: number, ec: number): [number, number][] | null {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();
  const queue: { r: number; c: number; path: [number, number][] }[] = [{ r: sr, c: sc, path: [] }];
  visited.add(`${sr},${sc}`);
  while (queue.length > 0) {
    const { r, c, path } = queue.shift()!;
    const newPath = [...path, [r, c] as [number, number]];
    if (r === er && c === ec) return newPath;
    for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] && !visited.has(`${nr},${nc}`)) {
        visited.add(`${nr},${nc}`);
        queue.push({ r: nr, c: nc, path: newPath });
      }
    }
  }
  return null;
}

function makeState(difficulty: Difficulty, rand: () => number): MazeState {
  const size = SIZES[difficulty];
  const grid = generateMaze(size, size, rand);
  const endRow = size - 1;
  const endCol = size - 1;
  // ensure end is open
  grid[endRow][endCol] = true;
  return {
    grid,
    rows: size,
    cols: size,
    playerRow: 0,
    playerCol: 0,
    endRow,
    endCol,
    moves: 0,
    won: false,
    difficulty,
    timeLimit: TIME_LIMITS[difficulty],
    hintCell: null,
    peeking: false,
    visitedPath: new Set(["0,0"]),
  };
}

export function useMazeGame() {
  const [game, setGame] = useState<MazeState | null>(null);
  const historyRef = useRef<{ playerRow: number; playerCol: number; moves: number; visitedPath: Set<string> }[]>([]);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const randRef = useRef<(() => number) | null>(null);
  const diffRef = useRef<Difficulty>("easy");

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    randRef.current = rand;
    diffRef.current = difficulty;
    historyRef.current = [];
    setGame(makeState(difficulty, rand));
  }, []);

  const movePlayer = useCallback((dr: number, dc: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const nr = prev.playerRow + dr;
      const nc = prev.playerCol + dc;
      if (nr < 0 || nr >= prev.rows || nc < 0 || nc >= prev.cols) return prev;
      if (!prev.grid[nr][nc]) return prev;
      historyRef.current.push({ playerRow: prev.playerRow, playerCol: prev.playerCol, moves: prev.moves, visitedPath: new Set(prev.visitedPath) });
      const newVisited = new Set(prev.visitedPath);
      newVisited.add(`${nr},${nc}`);
      const won = nr === prev.endRow && nc === prev.endCol;
      return { ...prev, playerRow: nr, playerCol: nc, moves: prev.moves + 1, won, hintCell: null, visitedPath: newVisited };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setGame(g => g ? { ...g, ...prev, won: false, hintCell: null } : g);
  }, []);

  const restart = useCallback(() => {
    historyRef.current = [];
    if (randRef.current) setGame(makeState(diffRef.current, randRef.current));
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const path = bfsPath(prev.grid, prev.playerRow, prev.playerCol, prev.endRow, prev.endCol);
      if (path && path.length > 1) {
        return { ...prev, hintCell: path[1] };
      }
      return prev;
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    peekTimeout.current = setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const goToMenu = useCallback(() => {
    historyRef.current = [];
    setGame(null);
  }, []);

  return { game, startGame, movePlayer, undo, restart, hint, peek, goToMenu };
}

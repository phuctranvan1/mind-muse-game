import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

interface MazeConfig {
  size: number;
}

const CONFIGS: Record<Difficulty, MazeConfig> = {
  easy:        { size: 7  },
  medium:      { size: 9  },
  hard:        { size: 11 },
  expert:      { size: 13 },
  master:      { size: 15 },
  grandmaster: { size: 17 },
  genius:      { size: 19 },
  legend:      { size: 21 },
  mythic:      { size: 23 },
  immortal:    { size: 25 },
  divine:      { size: 27 },
};

// Cell walls: bit 0=N, 1=E, 2=S, 3=W
// 0=no wall, but we store it as booleans
export interface MazeCell {
  N: boolean; E: boolean; S: boolean; W: boolean;
}

type Dir = "N" | "E" | "S" | "W";

const OPPOSITE: Record<Dir, Dir> = { N: "S", S: "N", E: "W", W: "E" };
const DR: Record<Dir, number> = { N: -1, S: 1, E: 0, W: 0 };
const DC: Record<Dir, number> = { N: 0, S: 0, E: 1, W: -1 };

function generateMaze(size: number, rand: () => number): MazeCell[][] {
  const grid: MazeCell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ N: true, E: true, S: true, W: true }))
  );
  const visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function dfs(r: number, c: number) {
    visited[r][c] = true;
    const dirs: Dir[] = ["N", "E", "S", "W"];
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const d of dirs) {
      const nr = r + DR[d];
      const nc = c + DC[d];
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
        grid[r][c][d] = false;
        grid[nr][nc][OPPOSITE[d]] = false;
        dfs(nr, nc);
      }
    }
  }
  dfs(0, 0);
  return grid;
}

function bfs(grid: MazeCell[][], start: [number, number], goal: [number, number]): [number, number][] {
  const [sr, sc] = start;
  const [gr, gc] = goal;
  const visited: boolean[][] = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false));
  const prev: ([number, number] | null)[][] = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
  const queue: [number, number][] = [[sr, sc]];
  visited[sr][sc] = true;

  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r === gr && c === gc) break;
    for (const [d, dr, dc] of ([["N", -1, 0], ["E", 0, 1], ["S", 1, 0], ["W", 0, -1]] as [Dir, number, number][])) {
      if (grid[r][c][d]) continue;
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length || visited[nr][nc]) continue;
      visited[nr][nc] = true;
      prev[nr][nc] = [r, c];
      queue.push([nr, nc]);
    }
  }

  const path: [number, number][] = [];
  let cur: [number, number] | null = [gr, gc];
  while (cur) {
    path.unshift(cur);
    cur = prev[cur[0]][cur[1]];
  }
  return path;
}

export interface MazeState {
  grid: MazeCell[][];
  playerRow: number;
  playerCol: number;
  goalRow: number;
  goalCol: number;
  size: number;
  won: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
  history: [number, number][];
  solutionPath: [number, number][] | null;
}

export function useMazeGame() {
  const [game, setGame] = useState<MazeState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const grid = generateMaze(cfg.size, rand);
    const goalRow = cfg.size - 1, goalCol = cfg.size - 1;
    setGame({
      grid, playerRow: 0, playerCol: 0, goalRow, goalCol, size: cfg.size,
      won: false, moves: 0, difficulty, hintText: null, peeking: false,
      history: [[0, 0]], solutionPath: null,
    });
  }, []);

  const move = useCallback((dir: Dir) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const cell = prev.grid[prev.playerRow][prev.playerCol];
      if (cell[dir]) return prev; // wall
      const nr = prev.playerRow + DR[dir];
      const nc = prev.playerCol + DC[dir];
      if (nr < 0 || nr >= prev.size || nc < 0 || nc >= prev.size) return prev;
      const won = nr === prev.goalRow && nc === prev.goalCol;
      return {
        ...prev,
        playerRow: nr, playerCol: nc,
        won, moves: prev.moves + 1,
        history: [...prev.history, [nr, nc]],
        hintText: null, solutionPath: null,
      };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const path = bfs(prev.grid, [prev.playerRow, prev.playerCol], [prev.goalRow, prev.goalCol]);
      if (path.length < 2) return prev;
      const next = path[1];
      const dr = next[0] - prev.playerRow;
      const dc = next[1] - prev.playerCol;
      const dir = dr === -1 ? "North" : dr === 1 ? "South" : dc === 1 ? "East" : "West";
      return { ...prev, hintText: `Go ${dir}` };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const path = bfs(prev.grid, [prev.playerRow, prev.playerCol], [prev.goalRow, prev.goalCol]);
      return { ...prev, peeking: true, solutionPath: path };
    });
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false, solutionPath: null } : prev), 3000);
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.history.length <= 1) return prev;
      const newHistory = prev.history.slice(0, -1);
      const [r, c] = newHistory[newHistory.length - 1];
      return { ...prev, playerRow: r, playerCol: c, history: newHistory, hintText: null, solutionPath: null };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const grid = generateMaze(cfg.size, Math.random);
      return { ...prev, grid, playerRow: 0, playerCol: 0, won: false, moves: 0, hintText: null, peeking: false, history: [[0, 0]], solutionPath: null };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, move, hint, peek, undo, restart, goToMenu };
}

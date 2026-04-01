import { useState, useCallback } from "react";
import { Difficulty } from "./useShiftGame";

type Cell = { wall: boolean; target: boolean; obstacle: boolean };
type Pos = { r: number; c: number };
type Direction = "up" | "down" | "left" | "right";

export interface RicochetState {
  grid: Cell[][];
  size: number;
  player: Pos;
  target: Pos;
  moves: number;
  won: boolean;
  hintDir: Direction | null;
  peekPath: Pos[] | null;
  history: Pos[];
  moveLimit: number | null;
  lost: boolean;
}

const CONFIGS: Record<string, { size: number; obstacles: number; moveLimit: number | null }> = {
  easy: { size: 5, obstacles: 3, moveLimit: null },
  medium: { size: 6, obstacles: 5, moveLimit: null },
  hard: { size: 7, obstacles: 7, moveLimit: 20 },
  expert: { size: 8, obstacles: 10, moveLimit: 18 },
  master: { size: 9, obstacles: 14, moveLimit: 16 },
  grandmaster: { size: 10, obstacles: 18, moveLimit: 14 },
  genius: { size: 11, obstacles: 22, moveLimit: 12 },
  legend: { size: 12, obstacles: 28, moveLimit: 10 },
  mythic: { size: 13, obstacles: 34, moveLimit: 9 },
  immortal: { size: 14, obstacles: 40, moveLimit: 8 },
  divine: { size: 16, obstacles: 50, moveLimit: 7 },
};

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateLevel(size: number, obstacleCount: number, rng: () => number): { grid: Cell[][]; player: Pos; target: Pos } {
  const grid: Cell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ wall: false, target: false, obstacle: false }))
  );

  const player: Pos = { r: Math.floor(rng() * size), c: Math.floor(rng() * size) };
  let target: Pos;
  do {
    target = { r: Math.floor(rng() * size), c: Math.floor(rng() * size) };
  } while (target.r === player.r && target.c === player.c);

  grid[target.r][target.c].target = true;

  let placed = 0;
  let attempts = 0;
  while (placed < obstacleCount && attempts < 500) {
    const r = Math.floor(rng() * size);
    const c = Math.floor(rng() * size);
    if ((r === player.r && c === player.c) || (r === target.r && c === target.c) || grid[r][c].obstacle) {
      attempts++;
      continue;
    }
    grid[r][c].obstacle = true;
    placed++;
    attempts++;
  }

  return { grid, player, target };
}

function slide(grid: Cell[][], pos: Pos, dir: Direction, size: number): Pos {
  const dr = dir === "up" ? -1 : dir === "down" ? 1 : 0;
  const dc = dir === "left" ? -1 : dir === "right" ? 1 : 0;
  let { r, c } = pos;
  while (true) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= size || nc < 0 || nc >= size) break;
    if (grid[nr][nc].obstacle) break;
    r = nr;
    c = nc;
    if (grid[r][c].target) break;
  }
  return { r, c };
}

// BFS to find shortest solution
function solveBFS(grid: Cell[][], start: Pos, target: Pos, size: number): Direction[] | null {
  const key = (p: Pos) => `${p.r},${p.c}`;
  const visited = new Set<string>();
  const queue: { pos: Pos; path: Direction[] }[] = [{ pos: start, path: [] }];
  visited.add(key(start));

  const dirs: Direction[] = ["up", "down", "left", "right"];
  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    for (const d of dirs) {
      const np = slide(grid, pos, d, size);
      if (np.r === pos.r && np.c === pos.c) continue;
      const k = key(np);
      if (visited.has(k)) continue;
      visited.add(k);
      const newPath = [...path, d];
      if (np.r === target.r && np.c === target.c) return newPath;
      if (newPath.length < 20) queue.push({ pos: np, path: newPath });
    }
  }
  return null;
}

export function useRicochetGame() {
  const [game, setGame] = useState<RicochetState | null>(null);
  const [difficultyLabel, setDifficultyLabel] = useState("");

  const startGame = useCallback((difficulty: Difficulty, dailySeed?: () => number) => {
    const cfg = CONFIGS[difficulty] || CONFIGS.easy;
    const rng = dailySeed || (() => Math.random());
    const { grid, player, target } = generateLevel(cfg.size, cfg.obstacles, rng);
    setDifficultyLabel(difficulty);
    setGame({
      grid, size: cfg.size, player, target, moves: 0, won: false,
      hintDir: null, peekPath: null, history: [player],
      moveLimit: cfg.moveLimit, lost: false,
    });
  }, []);

  const move = useCallback((dir: Direction) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const np = slide(prev.grid, prev.player, dir, prev.size);
      if (np.r === prev.player.r && np.c === prev.player.c) return prev;
      const newMoves = prev.moves + 1;
      const won = np.r === prev.target.r && np.c === prev.target.c;
      const lost = !won && prev.moveLimit !== null && newMoves >= prev.moveLimit;
      return {
        ...prev, player: np, moves: newMoves, won, lost,
        hintDir: null, peekPath: null,
        history: [...prev.history, np],
      };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const solution = solveBFS(prev.grid, prev.player, prev.target, prev.size);
      return { ...prev, hintDir: solution?.[0] ?? null };
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.history.length <= 1) return prev;
      const newHistory = prev.history.slice(0, -1);
      return {
        ...prev, player: newHistory[newHistory.length - 1],
        moves: Math.max(0, prev.moves - 1), won: false, lost: false,
        history: newHistory, hintDir: null, peekPath: null,
      };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const solution = solveBFS(prev.grid, prev.player, prev.target, prev.size);
      if (!solution) return prev;
      // Build path positions
      const path: Pos[] = [prev.player];
      let cur = prev.player;
      for (const d of solution) {
        cur = slide(prev.grid, cur, d, prev.size);
        path.push(cur);
      }
      return { ...prev, peekPath: path };
    });
    setTimeout(() => setGame(prev => prev ? { ...prev, peekPath: null } : null), 2000);
  }, []);

  const restart = useCallback(() => {
    if (game) startGame(difficultyLabel as Difficulty);
  }, [game, difficultyLabel, startGame]);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, move, hint, undo, peek, restart, goToMenu, difficultyLabel };
}

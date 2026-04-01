import { useState, useCallback } from "react";
import { Difficulty } from "./useShiftGame";

type CellType = "empty" | "wall" | "start" | "end" | "portal";
export interface PortalCell { type: CellType; portalId?: number }
type Pos = { r: number; c: number };
type Direction = "up" | "down" | "left" | "right";

export interface PortalState {
  grid: PortalCell[][];
  size: number;
  player: Pos;
  end: Pos;
  moves: number;
  won: boolean;
  portals: { id: number; a: Pos; b: Pos }[];
  hintDir: Direction | null;
  peekPath: Pos[] | null;
  history: Pos[];
  moveLimit: number | null;
  lost: boolean;
}

const CONFIGS: Record<string, { size: number; walls: number; portalPairs: number; moveLimit: number | null }> = {
  easy: { size: 5, walls: 4, portalPairs: 1, moveLimit: null },
  medium: { size: 6, walls: 8, portalPairs: 2, moveLimit: null },
  hard: { size: 7, walls: 12, portalPairs: 2, moveLimit: 30 },
  expert: { size: 8, walls: 16, portalPairs: 3, moveLimit: 28 },
  master: { size: 9, walls: 22, portalPairs: 3, moveLimit: 25 },
  grandmaster: { size: 10, walls: 28, portalPairs: 4, moveLimit: 22 },
  genius: { size: 11, walls: 35, portalPairs: 5, moveLimit: 20 },
  legend: { size: 12, walls: 42, portalPairs: 6, moveLimit: 18 },
  mythic: { size: 14, walls: 55, portalPairs: 7, moveLimit: 16 },
  immortal: { size: 16, walls: 70, portalPairs: 8, moveLimit: 14 },
  divine: { size: 18, walls: 90, portalPairs: 10, moveLimit: 12 },
};

function generateMaze(cfg: typeof CONFIGS.easy, rng: () => number) {
  const { size, walls: wallCount, portalPairs } = cfg;
  const grid: PortalCell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ type: "empty" as CellType }))
  );

  const start: Pos = { r: 0, c: 0 };
  const end: Pos = { r: size - 1, c: size - 1 };
  grid[start.r][start.c] = { type: "start" };
  grid[end.r][end.c] = { type: "end" };

  const occupied = new Set([`${start.r},${start.c}`, `${end.r},${end.c}`]);

  // Place walls
  let placed = 0, att = 0;
  while (placed < wallCount && att < 1000) {
    const r = Math.floor(rng() * size), c = Math.floor(rng() * size);
    const k = `${r},${c}`;
    if (!occupied.has(k)) { grid[r][c] = { type: "wall" }; occupied.add(k); placed++; }
    att++;
  }

  // Place portal pairs
  const portals: { id: number; a: Pos; b: Pos }[] = [];
  for (let i = 0; i < portalPairs; i++) {
    let a: Pos | null = null, b: Pos | null = null;
    for (let t = 0; t < 100; t++) {
      const r = Math.floor(rng() * size), c = Math.floor(rng() * size);
      if (!occupied.has(`${r},${c}`)) { a = { r, c }; occupied.add(`${r},${c}`); break; }
    }
    for (let t = 0; t < 100; t++) {
      const r = Math.floor(rng() * size), c = Math.floor(rng() * size);
      if (!occupied.has(`${r},${c}`)) { b = { r, c }; occupied.add(`${r},${c}`); break; }
    }
    if (a && b) {
      grid[a.r][a.c] = { type: "portal", portalId: i };
      grid[b.r][b.c] = { type: "portal", portalId: i };
      portals.push({ id: i, a, b });
    }
  }

  return { grid, start, end, portals };
}

function getPortalExit(portals: PortalState["portals"], pos: Pos, id: number): Pos {
  const p = portals.find(p => p.id === id);
  if (!p) return pos;
  return (p.a.r === pos.r && p.a.c === pos.c) ? p.b : p.a;
}

// BFS solver
function solveBFS(state: PortalState): Direction[] | null {
  const key = (p: Pos) => `${p.r},${p.c}`;
  const visited = new Set<string>();
  const queue: { pos: Pos; path: Direction[] }[] = [{ pos: state.player, path: [] }];
  visited.add(key(state.player));
  const dirs: Direction[] = ["up", "down", "left", "right"];
  const dr = { up: -1, down: 1, left: 0, right: 0 };
  const dc = { up: 0, down: 0, left: -1, right: 1 };

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    for (const d of dirs) {
      let nr = pos.r + dr[d], nc = pos.c + dc[d];
      if (nr < 0 || nr >= state.size || nc < 0 || nc >= state.size) continue;
      if (state.grid[nr][nc].type === "wall") continue;
      let np = { r: nr, c: nc };
      const cell = state.grid[nr][nc];
      if (cell.type === "portal" && cell.portalId !== undefined) {
        np = getPortalExit(state.portals, np, cell.portalId);
      }
      const k = key(np);
      if (visited.has(k)) continue;
      visited.add(k);
      const newPath = [...path, d];
      if (np.r === state.end.r && np.c === state.end.c) return newPath;
      if (newPath.length < 60) queue.push({ pos: np, path: newPath });
    }
  }
  return null;
}

export function usePortalGame() {
  const [game, setGame] = useState<PortalState | null>(null);
  const [difficultyLabel, setDifficultyLabel] = useState("");

  const startGame = useCallback((difficulty: Difficulty, dailySeed?: () => number) => {
    const cfg = CONFIGS[difficulty] || CONFIGS.easy;
    const rng = dailySeed || (() => Math.random());
    const { grid, start, end, portals } = generateMaze(cfg, rng);
    setDifficultyLabel(difficulty);
    setGame({
      grid, size: cfg.size, player: start, end, moves: 0, won: false,
      portals, hintDir: null, peekPath: null, history: [start],
      moveLimit: cfg.moveLimit, lost: false,
    });
  }, []);

  const move = useCallback((dir: Direction) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const dr = { up: -1, down: 1, left: 0, right: 0 };
      const dc = { up: 0, down: 0, left: -1, right: 1 };
      let nr = prev.player.r + dr[dir], nc = prev.player.c + dc[dir];
      if (nr < 0 || nr >= prev.size || nc < 0 || nc >= prev.size) return prev;
      if (prev.grid[nr][nc].type === "wall") return prev;
      let np = { r: nr, c: nc };
      const cell = prev.grid[nr][nc];
      if (cell.type === "portal" && cell.portalId !== undefined) {
        np = getPortalExit(prev.portals, np, cell.portalId);
      }
      const newMoves = prev.moves + 1;
      const won = np.r === prev.end.r && np.c === prev.end.c;
      const lost = !won && prev.moveLimit !== null && newMoves >= prev.moveLimit;
      return {
        ...prev, player: np, moves: newMoves, won, lost,
        hintDir: null, peekPath: null, history: [...prev.history, np],
      };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const sol = solveBFS(prev);
      return { ...prev, hintDir: sol?.[0] ?? null };
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
      const sol = solveBFS(prev);
      if (!sol) return prev;
      const path: Pos[] = [prev.player];
      const drs = { up: -1, down: 1, left: 0, right: 0 };
      const dcs = { up: 0, down: 0, left: -1, right: 1 };
      let cur = prev.player;
      for (const d of sol) {
        let nr = cur.r + drs[d], nc = cur.c + dcs[d];
        let np = { r: nr, c: nc };
        const cell = prev.grid[nr]?.[nc];
        if (cell?.type === "portal" && cell.portalId !== undefined) {
          np = getPortalExit(prev.portals, np, cell.portalId);
        }
        path.push(np);
        cur = np;
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

import { useState, useCallback } from "react";
import { Difficulty } from "./useShiftGame";

export type ArcherCell = "empty" | "wall" | "target" | "archer" | "arrow" | "hit";
type Direction = "up" | "down" | "left" | "right";

export interface ArcherState {
  grid: ArcherCell[][];
  size: number;
  archer: { r: number; c: number };
  arrows: number;
  arrowsUsed: number;
  totalTargets: number;
  targetsHit: number;
  moves: number;
  won: boolean;
  lost: boolean;
  hintDir: Direction | null;
  peekTargets: { r: number; c: number }[] | null;
  history: { grid: ArcherCell[][]; arrowsUsed: number; targetsHit: number }[];
  lastArrowPath: { r: number; c: number }[] | null;
}

const CONFIGS: Record<string, { size: number; targets: number; walls: number; arrows: number }> = {
  easy: { size: 5, targets: 3, walls: 2, arrows: 5 },
  medium: { size: 6, targets: 4, walls: 4, arrows: 6 },
  hard: { size: 7, targets: 6, walls: 6, arrows: 7 },
  expert: { size: 8, targets: 8, walls: 8, arrows: 9 },
  master: { size: 9, targets: 10, walls: 12, arrows: 11 },
  grandmaster: { size: 10, targets: 13, walls: 16, arrows: 14 },
  genius: { size: 11, targets: 16, walls: 20, arrows: 17 },
  legend: { size: 12, targets: 20, walls: 26, arrows: 21 },
  mythic: { size: 14, targets: 26, walls: 35, arrows: 27 },
  immortal: { size: 16, targets: 34, walls: 48, arrows: 35 },
  divine: { size: 18, targets: 44, walls: 64, arrows: 45 },
};

function generateLevel(cfg: typeof CONFIGS.easy, rng: () => number) {
  const { size, targets, walls } = cfg;
  const grid: ArcherCell[][] = Array.from({ length: size }, () => Array(size).fill("empty"));

  // Place archer in bottom-center
  const archerPos = { r: size - 1, c: Math.floor(size / 2) };
  grid[archerPos.r][archerPos.c] = "archer";
  const occupied = new Set([`${archerPos.r},${archerPos.c}`]);

  let placed = 0, att = 0;
  while (placed < targets && att < 500) {
    const r = Math.floor(rng() * (size - 1)), c = Math.floor(rng() * size);
    if (!occupied.has(`${r},${c}`)) { grid[r][c] = "target"; occupied.add(`${r},${c}`); placed++; }
    att++;
  }

  placed = 0; att = 0;
  while (placed < walls && att < 500) {
    const r = Math.floor(rng() * size), c = Math.floor(rng() * size);
    if (!occupied.has(`${r},${c}`)) { grid[r][c] = "wall"; occupied.add(`${r},${c}`); placed++; }
    att++;
  }

  return { grid, archer: archerPos };
}

export function useArcherGame() {
  const [game, setGame] = useState<ArcherState | null>(null);
  const [difficultyLabel, setDifficultyLabel] = useState("");

  const startGame = useCallback((difficulty: Difficulty, dailySeed?: () => number) => {
    const cfg = CONFIGS[difficulty] || CONFIGS.easy;
    const rng = dailySeed || (() => Math.random());
    const { grid, archer } = generateLevel(cfg, rng);
    const totalTargets = grid.flat().filter(c => c === "target").length;
    setDifficultyLabel(difficulty);
    setGame({
      grid, size: cfg.size, archer, arrows: cfg.arrows, arrowsUsed: 0,
      totalTargets, targetsHit: 0, moves: 0, won: false, lost: false,
      hintDir: null, peekTargets: null, lastArrowPath: null,
      history: [{ grid: grid.map(r => [...r]), arrowsUsed: 0, targetsHit: 0 }],
    });
  }, []);

  const shoot = useCallback((dir: Direction) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (prev.arrowsUsed >= prev.arrows) return prev;

      const dr = { up: -1, down: 1, left: 0, right: 0 };
      const dc = { up: 0, down: 0, left: -1, right: 1 };
      const newGrid = prev.grid.map(row => [...row]);
      let r = prev.archer.r + dr[dir], c = prev.archer.c + dc[dir];
      const path: { r: number; c: number }[] = [];
      let hit = false;

      while (r >= 0 && r < prev.size && c >= 0 && c < prev.size) {
        path.push({ r, c });
        if (newGrid[r][c] === "wall") break;
        if (newGrid[r][c] === "target") {
          newGrid[r][c] = "hit";
          hit = true;
          break;
        }
        r += dr[dir];
        c += dc[dir];
      }

      const newArrowsUsed = prev.arrowsUsed + 1;
      const newTargetsHit = prev.targetsHit + (hit ? 1 : 0);
      const won = newTargetsHit >= prev.totalTargets;
      const lost = !won && newArrowsUsed >= prev.arrows;

      return {
        ...prev, grid: newGrid, arrowsUsed: newArrowsUsed, targetsHit: newTargetsHit,
        moves: prev.moves + 1, won, lost, hintDir: null, peekTargets: null,
        lastArrowPath: path,
        history: [...prev.history, { grid: newGrid.map(r => [...r]), arrowsUsed: newArrowsUsed, targetsHit: newTargetsHit }],
      };
    });
  }, []);

  const moveArcher = useCallback((dir: "left" | "right") => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const nc = prev.archer.c + (dir === "left" ? -1 : 1);
      if (nc < 0 || nc >= prev.size) return prev;
      if (prev.grid[prev.archer.r][nc] !== "empty") return prev;
      const newGrid = prev.grid.map(row => [...row]);
      newGrid[prev.archer.r][prev.archer.c] = "empty";
      newGrid[prev.archer.r][nc] = "archer";
      const newArcher = { r: prev.archer.r, c: nc };
      return {
        ...prev, grid: newGrid, archer: newArcher, moves: prev.moves + 1,
        hintDir: null, peekTargets: null, lastArrowPath: null,
        history: [...prev.history, { grid: newGrid.map(r => [...r]), arrowsUsed: prev.arrowsUsed, targetsHit: prev.targetsHit }],
      };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      // Check if shooting up hits a target
      const dirs: Direction[] = ["up", "left", "right", "down"];
      for (const d of dirs) {
        const dr = { up: -1, down: 1, left: 0, right: 0 };
        const dc = { up: 0, down: 0, left: -1, right: 1 };
        let r = prev.archer.r + dr[d], c = prev.archer.c + dc[d];
        while (r >= 0 && r < prev.size && c >= 0 && c < prev.size) {
          if (prev.grid[r][c] === "wall") break;
          if (prev.grid[r][c] === "target") return { ...prev, hintDir: d };
          r += dr[d]; c += dc[d];
        }
      }
      return prev;
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.history.length <= 1) return prev;
      const newHistory = prev.history.slice(0, -1);
      const last = newHistory[newHistory.length - 1];
      // Recalculate archer position from grid
      let archer = prev.archer;
      for (let r = 0; r < prev.size; r++)
        for (let c = 0; c < prev.size; c++)
          if (last.grid[r][c] === "archer") archer = { r, c };
      return {
        ...prev, grid: last.grid.map(r => [...r]), arrowsUsed: last.arrowsUsed,
        targetsHit: last.targetsHit, archer, moves: Math.max(0, prev.moves - 1),
        won: false, lost: false, history: newHistory, hintDir: null, peekTargets: null, lastArrowPath: null,
      };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const targets: { r: number; c: number }[] = [];
      for (let r = 0; r < prev.size; r++)
        for (let c = 0; c < prev.size; c++)
          if (prev.grid[r][c] === "target") targets.push({ r, c });
      return { ...prev, peekTargets: targets };
    });
    setTimeout(() => setGame(prev => prev ? { ...prev, peekTargets: null } : null), 2000);
  }, []);

  const restart = useCallback(() => {
    if (game) startGame(difficultyLabel as Difficulty);
  }, [game, difficultyLabel, startGame]);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, shoot, moveArcher, hint, undo, peek, restart, goToMenu, difficultyLabel };
}

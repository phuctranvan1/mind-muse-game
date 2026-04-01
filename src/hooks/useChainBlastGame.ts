import { useState, useCallback } from "react";
import { Difficulty } from "./useShiftGame";

export type BlastCell = "empty" | "target" | "bomb" | "destroyed" | "exploded";

export interface ChainBlastState {
  grid: BlastCell[][];
  size: number;
  bombs: number;
  bombsPlaced: number;
  totalTargets: number;
  destroyedTargets: number;
  moves: number;
  won: boolean;
  lost: boolean;
  blastRadius: number;
  detonated: boolean;
  hintCell: { r: number; c: number } | null;
  peekSolution: { r: number; c: number }[] | null;
  history: { grid: BlastCell[][]; bombsPlaced: number }[];
}

const CONFIGS: Record<string, { size: number; targets: number; bombs: number; blastRadius: number }> = {
  easy: { size: 5, targets: 4, bombs: 3, blastRadius: 1 },
  medium: { size: 6, targets: 6, bombs: 4, blastRadius: 1 },
  hard: { size: 7, targets: 8, bombs: 4, blastRadius: 2 },
  expert: { size: 8, targets: 12, bombs: 5, blastRadius: 2 },
  master: { size: 9, targets: 16, bombs: 5, blastRadius: 2 },
  grandmaster: { size: 10, targets: 20, bombs: 6, blastRadius: 2 },
  genius: { size: 11, targets: 26, bombs: 6, blastRadius: 3 },
  legend: { size: 12, targets: 32, bombs: 6, blastRadius: 3 },
  mythic: { size: 13, targets: 40, bombs: 7, blastRadius: 3 },
  immortal: { size: 14, targets: 50, bombs: 7, blastRadius: 3 },
  divine: { size: 16, targets: 65, bombs: 8, blastRadius: 4 },
};

function generateLevel(cfg: typeof CONFIGS.easy, rng: () => number) {
  const { size, targets } = cfg;
  const grid: BlastCell[][] = Array.from({ length: size }, () => Array(size).fill("empty"));
  let placed = 0, att = 0;
  while (placed < targets && att < 500) {
    const r = Math.floor(rng() * size), c = Math.floor(rng() * size);
    if (grid[r][c] === "empty") { grid[r][c] = "target"; placed++; }
    att++;
  }
  return grid;
}

function detonate(grid: BlastCell[][], blastRadius: number): { newGrid: BlastCell[][]; destroyed: number } {
  const size = grid.length;
  const newGrid = grid.map(row => [...row]);
  const toExplode: { r: number; c: number }[] = [];

  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (newGrid[r][c] === "bomb") toExplode.push({ r, c });

  let destroyed = 0;
  const processed = new Set<string>();

  while (toExplode.length > 0) {
    const { r, c } = toExplode.shift()!;
    const key = `${r},${c}`;
    if (processed.has(key)) continue;
    processed.add(key);
    newGrid[r][c] = "exploded";

    for (let dr = -blastRadius; dr <= blastRadius; dr++) {
      for (let dc = -blastRadius; dc <= blastRadius; dc++) {
        if (Math.abs(dr) + Math.abs(dc) > blastRadius) continue;
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
        if (newGrid[nr][nc] === "target") { newGrid[nr][nc] = "destroyed"; destroyed++; }
        if (newGrid[nr][nc] === "bomb" && !processed.has(`${nr},${nc}`)) {
          toExplode.push({ r: nr, c: nc });
        }
      }
    }
  }
  return { newGrid, destroyed };
}

export function useChainBlastGame() {
  const [game, setGame] = useState<ChainBlastState | null>(null);
  const [difficultyLabel, setDifficultyLabel] = useState("");

  const startGame = useCallback((difficulty: Difficulty, dailySeed?: () => number) => {
    const cfg = CONFIGS[difficulty] || CONFIGS.easy;
    const rng = dailySeed || (() => Math.random());
    const grid = generateLevel(cfg, rng);
    const totalTargets = grid.flat().filter(c => c === "target").length;
    setDifficultyLabel(difficulty);
    setGame({
      grid, size: cfg.size, bombs: cfg.bombs, bombsPlaced: 0,
      totalTargets, destroyedTargets: 0, moves: 0, won: false, lost: false,
      blastRadius: cfg.blastRadius, detonated: false,
      hintCell: null, peekSolution: null,
      history: [{ grid: grid.map(r => [...r]), bombsPlaced: 0 }],
    });
  }, []);

  const placeBomb = useCallback((r: number, c: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.detonated) return prev;
      if (prev.grid[r][c] !== "empty") return prev;
      if (prev.bombsPlaced >= prev.bombs) return prev;
      const newGrid = prev.grid.map(row => [...row]);
      newGrid[r][c] = "bomb";
      const newBombs = prev.bombsPlaced + 1;
      return {
        ...prev, grid: newGrid, bombsPlaced: newBombs, moves: prev.moves + 1,
        hintCell: null, peekSolution: null,
        history: [...prev.history, { grid: newGrid.map(r => [...r]), bombsPlaced: newBombs }],
      };
    });
  }, []);

  const detonateAll = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.detonated) return prev;
      if (prev.bombsPlaced === 0) return prev;
      const { newGrid, destroyed } = detonate(prev.grid, prev.blastRadius);
      const won = destroyed >= prev.totalTargets;
      const lost = !won;
      return {
        ...prev, grid: newGrid, destroyedTargets: destroyed,
        won, lost, detonated: true, hintCell: null, peekSolution: null,
      };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.detonated) return prev;
      // Find a target and suggest placing bomb nearby
      for (let r = 0; r < prev.size; r++)
        for (let c = 0; c < prev.size; c++)
          if (prev.grid[r][c] === "target") {
            // Find nearby empty cell
            for (let dr = -1; dr <= 1; dr++)
              for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < prev.size && nc >= 0 && nc < prev.size && prev.grid[nr][nc] === "empty")
                  return { ...prev, hintCell: { r: nr, c: nc } };
              }
          }
      return prev;
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.history.length <= 1 || prev.detonated) return prev;
      const newHistory = prev.history.slice(0, -1);
      const last = newHistory[newHistory.length - 1];
      return {
        ...prev, grid: last.grid.map(r => [...r]), bombsPlaced: last.bombsPlaced,
        moves: Math.max(0, prev.moves - 1), won: false, lost: false,
        history: newHistory, hintCell: null, peekSolution: null,
      };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peekSolution: [] } : null);
    setTimeout(() => setGame(prev => prev ? { ...prev, peekSolution: null } : null), 2000);
  }, []);

  const restart = useCallback(() => {
    if (game) startGame(difficultyLabel as Difficulty);
  }, [game, difficultyLabel, startGame]);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, placeBomb, detonateAll, hint, undo, peek, restart, goToMenu, difficultyLabel };
}

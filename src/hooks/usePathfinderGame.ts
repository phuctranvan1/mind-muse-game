import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

// Pathfinder: grid of cells with arrows. Player follows arrows. 
// Some arrows can be flipped (costs 1 flip). Reach goal from start.
// The puzzle: minimum flips to create a valid path.

type ArrowDir = 0 | 1 | 2 | 3; // 0=N, 1=E, 2=S, 3=W
const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];
const DIR_EMOJI = ["⬆️", "➡️", "⬇️", "⬅️"];
const DIR_NAMES = ["N", "E", "S", "W"];

interface PathfinderConfig {
  size: number;
  maxFlips: number;
}

const CONFIGS: Record<Difficulty, PathfinderConfig> = {
  easy:        { size: 4, maxFlips: 5  },
  medium:      { size: 4, maxFlips: 4  },
  hard:        { size: 5, maxFlips: 5  },
  expert:      { size: 5, maxFlips: 4  },
  master:      { size: 6, maxFlips: 5  },
  grandmaster: { size: 6, maxFlips: 4  },
  genius:      { size: 7, maxFlips: 5  },
  legend:      { size: 7, maxFlips: 4  },
  mythic:      { size: 8, maxFlips: 5  },
  immortal:    { size: 8, maxFlips: 4  },
  divine:      { size: 9, maxFlips: 5  },
};

function generateGrid(size: number, rand: () => number): ArrowDir[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(rand() * 4) as ArrowDir)
  );
}

// Simulate following arrows (with current grid), return path or null
function followPath(grid: ArrowDir[][], size: number): [number, number][] | null {
  const visited = new Set<number>();
  let r = 0, c = 0;
  const path: [number, number][] = [[r, c]];
  while (!(r === size - 1 && c === size - 1)) {
    const key = r * size + c;
    if (visited.has(key)) return null; // loop
    visited.add(key);
    const dir = grid[r][c];
    const nr = r + DR[dir], nc = c + DC[dir];
    if (nr < 0 || nr >= size || nc < 0 || nc >= size) return null; // out of bounds
    r = nr; c = nc;
    path.push([r, c]);
    if (path.length > size * size * 2) return null;
  }
  return path;
}

export interface PathfinderState {
  grid: ArrowDir[][];
  flipped: Set<number>;
  maxFlips: number;
  flipsUsed: number;
  size: number;
  won: boolean;
  lost: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
  currentPath: [number, number][] | null;
  dirEmoji: string[];
}

export function usePathfinderGame() {
  const [game, setGame] = useState<PathfinderState | null>(null);

  const buildGame = (difficulty: Difficulty, rand: () => number): PathfinderState => {
    const cfg = CONFIGS[difficulty];
    // Generate grid ensuring it's solvable with ≤ maxFlips flips
    let grid = generateGrid(cfg.size, rand);
    // Ensure a path exists with maxFlips
    let attempts = 0;
    while (attempts < 50) {
      const path = followPath(grid, cfg.size);
      if (path) break;
      grid = generateGrid(cfg.size, rand);
      attempts++;
    }
    // If still no path, force-set a path
    if (!followPath(grid, cfg.size)) {
      // Create a simple path: go right then down
      const newGrid = grid.map(r => [...r] as ArrowDir[]);
      for (let r = 0; r < cfg.size - 1; r++) {
        newGrid[r][cfg.size - 1] = 2; // S
      }
      for (let c = 0; c < cfg.size - 1; c++) {
        newGrid[cfg.size - 1][c] = 1; // E
      }
      // Route top row right, then down column
      for (let c = 0; c < cfg.size - 1; c++) newGrid[0][c] = 1; // E
      newGrid[0][cfg.size - 1] = 2; // S
      grid = newGrid;
    }
    const path = followPath(grid, cfg.size);
    return {
      grid,
      flipped: new Set<number>(),
      maxFlips: cfg.maxFlips,
      flipsUsed: 0,
      size: cfg.size,
      won: !!path && path[path.length - 1][0] === cfg.size - 1 && path[path.length - 1][1] === cfg.size - 1,
      lost: false,
      moves: 0,
      difficulty,
      hintText: null,
      peeking: false,
      currentPath: path,
      dirEmoji: DIR_EMOJI,
    };
  };

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    setGame(buildGame(difficulty, rand));
  }, []);

  const flipArrow = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (prev.flipsUsed >= prev.maxFlips) {
        return { ...prev, hintText: "No flips remaining!" };
      }
      const key = row * prev.size + col;
      const newGrid = prev.grid.map(r => [...r] as ArrowDir[]);
      newGrid[row][col] = ((newGrid[row][col] + 1) % 4) as ArrowDir;
      const newFlipped = new Set(prev.flipped);
      newFlipped.add(key);
      const path = followPath(newGrid, prev.size);
      const won = !!path && path[path.length - 1][0] === prev.size - 1 && path[path.length - 1][1] === prev.size - 1;
      const newFlipsUsed = prev.flipsUsed + 1;
      const lost = !won && newFlipsUsed >= prev.maxFlips && !path;
      return {
        ...prev,
        grid: newGrid,
        flipped: newFlipped,
        flipsUsed: newFlipsUsed,
        won,
        lost,
        moves: prev.moves + 1,
        currentPath: path,
        hintText: null,
      };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const path = followPath(prev.grid, prev.size);
      if (path) {
        const lastCell = path[path.length - 1];
        if (lastCell[0] === prev.size - 1 && lastCell[1] === prev.size - 1) {
          return { ...prev, hintText: "The current path already reaches the goal! (Check arrows)" };
        }
        const [r, c] = lastCell;
        const dir = prev.grid[r][c];
        return { ...prev, hintText: `Path gets stuck at (${r+1},${c+1}) going ${DIR_NAMES[dir]} - flip it!` };
      }
      return { ...prev, hintText: "Try to create a path from top-left to bottom-right by flipping arrows" };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 3000);
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.moves === 0) return prev;
      // Can't easily undo since we don't track history; just note
      return { ...prev, hintText: "Undo not available - restart to try again" };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      return buildGame(prev.difficulty as Difficulty, Math.random);
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, flipArrow, hint, peek, undo, restart, goToMenu };
}

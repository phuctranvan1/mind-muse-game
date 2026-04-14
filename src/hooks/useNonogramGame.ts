import { useState, useCallback, useRef } from "react";

export type Difficulty =
  | "easy" | "medium" | "hard" | "expert" | "master"
  | "grandmaster" | "genius" | "legend" | "mythic" | "immortal" | "divine";

// ── Puzzle definitions ──────────────────────────────────────────────────────
// Each puzzle is a 2D boolean grid (true = filled)
// We store them as flat arrays of 0/1 strings for conciseness, then expand

type RawGrid = string[]; // each string = one row of '0'/'1'

function expand(raw: RawGrid): boolean[][] {
  return raw.map(row => row.split("").map(c => c === "1"));
}

// 5×5 puzzles
const PUZZLES_5: RawGrid[][] = [
  [["11111"],["10001"],["10001"],["10001"],["11111"]], // square outline
  [["00100"],["01010"],["10001"],["01010"],["00100"]], // diamond
  [["11100"],["10000"],["11100"],["10000"],["10000"]], // F-shape
  [["01110"],["10001"],["10001"],["10001"],["01110"]], // oval
  [["10001"],["11011"],["10101"],["10001"],["10001"]], // pattern
  [["11111"],["10000"],["11110"],["10000"],["11111"]], // E
  [["00100"],["01100"],["00100"],["00100"],["01110"]], // anchor top
  [["11011"],["11011"],["00000"],["11011"],["11011"]], // grid window
];

// 7×7 puzzles
const PUZZLES_7: RawGrid[][] = [
  [["0011100"],["0100010"],["1000001"],["1000001"],["1000001"],["0100010"],["0011100"]], // circle
  [["1111111"],["1000001"],["1011101"],["1010101"],["1011101"],["1000001"],["1111111"]], // nested square
  [["0001000"],["0011100"],["0111110"],["1111111"],["0111110"],["0011100"],["0001000"]], // diamond solid
  [["1100000"],["1100000"],["0011000"],["0011000"],["0000110"],["0000110"],["0000001"]], // staircase
  [["0111110"],["1000001"],["1011101"],["1010101"],["1011101"],["1000001"],["0111110"]], // target
  [["1000001"],["0100010"],["0010100"],["0001000"],["0010100"],["0100010"],["1000001"]], // X
  [["1110111"],["1000001"],["0100010"],["0011100"],["0100010"],["1000001"],["1110111"]], // hourglass
  [["0000000"],["0111110"],["0100010"],["0100010"],["0100010"],["0111110"],["0000000"]], // rect outline
];

// 10×10 puzzles
const PUZZLES_10: RawGrid[][] = [
  // Heart
  [["0110011000"],["1111111000"],["1111111100"],["0111111100"],["0011111000"],["0001110000"],["0000100000"],["0000000000"],["0000000000"],["0000000000"]],
  // Arrow right
  [["0001000000"],["0000100000"],["0000010000"],["1111111100"],["0000010000"],["0000100000"],["0001000000"],["0000000000"],["0000000000"],["0000000000"]],
  // Checkerboard 5x5
  [["1010100000"],["0101010000"],["1010100000"],["0101010000"],["1010100000"],["0000000000"],["0000000000"],["0000000000"],["0000000000"],["0000000000"]],
  // Solid cross
  [["0000100000"],["0000100000"],["0000100000"],["0000100000"],["1111111111"],["0000100000"],["0000100000"],["0000100000"],["0000100000"],["0000100000"]],
  // Spiral-like
  [["1111111110"],["1000000010"],["1011111010"],["1010001010"],["1010101010"],["1010001010"],["1011111010"],["1000000010"],["1111111110"],["0000000000"]],
];

// 12×12 puzzles (partial, rest zeros)
const PUZZLES_12: RawGrid[][] = [
  // Large diamond
  [["000001100000"],["000011110000"],["000111111000"],["001111111100"],["011111111110"],["111111111111"],["011111111110"],["001111111100"],["000111111000"],["000011110000"],["000001100000"],["000000000000"]],
  // Large X
  [["100000000001"],["010000000010"],["001000000100"],["000100001000"],["000010010000"],["000001100000"],["000001100000"],["000010010000"],["000100001000"],["001000000100"],["010000000010"],["100000000001"]],
  // Rings
  [["011111111110"],["100000000001"],["101111111101"],["110000000011"],["110111111011"],["110100000011"],["110100000011"],["110111111011"],["110000000011"],["101111111101"],["100000000001"],["011111111110"]],
];

// 15×15 — too complex to store as patterns; generate procedurally
function generateProceduralGrid(size: number, density: number, rand: () => number): boolean[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rand() < density)
  );
}

const DIFF_CONFIG: Record<Difficulty, { size: number; density: number; usePreset: boolean }> = {
  easy:        { size: 5,  density: 0.55, usePreset: true },
  medium:      { size: 7,  density: 0.55, usePreset: true },
  hard:        { size: 10, density: 0.55, usePreset: true },
  expert:      { size: 10, density: 0.50, usePreset: false },
  master:      { size: 12, density: 0.50, usePreset: true },
  grandmaster: { size: 12, density: 0.45, usePreset: false },
  genius:      { size: 15, density: 0.45, usePreset: false },
  legend:      { size: 15, density: 0.40, usePreset: false },
  mythic:      { size: 18, density: 0.42, usePreset: false },
  immortal:    { size: 20, density: 0.40, usePreset: false },
  divine:      { size: 25, density: 0.38, usePreset: false },
};

function computeClues(grid: boolean[][]): { rowClues: number[][]; colClues: number[][] } {
  const rows = grid.length;
  const cols = grid[0].length;
  const rowClues = grid.map(row => {
    const clues: number[] = [];
    let count = 0;
    for (const cell of row) {
      if (cell) count++;
      else if (count > 0) { clues.push(count); count = 0; }
    }
    if (count > 0) clues.push(count);
    return clues.length ? clues : [0];
  });
  const colClues = Array.from({ length: cols }, (_, c) => {
    const clues: number[] = [];
    let count = 0;
    for (let r = 0; r < rows; r++) {
      if (grid[r][c]) count++;
      else if (count > 0) { clues.push(count); count = 0; }
    }
    if (count > 0) clues.push(count);
    return clues.length ? clues : [0];
  });
  return { rowClues, colClues };
}

function pickPreset(presets: RawGrid[][], rand: () => number): boolean[][] {
  const idx = Math.floor(rand() * presets.length);
  return expand(presets[idx]);
}

function buildGrid(difficulty: Difficulty, rand: () => number): boolean[][] {
  const { size, density, usePreset } = DIFF_CONFIG[difficulty];
  if (usePreset) {
    if (difficulty === "easy") return pickPreset(PUZZLES_5, rand);
    if (difficulty === "medium") return pickPreset(PUZZLES_7, rand);
    if (difficulty === "hard") return pickPreset(PUZZLES_10, rand);
    if (difficulty === "master") return pickPreset(PUZZLES_12, rand);
  }
  return generateProceduralGrid(size, density, rand);
}

export type CellState = "empty" | "filled" | "marked"; // marked = X (user crossed out)

export interface NonogramState {
  difficulty: Difficulty;
  solution: boolean[][];
  grid: CellState[][];
  rowClues: number[][];
  colClues: number[][];
  size: number;
  moves: number;
  mistakes: number;
  won: boolean;
  hintCell: [number, number] | null;
  peeking: boolean;
}

export function useNonogramGame() {
  const [game, setGame] = useState<NonogramState | null>(null);
  const historyRef = useRef<NonogramState[]>([]);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    historyRef.current = [];
    const solution = buildGrid(difficulty, rand);
    const size = solution.length;
    const { rowClues, colClues } = computeClues(solution);
    const grid: CellState[][] = Array.from({ length: size }, () => Array(size).fill("empty"));
    setGame({ difficulty, solution, grid, rowClues, colClues, size, moves: 0, mistakes: 0, won: false, hintCell: null, peeking: false });
  }, []);

  const toggleCell = useCallback((row: number, col: number, markMode = false) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      historyRef.current.push(cloneState(prev));

      const newGrid = prev.grid.map(r => [...r]) as CellState[][];
      const current = newGrid[row][col];

      if (markMode) {
        // Toggle cross mark (for cells player believes are empty)
        newGrid[row][col] = current === "marked" ? "empty" : "marked";
      } else {
        // Toggle fill
        newGrid[row][col] = current === "filled" ? "empty" : "filled";
      }

      // Count mistakes: filled cells that don't match solution
      let mistakes = 0;
      for (let r = 0; r < prev.size; r++) {
        for (let c = 0; c < prev.size; c++) {
          if (newGrid[r][c] === "filled" && !prev.solution[r][c]) mistakes++;
        }
      }

      // Check win: all solution cells filled and no extra fills
      const won = prev.solution.every((sRow, r) =>
        sRow.every((sCell, c) =>
          sCell ? newGrid[r][c] === "filled" : newGrid[r][c] !== "filled"
        )
      );

      return { ...prev, grid: newGrid, moves: prev.moves + 1, mistakes, won, hintCell: null };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setGame(prev);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      // Find an unfilled solution cell
      for (let r = 0; r < prev.size; r++) {
        for (let c = 0; c < prev.size; c++) {
          if (prev.solution[r][c] && prev.grid[r][c] !== "filled") {
            return { ...prev, hintCell: [r, c] };
          }
        }
      }
      return prev;
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    peekTimeout.current = setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 3000);
  }, []);

  const restart = useCallback(() => {
    historyRef.current = [];
    setGame(prev => {
      if (!prev) return prev;
      const grid: CellState[][] = Array.from({ length: prev.size }, () => Array(prev.size).fill("empty"));
      return { ...prev, grid, moves: 0, mistakes: 0, won: false, hintCell: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => {
    historyRef.current = [];
    setGame(null);
  }, []);

  return { game, startGame, toggleCell, undo, hint, peek, restart, goToMenu };
}

function cloneState(state: NonogramState): NonogramState {
  return {
    ...state,
    solution: state.solution.map(r => [...r]),
    grid: state.grid.map(r => [...r]) as CellState[][],
    rowClues: state.rowClues.map(r => [...r]),
    colClues: state.colClues.map(r => [...r]),
  };
}

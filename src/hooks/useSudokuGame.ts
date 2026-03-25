import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius" | "legend";

const CONFIGS: Record<Difficulty, { size: number; removeCount: number }> = {
  easy: { size: 4, removeCount: 4 }, medium: { size: 4, removeCount: 8 },
  hard: { size: 9, removeCount: 35 }, expert: { size: 9, removeCount: 45 },
  master: { size: 9, removeCount: 52 }, grandmaster: { size: 9, removeCount: 56 },
  genius: { size: 9, removeCount: 60 }, legend: { size: 9, removeCount: 64 },
};

function generateSudoku4(rand: () => number): number[][] {
  const grid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  function isValid(grid: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 4; i++) { if (grid[row][i] === num || grid[i][col] === num) return false; }
    const br = Math.floor(row / 2) * 2, bc = Math.floor(col / 2) * 2;
    for (let r = br; r < br + 2; r++) for (let c = bc; c < bc + 2; c++) if (grid[r][c] === num) return false;
    return true;
  }
  function solve(grid: number[][]): boolean {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) {
        const nums = [1, 2, 3, 4].sort(() => rand() - 0.5);
        for (const n of nums) { if (isValid(grid, r, c, n)) { grid[r][c] = n; if (solve(grid)) return true; grid[r][c] = 0; } }
        return false;
      }
    }
    return true;
  }
  solve(grid);
  return grid;
}

function generateSudoku9(rand: () => number): number[][] {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  function isValid(grid: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) { if (grid[row][i] === num || grid[i][col] === num) return false; }
    const br = Math.floor(row / 3) * 3, bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) for (let c = bc; c < bc + 3; c++) if (grid[r][c] === num) return false;
    return true;
  }
  function solve(grid: number[][]): boolean {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => rand() - 0.5);
        for (const n of nums) { if (isValid(grid, r, c, n)) { grid[r][c] = n; if (solve(grid)) return true; grid[r][c] = 0; } }
        return false;
      }
    }
    return true;
  }
  solve(grid);
  return grid;
}

function removeCells(solution: number[][], count: number, rand: () => number): number[][] {
  const puzzle = solution.map(r => [...r]);
  const size = solution.length;
  const positions: [number, number][] = [];
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) positions.push([r, c]);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  for (let i = 0; i < Math.min(count, positions.length); i++) {
    const [r, c] = positions[i];
    puzzle[r][c] = 0;
  }
  return puzzle;
}

export interface SudokuState {
  puzzle: number[][]; solution: number[][]; playerGrid: number[][];
  size: number; difficulty: Difficulty; selectedCell: [number, number] | null;
  mistakes: number; won: boolean; fixedCells: boolean[][];
  peeking: boolean;
}

export function useSudokuGame() {
  const [game, setGame] = useState<SudokuState | null>(null);
  const historyRef = useRef<{ playerGrid: number[][]; mistakes: number }[]>([]);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const config = CONFIGS[difficulty];
    const solution = config.size === 4 ? generateSudoku4(rand) : generateSudoku9(rand);
    const puzzle = removeCells(solution, config.removeCount, rand);
    const fixedCells = puzzle.map(r => r.map(v => v !== 0));
    historyRef.current = [];
    setGame({
      puzzle: puzzle.map(r => [...r]), solution, playerGrid: puzzle.map(r => [...r]),
      size: config.size, difficulty, selectedCell: null, mistakes: 0, won: false,
      fixedCells, peeking: false,
    });
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      if (prev.fixedCells[row][col]) return prev;
      return { ...prev, selectedCell: [row, col] };
    });
  }, []);

  const enterNumber = useCallback((num: number) => {
    setGame(prev => {
      if (!prev || prev.won || !prev.selectedCell) return prev;
      const [r, c] = prev.selectedCell;
      if (prev.fixedCells[r][c]) return prev;
      historyRef.current.push({ playerGrid: prev.playerGrid.map(row => [...row]), mistakes: prev.mistakes });
      const newGrid = prev.playerGrid.map(row => [...row]);
      newGrid[r][c] = num;
      const isCorrect = num === prev.solution[r][c];
      const mistakes = isCorrect ? prev.mistakes : prev.mistakes + 1;
      const won = newGrid.every((row, ri) => row.every((v, ci) => v === prev.solution[ri][ci]));
      return { ...prev, playerGrid: newGrid, mistakes, won };
    });
  }, []);

  const clearCell = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || !prev.selectedCell) return prev;
      const [r, c] = prev.selectedCell;
      if (prev.fixedCells[r][c]) return prev;
      historyRef.current.push({ playerGrid: prev.playerGrid.map(row => [...row]), mistakes: prev.mistakes });
      const newGrid = prev.playerGrid.map(row => [...row]);
      newGrid[r][c] = 0;
      return { ...prev, playerGrid: newGrid };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setGame(g => g ? { ...g, playerGrid: prev.playerGrid, mistakes: prev.mistakes, won: false } : g);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      // Find first empty or wrong cell and fill it correctly
      for (let r = 0; r < prev.size; r++) {
        for (let c = 0; c < prev.size; c++) {
          if (!prev.fixedCells[r][c] && prev.playerGrid[r][c] !== prev.solution[r][c]) {
            const newGrid = prev.playerGrid.map(row => [...row]);
            newGrid[r][c] = prev.solution[r][c];
            const won = newGrid.every((row, ri) => row.every((v, ci) => v === prev.solution[ri][ci]));
            return { ...prev, playerGrid: newGrid, won, selectedCell: [r, c] };
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
    }, 2000);
  }, []);

  const restart = useCallback(() => {
    historyRef.current = [];
    setGame(prev => {
      if (!prev) return null;
      return { ...prev, playerGrid: prev.puzzle.map(r => [...r]), mistakes: 0, won: false, selectedCell: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => { historyRef.current = []; setGame(null); }, []);

  return { game, startGame, selectCell, enterNumber, clearCell, undo, hint, peek, restart, goToMenu };
}

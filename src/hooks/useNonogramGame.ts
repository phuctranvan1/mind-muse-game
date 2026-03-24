import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const SIZES: Record<Difficulty, number> = {
  easy: 5, medium: 7, hard: 10, expert: 12, master: 15, grandmaster: 18, genius: 20,
};

export interface NonogramState {
  solution: boolean[][];
  board: (boolean | null)[][];
  rowClues: number[][];
  colClues: number[][];
  rows: number;
  cols: number;
  won: boolean;
  mistakes: number;
  difficulty: Difficulty;
  hintCell: [number, number] | null;
  peeking: boolean;
  moves: number;
}

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateSolution(rows: number, cols: number, rand: () => number): boolean[][] {
  // ~50% fill density
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => rand() > 0.45)
  );
}

function computeClues(line: boolean[]): number[] {
  const clues: number[] = [];
  let count = 0;
  for (const cell of line) {
    if (cell) count++;
    else if (count > 0) { clues.push(count); count = 0; }
  }
  if (count > 0) clues.push(count);
  return clues.length > 0 ? clues : [0];
}

function checkWin(board: (boolean | null)[][], solution: boolean[][]): boolean {
  for (let r = 0; r < solution.length; r++) {
    for (let c = 0; c < solution[0].length; c++) {
      if ((board[r][c] === true) !== solution[r][c]) return false;
    }
  }
  return true;
}

function makeState(difficulty: Difficulty, rand: () => number): NonogramState {
  const size = SIZES[difficulty];
  const solution = generateSolution(size, size, rand);
  const rowClues = solution.map(row => computeClues(row));
  const colClues = Array.from({ length: size }, (_, c) =>
    computeClues(solution.map(row => row[c]))
  );
  const board: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  return {
    solution,
    board,
    rowClues,
    colClues,
    rows: size,
    cols: size,
    won: false,
    mistakes: 0,
    difficulty,
    hintCell: null,
    peeking: false,
    moves: 0,
  };
}

export function useNonogramGame() {
  const [game, setGame] = useState<NonogramState | null>(null);
  const historyRef = useRef<{ board: (boolean | null)[][]; mistakes: number; moves: number }[]>([]);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const randRef = useRef<(() => number) | null>(null);
  const diffRef = useRef<Difficulty>("easy");

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    randRef.current = rand;
    diffRef.current = difficulty;
    historyRef.current = [];
    setGame(makeState(difficulty, rand));
  }, []);

  const toggleCell = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      historyRef.current.push({ board: prev.board.map(r => [...r]), mistakes: prev.mistakes, moves: prev.moves });
      const board = prev.board.map(r => [...r]);
      if (board[row][col] === null) board[row][col] = true;
      else if (board[row][col] === true) board[row][col] = false;
      else board[row][col] = null;
      const newMistakes = board[row][col] === true && !prev.solution[row][col]
        ? prev.mistakes + 1
        : prev.mistakes;
      const won = checkWin(board, prev.solution);
      return { ...prev, board, won, mistakes: newMistakes, hintCell: null, moves: prev.moves + 1 };
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
      // Find a cell that is wrong or null
      for (let r = 0; r < prev.rows; r++) {
        for (let c = 0; c < prev.cols; c++) {
          if (prev.board[r][c] !== (prev.solution[r][c] ? true : false) && prev.board[r][c] === null) {
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

  const goToMenu = useCallback(() => {
    historyRef.current = [];
    setGame(null);
  }, []);

  return { game, startGame, toggleCell, undo, restart, hint, peek, goToMenu };
}

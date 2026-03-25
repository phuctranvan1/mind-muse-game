import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius" | "legend" | "mythic" | "immortal" | "divine";

const BOARD_SIZES: Record<Difficulty, number> = {
  easy: 4, medium: 5, hard: 6, expert: 7, master: 8, grandmaster: 9, genius: 10, legend: 12,
};

function getConflicts(queens: (number | null)[]): Set<number> {
  const conflicts = new Set<number>();
  for (let i = 0; i < queens.length; i++) {
    if (queens[i] === null) continue;
    for (let j = i + 1; j < queens.length; j++) {
      if (queens[j] === null) continue;
      if (queens[i] === queens[j] || Math.abs(queens[i]! - queens[j]!) === Math.abs(i - j)) {
        conflicts.add(i); conflicts.add(j);
      }
    }
  }
  return conflicts;
}

function solveNQueens(size: number): (number | null)[] | null {
  const queens: (number | null)[] = Array(size).fill(null);
  function solve(row: number): boolean {
    if (row === size) return true;
    for (let col = 0; col < size; col++) {
      queens[row] = col;
      if (getConflicts(queens).size === 0 && solve(row + 1)) return true;
      queens[row] = null;
    }
    return false;
  }
  return solve(0) ? queens : null;
}

export interface NQueensState {
  boardSize: number; queens: (number | null)[]; difficulty: Difficulty;
  won: boolean; conflicts: Set<number>;
  hintQueen: [number, number] | null; peeking: boolean;
  solution: (number | null)[] | null;
}

export function useNQueensGame() {
  const [game, setGame] = useState<NQueensState | null>(null);
  const historyRef = useRef<(number | null)[][]>([]);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty) => {
    const size = BOARD_SIZES[difficulty];
    historyRef.current = [];
    const solution = solveNQueens(size);
    setGame({
      boardSize: size, queens: Array(size).fill(null), difficulty,
      won: false, conflicts: new Set(), hintQueen: null, peeking: false, solution,
    });
  }, []);

  const toggleQueen = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      historyRef.current.push([...prev.queens]);
      const newQueens = [...prev.queens];
      newQueens[row] = newQueens[row] === col ? null : col;
      const conflicts = getConflicts(newQueens);
      const placed = newQueens.filter(q => q !== null).length;
      const won = placed === prev.boardSize && conflicts.size === 0;
      return { ...prev, queens: newQueens, conflicts, won, hintQueen: null };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) {
      setGame(g => {
        if (!g) return g;
        const conflicts = getConflicts(prev);
        return { ...g, queens: prev, conflicts, won: false, hintQueen: null };
      });
    }
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || !prev.solution) return prev;
      // Find first row where queen is not correctly placed
      for (let r = 0; r < prev.boardSize; r++) {
        if (prev.queens[r] !== prev.solution[r]) {
          return { ...prev, hintQueen: [r, prev.solution[r]!] };
        }
      }
      return prev;
    });
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, hintQueen: null } : prev);
    }, 2000);
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
    setGame(prev => prev ? {
      ...prev, queens: Array(prev.boardSize).fill(null), won: false,
      conflicts: new Set(), hintQueen: null, peeking: false,
    } : null);
  }, []);

  const goToMenu = useCallback(() => { historyRef.current = []; setGame(null); }, []);

  return { game, startGame, toggleQueen, undo, hint, peek, restart, goToMenu };
}

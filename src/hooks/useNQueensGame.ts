import { useState, useCallback } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const BOARD_SIZES: Record<Difficulty, number> = {
  easy: 4, medium: 5, hard: 6, expert: 7, master: 8, grandmaster: 9, genius: 10,
};

function getConflicts(queens: (number | null)[]): Set<number> {
  const conflicts = new Set<number>();
  for (let i = 0; i < queens.length; i++) {
    if (queens[i] === null) continue;
    for (let j = i + 1; j < queens.length; j++) {
      if (queens[j] === null) continue;
      if (queens[i] === queens[j] || Math.abs(queens[i]! - queens[j]!) === Math.abs(i - j)) {
        conflicts.add(i);
        conflicts.add(j);
      }
    }
  }
  return conflicts;
}

export interface NQueensState {
  boardSize: number;
  queens: (number | null)[]; // queens[row] = col or null
  difficulty: Difficulty;
  won: boolean;
  conflicts: Set<number>;
}

export function useNQueensGame() {
  const [game, setGame] = useState<NQueensState | null>(null);

  const startGame = useCallback((difficulty: Difficulty) => {
    const size = BOARD_SIZES[difficulty];
    setGame({
      boardSize: size,
      queens: Array(size).fill(null),
      difficulty,
      won: false,
      conflicts: new Set(),
    });
  }, []);

  const toggleQueen = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const newQueens = [...prev.queens];
      if (newQueens[row] === col) {
        newQueens[row] = null;
      } else {
        newQueens[row] = col;
      }
      const conflicts = getConflicts(newQueens);
      const placed = newQueens.filter(q => q !== null).length;
      const won = placed === prev.boardSize && conflicts.size === 0;
      return { ...prev, queens: newQueens, conflicts, won };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => prev ? {
      ...prev, queens: Array(prev.boardSize).fill(null), won: false, conflicts: new Set(),
    } : null);
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, toggleQueen, restart, goToMenu };
}

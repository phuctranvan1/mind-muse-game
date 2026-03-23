import { useState, useCallback } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master";

const GRID_SIZES: Record<Difficulty, number> = { easy: 3, medium: 4, hard: 5, expert: 6, master: 7 };

function generateBoard(size: number, rand: () => number = Math.random): boolean[][] {
  const board = Array.from({ length: size }, () => Array(size).fill(false));
  const presses = Math.max(size * 2, 8);
  for (let p = 0; p < presses; p++) {
    const r = Math.floor(rand() * size);
    const c = Math.floor(rand() * size);
    toggle(board, r, c, size);
  }
  if (board.every(row => row.every(cell => !cell))) {
    toggle(board, 0, 0, size);
  }
  return board;
}

function toggle(board: boolean[][], r: number, c: number, size: number) {
  const dirs = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      board[nr][nc] = !board[nr][nc];
    }
  }
}

export interface LightsOutState {
  board: boolean[][];
  gridSize: number;
  difficulty: Difficulty;
  moves: number;
  won: boolean;
}

export function useLightsOutGame() {
  const [game, setGame] = useState<LightsOutState | null>(null);

  const startGame = useCallback((difficulty: Difficulty) => {
    const size = GRID_SIZES[difficulty];
    setGame({ board: generateBoard(size), gridSize: size, difficulty, moves: 0, won: false });
  }, []);

  const toggleCell = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const newBoard = prev.board.map(r => [...r]);
      toggle(newBoard, row, col, prev.gridSize);
      const won = newBoard.every(r => r.every(c => !c));
      return { ...prev, board: newBoard, moves: prev.moves + 1, won };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => prev ? { ...prev, board: generateBoard(prev.gridSize), moves: 0, won: false } : null);
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, toggleCell, restart, goToMenu };
}

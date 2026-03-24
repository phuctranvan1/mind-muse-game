import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const GRID_SIZES: Record<Difficulty, number> = { easy: 3, medium: 4, hard: 5, expert: 6, master: 7, grandmaster: 8, genius: 9 };

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

function findHintCell(board: boolean[][], size: number): [number, number] | null {
  // Find a lit cell to suggest toggling
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c]) return [r, c];
  return null;
}

export interface LightsOutState {
  board: boolean[][]; gridSize: number; difficulty: Difficulty;
  moves: number; won: boolean; hintCell: [number, number] | null; peeking: boolean;
}

export function useLightsOutGame() {
  const [game, setGame] = useState<LightsOutState | null>(null);
  const historyRef = useRef<LightsOutState[]>([]);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const size = GRID_SIZES[difficulty];
    historyRef.current = [];
    setGame({ board: generateBoard(size, rand), gridSize: size, difficulty, moves: 0, won: false, hintCell: null, peeking: false });
  }, []);

  const toggleCell = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      historyRef.current.push({ ...prev, board: prev.board.map(r => [...r]) });
      const newBoard = prev.board.map(r => [...r]);
      toggle(newBoard, row, col, prev.gridSize);
      const won = newBoard.every(r => r.every(c => !c));
      return { ...prev, board: newBoard, moves: prev.moves + 1, won, hintCell: null };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setGame(prev);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      return { ...prev, hintCell: findHintCell(prev.board, prev.gridSize) };
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
    setGame(prev => prev ? { ...prev, board: generateBoard(prev.gridSize), moves: 0, won: false, hintCell: null, peeking: false } : null);
  }, []);

  const goToMenu = useCallback(() => { historyRef.current = []; setGame(null); }, []);

  return { game, startGame, toggleCell, undo, hint, peek, restart, goToMenu };
}

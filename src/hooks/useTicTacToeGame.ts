import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

interface TTTConfig {
  size: number;
  winLen: number;
}

const CONFIGS: Record<Difficulty, TTTConfig> = {
  easy:        { size: 3, winLen: 3 },
  medium:      { size: 4, winLen: 3 },
  hard:        { size: 4, winLen: 4 },
  expert:      { size: 5, winLen: 4 },
  master:      { size: 5, winLen: 5 },
  grandmaster: { size: 6, winLen: 4 },
  genius:      { size: 6, winLen: 5 },
  legend:      { size: 7, winLen: 5 },
  mythic:      { size: 7, winLen: 6 },
  immortal:    { size: 8, winLen: 5 },
  divine:      { size: 8, winLen: 6 },
};

function checkWinner(board: (0 | 1 | null)[], size: number, winLen: number): 0 | 1 | null {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const player = board[r * size + c];
      if (player === null) continue;
      for (const [dr, dc] of dirs) {
        let count = 1;
        for (let k = 1; k < winLen; k++) {
          const nr = r + k * dr, nc = c + k * dc;
          if (nr < 0 || nr >= size || nc < 0 || nc >= size) break;
          if (board[nr * size + nc] !== player) break;
          count++;
        }
        if (count >= winLen) return player;
      }
    }
  }
  return null;
}

function isDraw(board: (0 | 1 | null)[]): boolean {
  return board.every(c => c !== null);
}

function aiMove(board: (0 | 1 | null)[], size: number, winLen: number): number {
  // Try to win
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) continue;
    board[i] = 1;
    if (checkWinner(board, size, winLen) === 1) { board[i] = null; return i; }
    board[i] = null;
  }
  // Block player
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) continue;
    board[i] = 0;
    if (checkWinner(board, size, winLen) === 0) { board[i] = null; return i; }
    board[i] = null;
  }
  // Center
  const center = Math.floor(size / 2) * size + Math.floor(size / 2);
  if (board[center] === null) return center;
  // Random
  const empty = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
  return empty[Math.floor(Math.random() * empty.length)];
}

export interface TicTacToeState {
  board: (0 | 1 | null)[];
  size: number;
  winLen: number;
  currentPlayer: 0 | 1;
  winner: 0 | 1 | null;
  draw: boolean;
  won: boolean;
  lost: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
  winningCells: number[];
}

function findWinningCells(board: (0 | 1 | null)[], size: number, winLen: number, player: 0 | 1): number[] {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r * size + c] !== player) continue;
      for (const [dr, dc] of dirs) {
        const cells: number[] = [r * size + c];
        for (let k = 1; k < winLen; k++) {
          const nr = r + k * dr, nc = c + k * dc;
          if (nr < 0 || nr >= size || nc < 0 || nc >= size) break;
          if (board[nr * size + nc] !== player) break;
          cells.push(nr * size + nc);
        }
        if (cells.length === winLen) return cells;
      }
    }
  }
  return [];
}

export function useTicTacToeGame() {
  const [game, setGame] = useState<TicTacToeState | null>(null);

  const startGame = useCallback((difficulty: Difficulty) => {
    const cfg = CONFIGS[difficulty];
    setGame({
      board: Array(cfg.size * cfg.size).fill(null),
      size: cfg.size, winLen: cfg.winLen,
      currentPlayer: 0, winner: null, draw: false,
      won: false, lost: false, moves: 0, difficulty,
      hintText: null, peeking: false, winningCells: [],
    });
  }, []);

  const placeMark = useCallback((index: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.draw || prev.board[index] !== null || prev.currentPlayer !== 0) return prev;
      const board = [...prev.board];
      board[index] = 0;
      const winner = checkWinner(board, prev.size, prev.winLen);
      const draw = !winner && isDraw(board);
      if (winner !== null || draw) {
        const winCells = winner !== null ? findWinningCells(board, prev.size, prev.winLen, winner) : [];
        return { ...prev, board, winner, draw, won: winner === 0, lost: winner === 1, moves: prev.moves + 1, hintText: null, winningCells: winCells };
      }
      // AI move
      const aiIdx = aiMove([...board], prev.size, prev.winLen);
      board[aiIdx] = 1;
      const winner2 = checkWinner(board, prev.size, prev.winLen);
      const draw2 = !winner2 && isDraw(board);
      const winCells2 = winner2 !== null ? findWinningCells(board, prev.size, prev.winLen, winner2) : [];
      return { ...prev, board, winner: winner2, draw: draw2, won: winner2 === 0, lost: winner2 === 1, currentPlayer: 0, moves: prev.moves + 1, hintText: null, winningCells: winCells2 };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      // Find best move for player (defensive)
      const board = [...prev.board];
      for (let i = 0; i < board.length; i++) {
        if (board[i] !== null) continue;
        board[i] = 0;
        if (checkWinner(board, prev.size, prev.winLen) === 0) {
          board[i] = null;
          const r = Math.floor(i / prev.size) + 1, c = (i % prev.size) + 1;
          return { ...prev, hintText: `Try row ${r}, col ${c} to win!` };
        }
        board[i] = null;
      }
      return { ...prev, hintText: "Look for opportunities to block the AI or create threats." };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 2000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      return { ...prev, board: Array(cfg.size * cfg.size).fill(null), currentPlayer: 0, winner: null, draw: false, won: false, lost: false, hintText: null, peeking: false, moves: 0, winningCells: [] };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, placeMark, hint, peek, restart, goToMenu };
}

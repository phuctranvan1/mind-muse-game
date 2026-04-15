import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

interface Connect4Config {
  rows: number;
  cols: number;
  winLen: number;
}

const CONFIGS: Record<Difficulty, Connect4Config> = {
  easy:        { rows: 6, cols: 7, winLen: 4 },
  medium:      { rows: 6, cols: 7, winLen: 4 },
  hard:        { rows: 6, cols: 7, winLen: 4 },
  expert:      { rows: 7, cols: 8, winLen: 4 },
  master:      { rows: 7, cols: 8, winLen: 4 },
  grandmaster: { rows: 7, cols: 8, winLen: 5 },
  genius:      { rows: 8, cols: 9, winLen: 4 },
  legend:      { rows: 8, cols: 9, winLen: 5 },
  mythic:      { rows: 8, cols: 9, winLen: 5 },
  immortal:    { rows: 9, cols: 10,winLen: 5 },
  divine:      { rows: 9, cols: 10,winLen: 5 },
};

type Cell = null | 0 | 1; // 0=player, 1=AI

function checkWin(board: Cell[][], rows: number, cols: number, winLen: number, r: number, c: number, player: 0 | 1): boolean {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (let k = 1; k < winLen; k++) {
      const nr = r + k * dr, nc = c + k * dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== player) break;
      count++;
    }
    for (let k = 1; k < winLen; k++) {
      const nr = r - k * dr, nc = c - k * dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== player) break;
      count++;
    }
    if (count >= winLen) return true;
  }
  return false;
}

function isDraw(board: Cell[][], rows: number, cols: number): boolean {
  return board[0].every(c => c !== null);
}

function dropDisc(board: Cell[][], rows: number, col: number, player: 0 | 1): { newBoard: Cell[][]; row: number } | null {
  for (let r = rows - 1; r >= 0; r--) {
    if (board[r][col] === null) {
      const newBoard = board.map(row => [...row]);
      newBoard[r][col] = player;
      return { newBoard, row: r };
    }
  }
  return null;
}

function aiChooseColumn(board: Cell[][], rows: number, cols: number, winLen: number): number {
  // Win
  for (let c = 0; c < cols; c++) {
    const result = dropDisc(board, rows, c, 1);
    if (result && checkWin(result.newBoard, rows, cols, winLen, result.row, c, 1)) return c;
  }
  // Block
  for (let c = 0; c < cols; c++) {
    const result = dropDisc(board, rows, c, 0);
    if (result && checkWin(result.newBoard, rows, cols, winLen, result.row, c, 0)) return c;
  }
  // Center
  const center = Math.floor(cols / 2);
  if (board[0][center] === null) return center;
  // Random non-full
  const valid = Array.from({ length: cols }, (_, i) => i).filter(c => board[0][c] === null);
  return valid[Math.floor(Math.random() * valid.length)] ?? 0;
}

export interface Connect4State {
  board: Cell[][];
  rows: number;
  cols: number;
  winLen: number;
  won: boolean;
  lost: boolean;
  draw: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
  lastDrop: { row: number; col: number } | null;
}

export function useConnect4Game() {
  const [game, setGame] = useState<Connect4State | null>(null);

  const startGame = useCallback((difficulty: Difficulty) => {
    const cfg = CONFIGS[difficulty];
    setGame({
      board: Array.from({ length: cfg.rows }, () => Array(cfg.cols).fill(null)),
      rows: cfg.rows, cols: cfg.cols, winLen: cfg.winLen,
      won: false, lost: false, draw: false, moves: 0, difficulty,
      hintText: null, peeking: false, lastDrop: null,
    });
  }, []);

  const dropInColumn = useCallback((col: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.draw) return prev;
      const result = dropDisc(prev.board, prev.rows, col, 0);
      if (!result) return { ...prev, hintText: "Column is full!" };
      const { newBoard, row } = result;
      if (checkWin(newBoard, prev.rows, prev.cols, prev.winLen, row, col, 0)) {
        return { ...prev, board: newBoard, won: true, moves: prev.moves + 1, lastDrop: { row, col }, hintText: null };
      }
      if (isDraw(newBoard, prev.rows, prev.cols)) {
        return { ...prev, board: newBoard, draw: true, moves: prev.moves + 1, lastDrop: { row, col }, hintText: null };
      }
      // AI move
      const aiCol = aiChooseColumn(newBoard, prev.rows, prev.cols, prev.winLen);
      const aiResult = dropDisc(newBoard, prev.rows, aiCol, 1);
      if (!aiResult) return { ...prev, board: newBoard, moves: prev.moves + 1, lastDrop: { row, col }, hintText: null };
      const { newBoard: finalBoard, row: aiRow } = aiResult;
      const lost = checkWin(finalBoard, prev.rows, prev.cols, prev.winLen, aiRow, aiCol, 1);
      const draw2 = !lost && isDraw(finalBoard, prev.rows, prev.cols);
      return { ...prev, board: finalBoard, lost, draw: draw2, moves: prev.moves + 1, lastDrop: { row: aiRow, col: aiCol }, hintText: null };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.draw) return prev;
      // Find winning move
      for (let c = 0; c < prev.cols; c++) {
        const result = dropDisc(prev.board, prev.rows, c, 0);
        if (result && checkWin(result.newBoard, prev.rows, prev.cols, prev.winLen, result.row, c, 0)) {
          return { ...prev, hintText: `Column ${c + 1} wins!` };
        }
      }
      return { ...prev, hintText: "Try the center or block the AI's moves" };
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
      return { ...prev, board: Array.from({ length: cfg.rows }, () => Array(cfg.cols).fill(null)), won: false, lost: false, draw: false, moves: 0, hintText: null, peeking: false, lastDrop: null };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, dropInColumn, hint, peek, restart, goToMenu };
}

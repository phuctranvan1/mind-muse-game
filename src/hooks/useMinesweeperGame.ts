import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius" | "legend";

interface Config { rows: number; cols: number; mines: number }

const CONFIGS: Record<Difficulty, Config> = {
  easy:        { rows: 8,  cols: 8,  mines: 10 },
  medium:      { rows: 10, cols: 10, mines: 20 },
  hard:        { rows: 12, cols: 12, mines: 30 },
  expert:      { rows: 14, cols: 14, mines: 45 },
  master:      { rows: 16, cols: 16, mines: 60 },
  grandmaster: { rows: 18, cols: 18, mines: 80 },
  genius:      { rows: 20, cols: 20, mines: 100 },
  legend:      { rows: 24, cols: 24, mines: 130 },
};

export interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

export interface MinesweeperState {
  grid: CellState[][];
  rows: number;
  cols: number;
  mines: number;
  flagsPlaced: number;
  revealedCount: number;
  totalSafe: number;
  won: boolean;
  lost: boolean;
  firstClick: boolean;
  difficulty: Difficulty;
  hintCell: [number, number] | null;
  peeking: boolean;
  moves: number;
}

function buildEmptyGrid(rows: number, cols: number): CellState[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0,
    }))
  );
}

function placeMines(
  grid: CellState[][],
  rows: number,
  cols: number,
  mines: number,
  safeRow: number,
  safeCol: number,
  rng: () => number
): CellState[][] {
  const newGrid = grid.map(r => r.map(c => ({ ...c })));
  let placed = 0;
  const forbidden = new Set<string>();
  // Protect the first-click cell and its neighbours
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeRow + dr;
      const nc = safeCol + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        forbidden.add(`${nr},${nc}`);
      }
    }
  }

  while (placed < mines) {
    const r = Math.floor(rng() * rows);
    const c = Math.floor(rng() * cols);
    if (!newGrid[r][c].isMine && !forbidden.has(`${r},${c}`)) {
      newGrid[r][c].isMine = true;
      placed++;
    }
  }

  // Compute neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newGrid[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
              count++;
            }
          }
        }
        newGrid[r][c].neighborCount = count;
      }
    }
  }

  return newGrid;
}

function floodReveal(
  grid: CellState[][],
  rows: number,
  cols: number,
  startRow: number,
  startCol: number
): { grid: CellState[][]; revealed: number } {
  const newGrid = grid.map(r => r.map(c => ({ ...c })));
  let revealed = 0;
  const queue: [number, number][] = [[startRow, startCol]];
  const visited = new Set<string>([`${startRow},${startCol}`]);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (newGrid[r][c].isRevealed || newGrid[r][c].isMine || newGrid[r][c].isFlagged) continue;
    newGrid[r][c].isRevealed = true;
    revealed++;
    if (newGrid[r][c].neighborCount === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          const key = `${nr},${nc}`;
          if (
            nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
            !visited.has(key) && !newGrid[nr][nc].isRevealed && !newGrid[nr][nc].isMine
          ) {
            visited.add(key);
            queue.push([nr, nc]);
          }
        }
      }
    }
  }

  return { grid: newGrid, revealed };
}

function countRevealed(grid: CellState[][]): number {
  return grid.reduce((total, row) => total + row.filter(c => c.isRevealed).length, 0);
}

export function useMinesweeperGame() {
  const [game, setGame] = useState<MinesweeperState | null>(null);
  const rngRef = useRef<(() => number) | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rng?: () => number) => {
    const { rows, cols, mines } = CONFIGS[difficulty];
    rngRef.current = rng ?? Math.random;
    const grid = buildEmptyGrid(rows, cols);
    const totalSafe = rows * cols - mines;
    setGame({
      grid, rows, cols, mines, flagsPlaced: 0,
      revealedCount: 0, totalSafe,
      won: false, lost: false, firstClick: true,
      difficulty, hintCell: null, peeking: false, moves: 0,
    });
  }, []);

  const revealCell = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const cell = prev.grid[row][col];
      if (cell.isRevealed || cell.isFlagged) return prev;

      let grid = prev.grid.map(r => r.map(c => ({ ...c })));
      let firstClick = prev.firstClick;

      // On first click: place mines avoiding first cell
      if (firstClick) {
        firstClick = false;
        grid = placeMines(grid, prev.rows, prev.cols, prev.mines, row, col, rngRef.current ?? Math.random);
      }

      // Hit a mine
      if (grid[row][col].isMine) {
        const revealedGrid = grid.map(r =>
          r.map(c => ({ ...c, isRevealed: c.isMine ? true : c.isRevealed }))
        );
        return { ...prev, grid: revealedGrid, lost: true, firstClick: false };
      }

      const { grid: newGrid, revealed } = floodReveal(grid, prev.rows, prev.cols, row, col);
      const revealedCount = countRevealed(newGrid);
      const won = revealedCount >= prev.totalSafe;
      return {
        ...prev, grid: newGrid, firstClick,
        revealedCount, won, moves: prev.moves + 1, hintCell: null,
      };
    });
  }, []);

  const toggleFlag = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const cell = prev.grid[row][col];
      if (cell.isRevealed) return prev;
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
      const flagsPlaced = prev.flagsPlaced + (newGrid[row][col].isFlagged ? 1 : -1);
      return { ...prev, grid: newGrid, flagsPlaced, hintCell: null };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.firstClick) return prev;
      // Find a safe unrevealed, unflagged cell
      for (let r = 0; r < prev.rows; r++) {
        for (let c = 0; c < prev.cols; c++) {
          const cell = prev.grid[r][c];
          if (!cell.isRevealed && !cell.isFlagged && !cell.isMine) {
            return { ...prev, hintCell: [r, c] };
          }
        }
      }
      return prev;
    });
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, hintCell: null } : prev);
    }, 2000);
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    peekTimeout.current = setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const undo = useCallback(() => {
    // Minesweeper doesn't support undo once a mine is hit,
    // but we allow restarting if lost
    setGame(prev => {
      if (!prev || !prev.lost) return prev;
      const grid = buildEmptyGrid(prev.rows, prev.cols);
      return {
        ...prev, grid,
        revealedCount: 0, flagsPlaced: 0,
        won: false, lost: false, firstClick: true,
        hintCell: null, peeking: false, moves: 0,
      };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const grid = buildEmptyGrid(prev.rows, prev.cols);
      return {
        ...prev, grid,
        revealedCount: 0, flagsPlaced: 0,
        won: false, lost: false, firstClick: true,
        hintCell: null, peeking: false, moves: 0,
      };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, revealCell, toggleFlag, hint, peek, undo, restart, goToMenu };
}

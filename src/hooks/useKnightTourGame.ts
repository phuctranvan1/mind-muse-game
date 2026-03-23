import { useState, useCallback } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const BOARD_SIZES: Record<Difficulty, number> = {
  easy: 5, medium: 5, hard: 6, expert: 6, master: 7, grandmaster: 8, genius: 8,
};
const MOVE_LIMITS: Record<Difficulty, number | null> = {
  easy: null, medium: null, hard: null, expert: 50, master: 60, grandmaster: 80, genius: 75,
};

const KNIGHT_MOVES = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

function getValidMoves(row: number, col: number, size: number, visited: boolean[][]): [number, number][] {
  return KNIGHT_MOVES
    .map(([dr, dc]) => [row + dr, col + dc] as [number, number])
    .filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size && !visited[r][c]);
}

export interface KnightTourState {
  boardSize: number;
  visited: boolean[][];
  path: [number, number][];
  difficulty: Difficulty;
  won: boolean;
  stuck: boolean;
  moveLimit: number | null;
  validMoves: [number, number][];
}

export function useKnightTourGame() {
  const [game, setGame] = useState<KnightTourState | null>(null);

  const startGame = useCallback((difficulty: Difficulty) => {
    const size = BOARD_SIZES[difficulty];
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    setGame({
      boardSize: size,
      visited,
      path: [],
      difficulty,
      won: false,
      stuck: false,
      moveLimit: MOVE_LIMITS[difficulty],
      validMoves: [],
    });
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.stuck) return prev;
      
      // First move - place knight anywhere
      if (prev.path.length === 0) {
        const newVisited = prev.visited.map(r => [...r]);
        newVisited[row][col] = true;
        const newPath: [number, number][] = [[row, col]];
        const validMoves = getValidMoves(row, col, prev.boardSize, newVisited);
        return { ...prev, visited: newVisited, path: newPath, validMoves };
      }

      // Check if this is a valid knight move from current position
      const isValid = prev.validMoves.some(([r, c]) => r === row && c === col);
      if (!isValid) return prev;

      const newVisited = prev.visited.map(r => [...r]);
      newVisited[row][col] = true;
      const newPath: [number, number][] = [...prev.path, [row, col]];
      const totalCells = prev.boardSize * prev.boardSize;
      const won = newPath.length === totalCells;
      const validMoves = won ? [] : getValidMoves(row, col, prev.boardSize, newVisited);
      const stuck = !won && validMoves.length === 0;

      if (prev.moveLimit !== null && newPath.length > prev.moveLimit && !won) {
        return { ...prev, visited: newVisited, path: newPath, validMoves: [], stuck: true };
      }

      return { ...prev, visited: newVisited, path: newPath, won, stuck, validMoves };
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.path.length === 0) return prev;
      const newPath = prev.path.slice(0, -1);
      const newVisited = Array.from({ length: prev.boardSize }, () => Array(prev.boardSize).fill(false));
      newPath.forEach(([r, c]) => { newVisited[r][c] = true; });
      const validMoves = newPath.length > 0
        ? getValidMoves(newPath[newPath.length - 1][0], newPath[newPath.length - 1][1], prev.boardSize, newVisited)
        : [];
      return { ...prev, visited: newVisited, path: newPath, won: false, stuck: false, validMoves };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => prev ? {
      ...prev,
      visited: Array.from({ length: prev.boardSize }, () => Array(prev.boardSize).fill(false)),
      path: [], won: false, stuck: false, validMoves: [],
    } : null);
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectCell, undo, restart, goToMenu };
}

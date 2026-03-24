import { useState, useCallback, useRef } from "react";

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

// Warnsdorff's rule: pick the move with fewest onward moves
function getBestMove(row: number, col: number, size: number, visited: boolean[][]): [number, number] | null {
  const moves = getValidMoves(row, col, size, visited);
  if (moves.length === 0) return null;
  moves.sort((a, b) => {
    const aNext = getValidMoves(a[0], a[1], size, visited).length;
    const bNext = getValidMoves(b[0], b[1], size, visited).length;
    return aNext - bNext;
  });
  return moves[0];
}

export interface KnightTourState {
  boardSize: number; visited: boolean[][]; path: [number, number][];
  difficulty: Difficulty; won: boolean; stuck: boolean;
  moveLimit: number | null; validMoves: [number, number][];
  hintCell: [number, number] | null; peeking: boolean;
}

export function useKnightTourGame() {
  const [game, setGame] = useState<KnightTourState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty) => {
    const size = BOARD_SIZES[difficulty];
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    setGame({
      boardSize: size, visited, path: [], difficulty,
      won: false, stuck: false, moveLimit: MOVE_LIMITS[difficulty],
      validMoves: [], hintCell: null, peeking: false,
    });
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.stuck) return prev;
      if (prev.path.length === 0) {
        const newVisited = prev.visited.map(r => [...r]);
        newVisited[row][col] = true;
        const newPath: [number, number][] = [[row, col]];
        const validMoves = getValidMoves(row, col, prev.boardSize, newVisited);
        return { ...prev, visited: newVisited, path: newPath, validMoves, hintCell: null };
      }
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
        return { ...prev, visited: newVisited, path: newPath, validMoves: [], stuck: true, hintCell: null };
      }
      return { ...prev, visited: newVisited, path: newPath, won, stuck, validMoves, hintCell: null };
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
      return { ...prev, visited: newVisited, path: newPath, won: false, stuck: false, validMoves, hintCell: null };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.stuck || prev.path.length === 0) return prev;
      const [row, col] = prev.path[prev.path.length - 1];
      const best = getBestMove(row, col, prev.boardSize, prev.visited);
      return { ...prev, hintCell: best };
    });
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, hintCell: null } : prev);
    }, 2000);
  }, []);

  const peek = useCallback(() => {
    // Show all valid moves highlighted more prominently - already shown, so just pulse
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    peekTimeout.current = setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => prev ? {
      ...prev,
      visited: Array.from({ length: prev.boardSize }, () => Array(prev.boardSize).fill(false)),
      path: [], won: false, stuck: false, validMoves: [], hintCell: null, peeking: false,
    } : null);
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectCell, undo, hint, peek, restart, goToMenu };
}

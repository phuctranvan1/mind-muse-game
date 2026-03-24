import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const GRID_SIZES: Record<Difficulty, number> = { easy: 3, medium: 4, hard: 5, expert: 6, master: 7, grandmaster: 8, genius: 9 };
const LABELS: Record<Difficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert", master: "Master", grandmaster: "Grandmaster", genius: "Genius" };
const MOVE_LIMITS: Record<Difficulty, number | null> = { easy: null, medium: null, hard: 200, expert: 350, master: null, grandmaster: 500, genius: 300 };

function isSolvable(arr: (number | null)[], size: number): boolean {
  const flat = arr.filter((n): n is number => n !== null);
  let inversions = 0;
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  if (size % 2 !== 0) return inversions % 2 === 0;
  const emptyRow = Math.floor(arr.indexOf(null) / size);
  const rowFromBottom = size - emptyRow;
  return (rowFromBottom % 2 === 0) === (inversions % 2 !== 0);
}

function generateTiles(size: number, rand: () => number = Math.random): (number | null)[] {
  const total = size * size;
  let arr: (number | null)[] = Array.from({ length: total - 1 }, (_, i) => i + 1);
  arr.push(null);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (!isSolvable(arr, size)) {
    if (arr[0] !== null && arr[1] !== null) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    } else {
      [arr[arr.length - 2], arr[arr.length - 3]] = [arr[arr.length - 3], arr[arr.length - 2]];
    }
  }
  return arr;
}

function isAdjacent(idx1: number, idx2: number, size: number): boolean {
  const r1 = Math.floor(idx1 / size), c1 = idx1 % size;
  const r2 = Math.floor(idx2 / size), c2 = idx2 % size;
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

function isWin(tiles: (number | null)[]): boolean {
  return tiles.every((t, i) => (i === tiles.length - 1 ? t === null : t === i + 1));
}

function findHint(tiles: (number | null)[], size: number): number | null {
  const emptyIdx = tiles.indexOf(null);
  const neighbors: number[] = [];
  const row = Math.floor(emptyIdx / size), col = emptyIdx % size;
  if (row > 0) neighbors.push(emptyIdx - size);
  if (row < size - 1) neighbors.push(emptyIdx + size);
  if (col > 0) neighbors.push(emptyIdx - 1);
  if (col < size - 1) neighbors.push(emptyIdx + 1);
  const target = emptyIdx < tiles.length - 1 ? emptyIdx + 1 : null;
  const best = neighbors.find(i => tiles[i] === target);
  return best ?? neighbors[0] ?? null;
}

export interface GameState {
  tiles: (number | null)[];
  gridSize: number;
  difficulty: Difficulty;
  moves: number;
  won: boolean;
  lost: boolean;
  hintTile: number | null;
  moveLimit: number | null;
  peeking: boolean;
}

export function useShiftGame() {
  const [game, setGame] = useState<GameState | null>(null);
  const historyRef = useRef<GameState[]>([]);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const size = GRID_SIZES[difficulty];
    historyRef.current = [];
    setGame({
      tiles: generateTiles(size, rand), gridSize: size, difficulty, moves: 0,
      won: false, lost: false, hintTile: null, moveLimit: MOVE_LIMITS[difficulty], peeking: false,
    });
  }, []);

  const moveTile = useCallback((index: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const emptyIdx = prev.tiles.indexOf(null);
      if (!isAdjacent(index, emptyIdx, prev.gridSize)) return prev;
      historyRef.current.push({ ...prev });
      const newTiles = [...prev.tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      const newMoves = prev.moves + 1;
      const won = isWin(newTiles);
      const lost = !won && prev.moveLimit !== null && newMoves >= prev.moveLimit;
      return { ...prev, tiles: newTiles, moves: newMoves, won, lost, hintTile: null };
    });
  }, []);

  const moveByDirection = useCallback((direction: "up" | "down" | "left" | "right") => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const emptyIdx = prev.tiles.indexOf(null);
      const row = Math.floor(emptyIdx / prev.gridSize);
      const col = emptyIdx % prev.gridSize;
      let tileIdx: number | null = null;
      if (direction === "up" && row < prev.gridSize - 1) tileIdx = emptyIdx + prev.gridSize;
      if (direction === "down" && row > 0) tileIdx = emptyIdx - prev.gridSize;
      if (direction === "left" && col < prev.gridSize - 1) tileIdx = emptyIdx + 1;
      if (direction === "right" && col > 0) tileIdx = emptyIdx - 1;
      if (tileIdx === null) return prev;
      historyRef.current.push({ ...prev });
      const newTiles = [...prev.tiles];
      [newTiles[tileIdx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[tileIdx]];
      const newMoves = prev.moves + 1;
      const won = isWin(newTiles);
      const lost = !won && prev.moveLimit !== null && newMoves >= prev.moveLimit;
      return { ...prev, tiles: newTiles, moves: newMoves, won, lost, hintTile: null };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setGame(prev);
  }, []);

  const restart = useCallback(() => {
    historyRef.current = [];
    setGame(prev => prev ? { ...prev, tiles: generateTiles(prev.gridSize), moves: 0, won: false, lost: false, hintTile: null, peeking: false } : null);
  }, []);

  const showHint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      return { ...prev, hintTile: findHint(prev.tiles, prev.gridSize) };
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    peekTimeout.current = setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const goToMenu = useCallback(() => { historyRef.current = []; setGame(null); }, []);

  return { game, startGame, moveTile, moveByDirection, undo, restart, showHint, peek, goToMenu, difficultyLabel: game ? LABELS[game.difficulty] : "" };
}

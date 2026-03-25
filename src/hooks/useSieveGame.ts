import { useState, useCallback, useRef } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

export interface SieveState {
  limit: number;
  grid: number[];
  marked: boolean[];
  primes: boolean[]; // ground truth
  moves: number;
  won: boolean;
  difficulty: string;
  hintCell: number | null;
  peeking: boolean;
  maxLimit?: number;
}

function getPrimes(limit: number): boolean[] {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) sieve[j] = false;
    }
  }
  return sieve;
}

function getConfig(difficulty: Difficulty): { limit: number } {
  switch (difficulty) {
    case "easy": return { limit: 30 };
    case "medium": return { limit: 50 };
    case "hard": return { limit: 100 };
    case "expert": return { limit: 150 };
    case "master": return { limit: 200 };
    case "grandmaster": return { limit: 300 };
    case "genius": return { limit: 500 };
    case "legend": return { limit: 1000 };
    default: return { limit: 30 };
  }
}

export function useSieveGame() {
  const [game, setGame] = useState<SieveState | null>(null);
  const [difficultyLabel, setDifficultyLabel] = useState("");
  const historyRef = useRef<boolean[][]>([]);

  const startGame = useCallback((difficulty: Difficulty, _rand?: () => number) => {
    const { limit } = getConfig(difficulty);
    const primes = getPrimes(limit);
    const grid = Array.from({ length: limit - 1 }, (_, i) => i + 2); // 2..limit
    const marked = new Array(grid.length).fill(false);
    historyRef.current = [];
    setDifficultyLabel(difficulty.charAt(0).toUpperCase() + difficulty.slice(1));
    setGame({ limit, grid, marked, primes, moves: 0, won: false, difficulty, hintCell: null, peeking: false });
  }, []);

  const toggleMark = useCallback((index: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      historyRef.current.push([...prev.marked]);
      const newMarked = [...prev.marked];
      newMarked[index] = !newMarked[index];
      const moves = prev.moves + 1;

      // Check win: all composites marked, no primes marked
      // marked[i] = true means "this is composite" (crossed out)
      let won = true;
      for (let i = 0; i < prev.grid.length; i++) {
        const num = prev.grid[i];
        const isPrime = prev.primes[num];
        if (isPrime && newMarked[i]) { won = false; break; } // marked a prime as composite
        if (!isPrime && !newMarked[i]) { won = false; break; } // didn't mark a composite
      }

      return { ...prev, marked: newMarked, moves, won, hintCell: null };
    });
  }, []);

  const showHint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      // Find first wrong cell
      for (let i = 0; i < prev.grid.length; i++) {
        const num = prev.grid[i];
        const isPrime = prev.primes[num];
        const shouldBeMarked = !isPrime;
        if (prev.marked[i] !== shouldBeMarked) {
          return { ...prev, hintCell: i };
        }
      }
      return prev;
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || historyRef.current.length === 0) return prev;
      const prevMarked = historyRef.current.pop()!;
      return { ...prev, marked: prevMarked, moves: prev.moves, hintCell: null };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      return { ...prev, peeking: true };
    });
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      historyRef.current = [];
      return { ...prev, marked: new Array(prev.grid.length).fill(false), moves: 0, won: false, hintCell: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, difficultyLabel, startGame, toggleMark, showHint, undo, peek, restart, goToMenu };
}

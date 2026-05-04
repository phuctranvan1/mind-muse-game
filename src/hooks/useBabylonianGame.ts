import { useState, useCallback, useRef } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

export interface BabylonianState {
  targetNumber: number;
  targetSqrt: number; // actual sqrt
  tolerance: number;
  guesses: number[];
  currentGuess: string;
  moves: number;
  won: boolean;
  difficulty: string;
  hintValue: number | null;
  peeking: boolean;
  maxRounds: number;
  round: number;
  totalRounds: number;
  targets: number[];
  scores: number; // rounds won
}

function getConfig(difficulty: Difficulty): { count: number; maxVal: number; tolerance: number } {
  switch (difficulty) {
    case "easy": return { count: 4, maxVal: 100, tolerance: 0.5 };
    case "medium": return { count: 6, maxVal: 400, tolerance: 0.25 };
    case "hard": return { count: 9, maxVal: 2500, tolerance: 0.05 };
    case "expert": return { count: 11, maxVal: 12500, tolerance: 0.025 };
    case "master": return { count: 15, maxVal: 60000, tolerance: 0.005 };
    case "grandmaster": return { count: 18, maxVal: 250000, tolerance: 0.0005 };
    case "genius": return { count: 22, maxVal: 1500000, tolerance: 0.00005 };
    case "legend": return { count: 30, maxVal: 2500000, tolerance: 0.000005 };
    case "mythic": return { count: 36, maxVal: 25000000, tolerance: 0.0000005 };
    case "immortal": return { count: 44, maxVal: 250000000, tolerance: 0.00000005 };
    case "divine": return { count: 55, maxVal: 2500000000, tolerance: 0.000000005 };
    default: return { count: 3, maxVal: 50, tolerance: 1.0 };
  }
}

function generateTargets(count: number, maxVal: number, rand?: () => number): number[] {
  const r = rand || Math.random;
  const targets: number[] = [];
  for (let i = 0; i < count; i++) {
    // Avoid perfect squares to make it interesting
    let n: number;
    do {
      n = Math.floor(r() * (maxVal - 2)) + 2;
    } while (Math.sqrt(n) === Math.floor(Math.sqrt(n)));
    targets.push(n);
  }
  return targets;
}

export function useBabylonianGame() {
  const [game, setGame] = useState<BabylonianState | null>(null);
  const [difficultyLabel, setDifficultyLabel] = useState("");
  const historyRef = useRef<number[][]>([]);

  const startGame = useCallback((difficulty: Difficulty, rand?: () => number) => {
    const { count, maxVal, tolerance } = getConfig(difficulty);
    const targets = generateTargets(count, maxVal, rand);
    const target = targets[0];
    historyRef.current = [];
    setDifficultyLabel(difficulty.charAt(0).toUpperCase() + difficulty.slice(1));
    setGame({
      targetNumber: target,
      targetSqrt: Math.sqrt(target),
      tolerance,
      guesses: [],
      currentGuess: "",
      moves: 0,
      won: false,
      difficulty,
      hintValue: null,
      peeking: false,
      maxRounds: count,
      round: 0,
      totalRounds: count,
      targets,
      scores: 0,
    });
  }, []);

  const setCurrentGuess = useCallback((val: string) => {
    setGame(prev => prev ? { ...prev, currentGuess: val, hintValue: null } : prev);
  }, []);

  const submitGuess = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const guess = parseFloat(prev.currentGuess);
      if (isNaN(guess) || guess <= 0) return prev;

      historyRef.current.push([...prev.guesses]);
      const newGuesses = [...prev.guesses, guess];
      const moves = prev.moves + 1;
      const diff = Math.abs(guess - prev.targetSqrt);
      const roundWon = diff <= prev.tolerance;

      if (roundWon) {
        const newScores = prev.scores + 1;
        const nextRound = prev.round + 1;
        if (nextRound >= prev.totalRounds) {
          return { ...prev, guesses: newGuesses, moves, won: true, scores: newScores, round: nextRound, currentGuess: "", hintValue: null };
        }
        const nextTarget = prev.targets[nextRound];
        return {
          ...prev,
          guesses: [],
          moves,
          scores: newScores,
          round: nextRound,
          targetNumber: nextTarget,
          targetSqrt: Math.sqrt(nextTarget),
          currentGuess: "",
          hintValue: null,
        };
      }

      return { ...prev, guesses: newGuesses, moves, currentGuess: "", hintValue: null };
    });
  }, []);

  const showHint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      // Babylonian method hint: if no guesses, start with N/2; else do one iteration
      if (prev.guesses.length === 0) {
        return { ...prev, hintValue: prev.targetNumber / 2 };
      }
      const lastGuess = prev.guesses[prev.guesses.length - 1];
      const nextApprox = (lastGuess + prev.targetNumber / lastGuess) / 2;
      return { ...prev, hintValue: parseFloat(nextApprox.toFixed(6)) };
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || historyRef.current.length === 0) return prev;
      const prevGuesses = historyRef.current.pop()!;
      return { ...prev, guesses: prevGuesses, hintValue: null };
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
      const target = prev.targets[0];
      return { ...prev, guesses: [], currentGuess: "", moves: 0, won: false, hintValue: null, peeking: false, round: 0, scores: 0, targetNumber: target, targetSqrt: Math.sqrt(target) };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, difficultyLabel, startGame, setCurrentGuess, submitGuess, showHint, undo, peek, restart, goToMenu };
}

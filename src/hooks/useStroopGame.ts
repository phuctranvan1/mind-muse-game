import { useState, useCallback, useEffect, useRef } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

const COLORS = [
  { name: "Red",    hex: "#ef4444" },
  { name: "Blue",   hex: "#3b82f6" },
  { name: "Green",  hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink",   hex: "#ec4899" },
  { name: "Cyan",   hex: "#06b6d4" },
];

const CONFIGS: Record<Difficulty, { colorCount: number; rounds: number; timePerRound: number }> = {
  easy:        { colorCount: 3, rounds: 6,  timePerRound: 8   },
  medium:      { colorCount: 4, rounds: 8,  timePerRound: 6   },
  hard:        { colorCount: 5, rounds: 10, timePerRound: 5   },
  expert:      { colorCount: 6, rounds: 12, timePerRound: 4   },
  master:      { colorCount: 6, rounds: 15, timePerRound: 3   },
  grandmaster: { colorCount: 7, rounds: 18, timePerRound: 2.5 },
  genius:      { colorCount: 8, rounds: 20, timePerRound: 2   },
  legend:      { colorCount: 8, rounds: 25, timePerRound: 1.5 },
  mythic:      { colorCount: 8, rounds: 30, timePerRound: 1   },
  immortal:    { colorCount: 8, rounds: 36, timePerRound: 0.8 },
  divine:      { colorCount: 8, rounds: 45, timePerRound: 0.6 },
};

export interface StroopRound {
  word: string;
  inkHex: string;
  inkName: string;
  options: { name: string; hex: string }[];
}

export interface StroopState {
  rounds: StroopRound[];
  currentRound: number;
  score: number;
  wrong: number;
  won: boolean;
  difficulty: string;
  selectedAnswer: string | null;
  wasCorrect: boolean | null;
  timePerRound: number;
  timeLeft: number;
  peeking: boolean;
  moves: number;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRounds(colorCount: number, count: number, rand: () => number): StroopRound[] {
  const colors = COLORS.slice(0, colorCount);
  return Array.from({ length: count }, () => {
    const ink = colors[Math.floor(rand() * colors.length)];
    let wordColor: (typeof COLORS)[0];
    do {
      wordColor = colors[Math.floor(rand() * colors.length)];
    } while (wordColor.name === ink.name);
    return {
      word: wordColor.name,
      inkHex: ink.hex,
      inkName: ink.name,
      options: shuffle(colors, rand),
    };
  });
}

export function useStroopGame() {
  const [game, setGame] = useState<StroopState | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Per-round countdown timer
  useEffect(() => {
    if (!game || game.won || game.selectedAnswer !== null) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setGame(prev => {
        if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
        const newTimeLeft = parseFloat(Math.max(0, prev.timeLeft - 0.1).toFixed(2));
        if (newTimeLeft <= 0) {
          const nextRound = prev.currentRound + 1;
          if (nextRound >= prev.rounds.length) {
            return { ...prev, timeLeft: 0, won: true, wrong: prev.wrong + 1, moves: prev.moves + 1 };
          }
          return {
            ...prev,
            timeLeft: prev.timePerRound,
            currentRound: nextRound,
            wrong: prev.wrong + 1,
            selectedAnswer: null,
            wasCorrect: null,
            moves: prev.moves + 1,
          };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 100);
    return () => clearTimer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.currentRound, game?.won, game?.selectedAnswer]);

  const startGame = useCallback((difficulty: Difficulty, rand?: () => number) => {
    const r = rand ?? Math.random;
    const cfg = CONFIGS[difficulty];
    const rounds = generateRounds(cfg.colorCount, cfg.rounds, r);
    setGame({
      rounds,
      currentRound: 0,
      score: 0,
      wrong: 0,
      won: false,
      difficulty,
      selectedAnswer: null,
      wasCorrect: null,
      timePerRound: cfg.timePerRound,
      timeLeft: cfg.timePerRound,
      peeking: false,
      moves: 0,
    });
  }, []);

  const selectAnswer = useCallback((colorName: string) => {
    clearTimer();
    setGame(prev => {
      if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
      const correct = colorName === prev.rounds[prev.currentRound].inkName;
      return {
        ...prev,
        selectedAnswer: colorName,
        wasCorrect: correct,
        score: correct ? prev.score + 1 : prev.score,
        wrong: correct ? prev.wrong : prev.wrong + 1,
        moves: prev.moves + 1,
      };
    });
    setTimeout(() => {
      setGame(prev => {
        if (!prev) return prev;
        const nextRound = prev.currentRound + 1;
        if (nextRound >= prev.rounds.length) {
          return { ...prev, won: true, selectedAnswer: null, wasCorrect: null };
        }
        return {
          ...prev,
          currentRound: nextRound,
          selectedAnswer: null,
          wasCorrect: null,
          timeLeft: prev.timePerRound,
        };
      });
    }, 700);
  }, [clearTimer]);

  const hint = useCallback(() => {
    setGame(prev => (prev && !prev.won ? { ...prev, peeking: true } : prev));
    setTimeout(() => setGame(prev => (prev ? { ...prev, peeking: false } : prev)), 1500);
  }, []);

  const peek = useCallback(() => {
    setGame(prev => (prev ? { ...prev, peeking: true } : prev));
    setTimeout(() => setGame(prev => (prev ? { ...prev, peeking: false } : prev)), 2000);
  }, []);

  const undo = useCallback(() => {
    // No meaningful undo for a timed round-based game
  }, []);

  const restart = useCallback(() => {
    clearTimer();
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const rounds = generateRounds(cfg.colorCount, cfg.rounds, Math.random);
      return {
        ...prev,
        rounds,
        currentRound: 0,
        score: 0,
        wrong: 0,
        won: false,
        selectedAnswer: null,
        wasCorrect: null,
        timeLeft: cfg.timePerRound,
        peeking: false,
        moves: 0,
      };
    });
  }, [clearTimer]);

  const goToMenu = useCallback(() => {
    clearTimer();
    setGame(null);
  }, [clearTimer]);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

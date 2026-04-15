import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALL_COLORS = ["red","green","blue","yellow","orange","purple","cyan","pink"];

interface MastermindConfig {
  colors: number;
  pegs: number;
  maxGuesses: number;
}

const CONFIGS: Record<Difficulty, MastermindConfig> = {
  easy:        { colors: 4, pegs: 4, maxGuesses: 12 },
  medium:      { colors: 5, pegs: 4, maxGuesses: 10 },
  hard:        { colors: 6, pegs: 4, maxGuesses: 10 },
  expert:      { colors: 6, pegs: 4, maxGuesses: 8  },
  master:      { colors: 7, pegs: 4, maxGuesses: 8  },
  grandmaster: { colors: 7, pegs: 5, maxGuesses: 8  },
  genius:      { colors: 8, pegs: 5, maxGuesses: 7  },
  legend:      { colors: 8, pegs: 5, maxGuesses: 6  },
  mythic:      { colors: 8, pegs: 6, maxGuesses: 6  },
  immortal:    { colors: 8, pegs: 6, maxGuesses: 5  },
  divine:      { colors: 8, pegs: 6, maxGuesses: 5  },
};

export interface MastermindGuess {
  colors: number[];
  black: number;
  white: number;
}

export interface MastermindState {
  secret: number[];
  guesses: MastermindGuess[];
  current: number[];
  colors: string[];
  pegCount: number;
  colorCount: number;
  maxGuesses: number;
  won: boolean;
  lost: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
}

function generateSecret(colorCount: number, pegCount: number, rand: () => number): number[] {
  return Array.from({ length: pegCount }, () => Math.floor(rand() * colorCount));
}

function evaluateGuess(guess: number[], secret: number[]): { black: number; white: number } {
  let black = 0, white = 0;
  const secretCount: number[] = Array(ALL_COLORS.length).fill(0);
  const guessCount: number[] = Array(ALL_COLORS.length).fill(0);
  for (let i = 0; i < secret.length; i++) {
    if (guess[i] === secret[i]) black++;
    else { secretCount[secret[i]]++; guessCount[guess[i]]++; }
  }
  for (let c = 0; c < ALL_COLORS.length; c++) white += Math.min(secretCount[c], guessCount[c]);
  return { black, white };
}

export function useMastermindGame() {
  const [game, setGame] = useState<MastermindState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const colors = shuffle(ALL_COLORS.slice(0, cfg.colors), rand);
    setGame({
      secret: generateSecret(cfg.colors, cfg.pegs, rand),
      guesses: [],
      current: Array(cfg.pegs).fill(-1),
      colors,
      pegCount: cfg.pegs,
      colorCount: cfg.colors,
      maxGuesses: cfg.maxGuesses,
      won: false,
      lost: false,
      moves: 0,
      difficulty,
      hintText: null,
      peeking: false,
    });
  }, []);

  const setPeg = useCallback((pegIdx: number, colorIdx: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const current = [...prev.current];
      current[pegIdx] = colorIdx;
      return { ...prev, current };
    });
  }, []);

  const submitGuess = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (prev.current.some(c => c === -1)) {
        return { ...prev, hintText: "Fill all pegs before submitting!" };
      }
      const { black, white } = evaluateGuess(prev.current, prev.secret);
      const newGuess: MastermindGuess = { colors: [...prev.current], black, white };
      const newGuesses = [...prev.guesses, newGuess];
      const won = black === prev.pegCount;
      const lost = !won && newGuesses.length >= prev.maxGuesses;
      return {
        ...prev,
        guesses: newGuesses,
        current: Array(prev.pegCount).fill(-1),
        won,
        lost,
        moves: prev.moves + 1,
        hintText: null,
      };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const pos = Math.floor(Math.random() * prev.pegCount);
      return { ...prev, hintText: `Position ${pos + 1} is ${prev.colors[prev.secret[pos]]}` };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 2000);
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.guesses.length === 0) return prev;
      const newGuesses = prev.guesses.slice(0, -1);
      return { ...prev, guesses: newGuesses, current: Array(prev.pegCount).fill(-1) };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      return {
        ...prev,
        secret: generateSecret(cfg.colors, cfg.pegs, Math.random),
        guesses: [],
        current: Array(prev.pegCount).fill(-1),
        won: false, lost: false, hintText: null, peeking: false, moves: 0,
      };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, setPeg, submitGuess, hint, peek, undo, restart, goToMenu };
}

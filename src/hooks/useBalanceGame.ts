import { useState, useCallback, useRef } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ri(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

// Balance scale: determine which side is heavier
interface BalanceProblem {
  question: string;
  options: string[];
  answer: string;
  hint: string;
}

interface BalanceConfig {
  rounds: number;
}

const CONFIGS: Record<Difficulty, BalanceConfig> = {
  easy:        { rounds: 5  },
  medium:      { rounds: 7  },
  hard:        { rounds: 8  },
  expert:      { rounds: 10 },
  master:      { rounds: 12 },
  grandmaster: { rounds: 14 },
  genius:      { rounds: 16 },
  legend:      { rounds: 18 },
  mythic:      { rounds: 20 },
  immortal:    { rounds: 22 },
  divine:      { rounds: 24 },
};

function buildBalanceProblem(difficulty: Difficulty, rand: () => number): BalanceProblem {
  const level = ["easy","medium","hard","expert","master","grandmaster","genius","legend","mythic","immortal","divine"].indexOf(difficulty);
  const type = level < 3 ? "direct" : level < 6 ? "indirect" : "chain";

  if (type === "direct") {
    const leftW = ri(1, 20, rand);
    const rightW = ri(1, 20, rand);
    const question = `Left scale has ${leftW} kg. Right scale has ${rightW} kg. Which side is heavier?`;
    const answer = leftW > rightW ? "Left" : leftW < rightW ? "Right" : "Balanced";
    return { question, options: ["Left", "Right", "Balanced", "Cannot determine"], answer, hint: `Compare ${leftW} vs ${rightW} directly` };
  }

  if (type === "indirect") {
    const a = ri(1, 10, rand);
    const b = ri(1, 5, rand);
    const c = ri(1, 10, rand);
    const leftW = a + b;
    const rightW = c;
    const question = `Object A weighs ${a} kg. Object B weighs ${b} kg. Object C weighs ${c} kg. Left pan has A and B, right pan has C. Which side is heavier?`;
    const answer = leftW > rightW ? "Left" : leftW < rightW ? "Right" : "Balanced";
    return { question, options: ["Left", "Right", "Balanced", "Cannot determine"], answer, hint: `Left = ${a} + ${b} = ${leftW}, Right = ${c}` };
  }

  // Chain: A > B, B > C, therefore A vs C
  const a = ri(5, 20, rand);
  const diff1 = ri(1, 5, rand);
  const diff2 = ri(1, 5, rand);
  const b = a - diff1;
  const c = b - diff2;
  const objA = ["Apple","Ball","Book","Cube","Disc","Egg"][Math.floor(rand() * 6)];
  const objB = ["Mango","Pouch","Stone","Vase","Widget","Token"][Math.floor(rand() * 6)];
  const objC = ["Pebble","Chip","Pellet","Bead","Coin","Gem"][Math.floor(rand() * 6)];
  const question = `${objA} is heavier than ${objB}. ${objB} is heavier than ${objC}. Which is heavier: ${objA} or ${objC}?`;
  return { question, options: [objA, objC, "They are equal", "Cannot determine"], answer: objA, hint: `If A > B and B > C, then A > C by transitivity` };
}

export interface BalanceState {
  problems: BalanceProblem[];
  currentIndex: number;
  score: number;
  wrong: number;
  won: boolean;
  difficulty: string;
  selectedAnswer: string | null;
  wasCorrect: boolean | null;
  hintText: string | null;
  peeking: boolean;
  moves: number;
}

export function useBalanceGame() {
  const [game, setGame] = useState<BalanceState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const problems: BalanceProblem[] = Array.from({ length: cfg.rounds }, () => buildBalanceProblem(difficulty, rand));
    setGame({ problems, currentIndex: 0, score: 0, wrong: 0, won: false, difficulty, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 });
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    setGame(prev => {
      if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
      const correct = answer === prev.problems[prev.currentIndex].answer;
      return { ...prev, selectedAnswer: answer, wasCorrect: correct, score: correct ? prev.score + 1 : prev.score, wrong: correct ? prev.wrong : prev.wrong + 1, moves: prev.moves + 1, hintText: null };
    });
    setTimeout(() => {
      setGame(prev => {
        if (!prev) return prev;
        const nextIndex = prev.currentIndex + 1;
        const won = nextIndex >= prev.problems.length;
        return { ...prev, currentIndex: won ? prev.currentIndex : nextIndex, won, selectedAnswer: null, wasCorrect: null, hintText: null };
      });
    }, 700);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
      return { ...prev, hintText: prev.problems[prev.currentIndex].hint };
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => { if (!prev || prev.won) return prev; return { ...prev, peeking: true }; });
    peekTimeout.current = setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 2000);
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.currentIndex === 0 || prev.selectedAnswer !== null) return prev;
      return { ...prev, currentIndex: prev.currentIndex - 1, hintText: null };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const problems: BalanceProblem[] = Array.from({ length: cfg.rounds }, () => buildBalanceProblem(prev.difficulty as Difficulty, Math.random));
      return { ...prev, problems, currentIndex: 0, score: 0, wrong: 0, won: false, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

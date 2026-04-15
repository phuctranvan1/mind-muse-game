import { useState, useCallback, useRef } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function getPrimesFrom(startIndex: number, count: number): number[] {
  const result: number[] = [];
  let n = 2;
  let idx = 0;
  while (result.length < count) {
    if (isPrime(n)) {
      if (idx >= startIndex) result.push(n);
      idx++;
    }
    n++;
  }
  return result;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type SeqType =
  | "arithmetic"
  | "geometric"
  | "fibonacci"
  | "triangular"
  | "square"
  | "cube"
  | "prime"
  | "power2"
  | "doubly_arithmetic"
  | "alternating";

function ri(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function generateSequence(
  type: SeqType,
  rand: () => number,
  termCount: number
): { terms: number[]; answer: number; hint: string } {
  switch (type) {
    case "arithmetic": {
      const start = ri(1, 20, rand);
      const diff = ri(1, 12, rand);
      const seq = Array.from({ length: termCount + 1 }, (_, i) => start + i * diff);
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: `Each term increases by ${diff}` };
    }
    case "geometric": {
      const start = ri(1, 6, rand);
      const ratio = ri(2, 4, rand);
      const seq = Array.from({ length: termCount + 1 }, (_, i) => start * Math.pow(ratio, i));
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: `Each term is multiplied by ${ratio}` };
    }
    case "fibonacci": {
      const a = ri(1, 6, rand);
      const b = ri(1, 6, rand);
      const seq = [a, b];
      while (seq.length <= termCount) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: "Each term = sum of two preceding terms" };
    }
    case "triangular": {
      const start = ri(1, 8, rand);
      const seq = Array.from({ length: termCount + 1 }, (_, i) => {
        const n = start + i;
        return (n * (n + 1)) / 2;
      });
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: "Triangular numbers: n(n+1)/2" };
    }
    case "square": {
      const start = ri(1, 10, rand);
      const seq = Array.from({ length: termCount + 1 }, (_, i) => (start + i) * (start + i));
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: "Perfect squares: n²" };
    }
    case "cube": {
      const start = ri(1, 6, rand);
      const seq = Array.from({ length: termCount + 1 }, (_, i) => Math.pow(start + i, 3));
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: "Perfect cubes: n³" };
    }
    case "prime": {
      const startIdx = ri(0, 12, rand);
      const seq = getPrimesFrom(startIdx, termCount + 1);
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: "Prime numbers only" };
    }
    case "power2": {
      const start = ri(0, 5, rand);
      const seq = Array.from({ length: termCount + 1 }, (_, i) => Math.pow(2, start + i));
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: "Powers of 2" };
    }
    case "doubly_arithmetic": {
      const start = ri(1, 10, rand);
      const firstDiff = ri(1, 4, rand);
      const secondDiff = ri(1, 3, rand);
      const seq = [start];
      let diff = firstDiff;
      for (let i = 1; i <= termCount; i++) {
        seq.push(seq[i - 1] + diff);
        diff += secondDiff;
      }
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: `Differences between terms increase by ${secondDiff}` };
    }
    case "alternating": {
      const start = ri(1, 10, rand);
      const diff1 = ri(2, 8, rand);
      const diff2 = ri(1, 5, rand);
      const seq = [start];
      for (let i = 1; i <= termCount; i++) {
        seq.push(seq[i - 1] + (i % 2 === 1 ? diff1 : diff2));
      }
      return { terms: seq.slice(0, termCount), answer: seq[termCount], hint: `Alternates between +${diff1} and +${diff2}` };
    }
  }
}

const CONFIGS: Record<Difficulty, { rounds: number; termCount: number; types: SeqType[] }> = {
  easy:        { rounds: 5,  termCount: 4, types: ["arithmetic"] },
  medium:      { rounds: 7,  termCount: 4, types: ["arithmetic", "geometric"] },
  hard:        { rounds: 8,  termCount: 5, types: ["arithmetic", "geometric", "square", "triangular"] },
  expert:      { rounds: 10, termCount: 5, types: ["arithmetic", "geometric", "fibonacci", "triangular", "square", "prime"] },
  master:      { rounds: 12, termCount: 5, types: ["arithmetic", "geometric", "fibonacci", "triangular", "square", "cube", "prime", "power2"] },
  grandmaster: { rounds: 14, termCount: 6, types: ["arithmetic", "geometric", "fibonacci", "triangular", "square", "cube", "prime", "power2", "doubly_arithmetic"] },
  genius:      { rounds: 16, termCount: 6, types: ["arithmetic", "geometric", "fibonacci", "triangular", "square", "cube", "prime", "power2", "doubly_arithmetic", "alternating"] },
  legend:      { rounds: 20, termCount: 6, types: ["arithmetic", "geometric", "fibonacci", "triangular", "square", "cube", "prime", "power2", "doubly_arithmetic", "alternating"] },
  mythic:      { rounds: 25, termCount: 6, types: ["arithmetic", "geometric", "fibonacci", "triangular", "square", "cube", "prime", "power2", "doubly_arithmetic", "alternating"] },
  immortal:    { rounds: 30, termCount: 6, types: ["arithmetic", "geometric", "fibonacci", "triangular", "square", "cube", "prime", "power2", "doubly_arithmetic", "alternating"] },
  divine:      { rounds: 40, termCount: 6, types: ["arithmetic", "geometric", "fibonacci", "triangular", "square", "cube", "prime", "power2", "doubly_arithmetic", "alternating"] },
};

function generateOptions(answer: number, rand: () => number): number[] {
  const wrongSet = new Set<number>();
  const maxOffset = Math.max(5, Math.floor(Math.abs(answer) * 0.25) + 3);
  while (wrongSet.size < 3) {
    const offset = ri(1, maxOffset, rand);
    const wrong = rand() > 0.5 ? answer + offset : Math.max(1, answer - offset);
    if (wrong !== answer && wrong > 0) wrongSet.add(wrong);
  }
  return shuffle([...wrongSet, answer], rand);
}

export interface SequenceProblem {
  terms: number[];
  answer: number;
  options: number[];
  hint: string;
  type: string;
}

export interface SequenceState {
  problems: SequenceProblem[];
  currentIndex: number;
  score: number;
  wrong: number;
  won: boolean;
  difficulty: string;
  selectedAnswer: number | null;
  wasCorrect: boolean | null;
  hintText: string | null;
  peeking: boolean;
  moves: number;
}

function buildProblems(difficulty: Difficulty, rand: () => number): SequenceProblem[] {
  const cfg = CONFIGS[difficulty];
  return Array.from({ length: cfg.rounds }, () => {
    const type = cfg.types[Math.floor(rand() * cfg.types.length)];
    const { terms, answer, hint } = generateSequence(type, rand, cfg.termCount);
    return { terms, answer, options: generateOptions(answer, rand), hint, type };
  });
}

export function useSequenceGame() {
  const [game, setGame] = useState<SequenceState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    setGame({
      problems: buildProblems(difficulty, rand),
      currentIndex: 0,
      score: 0,
      wrong: 0,
      won: false,
      difficulty,
      selectedAnswer: null,
      wasCorrect: null,
      hintText: null,
      peeking: false,
      moves: 0,
    });
  }, []);

  const selectAnswer = useCallback((answer: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
      const correct = answer === prev.problems[prev.currentIndex].answer;
      return {
        ...prev,
        selectedAnswer: answer,
        wasCorrect: correct,
        score: correct ? prev.score + 1 : prev.score,
        wrong: correct ? prev.wrong : prev.wrong + 1,
        moves: prev.moves + 1,
        hintText: null,
      };
    });
    setTimeout(() => {
      setGame(prev => {
        if (!prev) return prev;
        const nextIndex = prev.currentIndex + 1;
        const won = nextIndex >= prev.problems.length;
        return {
          ...prev,
          currentIndex: won ? prev.currentIndex : nextIndex,
          won,
          selectedAnswer: null,
          wasCorrect: null,
          hintText: null,
        };
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
    setGame(prev => {
      if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
      return { ...prev, peeking: true };
    });
    peekTimeout.current = setTimeout(() => {
      setGame(prev => (prev ? { ...prev, peeking: false } : prev));
    }, 2000);
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
      return {
        ...prev,
        problems: buildProblems(prev.difficulty as Difficulty, Math.random),
        currentIndex: 0,
        score: 0,
        wrong: 0,
        won: false,
        selectedAnswer: null,
        wasCorrect: null,
        hintText: null,
        peeking: false,
        moves: 0,
      };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

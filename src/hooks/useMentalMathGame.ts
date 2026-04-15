import { useState, useCallback, useRef } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

function ri(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Op = "+" | "-" | "×" | "÷";

interface MentalConfig {
  rounds: number;
  ops: number;
  maxStart: number;
  maxOp: number;
  allowDiv: boolean;
}

const CONFIGS: Record<Difficulty, MentalConfig> = {
  easy:        { rounds: 5,  ops: 2, maxStart: 10,  maxOp: 5,   allowDiv: false },
  medium:      { rounds: 7,  ops: 3, maxStart: 20,  maxOp: 10,  allowDiv: false },
  hard:        { rounds: 8,  ops: 3, maxStart: 30,  maxOp: 15,  allowDiv: false },
  expert:      { rounds: 10, ops: 4, maxStart: 50,  maxOp: 20,  allowDiv: true  },
  master:      { rounds: 12, ops: 4, maxStart: 100, maxOp: 25,  allowDiv: true  },
  grandmaster: { rounds: 14, ops: 5, maxStart: 100, maxOp: 30,  allowDiv: true  },
  genius:      { rounds: 16, ops: 5, maxStart: 200, maxOp: 40,  allowDiv: true  },
  legend:      { rounds: 20, ops: 6, maxStart: 300, maxOp: 50,  allowDiv: true  },
  mythic:      { rounds: 22, ops: 7, maxStart: 500, maxOp: 75,  allowDiv: true  },
  immortal:    { rounds: 24, ops: 7, maxStart: 500, maxOp: 100, allowDiv: true  },
  divine:      { rounds: 25, ops: 8, maxStart: 999, maxOp: 100, allowDiv: true  },
};

export interface MentalProblem {
  start: number;
  steps: { op: Op; val: number }[];
  answer: number;
  options: number[];
  hint: string;
}

export interface MentalMathState {
  problems: MentalProblem[];
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

function buildProblem(cfg: MentalConfig, rand: () => number): MentalProblem {
  let val = ri(1, cfg.maxStart, rand);
  const start = val;
  const steps: { op: Op; val: number }[] = [];
  const ops: Op[] = cfg.allowDiv ? ["+", "-", "×", "÷"] : ["+", "-", "×"];

  for (let i = 0; i < cfg.ops; i++) {
    const op = ops[Math.floor(rand() * ops.length)];
    let operand = ri(1, cfg.maxOp, rand);

    if (op === "÷") {
      const divisors: number[] = [];
      for (let d = 2; d <= Math.min(val, cfg.maxOp); d++) {
        if (val % d === 0) divisors.push(d);
      }
      if (divisors.length === 0) { operand = 1; }
      else { operand = divisors[Math.floor(rand() * divisors.length)]; }
    }

    if (op === "-" && val - operand < 0) operand = ri(1, val, rand);

    if (op === "+") val += operand;
    else if (op === "-") val -= operand;
    else if (op === "×") val *= operand;
    else val = Math.floor(val / operand);

    steps.push({ op, val: operand });
  }

  const answer = val;
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const offset = ri(1, Math.max(5, Math.floor(Math.abs(answer) * 0.2) + 3), rand);
    const wrong = rand() > 0.5 ? answer + offset : answer - offset;
    if (wrong !== answer) wrongs.add(wrong);
  }
  const options = shuffle([...wrongs, answer], rand);
  const firstOp = steps[0];
  const hint = `Start: ${start}, first operation: ${start} ${firstOp.op} ${firstOp.val} = ${
    firstOp.op === "+" ? start + firstOp.val :
    firstOp.op === "-" ? start - firstOp.val :
    firstOp.op === "×" ? start * firstOp.val : Math.floor(start / firstOp.val)
  }`;
  return { start, steps, answer, options, hint };
}

function buildProblems(difficulty: Difficulty, rand: () => number): MentalProblem[] {
  const cfg = CONFIGS[difficulty];
  return Array.from({ length: cfg.rounds }, () => buildProblem(cfg, rand));
}

export function useMentalMathGame() {
  const [game, setGame] = useState<MentalMathState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    setGame({
      problems: buildProblems(difficulty, rand),
      currentIndex: 0, score: 0, wrong: 0, won: false, difficulty,
      selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0,
    });
  }, []);

  const selectAnswer = useCallback((answer: number) => {
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
      return { ...prev, problems: buildProblems(prev.difficulty as Difficulty, Math.random), currentIndex: 0, score: 0, wrong: 0, won: false, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

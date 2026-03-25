import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius" | "legend" | "mythic" | "immortal" | "divine";

interface MathProblem {
  question: string; answer: number; options: number[];
}

const CONFIGS: Record<Difficulty, { count: number; maxNum: number; ops: string[]; timePerQ: number }> = {
  easy: { count: 5, maxNum: 10, ops: ["+", "-"], timePerQ: 15 },
  medium: { count: 8, maxNum: 20, ops: ["+", "-", "×"], timePerQ: 12 },
  hard: { count: 12, maxNum: 50, ops: ["+", "-", "×"], timePerQ: 10 },
  expert: { count: 15, maxNum: 100, ops: ["+", "-", "×", "÷"], timePerQ: 8 },
  master: { count: 20, maxNum: 200, ops: ["+", "-", "×", "÷"], timePerQ: 6 },
  grandmaster: { count: 25, maxNum: 500, ops: ["+", "-", "×", "÷"], timePerQ: 5 },
  genius: { count: 30, maxNum: 1000, ops: ["+", "-", "×", "÷"], timePerQ: 4 },
  legend: { count: 40, maxNum: 9999, ops: ["+", "-", "×", "÷"], timePerQ: 3 },
  mythic: { count: 50, maxNum: 99999, ops: ["+", "-", "×", "÷"], timePerQ: 2 },
  immortal: { count: 60, maxNum: 999999, ops: ["+", "-", "×", "÷"], timePerQ: 2 },
  divine: { count: 80, maxNum: 9999999, ops: ["+", "-", "×", "÷"], timePerQ: 1 },
};

function randInt(min: number, max: number, rand: () => number = Math.random) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[], rand: () => number = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateProblem(maxNum: number, ops: string[], rand: () => number = Math.random): MathProblem {
  const op = ops[Math.floor(rand() * ops.length)];
  let a: number, b: number, answer: number;
  switch (op) {
    case "+": a = randInt(1, maxNum, rand); b = randInt(1, maxNum, rand); answer = a + b; break;
    case "-": a = randInt(1, maxNum, rand); b = randInt(1, a, rand); answer = a - b; break;
    case "×": a = randInt(2, Math.min(maxNum, 12), rand); b = randInt(2, Math.min(maxNum, 12), rand); answer = a * b; break;
    case "÷": b = randInt(2, Math.min(maxNum, 12), rand); answer = randInt(1, Math.min(maxNum, 12), rand); a = b * answer; break;
    default: a = 1; b = 1; answer = 2;
  }
  const question = `${a} ${op} ${b}`;
  const wrongSet = new Set<number>();
  while (wrongSet.size < 3) {
    const offset = randInt(1, Math.max(5, Math.floor(answer * 0.3) + 1), rand);
    const wrong = rand() > 0.5 ? answer + offset : Math.max(0, answer - offset);
    if (wrong !== answer) wrongSet.add(wrong);
  }
  return { question, answer, options: shuffle([...wrongSet, answer], rand) };
}

export interface MathChainState {
  problems: MathProblem[]; currentIndex: number; difficulty: Difficulty;
  score: number; wrong: number; finished: boolean;
  selectedAnswer: number | null; wasCorrect: boolean | null;
  eliminatedOptions: number[]; hintUsed: boolean; peekAnswer: number | null;
}

export function useMathChainGame() {
  const [game, setGame] = useState<MathChainState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const config = CONFIGS[difficulty];
    const problems = Array.from({ length: config.count }, () => generateProblem(config.maxNum, config.ops, rand));
    setGame({ problems, currentIndex: 0, difficulty, score: 0, wrong: 0, finished: false, selectedAnswer: null, wasCorrect: null, eliminatedOptions: [], hintUsed: false, peekAnswer: null });
  }, []);

  const selectAnswer = useCallback((answer: number) => {
    setGame(prev => {
      if (!prev || prev.finished || prev.selectedAnswer !== null) return prev;
      const correct = answer === prev.problems[prev.currentIndex].answer;
      return { ...prev, selectedAnswer: answer, wasCorrect: correct };
    });
    setTimeout(() => {
      setGame(prev => {
        if (!prev) return prev;
        const correct = prev.wasCorrect;
        const nextIndex = prev.currentIndex + 1;
        const finished = nextIndex >= prev.problems.length;
        return {
          ...prev, currentIndex: finished ? prev.currentIndex : nextIndex,
          score: correct ? prev.score + 1 : prev.score,
          wrong: correct ? prev.wrong : prev.wrong + 1,
          finished, selectedAnswer: null, wasCorrect: null,
          eliminatedOptions: [], hintUsed: false, peekAnswer: null,
        };
      });
    }, 600);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.finished || prev.selectedAnswer !== null || prev.hintUsed) return prev;
      const problem = prev.problems[prev.currentIndex];
      const wrongOptions = problem.options.filter(o => o !== problem.answer);
      const toEliminate = wrongOptions.slice(0, 2);
      return { ...prev, eliminatedOptions: toEliminate, hintUsed: true };
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => {
      if (!prev || prev.finished || prev.selectedAnswer !== null) return prev;
      return { ...prev, peekAnswer: prev.problems[prev.currentIndex].answer };
    });
    peekTimeout.current = setTimeout(() => {
      setGame(prev => prev ? { ...prev, peekAnswer: null } : prev);
    }, 1500);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return null;
      const config = CONFIGS[prev.difficulty];
      const problems = Array.from({ length: config.count }, () => generateProblem(config.maxNum, config.ops));
      return { problems, currentIndex: 0, difficulty: prev.difficulty, score: 0, wrong: 0, finished: false, selectedAnswer: null, wasCorrect: null, eliminatedOptions: [], hintUsed: false, peekAnswer: null };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, restart, goToMenu };
}

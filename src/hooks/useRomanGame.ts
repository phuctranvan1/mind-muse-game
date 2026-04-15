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

const ROMAN_VALS: [number, string][] = [
  [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],
  [50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"],
];

function toRoman(num: number): string {
  let result = "";
  for (const [val, sym] of ROMAN_VALS) {
    while (num >= val) { result += sym; num -= val; }
  }
  return result;
}

interface RomanConfig {
  rounds: number;
  maxVal: number;
  includeReverse: boolean;
}

const CONFIGS: Record<Difficulty, RomanConfig> = {
  easy:        { rounds: 5,  maxVal: 10,   includeReverse: false },
  medium:      { rounds: 7,  maxVal: 50,   includeReverse: false },
  hard:        { rounds: 8,  maxVal: 100,  includeReverse: true  },
  expert:      { rounds: 10, maxVal: 500,  includeReverse: true  },
  master:      { rounds: 12, maxVal: 1000, includeReverse: true  },
  grandmaster: { rounds: 14, maxVal: 2000, includeReverse: true  },
  genius:      { rounds: 16, maxVal: 2999, includeReverse: true  },
  legend:      { rounds: 20, maxVal: 3999, includeReverse: true  },
  mythic:      { rounds: 22, maxVal: 3999, includeReverse: true  },
  immortal:    { rounds: 24, maxVal: 3999, includeReverse: true  },
  divine:      { rounds: 25, maxVal: 3999, includeReverse: true  },
};

export interface RomanProblem {
  question: string;
  questionLabel: string;
  answer: string;
  options: string[];
  hint: string;
  toRomanDir: boolean;
}

export interface RomanState {
  problems: RomanProblem[];
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

function buildProblems(difficulty: Difficulty, rand: () => number): RomanProblem[] {
  const cfg = CONFIGS[difficulty];
  return Array.from({ length: cfg.rounds }, () => {
    const toRomanDir = cfg.includeReverse && rand() > 0.5;
    const val = ri(1, cfg.maxVal, rand);
    const roman = toRoman(val);
    const question = toRomanDir ? String(val) : roman;
    const questionLabel = toRomanDir ? "Decimal → Roman" : "Roman → Decimal";
    const answer = toRomanDir ? roman : String(val);

    const wrongs = new Set<string>();
    while (wrongs.size < 3) {
      const offset = ri(1, Math.max(3, Math.floor(val * 0.2) + 2), rand);
      const wrongVal = Math.max(1, rand() > 0.5 ? val + offset : val - offset);
      const wrong = toRomanDir ? toRoman(wrongVal) : String(wrongVal);
      if (wrong !== answer) wrongs.add(wrong);
    }
    const options = shuffle([...wrongs, answer], rand);
    const hint = toRomanDir
      ? "M=1000, D=500, C=100, L=50, X=10, V=5, I=1 (smaller before larger = subtract)"
      : "M=1000, D=500, C=100, L=50, X=10, V=5, I=1 (CM=900, CD=400, XC=90, XL=40, IX=9, IV=4)";
    return { question, questionLabel, answer, options, hint, toRomanDir };
  });
}

export function useRomanGame() {
  const [game, setGame] = useState<RomanState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    setGame({
      problems: buildProblems(difficulty, rand),
      currentIndex: 0, score: 0, wrong: 0, won: false, difficulty,
      selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0,
    });
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

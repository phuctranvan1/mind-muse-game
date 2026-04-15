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

const PLAIN_WORDS = [
  "apple","brain","cloud","dance","eagle","flame","grape","heart","ideal","jewel",
  "knife","lemon","magic","night","ocean","piano","queen","river","stone","tiger",
  "ultra","value","water","xenon","yacht","zebra","amber","brave","chess","dream",
  "earth","frost","globe","hinge","ivory","judge","knack","lunar","marsh","noble",
];

const PLAIN_PHRASES = [
  "hello world","game over","brain power","mind space","code genius",
  "star light","deep focus","high score","play smart","logic wins",
];

interface CipherConfig {
  rounds: number;
  usePhrases: boolean;
  shiftRange: [number, number];
}

const CONFIGS: Record<Difficulty, CipherConfig> = {
  easy:        { rounds: 5,  usePhrases: false, shiftRange: [1, 5]   },
  medium:      { rounds: 7,  usePhrases: false, shiftRange: [1, 10]  },
  hard:        { rounds: 8,  usePhrases: true,  shiftRange: [1, 13]  },
  expert:      { rounds: 10, usePhrases: true,  shiftRange: [1, 20]  },
  master:      { rounds: 12, usePhrases: true,  shiftRange: [3, 23]  },
  grandmaster: { rounds: 14, usePhrases: true,  shiftRange: [5, 25]  },
  genius:      { rounds: 16, usePhrases: true,  shiftRange: [1, 25]  },
  legend:      { rounds: 18, usePhrases: true,  shiftRange: [1, 25]  },
  mythic:      { rounds: 20, usePhrases: true,  shiftRange: [1, 25]  },
  immortal:    { rounds: 22, usePhrases: true,  shiftRange: [1, 25]  },
  divine:      { rounds: 24, usePhrases: true,  shiftRange: [1, 25]  },
};

function caesarEncode(text: string, shift: number): string {
  return text.replace(/[a-z]/gi, ch => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);
  });
}

export interface CipherProblem {
  ciphertext: string;
  shift: number;
  answer: string;
  options: string[];
  hint: string;
}

export interface CipherState {
  problems: CipherProblem[];
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

function buildProblems(difficulty: Difficulty, rand: () => number): CipherProblem[] {
  const cfg = CONFIGS[difficulty];
  const pool = cfg.usePhrases ? [...PLAIN_WORDS, ...PLAIN_PHRASES] : PLAIN_WORDS;
  const shuffled = shuffle(pool, rand);
  return Array.from({ length: cfg.rounds }, (_, i) => {
    const plain = shuffled[i % shuffled.length];
    const shift = ri(cfg.shiftRange[0], cfg.shiftRange[1], rand);
    const ciphertext = caesarEncode(plain, shift).toUpperCase();
    const answer = plain.toLowerCase();
    const wrongs: string[] = [];
    const otherShifts = new Set<number>([shift]);
    while (wrongs.length < 3) {
      let s: number;
      do { s = ri(1, 25, rand); } while (otherShifts.has(s));
      otherShifts.add(s);
      const decoded = caesarEncode(ciphertext, 26 - s).toLowerCase();
      if (decoded !== answer) wrongs.push(decoded);
    }
    const options = shuffle([...wrongs.slice(0, 3), answer], rand);
    return { ciphertext, shift, answer, options, hint: `Try shift of ${shift} (A→${caesarEncode("A", shift)})` };
  });
}

export function useCipherGame() {
  const [game, setGame] = useState<CipherState | null>(null);
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
      return { ...prev, problems: buildProblems(prev.difficulty as Difficulty, Math.random), currentIndex: 0, score: 0, wrong: 0, won: false, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

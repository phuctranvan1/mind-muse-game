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

type ConvType = "bin2dec" | "dec2bin" | "hex2dec" | "dec2hex" | "bin2hex" | "hex2bin";

interface BinaryConfig {
  rounds: number;
  maxVal: number;
  types: ConvType[];
}

const CONFIGS: Record<Difficulty, BinaryConfig> = {
  easy:        { rounds: 5,  maxVal: 15,    types: ["bin2dec"] },
  medium:      { rounds: 7,  maxVal: 255,   types: ["bin2dec", "dec2bin"] },
  hard:        { rounds: 8,  maxVal: 255,   types: ["bin2dec", "dec2bin"] },
  expert:      { rounds: 10, maxVal: 255,   types: ["bin2dec", "dec2bin", "hex2dec"] },
  master:      { rounds: 12, maxVal: 1023,  types: ["bin2dec", "dec2bin", "hex2dec", "dec2hex"] },
  grandmaster: { rounds: 14, maxVal: 4095,  types: ["bin2dec", "dec2bin", "hex2dec", "dec2hex", "bin2hex"] },
  genius:      { rounds: 16, maxVal: 4095,  types: ["bin2dec", "dec2bin", "hex2dec", "dec2hex", "bin2hex", "hex2bin"] },
  legend:      { rounds: 20, maxVal: 65535, types: ["bin2dec", "dec2bin", "hex2dec", "dec2hex", "bin2hex", "hex2bin"] },
  mythic:      { rounds: 22, maxVal: 65535, types: ["bin2dec", "dec2bin", "hex2dec", "dec2hex", "bin2hex", "hex2bin"] },
  immortal:    { rounds: 24, maxVal: 65535, types: ["bin2dec", "dec2bin", "hex2dec", "dec2hex", "bin2hex", "hex2bin"] },
  divine:      { rounds: 25, maxVal: 65535, types: ["bin2dec", "dec2bin", "hex2dec", "dec2hex", "bin2hex", "hex2bin"] },
};

function formatValue(val: number, base: "bin" | "dec" | "hex"): string {
  if (base === "bin") return "0b" + val.toString(2);
  if (base === "hex") return "0x" + val.toString(16).toUpperCase();
  return val.toString(10);
}

function getSourceBase(type: ConvType): "bin" | "dec" | "hex" {
  if (type.startsWith("bin")) return "bin";
  if (type.startsWith("dec")) return "dec";
  return "hex";
}

function getTargetBase(type: ConvType): "bin" | "dec" | "hex" {
  if (type.endsWith("bin")) return "bin";
  if (type.endsWith("dec")) return "dec";
  return "hex";
}

function getHint(type: ConvType): string {
  if (type === "bin2dec") return "Binary digits are powers of 2: ...8,4,2,1";
  if (type === "dec2bin") return "Divide by 2 repeatedly, remainders give the bits";
  if (type === "hex2dec") return "Hex digits: 0-9 then A=10,B=11,C=12,D=13,E=14,F=15";
  if (type === "dec2hex") return "Divide by 16 repeatedly for hex digits";
  if (type === "bin2hex") return "Group binary digits in sets of 4";
  return "Convert hex digit pairs to binary groups of 4";
}

export interface BinaryProblem {
  source: string;
  targetBase: "bin" | "dec" | "hex";
  answer: string;
  options: string[];
  hint: string;
  type: ConvType;
}

export interface BinaryState {
  problems: BinaryProblem[];
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

function generateOptions(answer: string, val: number, targetBase: "bin" | "dec" | "hex", rand: () => number): string[] {
  const wrongs = new Set<string>();
  while (wrongs.size < 3) {
    const offset = ri(1, Math.max(3, Math.floor(val * 0.3) + 2), rand);
    const wrongVal = rand() > 0.5 ? val + offset : Math.max(0, val - offset);
    const wrong = formatValue(wrongVal, targetBase);
    if (wrong !== answer) wrongs.add(wrong);
  }
  return shuffle([...wrongs, answer], rand);
}

function buildProblems(difficulty: Difficulty, rand: () => number): BinaryProblem[] {
  const cfg = CONFIGS[difficulty];
  return Array.from({ length: cfg.rounds }, () => {
    const type = cfg.types[Math.floor(rand() * cfg.types.length)];
    const val = ri(1, cfg.maxVal, rand);
    const srcBase = getSourceBase(type);
    const tgtBase = getTargetBase(type);
    const source = formatValue(val, srcBase);
    const answer = formatValue(val, tgtBase);
    const options = generateOptions(answer, val, tgtBase, rand);
    return { source, targetBase: tgtBase, answer, options, hint: getHint(type), type };
  });
}

export function useBinaryGame() {
  const [game, setGame] = useState<BinaryState | null>(null);
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

  const selectAnswer = useCallback((answer: string) => {
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
      return { ...prev, problems: buildProblems(prev.difficulty as Difficulty, Math.random), currentIndex: 0, score: 0, wrong: 0, won: false, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

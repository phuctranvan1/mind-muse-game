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

interface EmojiMathProblem {
  clues: string[];
  question: string;
  answer: number;
  options: number[];
  hint: string;
}

const PROBLEM_BANK: EmojiMathProblem[] = [
  { clues: ["🍎 + 🍎 = 10", "🍎 + 🍊 = 7"], question: "🍊 = ?", answer: 2, options: [2, 3, 5, 8], hint: "🍎 = 5, so 🍊 = 7 − 5 = 2" },
  { clues: ["🐶 + 🐶 = 8", "🐶 + 🐱 = 9"], question: "🐱 = ?", answer: 5, options: [1, 5, 4, 3], hint: "🐶 = 4, so 🐱 = 9 − 4 = 5" },
  { clues: ["⭐ × ⭐ = 9", "⭐ + 🌙 = 7"], question: "🌙 = ?", answer: 4, options: [4, 6, 2, 3], hint: "⭐ = 3, so 🌙 = 7 − 3 = 4" },
  { clues: ["🍕 + 🍕 + 🍕 = 12", "🍕 + 🍔 = 10"], question: "🍔 = ?", answer: 6, options: [6, 4, 8, 2], hint: "🍕 = 4, so 🍔 = 10 − 4 = 6" },
  { clues: ["🚗 × 🚗 = 16", "🚗 + 🚀 = 9"], question: "🚀 = ?", answer: 5, options: [5, 4, 13, 3], hint: "🚗 = 4, so 🚀 = 9 − 4 = 5" },
  { clues: ["🎵 + 🎵 = 14", "🎵 − 🎸 = 4"], question: "🎸 = ?", answer: 3, options: [3, 7, 10, 4], hint: "🎵 = 7, so 🎸 = 7 − 4 = 3" },
  { clues: ["🌸 × 3 = 15", "🌸 + 🌺 = 9"], question: "🌺 = ?", answer: 4, options: [4, 5, 3, 6], hint: "🌸 = 5, so 🌺 = 9 − 5 = 4" },
  { clues: ["🦊 + 🦊 + 🦊 = 9", "🦊 + 🐺 = 7"], question: "🐺 = ?", answer: 4, options: [4, 3, 6, 2], hint: "🦊 = 3, so 🐺 = 7 − 3 = 4" },
  { clues: ["🏀 × 2 = 12", "🏀 + ⚽ = 11"], question: "⚽ = ?", answer: 5, options: [5, 6, 7, 4], hint: "🏀 = 6, so ⚽ = 11 − 6 = 5" },
  { clues: ["🍰 + 🍩 = 9", "🍩 + 🍩 = 6"], question: "🍰 = ?", answer: 6, options: [6, 3, 5, 7], hint: "🍩 = 3, so 🍰 = 9 − 3 = 6" },
  { clues: ["🌍 × 2 = 10", "🌍 + 🌏 = 8"], question: "🌏 = ?", answer: 3, options: [3, 5, 2, 6], hint: "🌍 = 5, so 🌏 = 8 − 5 = 3" },
  { clues: ["🐸 + 🐸 = 4", "🐸 × 🦋 = 10"], question: "🦋 = ?", answer: 5, options: [5, 2, 8, 4], hint: "🐸 = 2, so 🦋 = 10 ÷ 2 = 5" },
  { clues: ["🍋 + 🍋 + 🍋 = 6", "🍋 × 🍇 = 8"], question: "🍇 = ?", answer: 4, options: [4, 2, 6, 3], hint: "🍋 = 2, so 🍇 = 8 ÷ 2 = 4" },
  { clues: ["🎯 − 🎱 = 3", "🎯 + 🎱 = 9"], question: "🎯 = ?", answer: 6, options: [6, 3, 9, 5], hint: "Add both equations: 2×🎯 = 12, so 🎯 = 6" },
  { clues: ["🦅 × 🦅 = 25", "🦅 + 🦆 = 12"], question: "🦆 = ?", answer: 7, options: [7, 5, 6, 10], hint: "🦅 = 5, so 🦆 = 12 − 5 = 7" },
  { clues: ["🏆 + 🥇 = 10", "🏆 − 🥇 = 2"], question: "🥇 = ?", answer: 4, options: [4, 6, 8, 2], hint: "Subtract equations: 2×🥇 = 8, so 🥇 = 4" },
  { clues: ["🌵 × 4 = 20", "🌵 + 🌴 = 13"], question: "🌴 = ?", answer: 8, options: [8, 5, 7, 4], hint: "🌵 = 5, so 🌴 = 13 − 5 = 8" },
  { clues: ["🍓 + 🍓 + 🍓 = 18", "🍓 − 🫐 = 4"], question: "🫐 = ?", answer: 2, options: [2, 6, 4, 14], hint: "🍓 = 6, so 🫐 = 6 − 4 = 2" },
  { clues: ["🦁 × 🦁 = 36", "🦁 + 🐯 = 15"], question: "🐯 = ?", answer: 9, options: [9, 6, 12, 4], hint: "🦁 = 6, so 🐯 = 15 − 6 = 9" },
  { clues: ["🎪 + 🎠 = 11", "🎠 × 2 = 6"], question: "🎪 = ?", answer: 8, options: [8, 3, 5, 6], hint: "🎠 = 3, so 🎪 = 11 − 3 = 8" },
  { clues: ["🚂 + 🚂 = 16", "🚂 + 🚁 = 14"], question: "🚁 = ?", answer: 6, options: [6, 8, 4, 10], hint: "🚂 = 8, so 🚁 = 14 − 8 = 6" },
  { clues: ["💎 × 3 = 21", "💎 + 💍 = 10"], question: "💍 = ?", answer: 3, options: [3, 7, 4, 6], hint: "💎 = 7, so 💍 = 10 − 7 = 3" },
  { clues: ["🏖️ − 🏝️ = 5", "🏖️ + 🏝️ = 13"], question: "🏖️ = ?", answer: 9, options: [9, 4, 5, 7], hint: "Add both: 2×🏖️ = 18, so 🏖️ = 9" },
  { clues: ["🎻 × 🎻 = 49", "🎻 − 🎺 = 5"], question: "🎺 = ?", answer: 2, options: [2, 7, 5, 12], hint: "🎻 = 7, so 🎺 = 7 − 5 = 2" },
  { clues: ["🌊 + 🌊 + 🌊 = 15", "🌊 × 🌋 = 20"], question: "🌋 = ?", answer: 4, options: [4, 5, 3, 6], hint: "🌊 = 5, so 🌋 = 20 ÷ 5 = 4" },
  { clues: ["🍦 + 🍦 = 10", "🍦 × 🍭 = 15"], question: "🍭 = ?", answer: 3, options: [3, 5, 2, 6], hint: "🍦 = 5, so 🍭 = 15 ÷ 5 = 3" },
  { clues: ["🐬 + 🐳 = 14", "🐬 × 2 = 12"], question: "🐳 = ?", answer: 8, options: [8, 6, 4, 2], hint: "🐬 = 6, so 🐳 = 14 − 6 = 8" },
  { clues: ["🔥 + 🔥 + 🔥 = 18", "🔥 + ❄️ = 8"], question: "❄️ = ?", answer: 2, options: [2, 6, 4, 8], hint: "🔥 = 6, so ❄️ = 8 − 6 = 2" },
  { clues: ["🏰 × 2 = 18", "🏰 − 🗺️ = 6"], question: "🗺️ = ?", answer: 3, options: [3, 9, 6, 12], hint: "🏰 = 9, so 🗺️ = 9 − 6 = 3" },
  { clues: ["🎃 + 🎃 = 8", "🎃 × 🕯️ = 20"], question: "🕯️ = ?", answer: 5, options: [5, 4, 6, 3], hint: "🎃 = 4, so 🕯️ = 20 ÷ 4 = 5" },
];

const CONFIGS: Record<Difficulty, { rounds: number }> = {
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

export interface EmojiMathState {
  problems: EmojiMathProblem[];
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

export function useEmojiMathGame() {
  const [game, setGame] = useState<EmojiMathState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const problems = shuffle([...PROBLEM_BANK], rand).slice(0, cfg.rounds);
    setGame({ problems, currentIndex: 0, score: 0, wrong: 0, won: false, difficulty, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 });
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
      const problems = shuffle([...PROBLEM_BANK], Math.random).slice(0, cfg.rounds);
      return { ...prev, problems, currentIndex: 0, score: 0, wrong: 0, won: false, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

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

const FLAG_BANK = [
  { flag: "🇺🇸", country: "United States" },
  { flag: "🇬🇧", country: "United Kingdom" },
  { flag: "🇫🇷", country: "France" },
  { flag: "🇩🇪", country: "Germany" },
  { flag: "🇯🇵", country: "Japan" },
  { flag: "🇨🇳", country: "China" },
  { flag: "🇮🇳", country: "India" },
  { flag: "🇧🇷", country: "Brazil" },
  { flag: "🇨🇦", country: "Canada" },
  { flag: "🇦🇺", country: "Australia" },
  { flag: "🇮🇹", country: "Italy" },
  { flag: "🇪🇸", country: "Spain" },
  { flag: "🇲🇽", country: "Mexico" },
  { flag: "🇰🇷", country: "South Korea" },
  { flag: "🇷🇺", country: "Russia" },
  { flag: "🇿🇦", country: "South Africa" },
  { flag: "🇦🇷", country: "Argentina" },
  { flag: "🇳🇬", country: "Nigeria" },
  { flag: "🇸🇦", country: "Saudi Arabia" },
  { flag: "🇳🇱", country: "Netherlands" },
  { flag: "🇵🇹", country: "Portugal" },
  { flag: "🇸🇪", country: "Sweden" },
  { flag: "🇳🇴", country: "Norway" },
  { flag: "🇨🇭", country: "Switzerland" },
  { flag: "🇵🇱", country: "Poland" },
  { flag: "🇺🇦", country: "Ukraine" },
  { flag: "🇹🇷", country: "Turkey" },
  { flag: "🇪🇬", country: "Egypt" },
  { flag: "🇮🇩", country: "Indonesia" },
  { flag: "🇹🇭", country: "Thailand" },
  { flag: "🇵🇭", country: "Philippines" },
  { flag: "🇵🇰", country: "Pakistan" },
  { flag: "🇻🇳", country: "Vietnam" },
  { flag: "🇮🇷", country: "Iran" },
  { flag: "🇩🇰", country: "Denmark" },
  { flag: "🇫🇮", country: "Finland" },
  { flag: "🇬🇷", country: "Greece" },
  { flag: "🇭🇺", country: "Hungary" },
  { flag: "🇨🇿", country: "Czech Republic" },
  { flag: "🇷🇴", country: "Romania" },
];

interface FlagQuestion {
  flag: string;
  answer: string;
  options: string[];
  hint: string;
}

function buildQuestions(rand: () => number, count: number): FlagQuestion[] {
  const shuffled = shuffle([...FLAG_BANK], rand);
  return shuffled.slice(0, count).map(({ flag, country }) => {
    const others = shuffle(FLAG_BANK.filter(f => f.country !== country), rand).slice(0, 3).map(f => f.country);
    const options = shuffle([...others, country], rand);
    return { flag, answer: country, options, hint: `It's in ${getRegion(country)}` };
  });
}

function getRegion(country: string): string {
  const regions: Record<string, string> = {
    "United States": "North America", "Canada": "North America", "Mexico": "North America",
    "Brazil": "South America", "Argentina": "South America",
    "United Kingdom": "Europe", "France": "Europe", "Germany": "Europe", "Italy": "Europe",
    "Spain": "Europe", "Netherlands": "Europe", "Portugal": "Europe", "Sweden": "Europe",
    "Norway": "Europe", "Switzerland": "Europe", "Poland": "Europe", "Ukraine": "Europe",
    "Denmark": "Europe", "Finland": "Europe", "Greece": "Europe", "Hungary": "Europe",
    "Czech Republic": "Europe", "Romania": "Europe", "Russia": "Europe/Asia",
    "Japan": "East Asia", "China": "East Asia", "South Korea": "East Asia",
    "India": "South Asia", "Pakistan": "South Asia",
    "Indonesia": "Southeast Asia", "Thailand": "Southeast Asia", "Philippines": "Southeast Asia", "Vietnam": "Southeast Asia",
    "Australia": "Oceania",
    "Nigeria": "Africa", "South Africa": "Africa", "Egypt": "Africa",
    "Saudi Arabia": "Middle East", "Turkey": "Middle East", "Iran": "Middle East",
  };
  return regions[country] ?? "the world";
}

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

export interface FlagQuizState {
  questions: FlagQuestion[];
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

export function useFlagQuizGame() {
  const [game, setGame] = useState<FlagQuizState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const questions = buildQuestions(rand, cfg.rounds);
    setGame({ questions, currentIndex: 0, score: 0, wrong: 0, won: false, difficulty, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 });
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    setGame(prev => {
      if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
      const correct = answer === prev.questions[prev.currentIndex].answer;
      return { ...prev, selectedAnswer: answer, wasCorrect: correct, score: correct ? prev.score + 1 : prev.score, wrong: correct ? prev.wrong : prev.wrong + 1, moves: prev.moves + 1, hintText: null };
    });
    setTimeout(() => {
      setGame(prev => {
        if (!prev) return prev;
        const nextIndex = prev.currentIndex + 1;
        const won = nextIndex >= prev.questions.length;
        return { ...prev, currentIndex: won ? prev.currentIndex : nextIndex, won, selectedAnswer: null, wasCorrect: null, hintText: null };
      });
    }, 700);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
      return { ...prev, hintText: prev.questions[prev.currentIndex].hint };
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
      const questions = buildQuestions(Math.random, cfg.rounds);
      return { ...prev, questions, currentIndex: 0, score: 0, wrong: 0, won: false, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

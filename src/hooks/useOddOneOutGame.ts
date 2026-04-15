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

// ODD ONE OUT: 4 items, 3 belong together, 1 is the odd one
interface OddQuestion {
  items: string[];
  oddIndex: number;
  category: string;
  hint: string;
}

const QUESTION_BANK: OddQuestion[] = [
  { items: ["🐶 Dog","🐱 Cat","🐻 Bear","🐟 Fish"], oddIndex: 3, category: "Mammals", hint: "Three are mammals, one is not" },
  { items: ["🍎 Apple","🍊 Orange","🥕 Carrot","🍇 Grape"], oddIndex: 2, category: "Fruits", hint: "Three are fruits, one is a vegetable" },
  { items: ["🔴 Red","🔵 Blue","🟡 Yellow","⚫ Black"], oddIndex: 3, category: "Primary Colors", hint: "Three are primary colors" },
  { items: ["2","4","6","7"], oddIndex: 3, category: "Even Numbers", hint: "Three are even numbers" },
  { items: ["🌍 Earth","🌙 Moon","♂ Mars","♀ Venus"], oddIndex: 1, category: "Planets", hint: "Three are planets, one is a natural satellite" },
  { items: ["🎸 Guitar","🎹 Piano","🥁 Drums","🎺 Trumpet"], oddIndex: 2, category: "String/Wind Instruments", hint: "Three are string or wind instruments" },
  { items: ["🦁 Lion","🐯 Tiger","🐆 Cheetah","🐘 Elephant"], oddIndex: 3, category: "Big Cats", hint: "Three are big cats (felids)" },
  { items: ["🇫🇷 France","🇩🇪 Germany","🇯🇵 Japan","🇪🇸 Spain"], oddIndex: 2, category: "European Countries", hint: "Three are European countries" },
  { items: ["3","7","11","9"], oddIndex: 3, category: "Prime Numbers", hint: "Three are prime numbers (9 = 3×3)" },
  { items: ["🏊 Swimming","⚽ Football","🎾 Tennis","🎮 Video Games"], oddIndex: 3, category: "Olympic Sports", hint: "Three are Olympic sports" },
  { items: ["🌹 Rose","🌻 Sunflower","🌷 Tulip","🌿 Fern"], oddIndex: 3, category: "Flowering Plants", hint: "Three are flowering plants" },
  { items: ["🟥 Square","🔺 Triangle","⭕ Circle","📐 Right Angle"], oddIndex: 3, category: "Shapes", hint: "Three are 2D shapes" },
  { items: ["🎭 Drama","🎨 Painting","🎵 Music","⚽ Sport"], oddIndex: 3, category: "Fine Arts", hint: "Three are fine arts" },
  { items: ["Mercury","Gold","Silver","Bronze"], oddIndex: 0, category: "Solid Metals", hint: "Mercury is the only liquid metal at room temperature" },
  { items: ["🐝 Bee","🦋 Butterfly","🐛 Caterpillar","🦅 Eagle"], oddIndex: 3, category: "Insects", hint: "Three are insects" },
  { items: ["📚 Book","📰 Newspaper","📱 Phone","📖 Magazine"], oddIndex: 2, category: "Print Media", hint: "Three are traditionally print media" },
  { items: ["Pacific","Atlantic","Indian","Sahara"], oddIndex: 3, category: "Oceans", hint: "Three are oceans, one is a desert" },
  { items: ["16","25","36","40"], oddIndex: 3, category: "Perfect Squares", hint: "Three are perfect squares (16=4², 25=5², 36=6²)" },
  { items: ["🐬 Dolphin","🦈 Shark","🐋 Whale","🦭 Seal"], oddIndex: 1, category: "Marine Mammals", hint: "Three are marine mammals, one is a fish" },
  { items: ["🍕 Pizza","🍝 Pasta","🍣 Sushi","🥗 Salad"], oddIndex: 2, category: "Italian Food", hint: "Three are traditionally Italian foods" },
  { items: ["Monday","Tuesday","Sunday","Wednesday"], oddIndex: 2, category: "Weekdays", hint: "Three are weekdays (Mon-Fri), one is a weekend day" },
  { items: ["🏔️ Mountain","🏖️ Beach","🌊 Ocean","🏜️ Desert"], oddIndex: 2, category: "Landforms", hint: "Three are landforms, one is a body of water" },
  { items: ["Oxygen","Hydrogen","Nitrogen","Iron"], oddIndex: 3, category: "Gases", hint: "Three are gases at room temperature" },
  { items: ["🍫 Chocolate","🍬 Candy","🍰 Cake","🥑 Avocado"], oddIndex: 3, category: "Sweet Foods", hint: "Three are sweet desserts" },
  { items: ["🚗 Car","🚲 Bike","🚀 Rocket","🚂 Train"], oddIndex: 2, category: "Ground Transport", hint: "Three are ground transport" },
  { items: ["1","2","4","8"], oddIndex: 1, category: "Powers of 2", hint: "Three are powers of 2 (1=2⁰, 4=2², 8=2³)" },
  { items: ["🎃 Halloween","🎄 Christmas","🎆 New Year","🌹 Valentine"], oddIndex: 0, category: "Winter Holidays", hint: "Three are typically winter/December holidays" },
  { items: ["🐍 Snake","🦎 Lizard","🐢 Turtle","🐸 Frog"], oddIndex: 3, category: "Reptiles", hint: "Three are reptiles, one is an amphibian" },
  { items: ["Piano","Violin","Cello","Flute"], oddIndex: 3, category: "String Instruments", hint: "Three are string instruments (Flute is wind)" },
  { items: ["📡 Antenna","💡 Bulb","⚡ Battery","🔌 Plug"], oddIndex: 0, category: "Electrical Power", hint: "Three are used to conduct or store electricity" },
];

interface OddConfig { rounds: number }

const CONFIGS: Record<Difficulty, OddConfig> = {
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

export interface OddOneOutState {
  questions: OddQuestion[];
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

export function useOddOneOutGame() {
  const [game, setGame] = useState<OddOneOutState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const questions = shuffle([...QUESTION_BANK], rand).slice(0, cfg.rounds);
    setGame({ questions, currentIndex: 0, score: 0, wrong: 0, won: false, difficulty, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 });
  }, []);

  const selectAnswer = useCallback((idx: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.selectedAnswer !== null) return prev;
      const correct = idx === prev.questions[prev.currentIndex].oddIndex;
      return { ...prev, selectedAnswer: idx, wasCorrect: correct, score: correct ? prev.score + 1 : prev.score, wrong: correct ? prev.wrong : prev.wrong + 1, moves: prev.moves + 1, hintText: null };
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
      const questions = shuffle([...QUESTION_BANK], Math.random).slice(0, cfg.rounds);
      return { ...prev, questions, currentIndex: 0, score: 0, wrong: 0, won: false, selectedAnswer: null, wasCorrect: null, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectAnswer, hint, peek, undo, restart, goToMenu };
}

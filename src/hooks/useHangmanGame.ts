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

const WORD_BANK: Record<Difficulty, { word: string; category: string }[]> = {
  easy:        [
    { word: "cat", category: "Animals" }, { word: "dog", category: "Animals" },
    { word: "sun", category: "Nature" }, { word: "hat", category: "Clothing" },
    { word: "run", category: "Actions" }, { word: "joy", category: "Emotions" },
    { word: "map", category: "Objects" }, { word: "cup", category: "Objects" },
    { word: "bed", category: "Furniture" }, { word: "fox", category: "Animals" },
  ],
  medium:      [
    { word: "apple", category: "Fruit" }, { word: "cloud", category: "Nature" },
    { word: "brain", category: "Body" }, { word: "light", category: "Science" },
    { word: "music", category: "Arts" }, { word: "space", category: "Science" },
    { word: "tiger", category: "Animals" }, { word: "ocean", category: "Nature" },
    { word: "flame", category: "Nature" }, { word: "sword", category: "Objects" },
  ],
  hard:        [
    { word: "jungle", category: "Nature" }, { word: "castle", category: "Buildings" },
    { word: "wonder", category: "Emotions" }, { word: "frozen", category: "States" },
    { word: "bridge", category: "Structures" }, { word: "planet", category: "Science" },
    { word: "cactus", category: "Plants" }, { word: "butter", category: "Food" },
    { word: "silver", category: "Metals" }, { word: "goblin", category: "Fantasy" },
  ],
  expert:      [
    { word: "quantum", category: "Physics" }, { word: "crystal", category: "Minerals" },
    { word: "explore", category: "Actions" }, { word: "journey", category: "Travel" },
    { word: "volcano", category: "Geology" }, { word: "harmony", category: "Music" },
    { word: "blanket", category: "Household" }, { word: "captain", category: "Titles" },
    { word: "digital", category: "Tech" }, { word: "western", category: "Directions" },
  ],
  master:      [
    { word: "alphabet", category: "Language" }, { word: "calendar", category: "Time" },
    { word: "champion", category: "Sports" }, { word: "dinosaur", category: "Animals" },
    { word: "elephant", category: "Animals" }, { word: "geometry", category: "Math" },
    { word: "hospital", category: "Buildings" }, { word: "magnetic", category: "Physics" },
    { word: "national", category: "Society" }, { word: "operator", category: "Tech" },
  ],
  grandmaster: [
    { word: "astronomy", category: "Science" }, { word: "butterfly", category: "Insects" },
    { word: "chemistry", category: "Science" }, { word: "democracy", category: "Politics" },
    { word: "economics", category: "Finance" }, { word: "fantastic", category: "Adjectives" },
    { word: "geography", category: "Science" }, { word: "hydraulic", category: "Engineering" },
    { word: "infection", category: "Medicine" }, { word: "jewellery", category: "Fashion" },
  ],
  genius:      [
    { word: "architecture", category: "Design" }, { word: "bibliography", category: "Literature" },
    { word: "catastrophe", category: "Events" }, { word: "deteriorate", category: "Science" },
    { word: "environment", category: "Nature" }, { word: "flamboyant", category: "Adjectives" },
    { word: "gastronomic", category: "Food" }, { word: "hibernation", category: "Biology" },
    { word: "illustrious", category: "Adjectives" }, { word: "jurisdiction", category: "Law" },
  ],
  legend:      [
    { word: "acknowledgment", category: "Language" }, { word: "approximately", category: "Math" },
    { word: "autobiography", category: "Literature" }, { word: "circumstances", category: "Life" },
    { word: "collaboration", category: "Work" }, { word: "determination", category: "Traits" },
    { word: "establishment", category: "Society" }, { word: "functionality", category: "Tech" },
    { word: "globalization", category: "Society" }, { word: "hallucination", category: "Medicine" },
  ],
  mythic:      [
    { word: "counterintuitive", category: "Logic" }, { word: "electromagnetic", category: "Physics" },
    { word: "misrepresentation", category: "Language" }, { word: "photosynthesis", category: "Biology" },
    { word: "unconventional", category: "Adjectives" }, { word: "telecommunication", category: "Tech" },
    { word: "biodegradable", category: "Environment" }, { word: "parliamentary", category: "Politics" },
    { word: "infrastructure", category: "Engineering" }, { word: "philosophical", category: "Philosophy" },
  ],
  immortal:    [
    { word: "accomplishment", category: "Achievements" }, { word: "uncomfortable", category: "Feelings" },
    { word: "straightforward", category: "Adjectives" }, { word: "responsibility", category: "Ethics" },
    { word: "representative", category: "Politics" }, { word: "sophisticated", category: "Adjectives" },
    { word: "revolutionary", category: "History" }, { word: "transformation", category: "Science" },
    { word: "communication", category: "Language" }, { word: "disappointing", category: "Feelings" },
  ],
  divine:      [
    { word: "acknowledgment", category: "Language" }, { word: "approximately", category: "Math" },
    { word: "autobiography", category: "Literature" }, { word: "counterintuitive", category: "Logic" },
    { word: "electromagnetic", category: "Physics" }, { word: "misrepresentation", category: "Language" },
    { word: "accomplishment", category: "Achievements" }, { word: "straightforward", category: "Adjectives" },
    { word: "revolutionary", category: "History" }, { word: "transformation", category: "Science" },
  ],
};

const MAX_WRONG_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 6, medium: 6, hard: 6,
  expert: 5, master: 5, grandmaster: 5,
  genius: 4, legend: 4, mythic: 4,
  immortal: 3, divine: 3,
};

export interface HangmanState {
  word: string;
  display: string[];
  guessed: string[];
  wrongCount: number;
  maxWrong: number;
  won: boolean;
  lost: boolean;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
  moves: number;
  score: number;
  category: string;
}

export function useHangmanGame() {
  const [game, setGame] = useState<HangmanState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const pool = WORD_BANK[difficulty] ?? WORD_BANK.medium;
    const shuffled = shuffle(pool, rand);
    const { word, category } = shuffled[0];
    const maxWrong = MAX_WRONG_BY_DIFFICULTY[difficulty] ?? 6;
    setGame({
      word,
      display: word.split("").map(() => "_"),
      guessed: [],
      wrongCount: 0,
      maxWrong,
      won: false,
      lost: false,
      difficulty,
      hintText: null,
      peeking: false,
      moves: 0,
      score: 0,
      category,
    });
  }, []);

  const guessLetter = useCallback((letter: string) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const l = letter.toLowerCase();
      if (prev.guessed.includes(l)) return prev;
      const guessed = [...prev.guessed, l];
      const inWord = prev.word.includes(l);
      const display = prev.word.split("").map((ch, i) => guessed.includes(ch) ? ch : prev.display[i] === ch ? ch : "_");
      const wrongCount = inWord ? prev.wrongCount : prev.wrongCount + 1;
      const won = display.every(ch => ch !== "_");
      const lost = !won && wrongCount >= prev.maxWrong;
      const score = won ? prev.score + 1 : prev.score;
      return { ...prev, guessed, display, wrongCount, won, lost, moves: prev.moves + 1, score, hintText: null };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const hidden = prev.word.split("").filter((ch, i) => prev.display[i] === "_");
      if (hidden.length === 0) return prev;
      const letter = hidden[Math.floor(Math.random() * hidden.length)];
      return { ...prev, hintText: `Try the letter "${letter.toUpperCase()}"` };
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => { if (!prev || prev.won || prev.lost) return prev; return { ...prev, peeking: true }; });
    peekTimeout.current = setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 2000);
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.guessed.length === 0) return prev;
      const lastLetter = prev.guessed[prev.guessed.length - 1];
      const guessed = prev.guessed.slice(0, -1);
      const display = prev.word.split("").map(ch => guessed.includes(ch) ? ch : "_");
      const wrongCount = prev.word.includes(lastLetter) ? prev.wrongCount : prev.wrongCount - 1;
      return { ...prev, guessed, display, wrongCount: Math.max(0, wrongCount), moves: Math.max(0, prev.moves - 1), hintText: null };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const pool = WORD_BANK[prev.difficulty as Difficulty] ?? WORD_BANK.medium;
      const shuffled = shuffle(pool, Math.random);
      const { word, category } = shuffled[0];
      const maxWrong = MAX_WRONG_BY_DIFFICULTY[prev.difficulty as Difficulty] ?? 6;
      return { ...prev, word, display: word.split("").map(() => "_"), guessed: [], wrongCount: 0, maxWrong, won: false, lost: false, hintText: null, peeking: false, moves: 0, score: 0, category };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, guessLetter, hint, peek, undo, restart, goToMenu };
}

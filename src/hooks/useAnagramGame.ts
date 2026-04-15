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

// Word pairs where one is an anagram of the other
const ANAGRAM_PAIRS: [string, string][] = [
  ["LISTEN","SILENT"],["RACE","CARE"],["ATE","EAT"],["SEAT","TEAS"],["STARE","TEARS"],
  ["HEART","EARTH"],["NIGHT","THING"],["STONE","NOTES"],["TRAIN","RIANT"],["SMILE","LIMES"],
  ["BELOW","ELBOW"],["OCEAN","CANOE"],["LAMP","PALM"],["CARE","RACE"],["ALERT","ALTER"],
  ["CHEAP","PEACH"],["DEALS","LEADS"],["NOTES","TONES"],["PEARS","SPARE"],["REINS","RISEN"],
  ["TALES","STEAL"],["SWEAR","WEARS"],["VERSE","SERVE"],["VALES","SLAVE"],["SWORD","WORDS"],
  ["EMITS","ITEMS"],["MANES","NAMES"],["SNORE","SENOR"],["CARET","CRATE"],["DRAPE","PADRE"],
];

const DISTRACTOR_WORDS = [
  "ABCDE","XYZQR","MZNOP","KGTRS","VLMSP","BRKWQ","JPLTR","WZXCV",
  "FLINT","GROAN","SWAMP","CREAK","BLAZE","DRIFT","PLUMB","SPOKE",
];

interface AnagramConfig {
  rounds: number;
}

const CONFIGS: Record<Difficulty, AnagramConfig> = {
  easy:        { rounds: 5  },
  medium:      { rounds: 7  },
  hard:        { rounds: 8  },
  expert:      { rounds: 10 },
  master:      { rounds: 12 },
  grandmaster: { rounds: 14 },
  genius:      { rounds: 16 },
  legend:      { rounds: 20 },
  mythic:      { rounds: 22 },
  immortal:    { rounds: 24 },
  divine:      { rounds: 25 },
};

export interface AnagramProblem {
  source: string;
  answer: string;
  options: string[];
  hint: string;
}

export interface AnagramState {
  problems: AnagramProblem[];
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

function buildProblems(difficulty: Difficulty, rand: () => number): AnagramProblem[] {
  const cfg = CONFIGS[difficulty];
  const pairs = shuffle([...ANAGRAM_PAIRS], rand);
  return Array.from({ length: cfg.rounds }, (_, i) => {
    const [w1, w2] = pairs[i % pairs.length];
    const source = rand() > 0.5 ? w1 : w2;
    const answer = source === w1 ? w2 : w1;
    const distractors = shuffle([...DISTRACTOR_WORDS], rand)
      .filter(d => d !== answer && d !== source)
      .slice(0, 3);
    const options = shuffle([...distractors, answer], rand);
    const sorted = source.split("").sort().join("");
    return { source, answer, options, hint: `Sorted letters: ${sorted}` };
  });
}

export function useAnagramGame() {
  const [game, setGame] = useState<AnagramState | null>(null);
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

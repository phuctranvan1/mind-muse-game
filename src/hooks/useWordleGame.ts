import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

const WORDLE_EASY = ["APPLE","BRAVE","CLOUD","DANCE","EAGLE","FLAME","GLOBE","HEART","IMAGE","JEWEL","KNEEL","LEMON","MAGIC","NIGHT","OCEAN","PIANO","QUEEN","RIVER","STONE","TIGER","ULTRA","VALUE","WATER","XENON","YACHT","ZEBRA"];
const WORDLE_HARD = ["ABODE","BLAZE","CRISP","DROWN","EVADE","FROTH","GROAN","HATCH","INFER","JOUST","KNACK","LATCH","MANOR","NOTCH","OUGHT","PLUMB","QUIRK","REVEL","SCONE","TROUT","ULCER","VOGUE","WRATH","YACHT","ZONED"];
const WORDLE_EXPERT = ["ABYSS","CRYPT","DWARF","EXPEL","FLAIR","GLYPH","HOIST","IRONY","JIFFY","KNAVE","LYMPH","MYRRH","NYMPH","OXIDE","PROXY","QUAFF","RUPEE","SCHWA","TRYST","ULTRA","VIXEN","WALTZ","XYLEM","YEARN","ZINGY"];

const VALID_INPUT = new Set([
  ...WORDLE_EASY, ...WORDLE_HARD, ...WORDLE_EXPERT,
  "ABOUT","AFTER","AGAIN","ALONG","AMONG","ANGEL","ANGRY","ANNEX","ANTIC",
  "ARGUE","ARRAY","ASIDE","ASKED","ATLAS","AUDIT","AVOID","AWARE","BADLY",
  "BASED","BASIC","BASIS","BATCH","BEGAN","BEGIN","BEING","BELOW","BENCH",
  "BIRTH","BLACK","BLADE","BLAND","BLANK","BLAST","BLEED","BLEND","BLOCK",
  "BLOOD","BOARD","BONUS","BOOST","BOOTH","BOUND","BRAIN","BRAND","BREAD",
  "BREAK","BREED","BRICK","BRIDE","BRIEF","BRING","BROAD","BROKE","BROWN",
  "BUILD","BUILT","BURST","BUYER","CABIN","CAMEL","CARRY","CATCH","CAUSE",
  "CHAIN","CHAIR","CHAOS","CHEAP","CHECK","CHEEK","CHESS","CHILD","CLAIM",
  "CLASS","CLEAN","CLEAR","CLIMB","CLOCK","CLOSE","CLOTH","COACH","COLOR",
  "COMES","COMIC","COMET","CORAL","COULD","COUNT","COURT","COVER","CRACK",
  "CRAFT","CRASH","CRAZY","CREAM","CREEK","CRIME","CROSS","CROWD","CRUSH",
  "CURVE","CYCLE","DAILY","DAILY","DATED","DEALT","DEATH","DEBUT","DEPTH",
  "DEVIL","DIRTY","DISCO","DOING","DOZEN","DRAFT","DRAIN","DRAMA","DRAWN",
  "DRESS","DRILL","DRINK","DRIVE","DROVE","DRUGS","DRUNK","DYING","EARLY",
  "EARTH","EIGHT","ELECT","EMAIL","ENEMY","ENJOY","ENTRY","EQUAL","ERROR",
  "ESSAY","EVERY","EXACT","EXERT","EXIST","EXTRA","FAINT","FAITH","FALLS",
  "FALSE","FANCY","FATAL","FAULT","FEAST","FENCE","FEVER","FIELD","FIFTH",
  "FIFTY","FIGHT","FINAL","FIXED","FLANK","FLASH","FLESH","FLIES","FLOCK",
  "FLOOR","FLUSH","FOCUS","FORCE","FORGE","FORTH","FOUND","FRAME","FRANK",
  "FRAUD","FRESH","FRONT","FROST","FROZE","FRUIT","FULLY","FUNNY","GAINS",
  "GENRE","GHOST","GIVEN","GLAND","GLASS","GLASS","GLEAM","GLOOM","GLORY",
]);

interface WordleConfig {
  maxGuesses: number;
  wordPool: string[];
}

const CONFIGS: Record<Difficulty, WordleConfig> = {
  easy:        { maxGuesses: 8, wordPool: WORDLE_EASY   },
  medium:      { maxGuesses: 7, wordPool: WORDLE_EASY   },
  hard:        { maxGuesses: 6, wordPool: WORDLE_HARD   },
  expert:      { maxGuesses: 6, wordPool: WORDLE_HARD   },
  master:      { maxGuesses: 5, wordPool: WORDLE_HARD   },
  grandmaster: { maxGuesses: 5, wordPool: WORDLE_EXPERT },
  genius:      { maxGuesses: 5, wordPool: WORDLE_EXPERT },
  legend:      { maxGuesses: 4, wordPool: WORDLE_EXPERT },
  mythic:      { maxGuesses: 4, wordPool: WORDLE_EXPERT },
  immortal:    { maxGuesses: 4, wordPool: WORDLE_EXPERT },
  divine:      { maxGuesses: 4, wordPool: WORDLE_EXPERT },
};

export type TileColor = "green" | "yellow" | "gray" | "empty";

export interface WordleGuess {
  word: string;
  colors: TileColor[];
}

export interface WordleState {
  answer: string;
  guesses: WordleGuess[];
  currentGuess: string;
  maxGuesses: number;
  won: boolean;
  lost: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
  shakeRow: boolean;
  letterMap: Record<string, TileColor>;
}

function evaluateGuess(guess: string, answer: string): TileColor[] {
  const colors: TileColor[] = Array(5).fill("gray");
  const answerCounts: Record<string, number> = {};
  for (const ch of answer) answerCounts[ch] = (answerCounts[ch] ?? 0) + 1;

  // First pass: greens
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      colors[i] = "green";
      answerCounts[guess[i]]--;
    }
  }
  // Second pass: yellows
  for (let i = 0; i < 5; i++) {
    if (colors[i] === "green") continue;
    if (answerCounts[guess[i]] && answerCounts[guess[i]] > 0) {
      colors[i] = "yellow";
      answerCounts[guess[i]]--;
    }
  }
  return colors;
}

export function useWordleGame() {
  const [game, setGame] = useState<WordleState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const answer = cfg.wordPool[Math.floor(rand() * cfg.wordPool.length)];
    setGame({
      answer,
      guesses: [],
      currentGuess: "",
      maxGuesses: cfg.maxGuesses,
      won: false,
      lost: false,
      moves: 0,
      difficulty,
      hintText: null,
      peeking: false,
      shakeRow: false,
      letterMap: {},
    });
  }, []);

  const typeChar = useCallback((ch: string) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.currentGuess.length >= 5) return prev;
      return { ...prev, currentGuess: prev.currentGuess + ch.toUpperCase(), hintText: null };
    });
  }, []);

  const deleteLast = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || !prev.currentGuess.length) return prev;
      return { ...prev, currentGuess: prev.currentGuess.slice(0, -1) };
    });
  }, []);

  const submitGuess = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.currentGuess.length !== 5) return prev;
      const guess = prev.currentGuess;
      const colors = evaluateGuess(guess, prev.answer);
      const newGuess: WordleGuess = { word: guess, colors };
      const won = colors.every(c => c === "green");
      const newGuesses = [...prev.guesses, newGuess];
      const lost = !won && newGuesses.length >= prev.maxGuesses;

      const newLetterMap = { ...prev.letterMap };
      for (let i = 0; i < 5; i++) {
        const ch = guess[i];
        const existing = newLetterMap[ch];
        if (!existing || (existing === "yellow" && colors[i] === "green") || (existing === "gray")) {
          newLetterMap[ch] = colors[i];
        }
      }

      return {
        ...prev,
        guesses: newGuesses,
        currentGuess: "",
        won,
        lost,
        moves: prev.moves + 1,
        letterMap: newLetterMap,
        hintText: won ? `Excellent! The word was ${prev.answer}` : lost ? `The word was ${prev.answer}` : null,
      };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const revealIdx = Math.floor(Math.random() * 5);
      return { ...prev, hintText: `Letter ${revealIdx + 1} is "${prev.answer[revealIdx]}"` };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 2000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const answer = cfg.wordPool[Math.floor(Math.random() * cfg.wordPool.length)];
      return { ...prev, answer, guesses: [], currentGuess: "", won: false, lost: false, hintText: null, peeking: false, shakeRow: false, letterMap: {}, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, typeChar, deleteLast, submitGuess, hint, peek, restart, goToMenu };
}

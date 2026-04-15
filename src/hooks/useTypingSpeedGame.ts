import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const WORDS_EASY = ["cat","dog","run","sun","big","red","box","cup","hat","map","net","pen","six","ten","yes"];
const WORDS_MEDIUM = ["bread","chair","cloud","dance","fence","grape","heart","jewel","knife","light","magic","nurse","oven","paint","queen"];
const WORDS_HARD = ["bridge","chrome","domain","engine","flight","growth","handle","impact","jungle","launch","mirror","number","object","palace","rescue"];
const WORDS_EXPERT = ["abandon","benefit","century","defence","embrace","fantasy","gravity","horizon","instead","journey","kitchen","library","maximum","network","optimum"];
const WORDS_MASTER = ["advanced","benefits","creation","database","elements","function","graphics","hardware","industry","judgment","keyboard","language","multiple","notebook","operator"];
const WORDS_LONG = ["absolutely","accomplish","background","calculation","department","elementary","especially","government","hypothesis","javascript","knowledge","legitimate","management","navigation","observation","practical","quarantine","reflection","successful","technology","understand","vulnerable","withdrawal","experience","performance"];
const WORDS_VLONG = ["accomplishment","administration","approximately","characteristics","communication","consideration","demonstration","electromagnetic","establishment","functionality","initialization","interpretation","justification","knowledgeable","manufacturer"];

interface TypingConfig {
  rounds: number;
  timePerWord: number;
  words: string[];
}

const CONFIGS: Record<Difficulty, TypingConfig> = {
  easy:        { rounds: 8,  timePerWord: 10000, words: WORDS_EASY   },
  medium:      { rounds: 10, timePerWord: 8000,  words: WORDS_MEDIUM },
  hard:        { rounds: 12, timePerWord: 7000,  words: WORDS_HARD   },
  expert:      { rounds: 14, timePerWord: 6000,  words: WORDS_EXPERT },
  master:      { rounds: 16, timePerWord: 5000,  words: WORDS_MASTER },
  grandmaster: { rounds: 18, timePerWord: 4500,  words: WORDS_LONG   },
  genius:      { rounds: 20, timePerWord: 4000,  words: WORDS_LONG   },
  legend:      { rounds: 22, timePerWord: 3500,  words: WORDS_VLONG  },
  mythic:      { rounds: 24, timePerWord: 3000,  words: WORDS_VLONG  },
  immortal:    { rounds: 26, timePerWord: 2500,  words: WORDS_VLONG  },
  divine:      { rounds: 28, timePerWord: 2000,  words: WORDS_VLONG  },
};

export interface TypingState {
  words: string[];
  currentIndex: number;
  input: string;
  score: number;
  wrong: number;
  won: boolean;
  lost: boolean;
  moves: number;
  difficulty: string;
  timePerWord: number;
  lastSubmitCorrect: boolean | null;
  hintText: string | null;
  peeking: boolean;
}

export function useTypingSpeedGame() {
  const [game, setGame] = useState<TypingState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const words = shuffle([...cfg.words], rand).slice(0, cfg.rounds);
    setGame({
      words,
      currentIndex: 0,
      input: "",
      score: 0,
      wrong: 0,
      won: false,
      lost: false,
      moves: 0,
      difficulty,
      timePerWord: cfg.timePerWord,
      lastSubmitCorrect: null,
      hintText: null,
      peeking: false,
    });
  }, []);

  const setInput = useCallback((text: string) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      return { ...prev, input: text, lastSubmitCorrect: null };
    });
  }, []);

  const submitWord = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const target = prev.words[prev.currentIndex];
      const correct = prev.input.trim().toLowerCase() === target.toLowerCase();
      const nextIndex = prev.currentIndex + 1;
      const won = correct && nextIndex >= prev.words.length;
      return {
        ...prev,
        input: correct ? "" : prev.input,
        score: correct ? prev.score + 1 : prev.score,
        wrong: correct ? prev.wrong : prev.wrong + 1,
        currentIndex: correct ? nextIndex : prev.currentIndex,
        won,
        moves: prev.moves + 1,
        lastSubmitCorrect: correct,
      };
    });
  }, []);

  const timeOut = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.words.length) {
        return { ...prev, input: "", currentIndex: nextIndex, won: true };
      }
      return { ...prev, input: "", currentIndex: nextIndex, wrong: prev.wrong + 1 };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const word = prev.words[prev.currentIndex];
      return { ...prev, hintText: `First 2 letters: "${word.slice(0, 2)}"` };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 2000);
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.currentIndex === 0) return prev;
      return { ...prev, currentIndex: prev.currentIndex - 1, input: "", hintText: null };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const words = shuffle([...cfg.words], Math.random).slice(0, cfg.rounds);
      return { ...prev, words, currentIndex: 0, input: "", score: 0, wrong: 0, won: false, lost: false, hintText: null, peeking: false, moves: 0, lastSubmitCorrect: null };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, setInput, submitWord, timeOut, hint, peek, undo, restart, goToMenu };
}

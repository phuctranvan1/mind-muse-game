import { useState, useCallback, useRef, useEffect } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius" | "legend" | "mythic" | "immortal" | "divine";

const CONFIGS: Record<Difficulty, { gridSize: number; patternLength: number; showTime: number }> = {
  easy: { gridSize: 4, patternLength: 5, showTime: 1660 },
  medium: { gridSize: 4, patternLength: 8, showTime: 1660 },
  hard: { gridSize: 5, patternLength: 10, showTime: 1250 },
  expert: { gridSize: 5, patternLength: 12, showTime: 1000 },
  master: { gridSize: 6, patternLength: 17, showTime: 830 },
  grandmaster: { gridSize: 7, patternLength: 22, showTime: 660 },
  genius: { gridSize: 7, patternLength: 29, showTime: 500 },
  legend: { gridSize: 8, patternLength: 36, showTime: 290 },
  mythic: { gridSize: 9, patternLength: 48, showTime: 200 },
  immortal: { gridSize: 9, patternLength: 62, showTime: 165 },
  divine: { gridSize: 10, patternLength: 76, showTime: 125 },
};

export interface PatternRecallState {
  gridSize: number; difficulty: Difficulty; pattern: number[];
  playerPattern: number[]; phase: "showing" | "input" | "won" | "lost";
  currentShowIndex: number; round: number; score: number;
  hintCell: number | null; peeking: boolean;
}

export function usePatternRecallGame() {
  const [game, setGame] = useState<PatternRecallState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (peekTimeout.current) clearTimeout(peekTimeout.current);
    };
  }, []);

  const generatePattern = (gridSize: number, length: number, rand: () => number = Math.random) => {
    const total = gridSize * gridSize;
    return Array.from({ length }, () => Math.floor(rand() * total));
  };

  const showPattern = useCallback((state: PatternRecallState) => {
    const config = CONFIGS[state.difficulty];
    let idx = 0;
    const show = () => {
      setGame(g => g ? { ...g, currentShowIndex: idx, phase: "showing" } : g);
      idx++;
      if (idx <= state.pattern.length) {
        timerRef.current = setTimeout(show, config.showTime / 2);
      } else {
        timerRef.current = setTimeout(() => {
          setGame(g => g ? { ...g, phase: "input", currentShowIndex: -1 } : g);
        }, 300);
      }
    };
    show();
  }, []);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const config = CONFIGS[difficulty];
    const pattern = generatePattern(config.gridSize, config.patternLength, rand);
    const state: PatternRecallState = {
      gridSize: config.gridSize, difficulty, pattern, playerPattern: [],
      phase: "showing", currentShowIndex: -1, round: 1, score: 0,
      hintCell: null, peeking: false,
    };
    setGame(state);
    setTimeout(() => showPattern(state), 500);
  }, [showPattern]);

  const tapCell = useCallback((index: number) => {
    setGame(prev => {
      if (!prev || prev.phase !== "input") return prev;
      const newPlayer = [...prev.playerPattern, index];
      const stepIdx = newPlayer.length - 1;
      if (newPlayer[stepIdx] !== prev.pattern[stepIdx]) {
        return { ...prev, playerPattern: newPlayer, phase: "lost" };
      }
      if (newPlayer.length === prev.pattern.length) {
        return { ...prev, playerPattern: newPlayer, phase: "won", score: prev.score + prev.pattern.length };
      }
      return { ...prev, playerPattern: newPlayer, hintCell: null };
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.phase !== "input" || prev.playerPattern.length === 0) return prev;
      return { ...prev, playerPattern: prev.playerPattern.slice(0, -1), hintCell: null };
    });
  }, []);

  const hint = useCallback(() => {
    // Replay the pattern
    setGame(prev => {
      if (!prev || prev.phase !== "input") return prev;
      const nextIdx = prev.playerPattern.length;
      if (nextIdx < prev.pattern.length) {
        return { ...prev, hintCell: prev.pattern[nextIdx] };
      }
      return prev;
    });
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, hintCell: null } : prev);
    }, 1000);
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => {
      if (!prev || prev.phase !== "input") return prev;
      return { ...prev, peeking: true };
    });
    // Re-show the full pattern
    setGame(prev => {
      if (!prev) return prev;
      showPattern({ ...prev, phase: "showing" });
      return prev;
    });
  }, [showPattern]);

  const nextRound = useCallback(() => {
    setGame(prev => {
      if (!prev) return null;
      const config = CONFIGS[prev.difficulty];
      const newLength = config.patternLength + prev.round * 2;
      const pattern = generatePattern(config.gridSize, newLength);
      const state: PatternRecallState = {
        ...prev, pattern, playerPattern: [], phase: "showing",
        currentShowIndex: -1, round: prev.round + 1, hintCell: null, peeking: false,
      };
      setTimeout(() => showPattern(state), 500);
      return state;
    });
  }, [showPattern]);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return null;
      const config = CONFIGS[prev.difficulty];
      const pattern = generatePattern(config.gridSize, config.patternLength);
      const state: PatternRecallState = {
        gridSize: config.gridSize, difficulty: prev.difficulty, pattern,
        playerPattern: [], phase: "showing", currentShowIndex: -1,
        round: 1, score: 0, hintCell: null, peeking: false,
      };
      setTimeout(() => showPattern(state), 500);
      return state;
    });
  }, [showPattern]);

  const goToMenu = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(null);
  }, []);

  return { game, startGame, tapCell, undo, hint, peek, nextRound, restart, goToMenu };
}

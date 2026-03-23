import { useState, useCallback, useRef, useEffect } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master";

const CONFIGS: Record<Difficulty, { gridSize: number; patternLength: number; showTime: number }> = {
  easy: { gridSize: 3, patternLength: 4, showTime: 2000 },
  medium: { gridSize: 4, patternLength: 6, showTime: 2000 },
  hard: { gridSize: 4, patternLength: 8, showTime: 1500 },
  expert: { gridSize: 5, patternLength: 10, showTime: 1200 },
  master: { gridSize: 5, patternLength: 14, showTime: 1000 },
};

export interface PatternRecallState {
  gridSize: number;
  difficulty: Difficulty;
  pattern: number[];
  playerPattern: number[];
  phase: "showing" | "input" | "won" | "lost";
  currentShowIndex: number;
  round: number;
  score: number;
}

export function usePatternRecallGame() {
  const [game, setGame] = useState<PatternRecallState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const generatePattern = (gridSize: number, length: number, rand: () => number = Math.random) => {
    const total = gridSize * gridSize;
    const pattern: number[] = [];
    for (let i = 0; i < length; i++) {
      pattern.push(Math.floor(rand() * total));
    }
    return pattern;
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

  const startGame = useCallback((difficulty: Difficulty) => {
    const config = CONFIGS[difficulty];
    const pattern = generatePattern(config.gridSize, config.patternLength);
    const state: PatternRecallState = {
      gridSize: config.gridSize,
      difficulty,
      pattern,
      playerPattern: [],
      phase: "showing",
      currentShowIndex: -1,
      round: 1,
      score: 0,
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

      return { ...prev, playerPattern: newPlayer };
    });
  }, []);

  const nextRound = useCallback(() => {
    setGame(prev => {
      if (!prev) return null;
      const config = CONFIGS[prev.difficulty];
      const newLength = config.patternLength + prev.round * 2;
      const pattern = generatePattern(config.gridSize, newLength);
      const state: PatternRecallState = {
        ...prev,
        pattern,
        playerPattern: [],
        phase: "showing",
        currentShowIndex: -1,
        round: prev.round + 1,
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
        gridSize: config.gridSize,
        difficulty: prev.difficulty,
        pattern,
        playerPattern: [],
        phase: "showing",
        currentShowIndex: -1,
        round: 1,
        score: 0,
      };
      setTimeout(() => showPattern(state), 500);
      return state;
    });
  }, [showPattern]);

  const goToMenu = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGame(null);
  }, []);

  return { game, startGame, tapCell, nextRound, restart, goToMenu };
}

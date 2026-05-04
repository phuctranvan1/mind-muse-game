import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

function ri(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

interface ReflexConfig {
  gridSize: number;
  totalTargets: number;
  lives: number;
  targetMs: number;
}

const CONFIGS: Record<Difficulty, ReflexConfig> = {
  easy:        { gridSize: 5, totalTargets: 12, lives: 4, targetMs: 2080 },
  medium:      { gridSize: 5, totalTargets: 14, lives: 3, targetMs: 1660 },
  hard:        { gridSize: 6, totalTargets: 18, lives: 3, targetMs: 1250 },
  expert:      { gridSize: 6, totalTargets: 22, lives: 2, targetMs: 1000 },
  master:      { gridSize: 7, totalTargets: 24, lives: 2, targetMs: 830  },
  grandmaster: { gridSize: 7, totalTargets: 26, lives: 2, targetMs: 660  },
  genius:      { gridSize: 8, totalTargets: 30, lives: 2, targetMs: 540  },
  legend:      { gridSize: 8, totalTargets: 34, lives: 1, targetMs: 415  },
  mythic:      { gridSize: 9, totalTargets: 36, lives: 1, targetMs: 330  },
  immortal:    { gridSize: 9, totalTargets: 42, lives: 1, targetMs: 250  },
  divine:      { gridSize: 10, totalTargets: 48, lives: 1, targetMs: 200 },
};

export interface ReflexTarget {
  id: number;
  row: number;
  col: number;
  active: boolean;
}

export interface ReflexState {
  gridSize: number;
  target: ReflexTarget | null;
  targetId: number;
  score: number;
  lives: number;
  totalTargets: number;
  remaining: number;
  targetMs: number;
  won: boolean;
  lost: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
}

export function useReflexGame() {
  const [game, setGame] = useState<ReflexState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const targetId = 0;
    setGame({
      gridSize: cfg.gridSize,
      target: { id: targetId, row: ri(0, cfg.gridSize - 1, rand), col: ri(0, cfg.gridSize - 1, rand), active: true },
      targetId,
      score: 0,
      lives: cfg.lives,
      totalTargets: cfg.totalTargets,
      remaining: cfg.totalTargets,
      targetMs: cfg.targetMs,
      won: false,
      lost: false,
      moves: 0,
      difficulty,
      hintText: null,
      peeking: false,
    });
  }, []);

  const spawnNext = useCallback((prevId: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const newRemaining = prev.remaining - 1;
      if (newRemaining <= 0) {
        return { ...prev, target: null, remaining: 0, won: true };
      }
      const newId = prevId + 1;
      return {
        ...prev,
        target: {
          id: newId,
          row: Math.floor(Math.random() * prev.gridSize),
          col: Math.floor(Math.random() * prev.gridSize),
          active: true,
        },
        targetId: newId,
        remaining: newRemaining,
      };
    });
  }, []);

  const clickTarget = useCallback((targetId: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (!prev.target || prev.target.id !== targetId || !prev.target.active) return prev;
      const newScore = prev.score + 1;
      return { ...prev, target: { ...prev.target, active: false }, score: newScore, moves: prev.moves + 1 };
    });
    setTimeout(() => spawnNext(targetId), 200);
  }, [spawnNext]);

  const missTarget = useCallback((targetId: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (!prev.target || prev.target.id !== targetId) return prev;
      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        return { ...prev, target: null, lives: 0, lost: true };
      }
      return { ...prev, target: { ...prev.target, active: false }, lives: newLives };
    });
    setTimeout(() => spawnNext(targetId), 200);
  }, [spawnNext]);

  const hint = useCallback(() => {
    setGame(prev => prev ? { ...prev, hintText: "Click the target before it disappears!" } : prev);
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 1000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const targetId = 0;
      return {
        ...prev,
        target: { id: targetId, row: ri(0, cfg.gridSize - 1, Math.random), col: ri(0, cfg.gridSize - 1, Math.random), active: true },
        targetId, score: 0, lives: cfg.lives, remaining: cfg.totalTargets,
        won: false, lost: false, hintText: null, peeking: false, moves: 0,
      };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, clickTarget, missTarget, hint, peek, restart, goToMenu };
}

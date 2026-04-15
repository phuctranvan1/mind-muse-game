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

const ALL_COLORS = ["red", "green", "blue", "yellow", "purple", "orange", "cyan", "pink"];
const COLOR_DISPLAY: Record<string, string> = {
  red: "🔴", green: "🟢", blue: "🔵", yellow: "🟡",
  purple: "🟣", orange: "🟠", cyan: "🔷", pink: "🩷",
};

interface SimonConfig {
  rounds: number;
  colorCount: number;
  showSpeedMs: number;
}

const CONFIGS: Record<Difficulty, SimonConfig> = {
  easy:        { rounds: 4,  colorCount: 3, showSpeedMs: 900 },
  medium:      { rounds: 5,  colorCount: 4, showSpeedMs: 750 },
  hard:        { rounds: 6,  colorCount: 4, showSpeedMs: 600 },
  expert:      { rounds: 7,  colorCount: 5, showSpeedMs: 500 },
  master:      { rounds: 8,  colorCount: 5, showSpeedMs: 400 },
  grandmaster: { rounds: 9,  colorCount: 6, showSpeedMs: 350 },
  genius:      { rounds: 10, colorCount: 6, showSpeedMs: 280 },
  legend:      { rounds: 12, colorCount: 7, showSpeedMs: 220 },
  mythic:      { rounds: 13, colorCount: 7, showSpeedMs: 180 },
  immortal:    { rounds: 14, colorCount: 8, showSpeedMs: 140 },
  divine:      { rounds: 15, colorCount: 8, showSpeedMs: 100 },
};

export interface SimonState {
  colors: string[];
  colorDisplay: Record<string, string>;
  sequence: number[];
  playerInput: number[];
  phase: "showing" | "input" | "won" | "lost";
  showIndex: number;
  currentRound: number;
  maxRounds: number;
  showSpeedMs: number;
  won: boolean;
  lost: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
}

export function useSimonGame() {
  const [game, setGame] = useState<SimonState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const colors = shuffle(ALL_COLORS.slice(0, cfg.colorCount), rand);
    const firstColor = Math.floor(rand() * cfg.colorCount);
    setGame({
      colors,
      colorDisplay: COLOR_DISPLAY,
      sequence: [firstColor],
      playerInput: [],
      phase: "showing",
      showIndex: 0,
      currentRound: 1,
      maxRounds: cfg.rounds,
      showSpeedMs: cfg.showSpeedMs,
      won: false,
      lost: false,
      moves: 0,
      difficulty,
      hintText: null,
      peeking: false,
    });
  }, []);

  const advanceShowIndex = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.phase !== "showing") return prev;
      const next = prev.showIndex + 1;
      if (next >= prev.sequence.length) {
        return { ...prev, showIndex: 0, phase: "input" };
      }
      return { ...prev, showIndex: next };
    });
  }, []);

  const pressColor = useCallback((colorIndex: number) => {
    setGame(prev => {
      if (!prev || prev.phase !== "input") return prev;
      const newInput = [...prev.playerInput, colorIndex];
      const expectedIdx = newInput.length - 1;
      if (newInput[expectedIdx] !== prev.sequence[expectedIdx]) {
        return { ...prev, playerInput: newInput, phase: "lost", lost: true };
      }
      if (newInput.length === prev.sequence.length) {
        const nextRound = prev.currentRound + 1;
        if (nextRound > prev.maxRounds) {
          return { ...prev, playerInput: [], phase: "won", won: true, moves: prev.moves + 1 };
        }
        const nextColor = Math.floor(Math.random() * prev.colors.length);
        return {
          ...prev,
          playerInput: [],
          sequence: [...prev.sequence, nextColor],
          phase: "showing",
          showIndex: 0,
          currentRound: nextRound,
          moves: prev.moves + 1,
        };
      }
      return { ...prev, playerInput: newInput, moves: prev.moves + 1 };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.phase !== "input") return prev;
      const nextIdx = prev.playerInput.length;
      if (nextIdx >= prev.sequence.length) return prev;
      const nextColor = prev.colors[prev.sequence[nextIdx]];
      return { ...prev, hintText: `Next: ${nextColor}` };
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => {
      if (!prev) return prev;
      return { ...prev, peeking: true };
    });
    peekTimeout.current = setTimeout(() => {
      setGame(prev => (prev ? { ...prev, peeking: false } : prev));
    }, 3000);
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.phase !== "input" || prev.playerInput.length === 0) return prev;
      return { ...prev, playerInput: prev.playerInput.slice(0, -1) };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const firstColor = Math.floor(Math.random() * prev.colors.length);
      return { ...prev, sequence: [firstColor], playerInput: [], phase: "showing", showIndex: 0, currentRound: 1, won: false, lost: false, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, pressColor, advanceShowIndex, hint, peek, undo, restart, goToMenu };
}

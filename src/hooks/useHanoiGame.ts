import { useState, useCallback } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const CONFIGS: Record<Difficulty, { discs: number; moveLimit: number | null }> = {
  easy: { discs: 3, moveLimit: null },
  medium: { discs: 4, moveLimit: null },
  hard: { discs: 5, moveLimit: 40 },
  expert: { discs: 6, moveLimit: 100 },
  master: { discs: 7, moveLimit: 180 },
  grandmaster: { discs: 8, moveLimit: 350 },
  genius: { discs: 9, moveLimit: 600 },
};

export interface HanoiState {
  pegs: number[][]; // 3 pegs, each an array of disc sizes (smaller = smaller number)
  discs: number;
  difficulty: Difficulty;
  moves: number;
  moveLimit: number | null;
  won: boolean;
  lost: boolean;
  selectedPeg: number | null;
}

export function useHanoiGame() {
  const [game, setGame] = useState<HanoiState | null>(null);

  const startGame = useCallback((difficulty: Difficulty) => {
    const config = CONFIGS[difficulty];
    const discs = Array.from({ length: config.discs }, (_, i) => i + 1); // [1,2,3,...n] smallest on top
    setGame({
      pegs: [discs, [], []],
      discs: config.discs,
      difficulty,
      moves: 0,
      moveLimit: config.moveLimit,
      won: false,
      lost: false,
      selectedPeg: null,
    });
  }, []);

  const selectPeg = useCallback((pegIdx: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;

      if (prev.selectedPeg === null) {
        // Select a peg (must have discs)
        if (prev.pegs[pegIdx].length === 0) return prev;
        return { ...prev, selectedPeg: pegIdx };
      }

      if (prev.selectedPeg === pegIdx) {
        // Deselect
        return { ...prev, selectedPeg: null };
      }

      // Try to move
      const fromPeg = [...prev.pegs[prev.selectedPeg]];
      const toPeg = [...prev.pegs[pegIdx]];
      const disc = fromPeg[0];

      if (toPeg.length > 0 && toPeg[0] < disc) {
        // Invalid move - can't place larger on smaller
        return { ...prev, selectedPeg: null };
      }

      fromPeg.shift();
      toPeg.unshift(disc);

      const newPegs = prev.pegs.map((p, i) => {
        if (i === prev.selectedPeg) return fromPeg;
        if (i === pegIdx) return toPeg;
        return [...p];
      });

      const newMoves = prev.moves + 1;
      const won = newPegs[2].length === prev.discs; // All discs on last peg
      const lost = !won && prev.moveLimit !== null && newMoves >= prev.moveLimit;

      return { ...prev, pegs: newPegs, moves: newMoves, won, lost, selectedPeg: null };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return null;
      const discs = Array.from({ length: prev.discs }, (_, i) => i + 1);
      return { ...prev, pegs: [discs, [], []], moves: 0, won: false, lost: false, selectedPeg: null };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectPeg, restart, goToMenu };
}

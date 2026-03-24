import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const CONFIGS: Record<Difficulty, { discs: number; moveLimit: number | null }> = {
  easy: { discs: 3, moveLimit: null }, medium: { discs: 4, moveLimit: null },
  hard: { discs: 5, moveLimit: 40 }, expert: { discs: 6, moveLimit: 100 },
  master: { discs: 7, moveLimit: 180 }, grandmaster: { discs: 8, moveLimit: 350 },
  genius: { discs: 9, moveLimit: 600 },
};

export interface HanoiState {
  pegs: number[][]; discs: number; difficulty: Difficulty;
  moves: number; moveLimit: number | null; won: boolean; lost: boolean;
  selectedPeg: number | null; hintMove: [number, number] | null; peeking: boolean;
}

// Compute optimal next move using recursive Hanoi solution
function getOptimalMove(pegs: number[][], discs: number): [number, number] | null {
  const state = pegs.map(p => [...p]);
  // Simple heuristic: find smallest disc not on target peg and suggest moving it
  for (let size = 1; size <= discs; size++) {
    let currentPeg = -1;
    for (let p = 0; p < 3; p++) {
      if (state[p].includes(size)) { currentPeg = p; break; }
    }
    if (currentPeg === 2) continue; // already on target
    // Try to move this disc to peg 2, or to the auxiliary peg
    const targetPeg = 2;
    const auxPeg = 3 - currentPeg - targetPeg;
    if (state[currentPeg][0] === size) {
      // Can move directly
      if (state[targetPeg].length === 0 || state[targetPeg][0] > size) {
        return [currentPeg, targetPeg];
      }
      if (state[auxPeg].length === 0 || state[auxPeg][0] > size) {
        return [currentPeg, auxPeg];
      }
    }
    // Need to move blocking discs first - find the top disc of current peg
    const topDisc = state[currentPeg][0];
    const topPeg = currentPeg;
    for (let p = 0; p < 3; p++) {
      if (p === topPeg) continue;
      if (state[p].length === 0 || state[p][0] > topDisc) {
        return [topPeg, p];
      }
    }
  }
  return null;
}

export function useHanoiGame() {
  const [game, setGame] = useState<HanoiState | null>(null);
  const historyRef = useRef<HanoiState[]>([]);

  const startGame = useCallback((difficulty: Difficulty) => {
    const config = CONFIGS[difficulty];
    const discs = Array.from({ length: config.discs }, (_, i) => i + 1);
    historyRef.current = [];
    setGame({
      pegs: [discs, [], []], discs: config.discs, difficulty,
      moves: 0, moveLimit: config.moveLimit, won: false, lost: false,
      selectedPeg: null, hintMove: null, peeking: false,
    });
  }, []);

  const selectPeg = useCallback((pegIdx: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (prev.selectedPeg === null) {
        if (prev.pegs[pegIdx].length === 0) return prev;
        return { ...prev, selectedPeg: pegIdx, hintMove: null };
      }
      if (prev.selectedPeg === pegIdx) return { ...prev, selectedPeg: null };

      const fromPeg = [...prev.pegs[prev.selectedPeg]];
      const toPeg = [...prev.pegs[pegIdx]];
      const disc = fromPeg[0];
      if (toPeg.length > 0 && toPeg[0] < disc) return { ...prev, selectedPeg: null };

      historyRef.current.push({ ...prev, pegs: prev.pegs.map(p => [...p]) });
      fromPeg.shift();
      toPeg.unshift(disc);
      const newPegs = prev.pegs.map((p, i) => {
        if (i === prev.selectedPeg) return fromPeg;
        if (i === pegIdx) return toPeg;
        return [...p];
      });
      const newMoves = prev.moves + 1;
      const won = newPegs[2].length === prev.discs;
      const lost = !won && prev.moveLimit !== null && newMoves >= prev.moveLimit;
      return { ...prev, pegs: newPegs, moves: newMoves, won, lost, selectedPeg: null, hintMove: null };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setGame(prev);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const move = getOptimalMove(prev.pegs, prev.discs);
      return { ...prev, hintMove: move, selectedPeg: null };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      return { ...prev, peeking: true };
    });
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const restart = useCallback(() => {
    historyRef.current = [];
    setGame(prev => {
      if (!prev) return null;
      const discs = Array.from({ length: prev.discs }, (_, i) => i + 1);
      return { ...prev, pegs: [discs, [], []], moves: 0, won: false, lost: false, selectedPeg: null, hintMove: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => { historyRef.current = []; setGame(null); }, []);

  return { game, startGame, selectPeg, undo, hint, peek, restart, goToMenu };
}

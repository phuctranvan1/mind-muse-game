import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius" | "legend";

const CONFIGS: Record<Difficulty, { colors: number; tubeSize: number; extraTubes: number }> = {
  easy: { colors: 3, tubeSize: 3, extraTubes: 1 },
  medium: { colors: 4, tubeSize: 4, extraTubes: 1 },
  hard: { colors: 6, tubeSize: 4, extraTubes: 2 },
  expert: { colors: 8, tubeSize: 4, extraTubes: 2 },
  master: { colors: 10, tubeSize: 4, extraTubes: 2 },
  grandmaster: { colors: 12, tubeSize: 5, extraTubes: 2 },
  genius: { colors: 14, tubeSize: 5, extraTubes: 2 },
  legend: { colors: 16, tubeSize: 5, extraTubes: 2 },
};

const COLOR_NAMES = [
  "red", "blue", "green", "yellow", "purple", "orange", "pink", "teal", "amber", "indigo",
  "lime", "cyan", "rose", "violet", "sky", "fuchsia",
];

function generateTubes(colors: number, tubeSize: number, extraTubes: number, rand: () => number = Math.random): string[][] {
  const allPieces: string[] = [];
  for (let c = 0; c < colors; c++)
    for (let s = 0; s < tubeSize; s++)
      allPieces.push(COLOR_NAMES[c]);
  for (let i = allPieces.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [allPieces[i], allPieces[j]] = [allPieces[j], allPieces[i]];
  }
  const tubes: string[][] = [];
  let idx = 0;
  for (let t = 0; t < colors; t++) {
    tubes.push(allPieces.slice(idx, idx + tubeSize));
    idx += tubeSize;
  }
  for (let e = 0; e < extraTubes; e++) tubes.push([]);
  return tubes;
}

function isSorted(tubes: string[][], tubeSize: number): boolean {
  return tubes.every(tube => {
    if (tube.length === 0) return true;
    if (tube.length !== tubeSize) return false;
    return tube.every(c => c === tube[0]);
  });
}

function findHintMove(tubes: string[][], tubeSize: number): [number, number] | null {
  for (let from = 0; from < tubes.length; from++) {
    if (tubes[from].length === 0) continue;
    const topColor = tubes[from][tubes[from].length - 1];
    // Prefer moving to a tube with matching top color
    for (let to = 0; to < tubes.length; to++) {
      if (from === to) continue;
      if (tubes[to].length >= tubeSize) continue;
      if (tubes[to].length > 0 && tubes[to][tubes[to].length - 1] === topColor) return [from, to];
    }
    // Move to empty tube
    for (let to = 0; to < tubes.length; to++) {
      if (from === to) continue;
      if (tubes[to].length === 0) return [from, to];
    }
  }
  return null;
}

export interface ColorSortState {
  tubes: string[][]; tubeSize: number; numColors: number; difficulty: Difficulty;
  moves: number; won: boolean; selectedTube: number | null;
  hintMove: [number, number] | null; peeking: boolean;
}

export function useColorSortGame() {
  const [game, setGame] = useState<ColorSortState | null>(null);
  const historyRef = useRef<ColorSortState[]>([]);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const config = CONFIGS[difficulty];
    historyRef.current = [];
    setGame({
      tubes: generateTubes(config.colors, config.tubeSize, config.extraTubes, rand),
      tubeSize: config.tubeSize, numColors: config.colors, difficulty,
      moves: 0, won: false, selectedTube: null, hintMove: null, peeking: false,
    });
  }, []);

  const selectTube = useCallback((tubeIdx: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      if (prev.selectedTube === null) {
        if (prev.tubes[tubeIdx].length === 0) return prev;
        return { ...prev, selectedTube: tubeIdx, hintMove: null };
      }
      if (prev.selectedTube === tubeIdx) return { ...prev, selectedTube: null };

      const fromTube = [...prev.tubes[prev.selectedTube]];
      const toTube = [...prev.tubes[tubeIdx]];
      if (fromTube.length === 0) return { ...prev, selectedTube: null };
      if (toTube.length >= prev.tubeSize) return { ...prev, selectedTube: null };
      const topColor = fromTube[fromTube.length - 1];
      if (toTube.length > 0 && toTube[toTube.length - 1] !== topColor) return { ...prev, selectedTube: null };

      historyRef.current.push({ ...prev, tubes: prev.tubes.map(t => [...t]) });
      let count = 0;
      while (fromTube.length > 0 && fromTube[fromTube.length - 1] === topColor && toTube.length < prev.tubeSize) {
        toTube.push(fromTube.pop()!);
        count++;
      }
      if (count === 0) return { ...prev, selectedTube: null };
      const newTubes = prev.tubes.map((t, i) => {
        if (i === prev.selectedTube) return fromTube;
        if (i === tubeIdx) return toTube;
        return [...t];
      });
      const won = isSorted(newTubes, prev.tubeSize);
      return { ...prev, tubes: newTubes, moves: prev.moves + 1, won, selectedTube: null, hintMove: null };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setGame(prev);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      return { ...prev, hintMove: findHintMove(prev.tubes, prev.tubeSize), selectedTube: null };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const restart = useCallback(() => {
    historyRef.current = [];
    setGame(prev => {
      if (!prev) return null;
      const config = CONFIGS[prev.difficulty];
      return { ...prev, tubes: generateTubes(config.colors, config.tubeSize, config.extraTubes), moves: 0, won: false, selectedTube: null, hintMove: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => { historyRef.current = []; setGame(null); }, []);

  return { game, startGame, selectTube, undo, hint, peek, restart, goToMenu };
}

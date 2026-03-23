import { useState, useCallback } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master";

const CONFIGS: Record<Difficulty, { colors: number; tubeSize: number; extraTubes: number }> = {
  easy: { colors: 3, tubeSize: 3, extraTubes: 1 },
  medium: { colors: 4, tubeSize: 4, extraTubes: 1 },
  hard: { colors: 6, tubeSize: 4, extraTubes: 2 },
  expert: { colors: 8, tubeSize: 4, extraTubes: 2 },
  master: { colors: 10, tubeSize: 4, extraTubes: 2 },
};

const COLOR_NAMES = [
  "red", "blue", "green", "yellow", "purple", "orange", "pink", "teal", "amber", "indigo",
];

function generateTubes(colors: number, tubeSize: number, extraTubes: number, rand: () => number = Math.random): string[][] {
  const allPieces: string[] = [];
  for (let c = 0; c < colors; c++) {
    for (let s = 0; s < tubeSize; s++) {
      allPieces.push(COLOR_NAMES[c]);
    }
  }

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

  for (let e = 0; e < extraTubes; e++) {
    tubes.push([]);
  }

  return tubes;
}

function isSorted(tubes: string[][], tubeSize: number): boolean {
  return tubes.every(tube => {
    if (tube.length === 0) return true;
    if (tube.length !== tubeSize) return false;
    return tube.every(c => c === tube[0]);
  });
}

export interface ColorSortState {
  tubes: string[][];
  tubeSize: number;
  numColors: number;
  difficulty: Difficulty;
  moves: number;
  won: boolean;
  selectedTube: number | null;
}

export function useColorSortGame() {
  const [game, setGame] = useState<ColorSortState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const config = CONFIGS[difficulty];
    setGame({
      tubes: generateTubes(config.colors, config.tubeSize, config.extraTubes, rand),
      tubeSize: config.tubeSize,
      numColors: config.colors,
      difficulty,
      moves: 0,
      won: false,
      selectedTube: null,
    });
  }, []);

  const selectTube = useCallback((tubeIdx: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;

      if (prev.selectedTube === null) {
        if (prev.tubes[tubeIdx].length === 0) return prev;
        return { ...prev, selectedTube: tubeIdx };
      }

      if (prev.selectedTube === tubeIdx) {
        return { ...prev, selectedTube: null };
      }

      const fromTube = [...prev.tubes[prev.selectedTube]];
      const toTube = [...prev.tubes[tubeIdx]];

      if (fromTube.length === 0) return { ...prev, selectedTube: null };
      if (toTube.length >= prev.tubeSize) return { ...prev, selectedTube: null };

      const topColor = fromTube[fromTube.length - 1];
      if (toTube.length > 0 && toTube[toTube.length - 1] !== topColor) {
        return { ...prev, selectedTube: null };
      }

      // Pour as many matching colors as possible
      let count = 0;
      while (
        fromTube.length > 0 &&
        fromTube[fromTube.length - 1] === topColor &&
        toTube.length < prev.tubeSize
      ) {
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

      return { ...prev, tubes: newTubes, moves: prev.moves + 1, won, selectedTube: null };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return null;
      const config = CONFIGS[prev.difficulty];
      return {
        ...prev,
        tubes: generateTubes(config.colors, config.tubeSize, config.extraTubes),
        moves: 0,
        won: false,
        selectedTube: null,
      };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectTube, restart, goToMenu };
}

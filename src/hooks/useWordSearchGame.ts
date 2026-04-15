import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

function ri(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const WORD_LIST: Record<number, string[]> = {
  3: ["CAT","DOG","SUN","RUN","HAT","MAP","CUP","PEN","BOX","TOP"],
  4: ["BIRD","FIRE","GOLD","HUNT","JUMP","KNOT","LAMP","MOON","NOVA","PALM"],
  5: ["APPLE","BRAVE","CLOUD","DANCE","EAGLE","FLAME","GLOBE","HEART","IVORY","JEWEL"],
  6: ["BRIDGE","CANDLE","DRAGON","FLOWER","GARDEN","HAMMER","ISLAND","JUNGLE","KNIGHT","LANTERN"],
  7: ["CAPTAIN","DIAMOND","FANTASY","GALILEO","HARVEST","ICEBERG","JOURNEY","KINGDOM","LANTERN","MYSTERY"],
  8: ["ABSTRACT","BUILDING","CREATIVE","DATABASE","ELECTRIC","FRAGMENT","GRATEFUL","HARDWARE"],
};

const DIRECTIONS = [
  [0, 1],  // right
  [1, 0],  // down
  [1, 1],  // diagonal down-right
  [0, -1], // left
  [-1, 0], // up
  [-1, -1],// diagonal up-left
  [1, -1], // diagonal down-left
  [-1, 1], // diagonal up-right
];

interface WordSearchConfig {
  gridSize: number;
  wordCount: number;
  wordLengths: number[];
}

const CONFIGS: Record<Difficulty, WordSearchConfig> = {
  easy:        { gridSize: 7,  wordCount: 3,  wordLengths: [3,3,4]         },
  medium:      { gridSize: 8,  wordCount: 4,  wordLengths: [3,4,4,5]       },
  hard:        { gridSize: 9,  wordCount: 5,  wordLengths: [4,4,5,5,6]     },
  expert:      { gridSize: 10, wordCount: 6,  wordLengths: [4,5,5,6,6,7]   },
  master:      { gridSize: 11, wordCount: 7,  wordLengths: [5,5,6,6,7,7,8] },
  grandmaster: { gridSize: 12, wordCount: 8,  wordLengths: [5,5,6,6,6,7,7,8] },
  genius:      { gridSize: 13, wordCount: 9,  wordLengths: [5,5,5,6,6,7,7,8,8] },
  legend:      { gridSize: 14, wordCount: 10, wordLengths: [5,5,5,6,6,6,7,7,8,8] },
  mythic:      { gridSize: 14, wordCount: 11, wordLengths: [5,5,5,5,6,6,6,7,7,7,8] },
  immortal:    { gridSize: 15, wordCount: 12, wordLengths: [5,5,5,5,6,6,6,6,7,7,8,8] },
  divine:      { gridSize: 15, wordCount: 13, wordLengths: [5,5,5,5,6,6,6,6,7,7,7,8,8] },
};

export interface WordInGrid {
  word: string;
  startRow: number;
  startCol: number;
  dirRow: number;
  dirCol: number;
  found: boolean;
}

function buildGrid(size: number, words: WordInGrid[]): string[][] {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  for (const w of words) {
    for (let i = 0; i < w.word.length; i++) {
      grid[w.startRow + i * w.dirRow][w.startCol + i * w.dirCol] = w.word[i];
    }
  }
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * 26)];
    }
  }
  return grid;
}

function placeWord(word: string, grid: string[][], size: number, rand: () => number): { startRow: number; startCol: number; dirRow: number; dirCol: number } | null {
  const dirs = [...DIRECTIONS];
  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }
  for (const [dr, dc] of dirs) {
    for (let attempt = 0; attempt < 20; attempt++) {
      const startRow = ri(0, size - 1, rand);
      const startCol = ri(0, size - 1, rand);
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = startRow + i * dr;
        const c = startCol + i * dc;
        if (r < 0 || r >= size || c < 0 || c >= size) { fits = false; break; }
        if (grid[r][c] && grid[r][c] !== word[i]) { fits = false; break; }
      }
      if (fits) return { startRow, startCol, dirRow: dr, dirCol: dc };
    }
  }
  return null;
}

function generateWordSearch(cfg: WordSearchConfig, rand: () => number): { grid: string[][]; words: WordInGrid[] } {
  const grid: string[][] = Array.from({ length: cfg.gridSize }, () => Array(cfg.gridSize).fill(""));
  const placedWords: WordInGrid[] = [];

  for (const len of cfg.wordLengths) {
    const pool = WORD_LIST[len] ?? WORD_LIST[5];
    const usedWords = new Set(placedWords.map(w => w.word));
    const available = pool.filter(w => !usedWords.has(w));
    if (available.length === 0) continue;
    const word = available[Math.floor(rand() * available.length)];
    const placement = placeWord(word, grid, cfg.gridSize, rand);
    if (!placement) continue;
    for (let i = 0; i < word.length; i++) {
      grid[placement.startRow + i * placement.dirRow][placement.startCol + i * placement.dirCol] = word[i];
    }
    placedWords.push({ word, ...placement, found: false });
  }

  const finalGrid = buildGrid(cfg.gridSize, placedWords);
  return { grid: finalGrid, words: placedWords };
}

export interface WordSearchState {
  grid: string[][];
  words: WordInGrid[];
  selection: { row: number; col: number } | null;
  gridSize: number;
  won: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
}

export function useWordSearchGame() {
  const [game, setGame] = useState<WordSearchState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const { grid, words } = generateWordSearch(cfg, rand);
    setGame({
      grid, words, selection: null, gridSize: cfg.gridSize,
      won: false, moves: 0, difficulty, hintText: null, peeking: false,
    });
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      if (!prev.selection) {
        return { ...prev, selection: { row, col } };
      }
      const start = prev.selection;
      if (start.row === row && start.col === col) {
        return { ...prev, selection: null };
      }
      const dr = Math.sign(row - start.row);
      const dc = Math.sign(col - start.col);
      const len = Math.max(Math.abs(row - start.row), Math.abs(col - start.col)) + 1;
      const selected = Array.from({ length: len }, (_, i) => prev.grid[start.row + i * dr]?.[start.col + i * dc] ?? "").join("");

      const foundWord = prev.words.find(w =>
        !w.found &&
        (w.word === selected || w.word === selected.split("").reverse().join("")) &&
        ((w.startRow === start.row && w.startCol === start.col && w.dirRow === dr && w.dirCol === dc) ||
         (w.startRow === row && w.startCol === col && w.dirRow === -dr && w.dirCol === -dc))
      );

      if (foundWord) {
        const updatedWords = prev.words.map(w => w.word === foundWord.word ? { ...w, found: true } : w);
        const won = updatedWords.every(w => w.found);
        return { ...prev, words: updatedWords, selection: null, won, moves: prev.moves + 1 };
      }
      return { ...prev, selection: null, moves: prev.moves + 1 };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const unfound = prev.words.find(w => !w.found);
      if (!unfound) return prev;
      const dirName = unfound.dirRow === 0 ? "horizontal" : unfound.dirCol === 0 ? "vertical" : "diagonal";
      return { ...prev, hintText: `"${unfound.word}" starts at row ${unfound.startRow + 1}, col ${unfound.startCol + 1} (${dirName})` };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 3000);
  }, []);

  const undo = useCallback(() => {
    setGame(prev => prev ? { ...prev, selection: null } : prev);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const { grid, words } = generateWordSearch(cfg, Math.random);
      return { ...prev, grid, words, selection: null, won: false, hintText: null, peeking: false, moves: 0 };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, selectCell, hint, peek, undo, restart, goToMenu };
}

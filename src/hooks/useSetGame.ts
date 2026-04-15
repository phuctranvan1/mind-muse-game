import { useState, useCallback, useRef } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

// SET card game: each card has 4 attributes, each with 3 values
// color: 0=red, 1=green, 2=blue
// shape: 0=circle, 1=diamond, 2=square
// count: 1, 2, 3
// fill: 0=solid, 1=striped, 2=empty

export interface SetCard {
  color: 0 | 1 | 2;
  shape: 0 | 1 | 2;
  count: 1 | 2 | 3;
  fill: 0 | 1 | 2;
  id: number;
}

function isSet(a: SetCard, b: SetCard, c: SetCard): boolean {
  const attrs: (keyof Omit<SetCard, "id">)[] = ["color", "shape", "count", "fill"];
  return attrs.every(attr => {
    const vals = new Set([a[attr], b[attr], c[attr]]);
    return vals.size === 1 || vals.size === 3;
  });
}

function buildDeck(): SetCard[] {
  const cards: SetCard[] = [];
  let id = 0;
  for (const color of [0, 1, 2] as const) {
    for (const shape of [0, 1, 2] as const) {
      for (const count of [1, 2, 3] as const) {
        for (const fill of [0, 1, 2] as const) {
          cards.push({ color, shape, count, fill, id: id++ });
        }
      }
    }
  }
  return cards;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findAllSets(cards: SetCard[]): [number, number, number][] {
  const sets: [number, number, number][] = [];
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        if (isSet(cards[i], cards[j], cards[k])) {
          sets.push([i, j, k]);
        }
      }
    }
  }
  return sets;
}

interface SetConfig {
  boardSize: number;
  setsToFind: number;
}

const CONFIGS: Record<Difficulty, SetConfig> = {
  easy:        { boardSize: 9,  setsToFind: 2 },
  medium:      { boardSize: 9,  setsToFind: 3 },
  hard:        { boardSize: 12, setsToFind: 4 },
  expert:      { boardSize: 12, setsToFind: 5 },
  master:      { boardSize: 12, setsToFind: 6 },
  grandmaster: { boardSize: 15, setsToFind: 7 },
  genius:      { boardSize: 15, setsToFind: 8 },
  legend:      { boardSize: 15, setsToFind: 9 },
  mythic:      { boardSize: 18, setsToFind: 10 },
  immortal:    { boardSize: 18, setsToFind: 11 },
  divine:      { boardSize: 18, setsToFind: 12 },
};

export interface SetGameState {
  board: SetCard[];
  selected: number[];
  setsFound: number;
  setsToFind: number;
  won: boolean;
  moves: number;
  difficulty: string;
  lastResult: "correct" | "wrong" | null;
  hintText: string | null;
  peeking: boolean;
}

export function useSetGame() {
  const [game, setGame] = useState<SetGameState | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const deck = shuffle(buildDeck(), rand);
    // Ensure there are enough sets on the board
    let board = deck.slice(0, cfg.boardSize);
    while (findAllSets(board).length < cfg.setsToFind && deck.length > cfg.boardSize) {
      board = deck.slice(0, cfg.boardSize + 3);
    }
    setGame({ board, selected: [], setsFound: 0, setsToFind: cfg.setsToFind, won: false, moves: 0, difficulty, lastResult: null, hintText: null, peeking: false });
  }, []);

  const toggleCard = useCallback((cardIdx: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const selected = prev.selected;
      if (selected.includes(cardIdx)) {
        return { ...prev, selected: selected.filter(i => i !== cardIdx), lastResult: null };
      }
      if (selected.length >= 3) return prev;
      const newSelected = [...selected, cardIdx];
      if (newSelected.length === 3) {
        const [a, b, c] = newSelected.map(i => prev.board[i]);
        const correct = isSet(a, b, c);
        const newSetsFound = correct ? prev.setsFound + 1 : prev.setsFound;
        const won = correct && newSetsFound >= prev.setsToFind;
        return { ...prev, selected: correct ? [] : newSelected, setsFound: newSetsFound, won, moves: prev.moves + 1, lastResult: correct ? "correct" : "wrong", hintText: null };
      }
      return { ...prev, selected: newSelected, lastResult: null };
    });
    // Clear wrong selection after delay
    setTimeout(() => {
      setGame(prev => {
        if (!prev || prev.lastResult !== "wrong") return prev;
        return { ...prev, selected: [], lastResult: null };
      });
    }, 800);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const sets = findAllSets(prev.board);
      if (sets.length > 0) {
        const [a] = sets[0];
        return { ...prev, hintText: `Card at position ${a + 1} is part of a valid set` };
      }
      return { ...prev, hintText: "Look for 3 cards where each attribute is all-same or all-different" };
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const sets = findAllSets(prev.board);
      if (sets.length > 0) {
        const [a, b, c] = sets[0];
        return { ...prev, peeking: true, hintText: `A valid set: positions ${a+1}, ${b+1}, ${c+1}` };
      }
      return { ...prev, peeking: true };
    });
    peekTimeout.current = setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 3000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const deck = shuffle(buildDeck(), Math.random);
      const board = deck.slice(0, cfg.boardSize);
      return { ...prev, board, selected: [], setsFound: 0, won: false, moves: 0, lastResult: null, hintText: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, toggleCard, hint, peek, restart, goToMenu };
}

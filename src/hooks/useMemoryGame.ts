import { useState, useCallback, useRef, useEffect } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const GRID_CONFIGS: Record<Difficulty, { pairs: number; cols: number }> = {
  easy: { pairs: 4, cols: 4 },
  medium: { pairs: 8, cols: 4 },
  hard: { pairs: 12, cols: 6 },
  expert: { pairs: 18, cols: 6 },
  master: { pairs: 24, cols: 8 },
  grandmaster: { pairs: 30, cols: 10 },
  genius: { pairs: 36, cols: 12 },
};

const SYMBOLS = ["★", "♦", "♠", "♣", "♥", "▲", "●", "■", "◆", "✦", "⬟", "⬡", "☀", "☾", "⚡", "♫", "✿", "⊕", "⊗", "⊞", "⊠", "⬢", "⬣", "⬤"];

export interface MemoryCard {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

export interface MemoryGameState {
  cards: MemoryCard[];
  cols: number;
  difficulty: Difficulty;
  moves: number;
  won: boolean;
  flippedIndices: number[];
  locked: boolean;
}

export function useMemoryGame() {
  const [game, setGame] = useState<MemoryGameState | null>(null);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (lockTimeout.current) clearTimeout(lockTimeout.current); };
  }, []);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const config = GRID_CONFIGS[difficulty];
    const symbols = SYMBOLS.slice(0, config.pairs);
    const deck = [...symbols, ...symbols]
      .map((symbol, index) => ({ symbol, order: rand(), index }))
      .sort((a, b) => a.order - b.order || a.index - b.index)
      .map(({ symbol }, id) => ({ id, symbol, flipped: false, matched: false }));
    setGame({ cards: deck, cols: config.cols, difficulty, moves: 0, won: false, flippedIndices: [], locked: false });
  }, []);

  const flipCard = useCallback((index: number) => {
    setGame(prev => {
      if (!prev || prev.locked || prev.won) return prev;
      const card = prev.cards[index];
      if (card.flipped || card.matched) return prev;

      const newCards = prev.cards.map((c, i) => i === index ? { ...c, flipped: true } : c);
      const newFlipped = [...prev.flippedIndices, index];

      if (newFlipped.length === 2) {
        const [i1, i2] = newFlipped;
        const match = newCards[i1].symbol === newCards[i2].symbol;

        if (match) {
          newCards[i1] = { ...newCards[i1], matched: true };
          newCards[i2] = { ...newCards[i2], matched: true };
          const won = newCards.every(c => c.matched);
          return { ...prev, cards: newCards, moves: prev.moves + 1, flippedIndices: [], won };
        } else {
          // Lock and flip back after delay
          if (lockTimeout.current) clearTimeout(lockTimeout.current);
          lockTimeout.current = setTimeout(() => {
            setGame(g => {
              if (!g) return g;
              const reset = g.cards.map((c, i) =>
                (i === i1 || i === i2) && !c.matched ? { ...c, flipped: false } : c
              );
              return { ...g, cards: reset, locked: false, flippedIndices: [] };
            });
          }, 800);
          return { ...prev, cards: newCards, moves: prev.moves + 1, locked: true, flippedIndices: newFlipped };
        }
      }

      return { ...prev, cards: newCards, flippedIndices: newFlipped };
    });
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return null;
      const config = GRID_CONFIGS[prev.difficulty];
      const symbols = SYMBOLS.slice(0, config.pairs);
      const deck = [...symbols, ...symbols]
        .map((symbol, index) => ({ symbol, order: Math.random(), index }))
        .sort((a, b) => a.order - b.order || a.index - b.index)
        .map(({ symbol }, id) => ({ id, symbol, flipped: false, matched: false }));
      return { cards: deck, cols: config.cols, difficulty: prev.difficulty, moves: 0, won: false, flippedIndices: [], locked: false };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, flipCard, restart, goToMenu };
}

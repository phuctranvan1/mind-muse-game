import { useState, useCallback, useRef, useEffect } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

const GRID_CONFIGS: Record<Difficulty, { pairs: number; cols: number }> = {
  easy: { pairs: 4, cols: 4 }, medium: { pairs: 8, cols: 4 }, hard: { pairs: 12, cols: 6 },
  expert: { pairs: 18, cols: 6 }, master: { pairs: 24, cols: 8 },
  grandmaster: { pairs: 30, cols: 10 }, genius: { pairs: 36, cols: 12 },
};

const SYMBOLS = ["★", "♦", "♠", "♣", "♥", "▲", "●", "■", "◆", "✦", "⬟", "⬡", "☀", "☾", "⚡", "♫", "✿", "⊕", "⊗", "⊞", "⊠", "⬢", "⬣", "⬤", "☆", "◇", "△", "□", "○", "⊙", "⊛", "⊜", "⊝", "⊚", "⊘", "⊖"];

export interface MemoryCard {
  id: number; symbol: string; flipped: boolean; matched: boolean;
}

export interface MemoryGameState {
  cards: MemoryCard[]; cols: number; difficulty: Difficulty; moves: number;
  won: boolean; flippedIndices: number[]; locked: boolean; peeking: boolean;
}

export function useMemoryGame() {
  const [game, setGame] = useState<MemoryGameState | null>(null);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyRef = useRef<{ cards: MemoryCard[]; moves: number }[]>([]);

  useEffect(() => {
    return () => {
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
      if (peekTimeout.current) clearTimeout(peekTimeout.current);
    };
  }, []);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const config = GRID_CONFIGS[difficulty];
    const symbols = SYMBOLS.slice(0, config.pairs);
    const deck = [...symbols, ...symbols]
      .map((symbol, index) => ({ symbol, order: rand(), index }))
      .sort((a, b) => a.order - b.order || a.index - b.index)
      .map(({ symbol }, id) => ({ id, symbol, flipped: false, matched: false }));
    historyRef.current = [];
    setGame({ cards: deck, cols: config.cols, difficulty, moves: 0, won: false, flippedIndices: [], locked: false, peeking: false });
  }, []);

  const flipCard = useCallback((index: number) => {
    setGame(prev => {
      if (!prev || prev.locked || prev.won || prev.peeking) return prev;
      const card = prev.cards[index];
      if (card.flipped || card.matched) return prev;

      const newCards = prev.cards.map((c, i) => i === index ? { ...c, flipped: true } : c);
      const newFlipped = [...prev.flippedIndices, index];

      if (newFlipped.length === 2) {
        const [i1, i2] = newFlipped;
        const match = newCards[i1].symbol === newCards[i2].symbol;

        if (match) {
          historyRef.current.push({ cards: prev.cards.map(c => ({ ...c })), moves: prev.moves });
          newCards[i1] = { ...newCards[i1], matched: true };
          newCards[i2] = { ...newCards[i2], matched: true };
          const won = newCards.every(c => c.matched);
          return { ...prev, cards: newCards, moves: prev.moves + 1, flippedIndices: [], won };
        } else {
          historyRef.current.push({ cards: prev.cards.map(c => ({ ...c })), moves: prev.moves });
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

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) {
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
      setGame(g => g ? { ...g, cards: prev.cards, moves: prev.moves, locked: false, flippedIndices: [], won: false } : g);
    }
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.locked || prev.peeking) return prev;
      // Find first unmatched pair and briefly reveal them
      const unmatched = prev.cards.filter(c => !c.matched && !c.flipped);
      if (unmatched.length < 2) return prev;
      const symbol = unmatched[0].symbol;
      const pair = prev.cards.filter(c => c.symbol === symbol && !c.matched);
      if (pair.length < 2) return prev;
      const newCards = prev.cards.map(c =>
        (c.id === pair[0].id || c.id === pair[1].id) ? { ...c, flipped: true } : c
      );
      return { ...prev, cards: newCards, locked: true };
    });
    // Hide after 1.5s
    setTimeout(() => {
      setGame(prev => {
        if (!prev) return prev;
        const newCards = prev.cards.map(c => c.matched ? c : { ...c, flipped: false });
        return { ...prev, cards: newCards, locked: false, flippedIndices: [] };
      });
    }, 1500);
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const newCards = prev.cards.map(c => ({ ...c, flipped: true }));
      return { ...prev, cards: newCards, peeking: true, locked: true };
    });
    peekTimeout.current = setTimeout(() => {
      setGame(prev => {
        if (!prev) return prev;
        const newCards = prev.cards.map(c => c.matched ? c : { ...c, flipped: false });
        return { ...prev, cards: newCards, peeking: false, locked: false, flippedIndices: [] };
      });
    }, 2000);
  }, []);

  const restart = useCallback(() => {
    historyRef.current = [];
    setGame(prev => {
      if (!prev) return null;
      const config = GRID_CONFIGS[prev.difficulty];
      const symbols = SYMBOLS.slice(0, config.pairs);
      const deck = [...symbols, ...symbols]
        .map((symbol, index) => ({ symbol, order: Math.random(), index }))
        .sort((a, b) => a.order - b.order || a.index - b.index)
        .map(({ symbol }, id) => ({ id, symbol, flipped: false, matched: false }));
      return { cards: deck, cols: config.cols, difficulty: prev.difficulty, moves: 0, won: false, flippedIndices: [], locked: false, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => { historyRef.current = []; setGame(null); }, []);

  return { game, startGame, flipCard, undo, hint, peek, restart, goToMenu };
}

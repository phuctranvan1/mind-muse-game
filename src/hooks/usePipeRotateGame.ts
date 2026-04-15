import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

// Pipe tile: connections on sides [N, E, S, W]
// Tile types:
// "I" horizontal: E,W (or N,S rotated)
// "L" corner: N,E (or rotations)
// "T" tee: N,E,W (or rotations)
// "+" cross: N,E,S,W
// "end" endpoint: one side

interface PipeConfig {
  size: number;
}

const CONFIGS: Record<Difficulty, PipeConfig> = {
  easy:        { size: 4  },
  medium:      { size: 5  },
  hard:        { size: 5  },
  expert:      { size: 6  },
  master:      { size: 6  },
  grandmaster: { size: 7  },
  genius:      { size: 7  },
  legend:      { size: 8  },
  mythic:      { size: 8  },
  immortal:    { size: 9  },
  divine:      { size: 10 },
};

// Connections as [N, E, S, W] booleans
export type PipeTile = {
  n: boolean; e: boolean; s: boolean; w: boolean;
  type: "I" | "L" | "T" | "+" | "end" | "empty";
  rotation: number; // 0,1,2,3 = 0°,90°,180°,270°
};

function rotateTile(tile: PipeTile): PipeTile {
  return { ...tile, n: tile.w, e: tile.n, s: tile.e, w: tile.s, rotation: (tile.rotation + 1) % 4 };
}

function randomizeRotation(tile: PipeTile, rand: () => number): PipeTile {
  let t = tile;
  const rotations = Math.floor(rand() * 4);
  for (let i = 0; i < rotations; i++) t = rotateTile(t);
  return t;
}

function makeTile(type: PipeTile["type"]): PipeTile {
  switch (type) {
    case "I":    return { type, rotation: 0, n: false, e: true,  s: false, w: true  };
    case "L":    return { type, rotation: 0, n: true,  e: true,  s: false, w: false };
    case "T":    return { type, rotation: 0, n: false, e: true,  s: true,  w: true  };
    case "+":    return { type, rotation: 0, n: true,  e: true,  s: true,  w: true  };
    case "end":  return { type, rotation: 0, n: false, e: true,  s: false, w: false };
    default:     return { type: "empty", rotation: 0, n: false, e: false, s: false, w: false };
  }
}

function generatePuzzle(size: number, rand: () => number): { tiles: PipeTile[][]; sourceR: number; sourceC: number; sinkR: number; sinkC: number } {
  const sourceR = 0, sourceC = 0;
  const sinkR = size - 1, sinkC = size - 1;

  // Generate a random path from source to sink
  const path: [number, number][] = [[sourceR, sourceC]];
  const inPath = new Set<number>([0]);
  let [r, c] = [sourceR, sourceC];

  while (!(r === sinkR && c === sinkC)) {
    const moves: [number, number][] = [];
    if (r > 0 && !inPath.has((r - 1) * size + c)) moves.push([r - 1, c]);
    if (r < size - 1 && !inPath.has((r + 1) * size + c)) moves.push([r + 1, c]);
    if (c > 0 && !inPath.has(r * size + c - 1)) moves.push([r, c - 1]);
    if (c < size - 1 && !inPath.has(r * size + c + 1)) moves.push([r, c + 1]);
    // bias towards sink
    const biased = moves.filter(([nr, nc]) => nr >= r || nc >= c);
    const choices = biased.length ? biased : moves;
    if (!choices.length) break;
    const [nr, nc] = choices[Math.floor(rand() * choices.length)];
    path.push([nr, nc]);
    inPath.add(nr * size + nc);
    r = nr; c = nc;
  }

  // Build tiles grid
  const tiles: PipeTile[][] = Array.from({ length: size }, () => Array(size).fill(null));

  for (let pr = 0; pr < size; pr++) {
    for (let pc = 0; pc < size; pc++) {
      if (!inPath.has(pr * size + pc)) {
        tiles[pr][pc] = makeTile("empty");
        continue;
      }
      const pathIdx = path.findIndex(([pr2, pc2]) => pr2 === pr && pc2 === pc);
      const prev = pathIdx > 0 ? path[pathIdx - 1] : null;
      const next = pathIdx < path.length - 1 ? path[pathIdx + 1] : null;
      const n = (prev && prev[0] < pr) || (next && next[0] < pr);
      const s = (prev && prev[0] > pr) || (next && next[0] > pr);
      const e = (prev && prev[1] > pc) || (next && next[1] > pc);
      const w = (prev && prev[1] < pc) || (next && next[1] < pc);
      const connCount = [n, e, s, w].filter(Boolean).length;
      const type: PipeTile["type"] = connCount === 1 ? "end" : connCount === 2 ? (n && s || e && w ? "I" : "L") : connCount === 3 ? "T" : "+";
      tiles[pr][pc] = { type, rotation: 0, n: !!n, e: !!e, s: !!s, w: !!w };
    }
  }

  // Shuffle rotations (except we store the solved state, then randomize)
  const shuffled: PipeTile[][] = tiles.map((row, ri) =>
    row.map((tile, ci) => {
      if (tile.type === "empty" || tile.type === "+") return tile;
      // Don't randomize source and sink
      if ((ri === sourceR && ci === sourceC) || (ri === sinkR && ci === sinkC)) return tile;
      return randomizeRotation(tile, rand);
    })
  );

  return { tiles: shuffled, sourceR, sourceC, sinkR, sinkC };
}

function isConnected(tiles: PipeTile[][], sourceR: number, sourceC: number, sinkR: number, sinkC: number, size: number): boolean {
  const visited = new Set<number>();
  const queue: [number, number][] = [[sourceR, sourceC]];
  visited.add(sourceR * size + sourceC);
  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r === sinkR && c === sinkC) return true;
    const t = tiles[r][c];
    const neighbors: [number, number, boolean, boolean][] = [
      [r - 1, c, t.n, r > 0 && tiles[r - 1][c].s],
      [r + 1, c, t.s, r < size - 1 && tiles[r + 1][c].n],
      [r, c + 1, t.e, c < size - 1 && tiles[r][c + 1].w],
      [r, c - 1, t.w, c > 0 && tiles[r][c - 1].e],
    ];
    for (const [nr, nc, outside, inside] of neighbors) {
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (!outside || !inside) continue;
      if (!visited.has(nr * size + nc)) {
        visited.add(nr * size + nc);
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

export interface PipeRotateState {
  tiles: PipeTile[][];
  size: number;
  sourceR: number; sourceC: number;
  sinkR: number; sinkC: number;
  won: boolean;
  moves: number;
  difficulty: string;
  hintText: string | null;
  peeking: boolean;
}

export function usePipeRotateGame() {
  const [game, setGame] = useState<PipeRotateState | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    const cfg = CONFIGS[difficulty];
    const { tiles, sourceR, sourceC, sinkR, sinkC } = generatePuzzle(cfg.size, rand);
    setGame({ tiles, size: cfg.size, sourceR, sourceC, sinkR, sinkC, won: false, moves: 0, difficulty, hintText: null, peeking: false });
  }, []);

  const rotateTileAt = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      const tiles = prev.tiles.map(r => r.map(t => ({ ...t })));
      tiles[row][col] = rotateTile(tiles[row][col]);
      const won = isConnected(tiles, prev.sourceR, prev.sourceC, prev.sinkR, prev.sinkC, prev.size);
      return { ...prev, tiles, won, moves: prev.moves + 1, hintText: null };
    });
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won) return prev;
      return { ...prev, hintText: "Connect pipes from the green source to the red sink" };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    setTimeout(() => setGame(prev => prev ? { ...prev, peeking: false } : prev), 2000);
  }, []);

  const undo = useCallback(() => {}, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const cfg = CONFIGS[prev.difficulty as Difficulty];
      const { tiles, sourceR, sourceC, sinkR, sinkC } = generatePuzzle(cfg.size, Math.random);
      return { ...prev, tiles, sourceR, sourceC, sinkR, sinkC, won: false, moves: 0, hintText: null, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, rotateTileAt, hint, peek, undo, restart, goToMenu };
}

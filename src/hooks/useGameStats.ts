import { useState, useCallback } from "react";
import { PuzzleType } from "@/components/game/PuzzleSelector";
import { Difficulty } from "@/hooks/useShiftGame";
import { parseTimeToSeconds } from "@/lib/puzzleUtils";

export interface PuzzleStat {
  played: number;
  won: number;
  bestMoves: number | null;
  bestTimeSeconds: number | null;
  totalMoves: number;
  totalTimeSeconds: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string | null;
  threeStarCount: number;
}

export interface GameStats {
  puzzles: Partial<Record<PuzzleType, PuzzleStat>>;
  totalWins: number;
  totalGames: number;
  dailyStreak: number;
  longestDailyStreak: number;
  lastDailyDate: string | null;
  winsByDifficulty: Partial<Record<Difficulty, number>>;
  playedPuzzleTypes: PuzzleType[];
  highestDifficulty: Difficulty | null;
}

const DEFAULT_PUZZLE_STAT: PuzzleStat = {
  played: 0,
  won: 0,
  bestMoves: null,
  bestTimeSeconds: null,
  totalMoves: 0,
  totalTimeSeconds: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
  threeStarCount: 0,
};

const DEFAULT_STATS: GameStats = {
  puzzles: {},
  totalWins: 0,
  totalGames: 0,
  dailyStreak: 0,
  longestDailyStreak: 0,
  lastDailyDate: null,
  winsByDifficulty: {},
  playedPuzzleTypes: [],
  highestDifficulty: null,
};

const STORAGE_KEY = "mindmuse_stats_v1";
const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard", "expert", "master", "grandmaster", "genius", "legend", "mythic", "immortal", "divine"];
const MS_PER_DAY = 86400000;

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadStats(): GameStats {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(s);
    return { ...DEFAULT_STATS, ...parsed };
  } catch { return { ...DEFAULT_STATS }; }
}

function saveStats(stats: GameStats) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch (_) { /* ignore */ }
}

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(loadStats);

  const recordGame = useCallback((
    puzzle: PuzzleType,
    difficulty: Difficulty,
    won: boolean,
    moves: number,
    time: string,
    stars: number,
    isDaily = false,
  ) => {
    const s = loadStats();
    const today = getTodayKey();
    const timeSeconds = parseTimeToSeconds(time);

    // Puzzle stats
    const ps: PuzzleStat = { ...DEFAULT_PUZZLE_STAT, ...(s.puzzles[puzzle] ?? {}) };
    ps.played++;
    ps.totalMoves += moves;
    ps.totalTimeSeconds += timeSeconds;
    ps.lastPlayedDate = today;

    if (won) {
      ps.won++;
      ps.currentStreak++;
      ps.bestStreak = Math.max(ps.bestStreak, ps.currentStreak);
      if (ps.bestMoves === null || moves < ps.bestMoves) ps.bestMoves = moves;
      if (ps.bestTimeSeconds === null || timeSeconds < ps.bestTimeSeconds) ps.bestTimeSeconds = timeSeconds;
      if (stars === 3) ps.threeStarCount++;
    } else {
      ps.currentStreak = 0;
    }

    s.puzzles[puzzle] = ps;
    s.totalGames++;
    if (won) s.totalWins++;

    // Difficulty tracking
    if (won) {
      s.winsByDifficulty[difficulty] = (s.winsByDifficulty[difficulty] ?? 0) + 1;
      const diffIdx = DIFFICULTY_ORDER.indexOf(difficulty);
      const highIdx = s.highestDifficulty ? DIFFICULTY_ORDER.indexOf(s.highestDifficulty) : -1;
      if (diffIdx > highIdx) s.highestDifficulty = difficulty;
    }

    // Played types
    if (!s.playedPuzzleTypes.includes(puzzle)) {
      s.playedPuzzleTypes.push(puzzle);
    }

    // Daily streak
    if (isDaily && won) {
      if (s.lastDailyDate === null) {
        s.dailyStreak = 1;
      } else {
        const last = new Date(s.lastDailyDate);
        const diff = Math.floor((new Date(today).getTime() - last.getTime()) / MS_PER_DAY);
        if (diff === 1) {
          s.dailyStreak++;
        } else if (diff > 1) {
          s.dailyStreak = 1;
        }
        // same day: don't change streak
      }
      s.longestDailyStreak = Math.max(s.longestDailyStreak, s.dailyStreak);
      s.lastDailyDate = today;
    }

    saveStats(s);
    setStats({ ...s });
    return s;
  }, []);

  const getPuzzleStat = useCallback((puzzle: PuzzleType): PuzzleStat => {
    const s = loadStats();
    return { ...DEFAULT_PUZZLE_STAT, ...(s.puzzles[puzzle] ?? {}) };
  }, []);

  const getWinRate = useCallback((puzzle?: PuzzleType): number => {
    const s = loadStats();
    if (puzzle) {
      const ps = s.puzzles[puzzle];
      if (!ps || ps.played === 0) return 0;
      return Math.round((ps.won / ps.played) * 100);
    }
    if (s.totalGames === 0) return 0;
    return Math.round((s.totalWins / s.totalGames) * 100);
  }, []);

  const formatBestTime = useCallback((seconds: number | null): string => {
    if (seconds === null) return "--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, []);

  return {
    stats,
    recordGame,
    getPuzzleStat,
    getWinRate,
    formatBestTime,
    parseTime: parseTimeToSeconds,
  };
}

import { useState, useCallback } from "react";
import { PuzzleType } from "@/components/game/PuzzleSelector";

// Seeded random number generator
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getTodaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Rewards system
export interface Rewards {
  hints: number;
  undos: number;
  peeks: number;
  timeBonus: number;
}

const DEFAULT_REWARDS: Rewards = { hints: 0, undos: 0, peeks: 0, timeBonus: 0 };

function loadRewards(): Rewards {
  try {
    const stored = localStorage.getItem("mindmuse_rewards");
    return stored ? { ...DEFAULT_REWARDS, ...JSON.parse(stored) } : { ...DEFAULT_REWARDS };
  } catch { return { ...DEFAULT_REWARDS }; }
}

function saveRewards(r: Rewards) {
  localStorage.setItem("mindmuse_rewards", JSON.stringify(r));
}

// Scoreboard
export interface ScoreEntry {
  name: string;
  puzzle: PuzzleType;
  moves: number;
  time: string;
  date: string;
}

function loadScoreboard(puzzle: PuzzleType): ScoreEntry[] {
  try {
    const key = `mindmuse_daily_scores_${puzzle}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const entries: ScoreEntry[] = JSON.parse(stored);
    const today = getTodayKey();
    return entries.filter(e => e.date === today);
  } catch { return []; }
}

function saveScoreEntry(entry: ScoreEntry) {
  const key = `mindmuse_daily_scores_${entry.puzzle}`;
  try {
    const stored = localStorage.getItem(key);
    let entries: ScoreEntry[] = stored ? JSON.parse(stored) : [];
    const today = getTodayKey();
    entries = entries.filter(e => e.date === today);
    entries.push(entry);
    entries.sort((a, b) => a.moves - b.moves);
    localStorage.setItem(key, JSON.stringify(entries.slice(0, 50)));
  } catch {}
}

// Daily completion tracking
function hasDailyCompleted(puzzle: PuzzleType): boolean {
  try {
    const key = `mindmuse_daily_done_${puzzle}`;
    return localStorage.getItem(key) === getTodayKey();
  } catch { return false; }
}

function markDailyCompleted(puzzle: PuzzleType) {
  localStorage.setItem(`mindmuse_daily_done_${puzzle}`, getTodayKey());
}

// Get daily challenge config (deterministic per day + puzzle)
export function getDailySeed(puzzle: PuzzleType): number {
  const base = getTodaySeed();
  let offset = 0;
  for (let i = 0; i < puzzle.length; i++) offset += puzzle.charCodeAt(i);
  return base + offset;
}

export function getDailyRandom(puzzle: PuzzleType) {
  return seededRandom(getDailySeed(puzzle));
}

export function useDailyChallenge() {
  const [rewards, setRewards] = useState<Rewards>(loadRewards);
  const [scoreboard, setScoreboard] = useState<ScoreEntry[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType | null>(null);

  const loadScores = useCallback((puzzle: PuzzleType) => {
    setScoreboard(loadScoreboard(puzzle));
    setCurrentPuzzle(puzzle);
  }, []);

  const isDailyDone = useCallback((puzzle: PuzzleType) => {
    return hasDailyCompleted(puzzle);
  }, []);

  const completeDailyChallenge = useCallback((puzzle: PuzzleType, name: string, moves: number, time: string) => {
    markDailyCompleted(puzzle);

    const entry: ScoreEntry = { name, puzzle, moves, time, date: getTodayKey() };
    saveScoreEntry(entry);

    // Award rewards
    const newRewards = { ...loadRewards() };
    newRewards.hints += 2;
    newRewards.undos += 1;
    newRewards.peeks += 1;
    newRewards.timeBonus += 10;
    saveRewards(newRewards);
    setRewards(newRewards);

    setScoreboard(loadScoreboard(puzzle));
  }, []);

  const useReward = useCallback((type: keyof Rewards) => {
    const current = loadRewards();
    if (current[type] <= 0) return false;
    current[type]--;
    saveRewards(current);
    setRewards({ ...current });
    return true;
  }, []);

  return {
    rewards,
    scoreboard,
    currentPuzzle,
    loadScores,
    isDailyDone,
    completeDailyChallenge,
    useReward,
    getDailyRandom,
    getDailySeed,
  };
}

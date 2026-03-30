import { useState, useCallback } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

// XP awarded per difficulty
const DIFFICULTY_XP: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
  expert: 80,
  master: 120,
  grandmaster: 180,
  genius: 250,
  legend: 350,
  mythic: 500,
  immortal: 700,
  divine: 1000,
};

// Star bonus XP
const STAR_BONUS: Record<number, number> = { 1: 0, 2: 20, 3: 50 };

// XP needed to reach each level (exponential growth)
function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level - 1));
}

function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i);
  return total;
}

function levelFromTotalXp(totalXp: number): number {
  let level = 1;
  while (totalXp >= totalXpForLevel(level + 1)) level++;
  return Math.min(level, 100);
}

export interface XPState {
  totalXp: number;
  level: number;
  xpInLevel: number;
  xpNeededForNext: number;
  progressPct: number;
}

export interface XPGain {
  base: number;
  starBonus: number;
  timeBonus: number;
  total: number;
  leveledUp: boolean;
  newLevel: number;
}

const STORAGE_KEY = "mindmuse_xp_v1";

function loadXP(): number {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? parseInt(s, 10) : 0;
  } catch { return 0; }
}

function saveXP(xp: number) {
  try { localStorage.setItem(STORAGE_KEY, String(xp)); } catch (_) { /* ignore */ }
}

function computeState(totalXp: number): XPState {
  const level = levelFromTotalXp(totalXp);
  const levelStart = totalXpForLevel(level);
  const levelEnd = totalXpForLevel(level + 1);
  const xpInLevel = totalXp - levelStart;
  const xpNeededForNext = levelEnd - levelStart;
  const progressPct = Math.min(Math.round((xpInLevel / xpNeededForNext) * 100), 100);
  return { totalXp, level, xpInLevel, xpNeededForNext, progressPct };
}

export const LEVEL_TITLES: Record<number, string> = {
  1: "Novice",
  5: "Apprentice",
  10: "Thinker",
  15: "Solver",
  20: "Sharp Mind",
  25: "Tactician",
  30: "Strategist",
  35: "Expert",
  40: "Analyst",
  45: "Mastermind",
  50: "Grandmaster",
  55: "Genius",
  60: "Savant",
  65: "Prodigy",
  70: "Legend",
  75: "Mythic",
  80: "Immortal",
  90: "Transcendent",
  100: "Divine Mind",
};

export function getLevelTitle(level: number): string {
  const thresholds = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
  for (const t of thresholds) {
    if (level >= t) return LEVEL_TITLES[t];
  }
  return "Novice";
}

export function useXPSystem() {
  const [xpState, setXpState] = useState<XPState>(() => computeState(loadXP()));

  const awardXP = useCallback((difficulty: Difficulty, stars: number, timeBonus = 0): XPGain => {
    const base = DIFFICULTY_XP[difficulty] ?? 10;
    const starBonus = STAR_BONUS[stars] ?? 0;
    const total = base + starBonus + timeBonus;

    const prev = loadXP();
    const prevLevel = levelFromTotalXp(prev);
    const newTotal = prev + total;
    const newLevel = levelFromTotalXp(newTotal);

    saveXP(newTotal);
    setXpState(computeState(newTotal));

    return {
      base,
      starBonus,
      timeBonus,
      total,
      leveledUp: newLevel > prevLevel,
      newLevel,
    };
  }, []);

  const getState = useCallback((): XPState => computeState(loadXP()), []);

  return { xpState, awardXP, getState };
}

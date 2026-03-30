import { useState, useCallback } from "react";
import { PuzzleType } from "@/components/game/PuzzleSelector";
import { Difficulty } from "@/hooks/useShiftGame";
import { parseTimeToSeconds } from "@/lib/puzzleUtils";

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  secret?: boolean;
}

export interface UnlockedAchievement extends Achievement {
  unlockedAt: string; // ISO date
}

// Full achievement catalog
export const ACHIEVEMENTS: Achievement[] = [
  // First-time milestones
  { id: "first_win", title: "First Steps", desc: "Win your first puzzle", icon: "🎉", rarity: "common" },
  { id: "first_daily", title: "Daily Grind", desc: "Complete your first daily challenge", icon: "⚡", rarity: "common" },
  { id: "first_hard", title: "Stepping Up", desc: "Complete a Hard difficulty puzzle", icon: "💪", rarity: "common" },
  { id: "first_expert", title: "Expert Eye", desc: "Complete an Expert difficulty puzzle", icon: "🧐", rarity: "rare" },
  { id: "first_master", title: "Master Class", desc: "Complete a Master difficulty puzzle", icon: "🎓", rarity: "rare" },
  { id: "first_grandmaster", title: "Grand Ambition", desc: "Complete a Grandmaster difficulty puzzle", icon: "👑", rarity: "rare" },
  { id: "first_genius", title: "Genius Level", desc: "Complete a Genius difficulty puzzle", icon: "🧠", rarity: "epic" },
  { id: "first_legend", title: "Legendary", desc: "Complete a Legend difficulty puzzle", icon: "💀", rarity: "epic" },
  { id: "first_mythic", title: "Mythic Warrior", desc: "Complete a Mythic difficulty puzzle", icon: "⚡", rarity: "epic" },
  { id: "first_immortal", title: "Immortal Soul", desc: "Complete an Immortal difficulty puzzle", icon: "🌌", rarity: "legendary" },
  { id: "first_divine", title: "Divine Ascension", desc: "Complete a Divine difficulty puzzle", icon: "✦", rarity: "legendary" },

  // Puzzle variety
  { id: "puzzle_5", title: "Puzzle Collector", desc: "Play 5 different puzzle types", icon: "🎯", rarity: "common" },
  { id: "puzzle_10", title: "Puzzle Master", desc: "Play all puzzle types", icon: "🌟", rarity: "rare" },
  { id: "shift_master", title: "Shift King", desc: "Win 10 Shift puzzles", icon: "⬡", rarity: "rare" },
  { id: "memory_master", title: "Memory Palace", desc: "Win 10 Memory puzzles", icon: "♦", rarity: "rare" },
  { id: "sudoku_master", title: "Sudoku Sage", desc: "Win 10 Sudoku puzzles", icon: "🔢", rarity: "rare" },
  { id: "all_games_hard", title: "Versatile Mind", desc: "Complete every puzzle type on Hard or above", icon: "🏆", rarity: "epic" },

  // Speed achievements
  { id: "speed_60", title: "Speed Demon", desc: "Win any puzzle in under 60 seconds", icon: "⚡", rarity: "rare" },
  { id: "speed_30", title: "Lightning Brain", desc: "Win any puzzle in under 30 seconds", icon: "🌩", rarity: "epic" },
  { id: "speed_15", title: "Supernova", desc: "Win any puzzle in under 15 seconds", icon: "💥", rarity: "legendary" },

  // Perfect games
  { id: "three_stars", title: "Perfect Score", desc: "Get 3 stars on any puzzle", icon: "⭐", rarity: "common" },
  { id: "three_stars_5", title: "Star Collector", desc: "Get 3 stars on 5 different puzzles", icon: "🌟", rarity: "rare" },
  { id: "three_stars_expert", title: "Flawless Expert", desc: "Get 3 stars on an Expert or harder puzzle", icon: "💎", rarity: "epic" },

  // Streak achievements
  { id: "daily_3", title: "Hat Trick", desc: "Complete daily challenges 3 days in a row", icon: "🎩", rarity: "common" },
  { id: "daily_7", title: "Week Warrior", desc: "Complete daily challenges 7 days in a row", icon: "📅", rarity: "rare" },
  { id: "daily_30", title: "Iron Discipline", desc: "Complete daily challenges 30 days in a row", icon: "🔥", rarity: "legendary" },

  // Level milestones
  { id: "level_10", title: "Rising Mind", desc: "Reach Level 10", icon: "🆙", rarity: "common" },
  { id: "level_25", title: "Sharp Thinker", desc: "Reach Level 25", icon: "📈", rarity: "rare" },
  { id: "level_50", title: "Half Century", desc: "Reach Level 50", icon: "🎖", rarity: "epic" },
  { id: "level_100", title: "Centennial Mind", desc: "Reach Level 100", icon: "👁", rarity: "legendary" },

  // Volume achievements
  { id: "wins_10", title: "On a Roll", desc: "Win 10 puzzles total", icon: "🎲", rarity: "common" },
  { id: "wins_50", title: "Puzzle Veteran", desc: "Win 50 puzzles total", icon: "🏅", rarity: "rare" },
  { id: "wins_100", title: "Centurion", desc: "Win 100 puzzles total", icon: "💯", rarity: "epic" },
  { id: "wins_500", title: "Mind Muse Champion", desc: "Win 500 puzzles total", icon: "🌌", rarity: "legendary" },

  // Secret achievements
  { id: "no_hints", title: "Pure Logic", desc: "Win an Expert+ puzzle without using any hints", icon: "🎗", rarity: "epic", secret: true },
  { id: "divine_speed", title: "God Mode", desc: "Complete a Divine puzzle in under 5 minutes", icon: "🕊", rarity: "legendary", secret: true },
  { id: "night_owl", title: "Night Owl", desc: "Play a puzzle after midnight", icon: "🦉", rarity: "common", secret: true },
];

const ACHIEVEMENT_MAP: Record<string, Achievement> = {};
ACHIEVEMENTS.forEach(a => { ACHIEVEMENT_MAP[a.id] = a; });

const STORAGE_KEY = "mindmuse_achievements_v1";

function loadUnlocked(): Record<string, UnlockedAchievement> {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

function saveUnlocked(map: Record<string, UnlockedAchievement>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch (_) { /* ignore */ }
}

export interface AchievementContext {
  puzzle: PuzzleType;
  difficulty: Difficulty;
  moves: number;
  timeSeconds: number;
  stars: number;
  usedHint: boolean;
  wins: Record<string, number>; // puzzle -> count
  playedPuzzles: Set<string>;
  level: number;
  dailyStreak: number;
}

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<Record<string, UnlockedAchievement>>(loadUnlocked);

  const isUnlocked = useCallback((id: string) => !!unlocked[id], [unlocked]);

  const unlock = useCallback((ids: string[]): Achievement[] => {
    const current = loadUnlocked();
    const now = new Date().toISOString();
    const newlyUnlocked: Achievement[] = [];

    for (const id of ids) {
      if (!current[id] && ACHIEVEMENT_MAP[id]) {
        const achievement = ACHIEVEMENT_MAP[id];
        current[id] = { ...achievement, unlockedAt: now };
        newlyUnlocked.push(achievement);
      }
    }

    if (newlyUnlocked.length > 0) {
      saveUnlocked(current);
      setUnlocked({ ...current });
    }

    return newlyUnlocked;
  }, []);

  const checkAndUnlock = useCallback((ctx: AchievementContext): Achievement[] => {
    const toUnlock: string[] = [];

    // First win
    const totalWins = Object.values(ctx.wins).reduce((a, b) => a + b, 0);
    if (totalWins >= 1) toUnlock.push("first_win");

    // Difficulty achievements
    const diffOrder: Difficulty[] = ["easy", "medium", "hard", "expert", "master", "grandmaster", "genius", "legend", "mythic", "immortal", "divine"];
    const diffIdx = diffOrder.indexOf(ctx.difficulty);
    if (diffIdx >= 2) toUnlock.push("first_hard");
    if (diffIdx >= 3) toUnlock.push("first_expert");
    if (diffIdx >= 4) toUnlock.push("first_master");
    if (diffIdx >= 5) toUnlock.push("first_grandmaster");
    if (diffIdx >= 6) toUnlock.push("first_genius");
    if (diffIdx >= 7) toUnlock.push("first_legend");
    if (diffIdx >= 8) toUnlock.push("first_mythic");
    if (diffIdx >= 9) toUnlock.push("first_immortal");
    if (diffIdx >= 10) toUnlock.push("first_divine");

    // Speed
    if (ctx.timeSeconds < 60) toUnlock.push("speed_60");
    if (ctx.timeSeconds < 30) toUnlock.push("speed_30");
    if (ctx.timeSeconds < 15) toUnlock.push("speed_15");

    // Stars
    if (ctx.stars === 3) toUnlock.push("three_stars");

    // Puzzle variety
    const played = ctx.playedPuzzles.size;
    if (played >= 5) toUnlock.push("puzzle_5");
    if (played >= 14) toUnlock.push("puzzle_10");

    // Per-puzzle wins
    if ((ctx.wins[ctx.puzzle] ?? 0) >= 10) {
      if (ctx.puzzle === "shift") toUnlock.push("shift_master");
      if (ctx.puzzle === "memory") toUnlock.push("memory_master");
      if (ctx.puzzle === "sudoku") toUnlock.push("sudoku_master");
    }

    // Total wins
    if (totalWins >= 10) toUnlock.push("wins_10");
    if (totalWins >= 50) toUnlock.push("wins_50");
    if (totalWins >= 100) toUnlock.push("wins_100");
    if (totalWins >= 500) toUnlock.push("wins_500");

    // Level milestones
    if (ctx.level >= 10) toUnlock.push("level_10");
    if (ctx.level >= 25) toUnlock.push("level_25");
    if (ctx.level >= 50) toUnlock.push("level_50");
    if (ctx.level >= 100) toUnlock.push("level_100");

    // No hints on expert+
    if (!ctx.usedHint && diffIdx >= 3) toUnlock.push("no_hints");

    // Night owl
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) toUnlock.push("night_owl");

    // Divine speed (under 5 minutes)
    if (ctx.difficulty === "divine" && ctx.timeSeconds < 300) toUnlock.push("divine_speed");

    // Daily streak
    if (ctx.dailyStreak >= 3) toUnlock.push("daily_3");
    if (ctx.dailyStreak >= 7) toUnlock.push("daily_7");
    if (ctx.dailyStreak >= 30) toUnlock.push("daily_30");

    // 3-star expert+
    if (ctx.stars === 3 && diffIdx >= 3) toUnlock.push("three_stars_expert");

    return unlock(toUnlock);
  }, [unlock]);

  const allUnlocked = Object.values(unlocked);
  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = allUnlocked.length;

  return {
    unlocked,
    allUnlocked,
    isUnlocked,
    checkAndUnlock,
    unlock,
    totalCount,
    unlockedCount,
    parseTime: parseTimeToSeconds,
  };
}

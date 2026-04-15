import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";
import { Rewards } from "@/hooks/useDailyChallenge";
import { XPState } from "@/hooks/useXPSystem";
import { getLevelTitle } from "@/hooks/useXPSystem";
import XPBar from "./XPBar";

export type PuzzleType = "shift" | "memory" | "lightsout" | "lightsin" | "pattern" | "mathchain" | "hanoi" | "colorsort" | "sudoku" | "nqueens" | "knighttour" | "minesweeper" | "2048" | "sieve" | "babylonian" | "ricochet" | "portal" | "chainblast" | "archer" | "wordscramble" | "nonogram" | "stroop" | "sequence";

type Category = "all" | "logic" | "memory" | "math" | "word" | "visual";

const puzzles: { key: PuzzleType; label: string; desc: string; icon: string; color: string; category: Category }[] = [
  { key: "shift",        label: "Shift",          desc: "Sliding tile puzzle",          icon: "⬡",  color: "bg-tile-1", category: "logic"  },
  { key: "memory",       label: "Memory",         desc: "Find matching pairs",          icon: "♦",  color: "bg-tile-2", category: "memory" },
  { key: "lightsout",    label: "Lights Out",     desc: "Toggle all lights off",        icon: "💡", color: "bg-tile-5", category: "logic"  },
  { key: "lightsin",     label: "Lights In",      desc: "Toggle all lights on",         icon: "🔆", color: "bg-tile-6", category: "logic"  },
  { key: "pattern",      label: "Pattern",        desc: "Recall the sequence",          icon: "◆",  color: "bg-tile-6", category: "memory" },
  { key: "mathchain",    label: "Math Chain",     desc: "Solve rapid math",             icon: "∑",  color: "bg-tile-3", category: "math"   },
  { key: "hanoi",        label: "Tower of Hanoi", desc: "Move discs strategically",     icon: "🗼", color: "bg-tile-7", category: "logic"  },
  { key: "colorsort",    label: "Color Sort",     desc: "Sort colors into tubes",       icon: "🎨", color: "bg-tile-4", category: "logic"  },
  { key: "sudoku",       label: "Sudoku",         desc: "Fill the number grid",         icon: "🔢", color: "bg-tile-1", category: "logic"  },
  { key: "nqueens",      label: "N-Queens",       desc: "Place queens without conflict",icon: "♛",  color: "bg-tile-7", category: "logic"  },
  { key: "knighttour",   label: "Knight's Tour",  desc: "Visit every square",           icon: "♞",  color: "bg-tile-3", category: "logic"  },
  { key: "minesweeper",  label: "Minesweeper",    desc: "Avoid hidden mines",           icon: "💣", color: "bg-tile-2", category: "logic"  },
  { key: "2048",         label: "2048",           desc: "Merge tiles to win",           icon: "🔀", color: "bg-tile-4", category: "logic"  },
  { key: "sieve",        label: "Number Theory",  desc: "Complex rule-based challenges",icon: "🧠", color: "bg-tile-5", category: "math"   },
  { key: "babylonian",   label: "Babylonian",     desc: "Approximate square roots",     icon: "√",  color: "bg-tile-6", category: "math"   },
  { key: "ricochet",     label: "Ricochet",       desc: "Slide to the target",          icon: "🎱", color: "bg-tile-1", category: "logic"  },
  { key: "portal",       label: "Portal Maze",    desc: "Navigate through portals",     icon: "🌀", color: "bg-tile-3", category: "logic"  },
  { key: "chainblast",   label: "Chain Blast",    desc: "Bomb chain reactions",         icon: "💥", color: "bg-tile-7", category: "logic"  },
  { key: "archer",       label: "Archer",         desc: "Hit all targets",              icon: "🏹", color: "bg-tile-4", category: "logic"  },
  { key: "wordscramble", label: "Word Scramble",  desc: "Unscramble the letters",       icon: "🔤", color: "bg-tile-2", category: "word"   },
  { key: "nonogram",     label: "Nonogram",       desc: "Fill cells from clues",        icon: "🖼",  color: "bg-tile-5", category: "visual" },
  { key: "stroop",       label: "Stroop Test",    desc: "Ink color vs word conflict",   icon: "🎨", color: "bg-tile-3", category: "memory" },
  { key: "sequence",     label: "Number Sequence",desc: "Find the pattern",             icon: "🔢", color: "bg-tile-7", category: "math"   },
];

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All", logic: "Logic", memory: "Memory", math: "Math", word: "Word", visual: "Visual",
};

interface Props {
  onSelect: (type: PuzzleType) => void;
  onDailyChallenge: (type: PuzzleType) => void;
  onOpenStats: () => void;
  dark: boolean;
  onToggleDark: () => void;
  rewards: Rewards;
  isDailyDone: (type: PuzzleType) => boolean;
  xpState: XPState;
  unlockedAchievements: number;
}

const PuzzleSelector = ({ onSelect, onDailyChallenge, onOpenStats, dark, onToggleDark, rewards, isDailyDone, xpState, unlockedAchievements }: Props) => {
  const totalRewards = rewards.hints + rewards.undos + rewards.peeks;
  const levelTitle = getLevelTitle(xpState.level);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const filtered = puzzles.filter(p => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-6 sm:py-8">
      <div className="mb-4 sm:mb-5 flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">Mind Muse</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Challenge your IQ · {puzzles.length} puzzles</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {totalRewards > 0 && (
            <span className="hidden xs:inline text-[0.65rem] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 font-semibold whitespace-nowrap">
              💡{rewards.hints} ↩{rewards.undos} 👁{rewards.peeks}
            </span>
          )}
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {/* Player Level & XP Bar */}
      <motion.button
        onClick={onOpenStats}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full mb-4 rounded-[var(--radius-inner)] border border-border bg-card shadow-[var(--shadow-sm)] px-4 py-3 text-left hover:border-primary/30 hover:shadow-[var(--shadow-md)] transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧠</span>
            <div>
              <span className="text-xs font-bold text-foreground">Level {xpState.level}</span>
              <span className="text-[0.65rem] text-muted-foreground ml-1.5">· {levelTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {unlockedAchievements > 0 && (
              <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/25">
                🏆 {unlockedAchievements}
              </span>
            )}
            <span className="text-[0.6rem] text-muted-foreground">View profile →</span>
          </div>
        </div>
        <XPBar xpState={xpState} compact />
      </motion.button>

      {/* Search bar */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          placeholder="Search puzzles…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-[var(--radius-inner)] border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-[0.7rem] font-semibold px-3 py-1.5 rounded-full border transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {CATEGORY_LABELS[cat]}
            <span className="ml-1 opacity-60">
              {cat === "all" ? puzzles.length : puzzles.filter(p => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + search}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <p className="text-2xl mb-2">🔎</p>
              <p>No puzzles found for &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch("")} className="mt-2 text-primary text-xs underline">Clear search</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filtered.map((p, i) => {
                const done = isDailyDone(p.key);
                return (
                  <motion.div
                    key={p.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.22 }}
                    className="relative flex flex-col rounded-[var(--radius-inner)] bg-card border border-border shadow-[var(--shadow-sm)] overflow-hidden group hover:shadow-[var(--shadow-md)] hover:border-primary/20 transition-all duration-200"
                  >
                    {/* Daily badge */}
                    <motion.button
                      onClick={() => onDailyChallenge(p.key)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={done ? "Daily done" : "Daily challenge"}
                      className={`absolute top-2 right-2 z-10 w-7 h-7 flex flex-col items-center justify-center rounded-full border text-[0.6rem] font-bold transition-all ${
                        done
                          ? "bg-accent/15 border-accent/40 text-accent"
                          : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {done ? "✓" : "⚡"}
                    </motion.button>

                    {/* Card main area */}
                    <motion.button
                      onClick={() => onSelect(p.key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex flex-col items-center text-center px-3 pt-5 pb-4 gap-3 hover:bg-primary/5 transition-colors duration-200 focus:outline-none"
                    >
                      {/* Icon */}
                      <span
                        className={`w-14 h-14 rounded-2xl ${p.color} text-white flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg transition-shadow duration-200`}
                      >
                        {p.icon}
                      </span>

                      {/* Text */}
                      <div className="space-y-0.5">
                        <span className="block font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                          {p.label}
                        </span>
                        <span className="block text-[0.7rem] text-muted-foreground leading-snug">
                          {p.desc}
                        </span>
                      </div>
                    </motion.button>

                    {/* Daily label strip */}
                    <div
                      className={`text-[0.6rem] font-semibold text-center py-1 border-t transition-colors ${
                        done
                          ? "bg-accent/10 border-accent/20 text-accent"
                          : "bg-muted/40 border-border text-muted-foreground"
                      }`}
                    >
                      {done ? "✓ Daily done" : "⚡ Daily"}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Super Brain Zone CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.3 }}
        className="mt-5 rounded-[var(--radius-inner)] border border-orange-500/20 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 px-4 py-3 flex items-center gap-3"
      >
        <span className="text-xl shrink-0">🔥</span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-orange-500/90 uppercase tracking-wider">Super Brain Zone</p>
          <p className="text-[0.7rem] text-muted-foreground mt-0.5">
            Select any puzzle and choose <span className="font-semibold text-orange-500/80">Legend</span> difficulty for the ultimate challenge
          </p>
        </div>
        <span className="text-xl shrink-0">💀</span>
      </motion.div>
    </div>
  );
};

export default PuzzleSelector;

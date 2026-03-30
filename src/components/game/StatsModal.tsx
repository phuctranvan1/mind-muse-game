import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS, UnlockedAchievement } from "@/hooks/useAchievements";
import { GameStats } from "@/hooks/useGameStats";
import { XPState, getLevelTitle } from "@/hooks/useXPSystem";

interface Props {
  unlocked: Record<string, UnlockedAchievement>;
  stats: GameStats;
  xpState: XPState;
  formatBestTime: (seconds: number | null) => string;
  onClose: () => void;
}

const RARITY_STYLES: Record<string, string> = {
  common: "border-slate-400/20 bg-slate-500/5",
  rare: "border-blue-400/30 bg-blue-500/5",
  epic: "border-purple-400/35 bg-purple-500/8",
  legendary: "border-amber-400/40 bg-amber-500/8 shadow-[0_0_16px_rgba(245,158,11,0.12)]",
};

const RARITY_BADGE: Record<string, string> = {
  common: "bg-slate-500/15 text-slate-400 border-slate-400/25",
  rare: "bg-blue-500/15 text-blue-400 border-blue-400/25",
  epic: "bg-purple-500/15 text-purple-400 border-purple-400/25",
  legendary: "bg-amber-500/15 text-amber-400 border-amber-400/35",
};

type Tab = "stats" | "achievements";

const StatsModal = ({ unlocked, stats, xpState, formatBestTime, onClose }: Props) => {
  const [tab, setTab] = useState<Tab>("stats");

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = Object.keys(unlocked).length;
  const levelTitle = getLevelTitle(xpState.level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--overlay-bg)", backdropFilter: "blur(6px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="bg-card rounded-[var(--radius-outer)] shadow-[var(--shadow-md)] w-[94%] max-w-[400px] max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-border shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">Profile</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Level {xpState.level} · {levelTitle}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-lg">×</button>
          </div>

          {/* XP Bar */}
          <div className="mt-3">
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpState.progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[0.6rem] text-muted-foreground">{xpState.xpInLevel} XP</span>
              <span className="text-[0.6rem] text-muted-foreground">{xpState.xpNeededForNext} XP</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 p-0.5 bg-muted/40 rounded-lg">
            {(["stats", "achievements"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all capitalize ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t === "achievements" ? `🏆 ${unlockedCount}/${totalAchievements}` : "📊 Stats"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-4 py-3">
          <AnimatePresence mode="wait">
            {tab === "stats" && (
              <motion.div key="stats" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                {/* Global stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Total Wins", value: stats.totalWins },
                    { label: "Games Played", value: stats.totalGames },
                    { label: "Win Rate", value: `${stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0}%` },
                  ].map(s => (
                    <div key={s.label} className="bg-background rounded-[var(--radius-inner)] border border-border p-2.5 text-center">
                      <p className="text-lg font-bold text-primary tabular-nums">{s.value}</p>
                      <p className="text-[0.6rem] text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: "Daily Streak", value: `${stats.dailyStreak}🔥`, sub: `Best: ${stats.longestDailyStreak}` },
                    { label: "Best Difficulty", value: stats.highestDifficulty ? stats.highestDifficulty.charAt(0).toUpperCase() + stats.highestDifficulty.slice(1) : "—", sub: "Highest won" },
                  ].map(s => (
                    <div key={s.label} className="bg-background rounded-[var(--radius-inner)] border border-border p-2.5">
                      <p className="text-xs font-bold text-foreground tabular-nums">{s.value}</p>
                      <p className="text-[0.6rem] text-muted-foreground mt-0.5">{s.label}</p>
                      {s.sub && <p className="text-[0.55rem] text-muted-foreground/70">{s.sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Per-puzzle stats */}
                {stats.playedPuzzleTypes.length > 0 && (
                  <>
                    <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">Puzzle Records</h3>
                    <div className="flex flex-col gap-1.5">
                      {stats.playedPuzzleTypes.map(puzzle => {
                        const ps = stats.puzzles[puzzle];
                        if (!ps) return null;
                        const wr = ps.played > 0 ? Math.round((ps.won / ps.played) * 100) : 0;
                        const bestTime = formatBestTime(ps.bestTimeSeconds);
                        return (
                          <div key={puzzle} className="flex items-center justify-between text-xs bg-background rounded-lg border border-border px-3 py-2 gap-3">
                            <span className="font-semibold text-foreground capitalize min-w-0 truncate">{puzzle === "2048" ? "2048" : puzzle.charAt(0).toUpperCase() + puzzle.slice(1)}</span>
                            <div className="flex items-center gap-3 shrink-0 text-muted-foreground">
                              <span className="tabular-nums">{wr}% WR</span>
                              <span className="tabular-nums">{ps.won}W/{ps.played}P</span>
                              <span className="tabular-nums">{bestTime}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {stats.playedPuzzleTypes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <p className="text-2xl mb-2">🎮</p>
                    <p>Play puzzles to see your stats!</p>
                  </div>
                )}
              </motion.div>
            )}

            {tab === "achievements" && (
              <motion.div key="achievements" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="flex flex-col gap-2">
                  {ACHIEVEMENTS.map(a => {
                    const done = !!unlocked[a.id];
                    return (
                      <div
                        key={a.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-inner)] border transition-all ${done ? RARITY_STYLES[a.rarity] : "border-border bg-muted/10 opacity-50"}`}
                      >
                        <span className={`text-xl shrink-0 ${!done ? "grayscale opacity-40" : ""}`}>{a.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                              {a.secret && !done ? "???" : a.title}
                            </span>
                            {done && (
                              <span className={`text-[0.5rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${RARITY_BADGE[a.rarity]}`}>
                                {a.rarity}
                              </span>
                            )}
                          </div>
                          <p className="text-[0.65rem] text-muted-foreground leading-tight">
                            {a.secret && !done ? "Hidden achievement" : a.desc}
                          </p>
                        </div>
                        {done && <span className="text-accent text-sm shrink-0">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsModal;

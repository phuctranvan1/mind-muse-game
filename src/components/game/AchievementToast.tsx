import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Achievement } from "@/hooks/useAchievements";

interface Props {
  achievements: Achievement[];
  onDismiss: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: "from-slate-500/20 to-slate-600/10 border-slate-400/30 text-slate-300",
  rare: "from-blue-500/20 to-blue-600/10 border-blue-400/30 text-blue-300",
  epic: "from-purple-500/20 to-purple-600/10 border-purple-400/30 text-purple-300",
  legendary: "from-amber-500/20 to-orange-600/10 border-amber-400/40 text-amber-300",
};

const RARITY_GLOW: Record<string, string> = {
  common: "",
  rare: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
  epic: "shadow-[0_0_24px_rgba(147,51,234,0.3)]",
  legendary: "shadow-[0_0_32px_rgba(245,158,11,0.35)]",
};

const AchievementToast = ({ achievements, onDismiss }: Props) => {
  useEffect(() => {
    if (achievements.length === 0) return;
    const t = setTimeout(onDismiss, 4000 + (achievements.length - 1) * 500);
    return () => clearTimeout(t);
  }, [achievements, onDismiss]);

  return (
    <AnimatePresence>
      {achievements.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none">
          {achievements.slice(0, 3).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ delay: i * 0.15, duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-inner)] border bg-gradient-to-r backdrop-blur-sm pointer-events-auto cursor-pointer max-w-[340px] w-full ${RARITY_COLORS[a.rarity]} ${RARITY_GLOW[a.rarity]}`}
              onClick={onDismiss}
            >
              <span className="text-2xl shrink-0">{a.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Achievement Unlocked!</p>
                  <span className={`text-[0.55rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border opacity-80 ${
                    a.rarity === "legendary" ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    : a.rarity === "epic" ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    : a.rarity === "rare" ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                    : "bg-slate-500/20 border-slate-500/30 text-slate-400"
                  }`}>
                    {a.rarity}
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground leading-tight">{a.title}</p>
                <p className="text-xs text-muted-foreground leading-tight">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementToast;

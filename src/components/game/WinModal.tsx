import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { XPGain, getLevelTitle } from "@/hooks/useXPSystem";
import { getStars } from "@/lib/puzzleUtils";

interface WinModalProps {
  moves: number;
  time: string;
  difficulty?: string;
  xpGain?: XPGain | null;
  onClose: () => void;
}

const WinModal = ({ moves, time, difficulty, xpGain, onClose }: WinModalProps) => {
  const stars = difficulty ? getStars(difficulty, moves, time) : null;

  useEffect(() => {
    const isEpic = difficulty && ["legend", "mythic", "immortal", "divine", "genius"].includes(difficulty.toLowerCase());
    const colors = ["#7c3aed", "#ec4899", "#f97316", "#eab308", "#14b8a6", "#3b82f6"];
    const duration = isEpic ? 3500 : 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: isEpic ? 5 : 3,
        angle: 60,
        spread: isEpic ? 70 : 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: isEpic ? 5 : 3,
        angle: 120,
        spread: isEpic ? 70 : 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [difficulty]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--overlay-bg)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
        className="bg-card rounded-[var(--radius-outer)] shadow-[var(--shadow-md)] p-7 w-[90%] max-w-[340px] text-center"
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
          className="text-5xl mb-2"
        >
          {difficulty && ["mythic", "immortal", "divine"].includes(difficulty.toLowerCase()) ? "🌌" :
           difficulty && ["legend", "genius"].includes(difficulty.toLowerCase()) ? "💎" : "🎉"}
        </motion.div>
        <h2 className="text-xl font-bold text-foreground mb-1">Puzzle Solved!</h2>
        {difficulty && (
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{difficulty}</p>
        )}

        {/* Star rating */}
        {stars !== null && (
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3].map(s => (
              <motion.span
                key={s}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + s * 0.1, type: "spring", stiffness: 400, damping: 15 }}
                className={`text-2xl transition-all ${s <= stars ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]" : "text-muted/20"}`}
              >
                ★
              </motion.span>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-6 mb-5">
          <div className="text-center">
            <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-0.5">Moves</p>
            <p className="font-bold text-lg text-primary tabular-nums">{moves}</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-0.5">Time</p>
            <p className="font-bold text-lg text-accent tabular-nums">{time}</p>
          </div>
        </div>

        {/* XP Gain */}
        {xpGain && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mb-4 rounded-[var(--radius-inner)] bg-primary/8 border border-primary/20 px-3 py-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary">+{xpGain.total} XP Earned</span>
              {xpGain.leveledUp && (
                <motion.span
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                  className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30"
                >
                  🆙 Level {xpGain.newLevel} · {getLevelTitle(xpGain.newLevel)}
                </motion.span>
              )}
            </div>
            {(xpGain.starBonus > 0 || xpGain.timeBonus > 0) && (
              <div className="flex gap-2 mt-1">
                {xpGain.starBonus > 0 && (
                  <span className="text-[0.6rem] text-muted-foreground">⭐ +{xpGain.starBonus} star bonus</span>
                )}
                {xpGain.timeBonus > 0 && (
                  <span className="text-[0.6rem] text-muted-foreground">⚡ +{xpGain.timeBonus} speed bonus</span>
                )}
              </div>
            )}
          </motion.div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-[var(--radius-inner)] bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};

export default WinModal;

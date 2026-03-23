import { motion } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";
import { Rewards } from "@/hooks/useDailyChallenge";

export type PuzzleType = "shift" | "memory" | "lightsout" | "pattern" | "mathchain" | "hanoi" | "colorsort" | "sudoku" | "nqueens" | "knighttour";

const puzzles: { key: PuzzleType; label: string; desc: string; icon: string; color: string }[] = [
  { key: "shift", label: "Shift", desc: "Sliding tile puzzle", icon: "⬡", color: "bg-tile-1" },
  { key: "memory", label: "Memory", desc: "Find matching pairs", icon: "♦", color: "bg-tile-2" },
  { key: "lightsout", label: "Lights Out", desc: "Toggle all lights off", icon: "💡", color: "bg-tile-5" },
  { key: "pattern", label: "Pattern", desc: "Recall the sequence", icon: "◆", color: "bg-tile-6" },
  { key: "mathchain", label: "Math Chain", desc: "Solve rapid math", icon: "∑", color: "bg-tile-3" },
  { key: "hanoi", label: "Tower of Hanoi", desc: "Move discs strategically", icon: "🗼", color: "bg-tile-7" },
  { key: "colorsort", label: "Color Sort", desc: "Sort colors into tubes", icon: "🎨", color: "bg-tile-4" },
  { key: "sudoku", label: "Sudoku", desc: "Fill the number grid", icon: "🔢", color: "bg-tile-1" },
  { key: "nqueens", label: "N-Queens", desc: "Place queens without conflict", icon: "♛", color: "bg-tile-7" },
  { key: "knighttour", label: "Knight's Tour", desc: "Visit every square", icon: "♞", color: "bg-tile-3" },
];

interface Props {
  onSelect: (type: PuzzleType) => void;
  onDailyChallenge: (type: PuzzleType) => void;
  dark: boolean;
  onToggleDark: () => void;
  rewards: Rewards;
  isDailyDone: (type: PuzzleType) => boolean;
}

const PuzzleSelector = ({ onSelect, onDailyChallenge, dark, onToggleDark, rewards, isDailyDone }: Props) => {
  const totalRewards = rewards.hints + rewards.undos + rewards.peeks;

  return (
    <div className="py-10">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">Mind Muse</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Challenge your IQ</p>
        </div>
        <div className="flex items-center gap-2">
          {totalRewards > 0 && (
            <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 font-semibold">
              💡{rewards.hints} ↩{rewards.undos} 👁{rewards.peeks}
            </span>
          )}
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Choose a Puzzle
      </h2>
      <div className="flex flex-col gap-2.5">
        {puzzles.map((p) => {
          const done = isDailyDone(p.key);
          return (
            <div key={p.key} className="flex gap-2">
              <motion.button
                onClick={() => onSelect(p.key)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 text-left px-4 py-3.5 rounded-[var(--radius-inner)] bg-card border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200 group flex items-center gap-3"
              >
                <span className={`w-9 h-9 rounded-lg ${p.color} text-white flex items-center justify-center text-lg shrink-0 shadow-sm`}>
                  {p.icon}
                </span>
                <div>
                  <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{p.label}</span>
                  <span className="block text-xs text-muted-foreground">{p.desc}</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => onDailyChallenge(p.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`shrink-0 w-14 flex flex-col items-center justify-center rounded-[var(--radius-inner)] border text-xs font-semibold transition-all ${
                  done
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                }`}
              >
                {done ? "✓" : "⚡"}
                <span className="text-[0.55rem] mt-0.5">Daily</span>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PuzzleSelector;

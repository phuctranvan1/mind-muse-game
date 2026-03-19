import { motion } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";

export type PuzzleType = "shift" | "memory" | "lightsout" | "pattern" | "mathchain";

const puzzles: { key: PuzzleType; label: string; desc: string; icon: string; color: string }[] = [
  { key: "shift", label: "Shift", desc: "Sliding tile puzzle", icon: "⬡", color: "bg-tile-1" },
  { key: "memory", label: "Memory", desc: "Find matching pairs", icon: "♦", color: "bg-tile-2" },
  { key: "lightsout", label: "Lights Out", desc: "Toggle all lights off", icon: "💡", color: "bg-tile-5" },
  { key: "pattern", label: "Pattern", desc: "Recall the sequence", icon: "◆", color: "bg-tile-6" },
  { key: "mathchain", label: "Math Chain", desc: "Solve rapid math", icon: "∑", color: "bg-tile-3" },
];

interface Props {
  onSelect: (type: PuzzleType) => void;
  dark: boolean;
  onToggleDark: () => void;
}

const PuzzleSelector = ({ onSelect, dark, onToggleDark }: Props) => {
  return (
    <div className="py-12">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">Mind Muse</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Challenge your IQ</p>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Choose a Puzzle
      </h2>
      <div className="flex flex-col gap-3">
        {puzzles.map((p) => (
          <motion.button
            key={p.key}
            onClick={() => onSelect(p.key)}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full text-left px-5 py-4 rounded-[var(--radius-inner)] bg-card border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200 group flex items-center gap-4"
          >
            <span className={`w-10 h-10 rounded-lg ${p.color} text-white flex items-center justify-center text-xl shrink-0 shadow-sm`}>
              {p.icon}
            </span>
            <div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.label}</span>
              <span className="block text-sm text-muted-foreground">{p.desc}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PuzzleSelector;

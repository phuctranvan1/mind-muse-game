import { Difficulty } from "@/hooks/useShiftGame";
import DarkModeToggle from "./DarkModeToggle";

const difficulties: { key: Difficulty; label: string; desc: string; color: string; badge?: string }[] = [
  { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
  { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
  { key: "hard", label: "Hard", desc: "5×5 · 200 moves", color: "bg-tile-1", badge: "Limited" },
  { key: "expert", label: "Expert", desc: "6×6 · 350 moves", color: "bg-tile-7", badge: "IQ Test" },
  { key: "master", label: "Master", desc: "7×7 Grid", color: "bg-tile-2", badge: "Genius" },
];

interface MenuScreenProps {
  onSelectDifficulty: (d: Difficulty) => void;
  dark: boolean;
  onToggleDark: () => void;
}

const MenuScreen = ({ onSelectDifficulty, dark, onToggleDark }: MenuScreenProps) => {
  return (
    <div className="py-12">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">Shift</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">A sliding logic puzzle</p>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Select Difficulty
      </h2>
      <div className="flex flex-col gap-3">
        {difficulties.map((d) => (
          <button
            key={d.key}
            onClick={() => onSelectDifficulty(d.key)}
            className="w-full text-left px-5 py-4 rounded-[var(--radius-inner)] bg-card border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200 group flex items-center gap-4"
          >
            <span className={`w-3 h-3 rounded-full ${d.color} shrink-0 shadow-sm`} />
            <div className="flex-1">
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{d.label}</span>
              <span className="ml-2 text-sm text-muted-foreground">{d.desc}</span>
            </div>
            {d.badge && (
              <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {d.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <BestScores />
    </div>
  );
};

function BestScores() {
  const keys: Difficulty[] = ["easy", "medium", "hard", "expert", "master"];
  const colors = ["text-tile-5", "text-tile-6", "text-tile-1", "text-tile-7", "text-tile-2"];
  const scores = keys.map((k, i) => {
    const raw = localStorage.getItem(`shift-best-${k}`);
    return raw ? { ...JSON.parse(raw), difficulty: k, color: colors[i] } : null;
  }).filter(Boolean);

  if (scores.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">Best Scores</h3>
      <div className="flex flex-col gap-2">
        {scores.map((s: any) => (
          <div key={s.difficulty} className="flex justify-between text-sm">
            <span className={`capitalize font-medium ${s.color}`}>{s.difficulty}</span>
            <span className="tabular-nums text-muted-foreground">{s.moves} moves · {s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuScreen;

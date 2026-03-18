import { Difficulty } from "@/hooks/useShiftGame";

const difficulties: { key: Difficulty; label: string; desc: string; color: string }[] = [
  { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
  { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
  { key: "hard", label: "Hard", desc: "5×5 Grid", color: "bg-tile-1" },
];

interface MenuScreenProps {
  onSelectDifficulty: (d: Difficulty) => void;
}

const MenuScreen = ({ onSelectDifficulty }: MenuScreenProps) => {
  return (
    <div className="py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          <span className="text-primary">Shift</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">A sliding logic puzzle</p>
      </div>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Select Difficulty
      </h2>
      <div className="flex flex-col gap-3">
        {difficulties.map((d) => (
          <button
            key={d.key}
            onClick={() => onSelectDifficulty(d.key)}
            className="w-full text-left px-5 py-4 rounded-[var(--radius-inner)] bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200 group flex items-center gap-4"
          >
            <span className={`w-3 h-3 rounded-full ${d.color} shrink-0`} />
            <div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{d.label}</span>
              <span className="ml-2 text-sm text-muted-foreground">{d.desc}</span>
            </div>
          </button>
        ))}
      </div>
      <BestScores />
    </div>
  );
};

function BestScores() {
  const keys: Difficulty[] = ["easy", "medium", "hard"];
  const colors = ["text-tile-5", "text-tile-6", "text-tile-1"];
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

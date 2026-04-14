import { Difficulty } from "@/hooks/useShiftGame";
import DarkModeToggle from "./DarkModeToggle";

const difficulties: { key: Difficulty; label: string; desc: string; color: string; badge?: string }[] = [
  { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
  { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
  { key: "hard", label: "Hard", desc: "5×5 · 200 moves", color: "bg-tile-1", badge: "Limited" },
  { key: "expert", label: "Expert", desc: "6×6 · 350 moves", color: "bg-tile-7", badge: "IQ Test" },
  { key: "master", label: "Master", desc: "7×7 Grid", color: "bg-tile-2", badge: "Genius" },
  { key: "grandmaster", label: "Grandmaster", desc: "8×8 · 500 moves", color: "bg-tile-3", badge: "🧠 Elite" },
  { key: "genius", label: "Genius", desc: "9×9 · 300 moves", color: "bg-tile-4", badge: "🔥 Insane" },
  { key: "legend", label: "Legend", desc: "10×10 · 150 moves", color: "bg-tile-8", badge: "💀 Legend" },
  { key: "mythic", label: "Mythic", desc: "11×11 · 120 moves", color: "bg-amber-500", badge: "⚡ Mythic" },
  { key: "immortal", label: "Immortal", desc: "12×12 · 100 moves", color: "bg-purple-600", badge: "🌌 Immortal" },
  { key: "divine", label: "Divine", desc: "14×14 · 80 moves", color: "bg-red-600", badge: "✦ Divine" },
];

const LEGEND_KEYS: Difficulty[] = ["grandmaster", "genius", "legend"];
const GOD_KEYS: Difficulty[] = ["mythic", "immortal", "divine"];

interface DifficultyMenuProps {
  title: string;
  onSelectDifficulty: (d: Difficulty) => void;
  onBack: () => void;
  dark: boolean;
  onToggleDark: () => void;
  customDifficulties?: typeof difficulties;
}

const DifficultyMenu = ({ title, onSelectDifficulty, onBack, dark, onToggleDark, customDifficulties }: DifficultyMenuProps) => {
  const diffs = customDifficulties || difficulties;
  const normalDiffs = diffs.filter(d => !LEGEND_KEYS.includes(d.key) && !GOD_KEYS.includes(d.key));
  const hardDiffs = diffs.filter(d => LEGEND_KEYS.includes(d.key));
  const godDiffs = diffs.filter(d => GOD_KEYS.includes(d.key));

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-8 sm:mb-10 flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">{title}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Select difficulty</p>
        </div>
        <div className="shrink-0">
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Difficulty
      </h2>
      <div className="flex flex-col gap-2.5">
        {normalDiffs.map((d) => (
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

      {hardDiffs.length > 0 && (
        <>
          <div className="mt-5 mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/40 to-red-500/40" />
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-orange-500/80 flex items-center gap-1">
              🔥 Super Brain Zone
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-orange-500/40 to-red-500/40" />
          </div>
          <div className="flex flex-col gap-2.5">
            {hardDiffs.map((d) => (
              <button
                key={d.key}
                onClick={() => onSelectDifficulty(d.key)}
                className={`w-full text-left px-5 py-4 rounded-[var(--radius-inner)] border transition-all duration-200 group flex items-center gap-4 ${
                  d.key === "legend"
                    ? "bg-gradient-to-r from-tile-8/10 to-tile-8/5 border-tile-8/30 shadow-[0_0_12px_rgba(0,0,0,0.08)] hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:border-tile-8/60"
                    : "bg-card border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/30"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${d.color} shrink-0 shadow-sm`} />
                <div className="flex-1">
                  <span className={`font-semibold transition-colors ${d.key === "legend" ? "text-tile-8 group-hover:brightness-110" : "text-foreground group-hover:text-primary"}`}>
                    {d.label}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">{d.desc}</span>
                </div>
                {d.badge && (
                  <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    d.key === "legend"
                      ? "bg-tile-8/15 text-tile-8 border-tile-8/30"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}>
                    {d.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {godDiffs.length > 0 && (
        <>
          <div className="mt-5 mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-purple-600/50" />
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-500/90 flex items-center gap-1">
              ✦ God Tier
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500/50 to-purple-600/50" />
          </div>
          <div className="flex flex-col gap-2.5">
            {godDiffs.map((d) => (
              <button
                key={d.key}
                onClick={() => onSelectDifficulty(d.key)}
                className={`w-full text-left px-5 py-4 rounded-[var(--radius-inner)] border transition-all duration-200 group flex items-center gap-4 ${
                  d.key === "divine"
                    ? "bg-gradient-to-r from-red-600/10 to-purple-600/5 border-red-600/30 shadow-[0_0_16px_rgba(0,0,0,0.10)] hover:shadow-[0_0_28px_rgba(220,38,38,0.20)] hover:border-red-600/60"
                    : d.key === "immortal"
                    ? "bg-gradient-to-r from-purple-600/10 to-amber-500/5 border-purple-600/30 shadow-[0_0_14px_rgba(0,0,0,0.09)] hover:shadow-[0_0_24px_rgba(147,51,234,0.18)] hover:border-purple-600/60"
                    : "bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/30 shadow-[0_0_12px_rgba(0,0,0,0.08)] hover:shadow-[0_0_20px_rgba(245,158,11,0.16)] hover:border-amber-500/60"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${d.color} shrink-0 shadow-sm`} />
                <div className="flex-1">
                  <span className={`font-semibold transition-colors ${
                    d.key === "divine" ? "text-red-500 group-hover:brightness-110"
                    : d.key === "immortal" ? "text-purple-500 group-hover:brightness-110"
                    : "text-amber-500 group-hover:brightness-110"
                  }`}>
                    {d.label}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">{d.desc}</span>
                </div>
                {d.badge && (
                  <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    d.key === "divine"
                      ? "bg-red-600/15 text-red-500 border-red-600/30"
                      : d.key === "immortal"
                      ? "bg-purple-600/15 text-purple-500 border-purple-600/30"
                      : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                  }`}>
                    {d.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      <button onClick={onBack} className="mt-6 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
        ← Back to puzzles
      </button>
    </div>
  );
};

export default DifficultyMenu;

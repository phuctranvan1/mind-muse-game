import { motion } from "framer-motion";
import { ColorSortState } from "@/hooks/useColorSortGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import PowerUpButtons from "./PowerUpButtons";

const COLOR_MAP: Record<string, string> = {
  red: "hsl(0, 80%, 55%)", blue: "hsl(210, 90%, 56%)", green: "hsl(145, 70%, 42%)",
  yellow: "hsl(48, 95%, 55%)", purple: "hsl(262, 83%, 58%)", orange: "hsl(25, 95%, 55%)",
  pink: "hsl(330, 81%, 60%)", teal: "hsl(173, 80%, 40%)", amber: "hsl(38, 92%, 50%)",
  indigo: "hsl(240, 65%, 52%)", lime: "hsl(82, 70%, 45%)", cyan: "hsl(190, 85%, 45%)",
  rose: "hsl(350, 75%, 55%)", violet: "hsl(280, 70%, 55%)", sky: "hsl(200, 85%, 50%)",
  fuchsia: "hsl(300, 75%, 55%)",
};

interface Props {
  game: ColorSortState;
  time: string;
  onSelectTube: (tube: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const ColorSortGameScreen = ({ game, time, onSelectTube, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cols = game.tubes.length <= 5 ? game.tubes.length : Math.ceil(game.tubes.length / 2);

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Color Sort</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.numColors} colors</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.moves}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {game.hintMove && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">
          💡 Try moving from tube {game.hintMove[0] + 1} → tube {game.hintMove[1] + 1}
        </p>
      )}

      <div
        className="bg-card border-2 border-border rounded-[var(--radius-outer)] p-3 gap-2"
        style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {game.tubes.map((tube, tIdx) => {
          const isSorted = tube.length > 0 && tube.every(c => c === tube[0]) && tube.length === game.tubeSize;
          const isHintFrom = game.hintMove?.[0] === tIdx;
          const isHintTo = game.hintMove?.[1] === tIdx;
          return (
            <motion.button
              key={tIdx}
              onClick={() => onSelectTube(tIdx)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col-reverse items-center rounded-[var(--radius-inner)] border-2 p-1.5 transition-all ${
                game.selectedTube === tIdx
                  ? "border-primary bg-primary/10 shadow-md"
                  : isHintFrom
                  ? "border-accent bg-accent/10 animate-pulse"
                  : isHintTo
                  ? "border-accent/50 bg-accent/5"
                  : isSorted
                  ? "border-accent/50 bg-accent/5"
                  : "border-border hover:border-primary/30"
              }`}
              style={{ minHeight: `${game.tubeSize * 24 + 16}px` }}
            >
              {Array.from({ length: game.tubeSize }).map((_, slotIdx) => {
                const color = tube[slotIdx];
                return (
                  <motion.div
                    key={slotIdx}
                    layout
                    className="w-full rounded-sm mb-0.5"
                    style={{
                      height: "20px",
                      backgroundColor: color ? COLOR_MAP[color] || "hsl(var(--muted))" : "transparent",
                      border: color ? "none" : "1px dashed hsl(var(--border))",
                    }}
                  />
                );
              })}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default ColorSortGameScreen;

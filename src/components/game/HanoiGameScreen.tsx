import { motion } from "framer-motion";
import { HanoiState } from "@/hooks/useHanoiGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

const DISC_COLORS = [
  "hsl(262, 83%, 58%)", "hsl(330, 81%, 60%)", "hsl(16, 90%, 58%)",
  "hsl(43, 96%, 56%)", "hsl(173, 80%, 40%)", "hsl(210, 90%, 56%)",
  "hsl(280, 70%, 55%)",
];

interface Props {
  game: HanoiState;
  time: string;
  onSelectPeg: (peg: number) => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const HanoiGameScreen = ({ game, time, onSelectPeg, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const movePct = game.moveLimit ? Math.min((game.moves / game.moveLimit) * 100, 100) : null;
  const isLow = movePct !== null && movePct > 80;
  const maxDiscWidth = 100;
  const minDiscWidth = 30;

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Tower of Hanoi</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {game.discs} discs
          </span>
        </div>
        <div className="flex gap-6">
          <div>
            <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
            <span className="tabular-nums font-semibold text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
          </div>
          <div>
            <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
            <span className={`tabular-nums font-semibold text-lg ${isLow ? 'text-destructive' : 'text-foreground'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {game.moves}{game.moveLimit ? `/${game.moveLimit}` : ''}
            </span>
          </div>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} />
      </div>

      {movePct !== null && (
        <div className="mb-4">
          <Progress value={100 - movePct} className={`h-1.5 ${isLow ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`} />
        </div>
      )}

      <div className="bg-card border-2 border-border rounded-[var(--radius-outer)] p-4">
        <div className="flex justify-around items-end gap-2" style={{ minHeight: `${game.discs * 22 + 40}px` }}>
          {game.pegs.map((peg, pegIdx) => (
            <motion.button
              key={pegIdx}
              onClick={() => onSelectPeg(pegIdx)}
              whileTap={{ scale: 0.96 }}
              className={`flex-1 flex flex-col items-center justify-end rounded-[var(--radius-inner)] p-2 transition-all cursor-pointer border-2 ${
                game.selectedPeg === pegIdx
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:border-primary/30 hover:bg-primary/5"
              }`}
              style={{ minHeight: `${game.discs * 22 + 30}px` }}
            >
              {/* Peg pole */}
              <div className="w-1 bg-muted-foreground/30 rounded-full mb-1" style={{ height: `${(game.discs - peg.length) * 22}px` }} />
              {/* Discs */}
              {peg.map((disc, dIdx) => {
                const widthPct = minDiscWidth + ((disc / game.discs) * (maxDiscWidth - minDiscWidth));
                return (
                  <motion.div
                    key={`${disc}-${dIdx}`}
                    layout
                    className="rounded-md mb-0.5 shadow-sm"
                    style={{
                      width: `${widthPct}%`,
                      height: "20px",
                      backgroundColor: DISC_COLORS[(disc - 1) % DISC_COLORS.length],
                    }}
                  />
                );
              })}
              {/* Base */}
              <div className="w-full h-1 bg-muted-foreground/20 rounded-full mt-1" />
              <span className="text-[0.6rem] text-muted-foreground mt-1 uppercase">
                {pegIdx === 0 ? "A" : pegIdx === 1 ? "B" : "C"}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {game.lost && (
        <div className="mt-4 text-center">
          <p className="text-destructive font-semibold text-lg">Out of moves!</p>
        </div>
      )}

      <div className="flex justify-center gap-6 mt-6">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} onClose={onMenu} />}
    </div>
  );
};

export default HanoiGameScreen;

import { motion } from "framer-motion";
import { HanoiState } from "@/hooks/useHanoiGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";
import PowerUpButtons from "./PowerUpButtons";

const DISC_COLORS = [
  "hsl(262, 83%, 58%)", "hsl(330, 81%, 60%)", "hsl(16, 90%, 58%)",
  "hsl(43, 96%, 56%)", "hsl(173, 80%, 40%)", "hsl(210, 90%, 56%)",
  "hsl(280, 70%, 55%)", "hsl(0, 80%, 55%)", "hsl(120, 60%, 45%)",
  "hsl(200, 85%, 50%)",
];

interface Props {
  game: HanoiState;
  time: string;
  onSelectPeg: (peg: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const HanoiGameScreen = ({ game, time, onSelectPeg, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const movePct = game.moveLimit ? Math.min((game.moves / game.moveLimit) * 100, 100) : null;
  const isLow = movePct !== null && movePct > 80;
  const maxDiscWidth = 100;
  const minDiscWidth = 30;
  const minMoves = Math.pow(2, game.discs) - 1;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Tower of Hanoi</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.discs} discs</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base sm:text-lg text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label>
              <span className={`tabular-nums font-semibold text-base sm:text-lg ${isLow ? 'text-destructive' : 'text-foreground'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {game.moves}{game.moveLimit ? `/${game.moveLimit}` : ''}
              </span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {movePct !== null && (
        <div className="mb-4">
          <Progress value={100 - movePct} className={`h-1.5 ${isLow ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`} />
        </div>
      )}

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Minimum moves: {minMoves}</p>
      )}

      {game.hintMove && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">
          💡 Move top disc from {["A", "B", "C"][game.hintMove[0]]} → {["A", "B", "C"][game.hintMove[1]]}
        </p>
      )}

      <div className="bg-card border-2 border-border rounded-[var(--radius-outer)] p-4">
        <div className="flex justify-around items-end gap-2" style={{ minHeight: `${game.discs * 22 + 40}px` }}>
          {game.pegs.map((peg, pegIdx) => {
            const isHintFrom = game.hintMove?.[0] === pegIdx;
            const isHintTo = game.hintMove?.[1] === pegIdx;
            return (
              <motion.button
                key={pegIdx}
                onClick={() => onSelectPeg(pegIdx)}
                whileTap={{ scale: 0.96 }}
                className={`flex-1 flex flex-col items-center justify-end rounded-[var(--radius-inner)] p-2 transition-all cursor-pointer border-2 ${
                  game.selectedPeg === pegIdx
                    ? "border-primary bg-primary/10"
                    : isHintFrom
                    ? "border-accent bg-accent/10 animate-pulse"
                    : isHintTo
                    ? "border-accent/50 bg-accent/5"
                    : "border-transparent hover:border-primary/30 hover:bg-primary/5"
                }`}
                style={{ minHeight: `${game.discs * 22 + 30}px` }}
              >
                <div className="w-1 bg-muted-foreground/30 rounded-full mb-1" style={{ height: `${(game.discs - peg.length) * 22}px` }} />
                {peg.map((disc, dIdx) => {
                  const widthPct = minDiscWidth + ((disc / game.discs) * (maxDiscWidth - minDiscWidth));
                  return (
                    <motion.div
                      key={`${disc}-${dIdx}`}
                      layout
                      className="rounded-md mb-0.5 shadow-sm"
                      style={{ width: `${widthPct}%`, height: "20px", backgroundColor: DISC_COLORS[(disc - 1) % DISC_COLORS.length] }}
                    />
                  );
                })}
                <div className="w-full h-1 bg-muted-foreground/20 rounded-full mt-1" />
                <span className="text-[0.6rem] text-muted-foreground mt-1 uppercase">
                  {pegIdx === 0 ? "A" : pegIdx === 1 ? "B" : "C"}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {game.lost && (
        <div className="mt-4 text-center">
          <p className="text-destructive font-semibold text-lg">Out of moves!</p>
        </div>
      )}

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

export default HanoiGameScreen;

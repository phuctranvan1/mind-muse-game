import { motion } from "framer-motion";
import { MemoryGameState } from "@/hooks/useMemoryGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import PowerUpButtons from "./PowerUpButtons";

const CARD_COLORS = [
  "bg-tile-1", "bg-tile-2", "bg-tile-3", "bg-tile-4",
  "bg-tile-5", "bg-tile-6", "bg-tile-7", "bg-tile-8",
];

interface Props {
  game: MemoryGameState;
  time: string;
  onFlip: (index: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const MemoryGameScreen = ({ game, time, onFlip, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const diffLabels: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert", master: "Master", grandmaster: "Grandmaster", genius: "Genius", legend: "Legend" };

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Memory</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{diffLabels[game.difficulty]}</span>
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

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Peeking at all cards...</p>
      )}

      <div
        className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-2 gap-2"
        style={{ display: "grid", gridTemplateColumns: `repeat(${game.cols}, 1fr)` }}
      >
        {game.cards.map((card, i) => {
          const colorIdx = card.symbol.charCodeAt(0) % CARD_COLORS.length;
          const isRevealed = card.flipped || card.matched;
          return (
            <motion.div
              key={card.id}
              onClick={() => onFlip(i)}
              whileHover={!isRevealed ? { scale: 1.05 } : undefined}
              whileTap={!isRevealed ? { scale: 0.92 } : undefined}
              className={`aspect-square flex items-center justify-center rounded-[var(--radius-inner)] font-bold text-xl select-none cursor-pointer border transition-all duration-300 ${
                card.matched
                  ? `${CARD_COLORS[colorIdx]} text-white border-white/20 opacity-60`
                  : isRevealed
                  ? `${CARD_COLORS[colorIdx]} text-white border-white/15 shadow-[var(--tile-shadow)]`
                  : "bg-tile border-tile-border shadow-[var(--tile-shadow)] hover:shadow-[var(--tile-shadow-hover)]"
              }`}
              style={{ fontSize: game.cols >= 8 ? "0.9rem" : game.cols >= 6 ? "1.1rem" : "1.3rem" }}
            >
              {isRevealed ? card.symbol : "?"}
            </motion.div>
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

      {game.won && <WinModal moves={game.moves} time={time} difficulty={diffLabels[game.difficulty]} onClose={onMenu} />}
    </div>
  );
};

export default MemoryGameScreen;

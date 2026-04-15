import { motion } from "framer-motion";
import { SetGameState, SetCard } from "@/hooks/useSetGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

const COLORS = ["text-red-500", "text-green-500", "text-blue-500"];
const COLOR_NAMES = ["Red", "Green", "Blue"];
const SHAPES = ["●", "◆", "■"];
const FILL_LABELS = ["", "⊘", "○"];

function renderCard(card: SetCard) {
  const colorClass = COLORS[card.color];
  const shape = SHAPES[card.shape];
  const fill = FILL_LABELS[card.fill];
  const items = Array.from({ length: card.count }, (_, i) => (
    <span key={i} className={`text-2xl font-bold ${colorClass}`}>
      {fill || shape}
    </span>
  ));
  return <div className="flex justify-center gap-1">{items}</div>;
}

interface Props {
  game: SetGameState; time: string;
  onToggleCard: (idx: number) => void;
  onHint: () => void; onPeek: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const SetGameScreen = ({ game, time, onToggleCard, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Set Game</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Sets</label><span className="tabular-nums font-semibold text-base">{game.setsFound}/{game.setsToFind}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {game.hintText && (
        <p className="text-center text-sm text-accent font-semibold mb-3">💡 {game.hintText}</p>
      )}
      {game.lastResult === "correct" && (
        <p className="text-center text-sm font-bold text-green-500 mb-3">✓ Correct Set!</p>
      )}
      {game.lastResult === "wrong" && (
        <p className="text-center text-sm font-bold text-destructive mb-3">✗ Not a valid set</p>
      )}

      <p className="text-xs text-muted-foreground text-center mb-3">
        Select 3 cards that form a valid SET (each attribute all-same or all-different)
      </p>
      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4">
        <div className="grid grid-cols-3 gap-2">
          {game.board.map((card, i) => {
            const isSelected = game.selected.includes(i);
            return (
              <motion.button
                key={card.id}
                onClick={() => onToggleCard(i)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-[var(--radius-inner)] border-2 p-3 flex flex-col gap-1 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="text-[0.55rem] text-muted-foreground text-right leading-none">
                  {COLOR_NAMES[card.color][0]}{card.count}{card.fill === 0 ? "S" : card.fill === 1 ? "T" : "E"}
                </div>
                {renderCard(card)}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 mb-2">
        <PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={() => {}} />
      </div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default SetGameScreen;

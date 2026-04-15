import { motion } from "framer-motion";
import { OddOneOutState } from "@/hooks/useOddOneOutGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

const OPTION_COLORS = ["bg-tile-2","bg-tile-6","bg-tile-3","bg-tile-7"];

interface Props {
  game: OddOneOutState; time: string;
  onAnswer: (idx: number) => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const OddOneOutGameScreen = ({ game, time, onAnswer, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const q = game.questions[game.currentIndex];
  const progress = (game.currentIndex / game.questions.length) * 100;
  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Odd One Out</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Score</label><span className="tabular-nums font-semibold text-base">{game.score}/{game.questions.length}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>
      <Progress value={progress} className="h-1.5 mb-6 [&>div]:bg-primary" />
      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-6">
        <p className="text-xs text-muted-foreground text-center mb-3">Q {game.currentIndex + 1}/{game.questions.length} · Which one doesn't belong?</p>
        {game.peeking && <p className="text-center text-accent font-bold mb-3 animate-pulse">👁 Odd one: {q.items[q.oddIndex]}</p>}
        {game.hintText && !game.peeking && <p className="text-center text-sm text-accent font-semibold mb-3">💡 {game.hintText}</p>}
        <div className="grid grid-cols-2 gap-3">
          {q.items.map((item, i) => {
            const isSelected = game.selectedAnswer === i;
            const isCorrect = i === q.oddIndex;
            let colorClass = `${OPTION_COLORS[i]} text-white border-white/15`;
            if (isSelected && game.wasCorrect) colorClass = "bg-accent text-accent-foreground border-accent/50";
            if (isSelected && game.wasCorrect === false) colorClass = "bg-destructive text-white border-destructive/50";
            if (!isSelected && game.selectedAnswer !== null && isCorrect) colorClass = "bg-accent text-accent-foreground border-accent/50 opacity-70";
            return (
              <motion.button key={i} onClick={() => game.selectedAnswer === null && onAnswer(i)}
                whileHover={game.selectedAnswer === null ? { scale: 1.03 } : undefined}
                whileTap={game.selectedAnswer === null ? { scale: 0.95 } : undefined}
                disabled={game.selectedAnswer !== null}
                className={`py-4 px-3 rounded-[var(--radius-inner)] font-bold text-sm border shadow-[var(--tile-shadow)] transition-all text-center ${colorClass} ${game.selectedAnswer !== null ? "cursor-default" : "cursor-pointer"}`}>
                {item}
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.score} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};
export default OddOneOutGameScreen;

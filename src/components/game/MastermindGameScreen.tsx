import { useState } from "react";
import { motion } from "framer-motion";
import { MastermindState } from "@/hooks/useMastermindGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

const COLOR_CSS: Record<string, string> = {
  red: "bg-red-500", green: "bg-green-500", blue: "bg-blue-500", yellow: "bg-yellow-400",
  orange: "bg-orange-500", purple: "bg-purple-500", cyan: "bg-cyan-400", pink: "bg-pink-400",
};

interface Props {
  game: MastermindState; time: string;
  onSetPeg: (pegIdx: number, colorIdx: number) => void;
  onSubmitGuess: () => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const MastermindGameScreen = ({ game, time, onSetPeg, onSubmitGuess, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const [activePeg, setActivePeg] = useState<number | null>(null);
  const progress = (game.guesses.length / game.maxGuesses) * 100;

  const handlePegClick = (pegIdx: number) => {
    setActivePeg(activePeg === pegIdx ? null : pegIdx);
  };

  const handleColorClick = (colorIdx: number) => {
    if (activePeg !== null) {
      onSetPeg(activePeg, colorIdx);
      setActivePeg(activePeg + 1 < game.pegCount ? activePeg + 1 : null);
    }
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Mastermind</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Tries</label><span className="tabular-nums font-semibold text-base">{game.guesses.length}/{game.maxGuesses}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>
      <Progress value={progress} className="h-1.5 mb-4 [&>div]:bg-primary" />

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4">
        {game.hintText && <p className="text-accent text-sm font-semibold mb-3 text-center">💡 {game.hintText}</p>}
        {game.peeking && (
          <div className="flex justify-center gap-2 mb-3">
            {game.secret.map((ci, i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${COLOR_CSS[game.colors[ci]]}`} />
            ))}
          </div>
        )}

        {/* Past guesses */}
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {game.guesses.map((g, gi) => (
            <div key={gi} className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {g.colors.map((ci, pi) => (
                  <div key={pi} className={`w-7 h-7 rounded-full border-2 border-white/30 ${COLOR_CSS[game.colors[ci]] ?? "bg-muted"}`} />
                ))}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: g.black }, (_, i) => <div key={`b${i}`} className="w-3 h-3 rounded-full bg-black" />)}
                {Array.from({ length: g.white }, (_, i) => <div key={`w${i}`} className="w-3 h-3 rounded-full bg-white border border-border" />)}
                {Array.from({ length: game.pegCount - g.black - g.white }, (_, i) => <div key={`e${i}`} className="w-3 h-3 rounded-full bg-muted" />)}
              </div>
              <span className="text-xs text-muted-foreground">⚫{g.black} ⚪{g.white}</span>
            </div>
          ))}
        </div>

        {/* Current guess row */}
        {!game.won && !game.lost && (
          <div className="flex items-center gap-3 mb-4">
            {game.current.map((ci, pi) => (
              <motion.button
                key={pi}
                onClick={() => handlePegClick(pi)}
                whileTap={{ scale: 0.9 }}
                className={`w-9 h-9 rounded-full border-3 transition-all ${ci === -1 ? "bg-muted border-border" : `${COLOR_CSS[game.colors[ci]]} border-white/40`} ${activePeg === pi ? "ring-2 ring-primary ring-offset-1" : ""}`}
              >
                {ci === -1 && <span className="text-muted-foreground text-xs">?</span>}
              </motion.button>
            ))}
            <motion.button onClick={onSubmitGuess} whileTap={{ scale: 0.95 }}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-[var(--radius-inner)] text-sm font-bold">
              ✓
            </motion.button>
          </div>
        )}

        {/* Color palette */}
        {!game.won && !game.lost && (
          <div className="flex flex-wrap gap-2 justify-center">
            {game.colors.map((color, ci) => (
              <motion.button key={ci} onClick={() => handleColorClick(ci)}
                whileTap={{ scale: 0.85 }}
                className={`w-10 h-10 rounded-full border-2 border-white/30 transition-all hover:scale-110 ${COLOR_CSS[color]}`}
              />
            ))}
          </div>
        )}

        {game.lost && (
          <div className="text-center py-2">
            <p className="text-destructive font-bold mb-1">The secret was:</p>
            <div className="flex justify-center gap-2">
              {game.secret.map((ci, i) => <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${COLOR_CSS[game.colors[ci]]}`} />)}
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-3">
        <p className="text-xs text-muted-foreground">⚫ = right color & position · ⚪ = right color, wrong position</p>
      </div>

      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.guesses.length} time={time} difficulty={game.difficulty} onClose={onMenu} />}
      {game.lost && (
        <div className="flex justify-center gap-3 mt-4">
          <button onClick={onRestart} className="px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-inner)] font-semibold text-sm">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default MastermindGameScreen;

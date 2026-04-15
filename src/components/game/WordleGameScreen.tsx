import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WordleState, TileColor } from "@/hooks/useWordleGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

const TILE_BG: Record<TileColor, string> = {
  green: "bg-green-600 text-white border-green-600",
  yellow: "bg-yellow-500 text-white border-yellow-500",
  gray: "bg-muted text-foreground border-muted",
  empty: "bg-card text-foreground border-border",
};

const KEY_BG: Record<string, string> = {
  green: "bg-green-600 text-white",
  yellow: "bg-yellow-500 text-white",
  gray: "bg-muted text-foreground",
};

interface Props {
  game: WordleState; time: string;
  onTypeChar: (ch: string) => void;
  onDeleteLast: () => void;
  onSubmitGuess: () => void;
  onHint: () => void; onPeek: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const WordleGameScreen = ({ game, time, onTypeChar, onDeleteLast, onSubmitGuess, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const [shakeRow, setShakeRow] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (game.won || game.lost) return;
      if (e.key === "Backspace") onDeleteLast();
      else if (e.key === "Enter") onSubmitGuess();
      else if (/^[a-zA-Z]$/.test(e.key)) onTypeChar(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [game.won, game.lost, onTypeChar, onDeleteLast, onSubmitGuess]);

  const rows = [...game.guesses];
  while (rows.length < game.maxGuesses) rows.push({ word: "", colors: Array(5).fill("empty") as TileColor[] });

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Wordle</h1>
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

      {(game.hintText || game.peeking) && (
        <p className={`text-center text-sm font-semibold mb-3 ${game.won || game.lost ? "text-primary" : "text-accent"}`}>
          {game.peeking ? `👁 Answer: ${game.answer}` : game.hintText}
        </p>
      )}

      {/* Grid */}
      <div className="flex flex-col gap-1.5 items-center mb-4">
        {rows.map((row, ri) => {
          const isCurrentRow = ri === game.guesses.length && !game.won && !game.lost;
          const displayWord = isCurrentRow ? game.currentGuess.padEnd(5) : row.word.padEnd(5);
          const colors = isCurrentRow ? Array(5).fill("empty") as TileColor[] : row.colors;
          return (
            <div key={ri} className="flex gap-1.5">
              {Array.from({ length: 5 }, (_, ci) => {
                const letter = displayWord[ci] ?? "";
                const color = colors[ci] ?? "empty";
                const isSubmitted = ri < game.guesses.length;
                return (
                  <motion.div
                    key={ci}
                    animate={isSubmitted ? { rotateX: [0, 90, 0] } : undefined}
                    transition={isSubmitted ? { delay: ci * 0.1, duration: 0.4 } : undefined}
                    className={`w-12 h-12 rounded border-2 flex items-center justify-center font-bold text-lg uppercase ${TILE_BG[color]} ${isCurrentRow && letter ? "border-primary" : ""}`}
                  >
                    {letter.trim()}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 items-center mb-4">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map(key => {
              const color = game.letterMap[key];
              const isWide = key === "ENTER" || key === "⌫";
              return (
                <motion.button
                  key={key}
                  onClick={() => {
                    if (key === "ENTER") onSubmitGuess();
                    else if (key === "⌫") onDeleteLast();
                    else onTypeChar(key);
                  }}
                  whileTap={{ scale: 0.9 }}
                  disabled={game.won || game.lost}
                  className={`${isWide ? "px-2 min-w-[2.8rem]" : "w-8"} h-10 rounded font-bold text-xs border transition-all ${color ? KEY_BG[color] : "bg-card border-border text-foreground hover:bg-muted"}`}
                >
                  {key}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {game.lost && (
        <div className="mb-4 bg-destructive/10 border border-destructive/30 rounded-[var(--radius-inner)] p-3 text-center">
          <p className="text-destructive font-bold text-sm">The word was <span className="uppercase font-mono">{game.answer}</span></p>
        </div>
      )}

      <div className="mt-2 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onDeleteLast} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.guesses.length} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default WordleGameScreen;

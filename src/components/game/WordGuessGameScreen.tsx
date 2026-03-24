import { useEffect } from "react";
import { motion } from "framer-motion";
import { WordGuessState, LetterState } from "@/hooks/useWordGuessGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import confetti from "canvas-confetti";

interface Props {
  game: WordGuessState;
  time: string;
  onType: (letter: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onHint: () => void;
  onPeek: () => void;
  onRestart: () => void;
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

const DIFF_LABELS: Record<string, string> = {
  easy: "Easy", medium: "Medium", hard: "Hard", expert: "Expert",
  master: "Master", grandmaster: "Grandmaster", genius: "Genius",
};

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

function getLetterStyle(state: LetterState, dark: boolean): string {
  switch (state) {
    case "correct": return "bg-emerald-500 text-white border-emerald-500";
    case "present": return "bg-amber-500 text-white border-amber-500";
    case "absent": return dark ? "bg-zinc-700 text-zinc-400 border-zinc-600" : "bg-zinc-400 text-white border-zinc-400";
    case "tbd": return dark ? "bg-zinc-800 text-white border-zinc-500" : "bg-white text-zinc-900 border-zinc-400";
    default: return dark ? "bg-zinc-900 text-zinc-500 border-zinc-700" : "bg-zinc-100 text-zinc-400 border-zinc-200";
  }
}

function getKeyStyle(letter: string, usedLetters: Record<string, LetterState>, dark: boolean): string {
  const state = usedLetters[letter];
  if (!state) return dark ? "bg-zinc-700 text-white border-zinc-600" : "bg-zinc-200 text-zinc-900 border-zinc-300";
  return getLetterStyle(state, dark);
}

const WordGuessGameScreen = ({ game, time, onType, onDelete, onSubmit, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  // Fire confetti on win
  useEffect(() => {
    if (!game.won) return;
    const colors = ["#10b981", "#f59e0b", "#7c3aed", "#ec4899"];
    const end = Date.now() + 2500;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [game.won]);

  // Keyboard input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (game.won || game.lost) return;
      if (e.key === "Enter") { e.preventDefault(); onSubmit(); return; }
      if (e.key === "Backspace") { e.preventDefault(); onDelete(); return; }
      if (/^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); onType(e.key); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [game.won, game.lost, onType, onDelete, onSubmit]);

  const cellSize = game.wordLength <= 5 ? "w-12 h-12 text-lg" : game.wordLength <= 6 ? "w-10 h-10 text-base" : "w-9 h-9 text-sm";

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Word Guess</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{DIFF_LABELS[game.difficulty]}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div>
            <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
            <span className="tabular-nums font-semibold text-base text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4 text-center">
        Guess the {game.wordLength}-letter word in {game.maxAttempts} tries.{" "}
        <span className="text-emerald-500 font-semibold">Green</span> = right place,{" "}
        <span className="text-amber-500 font-semibold">Yellow</span> = wrong place.
      </p>

      {game.revealed && (
        <p className="text-xs text-center mb-2 font-semibold text-amber-500 animate-pulse">
          👁 Answer: <span className="tracking-widest">{game.target}</span>
        </p>
      )}

      {/* Guess grid */}
      <div className="flex flex-col items-center gap-1.5 mb-5">
        {game.rows.map((row, ri) => (
          <motion.div
            key={ri}
            className="flex gap-1.5"
            animate={row.submitted && !row.states.every(s => s === "correct") ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            {row.letters.map((letter, ci) => (
              <motion.div
                key={ci}
                className={`${cellSize} flex items-center justify-center border-2 rounded font-bold uppercase transition-all duration-300 ${getLetterStyle(row.states[ci], dark)}`}
                animate={row.submitted ? { rotateX: [0, 90, 0], transition: { delay: ci * 0.08, duration: 0.4 } } : {}}
              >
                {letter}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Win / Lose message */}
      {game.won && (
        <div className="text-center mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">🎉 Correct!</p>
          <p className="text-sm text-muted-foreground">The word was <span className="font-bold text-emerald-500">{game.target}</span></p>
        </div>
      )}
      {game.lost && (
        <div className="text-center mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-500 font-bold text-lg">😢 Out of tries!</p>
          <p className="text-sm text-muted-foreground">The word was <span className="font-bold text-red-500">{game.target}</span></p>
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-1.5 mb-4">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map(key => (
              <button
                key={key}
                onClick={() => {
                  if (key === "ENTER") onSubmit();
                  else if (key === "⌫") onDelete();
                  else onType(key);
                }}
                className={`${key === "ENTER" ? "px-2 text-[0.6rem]" : "w-8"} h-10 rounded font-bold text-xs border transition-colors active:scale-95 ${getKeyStyle(key, game.usedLetters, dark)}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mb-2">
        <PowerUpButtons onHint={onHint} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">New Word</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
    </div>
  );
};

export default WordGuessGameScreen;

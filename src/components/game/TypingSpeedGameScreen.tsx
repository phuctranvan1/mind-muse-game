import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TypingState } from "@/hooks/useTypingSpeedGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";
import { Progress } from "@/components/ui/progress";

interface Props {
  game: TypingState; time: string;
  onSetInput: (text: string) => void;
  onSubmitWord: () => void;
  onTimeOut: () => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const TypingSpeedGameScreen = ({ game, time, onSetInput, onSubmitWord, onTimeOut, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const progress = (game.currentIndex / game.words.length) * 100;
  const [timeLeft, setTimeLeft] = useState(game.timePerWord);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeLeft(game.timePerWord);
    if (timerRef.current) clearInterval(timerRef.current);
    if (game.won || game.lost) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onTimeOut();
          return game.timePerWord;
        }
        return prev - 100;
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [game.currentIndex, game.timePerWord, game.won, game.lost, onTimeOut]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [game.currentIndex]);

  const currentWord = game.words[game.currentIndex] ?? "";
  const timerPct = (timeLeft / game.timePerWord) * 100;

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Typing Speed</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Word</label><span className="tabular-nums font-semibold text-base">{game.currentIndex + 1}/{game.words.length}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>
      <Progress value={progress} className="h-1.5 mb-2 [&>div]:bg-primary" />
      <Progress value={timerPct} className={`h-1 mb-4 [&>div]:${timerPct > 50 ? "bg-accent" : timerPct > 25 ? "bg-yellow-500" : "bg-destructive"}`} />

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-6 text-center">
        <p className="text-xs text-muted-foreground mb-3">Type the word below:</p>
        <div className="mb-6">
          <div className="inline-block px-8 py-5 rounded-[var(--radius-inner)] bg-card border-2 border-primary/30 font-mono font-bold text-3xl text-primary tracking-widest">
            {game.peeking ? currentWord : currentWord}
          </div>
        </div>
        {game.hintText && <p className="text-accent text-sm font-semibold mb-3">💡 {game.hintText}</p>}
        {game.lastSubmitCorrect === false && (
          <motion.p animate={{ x: [0, -8, 8, -8, 0] }} className="text-destructive text-sm font-semibold mb-3">❌ Try again!</motion.p>
        )}
        <input
          ref={inputRef}
          value={game.input}
          onChange={e => onSetInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") onSubmitWord(); }}
          className="w-full max-w-xs mx-auto block px-4 py-3 rounded-[var(--radius-inner)] border-2 border-border bg-card text-foreground font-mono text-xl text-center focus:outline-none focus:border-primary"
          placeholder="Type here..."
          disabled={game.won || game.lost}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={onSubmitWord}
          className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-[var(--radius-inner)] font-semibold text-sm hover:opacity-90 transition-opacity"
          disabled={game.won || game.lost}
        >
          Submit ↵
        </button>
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

export default TypingSpeedGameScreen;

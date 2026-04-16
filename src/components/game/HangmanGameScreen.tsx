import { motion } from "framer-motion";
import { HangmanState } from "@/hooks/useHangmanGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

interface GallowsProps { wrongCount: number; maxWrong: number }

const Gallows = ({ wrongCount, maxWrong }: GallowsProps) => {
  const showHead    = wrongCount >= 1;
  const showBody    = wrongCount >= Math.ceil(maxWrong * 2 / 6);
  const showLeftArm = wrongCount >= Math.ceil(maxWrong * 3 / 6);
  const showRightArm= wrongCount >= Math.ceil(maxWrong * 4 / 6);
  const showLeftLeg = wrongCount >= Math.ceil(maxWrong * 5 / 6);
  const showRightLeg= wrongCount >= maxWrong;
  return (
    <svg viewBox="0 0 120 140" width="120" height="140" className="mx-auto">
      {/* Gallows frame */}
      <line x1="10" y1="135" x2="110" y2="135" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="135" x2="30" y2="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="10" x2="75" y2="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="75" y1="10" x2="75" y2="25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Head */}
      {showHead && <circle cx="75" cy="35" r="10" stroke="currentColor" strokeWidth="2.5" fill="none"/>}
      {/* Body */}
      {showBody && <line x1="75" y1="45" x2="75" y2="85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>}
      {/* Left arm */}
      {showLeftArm && <line x1="75" y1="55" x2="58" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>}
      {/* Right arm */}
      {showRightArm && <line x1="75" y1="55" x2="92" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>}
      {/* Left leg */}
      {showLeftLeg && <line x1="75" y1="85" x2="58" y2="108" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>}
      {/* Right leg */}
      {showRightLeg && <line x1="75" y1="85" x2="92" y2="108" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>}
    </svg>
  );
};

interface Props {
  game: HangmanState; time: string;
  onGuessLetter: (letter: string) => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const HangmanGameScreen = ({ game, time, onGuessLetter, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const wrongLetters = game.guessed.filter(l => !game.word.includes(l));

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Hangman</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Lives</label><span className="tabular-nums font-semibold text-base">{game.maxWrong - game.wrongCount}/{game.maxWrong}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-5 mb-4">
        <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wider">Category: {game.category}</p>
        <Gallows wrongCount={game.wrongCount} maxWrong={game.maxWrong} />
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {game.display.map((ch, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`text-xl font-bold w-8 text-center ${ch !== "_" ? "text-primary" : "text-transparent"}`}>{ch !== "_" ? ch.toUpperCase() : "_"}</span>
              <div className={`h-0.5 w-8 ${ch !== "_" ? "bg-primary" : "bg-muted-foreground/40"}`}/>
            </div>
          ))}
        </div>
        {game.peeking && <p className="text-center text-accent font-bold mt-3 animate-pulse">👁 Word: {game.word.toUpperCase()}</p>}
        {game.hintText && !game.peeking && <p className="text-center text-sm text-accent font-semibold mt-3">💡 {game.hintText}</p>}
        {wrongLetters.length > 0 && (
          <div className="mt-3 text-center">
            <span className="text-xs text-muted-foreground">Wrong: </span>
            {wrongLetters.map(l => (
              <span key={l} className="text-sm font-bold text-destructive mr-1">{l.toUpperCase()}</span>
            ))}
          </div>
        )}
        {game.lost && (
          <p className="text-center text-destructive font-bold mt-3">
            The word was: <span className="uppercase">{game.word}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-9 gap-1.5 mb-4">
        {LETTERS.map(l => {
          const guessed = game.guessed.includes(l);
          const isWrong = guessed && !game.word.includes(l);
          const isCorrect = guessed && game.word.includes(l);
          return (
            <motion.button
              key={l}
              onClick={() => !guessed && !game.won && !game.lost && onGuessLetter(l)}
              whileHover={!guessed && !game.won && !game.lost ? { scale: 1.1 } : undefined}
              whileTap={!guessed && !game.won && !game.lost ? { scale: 0.9 } : undefined}
              disabled={guessed || game.won || game.lost}
              className={`h-9 rounded-[var(--radius-inner)] text-sm font-bold border transition-all
                ${isWrong ? "bg-destructive/20 text-destructive border-destructive/30 cursor-default" :
                  isCorrect ? "bg-accent/20 text-accent border-accent/30 cursor-default" :
                  "bg-card border-border hover:border-primary/50 hover:bg-primary/10 text-foreground"}`}
            >
              {l.toUpperCase()}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-2 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default HangmanGameScreen;

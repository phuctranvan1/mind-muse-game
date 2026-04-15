import { motion } from "framer-motion";
import { Connect4State } from "@/hooks/useConnect4Game";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

interface Props {
  game: Connect4State; time: string;
  onDrop: (col: number) => void;
  onHint: () => void; onPeek: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const Connect4GameScreen = ({ game, time, onDrop, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellPx = Math.min(44, Math.floor(340 / game.cols));
  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Connect 4</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Moves</label><span className="tabular-nums font-semibold text-base">{game.moves}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>
      {game.hintText && <p className="text-accent text-sm font-semibold mb-3 text-center">💡 {game.hintText}</p>}
      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-3">
          {game.won ? "🎉 You win!" : game.lost ? "❌ AI wins!" : game.draw ? "🤝 Draw!" : "🔵 Your turn · Click a column"}
        </p>
        {/* Drop buttons */}
        <div className="flex gap-1 mb-1">
          {Array.from({ length: game.cols }, (_, c) => (
            <motion.button key={c} onClick={() => !game.won && !game.lost && !game.draw && onDrop(c)}
              whileTap={{ scale: 0.85 }} style={{ width: cellPx }}
              className="h-6 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-all text-xs font-bold disabled:opacity-30"
              disabled={game.won || game.lost || game.draw || game.board[0][c] !== null}>
              ▼
            </motion.button>
          ))}
        </div>
        {/* Board */}
        <div className="rounded-[var(--radius-inner)] bg-blue-700 p-1.5 grid gap-1" style={{ gridTemplateColumns: `repeat(${game.cols}, ${cellPx}px)` }}>
          {game.board.map((row, r) =>
            row.map((cell, c) => (
              <div key={`${r}-${c}`} style={{ width: cellPx, height: cellPx }}
                className="rounded-full bg-blue-900 flex items-center justify-center">
                {cell === 0 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-yellow-400 border-2 border-yellow-300" style={{ width: cellPx - 6, height: cellPx - 6 }} />}
                {cell === 1 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-red-500 border-2 border-red-400" style={{ width: cellPx - 6, height: cellPx - 6 }} />}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span>🟡 You</span><span>🔴 AI</span>
        </div>
      </div>
      {(game.lost || game.draw) && (
        <div className="flex justify-center mt-4">
          <button onClick={onRestart} className="px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-inner)] font-semibold text-sm">Play Again</button>
        </div>
      )}
      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={() => {}} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};
export default Connect4GameScreen;

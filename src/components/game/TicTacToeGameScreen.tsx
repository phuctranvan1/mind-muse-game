import { motion } from "framer-motion";
import { TicTacToeState } from "@/hooks/useTicTacToeGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

interface Props {
  game: TicTacToeState; time: string;
  onPlaceMark: (index: number) => void;
  onHint: () => void; onPeek: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

const TicTacToeGameScreen = ({ game, time, onPlaceMark, onHint, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellSize = Math.min(72, Math.floor(360 / game.size));

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Tic-Tac-Toe</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty} · {game.size}×{game.size} · {game.winLen} in a row</span>
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
      {game.peeking && <p className="text-accent text-sm font-semibold mb-3 text-center animate-pulse">👁 Watch for the AI's strategy!</p>}

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-3">
          {game.won ? "🎉 You win!" : game.lost ? "❌ AI wins!" : game.draw ? "🤝 Draw!" : "Your turn (✕)"}
        </p>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${game.size}, ${cellSize}px)` }}>
          {game.board.map((cell, idx) => {
            const isWinning = game.winningCells.includes(idx);
            return (
              <motion.button
                key={idx}
                onClick={() => !game.won && !game.lost && !game.draw && cell === null && onPlaceMark(idx)}
                whileHover={cell === null && !game.won && !game.lost && !game.draw ? { scale: 1.08 } : undefined}
                whileTap={cell === null && !game.won && !game.lost && !game.draw ? { scale: 0.9 } : undefined}
                style={{ width: cellSize, height: cellSize }}
                className={`flex items-center justify-center rounded-[var(--radius-inner)] border-2 font-bold transition-all
                  ${isWinning ? "bg-accent/30 border-accent" : cell !== null ? "bg-card border-border" : "bg-card/60 border-border hover:bg-muted cursor-pointer"}
                  ${cell === null && !game.won && !game.lost && !game.draw ? "" : "cursor-default"}`}
              >
                {cell === 0 && <span className="text-primary" style={{ fontSize: cellSize * 0.5 }}>✕</span>}
                {cell === 1 && <span className="text-destructive" style={{ fontSize: cellSize * 0.5 }}>○</span>}
              </motion.button>
            );
          })}
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

export default TicTacToeGameScreen;

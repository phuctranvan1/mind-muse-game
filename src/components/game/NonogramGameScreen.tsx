import { motion } from "framer-motion";
import { NonogramState } from "@/hooks/useNonogramGame";
import DarkModeToggle from "./DarkModeToggle";
import WinModal from "./WinModal";
import PowerUpButtons from "./PowerUpButtons";

interface Props {
  game: NonogramState;
  time: string;
  onToggleCell: (row: number, col: number) => void;
  onHint: () => void;
  onUndo: () => void;
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

const NonogramGameScreen = ({ game, time, onToggleCell, onHint, onUndo, onPeek, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellSize = Math.max(14, Math.min(32, Math.floor(280 / game.cols)));
  const clueWidth = Math.min(60, cellSize * 2);

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Nonogram</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{DIFF_LABELS[game.difficulty]}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label>
              <span className="tabular-nums font-semibold text-base text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{time}</span>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Mistakes</label>
              <span className="tabular-nums font-semibold text-base text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{game.mistakes}</span>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4 text-center">
        Fill in cells based on the row and column clues. Numbers indicate consecutive filled blocks.
      </p>

      <div className="overflow-auto flex justify-center mb-4">
        <table style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {/* Top-left corner cell */}
              <td style={{ width: clueWidth, height: clueWidth }} />
              {game.colClues.map((clue, c) => (
                <td
                  key={c}
                  style={{ width: cellSize, textAlign: "center", verticalAlign: "bottom", paddingBottom: 4 }}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {clue.map((n, i) => (
                      <span key={i} className="text-[0.6rem] font-bold text-foreground leading-none">
                        {n === 0 ? "—" : n}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: game.rows }, (_, r) => (
              <tr key={r}>
                {/* Row clue */}
                <td style={{ width: clueWidth, textAlign: "right", paddingRight: 6, verticalAlign: "middle" }}>
                  <div className="flex gap-1 justify-end">
                    {game.rowClues[r].map((n, i) => (
                      <span key={i} className="text-[0.6rem] font-bold text-foreground">
                        {n === 0 ? "—" : n}
                      </span>
                    ))}
                  </div>
                </td>
                {Array.from({ length: game.cols }, (_, c) => {
                  const isHint = game.hintCell?.[0] === r && game.hintCell?.[1] === c;
                  const value = game.peeking ? game.solution[r][c] : game.board[r][c];
                  const isFilled = game.peeking ? game.solution[r][c] : game.board[r][c] === true;
                  const isCrossed = !game.peeking && game.board[r][c] === false;
                  const isWrong = !game.peeking && game.board[r][c] === true && !game.solution[r][c];

                  return (
                    <td key={c} style={{ padding: 1 }}>
                      <motion.button
                        onClick={() => onToggleCell(r, c)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        style={{ width: cellSize, height: cellSize }}
                        className={`rounded-sm border transition-all duration-150 flex items-center justify-center text-xs font-bold ${
                          isHint
                            ? "bg-amber-400 border-amber-500 animate-pulse"
                            : isWrong
                            ? "bg-red-500 border-red-600"
                            : isFilled
                            ? "bg-primary border-primary/80"
                            : isCrossed
                            ? "bg-muted border-border text-muted-foreground"
                            : "bg-card border-border hover:bg-primary/10"
                        }`}
                      >
                        {isCrossed && !game.peeking ? "×" : ""}
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground text-center mb-3">
        Click: <span className="font-semibold text-primary">fill → cross → empty</span>
      </p>

      {game.peeking && (
        <p className="text-xs text-accent text-center mb-2 font-semibold animate-pulse">👁 Peeking — showing the solution!</p>
      )}

      <div className="mb-2">
        <PowerUpButtons onHint={onHint} onUndo={onUndo} onPeek={onPeek} />
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>

      {game.won && <WinModal moves={game.moves} time={time} onClose={onMenu} />}
    </div>
  );
};

export default NonogramGameScreen;

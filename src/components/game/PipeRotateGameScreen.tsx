import { motion } from "framer-motion";
import { PipeRotateState, PipeTile } from "@/hooks/usePipeRotateGame";
import DarkModeToggle from "./DarkModeToggle";
import PowerUpButtons from "./PowerUpButtons";
import WinModal from "./WinModal";

interface Props {
  game: PipeRotateState; time: string;
  onRotateTile: (r: number, c: number) => void;
  onHint: () => void; onPeek: () => void; onUndo: () => void;
  onRestart: () => void; onMenu: () => void;
  dark: boolean; onToggleDark: () => void;
}

// Draw a pipe tile as an SVG based on connections
function PipeSVG({ tile, size }: { tile: PipeTile; size: number }) {
  const mid = size / 2;
  const lines: React.ReactNode[] = [];
  if (tile.n) lines.push(<line key="n" x1={mid} y1={0} x2={mid} y2={mid} stroke="currentColor" strokeWidth={size * 0.15} strokeLinecap="round" />);
  if (tile.s) lines.push(<line key="s" x1={mid} y1={mid} x2={mid} y2={size} stroke="currentColor" strokeWidth={size * 0.15} strokeLinecap="round" />);
  if (tile.e) lines.push(<line key="e" x1={mid} y1={mid} x2={size} y2={mid} stroke="currentColor" strokeWidth={size * 0.15} strokeLinecap="round" />);
  if (tile.w) lines.push(<line key="w" x1={0} y1={mid} x2={mid} y2={mid} stroke="currentColor" strokeWidth={size * 0.15} strokeLinecap="round" />);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={mid} cy={mid} r={size * 0.06} fill="currentColor" />
      {lines}
    </svg>
  );
}

const PipeRotateGameScreen = ({ game, time, onRotateTile, onHint, onPeek, onUndo, onRestart, onMenu, dark, onToggleDark }: Props) => {
  const cellPx = Math.min(52, Math.floor(360 / game.size));

  return (
    <div className="py-6 sm:py-8">
      <div className="flex justify-between items-start mb-5 gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Pipe Rotate</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{game.difficulty}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-4">
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Time</label><span className="tabular-nums font-semibold text-base">{time}</span></div>
            <div><label className="block text-[0.7rem] uppercase text-muted-foreground mb-0.5">Rotations</label><span className="tabular-nums font-semibold text-base">{game.moves}</span></div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      {game.hintText && <p className="text-accent text-sm font-semibold mb-3 text-center">💡 {game.hintText}</p>}

      <div className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] p-4 flex flex-col items-center">
        <p className="text-xs text-muted-foreground mb-3">Click tiles to rotate · Connect 🟢 source to 🔴 sink</p>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${game.size}, ${cellPx}px)` }}>
          {game.tiles.map((row, r) =>
            row.map((tile, c) => {
              const isSource = r === game.sourceR && c === game.sourceC;
              const isSink = r === game.sinkR && c === game.sinkC;
              const isEmpty = tile.type === "empty";
              return (
                <motion.button
                  key={`${r}-${c}`}
                  onClick={() => !isEmpty && !game.won && onRotateTile(r, c)}
                  whileTap={!isEmpty && !game.won ? { rotate: 90 } : undefined}
                  style={{ width: cellPx, height: cellPx }}
                  className={`flex items-center justify-center rounded border-2 transition-all
                    ${isSource ? "bg-green-500/20 border-green-500 text-green-500" :
                      isSink ? "bg-red-500/20 border-red-500 text-red-500" :
                      isEmpty ? "bg-transparent border-border/20 text-transparent" :
                      "bg-card border-border text-foreground hover:bg-muted cursor-pointer"}`}
                >
                  {isSource ? <span className="font-bold text-xs">▶</span> :
                   isSink ? <span className="font-bold text-xs">■</span> :
                   !isEmpty ? <PipeSVG tile={tile} size={cellPx - 8} /> : null}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 mb-2"><PowerUpButtons onHint={onHint} onPeek={onPeek} onUndo={onUndo} /></div>
      <div className="flex justify-center gap-6 mt-2">
        <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Restart</button>
        <button onClick={onMenu} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Menu</button>
      </div>
      {game.won && <WinModal moves={game.moves} time={time} difficulty={game.difficulty} onClose={onMenu} />}
    </div>
  );
};

export default PipeRotateGameScreen;

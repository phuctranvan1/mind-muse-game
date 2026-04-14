import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { ScoreEntry } from "@/hooks/useDailyChallenge";

interface Props {
  moves: number;
  time: string;
  scoreboard: ScoreEntry[];
  alreadyCompleted: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

const DailyWinModal = ({ moves, time, scoreboard, alreadyCompleted, onSubmit, onClose }: Props) => {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(alreadyCompleted);

  useEffect(() => {
    if (alreadyCompleted) return;
    const colors = ["#7c3aed", "#ec4899", "#f97316", "#eab308", "#14b8a6", "#3b82f6"];
    const end = Date.now() + 2000;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [alreadyCompleted]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim());
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--overlay-bg)", backdropFilter: "blur(6px)" }}>
      <div className="bg-card rounded-[var(--radius-outer)] shadow-[var(--shadow-md)] p-6 w-[92%] max-w-[360px] text-center animate-in fade-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto">
        <div className="text-3xl mb-2">🏆</div>
        <h2 className="text-xl font-bold text-foreground mb-1">Daily Challenge {alreadyCompleted ? "Complete" : "Won!"}!</h2>

        {!alreadyCompleted && (
          <p className="text-muted-foreground text-sm mb-3">
            <span className="font-semibold text-primary">{moves}</span> moves ·{" "}
            <span className="font-semibold text-accent">{time}</span>
          </p>
        )}

        {!alreadyCompleted && !submitted && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Rewards: +2 Hints, +1 Undo, +1 Peek</p>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              maxLength={20}
              className="w-full px-3 py-2 rounded-[var(--radius-inner)] border border-border bg-background text-foreground text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full py-2 rounded-[var(--radius-inner)] bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-40"
            >
              Submit Score
            </button>
          </div>
        )}

        {/* Scoreboard */}
        {scoreboard.length > 0 && (
          <div className="mt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Today's Scoreboard</h3>
            <div className="bg-background rounded-[var(--radius-inner)] border border-border overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 text-[0.65rem] uppercase tracking-wider text-muted-foreground px-3 py-1.5 border-b border-border">
                <span>#</span><span className="text-left">Name</span><span>Moves</span><span>Time</span>
              </div>
              {scoreboard.slice(0, 10).map((entry, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 text-sm px-3 py-1.5 border-b border-border last:border-0"
                >
                  <span className={`font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-orange-400" : "text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                  <span className="text-left text-foreground truncate">{entry.name}</span>
                  <span className="text-foreground tabular-nums">{entry.moves}</span>
                  <span className="text-muted-foreground tabular-nums text-xs">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-[var(--radius-inner)] bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-all"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default DailyWinModal;

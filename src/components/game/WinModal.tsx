import { useEffect } from "react";
import confetti from "canvas-confetti";

interface WinModalProps {
  moves: number;
  time: string;
  difficulty?: string;
  onClose: () => void;
}

function parseTimeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

function getStars(difficulty: string, moves: number, time: string): number {
  const totalSeconds = parseTimeToSeconds(time);
  const d = difficulty.toLowerCase();
  if (d === "legend") return moves < 50 && totalSeconds < 120 ? 3 : moves < 100 ? 2 : 1;
  if (d === "genius") return moves < 40 && totalSeconds < 90 ? 3 : moves < 80 ? 2 : 1;
  if (d === "grandmaster") return moves < 35 && totalSeconds < 75 ? 3 : moves < 70 ? 2 : 1;
  if (d === "master") return moves < 30 && totalSeconds < 60 ? 3 : moves < 60 ? 2 : 1;
  if (d === "expert") return moves < 25 && totalSeconds < 45 ? 3 : moves < 50 ? 2 : 1;
  if (d === "hard") return moves < 20 && totalSeconds < 30 ? 3 : moves < 40 ? 2 : 1;
  if (d === "medium") return moves < 15 && totalSeconds < 20 ? 3 : moves < 30 ? 2 : 1;
  return moves < 10 && totalSeconds < 15 ? 3 : moves < 20 ? 2 : 1;
}

const WinModal = ({ moves, time, difficulty, onClose }: WinModalProps) => {
  const stars = difficulty ? getStars(difficulty, moves, time) : null;

  useEffect(() => {
    const colors = ["#7c3aed", "#ec4899", "#f97316", "#eab308", "#14b8a6", "#3b82f6"];
    const end = Date.now() + 2000;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--overlay-bg)", backdropFilter: "blur(6px)" }}
    >
      <div className="bg-card rounded-[var(--radius-outer)] shadow-[var(--shadow-md)] p-8 w-[90%] max-w-[340px] text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-foreground mb-1">Solved!</h2>
        {difficulty && (
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{difficulty}</p>
        )}

        {/* Star rating */}
        {stars !== null && (
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3].map(s => (
              <span
                key={s}
                className={`text-2xl transition-all ${s <= stars ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]" : "text-muted/30"}`}
              >
                ★
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-6 mb-6">
          <div className="text-center">
            <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-0.5">Moves</p>
            <p className="font-bold text-lg text-primary tabular-nums">{moves}</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-0.5">Time</p>
            <p className="font-bold text-lg text-accent tabular-nums">{time}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-[var(--radius-inner)] bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinModal;

interface WinModalProps {
  moves: number;
  time: string;
  onClose: () => void;
}

const WinModal = ({ moves, time, onClose }: WinModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--overlay-bg)", backdropFilter: "blur(6px)" }}
    >
      <div className="bg-card rounded-[var(--radius-outer)] shadow-[var(--shadow-md)] p-8 w-[90%] max-w-[320px] text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl font-bold text-foreground mb-2">Solved!</h2>
        <p className="text-muted-foreground mb-6">
          Completed in <span className="font-semibold text-primary">{moves}</span> moves and{" "}
          <span className="font-semibold text-accent">{time}</span>.
        </p>
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

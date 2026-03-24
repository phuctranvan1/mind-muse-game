interface Props {
  onHint?: () => void;
  onUndo?: () => void;
  onPeek?: () => void;
}

const PowerUpButtons = ({ onHint, onUndo, onPeek }: Props) => {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {onHint && (
        <button
          onClick={onHint}
          className="text-xs px-3 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/25 font-semibold hover:bg-accent/25 transition-colors"
        >
          💡 Hint
        </button>
      )}
      {onUndo && (
        <button
          onClick={onUndo}
          className="text-xs px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/25 font-semibold hover:bg-primary/25 transition-colors"
        >
          ↩ Undo
        </button>
      )}
      {onPeek && (
        <button
          onClick={onPeek}
          className="text-xs px-3 py-1.5 rounded-full bg-yellow-500/15 text-yellow-600 border border-yellow-500/25 font-semibold hover:bg-yellow-500/25 transition-colors"
        >
          👁 Peek
        </button>
      )}
    </div>
  );
};

export default PowerUpButtons;

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
          className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full bg-accent/15 text-accent border border-accent/25 font-semibold hover:bg-accent/25 hover:border-accent/40 active:scale-95 transition-all duration-150"
        >
          <span className="text-sm">💡</span> Hint
        </button>
      )}
      {onUndo && (
        <button
          onClick={onUndo}
          className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full bg-primary/15 text-primary border border-primary/25 font-semibold hover:bg-primary/25 hover:border-primary/40 active:scale-95 transition-all duration-150"
        >
          <span className="text-sm">↩</span> Undo
        </button>
      )}
      {onPeek && (
        <button
          onClick={onPeek}
          className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full bg-yellow-500/15 text-yellow-600 border border-yellow-500/25 font-semibold hover:bg-yellow-500/25 hover:border-yellow-500/40 active:scale-95 transition-all duration-150"
        >
          <span className="text-sm">👁</span> Peek
        </button>
      )}
    </div>
  );
};

export default PowerUpButtons;

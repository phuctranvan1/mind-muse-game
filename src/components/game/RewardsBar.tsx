import { Rewards } from "@/hooks/useDailyChallenge";

interface Props {
  rewards: Rewards;
  onUseHint?: () => void;
  onUseUndo?: () => void;
  onUsePeek?: () => void;
}

const RewardsBar = ({ rewards, onUseHint, onUseUndo, onUsePeek }: Props) => {
  if (rewards.hints + rewards.undos + rewards.peeks === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-2 mb-2">
      {rewards.hints > 0 && onUseHint && (
        <button
          onClick={onUseHint}
          className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25 font-semibold hover:bg-accent/25 transition-colors"
        >
          💡 Hint ({rewards.hints})
        </button>
      )}
      {rewards.undos > 0 && onUseUndo && (
        <button
          onClick={onUseUndo}
          className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25 font-semibold hover:bg-primary/25 transition-colors"
        >
          ↩ Undo ({rewards.undos})
        </button>
      )}
      {rewards.peeks > 0 && onUsePeek && (
        <button
          onClick={onUsePeek}
          className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-600 border border-yellow-500/25 font-semibold hover:bg-yellow-500/25 transition-colors"
        >
          👁 Peek ({rewards.peeks})
        </button>
      )}
    </div>
  );
};

export default RewardsBar;

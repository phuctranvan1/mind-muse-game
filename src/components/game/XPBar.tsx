import { motion } from "framer-motion";
import { XPState, getLevelTitle } from "@/hooks/useXPSystem";

interface Props {
  xpState: XPState;
  compact?: boolean;
}

const XPBar = ({ xpState, compact = false }: Props) => {
  const title = getLevelTitle(xpState.level);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[0.65rem] font-bold text-primary/90 whitespace-nowrap">Lv.{xpState.level}</span>
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden min-w-[48px]">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpState.progressPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <span className="text-[0.6rem] text-muted-foreground tabular-nums whitespace-nowrap">{xpState.xpInLevel}/{xpState.xpNeededForNext}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-primary">Level {xpState.level}</span>
          <span className="text-[0.65rem] text-muted-foreground">· {title}</span>
        </div>
        <span className="text-[0.65rem] text-muted-foreground tabular-nums">
          {xpState.xpInLevel} / {xpState.xpNeededForNext} XP
        </span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full shadow-[0_0_8px_rgba(124,58,237,0.4)]"
          initial={{ width: 0 }}
          animate={{ width: `${xpState.progressPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default XPBar;

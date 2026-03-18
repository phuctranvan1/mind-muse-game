import { useShiftGame, Difficulty } from "@/hooks/useShiftGame";
import { useTimer } from "@/hooks/useTimer";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MenuScreen from "@/components/game/MenuScreen";
import GameScreen from "@/components/game/GameScreen";
import WinModal from "@/components/game/WinModal";

const Index = () => {
  const { game, startGame, moveTile, moveByDirection, restart, showHint, goToMenu, difficultyLabel } = useShiftGame();
  const { formatted: time } = useTimer(!!game && !game.won);
  const { dark, toggle: toggleDark } = useDarkMode();

  // Keyboard support
  useEffect(() => {
    if (!game || game.won) return;
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        moveByDirection(dir);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [game, game?.won, moveByDirection]);

  // Save progress to localStorage
  useEffect(() => {
    if (game?.won) {
      const key = `shift-best-${game.difficulty}`;
      const prev = localStorage.getItem(key);
      const best = prev ? JSON.parse(prev) : null;
      if (!best || game.moves < best.moves) {
        localStorage.setItem(key, JSON.stringify({ moves: game.moves, time }));
      }
    }
  }, [game?.won]);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.96, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -16 },
  };

  const transition = { duration: 0.35, ease: [0.2, 0, 0, 1] as const };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background overflow-hidden">
      <div className="w-full max-w-[440px] px-6">
        <AnimatePresence mode="wait">
          {!game ? (
            <motion.div
              key="menu"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <MenuScreen onSelectDifficulty={startGame} dark={dark} onToggleDark={toggleDark} />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <GameScreen
                game={game}
                time={time}
                difficultyLabel={difficultyLabel}
                onMoveTile={moveTile}
                onHint={showHint}
                onRestart={restart}
                onMenu={goToMenu}
                dark={dark}
                onToggleDark={toggleDark}
              />
              {game.won && (
                <WinModal moves={game.moves} time={time} onClose={goToMenu} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;

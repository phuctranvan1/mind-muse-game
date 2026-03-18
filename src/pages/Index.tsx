import { useShiftGame, Difficulty } from "@/hooks/useShiftGame";
import { useTimer } from "@/hooks/useTimer";
import { useEffect } from "react";
import MenuScreen from "@/components/game/MenuScreen";
import GameScreen from "@/components/game/GameScreen";
import WinModal from "@/components/game/WinModal";

const Index = () => {
  const { game, startGame, moveTile, restart, showHint, goToMenu, difficultyLabel } = useShiftGame();
  const { formatted: time } = useTimer(!!game && !game.won);

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

  if (!game) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="w-full max-w-[440px] px-6">
          <MenuScreen onSelectDifficulty={startGame} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="w-full max-w-[440px] px-6">
        <GameScreen
          game={game}
          time={time}
          difficultyLabel={difficultyLabel}
          onMoveTile={moveTile}
          onHint={showHint}
          onRestart={restart}
          onMenu={goToMenu}
        />
        {game.won && (
          <WinModal moves={game.moves} time={time} onClose={goToMenu} />
        )}
      </div>
    </div>
  );
};

export default Index;

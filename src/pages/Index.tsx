import { useState } from "react";
import { useShiftGame, Difficulty } from "@/hooks/useShiftGame";
import { useMemoryGame } from "@/hooks/useMemoryGame";
import { useLightsOutGame } from "@/hooks/useLightsOutGame";
import { usePatternRecallGame } from "@/hooks/usePatternRecallGame";
import { useMathChainGame } from "@/hooks/useMathChainGame";
import { useTimer } from "@/hooks/useTimer";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PuzzleSelector, { PuzzleType } from "@/components/game/PuzzleSelector";
import DifficultyMenu from "@/components/game/DifficultyMenu";
import GameScreen from "@/components/game/GameScreen";
import MemoryGameScreen from "@/components/game/MemoryGameScreen";
import LightsOutGameScreen from "@/components/game/LightsOutGameScreen";
import PatternRecallGameScreen from "@/components/game/PatternRecallGameScreen";
import MathChainGameScreen from "@/components/game/MathChainGameScreen";
import WinModal from "@/components/game/WinModal";

type Screen = "puzzleSelect" | "difficultySelect" | "playing";

const DIFFICULTY_CONFIGS: Record<PuzzleType, { key: Difficulty; label: string; desc: string; color: string; badge?: string }[]> = {
  shift: [
    { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5×5 · 200 moves", color: "bg-tile-1", badge: "Limited" },
    { key: "expert", label: "Expert", desc: "6×6 · 350 moves", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7×7 Grid", color: "bg-tile-2", badge: "Genius" },
  ],
  memory: [
    { key: "easy", label: "Easy", desc: "4 pairs", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "8 pairs", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "12 pairs", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "18 pairs", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "24 pairs", color: "bg-tile-2", badge: "Genius" },
  ],
  lightsout: [
    { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5×5 Grid", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "6×6 Grid", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7×7 Grid", color: "bg-tile-2", badge: "Genius" },
  ],
  pattern: [
    { key: "easy", label: "Easy", desc: "3×3 · 4 steps", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 · 6 steps", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "4×4 · 8 steps fast", color: "bg-tile-1", badge: "Hard" },
    { key: "expert", label: "Expert", desc: "5×5 · 10 steps", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "5×5 · 14 steps", color: "bg-tile-2", badge: "Genius" },
  ],
  mathchain: [
    { key: "easy", label: "Easy", desc: "5 questions · + −", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "8 questions · + − ×", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "12 questions · + − ×", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "15 questions · all ops", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "20 questions · big nums", color: "bg-tile-2", badge: "Genius" },
  ],
};

const PUZZLE_NAMES: Record<PuzzleType, string> = {
  shift: "Shift",
  memory: "Memory",
  lightsout: "Lights Out",
  pattern: "Pattern",
  mathchain: "Math Chain",
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("puzzleSelect");
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleType>("shift");

  const shift = useShiftGame();
  const memory = useMemoryGame();
  const lightsout = useLightsOutGame();
  const pattern = usePatternRecallGame();
  const math = useMathChainGame();
  const { dark, toggle: toggleDark } = useDarkMode();

  const isPlaying = screen === "playing";
  const shiftActive = isPlaying && selectedPuzzle === "shift" && shift.game && !shift.game.won;
  const memoryActive = isPlaying && selectedPuzzle === "memory" && memory.game && !memory.game.won;
  const lightsoutActive = isPlaying && selectedPuzzle === "lightsout" && lightsout.game && !lightsout.game.won;
  const mathActive = isPlaying && selectedPuzzle === "mathchain" && math.game && !math.game.finished;
  const timerRunning = !!(shiftActive || memoryActive || lightsoutActive || mathActive);

  const { formatted: time } = useTimer(timerRunning);

  // Keyboard support for shift
  useEffect(() => {
    if (selectedPuzzle !== "shift" || !shift.game || shift.game.won) return;
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); shift.moveByDirection(dir); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedPuzzle, shift.game, shift.game?.won, shift.moveByDirection]);

  const handlePuzzleSelect = (type: PuzzleType) => {
    setSelectedPuzzle(type);
    setScreen("difficultySelect");
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    switch (selectedPuzzle) {
      case "shift": shift.startGame(difficulty); break;
      case "memory": memory.startGame(difficulty); break;
      case "lightsout": lightsout.startGame(difficulty); break;
      case "pattern": pattern.startGame(difficulty); break;
      case "mathchain": math.startGame(difficulty); break;
    }
    setScreen("playing");
  };

  const handleBackToMenu = () => {
    shift.goToMenu();
    memory.goToMenu();
    lightsout.goToMenu();
    pattern.goToMenu();
    math.goToMenu();
    setScreen("puzzleSelect");
  };

  const handleBackToDifficulty = () => {
    shift.goToMenu();
    memory.goToMenu();
    lightsout.goToMenu();
    pattern.goToMenu();
    math.goToMenu();
    setScreen("difficultySelect");
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.96, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -16 },
  };
  const transition = { duration: 0.35, ease: [0.2, 0, 0, 1] as const };

  const renderGame = () => {
    switch (selectedPuzzle) {
      case "shift":
        return shift.game && (
          <>
            <GameScreen
              game={shift.game} time={time} difficultyLabel={shift.difficultyLabel}
              onMoveTile={shift.moveTile} onHint={shift.showHint} onRestart={shift.restart}
              onMenu={handleBackToDifficulty} dark={dark} onToggleDark={toggleDark}
            />
            {shift.game.won && <WinModal moves={shift.game.moves} time={time} onClose={handleBackToDifficulty} />}
          </>
        );
      case "memory":
        return memory.game && (
          <MemoryGameScreen
            game={memory.game} time={time} onFlip={memory.flipCard}
            onRestart={memory.restart} onMenu={handleBackToDifficulty}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "lightsout":
        return lightsout.game && (
          <LightsOutGameScreen
            game={lightsout.game} time={time} onToggleCell={lightsout.toggleCell}
            onRestart={lightsout.restart} onMenu={handleBackToDifficulty}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "pattern":
        return pattern.game && (
          <PatternRecallGameScreen
            game={pattern.game} onTap={pattern.tapCell} onNextRound={pattern.nextRound}
            onRestart={pattern.restart} onMenu={handleBackToDifficulty}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "mathchain":
        return math.game && (
          <MathChainGameScreen
            game={math.game} time={time} onAnswer={math.selectAnswer}
            onRestart={math.restart} onMenu={handleBackToDifficulty}
            dark={dark} onToggleDark={toggleDark}
          />
        );
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background overflow-hidden">
      <div className="w-full max-w-[440px] px-6">
        <AnimatePresence mode="wait">
          {screen === "puzzleSelect" && (
            <motion.div key="puzzles" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              <PuzzleSelector onSelect={handlePuzzleSelect} dark={dark} onToggleDark={toggleDark} />
            </motion.div>
          )}
          {screen === "difficultySelect" && (
            <motion.div key="difficulty" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              <DifficultyMenu
                title={PUZZLE_NAMES[selectedPuzzle]}
                onSelectDifficulty={handleDifficultySelect}
                onBack={handleBackToMenu}
                dark={dark} onToggleDark={toggleDark}
                customDifficulties={DIFFICULTY_CONFIGS[selectedPuzzle]}
              />
            </motion.div>
          )}
          {screen === "playing" && (
            <motion.div key="game" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              {renderGame()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;

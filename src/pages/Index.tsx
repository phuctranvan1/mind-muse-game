import { useState } from "react";
import { useShiftGame, Difficulty } from "@/hooks/useShiftGame";
import { useMemoryGame } from "@/hooks/useMemoryGame";
import { useLightsOutGame } from "@/hooks/useLightsOutGame";
import { usePatternRecallGame } from "@/hooks/usePatternRecallGame";
import { useMathChainGame } from "@/hooks/useMathChainGame";
import { useHanoiGame } from "@/hooks/useHanoiGame";
import { useColorSortGame } from "@/hooks/useColorSortGame";
import { useSudokuGame } from "@/hooks/useSudokuGame";
import { useNQueensGame } from "@/hooks/useNQueensGame";
import { useKnightTourGame } from "@/hooks/useKnightTourGame";
import { useTimer } from "@/hooks/useTimer";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PuzzleSelector, { PuzzleType } from "@/components/game/PuzzleSelector";
import DifficultyMenu from "@/components/game/DifficultyMenu";
import GameScreen from "@/components/game/GameScreen";
import MemoryGameScreen from "@/components/game/MemoryGameScreen";
import LightsOutGameScreen from "@/components/game/LightsOutGameScreen";
import PatternRecallGameScreen from "@/components/game/PatternRecallGameScreen";
import MathChainGameScreen from "@/components/game/MathChainGameScreen";
import HanoiGameScreen from "@/components/game/HanoiGameScreen";
import ColorSortGameScreen from "@/components/game/ColorSortGameScreen";
import SudokuGameScreen from "@/components/game/SudokuGameScreen";
import NQueensGameScreen from "@/components/game/NQueensGameScreen";
import KnightTourGameScreen from "@/components/game/KnightTourGameScreen";
import WinModal from "@/components/game/WinModal";
import DailyWinModal from "@/components/game/DailyWinModal";
import RewardsBar from "@/components/game/RewardsBar";

type Screen = "puzzleSelect" | "difficultySelect" | "playing";

const DIFFICULTY_CONFIGS: Record<PuzzleType, { key: Difficulty; label: string; desc: string; color: string; badge?: string }[]> = {
  shift: [
    { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5×5 · 200 moves", color: "bg-tile-1", badge: "Limited" },
    { key: "expert", label: "Expert", desc: "6×6 · 350 moves", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7×7 Grid", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8×8 · 500 moves", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9×9 · 300 moves", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  memory: [
    { key: "easy", label: "Easy", desc: "4 pairs", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "8 pairs", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "12 pairs", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "18 pairs", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "24 pairs", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "30 pairs", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "36 pairs", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  lightsout: [
    { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5×5 Grid", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "6×6 Grid", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7×7 Grid", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8×8 Grid", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9×9 Grid", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  pattern: [
    { key: "easy", label: "Easy", desc: "3×3 · 4 steps", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 · 6 steps", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "4×4 · 8 steps fast", color: "bg-tile-1", badge: "Hard" },
    { key: "expert", label: "Expert", desc: "5×5 · 10 steps", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "5×5 · 14 steps", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "6×6 · 18 steps", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "6×6 · 24 ultra-fast", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  mathchain: [
    { key: "easy", label: "Easy", desc: "5 questions · + −", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "8 questions · + − ×", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "12 questions · + − ×", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "15 questions · all ops", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "20 questions · big nums", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "25 questions · huge", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "30 questions · extreme", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  hanoi: [
    { key: "easy", label: "Easy", desc: "3 discs", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4 discs", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5 discs · 40 moves", color: "bg-tile-1", badge: "Limited" },
    { key: "expert", label: "Expert", desc: "6 discs · 100 moves", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7 discs · 180 moves", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8 discs · 350 moves", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9 discs · 600 moves", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  colorsort: [
    { key: "easy", label: "Easy", desc: "3 colors", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4 colors", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "6 colors", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "8 colors", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "10 colors", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "12 colors · tall", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "14 colors · tall", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  sudoku: [
    { key: "easy", label: "Easy", desc: "4×4 · 4 blanks", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 · 8 blanks", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "9×9 · 35 blanks", color: "bg-tile-1", badge: "Classic" },
    { key: "expert", label: "Expert", desc: "9×9 · 45 blanks", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "9×9 · 52 blanks", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "9×9 · 56 blanks", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9×9 · 60 blanks", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  nqueens: [
    { key: "easy", label: "Easy", desc: "4×4 board", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "5×5 board", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "6×6 board", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "7×7 board", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "8×8 board", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "9×9 board", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "10×10 board", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
  knighttour: [
    { key: "easy", label: "Easy", desc: "5×5 board", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "5×5 no limit", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "6×6 board", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "6×6 · 50 moves", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7×7 · 60 moves", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8×8 · 80 moves", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "8×8 · 75 moves", color: "bg-tile-4", badge: "🔥 Insane" },
  ],
};

const PUZZLE_NAMES: Record<PuzzleType, string> = {
  shift: "Shift",
  memory: "Memory",
  lightsout: "Lights Out",
  pattern: "Pattern",
  mathchain: "Math Chain",
  hanoi: "Tower of Hanoi",
  colorsort: "Color Sort",
  sudoku: "Sudoku",
  nqueens: "N-Queens",
  knighttour: "Knight's Tour",
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("puzzleSelect");
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleType>("shift");
  const [isDaily, setIsDaily] = useState(false);
  const [showDailyWin, setShowDailyWin] = useState(false);
  const [dailyWinData, setDailyWinData] = useState<{ moves: number; time: string } | null>(null);

  const shift = useShiftGame();
  const memory = useMemoryGame();
  const lightsout = useLightsOutGame();
  const pattern = usePatternRecallGame();
  const math = useMathChainGame();
  const hanoi = useHanoiGame();
  const colorsort = useColorSortGame();
  const sudoku = useSudokuGame();
  const nqueens = useNQueensGame();
  const knighttour = useKnightTourGame();
  const { dark, toggle: toggleDark } = useDarkMode();
  const daily = useDailyChallenge();

  const isPlaying = screen === "playing";
  const shiftActive = isPlaying && selectedPuzzle === "shift" && shift.game && !shift.game.won;
  const memoryActive = isPlaying && selectedPuzzle === "memory" && memory.game && !memory.game.won;
  const lightsoutActive = isPlaying && selectedPuzzle === "lightsout" && lightsout.game && !lightsout.game.won;
  const mathActive = isPlaying && selectedPuzzle === "mathchain" && math.game && !math.game.finished;
  const hanoiActive = isPlaying && selectedPuzzle === "hanoi" && hanoi.game && !hanoi.game.won;
  const colorsortActive = isPlaying && selectedPuzzle === "colorsort" && colorsort.game && !colorsort.game.won;
  const sudokuActive = isPlaying && selectedPuzzle === "sudoku" && sudoku.game && !sudoku.game.won;
  const nqueensActive = isPlaying && selectedPuzzle === "nqueens" && nqueens.game && !nqueens.game.won;
  const knighttourActive = isPlaying && selectedPuzzle === "knighttour" && knighttour.game && !knighttour.game.won;
  const timerRunning = !!(shiftActive || memoryActive || lightsoutActive || mathActive || hanoiActive || colorsortActive || sudokuActive || nqueensActive || knighttourActive);

  const { formatted: time } = useTimer(timerRunning);

  // Check for daily win conditions
  useEffect(() => {
    if (!isDaily || !isPlaying) return;

    const checkWin = (won: boolean, moves: number) => {
      if (won && !showDailyWin) {
        setDailyWinData({ moves, time });
        daily.loadScores(selectedPuzzle);
        setShowDailyWin(true);
      }
    };

    if (selectedPuzzle === "shift" && shift.game?.won) checkWin(true, shift.game.moves);
    if (selectedPuzzle === "memory" && memory.game?.won) checkWin(true, memory.game.moves);
    if (selectedPuzzle === "lightsout" && lightsout.game?.won) checkWin(true, lightsout.game.moves);
    if (selectedPuzzle === "pattern" && pattern.game?.phase === "won") checkWin(true, pattern.game.score);
    if (selectedPuzzle === "mathchain" && math.game?.finished && math.game.score === math.game.problems.length) checkWin(true, math.game.score);
    if (selectedPuzzle === "hanoi" && hanoi.game?.won) checkWin(true, hanoi.game.moves);
    if (selectedPuzzle === "colorsort" && colorsort.game?.won) checkWin(true, colorsort.game.moves);
    if (selectedPuzzle === "sudoku" && sudoku.game?.won) checkWin(true, sudoku.game.mistakes);
    if (selectedPuzzle === "nqueens" && nqueens.game?.won) checkWin(true, 0);
    if (selectedPuzzle === "knighttour" && knighttour.game?.won) checkWin(true, knighttour.game.path.length);
  }, [isDaily, isPlaying, selectedPuzzle, shift.game, memory.game, lightsout.game, pattern.game, math.game, hanoi.game, colorsort.game, sudoku.game, nqueens.game, knighttour.game]);

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
    setIsDaily(false);
    setScreen("difficultySelect");
  };

  const allGoToMenu = () => {
    shift.goToMenu(); memory.goToMenu(); lightsout.goToMenu();
    pattern.goToMenu(); math.goToMenu(); hanoi.goToMenu(); colorsort.goToMenu();
    sudoku.goToMenu(); nqueens.goToMenu(); knighttour.goToMenu();
  };

  const handleDailyChallenge = (type: PuzzleType) => {
    setSelectedPuzzle(type);
    setIsDaily(true);
    setShowDailyWin(false);
    setDailyWinData(null);
    const difficulty: Difficulty = "hard";
    const dailyRandom = daily.getDailyRandom(type);
    switch (type) {
      case "shift": shift.startGame(difficulty, dailyRandom); break;
      case "memory": memory.startGame(difficulty, dailyRandom); break;
      case "lightsout": lightsout.startGame(difficulty, dailyRandom); break;
      case "pattern": pattern.startGame(difficulty, dailyRandom); break;
      case "mathchain": math.startGame(difficulty, dailyRandom); break;
      case "hanoi": hanoi.startGame(difficulty); break;
      case "colorsort": colorsort.startGame(difficulty, dailyRandom); break;
      case "sudoku": sudoku.startGame(difficulty, dailyRandom); break;
      case "nqueens": nqueens.startGame(difficulty); break;
      case "knighttour": knighttour.startGame(difficulty); break;
    }
    setScreen("playing");
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    switch (selectedPuzzle) {
      case "shift": shift.startGame(difficulty); break;
      case "memory": memory.startGame(difficulty); break;
      case "lightsout": lightsout.startGame(difficulty); break;
      case "pattern": pattern.startGame(difficulty); break;
      case "mathchain": math.startGame(difficulty); break;
      case "hanoi": hanoi.startGame(difficulty); break;
      case "colorsort": colorsort.startGame(difficulty); break;
      case "sudoku": sudoku.startGame(difficulty); break;
      case "nqueens": nqueens.startGame(difficulty); break;
      case "knighttour": knighttour.startGame(difficulty); break;
    }
    setScreen("playing");
  };

  const goToMenu = () => {
    allGoToMenu();
    setIsDaily(false); setShowDailyWin(false); setDailyWinData(null);
    setScreen("puzzleSelect");
  };

  const handleBackToDifficulty = () => {
    allGoToMenu();
    setIsDaily(false); setShowDailyWin(false); setDailyWinData(null);
    setScreen(isDaily ? "puzzleSelect" : "difficultySelect");
  };

  const handleDailyWinSubmit = (name: string) => {
    if (dailyWinData) {
      daily.completeDailyChallenge(selectedPuzzle, name, dailyWinData.moves, dailyWinData.time);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.96, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -16 },
  };
  const transition = { duration: 0.35, ease: [0.2, 0, 0, 1] as const };

  const dailyRestart = () => handleDailyChallenge(selectedPuzzle);

  const renderGame = () => {
    const menuAction = isDaily ? goToMenu : handleBackToDifficulty;

    switch (selectedPuzzle) {
      case "shift":
        return shift.game && (
          <>
            <RewardsBar rewards={daily.rewards} onUseHint={shift.showHint} />
            <GameScreen
              game={shift.game} time={time} difficultyLabel={isDaily ? "Daily" : shift.difficultyLabel}
              onMoveTile={shift.moveTile} onHint={shift.showHint} onRestart={isDaily ? dailyRestart : shift.restart}
              onMenu={menuAction} dark={dark} onToggleDark={toggleDark}
            />
            {!isDaily && shift.game.won && <WinModal moves={shift.game.moves} time={time} onClose={menuAction} />}
          </>
        );
      case "memory":
        return memory.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <MemoryGameScreen
              game={memory.game} time={time} onFlip={memory.flipCard}
              onRestart={isDaily ? dailyRestart : memory.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
      case "lightsout":
        return lightsout.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <LightsOutGameScreen
              game={lightsout.game} time={time} onToggleCell={lightsout.toggleCell}
              onRestart={isDaily ? dailyRestart : lightsout.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
      case "pattern":
        return pattern.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <PatternRecallGameScreen
              game={pattern.game} onTap={pattern.tapCell} onNextRound={pattern.nextRound}
              onRestart={isDaily ? dailyRestart : pattern.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
      case "mathchain":
        return math.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <MathChainGameScreen
              game={math.game} time={time} onAnswer={math.selectAnswer}
              onRestart={isDaily ? dailyRestart : math.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
      case "hanoi":
        return hanoi.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <HanoiGameScreen
              game={hanoi.game} time={time} onSelectPeg={hanoi.selectPeg}
              onRestart={isDaily ? dailyRestart : hanoi.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
      case "colorsort":
        return colorsort.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <ColorSortGameScreen
              game={colorsort.game} time={time} onSelectTube={colorsort.selectTube}
              onRestart={isDaily ? dailyRestart : colorsort.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
      case "sudoku":
        return sudoku.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <SudokuGameScreen
              game={sudoku.game} time={time} onSelectCell={sudoku.selectCell}
              onEnterNumber={sudoku.enterNumber} onClear={sudoku.clearCell}
              onRestart={isDaily ? dailyRestart : sudoku.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
      case "nqueens":
        return nqueens.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <NQueensGameScreen
              game={nqueens.game} onToggleQueen={nqueens.toggleQueen}
              onRestart={isDaily ? dailyRestart : nqueens.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
      case "knighttour":
        return knighttour.game && (
          <>
            <RewardsBar rewards={daily.rewards} />
            <KnightTourGameScreen
              game={knighttour.game} time={time} onSelectCell={knighttour.selectCell}
              onUndo={knighttour.undo}
              onRestart={isDaily ? dailyRestart : knighttour.restart} onMenu={menuAction}
              dark={dark} onToggleDark={toggleDark}
            />
          </>
        );
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background overflow-hidden">
      <div className="w-full max-w-[440px] px-6">
        <AnimatePresence mode="wait">
          {screen === "puzzleSelect" && (
            <motion.div key="puzzles" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              <PuzzleSelector
                onSelect={handlePuzzleSelect}
                onDailyChallenge={handleDailyChallenge}
                dark={dark} onToggleDark={toggleDark}
                rewards={daily.rewards}
                isDailyDone={daily.isDailyDone}
              />
            </motion.div>
          )}
          {screen === "difficultySelect" && (
            <motion.div key="difficulty" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              <DifficultyMenu
                title={PUZZLE_NAMES[selectedPuzzle]}
                onSelectDifficulty={handleDifficultySelect}
                onBack={goToMenu}
                dark={dark} onToggleDark={toggleDark}
                customDifficulties={DIFFICULTY_CONFIGS[selectedPuzzle]}
              />
            </motion.div>
          )}
          {screen === "playing" && (
            <motion.div key="game" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              {isDaily && (
                <div className="text-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/25">
                    ⚡ Daily Challenge
                  </span>
                </div>
              )}
              {renderGame()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daily win modal */}
        {showDailyWin && dailyWinData && (
          <DailyWinModal
            moves={dailyWinData.moves}
            time={dailyWinData.time}
            scoreboard={daily.scoreboard}
            alreadyCompleted={daily.isDailyDone(selectedPuzzle)}
            onSubmit={handleDailyWinSubmit}
            onClose={goToMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

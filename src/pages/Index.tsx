import { useState } from "react";
import { useShiftGame, Difficulty } from "@/hooks/useShiftGame";
import { useMemoryGame } from "@/hooks/useMemoryGame";
import { useLightsOutGame } from "@/hooks/useLightsOutGame";
import { useLightsInGame } from "@/hooks/useLightsInGame";
import { usePatternRecallGame } from "@/hooks/usePatternRecallGame";
import { useMathChainGame } from "@/hooks/useMathChainGame";
import { useHanoiGame } from "@/hooks/useHanoiGame";
import { useColorSortGame } from "@/hooks/useColorSortGame";
import { useSudokuGame } from "@/hooks/useSudokuGame";
import { useNQueensGame } from "@/hooks/useNQueensGame";
import { useKnightTourGame } from "@/hooks/useKnightTourGame";
import { useMinesweeperGame } from "@/hooks/useMinesweeperGame";
import { use2048Game } from "@/hooks/use2048Game";
import { useSieveGame } from "@/hooks/useSieveGame";
import { useBabylonianGame } from "@/hooks/useBabylonianGame";
import { useRicochetGame } from "@/hooks/useRicochetGame";
import { usePortalGame } from "@/hooks/usePortalGame";
import { useChainBlastGame } from "@/hooks/useChainBlastGame";
import { useArcherGame } from "@/hooks/useArcherGame";
import { useWordScrambleGame } from "@/hooks/useWordScrambleGame";
import { useNonogramGame } from "@/hooks/useNonogramGame";
import { useStroopGame } from "@/hooks/useStroopGame";
import { useSequenceGame } from "@/hooks/useSequenceGame";
import { useBinaryGame } from "@/hooks/useBinaryGame";
import { useRomanGame } from "@/hooks/useRomanGame";
import { useMentalMathGame } from "@/hooks/useMentalMathGame";
import { useSimonGame } from "@/hooks/useSimonGame";
import { useReflexGame } from "@/hooks/useReflexGame";
import { useTypingSpeedGame } from "@/hooks/useTypingSpeedGame";
import { useCipherGame } from "@/hooks/useCipherGame";
import { useWordSearchGame } from "@/hooks/useWordSearchGame";
import { useAnagramGame } from "@/hooks/useAnagramGame";
import { useWordleGame } from "@/hooks/useWordleGame";
import { useMastermindGame } from "@/hooks/useMastermindGame";
import { useMazeGame } from "@/hooks/useMazeGame";
import { useTicTacToeGame } from "@/hooks/useTicTacToeGame";
import { useBalanceGame } from "@/hooks/useBalanceGame";
import { usePipeRotateGame } from "@/hooks/usePipeRotateGame";
import { useFloodFillGame } from "@/hooks/useFloodFillGame";
import { useConnect4Game } from "@/hooks/useConnect4Game";
import { useSetGame } from "@/hooks/useSetGame";
import { useOddOneOutGame } from "@/hooks/useOddOneOutGame";
import { usePathfinderGame } from "@/hooks/usePathfinderGame";
import { useHangmanGame } from "@/hooks/useHangmanGame";
import { useEmojiMathGame } from "@/hooks/useEmojiMathGame";
import { useFlagQuizGame } from "@/hooks/useFlagQuizGame";
import { useTimer } from "@/hooks/useTimer";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { useXPSystem } from "@/hooks/useXPSystem";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import { useGameStats } from "@/hooks/useGameStats";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PuzzleSelector, { PuzzleType } from "@/components/game/PuzzleSelector";
import DifficultyMenu from "@/components/game/DifficultyMenu";
import GameScreen from "@/components/game/GameScreen";
import MemoryGameScreen from "@/components/game/MemoryGameScreen";
import LightsOutGameScreen from "@/components/game/LightsOutGameScreen";
import LightsInGameScreen from "@/components/game/LightsInGameScreen";
import PatternRecallGameScreen from "@/components/game/PatternRecallGameScreen";
import MathChainGameScreen from "@/components/game/MathChainGameScreen";
import HanoiGameScreen from "@/components/game/HanoiGameScreen";
import ColorSortGameScreen from "@/components/game/ColorSortGameScreen";
import SudokuGameScreen from "@/components/game/SudokuGameScreen";
import NQueensGameScreen from "@/components/game/NQueensGameScreen";
import KnightTourGameScreen from "@/components/game/KnightTourGameScreen";
import MinesweeperGameScreen from "@/components/game/MinesweeperGameScreen";
import Game2048Screen from "@/components/game/Game2048Screen";
import SieveGameScreen from "@/components/game/SieveGameScreen";
import BabylonianGameScreen from "@/components/game/BabylonianGameScreen";
import RicochetGameScreen from "@/components/game/RicochetGameScreen";
import PortalGameScreen from "@/components/game/PortalGameScreen";
import ChainBlastGameScreen from "@/components/game/ChainBlastGameScreen";
import ArcherGameScreen from "@/components/game/ArcherGameScreen";
import WordScrambleGameScreen from "@/components/game/WordScrambleGameScreen";
import NonogramGameScreen from "@/components/game/NonogramGameScreen";
import StroopGameScreen from "@/components/game/StroopGameScreen";
import SequenceGameScreen from "@/components/game/SequenceGameScreen";
import BinaryGameScreen from "@/components/game/BinaryGameScreen";
import RomanGameScreen from "@/components/game/RomanGameScreen";
import MentalMathGameScreen from "@/components/game/MentalMathGameScreen";
import SimonGameScreen from "@/components/game/SimonGameScreen";
import ReflexGameScreen from "@/components/game/ReflexGameScreen";
import TypingSpeedGameScreen from "@/components/game/TypingSpeedGameScreen";
import CipherGameScreen from "@/components/game/CipherGameScreen";
import WordSearchGameScreen from "@/components/game/WordSearchGameScreen";
import AnagramGameScreen from "@/components/game/AnagramGameScreen";
import WordleGameScreen from "@/components/game/WordleGameScreen";
import MastermindGameScreen from "@/components/game/MastermindGameScreen";
import MazeGameScreen from "@/components/game/MazeGameScreen";
import TicTacToeGameScreen from "@/components/game/TicTacToeGameScreen";
import BalanceGameScreen from "@/components/game/BalanceGameScreen";
import PipeRotateGameScreen from "@/components/game/PipeRotateGameScreen";
import FloodFillGameScreen from "@/components/game/FloodFillGameScreen";
import Connect4GameScreen from "@/components/game/Connect4GameScreen";
import SetGameScreen from "@/components/game/SetGameScreen";
import OddOneOutGameScreen from "@/components/game/OddOneOutGameScreen";
import PathfinderGameScreen from "@/components/game/PathfinderGameScreen";
import HangmanGameScreen from "@/components/game/HangmanGameScreen";
import EmojiMathGameScreen from "@/components/game/EmojiMathGameScreen";
import FlagQuizGameScreen from "@/components/game/FlagQuizGameScreen";
import DailyWinModal from "@/components/game/DailyWinModal";
import StatsModal from "@/components/game/StatsModal";
import AchievementToast from "@/components/game/AchievementToast";
import { XPGain } from "@/hooks/useXPSystem";
import { getStars } from "@/lib/puzzleUtils";

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
    { key: "legend", label: "Legend", desc: "10×10 · 150 moves", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "11×11 · 120 moves", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "12×12 · 100 moves", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "14×14 · 80 moves", color: "bg-red-600", badge: "✦ Divine" },
  ],
  memory: [
    { key: "easy", label: "Easy", desc: "4 pairs", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "8 pairs", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "12 pairs", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "18 pairs", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "24 pairs", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "30 pairs", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "36 pairs", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "42 pairs · 84 cards", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "48 pairs · 96 cards", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "54 pairs · 108 cards", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "60 pairs · 120 cards", color: "bg-red-600", badge: "✦ Divine" },
  ],
  lightsout: [
    { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5×5 Grid", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "6×6 Grid", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7×7 Grid", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8×8 Grid", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9×9 Grid", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "10×10 · Pure Logic", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "11×11 · Pure Logic", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "12×12 · Pure Logic", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "14×14 · Pure Logic", color: "bg-red-600", badge: "✦ Divine" },
  ],
  lightsin: [
    { key: "easy", label: "Easy", desc: "3×3 Grid", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 Grid", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5×5 Grid", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "6×6 Grid", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7×7 Grid", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8×8 Grid", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9×9 Grid", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "10×10 · Pure Logic", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "11×11 · Pure Logic", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "12×12 · Pure Logic", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "14×14 · Pure Logic", color: "bg-red-600", badge: "✦ Divine" },
  ],
  pattern: [
    { key: "easy", label: "Easy", desc: "3×3 · 4 steps", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 · 6 steps", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "4×4 · 8 steps fast", color: "bg-tile-1", badge: "Hard" },
    { key: "expert", label: "Expert", desc: "5×5 · 10 steps", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "5×5 · 14 steps", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "6×6 · 18 steps", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "6×6 · 24 ultra-fast", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "7×7 · 30 · lightning", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "8×8 · 40 · 250ms", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "8×8 · 52 · 200ms", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "9×9 · 64 · 150ms", color: "bg-red-600", badge: "✦ Divine" },
  ],
  mathchain: [
    { key: "easy", label: "Easy", desc: "5 questions · + −", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "8 questions · + − ×", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "12 questions · + − ×", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "15 questions · all ops", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "20 questions · big nums", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "25 questions · huge", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "30 questions · extreme", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "40 questions · 3s · max", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "50 questions · 2s · insane", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "65 questions · 2s · absurd", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "80 questions · 1s · godmode", color: "bg-red-600", badge: "✦ Divine" },
  ],
  hanoi: [
    { key: "easy", label: "Easy", desc: "3 discs", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4 discs", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5 discs · 40 moves", color: "bg-tile-1", badge: "Limited" },
    { key: "expert", label: "Expert", desc: "6 discs · 100 moves", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7 discs · 180 moves", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8 discs · 350 moves", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9 discs · 600 moves", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "10 discs · 1200 moves", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "11 discs · 2400 moves", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "12 discs · 5000 moves", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "13 discs · 10000 moves", color: "bg-red-600", badge: "✦ Divine" },
  ],
  colorsort: [
    { key: "easy", label: "Easy", desc: "3 colors", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4 colors", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "6 colors", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "8 colors", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "10 colors", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "12 colors · tall", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "14 colors · tall", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "16 colors · chaos", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "18 colors · mayhem", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "20 colors · abyss", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "22 colors · void", color: "bg-red-600", badge: "✦ Divine" },
  ],
  sudoku: [
    { key: "easy", label: "Easy", desc: "4×4 · 4 blanks", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 · 8 blanks", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "9×9 · 35 blanks", color: "bg-tile-1", badge: "Classic" },
    { key: "expert", label: "Expert", desc: "9×9 · 45 blanks", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "9×9 · 52 blanks", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "9×9 · 56 blanks", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9×9 · 60 blanks", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "9×9 · 64 blanks", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "9×9 · 64 blanks · no hints", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "9×9 · 64 blanks · no mercy", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "9×9 · 64 blanks · transcend", color: "bg-red-600", badge: "✦ Divine" },
  ],
  nqueens: [
    { key: "easy", label: "Easy", desc: "4×4 board", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "5×5 board", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "6×6 board", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "7×7 board", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "8×8 board", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "9×9 board", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "10×10 board", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "12×12 board", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "14×14 board", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "16×16 board", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "20×20 board", color: "bg-red-600", badge: "✦ Divine" },
  ],
  knighttour: [
    { key: "easy", label: "Easy", desc: "5×5 board", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "5×5 no limit", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "6×6 board", color: "bg-tile-1" },
    { key: "expert", label: "Expert", desc: "6×6 · 50 moves", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7×7 · 60 moves", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8×8 · 80 moves", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "8×8 · 75 moves", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "10×10 · 100 moves", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "11×11 · 130 moves", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "12×12 · 155 moves", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "14×14 · 210 moves", color: "bg-red-600", badge: "✦ Divine" },
  ],
  minesweeper: [
    { key: "easy", label: "Easy", desc: "8×8 · 10 mines", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "10×10 · 20 mines", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "12×12 · 30 mines", color: "bg-tile-1", badge: "Classic" },
    { key: "expert", label: "Expert", desc: "14×14 · 45 mines", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "16×16 · 60 mines", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "18×18 · 80 mines", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "20×20 · 100 mines", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "24×24 · 130 mines", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "28×28 · 180 mines", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "30×30 · 220 mines", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "32×32 · 260 mines", color: "bg-red-600", badge: "✦ Divine" },
  ],
  "2048": [
    { key: "easy", label: "Easy", desc: "4×4 · reach 2048", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4×4 · reach 4096", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "4×4 · reach 8192 · 500 moves", color: "bg-tile-1", badge: "Limited" },
    { key: "expert", label: "Expert", desc: "5×5 · reach 2048", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "5×5 · reach 4096 · 600 moves", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "5×5 · reach 8192 · 700 moves", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "6×6 · reach 2048 · 600 moves", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "6×6 · reach 4096 · 800 moves", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "6×6 · reach 8192 · 900 moves", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "7×7 · reach 4096 · 900 moves", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "7×7 · reach 8192 · 1000 moves", color: "bg-red-600", badge: "✦ Divine" },
  ],
  sieve: [
    { key: "easy", label: "Easy", desc: "3 rounds · simple rules", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4 rounds · compound rules", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5 rounds · 3 lives", color: "bg-tile-1", badge: "Classic" },
    { key: "expert", label: "Expert", desc: "6 rounds · NOT logic", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7 rounds · triple rules", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8 rounds · 2 lives", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "10 rounds · 1 life", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "12 rounds · 5 conditions", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "15 rounds · 0 mistakes", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "18 rounds · 0 mistakes", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "20 rounds · 0 mistakes", color: "bg-red-600", badge: "✦ Divine" },
  ],
  babylonian: [
    { key: "easy", label: "Easy", desc: "3 rounds · ±0.5", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "4 rounds · ±0.2", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "5 rounds · ±0.1", color: "bg-tile-1", badge: "Precise" },
    { key: "expert", label: "Expert", desc: "6 rounds · ±0.05", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "7 rounds · ±0.01", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8 rounds · ±0.005", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "9 rounds · ±0.001", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "10 rounds · ±0.0005", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "30 rounds · ±0.000001", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "36 rounds · ±0.0000001", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "45 rounds · ±0.00000001", color: "bg-red-600", badge: "✦ Divine" },
  ],
  ricochet: [
    { key: "easy", label: "Easy", desc: "5×5 · free moves", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "6×6 · free moves", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "7×7 · 20 moves", color: "bg-tile-1", badge: "Limited" },
    { key: "expert", label: "Expert", desc: "8×8 · 18 moves", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "9×9 · 16 moves", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "10×10 · 14 moves", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "11×11 · 12 moves", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "12×12 · 10 moves", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "13×13 · 9 moves", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "14×14 · 8 moves", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "16×16 · 7 moves", color: "bg-red-600", badge: "✦ Divine" },
  ],
  portal: [
    { key: "easy", label: "Easy", desc: "5×5 · 1 portal", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "6×6 · 2 portals", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "7×7 · 30 moves", color: "bg-tile-1", badge: "Limited" },
    { key: "expert", label: "Expert", desc: "8×8 · 28 moves", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "9×9 · 25 moves", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "10×10 · 22 moves", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "11×11 · 20 moves", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "12×12 · 18 moves", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "14×14 · 16 moves", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "16×16 · 14 moves", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "18×18 · 12 moves", color: "bg-red-600", badge: "✦ Divine" },
  ],
  chainblast: [
    { key: "easy", label: "Easy", desc: "5×5 · 3 bombs", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "6×6 · 4 bombs", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "7×7 · 4 bombs", color: "bg-tile-1", badge: "Tricky" },
    { key: "expert", label: "Expert", desc: "8×8 · 5 bombs", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "9×9 · 5 bombs", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "10×10 · 6 bombs", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "11×11 · 6 bombs", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "12×12 · 6 bombs", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "13×13 · 7 bombs", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "14×14 · 7 bombs", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "16×16 · 8 bombs", color: "bg-red-600", badge: "✦ Divine" },
  ],
  archer: [
    { key: "easy", label: "Easy", desc: "5×5 · 5 arrows", color: "bg-tile-5" },
    { key: "medium", label: "Medium", desc: "6×6 · 6 arrows", color: "bg-tile-6" },
    { key: "hard", label: "Hard", desc: "7×7 · 7 arrows", color: "bg-tile-1", badge: "Tricky" },
    { key: "expert", label: "Expert", desc: "8×8 · 9 arrows", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master", label: "Master", desc: "9×9 · 11 arrows", color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "10×10 · 14 arrows", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius", label: "Genius", desc: "11×11 · 17 arrows", color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend", label: "Legend", desc: "12×12 · 21 arrows", color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic", label: "Mythic", desc: "14×14 · 27 arrows", color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal", label: "Immortal", desc: "16×16 · 35 arrows", color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine", label: "Divine", desc: "18×18 · 45 arrows", color: "bg-red-600", badge: "✦ Divine" },
  ],
  wordscramble: [
    { key: "easy",        label: "Easy",        desc: "3–4 letter words · 3 rounds",    color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "5–6 letter words · 4 rounds",    color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "7–8 letter words · 5 rounds · timed", color: "bg-tile-1", badge: "Timed" },
    { key: "expert",      label: "Expert",      desc: "8–10 letter words · 6 rounds",   color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "9–10 letter words · 7 rounds",   color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "Long words · 8 rounds · fast",   color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "11+ letter words · 10 rounds",   color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "12 rounds · monster words",      color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "14 rounds · 35s per word",       color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "16 rounds · 30s per word",       color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "20 rounds · 25s per word",       color: "bg-red-600", badge: "✦ Divine" },
  ],
  nonogram: [
    { key: "easy",        label: "Easy",        desc: "5×5 grid · pixel art",           color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7×7 grid",                       color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "10×10 grid",                     color: "bg-tile-1", badge: "Classic" },
    { key: "expert",      label: "Expert",      desc: "10×10 · random layout",          color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12×12 grid",                     color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "12×12 · denser",                 color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "15×15 grid",                     color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "15×15 · sparse clues",           color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "18×18 grid",                     color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "20×20 grid",                     color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "25×25 · maximum pain",           color: "bg-red-600", badge: "✦ Divine" },
  ],
  stroop: [
    { key: "easy",        label: "Easy",        desc: "3 colors · 6 rounds · 8s",       color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "4 colors · 8 rounds · 6s",       color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "5 colors · 10 rounds · 5s",      color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "6 colors · 12 rounds · 4s",      color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "6 colors · 15 rounds · 3s",      color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "7 colors · 18 rounds · 2.5s",    color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "8 colors · 20 rounds · 2s",      color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "8 colors · 25 rounds · 1.5s",    color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "8 colors · 30 rounds · 1s",      color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "8 colors · 36 rounds · 0.8s",    color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "8 colors · 45 rounds · 0.6s",    color: "bg-red-600", badge: "✦ Divine" },
  ],
  sequence: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · arithmetic only",     color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · geometric added",     color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · squares & triangles", color: "bg-tile-1", badge: "Classic" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · primes & Fibonacci", color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · cubes & powers",     color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · 2nd-order patterns", color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · all types",          color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20 rounds · all types",          color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "25 rounds · all types",          color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "30 rounds · all types",          color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "40 rounds · all types",          color: "bg-red-600", badge: "✦ Divine" },
  ],
  binary: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · binary→decimal",       color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · binary ↔ decimal",     color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · + hex→decimal",        color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · all bases",           color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · large values",        color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · all conversions",     color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · up to 4095",          color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20 rounds · up to 65535",         color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "22 rounds · 16-bit values",       color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "24 rounds · 16-bit values",       color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "25 rounds · 16-bit values",       color: "bg-red-600", badge: "✦ Divine" },
  ],
  roman: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · up to X",              color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · up to L",              color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · reverse included",     color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · up to D",             color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · up to M",             color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · up to MM",            color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · up to MMCMXCIX",      color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20 rounds · up to MMMCMXCIX",     color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "22 rounds · 3999 max",            color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "24 rounds · 3999 max",            color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "25 rounds · 3999 max",            color: "bg-red-600", badge: "✦ Divine" },
  ],
  mentalmath: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · 2-step",               color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · 3-step",               color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · 3-step · larger nums", color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · 4-step",              color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · 4-step · harder",     color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · 5-step",              color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · 5-step · max nums",   color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20 rounds · 6-step",              color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "22 rounds · 6-step · brutal",     color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "24 rounds · 7-step",              color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "25 rounds · 7-step · extreme",    color: "bg-red-600", badge: "✦ Divine" },
  ],
  simon: [
    { key: "easy",        label: "Easy",        desc: "4 colors · 4 steps",              color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "4 colors · 6 steps",              color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "4 colors · 8 steps",              color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "6 colors · 10 steps",             color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "6 colors · 12 steps",             color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "6 colors · 16 steps",             color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "8 colors · 20 steps",             color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "8 colors · 25 steps · fast",      color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "8 colors · 30 steps · faster",    color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "8 colors · 36 steps · rapid",     color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "8 colors · 45 steps · lightning", color: "bg-red-600", badge: "✦ Divine" },
  ],
  reflex: [
    { key: "easy",        label: "Easy",        desc: "10 targets · slow",               color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "15 targets · normal",             color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "20 targets · fast",               color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "25 targets · 1.2s window",        color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "30 targets · 1s window",          color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "35 targets · 0.8s",              color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "40 targets · 0.6s",              color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "50 targets · 0.5s",              color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "60 targets · 0.4s",              color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "70 targets · 0.3s",              color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "80 targets · 0.25s",             color: "bg-red-600", badge: "✦ Divine" },
  ],
  typing: [
    { key: "easy",        label: "Easy",        desc: "10 words · 5 letters · slow",     color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "12 words · normal speed",         color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "15 words · 6+ letters",           color: "bg-tile-1", badge: "Timed" },
    { key: "expert",      label: "Expert",      desc: "18 words · fast",                 color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "20 words · long words",           color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "25 words · very fast",            color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "30 words · extreme speed",        color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "35 words · brutal words",         color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "40 words · 3s each",              color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "45 words · 2.5s each",            color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "50 words · 2s each",              color: "bg-red-600", badge: "✦ Divine" },
  ],
  cipher: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · shift ≤ 5",            color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · any shift",            color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · longer words",         color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · 4 options",           color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · harder",              color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · brutal",              color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · max confusion",       color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20 rounds · full cipher",         color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "22 rounds",                       color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "24 rounds",                       color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "25 rounds",                       color: "bg-red-600", badge: "✦ Divine" },
  ],
  wordsearch: [
    { key: "easy",        label: "Easy",        desc: "6×6 grid · 3 words",              color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "8×8 grid · 4 words",              color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "10×10 · 5 words · diagonals",     color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "12×12 · 6 words",                 color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "14×14 · 7 words · all dirs",      color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "16×16 · 8 words",                 color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16×16 · 9 words · reversed",      color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "18×18 · 10 words",                color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "20×20 · 11 words",                color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "22×22 · 12 words",                color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "24×24 · 14 words",                color: "bg-red-600", badge: "✦ Divine" },
  ],
  anagram: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · 4-letter words",       color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · 5-letter words",       color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · 6-letter words",       color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · 7-letter words",      color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · long words",          color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · brutal",              color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · max confusion",       color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20 rounds",                       color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "22 rounds",                       color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "24 rounds",                       color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "25 rounds",                       color: "bg-red-600", badge: "✦ Divine" },
  ],
  wordle: [
    { key: "easy",        label: "Easy",        desc: "4-letter words · 6 guesses",      color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "5-letter words · 6 guesses",      color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "5-letter words · 5 guesses",      color: "bg-tile-1", badge: "Classic" },
    { key: "expert",      label: "Expert",      desc: "6-letter words · 6 guesses",      color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "6-letter words · 5 guesses",      color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "7-letter words · 5 guesses",      color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "7-letter words · 4 guesses",      color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "8-letter words · 4 guesses",      color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "8-letter words · 3 guesses",      color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "9-letter words · 3 guesses",      color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "10-letter words · 3 guesses",     color: "bg-red-600", badge: "✦ Divine" },
  ],
  mastermind: [
    { key: "easy",        label: "Easy",        desc: "4 pegs · 4 colors · 8 guesses",   color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "4 pegs · 5 colors · 7 guesses",   color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "4 pegs · 6 colors · 6 guesses",   color: "bg-tile-1", badge: "Classic" },
    { key: "expert",      label: "Expert",      desc: "5 pegs · 6 colors · 7 guesses",   color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "5 pegs · 7 colors · 6 guesses",   color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "6 pegs · 7 colors · 7 guesses",   color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "6 pegs · 8 colors · 6 guesses",   color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "7 pegs · 8 colors · 7 guesses",   color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "7 pegs · 9 colors · 6 guesses",   color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "8 pegs · 9 colors · 7 guesses",   color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "8 pegs · 10 colors · 6 guesses",  color: "bg-red-600", badge: "✦ Divine" },
  ],
  maze: [
    { key: "easy",        label: "Easy",        desc: "5×5 maze",                        color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "8×8 maze",                        color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "10×10 maze",                      color: "bg-tile-1", badge: "Classic" },
    { key: "expert",      label: "Expert",      desc: "12×12 maze",                      color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "14×14 maze",                      color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "16×16 maze",                      color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "20×20 maze",                      color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "24×24 maze",                      color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "28×28 maze",                      color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "32×32 maze",                      color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "40×40 maze",                      color: "bg-red-600", badge: "✦ Divine" },
  ],
  tictactoe: [
    { key: "easy",        label: "Easy",        desc: "3×3 · easy AI",                   color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "3×3 · medium AI",                 color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "4×4 · 4-in-a-row",               color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "5×5 · 4-in-a-row · hard AI",     color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "5×5 · 5-in-a-row",               color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "6×6 · 5-in-a-row",               color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "7×7 · 5-in-a-row · brutal AI",   color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "8×8 · 5-in-a-row · max AI",      color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "9×9 · 6-in-a-row",               color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "10×10 · 6-in-a-row",             color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "12×12 · 6-in-a-row",             color: "bg-red-600", badge: "✦ Divine" },
  ],
  balance: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · 3 weights",            color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · 4 weights",            color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · deduction chains",     color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · 5 weights",           color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · complex chains",      color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · 6 weights",           color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · max confusion",       color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20 rounds",                       color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "22 rounds",                       color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "24 rounds",                       color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "25 rounds",                       color: "bg-red-600", badge: "✦ Divine" },
  ],
  piperotate: [
    { key: "easy",        label: "Easy",        desc: "4×4 grid",                        color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "5×5 grid",                        color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "6×6 grid",                        color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "7×7 grid",                        color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "8×8 grid",                        color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "9×9 grid",                        color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "10×10 grid",                      color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "12×12 grid",                      color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "14×14 grid",                      color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "16×16 grid",                      color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "18×18 grid",                      color: "bg-red-600", badge: "✦ Divine" },
  ],
  floodfill: [
    { key: "easy",        label: "Easy",        desc: "6×6 · 3 colors · 8 moves",        color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "8×8 · 4 colors · 12 moves",       color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "10×10 · 5 colors · 16 moves",     color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "12×12 · 5 colors · 18 moves",     color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "14×14 · 6 colors · 20 moves",     color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "16×16 · 6 colors · 22 moves",     color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "18×18 · 7 colors · 25 moves",     color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20×20 · 7 colors · 28 moves",     color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "22×22 · 7 colors · 30 moves",     color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "24×24 · 7 colors · 32 moves",     color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "26×26 · 7 colors · 35 moves",     color: "bg-red-600", badge: "✦ Divine" },
  ],
  connect4: [
    { key: "easy",        label: "Easy",        desc: "6×7 · easy AI",                   color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "6×7 · medium AI",                 color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "6×7 · hard AI",                   color: "bg-tile-1", badge: "Classic" },
    { key: "expert",      label: "Expert",      desc: "7×8 · expert AI",                 color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "7×8 · master AI",                 color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "8×9 · grandmaster AI",            color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "8×9 · genius AI",                 color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "9×10 · legend AI",                color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "9×10 · mythic AI",                color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "10×11 · immortal AI",             color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "10×11 · divine AI",               color: "bg-red-600", badge: "✦ Divine" },
  ],
  setgame: [
    { key: "easy",        label: "Easy",        desc: "9 cards · find 2 sets",           color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "9 cards · find 3 sets",           color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "12 cards · find 4 sets",          color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "12 cards · find 5 sets",          color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 cards · find 6 sets",          color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "15 cards · find 7 sets",          color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "15 cards · find 8 sets",          color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "15 cards · find 9 sets",          color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "18 cards · find 10 sets",         color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "18 cards · find 11 sets",         color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "18 cards · find 12 sets",         color: "bg-red-600", badge: "✦ Divine" },
  ],
  oddoneout: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · obvious differences",  color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · subtle differences",   color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · tricky",               color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · expert level",        color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · hard logic",          color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · brutal",              color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · max confusion",       color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "20 rounds",                       color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "22 rounds",                       color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "24 rounds",                       color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "25 rounds",                       color: "bg-red-600", badge: "✦ Divine" },
  ],
  pathfinder: [
    { key: "easy",        label: "Easy",        desc: "4×4 grid · 5 flips",              color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "4×4 grid · 4 flips",              color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "5×5 grid · 5 flips",              color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "5×5 grid · 4 flips",              color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "6×6 grid · 5 flips",              color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "6×6 grid · 4 flips",              color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "7×7 grid · 5 flips",              color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "7×7 grid · 4 flips",              color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "8×8 grid · 5 flips",              color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "8×8 grid · 4 flips",              color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "9×9 grid · 5 flips",              color: "bg-red-600", badge: "✦ Divine" },
  ],
  hangman: [
    { key: "easy",        label: "Easy",        desc: "Short words · 6 lives",           color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "Medium words · 6 lives",          color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "Longer words · 6 lives",          color: "bg-tile-1" },
    { key: "expert",      label: "Expert",      desc: "Hard words · 5 lives",            color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "Expert words · 5 lives",          color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "Long words · 5 lives",            color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "Very long · 4 lives",             color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "Huge words · 4 lives",            color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "Massive words · 4 lives",         color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "Insane words · 3 lives",          color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "Divine words · 3 lives",          color: "bg-red-600", badge: "✦ Divine" },
  ],
  emojimath: [
    { key: "easy",        label: "Easy",        desc: "5 rounds · simple equations",     color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 rounds · two clues",            color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 rounds · tricky",               color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 rounds · expert level",        color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 rounds · hard logic",          color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 rounds · brutal",              color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 rounds · max confusion",       color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "18 rounds",                       color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "20 rounds",                       color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "22 rounds",                       color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "24 rounds",                       color: "bg-red-600", badge: "✦ Divine" },
  ],
  flagquiz: [
    { key: "easy",        label: "Easy",        desc: "5 flags · common countries",      color: "bg-tile-5" },
    { key: "medium",      label: "Medium",      desc: "7 flags · world tour",            color: "bg-tile-6" },
    { key: "hard",        label: "Hard",        desc: "8 flags · tricky",                color: "bg-tile-1", badge: "Tricky" },
    { key: "expert",      label: "Expert",      desc: "10 flags · expert level",         color: "bg-tile-7", badge: "IQ Test" },
    { key: "master",      label: "Master",      desc: "12 flags · hard",                 color: "bg-tile-2", badge: "Genius" },
    { key: "grandmaster", label: "Grandmaster", desc: "14 flags · brutal",               color: "bg-tile-3", badge: "🧠 Elite" },
    { key: "genius",      label: "Genius",      desc: "16 flags · insane",               color: "bg-tile-4", badge: "🔥 Insane" },
    { key: "legend",      label: "Legend",      desc: "18 flags",                        color: "bg-tile-8", badge: "💀 Legend" },
    { key: "mythic",      label: "Mythic",      desc: "20 flags",                        color: "bg-amber-500", badge: "⚡ Mythic" },
    { key: "immortal",    label: "Immortal",    desc: "22 flags",                        color: "bg-purple-600", badge: "🌌 Immortal" },
    { key: "divine",      label: "Divine",      desc: "24 flags",                        color: "bg-red-600", badge: "✦ Divine" },
  ],
};

const PUZZLE_NAMES: Record<PuzzleType, string> = {
  shift: "Shift",
  memory: "Memory",
  lightsout: "Lights Out",
  lightsin: "Lights In",
  pattern: "Pattern",
  mathchain: "Math Chain",
  hanoi: "Tower of Hanoi",
  colorsort: "Color Sort",
  sudoku: "Sudoku",
  nqueens: "N-Queens",
  knighttour: "Knight's Tour",
  minesweeper: "Minesweeper",
  "2048": "2048",
  sieve: "Number Theory Challenge",
  babylonian: "Babylonian Method",
  ricochet: "Ricochet",
  portal: "Portal Maze",
  chainblast: "Chain Blast",
  archer: "Archer",
  wordscramble: "Word Scramble",
  nonogram: "Nonogram",
  stroop: "Stroop Test",
  sequence: "Number Sequence",
  binary: "Binary Conversion",
  roman: "Roman Numerals",
  mentalmath: "Mental Math",
  simon: "Simon Says",
  reflex: "Reflex Challenge",
  typing: "Typing Speed",
  cipher: "Caesar Cipher",
  wordsearch: "Word Search",
  anagram: "Anagram",
  wordle: "Wordle",
  mastermind: "Mastermind",
  maze: "Maze",
  tictactoe: "Tic-Tac-Toe",
  balance: "Balance Deduction",
  piperotate: "Pipe Rotate",
  floodfill: "Flood Fill",
  connect4: "Connect 4",
  setgame: "Set Game",
  oddoneout: "Odd One Out",
  pathfinder: "Pathfinder",
  hangman: "Hangman",
  emojimath: "Emoji Math",
  flagquiz: "Flag Quiz",
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("puzzleSelect");
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleType>("shift");
  const [isDaily, setIsDaily] = useState(false);
  const [showDailyWin, setShowDailyWin] = useState(false);
  const [dailyWinData, setDailyWinData] = useState<{ moves: number; time: string } | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);
  const [lastXPGain, setLastXPGain] = useState<XPGain | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>("easy");
  const [usedHintInGame, setUsedHintInGame] = useState(false);

  // Track which wins we've already processed (to avoid double-awarding)
  const processedWins = useRef<Set<string>>(new Set());

  const shift = useShiftGame();
  const memory = useMemoryGame();
  const lightsout = useLightsOutGame();
  const lightsin = useLightsInGame();
  const pattern = usePatternRecallGame();
  const math = useMathChainGame();
  const hanoi = useHanoiGame();
  const colorsort = useColorSortGame();
  const sudoku = useSudokuGame();
  const nqueens = useNQueensGame();
  const knighttour = useKnightTourGame();
  const minesweeper = useMinesweeperGame();
  const game2048 = use2048Game();
  const sieve = useSieveGame();
  const babylonian = useBabylonianGame();
  const ricochet = useRicochetGame();
  const portal = usePortalGame();
  const chainblast = useChainBlastGame();
  const archer = useArcherGame();
  const wordscramble = useWordScrambleGame();
  const nonogram = useNonogramGame();
  const stroop = useStroopGame();
  const sequence = useSequenceGame();
  const binary = useBinaryGame();
  const roman = useRomanGame();
  const mentalmath = useMentalMathGame();
  const simon = useSimonGame();
  const reflex = useReflexGame();
  const typing = useTypingSpeedGame();
  const cipher = useCipherGame();
  const wordsearch = useWordSearchGame();
  const anagram = useAnagramGame();
  const wordle = useWordleGame();
  const mastermind = useMastermindGame();
  const maze = useMazeGame();
  const tictactoe = useTicTacToeGame();
  const balance = useBalanceGame();
  const piperotate = usePipeRotateGame();
  const floodfill = useFloodFillGame();
  const connect4 = useConnect4Game();
  const setgame = useSetGame();
  const oddoneout = useOddOneOutGame();
  const pathfinder = usePathfinderGame();
  const hangman = useHangmanGame();
  const emojimath = useEmojiMathGame();
  const flagquiz = useFlagQuizGame();
  const { dark, toggle: toggleDark } = useDarkMode();
  const daily = useDailyChallenge();
  const xp = useXPSystem();
  const achievements = useAchievements();
  const gameStats = useGameStats();

  const isPlaying = screen === "playing";
  const shiftActive = isPlaying && selectedPuzzle === "shift" && shift.game && !shift.game.won;
  const memoryActive = isPlaying && selectedPuzzle === "memory" && memory.game && !memory.game.won;
  const lightsoutActive = isPlaying && selectedPuzzle === "lightsout" && lightsout.game && !lightsout.game.won;
  const lightsinActive = isPlaying && selectedPuzzle === "lightsin" && lightsin.game && !lightsin.game.won;
  const mathActive = isPlaying && selectedPuzzle === "mathchain" && math.game && !math.game.finished;
  const hanoiActive = isPlaying && selectedPuzzle === "hanoi" && hanoi.game && !hanoi.game.won;
  const colorsortActive = isPlaying && selectedPuzzle === "colorsort" && colorsort.game && !colorsort.game.won;
  const sudokuActive = isPlaying && selectedPuzzle === "sudoku" && sudoku.game && !sudoku.game.won;
  const nqueensActive = isPlaying && selectedPuzzle === "nqueens" && nqueens.game && !nqueens.game.won;
  const knighttourActive = isPlaying && selectedPuzzle === "knighttour" && knighttour.game && !knighttour.game.won;
  const minesweeperActive = isPlaying && selectedPuzzle === "minesweeper" && minesweeper.game && !minesweeper.game.won && !minesweeper.game.lost;
  const game2048Active = isPlaying && selectedPuzzle === "2048" && game2048.game && !game2048.game.won && !game2048.game.lost;
  const sieveActive = isPlaying && selectedPuzzle === "sieve" && sieve.game && !sieve.game.won && !sieve.game.lost;
  const babylonianActive = isPlaying && selectedPuzzle === "babylonian" && babylonian.game && !babylonian.game.won;
  const ricochetActive = isPlaying && selectedPuzzle === "ricochet" && ricochet.game && !ricochet.game.won && !ricochet.game.lost;
  const portalActive = isPlaying && selectedPuzzle === "portal" && portal.game && !portal.game.won && !portal.game.lost;
  const chainblastActive = isPlaying && selectedPuzzle === "chainblast" && chainblast.game && !chainblast.game.won && !chainblast.game.lost;
  const archerActive = isPlaying && selectedPuzzle === "archer" && archer.game && !archer.game.won && !archer.game.lost;
  const wordscrambleActive = isPlaying && selectedPuzzle === "wordscramble" && wordscramble.game && !wordscramble.game.won && !wordscramble.game.lost;
  const nonogramActive = isPlaying && selectedPuzzle === "nonogram" && nonogram.game && !nonogram.game.won;
  const stroopActive = isPlaying && selectedPuzzle === "stroop" && stroop.game && !stroop.game.won;
  const sequenceActive = isPlaying && selectedPuzzle === "sequence" && sequence.game && !sequence.game.won;
  const binaryActive = isPlaying && selectedPuzzle === "binary" && binary.game && !binary.game.won;
  const romanActive = isPlaying && selectedPuzzle === "roman" && roman.game && !roman.game.won;
  const mentalmathActive = isPlaying && selectedPuzzle === "mentalmath" && mentalmath.game && !mentalmath.game.won;
  const simonActive = isPlaying && selectedPuzzle === "simon" && simon.game && !simon.game.won;
  const reflexActive = isPlaying && selectedPuzzle === "reflex" && reflex.game && !reflex.game.won && !reflex.game.lost;
  const typingActive = isPlaying && selectedPuzzle === "typing" && typing.game && !typing.game.won && !typing.game.lost;
  const cipherActive = isPlaying && selectedPuzzle === "cipher" && cipher.game && !cipher.game.won;
  const wordsearchActive = isPlaying && selectedPuzzle === "wordsearch" && wordsearch.game && !wordsearch.game.won;
  const anagramActive = isPlaying && selectedPuzzle === "anagram" && anagram.game && !anagram.game.won;
  const wordleActive = isPlaying && selectedPuzzle === "wordle" && wordle.game && !wordle.game.won && !wordle.game.lost;
  const mastermindActive = isPlaying && selectedPuzzle === "mastermind" && mastermind.game && !mastermind.game.won && !mastermind.game.lost;
  const mazeActive = isPlaying && selectedPuzzle === "maze" && maze.game && !maze.game.won;
  const tictactoeActive = isPlaying && selectedPuzzle === "tictactoe" && tictactoe.game && !tictactoe.game.won && !tictactoe.game.draw;
  const balanceActive = isPlaying && selectedPuzzle === "balance" && balance.game && !balance.game.won;
  const piperotateActive = isPlaying && selectedPuzzle === "piperotate" && piperotate.game && !piperotate.game.won;
  const floodfillActive = isPlaying && selectedPuzzle === "floodfill" && floodfill.game && !floodfill.game.won;
  const connect4Active = isPlaying && selectedPuzzle === "connect4" && connect4.game && !connect4.game.won && !connect4.game.draw;
  const setgameActive = isPlaying && selectedPuzzle === "setgame" && setgame.game && !setgame.game.won;
  const oddoneoutActive = isPlaying && selectedPuzzle === "oddoneout" && oddoneout.game && !oddoneout.game.won;
  const pathfinderActive = isPlaying && selectedPuzzle === "pathfinder" && pathfinder.game && !pathfinder.game.won && !pathfinder.game.lost;
  const hangmanActive = isPlaying && selectedPuzzle === "hangman" && hangman.game && !hangman.game.won && !hangman.game.lost;
  const emojimathActive = isPlaying && selectedPuzzle === "emojimath" && emojimath.game && !emojimath.game.won;
  const flagquizActive = isPlaying && selectedPuzzle === "flagquiz" && flagquiz.game && !flagquiz.game.won;
  const timerRunning = !!(shiftActive || memoryActive || lightsoutActive || lightsinActive || mathActive || hanoiActive || colorsortActive || sudokuActive || nqueensActive || knighttourActive || minesweeperActive || game2048Active || sieveActive || babylonianActive || ricochetActive || portalActive || chainblastActive || archerActive || wordscrambleActive || nonogramActive || stroopActive || sequenceActive || binaryActive || romanActive || mentalmathActive || simonActive || reflexActive || typingActive || cipherActive || wordsearchActive || anagramActive || wordleActive || mastermindActive || mazeActive || tictactoeActive || balanceActive || piperotateActive || floodfillActive || connect4Active || setgameActive || oddoneoutActive || pathfinderActive || hangmanActive || emojimathActive || flagquizActive);

  const { formatted: time } = useTimer(timerRunning);

  // Helper to get current win state
  const getWinInfo = (): { won: boolean; moves: number } | null => {
    if (!isPlaying) return null;
    if (selectedPuzzle === "shift" && shift.game?.won) return { won: true, moves: shift.game.moves };
    if (selectedPuzzle === "memory" && memory.game?.won) return { won: true, moves: memory.game.moves };
    if (selectedPuzzle === "lightsout" && lightsout.game?.won) return { won: true, moves: lightsout.game.moves };
    if (selectedPuzzle === "lightsin" && lightsin.game?.won) return { won: true, moves: lightsin.game.moves };
    if (selectedPuzzle === "pattern" && pattern.game?.phase === "won") return { won: true, moves: pattern.game.score };
    if (selectedPuzzle === "mathchain" && math.game?.finished && math.game.score === math.game.problems.length) return { won: true, moves: math.game.score };
    if (selectedPuzzle === "hanoi" && hanoi.game?.won) return { won: true, moves: hanoi.game.moves };
    if (selectedPuzzle === "colorsort" && colorsort.game?.won) return { won: true, moves: colorsort.game.moves };
    if (selectedPuzzle === "sudoku" && sudoku.game?.won) return { won: true, moves: sudoku.game.mistakes };
    if (selectedPuzzle === "nqueens" && nqueens.game?.won) return { won: true, moves: 0 };
    if (selectedPuzzle === "knighttour" && knighttour.game?.won) return { won: true, moves: knighttour.game.path.length };
    if (selectedPuzzle === "minesweeper" && minesweeper.game?.won) return { won: true, moves: minesweeper.game.moves };
    if (selectedPuzzle === "2048" && game2048.game?.won) return { won: true, moves: game2048.game.score };
    if (selectedPuzzle === "sieve" && sieve.game?.won) return { won: true, moves: sieve.game.moves };
    if (selectedPuzzle === "babylonian" && babylonian.game?.won) return { won: true, moves: babylonian.game.moves };
    if (selectedPuzzle === "ricochet" && ricochet.game?.won) return { won: true, moves: ricochet.game.moves };
    if (selectedPuzzle === "portal" && portal.game?.won) return { won: true, moves: portal.game.moves };
    if (selectedPuzzle === "chainblast" && chainblast.game?.won) return { won: true, moves: chainblast.game.moves };
    if (selectedPuzzle === "archer" && archer.game?.won) return { won: true, moves: archer.game.moves };
    if (selectedPuzzle === "wordscramble" && wordscramble.game?.won) return { won: true, moves: wordscramble.game.moves };
    if (selectedPuzzle === "nonogram" && nonogram.game?.won) return { won: true, moves: nonogram.game.moves };
    if (selectedPuzzle === "stroop" && stroop.game?.won) return { won: true, moves: stroop.game.score };
    if (selectedPuzzle === "sequence" && sequence.game?.won) return { won: true, moves: sequence.game.score };
    if (selectedPuzzle === "binary" && binary.game?.won) return { won: true, moves: binary.game.score };
    if (selectedPuzzle === "roman" && roman.game?.won) return { won: true, moves: roman.game.score };
    if (selectedPuzzle === "mentalmath" && mentalmath.game?.won) return { won: true, moves: mentalmath.game.score };
    if (selectedPuzzle === "simon" && simon.game?.won) return { won: true, moves: simon.game.round };
    if (selectedPuzzle === "reflex" && reflex.game?.won) return { won: true, moves: reflex.game.score };
    if (selectedPuzzle === "typing" && typing.game?.won) return { won: true, moves: typing.game.correct };
    if (selectedPuzzle === "cipher" && cipher.game?.won) return { won: true, moves: cipher.game.score };
    if (selectedPuzzle === "wordsearch" && wordsearch.game?.won) return { won: true, moves: wordsearch.game.moves };
    if (selectedPuzzle === "anagram" && anagram.game?.won) return { won: true, moves: anagram.game.score };
    if (selectedPuzzle === "wordle" && wordle.game?.won) return { won: true, moves: wordle.game.guesses.length };
    if (selectedPuzzle === "mastermind" && mastermind.game?.won) return { won: true, moves: mastermind.game.guesses.length };
    if (selectedPuzzle === "maze" && maze.game?.won) return { won: true, moves: maze.game.moves };
    if (selectedPuzzle === "tictactoe" && tictactoe.game?.won) return { won: true, moves: tictactoe.game.moves };
    if (selectedPuzzle === "balance" && balance.game?.won) return { won: true, moves: balance.game.score };
    if (selectedPuzzle === "piperotate" && piperotate.game?.won) return { won: true, moves: piperotate.game.moves };
    if (selectedPuzzle === "floodfill" && floodfill.game?.won) return { won: true, moves: floodfill.game.moves };
    if (selectedPuzzle === "connect4" && connect4.game?.won) return { won: true, moves: connect4.game.moves };
    if (selectedPuzzle === "setgame" && setgame.game?.won) return { won: true, moves: setgame.game.moves };
    if (selectedPuzzle === "oddoneout" && oddoneout.game?.won) return { won: true, moves: oddoneout.game.score };
    if (selectedPuzzle === "pathfinder" && pathfinder.game?.won) return { won: true, moves: pathfinder.game.moves };
    if (selectedPuzzle === "hangman" && hangman.game?.won) return { won: true, moves: hangman.game.moves };
    if (selectedPuzzle === "emojimath" && emojimath.game?.won) return { won: true, moves: emojimath.game.score };
    if (selectedPuzzle === "flagquiz" && flagquiz.game?.won) return { won: true, moves: flagquiz.game.score };
    return null;
  };

  // Award XP and check achievements on win
  useEffect(() => {
    if (!isPlaying) return;
    const winInfo = getWinInfo();
    if (!winInfo?.won) return;

    // Create a unique key for this win so we don't double-process it
    const winKey = `${selectedPuzzle}-${currentDifficulty}-${winInfo.moves}-${time}`;
    if (processedWins.current.has(winKey)) return;
    processedWins.current.add(winKey);

    const stars = getStars(currentDifficulty, winInfo.moves, time);
    const timeSeconds = gameStats.parseTime(time);
    const isSpeedWin = timeSeconds < 30;
    const timeBonus = isSpeedWin ? 10 : 0;

    // Award XP
    const gain = xp.awardXP(currentDifficulty, stars, timeBonus);
    setLastXPGain(gain);

    // Record game stats
    const updatedStats = gameStats.recordGame(selectedPuzzle, currentDifficulty, true, winInfo.moves, time, stars, isDaily);

    // Check achievements
    const ctx = {
      puzzle: selectedPuzzle,
      difficulty: currentDifficulty,
      moves: winInfo.moves,
      timeSeconds,
      stars,
      usedHint: usedHintInGame,
      wins: Object.fromEntries(
        Object.entries(updatedStats.puzzles).map(([k, v]) => [k, v?.won ?? 0])
      ),
      playedPuzzles: new Set(updatedStats.playedPuzzleTypes),
      level: gain.newLevel,
      dailyStreak: updatedStats.dailyStreak,
    };

    const newAchievements = achievements.checkAndUnlock(ctx);
    if (newAchievements.length > 0) {
      setPendingAchievements(prev => [...prev, ...newAchievements]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, selectedPuzzle, shift.game?.won, memory.game?.won, lightsout.game?.won, lightsin.game?.won,
      pattern.game?.phase, math.game?.finished, hanoi.game?.won, colorsort.game?.won,
      sudoku.game?.won, nqueens.game?.won, knighttour.game?.won, minesweeper.game?.won,
      game2048.game?.won, sieve.game?.won, babylonian.game?.won,
      ricochet.game?.won, portal.game?.won, chainblast.game?.won, archer.game?.won,
      wordscramble.game?.won, nonogram.game?.won, stroop.game?.won, sequence.game?.won,
      binary.game?.won, roman.game?.won, mentalmath.game?.won, simon.game?.won,
      reflex.game?.won, typing.game?.won, cipher.game?.won, wordsearch.game?.won,
      anagram.game?.won, wordle.game?.won, mastermind.game?.won, maze.game?.won,
      tictactoe.game?.won, balance.game?.won, piperotate.game?.won, floodfill.game?.won,
      connect4.game?.won, setgame.game?.won, oddoneout.game?.won, pathfinder.game?.won,
      hangman.game?.won, emojimath.game?.won, flagquiz.game?.won]);

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
    if (selectedPuzzle === "lightsin" && lightsin.game?.won) checkWin(true, lightsin.game.moves);
    if (selectedPuzzle === "pattern" && pattern.game?.phase === "won") checkWin(true, pattern.game.score);
    if (selectedPuzzle === "mathchain" && math.game?.finished && math.game.score === math.game.problems.length) checkWin(true, math.game.score);
    if (selectedPuzzle === "hanoi" && hanoi.game?.won) checkWin(true, hanoi.game.moves);
    if (selectedPuzzle === "colorsort" && colorsort.game?.won) checkWin(true, colorsort.game.moves);
    if (selectedPuzzle === "sudoku" && sudoku.game?.won) checkWin(true, sudoku.game.mistakes);
    if (selectedPuzzle === "nqueens" && nqueens.game?.won) checkWin(true, 0);
    if (selectedPuzzle === "knighttour" && knighttour.game?.won) checkWin(true, knighttour.game.path.length);
    if (selectedPuzzle === "minesweeper" && minesweeper.game?.won) checkWin(true, minesweeper.game.moves);
    if (selectedPuzzle === "2048" && game2048.game?.won) checkWin(true, game2048.game.score);
    if (selectedPuzzle === "sieve" && sieve.game?.won) checkWin(true, sieve.game.moves);
    if (selectedPuzzle === "babylonian" && babylonian.game?.won) checkWin(true, babylonian.game.moves);
    if (selectedPuzzle === "ricochet" && ricochet.game?.won) checkWin(true, ricochet.game.moves);
    if (selectedPuzzle === "portal" && portal.game?.won) checkWin(true, portal.game.moves);
    if (selectedPuzzle === "chainblast" && chainblast.game?.won) checkWin(true, chainblast.game.moves);
    if (selectedPuzzle === "archer" && archer.game?.won) checkWin(true, archer.game.moves);
    if (selectedPuzzle === "wordscramble" && wordscramble.game?.won) checkWin(true, wordscramble.game.moves);
    if (selectedPuzzle === "nonogram" && nonogram.game?.won) checkWin(true, nonogram.game.moves);
    if (selectedPuzzle === "stroop" && stroop.game?.won) checkWin(true, stroop.game.score);
    if (selectedPuzzle === "sequence" && sequence.game?.won) checkWin(true, sequence.game.score);
    if (selectedPuzzle === "binary" && binary.game?.won) checkWin(true, binary.game.score);
    if (selectedPuzzle === "roman" && roman.game?.won) checkWin(true, roman.game.score);
    if (selectedPuzzle === "mentalmath" && mentalmath.game?.won) checkWin(true, mentalmath.game.score);
    if (selectedPuzzle === "simon" && simon.game?.won) checkWin(true, simon.game.round);
    if (selectedPuzzle === "reflex" && reflex.game?.won) checkWin(true, reflex.game.score);
    if (selectedPuzzle === "typing" && typing.game?.won) checkWin(true, typing.game.correct);
    if (selectedPuzzle === "cipher" && cipher.game?.won) checkWin(true, cipher.game.score);
    if (selectedPuzzle === "wordsearch" && wordsearch.game?.won) checkWin(true, wordsearch.game.moves);
    if (selectedPuzzle === "anagram" && anagram.game?.won) checkWin(true, anagram.game.score);
    if (selectedPuzzle === "wordle" && wordle.game?.won) checkWin(true, wordle.game.guesses.length);
    if (selectedPuzzle === "mastermind" && mastermind.game?.won) checkWin(true, mastermind.game.guesses.length);
    if (selectedPuzzle === "maze" && maze.game?.won) checkWin(true, maze.game.moves);
    if (selectedPuzzle === "tictactoe" && tictactoe.game?.won) checkWin(true, tictactoe.game.moves);
    if (selectedPuzzle === "balance" && balance.game?.won) checkWin(true, balance.game.score);
    if (selectedPuzzle === "piperotate" && piperotate.game?.won) checkWin(true, piperotate.game.moves);
    if (selectedPuzzle === "floodfill" && floodfill.game?.won) checkWin(true, floodfill.game.moves);
    if (selectedPuzzle === "connect4" && connect4.game?.won) checkWin(true, connect4.game.moves);
    if (selectedPuzzle === "setgame" && setgame.game?.won) checkWin(true, setgame.game.moves);
    if (selectedPuzzle === "oddoneout" && oddoneout.game?.won) checkWin(true, oddoneout.game.score);
    if (selectedPuzzle === "pathfinder" && pathfinder.game?.won) checkWin(true, pathfinder.game.moves);
    if (selectedPuzzle === "hangman" && hangman.game?.won) checkWin(true, hangman.game.moves);
    if (selectedPuzzle === "emojimath" && emojimath.game?.won) checkWin(true, emojimath.game.score);
    if (selectedPuzzle === "flagquiz" && flagquiz.game?.won) checkWin(true, flagquiz.game.score);
  }, [isDaily, isPlaying, selectedPuzzle, shift.game, memory.game, lightsout.game, lightsin.game, pattern.game, math.game, hanoi.game, colorsort.game, sudoku.game, nqueens.game, knighttour.game, minesweeper.game, game2048.game, sieve.game, babylonian.game, ricochet.game, portal.game, chainblast.game, archer.game, wordscramble.game, nonogram.game, stroop.game, sequence.game, binary.game, roman.game, mentalmath.game, simon.game, reflex.game, typing.game, cipher.game, wordsearch.game, anagram.game, wordle.game, mastermind.game, maze.game, tictactoe.game, balance.game, piperotate.game, floodfill.game, connect4.game, setgame.game, oddoneout.game, pathfinder.game, hangman.game, emojimath.game, flagquiz.game]);

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
    shift.goToMenu(); memory.goToMenu(); lightsout.goToMenu(); lightsin.goToMenu();
    pattern.goToMenu(); math.goToMenu(); hanoi.goToMenu(); colorsort.goToMenu();
    sudoku.goToMenu(); nqueens.goToMenu(); knighttour.goToMenu();
    minesweeper.goToMenu(); game2048.goToMenu();
    sieve.goToMenu(); babylonian.goToMenu();
    ricochet.goToMenu(); portal.goToMenu();
    chainblast.goToMenu(); archer.goToMenu();
    wordscramble.goToMenu(); nonogram.goToMenu();
    stroop.goToMenu(); sequence.goToMenu();
    binary.goToMenu(); roman.goToMenu(); mentalmath.goToMenu();
    simon.goToMenu(); reflex.goToMenu(); typing.goToMenu();
    cipher.goToMenu(); wordsearch.goToMenu(); anagram.goToMenu();
    wordle.goToMenu(); mastermind.goToMenu(); maze.goToMenu();
    tictactoe.goToMenu(); balance.goToMenu(); piperotate.goToMenu();
    floodfill.goToMenu(); connect4.goToMenu(); setgame.goToMenu();
    oddoneout.goToMenu(); pathfinder.goToMenu();
    hangman.goToMenu(); emojimath.goToMenu(); flagquiz.goToMenu();
  };

  const handleDailyChallenge = (type: PuzzleType) => {
    setSelectedPuzzle(type);
    setIsDaily(true);
    setShowDailyWin(false);
    setDailyWinData(null);
    setLastXPGain(null);
    setUsedHintInGame(false);
    processedWins.current.clear();
    const difficulty: Difficulty = "hard";
    setCurrentDifficulty(difficulty);
    const dailyRandom = daily.getDailyRandom(type);
    switch (type) {
      case "shift": shift.startGame(difficulty, dailyRandom); break;
      case "memory": memory.startGame(difficulty, dailyRandom); break;
      case "lightsout": lightsout.startGame(difficulty, dailyRandom); break;
      case "lightsin": lightsin.startGame(difficulty, dailyRandom); break;
      case "pattern": pattern.startGame(difficulty, dailyRandom); break;
      case "mathchain": math.startGame(difficulty, dailyRandom); break;
      case "hanoi": hanoi.startGame(difficulty); break;
      case "colorsort": colorsort.startGame(difficulty, dailyRandom); break;
      case "sudoku": sudoku.startGame(difficulty, dailyRandom); break;
      case "nqueens": nqueens.startGame(difficulty); break;
      case "knighttour": knighttour.startGame(difficulty); break;
      case "minesweeper": minesweeper.startGame(difficulty, dailyRandom); break;
      case "2048": game2048.startGame(difficulty, dailyRandom); break;
      case "sieve": sieve.startGame(difficulty, dailyRandom); break;
      case "babylonian": babylonian.startGame(difficulty, dailyRandom); break;
      case "ricochet": ricochet.startGame(difficulty, dailyRandom); break;
      case "portal": portal.startGame(difficulty, dailyRandom); break;
      case "chainblast": chainblast.startGame(difficulty, dailyRandom); break;
      case "archer": archer.startGame(difficulty, dailyRandom); break;
      case "wordscramble": wordscramble.startGame(difficulty, dailyRandom); break;
      case "nonogram": nonogram.startGame(difficulty, dailyRandom); break;
      case "stroop": stroop.startGame(difficulty, dailyRandom); break;
      case "sequence": sequence.startGame(difficulty, dailyRandom); break;
      case "binary": binary.startGame(difficulty, dailyRandom); break;
      case "roman": roman.startGame(difficulty, dailyRandom); break;
      case "mentalmath": mentalmath.startGame(difficulty, dailyRandom); break;
      case "simon": simon.startGame(difficulty, dailyRandom); break;
      case "reflex": reflex.startGame(difficulty, dailyRandom); break;
      case "typing": typing.startGame(difficulty, dailyRandom); break;
      case "cipher": cipher.startGame(difficulty, dailyRandom); break;
      case "wordsearch": wordsearch.startGame(difficulty, dailyRandom); break;
      case "anagram": anagram.startGame(difficulty, dailyRandom); break;
      case "wordle": wordle.startGame(difficulty, dailyRandom); break;
      case "mastermind": mastermind.startGame(difficulty, dailyRandom); break;
      case "maze": maze.startGame(difficulty, dailyRandom); break;
      case "tictactoe": tictactoe.startGame(difficulty); break;
      case "balance": balance.startGame(difficulty, dailyRandom); break;
      case "piperotate": piperotate.startGame(difficulty, dailyRandom); break;
      case "floodfill": floodfill.startGame(difficulty, dailyRandom); break;
      case "connect4": connect4.startGame(difficulty); break;
      case "setgame": setgame.startGame(difficulty, dailyRandom); break;
      case "oddoneout": oddoneout.startGame(difficulty, dailyRandom); break;
      case "pathfinder": pathfinder.startGame(difficulty, dailyRandom); break;
      case "hangman": hangman.startGame(difficulty, dailyRandom); break;
      case "emojimath": emojimath.startGame(difficulty, dailyRandom); break;
      case "flagquiz": flagquiz.startGame(difficulty, dailyRandom); break;
    }
    setScreen("playing");
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setCurrentDifficulty(difficulty);
    setLastXPGain(null);
    setUsedHintInGame(false);
    processedWins.current.clear();
    switch (selectedPuzzle) {
      case "shift": shift.startGame(difficulty); break;
      case "memory": memory.startGame(difficulty); break;
      case "lightsout": lightsout.startGame(difficulty); break;
      case "lightsin": lightsin.startGame(difficulty); break;
      case "pattern": pattern.startGame(difficulty); break;
      case "mathchain": math.startGame(difficulty); break;
      case "hanoi": hanoi.startGame(difficulty); break;
      case "colorsort": colorsort.startGame(difficulty); break;
      case "sudoku": sudoku.startGame(difficulty); break;
      case "nqueens": nqueens.startGame(difficulty); break;
      case "knighttour": knighttour.startGame(difficulty); break;
      case "minesweeper": minesweeper.startGame(difficulty); break;
      case "2048": game2048.startGame(difficulty); break;
      case "sieve": sieve.startGame(difficulty); break;
      case "babylonian": babylonian.startGame(difficulty); break;
      case "ricochet": ricochet.startGame(difficulty); break;
      case "portal": portal.startGame(difficulty); break;
      case "chainblast": chainblast.startGame(difficulty); break;
      case "archer": archer.startGame(difficulty); break;
      case "wordscramble": wordscramble.startGame(difficulty); break;
      case "nonogram": nonogram.startGame(difficulty); break;
      case "stroop": stroop.startGame(difficulty); break;
      case "sequence": sequence.startGame(difficulty); break;
      case "binary": binary.startGame(difficulty); break;
      case "roman": roman.startGame(difficulty); break;
      case "mentalmath": mentalmath.startGame(difficulty); break;
      case "simon": simon.startGame(difficulty); break;
      case "reflex": reflex.startGame(difficulty); break;
      case "typing": typing.startGame(difficulty); break;
      case "cipher": cipher.startGame(difficulty); break;
      case "wordsearch": wordsearch.startGame(difficulty); break;
      case "anagram": anagram.startGame(difficulty); break;
      case "wordle": wordle.startGame(difficulty); break;
      case "mastermind": mastermind.startGame(difficulty); break;
      case "maze": maze.startGame(difficulty); break;
      case "tictactoe": tictactoe.startGame(difficulty); break;
      case "balance": balance.startGame(difficulty); break;
      case "piperotate": piperotate.startGame(difficulty); break;
      case "floodfill": floodfill.startGame(difficulty); break;
      case "connect4": connect4.startGame(difficulty); break;
      case "setgame": setgame.startGame(difficulty); break;
      case "oddoneout": oddoneout.startGame(difficulty); break;
      case "pathfinder": pathfinder.startGame(difficulty); break;
      case "hangman": hangman.startGame(difficulty); break;
      case "emojimath": emojimath.startGame(difficulty); break;
      case "flagquiz": flagquiz.startGame(difficulty); break;
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
          <GameScreen
            game={shift.game} time={time} difficultyLabel={isDaily ? "Daily" : shift.difficultyLabel}
            onMoveTile={shift.moveTile} onHint={shift.showHint} onUndo={shift.undo} onPeek={shift.peek}
            onRestart={isDaily ? dailyRestart : shift.restart}
            onMenu={menuAction} dark={dark} onToggleDark={toggleDark}
          />
        );
      case "memory":
        return memory.game && (
          <MemoryGameScreen
            game={memory.game} time={time} onFlip={memory.flipCard}
            onHint={memory.hint} onUndo={memory.undo} onPeek={memory.peek}
            onRestart={isDaily ? dailyRestart : memory.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "lightsout":
        return lightsout.game && (
          <LightsOutGameScreen
            game={lightsout.game} time={time} onToggleCell={lightsout.toggleCell}
            onHint={lightsout.hint} onUndo={lightsout.undo} onPeek={lightsout.peek}
            onRestart={isDaily ? dailyRestart : lightsout.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "lightsin":
        return lightsin.game && (
          <LightsInGameScreen
            game={lightsin.game} time={time} onToggleCell={lightsin.toggleCell}
            onHint={lightsin.hint} onUndo={lightsin.undo} onPeek={lightsin.peek}
            onRestart={isDaily ? dailyRestart : lightsin.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "pattern":
        return pattern.game && (
          <PatternRecallGameScreen
            game={pattern.game} onTap={pattern.tapCell} onNextRound={pattern.nextRound}
            onHint={pattern.hint} onUndo={pattern.undo} onPeek={pattern.peek}
            onRestart={isDaily ? dailyRestart : pattern.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "mathchain":
        return math.game && (
          <MathChainGameScreen
            game={math.game} time={time} onAnswer={math.selectAnswer}
            onHint={math.hint} onPeek={math.peek}
            onRestart={isDaily ? dailyRestart : math.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "hanoi":
        return hanoi.game && (
          <HanoiGameScreen
            game={hanoi.game} time={time} onSelectPeg={hanoi.selectPeg}
            onHint={hanoi.hint} onUndo={hanoi.undo} onPeek={hanoi.peek}
            onRestart={isDaily ? dailyRestart : hanoi.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "colorsort":
        return colorsort.game && (
          <ColorSortGameScreen
            game={colorsort.game} time={time} onSelectTube={colorsort.selectTube}
            onHint={colorsort.hint} onUndo={colorsort.undo} onPeek={colorsort.peek}
            onRestart={isDaily ? dailyRestart : colorsort.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "sudoku":
        return sudoku.game && (
          <SudokuGameScreen
            game={sudoku.game} time={time} onSelectCell={sudoku.selectCell}
            onEnterNumber={sudoku.enterNumber} onClear={sudoku.clearCell}
            onHint={sudoku.hint} onUndo={sudoku.undo} onPeek={sudoku.peek}
            onRestart={isDaily ? dailyRestart : sudoku.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "nqueens":
        return nqueens.game && (
          <NQueensGameScreen
            game={nqueens.game} time={time} onToggleQueen={nqueens.toggleQueen}
            onHint={nqueens.hint} onUndo={nqueens.undo} onPeek={nqueens.peek}
            onRestart={isDaily ? dailyRestart : nqueens.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "knighttour":
        return knighttour.game && (
          <KnightTourGameScreen
            game={knighttour.game} time={time} onSelectCell={knighttour.selectCell}
            onHint={knighttour.hint} onUndo={knighttour.undo} onPeek={knighttour.peek}
            onRestart={isDaily ? dailyRestart : knighttour.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "minesweeper":
        return minesweeper.game && (
          <MinesweeperGameScreen
            game={minesweeper.game} time={time}
            onReveal={minesweeper.revealCell} onFlag={minesweeper.toggleFlag}
            onHint={minesweeper.hint} onUndo={minesweeper.undo} onPeek={minesweeper.peek}
            onRestart={isDaily ? dailyRestart : minesweeper.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "2048":
        return game2048.game && (
          <Game2048Screen
            game={game2048.game} time={time} onSlide={game2048.slide}
            onHint={game2048.hint} onUndo={game2048.undo} onPeek={game2048.peek}
            onRestart={isDaily ? dailyRestart : game2048.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "sieve":
        return sieve.game && (
          <SieveGameScreen
            game={sieve.game} time={time} onToggleMark={sieve.toggleMark}
            onSubmitRound={sieve.submitRound} onNextRound={sieve.nextRound}
            onHint={sieve.showHint} onUndo={sieve.undo} onPeek={sieve.peek}
            onRestart={isDaily ? dailyRestart : sieve.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "babylonian":
        return babylonian.game && (
          <BabylonianGameScreen
            game={babylonian.game} time={time}
            onSetGuess={babylonian.setCurrentGuess} onSubmit={babylonian.submitGuess}
            onHint={babylonian.showHint} onUndo={babylonian.undo} onPeek={babylonian.peek}
            onRestart={isDaily ? dailyRestart : babylonian.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "ricochet":
        return ricochet.game && (
          <RicochetGameScreen
            game={ricochet.game} time={time} onMove={ricochet.move}
            onHint={ricochet.hint} onUndo={ricochet.undo} onPeek={ricochet.peek}
            onRestart={isDaily ? dailyRestart : ricochet.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "portal":
        return portal.game && (
          <PortalGameScreen
            game={portal.game} time={time} onMove={portal.move}
            onHint={portal.hint} onUndo={portal.undo} onPeek={portal.peek}
            onRestart={isDaily ? dailyRestart : portal.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "chainblast":
        return chainblast.game && (
          <ChainBlastGameScreen
            game={chainblast.game} time={time}
            onPlaceBomb={chainblast.placeBomb} onDetonate={chainblast.detonateAll}
            onHint={chainblast.hint} onUndo={chainblast.undo} onPeek={chainblast.peek}
            onRestart={isDaily ? dailyRestart : chainblast.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "archer":
        return archer.game && (
          <ArcherGameScreen
            game={archer.game} time={time}
            onShoot={archer.shoot} onMoveArcher={archer.moveArcher}
            onHint={archer.hint} onUndo={archer.undo} onPeek={archer.peek}
            onRestart={isDaily ? dailyRestart : archer.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "wordscramble":
        return wordscramble.game && (
          <WordScrambleGameScreen
            game={wordscramble.game} time={time}
            onPlaceLetter={wordscramble.placeLetter}
            onRemoveLast={wordscramble.removeLast}
            onRetryRound={wordscramble.retryRound}
            onHint={wordscramble.hint} onUndo={wordscramble.undo} onPeek={wordscramble.peek}
            onRestart={isDaily ? dailyRestart : wordscramble.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
            xpGain={lastXPGain}
          />
        );
      case "nonogram":
        return nonogram.game && (
          <NonogramGameScreen
            game={nonogram.game} time={time}
            onToggleCell={nonogram.toggleCell}
            onHint={nonogram.hint} onUndo={nonogram.undo} onPeek={nonogram.peek}
            onRestart={isDaily ? dailyRestart : nonogram.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
            xpGain={lastXPGain}
          />
        );
      case "stroop":
        return stroop.game && (
          <StroopGameScreen
            game={stroop.game} time={time}
            onAnswer={stroop.selectAnswer}
            onHint={stroop.hint} onPeek={stroop.peek}
            onRestart={isDaily ? dailyRestart : stroop.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "sequence":
        return sequence.game && (
          <SequenceGameScreen
            game={sequence.game} time={time}
            onAnswer={sequence.selectAnswer}
            onHint={sequence.hint} onPeek={sequence.peek} onUndo={sequence.undo}
            onRestart={isDaily ? dailyRestart : sequence.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "binary":
        return binary.game && (
          <BinaryGameScreen
            game={binary.game} time={time}
            onAnswer={binary.selectAnswer}
            onHint={binary.hint} onPeek={binary.peek} onUndo={binary.undo}
            onRestart={isDaily ? dailyRestart : binary.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "roman":
        return roman.game && (
          <RomanGameScreen
            game={roman.game} time={time}
            onAnswer={roman.selectAnswer}
            onHint={roman.hint} onPeek={roman.peek} onUndo={roman.undo}
            onRestart={isDaily ? dailyRestart : roman.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "mentalmath":
        return mentalmath.game && (
          <MentalMathGameScreen
            game={mentalmath.game} time={time}
            onAnswer={mentalmath.selectAnswer}
            onHint={mentalmath.hint} onPeek={mentalmath.peek} onUndo={mentalmath.undo}
            onRestart={isDaily ? dailyRestart : mentalmath.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "simon":
        return simon.game && (
          <SimonGameScreen
            game={simon.game} time={time}
            onPressColor={simon.pressColor}
            onAdvanceShow={simon.advanceShowIndex}
            onHint={simon.hint} onPeek={simon.peek} onUndo={simon.undo}
            onRestart={isDaily ? dailyRestart : simon.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "reflex":
        return reflex.game && (
          <ReflexGameScreen
            game={reflex.game} time={time}
            onClickTarget={reflex.clickTarget}
            onMissTarget={reflex.missTarget}
            onHint={reflex.hint} onPeek={reflex.peek}
            onRestart={isDaily ? dailyRestart : reflex.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "typing":
        return typing.game && (
          <TypingSpeedGameScreen
            game={typing.game} time={time}
            onSetInput={typing.setInput}
            onSubmitWord={typing.submitWord}
            onTimeOut={typing.timeOut}
            onHint={typing.hint} onPeek={typing.peek} onUndo={typing.undo}
            onRestart={isDaily ? dailyRestart : typing.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "cipher":
        return cipher.game && (
          <CipherGameScreen
            game={cipher.game} time={time}
            onAnswer={cipher.selectAnswer}
            onHint={cipher.hint} onPeek={cipher.peek} onUndo={cipher.undo}
            onRestart={isDaily ? dailyRestart : cipher.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "wordsearch":
        return wordsearch.game && (
          <WordSearchGameScreen
            game={wordsearch.game} time={time}
            onSelectCell={wordsearch.selectCell}
            onHint={wordsearch.hint} onPeek={wordsearch.peek} onUndo={wordsearch.undo}
            onRestart={isDaily ? dailyRestart : wordsearch.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "anagram":
        return anagram.game && (
          <AnagramGameScreen
            game={anagram.game} time={time}
            onAnswer={anagram.selectAnswer}
            onHint={anagram.hint} onPeek={anagram.peek} onUndo={anagram.undo}
            onRestart={isDaily ? dailyRestart : anagram.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "wordle":
        return wordle.game && (
          <WordleGameScreen
            game={wordle.game} time={time}
            onTypeChar={wordle.typeChar}
            onDeleteLast={wordle.deleteLast}
            onSubmitGuess={wordle.submitGuess}
            onHint={wordle.hint} onPeek={wordle.peek}
            onRestart={isDaily ? dailyRestart : wordle.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "mastermind":
        return mastermind.game && (
          <MastermindGameScreen
            game={mastermind.game} time={time}
            onSetPeg={mastermind.setPeg}
            onSubmitGuess={mastermind.submitGuess}
            onHint={mastermind.hint} onPeek={mastermind.peek} onUndo={mastermind.undo}
            onRestart={isDaily ? dailyRestart : mastermind.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "maze":
        return maze.game && (
          <MazeGameScreen
            game={maze.game} time={time}
            onMove={maze.move}
            onHint={maze.hint} onPeek={maze.peek} onUndo={maze.undo}
            onRestart={isDaily ? dailyRestart : maze.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "tictactoe":
        return tictactoe.game && (
          <TicTacToeGameScreen
            game={tictactoe.game} time={time}
            onPlaceMark={tictactoe.placeMark}
            onHint={tictactoe.hint} onPeek={tictactoe.peek}
            onRestart={isDaily ? dailyRestart : tictactoe.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "balance":
        return balance.game && (
          <BalanceGameScreen
            game={balance.game} time={time}
            onAnswer={balance.selectAnswer}
            onHint={balance.hint} onPeek={balance.peek} onUndo={balance.undo}
            onRestart={isDaily ? dailyRestart : balance.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "piperotate":
        return piperotate.game && (
          <PipeRotateGameScreen
            game={piperotate.game} time={time}
            onRotateTile={piperotate.rotateTileAt}
            onHint={piperotate.hint} onPeek={piperotate.peek} onUndo={piperotate.undo}
            onRestart={isDaily ? dailyRestart : piperotate.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "floodfill":
        return floodfill.game && (
          <FloodFillGameScreen
            game={floodfill.game} time={time}
            onFill={floodfill.fill}
            onHint={floodfill.hint} onPeek={floodfill.peek}
            onRestart={isDaily ? dailyRestart : floodfill.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "connect4":
        return connect4.game && (
          <Connect4GameScreen
            game={connect4.game} time={time}
            onDrop={connect4.dropInColumn}
            onHint={connect4.hint} onPeek={connect4.peek}
            onRestart={isDaily ? dailyRestart : connect4.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "setgame":
        return setgame.game && (
          <SetGameScreen
            game={setgame.game} time={time}
            onToggleCard={setgame.toggleCard}
            onHint={setgame.hint} onPeek={setgame.peek}
            onRestart={isDaily ? dailyRestart : setgame.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "oddoneout":
        return oddoneout.game && (
          <OddOneOutGameScreen
            game={oddoneout.game} time={time}
            onAnswer={oddoneout.selectAnswer}
            onHint={oddoneout.hint} onPeek={oddoneout.peek} onUndo={oddoneout.undo}
            onRestart={isDaily ? dailyRestart : oddoneout.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "pathfinder":
        return pathfinder.game && (
          <PathfinderGameScreen
            game={pathfinder.game} time={time}
            onFlipArrow={pathfinder.flipArrow}
            onHint={pathfinder.hint} onPeek={pathfinder.peek} onUndo={pathfinder.undo}
            onRestart={isDaily ? dailyRestart : pathfinder.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "hangman":
        return hangman.game && (
          <HangmanGameScreen
            game={hangman.game} time={time}
            onGuessLetter={hangman.guessLetter}
            onHint={hangman.hint} onPeek={hangman.peek} onUndo={hangman.undo}
            onRestart={isDaily ? dailyRestart : hangman.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "emojimath":
        return emojimath.game && (
          <EmojiMathGameScreen
            game={emojimath.game} time={time}
            onAnswer={emojimath.selectAnswer}
            onHint={emojimath.hint} onPeek={emojimath.peek} onUndo={emojimath.undo}
            onRestart={isDaily ? dailyRestart : emojimath.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
      case "flagquiz":
        return flagquiz.game && (
          <FlagQuizGameScreen
            game={flagquiz.game} time={time}
            onAnswer={flagquiz.selectAnswer}
            onHint={flagquiz.hint} onPeek={flagquiz.peek} onUndo={flagquiz.undo}
            onRestart={isDaily ? dailyRestart : flagquiz.restart} onMenu={menuAction}
            dark={dark} onToggleDark={toggleDark}
          />
        );
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <AnimatePresence mode="wait">
          {screen === "puzzleSelect" && (
            <motion.div key="puzzles" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition} className="max-w-7xl mx-auto">
              <PuzzleSelector
                onSelect={handlePuzzleSelect}
                onDailyChallenge={handleDailyChallenge}
                onOpenStats={() => setShowStats(true)}
                dark={dark} onToggleDark={toggleDark}
                rewards={daily.rewards}
                isDailyDone={daily.isDailyDone}
                xpState={xp.xpState}
                unlockedAchievements={achievements.unlockedCount}
              />
            </motion.div>
          )}
          {screen === "difficultySelect" && (
            <motion.div key="difficulty" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition} className="max-w-2xl mx-auto">
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
            <motion.div key="game" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition} className="max-w-2xl mx-auto">
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

        {/* Stats / Achievements modal */}
        {showStats && (
          <StatsModal
            unlocked={achievements.unlocked}
            stats={gameStats.stats}
            xpState={xp.xpState}
            onClose={() => setShowStats(false)}
          />
        )}

        {/* Achievement toast notifications */}
        <AchievementToast
          achievements={pendingAchievements}
          onDismiss={() => setPendingAchievements([])}
        />
      </div>
    </div>
  );
};

export default Index;

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
import { useMinesweeperGame } from "@/hooks/useMinesweeperGame";
import { use2048Game } from "@/hooks/use2048Game";
import { useSieveGame } from "@/hooks/useSieveGame";
import { useBabylonianGame } from "@/hooks/useBabylonianGame";
import { useRicochetGame } from "@/hooks/useRicochetGame";
import { usePortalGame } from "@/hooks/usePortalGame";
import { useChainBlastGame } from "@/hooks/useChainBlastGame";
import { useArcherGame } from "@/hooks/useArcherGame";
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
  minesweeper: "Minesweeper",
  "2048": "2048",
  sieve: "Number Theory Challenge",
  babylonian: "Babylonian Method",
  ricochet: "Ricochet",
  portal: "Portal Maze",
  chainblast: "Chain Blast",
  archer: "Archer",
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
  const { dark, toggle: toggleDark } = useDarkMode();
  const daily = useDailyChallenge();
  const xp = useXPSystem();
  const achievements = useAchievements();
  const gameStats = useGameStats();

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
  const minesweeperActive = isPlaying && selectedPuzzle === "minesweeper" && minesweeper.game && !minesweeper.game.won && !minesweeper.game.lost;
  const game2048Active = isPlaying && selectedPuzzle === "2048" && game2048.game && !game2048.game.won && !game2048.game.lost;
  const sieveActive = isPlaying && selectedPuzzle === "sieve" && sieve.game && !sieve.game.won && !sieve.game.lost;
  const babylonianActive = isPlaying && selectedPuzzle === "babylonian" && babylonian.game && !babylonian.game.won;
  const timerRunning = !!(shiftActive || memoryActive || lightsoutActive || mathActive || hanoiActive || colorsortActive || sudokuActive || nqueensActive || knighttourActive || minesweeperActive || game2048Active || sieveActive || babylonianActive);

  const { formatted: time } = useTimer(timerRunning);

  // Helper to get current win state
  const getWinInfo = (): { won: boolean; moves: number } | null => {
    if (!isPlaying) return null;
    if (selectedPuzzle === "shift" && shift.game?.won) return { won: true, moves: shift.game.moves };
    if (selectedPuzzle === "memory" && memory.game?.won) return { won: true, moves: memory.game.moves };
    if (selectedPuzzle === "lightsout" && lightsout.game?.won) return { won: true, moves: lightsout.game.moves };
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
  }, [isPlaying, selectedPuzzle, shift.game?.won, memory.game?.won, lightsout.game?.won,
      pattern.game?.phase, math.game?.finished, hanoi.game?.won, colorsort.game?.won,
      sudoku.game?.won, nqueens.game?.won, knighttour.game?.won, minesweeper.game?.won,
      game2048.game?.won, sieve.game?.won, babylonian.game?.won]);

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
    if (selectedPuzzle === "minesweeper" && minesweeper.game?.won) checkWin(true, minesweeper.game.moves);
    if (selectedPuzzle === "2048" && game2048.game?.won) checkWin(true, game2048.game.score);
    if (selectedPuzzle === "sieve" && sieve.game?.won) checkWin(true, sieve.game.moves);
    if (selectedPuzzle === "babylonian" && babylonian.game?.won) checkWin(true, babylonian.game.moves);
  }, [isDaily, isPlaying, selectedPuzzle, shift.game, memory.game, lightsout.game, pattern.game, math.game, hanoi.game, colorsort.game, sudoku.game, nqueens.game, knighttour.game, minesweeper.game, game2048.game, sieve.game, babylonian.game]);

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
    minesweeper.goToMenu(); game2048.goToMenu();
    sieve.goToMenu(); babylonian.goToMenu();
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
    }
  };

  return (
    <div className="flex min-h-svh items-start sm:items-center justify-center bg-background">
      <div className="w-full max-w-[440px] sm:max-w-lg px-4 sm:px-6 py-4 sm:py-0">
        <AnimatePresence mode="wait">
          {screen === "puzzleSelect" && (
            <motion.div key="puzzles" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
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

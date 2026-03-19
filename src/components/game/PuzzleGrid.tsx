import { motion } from "framer-motion";

interface PuzzleGridProps {
  tiles: (number | null)[];
  gridSize: number;
  hintTile: number | null;
  onTileClick: (index: number) => void;
  moveLimit?: number | null;
  moves?: number;
}

const TILE_COLORS = [
  "bg-tile-1",
  "bg-tile-2",
  "bg-tile-3",
  "bg-tile-4",
  "bg-tile-5",
  "bg-tile-6",
  "bg-tile-7",
  "bg-tile-8",
];

const PuzzleGrid = ({ tiles, gridSize, hintTile, onTileClick }: PuzzleGridProps) => {
  const gap = "var(--gap)";

  return (
    <div
      className="bg-grid border-2 border-grid-border rounded-[var(--radius-outer)] shadow-[inset_0_2px_6px_rgba(100,60,180,0.08)] aspect-square"
      style={{
        padding: gap,
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap,
      }}
    >
      {tiles.map((value, index) => {
        const isEmpty = value === null;
        const isHint = hintTile === index;
        const colorClass = value ? TILE_COLORS[(value - 1) % TILE_COLORS.length] : "";

        return (
          <motion.div
            key={value ?? "empty"}
            layout
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={() => !isEmpty && onTileClick(index)}
            whileHover={!isEmpty ? { scale: 1.05, y: -2 } : undefined}
            whileTap={!isEmpty ? { scale: 0.92 } : undefined}
            className={`
              flex items-center justify-center rounded-[var(--radius-inner)] font-bold select-none
              ${isEmpty
                ? "bg-transparent shadow-none cursor-default border-transparent"
                : `${colorClass} text-white shadow-[var(--tile-shadow)] cursor-pointer
                   border border-white/15`
              }
              ${isHint ? "ring-2 ring-accent ring-offset-2 ring-offset-grid shadow-[var(--tile-glow)]" : ""}
              transition-shadow duration-200
            `}
            style={{
              fontSize: gridSize <= 3 ? "1.5rem" : gridSize <= 4 ? "1.25rem" : gridSize <= 5 ? "1rem" : "0.85rem",
            }}
          >
            {value}
          </motion.div>
        );
      })}
    </div>
  );
};

export default PuzzleGrid;

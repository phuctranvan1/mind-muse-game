import { motion } from "framer-motion";

interface PuzzleGridProps {
  tiles: (number | null)[];
  gridSize: number;
  hintTile: number | null;
  onTileClick: (index: number) => void;
}

const TILE_COLORS = [
  "bg-tile-1",
  "bg-tile-2",
  "bg-tile-3",
  "bg-tile-4",
  "bg-tile-5",
  "bg-tile-6",
];

const PuzzleGrid = ({ tiles, gridSize, hintTile, onTileClick }: PuzzleGridProps) => {
  const gap = "var(--gap)";

  return (
    <div
      className="bg-grid rounded-[var(--radius-outer)] shadow-[inset_0_2px_6px_rgba(100,60,180,0.08)] aspect-square"
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
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => !isEmpty && onTileClick(index)}
            className={`
              flex items-center justify-center rounded-[var(--radius-inner)] font-bold select-none
              ${isEmpty
                ? "bg-transparent shadow-none cursor-default"
                : `${colorClass} text-white shadow-[var(--tile-shadow)] cursor-pointer
                   hover:-translate-y-0.5 hover:shadow-[var(--tile-shadow-hover)] hover:brightness-110
                   active:scale-95`
              }
              ${isHint ? "ring-2 ring-accent ring-offset-2 ring-offset-grid" : ""}
              transition-all duration-150
            `}
            style={{
              fontSize: gridSize <= 3 ? "1.5rem" : gridSize <= 4 ? "1.25rem" : "1rem",
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

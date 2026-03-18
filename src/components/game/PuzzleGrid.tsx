interface PuzzleGridProps {
  tiles: (number | null)[];
  gridSize: number;
  hintTile: number | null;
  onTileClick: (index: number) => void;
}

const PuzzleGrid = ({ tiles, gridSize, hintTile, onTileClick }: PuzzleGridProps) => {
  return (
    <div
      className="bg-grid rounded-[var(--radius-outer)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] aspect-square"
      style={{
        padding: "var(--gap)",
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: "var(--gap)",
      }}
    >
      {tiles.map((value, index) => {
        const isEmpty = value === null;
        const isHint = hintTile === index;

        return (
          <div
            key={index}
            onClick={() => !isEmpty && onTileClick(index)}
            className={`
              flex items-center justify-center rounded-[var(--radius-inner)] font-semibold select-none
              transition-all duration-200 ease-[var(--ease-out)]
              ${isEmpty
                ? "bg-transparent shadow-none cursor-default"
                : `bg-tile shadow-[var(--tile-shadow)] cursor-pointer
                   hover:-translate-y-0.5 hover:shadow-[var(--tile-shadow-hover)]
                   active:scale-95`
              }
              ${isHint ? "ring-2 ring-primary ring-offset-1" : ""}
            `}
            style={{
              fontSize: gridSize <= 3 ? "1.5rem" : gridSize <= 4 ? "1.25rem" : "1rem",
            }}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
};

export default PuzzleGrid;

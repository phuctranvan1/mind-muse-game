/**
 * Calculate the star rating for a completed puzzle based on difficulty, moves, and time.
 */
function parseTimeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

export function getStars(difficulty: string, moves: number, time: string): number {
  const totalSeconds = parseTimeToSeconds(time);
  const d = difficulty.toLowerCase();
  if (d === "divine") return moves < 80 && totalSeconds < 300 ? 3 : moves < 200 ? 2 : 1;
  if (d === "immortal") return moves < 60 && totalSeconds < 240 ? 3 : moves < 150 ? 2 : 1;
  if (d === "mythic") return moves < 50 && totalSeconds < 180 ? 3 : moves < 120 ? 2 : 1;
  if (d === "legend") return moves < 50 && totalSeconds < 120 ? 3 : moves < 100 ? 2 : 1;
  if (d === "genius") return moves < 40 && totalSeconds < 90 ? 3 : moves < 80 ? 2 : 1;
  if (d === "grandmaster") return moves < 35 && totalSeconds < 75 ? 3 : moves < 70 ? 2 : 1;
  if (d === "master") return moves < 30 && totalSeconds < 60 ? 3 : moves < 60 ? 2 : 1;
  if (d === "expert") return moves < 25 && totalSeconds < 45 ? 3 : moves < 50 ? 2 : 1;
  if (d === "hard") return moves < 20 && totalSeconds < 30 ? 3 : moves < 40 ? 2 : 1;
  if (d === "medium") return moves < 15 && totalSeconds < 20 ? 3 : moves < 30 ? 2 : 1;
  return moves < 10 && totalSeconds < 15 ? 3 : moves < 20 ? 2 : 1;
}

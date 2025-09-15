import type { Level } from "./types";

/**
 * Translate the puzzle so the used bounding box (of outline cells === 1)
 * is centered inside the w×h grid. Adjusts `outlines` and `starts`.
 *
 * bias: "round" centers as evenly as possible (default),
 *       "floor" biases slightly toward top/left when odd leftover space.
 */
export function normalizeLevelCentered<L extends Level>(
  level: L,
  bias: "round" | "floor" = "round"
): L {
  const { w, h, outlines } = level;

  // Find bounding box of all outlined cells
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let i = 0; i < outlines.length; i++) {
    if (outlines[i]) {
      const x = i % w;
      const y = (i / w) | 0;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  // If nothing is outlined (shouldn't happen), bail
  if (maxX < 0) return level;

  const usedW = maxX - minX + 1;
  const usedH = maxY - minY + 1;

  const split = (diff: number) =>
    bias === "round" ? Math.round(diff / 2) : Math.floor(diff / 2);

  const leftPad = split(w - usedW);
  const topPad  = split(h - usedH);

  const dx = leftPad - minX;
  const dy = topPad  - minY;

  // If already centered, return as-is
  if (dx === 0 && dy === 0) return level;

  // Remap outlines
  const newOutlines = new Array(w * h).fill(0);
  for (let i = 0; i < outlines.length; i++) {
    if (!outlines[i]) continue;
    const x = i % w;
    const y = (i / w) | 0;
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
      newOutlines[ny * w + nx] = 1;
    }
  }

  // Remap starts (keep order)
  const newStarts = (level.starts ?? []).map((i) => {
    const x = i % w;
    const y = (i / w) | 0;
    const nx = x + dx;
    const ny = y + dy;
    const ni = ny * w + nx;
    // Safety clamp, though it should always be in-bounds
    return nx >= 0 && nx < w && ny >= 0 && ny < h ? ni : i;
  });

  // Return a new object (preserve other fields)
  return {
    ...level,
    outlines: newOutlines,
    starts: newStarts,
    // Optional: you can add offset for debugging if you like
    // _offset: { dx, dy },
  };
}

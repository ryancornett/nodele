import type { Dir, Level } from "../lib/types";
import { idx, xy, step, inBounds } from "../lib/grid";
import { centerBox } from "../lib/cellGeom";

export function GhostPreviewOverlay({
  hoverIdx, dir, level, fills, cellSize, gap,
}: {
  hoverIdx: number | null;
  dir: Dir;
  level: Level;
  fills: number[];
  cellSize: number;
  gap: number;
}) {
  if (hoverIdx == null) return null;

  const { w, h, outlines } = level;
  const [x, y] = xy(hoverIdx, w);
  const [dx, dy] = step(dir);

  const nx = x + dx;
  const ny = y + dy;
  const inb = inBounds(nx, ny, w, h);
  const ni = inb ? idx(nx, ny, w) : -1;

  const nextValid = inb && outlines[ni] === 1 && !fills.includes(ni);

  // center of a cell in board coordinates:
  const center = (cx: number, cy: number) => ({
    top:  gap + cy * (cellSize + gap) + cellSize / 2,
    left: gap + cx * (cellSize + gap) + cellSize / 2,
  });

  // Where to show the preview ring: target cell if valid, otherwise the current cell
  const c = nextValid ? center(nx, ny) : center(x, y);

  const RING = Math.round(cellSize * 0.80);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* ring */}
      <div
        className={nextValid
          ? "border-2 border-dashed border-blue-900/70"
          : "border-2 border-dashed border-red-500/80"}
        style={{ ...centerBox(RING), ...c }}
        aria-hidden
      />
      {/* optional arrow… (use same `c` or compute separately) */}
    </div>
  );
}
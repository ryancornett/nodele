import type { Dir, Level } from "../lib/types";
import { idx, xy, step, inBounds } from "../lib/grid";

export function GhostPreviewOverlay({
  hoverIdx,
  dir,
  level,
  fills,
  cellSize,
  gap,
}: {
  hoverIdx: number | null;
  dir: Dir;
  level: Level;
  fills: number[];
  cellSize: number;
  gap: number;
}) {
  if (hoverIdx == null) return null;
  const [hx, hy] = xy(hoverIdx, level.w);
  const [dx, dy] = step(dir);
  const tx = hx + dx,
    ty = hy + dy;
  if (!inBounds(tx, ty, level.w, level.h)) return null;
  const ti = idx(tx, ty, level.w);
  const valid = level.outlines[ti] === 1 && !fills.includes(ti);
  const left = tx * (cellSize + gap) + gap;
  const top = ty * (cellSize + gap) + gap;

  return (
    <div
      className="pointer-events-none"
      style={{
        position: "absolute",
        left,
        top,
        width: cellSize,
        height: cellSize,
        borderRadius: "9999px",
        border: `2px dashed ${
          valid ? "rgba(45, 64, 187, 0.5)" : "rgba(255,64,64,0.9)"
        }`,
        background: valid ? "rgba(255,255,255,0.12)" : "rgba(255,64,64,0.12)",
      }}
    />
  );
}

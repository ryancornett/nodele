import type { Dir, Level, Status } from "../lib/types";
import { idx } from "../lib/grid";
import { CellButton } from "./CellButton";
import { GhostPreviewOverlay } from "./GhostPreviewOverlay";

export function Board({
  level,
  fills,
  status,
  dir,
  shakeIdx,
  onCellClick,
  onHover,
  hoverIdx,
}: {
  level: Level;
  fills: number[];
  status: Status;
  dir: Dir;
  shakeIdx: number | null;
  onCellClick: (i: number) => void;
  onHover: (i: number | null) => void;
  hoverIdx: number | null;
}) {
  const cellSize = 28;
  const gap = 6;
  const canvasSize = level.w * (cellSize + gap) + gap;

  return (
    <div
  className="rounded-2xl p-4"
  style={{ background: status === "won" ? "#2d40bbd8" : "#e5594fff" }}
>
      <div
        style={{ width: canvasSize, height: canvasSize, position: "relative" }}
      >
        {Array.from({ length: level.h }).map((_, y) => (
          <div
            key={y}
            style={{
              position: "absolute",
              top: y * (cellSize + gap) + gap,
              display: "flex",
            }}
          >
            {Array.from({ length: level.w }).map((__, x) => {
              const i = idx(x, y, level.w);
              const outlined = level.outlines[i] === 1;
              const filled = fills.includes(i);
              const clickable = status === "playing" && filled;
              const shaking = shakeIdx === i;
              const showArrow = clickable && hoverIdx === i;
              return (
                <div key={x} style={{ position: "relative" }}>
                  <CellButton
                    i={i}
                    outlined={outlined}
                    filled={filled}
                    clickable={clickable}
                    shaking={shaking}
                    onClick={onCellClick}
                    onHover={onHover}
                    cellSize={cellSize}
                    gap={gap}
                    dir={dir}
                    showArrow={showArrow}
                  />
                </div>
              );
            })}
          </div>
        ))}
        <GhostPreviewOverlay
          hoverIdx={hoverIdx}
          dir={dir}
          level={level}
          fills={fills}
          cellSize={cellSize}
          gap={gap}
        />
      </div>
    </div>
  );
}

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
  dropMode = false,
  canDropAt = () => false, // default -> always boolean
}: {
  level: Level;
  fills: number[];
  status: Status;
  dir: Dir;
  shakeIdx: number | null;
  onCellClick: (i: number) => void;
  onHover: (i: number | null) => void;
  hoverIdx: number | null;
  dropMode?: boolean;
  canDropAt?: (i: number) => boolean;
}) {
  // Keep these consistent with your board sizing
  const cellSize = 28;
  const gap = 6;
  const canvasSize = level.w * (cellSize + gap) + gap;
  const RING_DIAM = Math.round(cellSize * 0.8); // ~80% of cell
  const FILL_DIAM = Math.round(cellSize * 0.8);

  const centerBox = (size: number): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    top: "50%",
    left: "72%",
    transform: "translate(-50%, -50%)",
    borderRadius: "9999px",
  });

  const isDroppable = (i: number) => canDropAt(i);

  const PAD = {
    hintRing: Math.round(cellSize * 0.14), // was inset-[14%]
    validRing: Math.round(cellSize * 0.1), // was inset-[10%]
    validFill: Math.round(cellSize * 0.22), // was inset-[22%]
  };
  const inset = (px: number): React.CSSProperties => ({
    position: "absolute",
    top: px,
    left: px,
    right: px,
    bottom: px,
  });

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

              const droppable =
                dropMode && outlined && !filled && isDroppable(i);
              const cursorClass = dropMode
                ? droppable
                  ? "cursor-copy"
                  : "cursor-not-allowed"
                : clickable
                ? "cursor-pointer"
                : "cursor-default";

              return (
                <div
                  key={x}
                  className={`relative select-none ${cursorClass}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    marginRight: gap,
                  }}
                  onPointerEnter={() => onHover(i)}
                  onPointerLeave={() => onHover(null)}
                  onClick={
                    dropMode && droppable ? () => onCellClick(i) : undefined
                  }
                  role={dropMode && droppable ? "button" : undefined}
                  tabIndex={dropMode && droppable ? 0 : -1}
                  onKeyDown={
                    dropMode && droppable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onCellClick(i);
                          }
                        }
                      : undefined
                  }
                >
                  <CellButton
                    i={i}
                    outlined={outlined}
                    filled={filled}
                    clickable={clickable}
                    shaking={shaking}
                    onClick={onCellClick}
                    onHover={dropMode ? () => {} : onHover}
                    cellSize={cellSize}
                    gap={gap}
                    dir={dir}
                    showArrow={showArrow}
                  />

                  {/* 1) Subtle hint ring for all valid drop targets */}
                  {dropMode && droppable && (
                    <div
                      className="pointer-events-none border border-dashed border-white/30 dark:border-white/25"
                      style={centerBox(RING_DIAM)}
                      aria-hidden
                    />
                  )}

                  {/* 2) Strong hover ghost (valid vs invalid) */}
                  {dropMode && hoverIdx === i && droppable && (
                    <>
                      {/* ghost fill */}
                      <div
                        className="pointer-events-none bg-white/60 dark:bg-white/35"
                        style={centerBox(FILL_DIAM)}
                        aria-hidden
                      />
                      {/* ghost ring */}
                      <div
                        className="pointer-events-none border-2 border-dashed border-white/80 dark:border-white/70"
                        style={centerBox(RING_DIAM)}
                        aria-hidden
                      />
                    </>
                  )}

                  {dropMode && hoverIdx === i && !droppable && (
                    <div
                      className="pointer-events-none border-2 border-dashed border-red-500/80"
                      style={centerBox(RING_DIAM)}
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {!dropMode && (
          <GhostPreviewOverlay
            hoverIdx={hoverIdx}
            dir={dir}
            level={level}
            fills={fills}
            cellSize={cellSize}
            gap={gap}
          />
        )}
      </div>
    </div>
  );
}

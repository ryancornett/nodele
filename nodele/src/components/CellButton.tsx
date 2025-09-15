import type { Dir } from "../lib/types";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";
import { centerBox, cellGeom } from "../lib/cellGeom";

export function CellButton({
  i,
  outlined,
  filled,
  clickable,
  shaking,
  onClick,
  onHover,
  cellSize,
  gap,
  dir,
  showArrow,
}: {
  i: number;
  outlined: boolean;
  filled: boolean;
  clickable: boolean;
  shaking: boolean;
  onClick: (i: number) => void;
  onHover: (i: number | null) => void;
  cellSize: number;
  gap: number;
  dir: Dir;
  showArrow: boolean;
}) {
  const dirToIcon = (d: Dir) =>
    d === 0
      ? "arrow-left-circle-fill"
      : d === 1
      ? "arrow-up-circle-fill"
      : d === 2
      ? "arrow-right-circle-fill"
      : "arrow-down-circle-fill";
  const { RING_DIAM, FILL_DIAM } = cellGeom(cellSize);
  return (
    <button
      onClick={() => onClick(i)}
      onMouseEnter={() => (clickable ? onHover(i) : onHover(null))}
      onMouseLeave={() => onHover(null)}
      className={`relative grid place-items-center transition-transform ${
        clickable ? "hover:scale-105" : ""
      } ${shaking ? "btn-shake" : ""}`}
      style={{
        width: cellSize,
        height: cellSize,
        marginLeft: gap,
        borderRadius: "9999px",
        border: outlined ? "2px solid white" : "2px solid transparent",
        background: filled ? "white" : "transparent",
        cursor: clickable ? "pointer" : "default",
      }}
    >
      {filled && (
        <div
          className="bg-white"
          style={centerBox(FILL_DIAM)}
          aria-hidden
        />
      )}
      {outlined && (
        <div
          className="border-2 border-transparent"
          style={centerBox(RING_DIAM)}
          aria-hidden
        />
      )}
      {showArrow && (
        <div
          className="pointer-events-none opacity-85 text-red-500/90 flex justify-center items-center"
          style={{ fontSize: 18 }}
        >
          <SlIcon
            library="default"
            name={dirToIcon(dir)}
          />
        </div>
      )}
    </button>
  );
}

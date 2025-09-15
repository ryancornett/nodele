import type { Dir } from "../lib/types";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";


function dirToArrow(d: Dir) {
  switch (d) {
    case 0: return { arrow: "arrow-left-circle-fill", label: "LEFT" };
    case 1: return { arrow: "arrow-up-circle-fill", label: "UP" };
    case 2: return { arrow: "arrow-right-circle-fill", label: "RIGHT" };
    case 3: return { arrow: "arrow-down-circle-fill", label: "DOWN" };
    default: return { arrow: "arrow-right-circle-fill", label: "RIGHT" };
  }
}

export function DirectionBadge({ dir }: { dir: Dir }) {
  const { arrow, label } = dirToArrow(dir);

  return (
    <div
      className="absolute z-10"
      style={{ top: 6, left: 6, pointerEvents: "none" }}
      role="status"
      aria-live="polite"
    >
      <div
        className="inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium
                   bg-black/60 text-white backdrop-blur-sm
                   dark:bg-white/15 dark:text-white"
        style={{ letterSpacing: 0.4 }}
      >
        <span aria-hidden className="text-base leading-none"><SlIcon
            library="default"
            name={arrow}
          /></span>
        <span className="leading-none">{label}</span>
      </div>

      {/* Screen reader-only verbose label; keep visible one short */}
      <span className="sr-only">Current direction: {label.toLowerCase()}</span>
    </div>
  );
}

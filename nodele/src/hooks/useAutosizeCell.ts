import { useLayoutEffect, useRef, useState } from "react";

/**
 * Computes the largest whole-pixel cell size that fits a w×h grid with gaps
 * inside the container's width. Updates on resize via ResizeObserver.
 *
 * Board width formula (your layout):
 *   width = w * cell + (w + 1) * gap
 */
export function useAutosizeCell(
  w: number,
  gap: number,
  opts: { min?: number; max?: number; safetyPx?: number } = {}
) {
  const { min = 20, max = 40, safetyPx = 1 } = opts;
  const ref = useRef<HTMLDivElement | null>(null);
  const [cell, setCell] = useState<number>(max);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const cw = el.clientWidth; // includes padding; that's fine
      // Solve for cell in: cw >= w*cell + (w+1)*gap + safety
      const raw = Math.floor((cw - (w + 1) * gap - safetyPx) / w);
      const next = Math.max(min, Math.min(max, raw));
      setCell(next);
    };

    const ro = new ResizeObserver(compute);
    ro.observe(el);
    compute();

    return () => ro.disconnect();
  }, [w, gap, min, max, safetyPx]);

  return { containerRef: ref, cell };
}

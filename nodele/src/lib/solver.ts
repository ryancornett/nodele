import type { Level, Dir } from "./types";
import { idx, step, inBounds } from "./grid";

export function isSolvableAnyFilled(level: Level, maxStates = 200_000): boolean {
  const { w, h, outlines, starts, firstDir } = level;

  // Fills as a compact Uint8Array for fast copy
  const fills0 = new Uint8Array(w * h);
  let filledCount = 0;
  for (const s of starts) { fills0[s] = 1; filledCount++; }
  const target = outlines.reduce<number>((a, v) => a + v, 0);

  const seen = new Set<string>();
  let nodes = 0;

  function key(turn: number, fills: Uint8Array): string {
    // You can optimize by hashing; string is fine for now.
    // Using base64-ish join keeps it smallish.
    return `${turn}|${Array.from(fills).join("")}`;
  }

  function dfs(turn: number, fills: Uint8Array, count: number): boolean {
    if (count === target) return true;
    if (++nodes > maxStates) return false;

    const dir = ((firstDir + turn) & 3) as Dir;
    const [dx, dy] = step(dir);
    const k = key(turn, fills);
    if (seen.has(k)) return false;
    seen.add(k);

    // Try every currently-filled cell as the click source
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = idx(x, y, w);
      if (!fills[i]) continue;

      const nx = x + dx, ny = y + dy;
      if (!inBounds(nx, ny, w, h)) continue;       // would spill off board
      const ni = idx(nx, ny, w);
      if (!outlines[ni]) continue;                 // would spill into non-outline
      if (fills[ni]) continue;                     // already filled: skip

      // Make move
      const next = fills.slice();
      next[ni] = 1;
      if (dfs(turn + 1, next, count + 1)) return true;
    }
    return false;
  }

  return dfs(0, fills0, filledCount);
}

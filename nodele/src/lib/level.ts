import type { Level, Cell, Dir } from "./types";
import { idx, xy, step, inBounds, manhattan } from "./grid";
import { mulberry32, randInt } from "./rng";
import { isSolvableAnyFilled } from "./solver";

// keep your existing "generateLevel" as a draft/shape builder
export function generateLevel(seed: number, w = 16, h = 16): Level {
  const rng = mulberry32(seed);
  const target = randInt(rng, 55, 85);  // you can lower to 40–60 for an easier feel

  const outlines: Cell[] = Array(w * h).fill(0);
  let cx = randInt(rng, Math.floor(w * 0.3), Math.floor(w * 0.7));
  let cy = randInt(rng, Math.floor(h * 0.3), Math.floor(h * 0.7));
  outlines[idx(cx, cy, w)] = 1;
  let cells: number[] = [idx(cx, cy, w)];
  const dirs: Dir[] = [0, 1, 2, 3];

  while (cells.length < target) {
    const fromIdx = cells[randInt(rng, 0, cells.length - 1)];
    const [x, y] = xy(fromIdx, w);
    const d = dirs[randInt(rng, 0, dirs.length - 1)];
    const [dx, dy] = step(d);
    const nx = x + dx, ny = y + dy;
    if (!inBounds(nx, ny, w, h)) continue;
    const ni = idx(nx, ny, w);
    if (outlines[ni]) continue;
    outlines[ni] = 1;
    cells.push(ni);
  }

  let s1 = cells[randInt(rng, 0, cells.length - 1)];
  let s2 = cells[randInt(rng, 0, cells.length - 1)];
  let guard = 0;
  while ((s2 === s1 || manhattan(s1, s2, w) < 4) && guard++ < 1000) {
    s2 = cells[randInt(rng, 0, cells.length - 1)];
  }

  const firstDir: Dir = randInt(rng, 0, 3) as Dir;
  return { w, h, outlines, starts: [s1, s2], firstDir, seedUsed: seed };
}

export function generateSolvableLevelSync(seed: number, w = 16, h = 16, maxTries = 200): Level {
  
    for (let off = 0; off < maxTries; off++) {
    const lvl = generateLevel(seed + off, w, h);
    if (isSolvableAnyFilled(lvl)) {
      return { ...lvl, seedUsed: seed + off };
    }
  }
  const last = generateLevel(seed + maxTries, w, h);
  return { ...last, seedUsed: seed + maxTries };
}

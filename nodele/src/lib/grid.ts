import type { Dir } from "./types";

export const idx = (x: number, y: number, w: number) => y * w + x;
export const xy = (i: number, w: number) => [i % w, Math.floor(i / w)] as const;
export const step = (d: Dir) => (d === 0 ? [-1, 0] : d === 1 ? [0, -1] : d === 2 ? [1, 0] : [0, 1]);
export const inBounds = (x: number, y: number, w: number, h: number) => x >= 0 && x < w && y >= 0 && y < h;
export const manhattan = (a: number, b: number, w: number) => {
const [ax, ay] = xy(a, w);
const [bx, by] = xy(b, w);
return Math.abs(ax - bx) + Math.abs(ay - by);
};
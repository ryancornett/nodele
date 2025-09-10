export function mulberry32(a: number) {
return function () {
a |= 0;
a = (a + 0x6D2B79F5) | 0;
let t = Math.imul(a ^ (a >>> 15), 1 | a);
t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}


export const randInt = (rng: () => number, min: number, max: number) =>
Math.floor(rng() * (max - min + 1)) + min;
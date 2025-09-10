export type Dir = 0 | 1 | 2 | 3; // 0=L,1=U,2=R,3=D
export type Cell = 0 | 1; // 0 = no outline, 1 = outline exists


export interface Level {
w: number;
h: number;
outlines: Cell[]; // length = w*h
starts: number[]; // two indices
firstDir: Dir;
seedUsed: number;
}


export type Status = "playing" | "won" | "spilled";
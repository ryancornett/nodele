import { useEffect, useMemo, useState } from "react";
import type { Dir, Status, Level } from "./lib/types";
import { xy, step, inBounds, idx } from "./lib/grid";
import { generateSolvableLevelSync } from "./lib/level";
import { GameHeader } from "./components/GameHeader";
import { Board } from "./components/Board";
import { Controls } from "./components/Controls";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/"
);

export default function App() {
  const [seed, setSeed] = useState(20250909);

  const puzzle = useMemo<Level>(() => generateSolvableLevelSync(seed), [seed]);

  const [fills, setFills] = useState<number[]>([]);
  const [turn, setTurn] = useState(0);
  const [status, setStatus] = useState<Status>("playing");
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  type HistoryEntry =
    | { type: "split"; source: number; created: number; dir: Dir }
    | { type: "drop"; created: number }
    | { type: "skip"; prevDir: Dir };

  const RULES = {
    freeDrops: 2, // how many drops per game
    skips: 3, // how many skips per game
    dropAdvancesDir: false, // drop: place a dot anywhere; no direction advance
    skipAdvancesDir: true, // skip: advance the direction, no placement
    undoWindow: 4, // can undo the last 4 *split* moves (one per direction in the cycle)
  };
  const [dropsLeft, setDropsLeft] = useState(RULES.freeDrops);
  const [skipsLeft, setSkipsLeft] = useState(RULES.skips);
  const [mode, setMode] = useState<"play" | "drop">("play"); // toggle to place a free drop
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [undosInARow, setUndosInARow] = useState(0); // only counts split undos, max 4

  useEffect(() => {
    if (status !== "playing" || startTime == null) return;
    const tick = () => setElapsed(Date.now() - startTime);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, startTime]);

  useEffect(() => {
    setFills(puzzle.starts.slice());
    setTurn(0);
    setStatus("playing");
    setMoves(0);
    setStartTime(null);
    setElapsed(0);
    setShakeIdx(null);
    setHoverIdx(null);
  }, [puzzle]);

  const outlinedCount = useMemo(
    () => puzzle.outlines.reduce<number>((acc, v) => acc + v, 0),
    [puzzle]
  );

  const dir: Dir = ((puzzle.firstDir + turn) & 3) as Dir;

  function handleClick(i: number) {
  if (status !== 'playing') return;

  // --- DROP MODE ---
  if (mode === 'drop') {
    if (dropsLeft <= 0) return;
    if (!puzzle.outlines[i] || fills.includes(i)) return; // must drop on an outlined empty cell
    setDropsLeft(d => d - 1);
    finalizeFill([...fills, i], RULES.dropAdvancesDir, { type: 'drop', created: i });
    setMode('play');
    return;
  }

  // --- NORMAL SPLIT ---
  if (!fills.includes(i)) return; // must click an existing filled cell
  const [x, y] = xy(i, puzzle.w);
  const [dx, dy] = step(dir);
  const nx = x + dx, ny = y + dy;
  if (!inBounds(nx, ny, puzzle.w, puzzle.h)) { setStatus('spilled'); return; }
  const ni = idx(nx, ny, puzzle.w);
  if (!puzzle.outlines[ni])                 { setStatus('spilled'); return; }
  if (fills.includes(ni)) {
    setShakeIdx(i);
    setTimeout(() => setShakeIdx(null), 200);
    return;
  }
  finalizeFill([...fills, ni], /*advanceTurn*/ true, { type: 'split', source: i, created: ni, dir });
}


  function finalizeFill(nextFills: number[], advanceTurn: boolean, historyEntry: HistoryEntry) {
  setFills(nextFills);
  if (startTime == null) setStartTime(Date.now());
  setMoves(m => m + 1);
  if (advanceTurn) setTurn(t => t + 1);
  setHistory(h => [...h, historyEntry]);
  setUndosInARow(0);        // any real action clears the undo chain
  setStatus('playing');     // clear win/spill banners if you like
  if (nextFills.length === outlinedCount) setStatus('won');
}

function handleSkip() {
  if (status !== 'playing' || skipsLeft <= 0) return;
  setSkipsLeft(s => s - 1);
  if (RULES.skipAdvancesDir) setTurn(t => t + 1);
  setHistory(h => [...h, { type: 'skip', prevDir: dir }]);
  setUndosInARow(0);
}

function handleToggleDrop() {
  if (status !== 'playing' || dropsLeft <= 0) return;
  setMode(m => (m === 'play' ? 'drop' : 'play'));
}

function handleUndo() {
  if (history.length === 0) return;

  const last = history[history.length - 1];

  if (last.type === 'split') {
    if (undosInARow >= RULES.undoWindow) return; // already undid 4 split moves
    // remove the created dot, step direction back, update moves
    setFills(prev => prev.filter(i => i !== last.created));
    setTurn(t => t - 1);
    setMoves(m => Math.max(0, m - 1));
    setHistory(h => h.slice(0, -1));
    setUndosInARow(u => u + 1);
    setStatus('playing');
    return;
  }

  if (last.type === 'drop') {
    // revert drop (doesn't count against the 4 split undos)
    setFills(prev => prev.filter(i => i !== last.created));
    setMoves(m => Math.max(0, m - 1));
    setDropsLeft(d => d + 1);
    if (RULES.dropAdvancesDir) setTurn(t => t - 1);
    setHistory(h => h.slice(0, -1));
    setStatus('playing');
    return;
  }

  if (last.type === 'skip') {
    // undo skip: step direction back and restore a skip
    if (RULES.skipAdvancesDir) setTurn(t => t - 1);
    setSkipsLeft(s => s + 1);
    setHistory(h => h.slice(0, -1));
    setStatus('playing');
  }
}




  function resetSame() {
    setFills(puzzle.starts.slice());
    setTurn(0);
    setStatus("playing");
    setMoves(0);
    setStartTime(null);
    setElapsed(0);
    setShakeIdx(null);
    setHoverIdx(null);
    setDropsLeft(RULES.freeDrops);
    setSkipsLeft(RULES.skips);
    setMode("play");
    setHistory([]);
    setUndosInARow(0);
  }

  function newPuzzle() {
    setSeed((s) => s + 1);
  }

  const targetMoves = outlinedCount - 2;

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-start p-4 gap-4">
      <div className="w-[75vmin] flex">
        <h1 className="text-xl font-semibold self-start">Nodele</h1>
      </div>

      <GameHeader
  moves={moves}
  targetMoves={targetMoves}
  elapsedMs={elapsed}
  seedUsed={puzzle.seedUsed}
  dropsLeft={dropsLeft}
  skipsLeft={skipsLeft}
  undoLeft={RULES.undoWindow - undosInARow}
/>


      <Board
        level={puzzle} // prop name stays 'level' for children; local var is 'puzzle'
        fills={fills}
        status={status}
        dir={dir}
        shakeIdx={shakeIdx}
        onCellClick={handleClick}
        onHover={setHoverIdx}
        hoverIdx={hoverIdx}
      />

      <Controls
  onReset={resetSame}
  onNew={newPuzzle}
  onSkip={handleSkip}
  onToggleDrop={handleToggleDrop}
  onUndo={handleUndo}
  dropsLeft={dropsLeft}
  skipsLeft={skipsLeft}
  dropActive={mode === 'drop'}
  undoLeft={RULES.undoWindow - undosInARow}
/>


      <div className="text-sm">
        {status === "spilled" && (
          <span className="text-rose-600 font-medium">
            Spill! Click Reset to try again.
          </span>
        )}
        {status === "won" && (
          <span className="text-emerald-700 font-medium">
            You filled all outlines — nice! 🎉
          </span>
        )}
      </div>
    </div>
  );
}

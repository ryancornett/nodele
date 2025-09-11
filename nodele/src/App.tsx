import { useEffect, useMemo, useRef, useState } from "react";
import type { Dir, Status, Level } from "./lib/types";
import { xy, step, inBounds, idx } from "./lib/grid";
import { generateSolvableLevelSync } from "./lib/level";
import { GameHeader } from "./components/GameHeader";
import { Board } from "./components/Board";
import { Controls } from "./components/Controls";
import { useOverlay } from "./components/overlay/OverlayContext";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { dailySeedNY } from "./lib/daily";
import { recordDailyWin, loadStreak, resetStreak } from "./streak";
import { ymdNY } from "./timeNY";
import { OverlayRoot } from "./components/overlay/OverlayRoot";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/"
);

export default function App() {
  const seed = dailySeedNY();
  const [streak, setStreak] = useState(() => loadStreak());

  const puzzle = useMemo<Level>(
    () => generateSolvableLevelSync(seed, 12, 12),
    [seed]
  );

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
    freeDrops: 2,
    skips: 3,
    dropAdvancesDir: false,
    skipAdvancesDir: true,
    undoWindow: 4,
  };
  const [dropsLeft, setDropsLeft] = useState(RULES.freeDrops);
  const [skipsLeft, setSkipsLeft] = useState(RULES.skips);
  const [mode, setMode] = useState<"play" | "drop">("play"); // toggle to place a free drop
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [undoCredits, setUndoCredits] = useState(RULES.undoWindow);
  const last = history[history.length - 1];
  const canUndo = !!last && (last.type !== "split" || undoCredits > 0);
  const { open } = useOverlay();


  const THEME_KEY = "ddn_theme";

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  function onToggleDarkMode() {
    setDarkMode((v) => !v);
  }

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

  function hasSplitMove(level: Level, fills: number[], dir: Dir): boolean {
  for (const i of fills) {
    const [x, y] = xy(i, level.w);
    const [dx, dy] = step(dir);
    const nx = x + dx, ny = y + dy;
    if (!inBounds(nx, ny, level.w, level.h)) continue;
    const ni = idx(nx, ny, level.w);
    if (level.outlines[ni] && !fills.includes(ni)) return true;
  }
  return false;
}

const deadOnceRef = useRef(false);

useEffect(() => {
  if (status !== "playing") return;

  const splitOk = hasSplitMove(puzzle, fills, dir);
  // A drop is legal if you have any drops left and puzzle isn’t already solved
  const dropOk = dropsLeft > 0 && fills.length < outlinedCount;
  const skipOk = skipsLeft > 0;

  const canMove = splitOk || dropOk || skipOk;

  if (!canMove && !deadOnceRef.current) {
    open("nomoremoves", {
      canUndo,
      onUndo: handleUndo,
      onReset: onResetPuzzle,
    });
    deadOnceRef.current = true;
  } else if (canMove) {
    // Re-arm once player regains any legal move
    deadOnceRef.current = false;
  }
}, [
  status,
  fills,
  dir,
  dropsLeft,
  skipsLeft,
  outlinedCount,
  canUndo,
  open,
]);


  function handleClick(i: number) {
    if (status !== "playing") return;

    // DROP MODE
    if (mode === "drop") {
      if (dropsLeft <= 0) return;
      if (!puzzle.outlines[i] || fills.includes(i)) return;
      setDropsLeft((d) => d - 1);
      finalizeFill([...fills, i], RULES.dropAdvancesDir, {
        type: "drop",
        created: i,
      });
      setMode("play");
      return;
    }

    // NORMAL SPLIT
    if (!fills.includes(i)) return;
    const [x, y] = xy(i, puzzle.w);
    const [dx, dy] = step(dir);
    const nx = x + dx,
      ny = y + dy;
    if (!inBounds(nx, ny, puzzle.w, puzzle.h)) {
      setShakeIdx(i);
      setTimeout(() => setShakeIdx(null), 200);
      return;
    }
    const ni = idx(nx, ny, puzzle.w);
    if (!puzzle.outlines[ni]) {
      setShakeIdx(i);
      setTimeout(() => setShakeIdx(null), 200);
      return;
    }
    if (fills.includes(ni)) {
      setShakeIdx(i);
      setTimeout(() => setShakeIdx(null), 200);
      return;
    }

    finalizeFill([...fills, ni], /*advanceTurn*/ true, {
      type: "split",
      source: i,
      created: ni,
      dir,
    });
  }

  function finalizeFill(
    nextFills: number[],
    advanceTurn: boolean,
    historyEntry: HistoryEntry
  ) {
    setFills(nextFills);
    if (startTime == null) setStartTime(Date.now());
    setMoves((m) => m + 1);
    if (advanceTurn) setTurn((t) => t + 1);
    setHistory((h) => [...h, historyEntry]);

    if (historyEntry.type === "split") {
      setUndoCredits((c) => Math.min(RULES.undoWindow, c + 1));
    }

    if (nextFills.length === outlinedCount) setStatus("won");
  }

  function handleSkip() {
    if (status !== "playing" || skipsLeft <= 0) return;
    setSkipsLeft((s) => s - 1);
    if (RULES.skipAdvancesDir) setTurn((t) => t + 1);
    setHistory((h) => [...h, { type: "skip", prevDir: dir }]);
  }

  function handleToggleDrop() {
    if (status !== "playing" || dropsLeft <= 0) return;
    setMode((m) => (m === "play" ? "drop" : "play"));
  }

  function handleUndo() {
    if (history.length === 0) return;
    const last = history[history.length - 1];

    if (last.type === "split") {
      // Need a credit to undo a split
      if (undoCredits <= 0) return;

      setFills((prev) => prev.filter((i) => i !== last.created));
      setTurn((t) => t - 1);
      setMoves((m) => Math.max(0, m - 1));
      setHistory((h) => h.slice(0, -1));

      // Consume 1 credit
      setUndoCredits((c) => Math.max(0, c - 1));
      setStatus("playing");
      return;
    }

    if (last.type === "drop") {
      // Always allowed; does not touch credits
      setFills((prev) => prev.filter((i) => i !== last.created));
      setMoves((m) => Math.max(0, m - 1));
      setDropsLeft((d) => d + 1);
      if (RULES.dropAdvancesDir) setTurn((t) => t - 1);
      setHistory((h) => h.slice(0, -1));
      setStatus("playing");
      return;
    }

    if (last.type === "skip") {
      // Always allowed; does not touch credits
      if (RULES.skipAdvancesDir) setTurn((t) => t - 1);
      setSkipsLeft((s) => s + 1);
      setHistory((h) => h.slice(0, -1));
      setStatus("playing");
    }
  }

 function onResetStreak() {
  resetStreak();
  setStreak(loadStreak());
}


  function onResetPuzzle() {
    resetSame(); // your existing reset that reinitializes fills/turn/moves
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
    setUndoCredits(RULES.undoWindow);
  }

  const targetMoves = outlinedCount - 2;

  useEffect(() => {
    if (status === "won") {
      const s = recordDailyWin(ymdNY());
    setStreak(s);
      const dropsUsed = RULES.freeDrops - dropsLeft;
      const skipsUsed = RULES.skips - skipsLeft;
      open("results", {
        seed: puzzle.seedUsed,
      timeMs: elapsed,
      moves,
      targetMoves,
      dropsUsed,
      dropsTotal: RULES.freeDrops,
      skipsUsed,
      skipsTotal: RULES.skips,
      streakCurrent: s.count,
      streakBest: s.best,
      });
    }
  }, [status]);


useEffect(() => {
  if (!import.meta.env.DEV) return;
  function onKey(e: KeyboardEvent) {
    if (e.altKey && e.code === "KeyN") {
      open("nomoremoves", {
        canUndo,
        onUndo: handleUndo,
        onReset: onResetPuzzle,
      });
    }
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [open, canUndo]);


// DEV-only: Alt+R to open Results overlay without changing game state or streak
useEffect(() => {
  if (!import.meta.env.DEV) return;

  function onKey(e: KeyboardEvent) {
    if (e.altKey && e.code === "KeyR") {
      const dropsUsed = RULES.freeDrops - dropsLeft;
      const skipsUsed = RULES.skips - skipsLeft;
      const s = loadStreak(); // just to display in panel

      open("results", {
        seed: puzzle.seedUsed,
        timeMs: elapsed || 12_345,
        moves: moves || 12,
        targetMoves,
        dropsUsed,
        dropsTotal: RULES.freeDrops,
        skipsUsed,
        skipsTotal: RULES.skips,
        streakCurrent: s.count,
        streakBest: s.best,
      });
    }
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [
  open,
  puzzle.seedUsed,
  elapsed,
  moves,
  targetMoves,
  dropsLeft,
  skipsLeft,
]);

  return (
    <div className="min-h-dvh sm:min-h-[100vh] w-full flex flex-col items-stretch sm:items-center justify-start p-4 gap-4 dark:bg-gray-900">
      <GameHeader
        moves={moves}
        targetMoves={targetMoves}
        elapsedMs={elapsed}
        seedUsed={puzzle.seedUsed}
        dropsLeft={dropsLeft}
        skipsLeft={skipsLeft}
        undoLeft={RULES.undoWindow - undoCredits}
        streakCurrent={streak.count}
  streakBest={streak.best}
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

      <OverlayRoot
        settings={{
          darkMode,
          onToggleDarkMode,
          onResetPuzzle,
          onResetStreak,
        }}
      />

      <Controls
        onSkip={handleSkip}
        onToggleDrop={handleToggleDrop}
        onUndo={handleUndo}
        dropsLeft={dropsLeft}
        skipsLeft={skipsLeft}
        dropActive={mode === "drop"}
        undoLeft={undoCredits}
        canUndo={canUndo}
      />
    </div>
  );
}

import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";
import { useOverlay } from "./overlay/OverlayContext";
import { dailyNumberNY } from "../lib/daily";

export function GameHeader({
  moves,
  targetMoves,
  elapsedMs,
  dropsLeft,
  skipsLeft,
  undoLeft,
  streakCurrent,
  streakBest,
}: {
  moves: number;
  targetMoves: number;
  elapsedMs: number;
  seedUsed: number;
  dropsLeft: number;
  skipsLeft: number;
  undoLeft: number;
  streakCurrent?: number;
  streakBest?: number;
}) {
  const secs = Math.floor(elapsedMs / 1000);
  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, "0");
  const menuItemClass =
    "text-2xl cursor-pointer hover:text-gray-600 transition-colors duration-200 dark:text-slate-300 dark:hover:text-slate-100";
  const { open } = useOverlay();
  const puzzleNumber = dailyNumberNY();

  return (
    <>
      <div className="w-full max-w-[min(96vw,720px)] mx-auto flex gap-2 sm:w-[80vmin] sm:items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold self-start dark:text-slate-100">Dot Dot Node</h1>
          <p className="text-gray-700 dark:text-slate-300">Daily Puzzle #{puzzleNumber}</p>
          {(typeof streakCurrent === "number" && typeof streakBest === "number") && (
      <div className="mt-1 inline-block rounded-full bg-black/10 px-2 py-0.5 text-xs dark:bg-white/10 dark:text-slate-200">
        🔥 Streak {streakCurrent} (best {streakBest})
      </div>
    )}
        </div>
        <menu className="flex gap-3">
          <SlIcon
            className={menuItemClass}
            name="question-circle-fill"
            title="How to play"
            onClick={() => open("howto")}
          ></SlIcon>
          <SlIcon
            className={menuItemClass}
            name="gear-fill"
            title="Settings"
            onClick={() => open("settings")}
          ></SlIcon>
          <SlIcon
            className={menuItemClass}
            name="three-dots-vertical"
            title="About Nodele"
            onClick={() => open("info")}
          ></SlIcon>
        </menu>

      </div>
      <div className="flex flex-wrap gap-4 items-center dark:text-slate-300">
        <div className="text-sm">
          Time:{" "}
          <b>
            {m}:{s}
          </b>
        </div>
        <div className="text-sm">
          Moves: <b>{moves}</b> / {targetMoves}
        </div>
        <div className="text-sm">
          Drops: <b>{dropsLeft}</b>/2
        </div>
        <div className="text-sm">
          Skips: <b>{skipsLeft}</b>/3
        </div>
        <div className="text-sm">
          Undos: <b>{undoLeft}</b>/4
        </div>
      </div>
    </>
  );
}

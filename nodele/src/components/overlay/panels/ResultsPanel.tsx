import { useEffect, useRef, useState } from "react";
import { dailyNumberNY } from "../../../lib/daily";
import { OverlayBase } from "../OverlayBase";

export type ResultsData = {
  seed: number;
  timeMs: number;
  moves: number;
  targetMoves: number;
  dropsUsed: number;
  dropsTotal: number;
  skipsUsed: number;
  skipsTotal: number;
  streakCurrent?: number;
  streakBest?: number;
};

function formatClock(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function ResultsPanel({
  onClose,
  data,
}: {
  onClose: () => void;
  data: ResultsData;
}) {
  const puzzleNumber = dailyNumberNY();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const share = async () => {
    const lines = [
      `I solved #DotDotNode #${puzzleNumber} in ${formatClock(data.timeMs)}`,
      data.dropsUsed === 0 && data.skipsUsed === 0
        ? "No assists used!"
        : `Drops ${data.dropsUsed}/${data.dropsTotal} · Skips ${data.skipsUsed}/${data.skipsTotal}`,
      `🔴🔵\n🔵🔴`,
      `dotdotnode.com`,
    ].filter(Boolean) as string[];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setToastMsg("Copied!");
    } catch {
      setToastMsg("Copy failed");
    }
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 1300);
  };

  return (
    <OverlayBase title="Results" onClose={onClose}>
      <div className="text-lg mb-4">
        <span className="text-blue-800/80 dark:text-slate-200/80 font-medium">
          You solved it! 🎉
        </span>
        {data.streakCurrent != null && (
          <p className="text-sm dark:text-white">
            🔥 Streak: {data.streakCurrent}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm dark:text-white">
        <div>Time</div>
        <div className="font-medium">{formatClock(data.timeMs)}</div>
        <div>Moves</div>
        <div className="font-medium">
          {data.moves} / {data.targetMoves}
        </div>
        <div>Drops</div>
        <div className="font-medium">
          {data.dropsUsed} / {data.dropsTotal}
        </div>
        <div>Skips</div>
        <div className="font-medium">
          {data.skipsUsed} / {data.skipsTotal}
        </div>
      </div>

      <div className="relative flex w-full justify-end">
        <button
          onClick={share}
          className="mt-4 px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-700/80 transition-colors duration-200 text-white text-sm cursor-pointer"
          title="Copy to clipboard"
        >
          Share
        </button>

        {/* Toast */}
        <div
          role="status"
          aria-live="polite"
          className={[
            "absolute right-0 -top-10",
            "rounded-lg px-2 py-1 text-xs shadow-lg",
            "bg-black/90 text-white dark:bg-white dark:text-slate-900",
            "transition-all duration-200",
            toastMsg
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1 pointer-events-none",
          ].join(" ")}
        >
          {toastMsg}
        </div>
      </div>
    </OverlayBase>
  );
}

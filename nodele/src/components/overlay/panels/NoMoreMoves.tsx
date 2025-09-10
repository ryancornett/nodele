import { OverlayBase } from "../OverlayBase";

export type NoMoreMovesData = {
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
};

export function NoMoreMoves({
  onClose,
  data,
}: {
  onClose: () => void;
  data: NoMoreMovesData;
}) {
  return (
    <OverlayBase title="No more legal moves" onClose={onClose}>
      <p className="text-sm mb-3 dark:text-white/90">
        You have no valid splits in the current direction, and no assists left.
      </p>
      <ul className="text-sm mb-4 list-disc pl-5 dark:text-white/80">
        <li>Try <b>Undo</b> to revisit your previous move.</li>
        <li>Or <b>Reset</b> to start this puzzle over.</li>
      </ul>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            data.onUndo();
            onClose();
          }}
          disabled={!data.canUndo}
          className="px-3 py-2 rounded-xl text-sm transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white cursor-pointer"
        >
          Undo
        </button>
        <button
          onClick={() => {
            data.onReset();
            onClose();
          }}
          className="px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-700/80
                     transition-colors duration-200 text-white text-sm cursor-pointer"
        >
          Reset
        </button>
      </div>
    </OverlayBase>
  );
}

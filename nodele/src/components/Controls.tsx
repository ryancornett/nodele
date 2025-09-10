export function Controls({
  onReset, onNew, onSkip, onToggleDrop, onUndo,
  dropsLeft, skipsLeft, dropActive, undoLeft
}: {
  onReset: () => void;
  onNew: () => void;
  onSkip: () => void;
  onToggleDrop: () => void;
  onUndo: () => void;
  dropsLeft: number;
  skipsLeft: number;
  dropActive: boolean;
  undoLeft: number; // how many split-undos remain in the 4-window
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <button onClick={onReset} className="px-3 py-2 rounded-xl bg-white shadow text-sm">Reset</button>
      <button onClick={onNew}   className="px-3 py-2 rounded-xl bg-white shadow text-sm">New random</button>

      <button
        onClick={onSkip}
        disabled={skipsLeft <= 0}
        className="px-3 py-2 rounded-xl bg-white shadow text-sm disabled:opacity-50"
        title="Skip to next split direction"
      >
        Skip ({skipsLeft})
      </button>

      <button
        onClick={onToggleDrop}
        disabled={dropsLeft <= 0}
        className={`px-3 py-2 rounded-xl shadow text-sm disabled:opacity-50 ${dropActive ? 'bg-amber-200' : 'bg-white'}`}
        title="Drop a free fill anywhere"
      >
        Drop ({dropsLeft})
      </button>

      <button
        onClick={onUndo}
        disabled={undoLeft <= 0}
        className="px-3 py-2 rounded-xl bg-white shadow text-sm disabled:opacity-50"
        title="Undo the last split (up to 4 in a row). Drops/Skips are always undoable."
      >
        Undo ({undoLeft})
      </button>
    </div>
  );
}

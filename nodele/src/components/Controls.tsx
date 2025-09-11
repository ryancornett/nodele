import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";

export function Controls({
  onSkip, onToggleDrop, onUndo,
  dropsLeft, skipsLeft, dropActive, undoLeft, canUndo
}: {
  onSkip: () => void;
  onToggleDrop: () => void;
  onUndo: () => void;
  dropsLeft: number;
  skipsLeft: number;
  dropActive: boolean;
  undoLeft: number;
  canUndo: boolean;
}) {

  const controlItemClass =
    "text-2xl cursor-pointer hover:text-gray-600 transition-colors duration-200 dark:text-slate-900";
  
    return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      <button
        onClick={onSkip}
        disabled={skipsLeft <= 0}
        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-200/60 shadow text-sm disabled:opacity-50 flex gap-2 items-center active:bg-amber-200 dark:bg-slate-300 dark:hover:bg-slate-200 cursor-pointer"
        title="Skip to next split direction"
      >
        <SlIcon
            className={controlItemClass}
            name="arrows-move"
            title="Skip"
          ></SlIcon> ({skipsLeft})
      </button>

      <button
        onClick={onToggleDrop}
        disabled={dropsLeft <= 0}
        className={`px-3 py-2 rounded-xl shadow text-sm disabled:opacity-50 flex gap-2 items-center ${dropActive ? 'bg-amber-200 hover:bg-amber-300 dark:bg-amber-300 hover:bg-amber-200 dark:hover:bg-amber-400' : 'hover:bg-slate-200/60 dark:bg-slate-300 dark:hover:bg-slate-200'} cursor-pointer`}
        title="Drop a free fill anywhere"
      >
        <SlIcon
            className={controlItemClass}
            name="plus-circle"
            title="Drop"
          ></SlIcon> ({dropsLeft})
      </button>

      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-200/60 shadow text-sm disabled:opacity-50 flex gap-2 items-center active:bg-amber-200 dark:bg-slate-300 dark:hover:bg-slate-200 cursor-pointer"
        title="Undo (drops/skips are always undoable)"
      >
        <SlIcon
            className={controlItemClass}
            name="arrow-counterclockwise"
            title="Undo"
          ></SlIcon> ({undoLeft})
      </button>
    </div>
  );
}

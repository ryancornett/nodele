import { OverlayBase } from "../OverlayBase";

export type SettingsPanelProps = {
  onClose: () => void;

  // actions
  onResetPuzzle: () => void;
  onResetStreak: () => void;

  // dark mode
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export function SettingsPanel({
  onClose,
  onResetPuzzle,
  onResetStreak,
  darkMode,
  onToggleDarkMode
}: SettingsPanelProps) {

  function confirmResetPuzzle() {
    if (confirm("Reset the current puzzle? Your progress will be cleared.")) {
      onResetPuzzle();
      onClose();
    }
  }

  function confirmResetStreak() {
    if (confirm("Reset your streak? This clears your local streak data.")) {
      onResetStreak();
    }
  }

  return (
    <OverlayBase title="Settings" onClose={onClose}>
      <div className="flex flex-col gap-4 text-sm">

        <div className="flex items-center justify-between">
          <div className="font-medium dark:text-white">Dark mode</div>
          <button
            onClick={onToggleDarkMode}
            className="px-3 py-1 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/30 dark:text-white dark:hover:bg-white/20 cursor-pointer"
            aria-pressed={darkMode}
            title="Toggle dark mode"
          >
            {darkMode ? "On" : "Off"}
          </button>
        </div>

        <hr className="border-black/10 dark:border-white/10" />

        <button
          onClick={confirmResetPuzzle}
          className="self-start px-3 py-2 rounded-xl bg-white shadow hover:shadow-md hover:bg-gray-100 dark:text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 cursor-pointer"
        >
          Reset Puzzle
        </button>

        <button
          onClick={confirmResetStreak}
          className="self-start px-3 py-2 rounded-xl bg-red-700 shadow hover:shadow-md text-white hover:bg-red-800 dark:hover:bg-red-500 cursor-pointer"
        >
          Reset Streak
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Streak and theme are stored locally on your device.
        </p>
      </div>
    </OverlayBase>
  );
}

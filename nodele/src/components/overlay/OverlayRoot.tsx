import { useOverlay } from "./OverlayContext";
import { HowToPanel } from "./panels/HowToPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { InfoPanel } from "./panels/InfoPanel";
import { ResultsPanel, type ResultsData } from "./panels/ResultsPanel";
import { NoMoreMoves, type NoMoreMovesData } from "./panels/NoMoreMoves";

export function OverlayRoot({
  settings
}: {
  settings: {
    darkMode: boolean;
    onToggleDarkMode: () => void;
    onResetPuzzle: () => void;
    onResetStreak: () => void;
  };
}) {
  const { state, close } = useOverlay();
  if (!state) return null;

  switch (state.id) {
    case "howto":
      return <HowToPanel onClose={close} />;
    case "settings":
      return (
        <SettingsPanel
          onClose={close}
          darkMode={settings.darkMode}
          onToggleDarkMode={settings.onToggleDarkMode}
          onResetPuzzle={settings.onResetPuzzle}
          onResetStreak={settings.onResetStreak}
        />
      );
    case "info":
      return <InfoPanel onClose={close} />;
    case "results":
      return <ResultsPanel onClose={close} data={state.data as ResultsData} />;
      case "nomoremoves":
  return (
    <NoMoreMoves
      onClose={close}
      data={state.data as NoMoreMovesData}
    />
  );
    default:
      return null;
  }
}

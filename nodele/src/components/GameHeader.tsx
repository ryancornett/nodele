export function GameHeader({
  moves, targetMoves, elapsedMs, seedUsed,
  dropsLeft, skipsLeft, undoLeft
}: {
  moves: number; targetMoves: number; elapsedMs: number; seedUsed: number;
  dropsLeft: number; skipsLeft: number; undoLeft: number;
}) {
  const secs = Math.floor(elapsedMs / 1000);
  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, '0');

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="text-sm font-medium select-none">Hover a filled circle to preview next split</div>
      <div className="text-sm">Time: <b>{m}:{s}</b></div>
      <div className="text-sm">Moves: <b>{moves}</b> / {targetMoves}</div>
      <div className="text-sm">Drops: <b>{dropsLeft}</b></div>
      <div className="text-sm">Skips: <b>{skipsLeft}</b></div>
      <div className="text-sm">Undo left: <b>{undoLeft}</b></div>
      <div className="text-xs text-gray-500">seed: {seedUsed}</div>
    </div>
  );
}

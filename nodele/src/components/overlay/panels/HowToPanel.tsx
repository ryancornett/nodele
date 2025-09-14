import { OverlayBase } from "../OverlayBase";

export function HowToPanel({ onClose }: { onClose: () => void }) {
  return (
    <OverlayBase title="How to Play" onClose={onClose} wide>
      <div className="prose prose-sm max-w-none dark:text-white">
        <p><b>Goal:</b> fill every <b>node</b> with <b>dots</b>. But be careful! You can fill in only one <b>direction</b> at a time.</p>
        <h3 className="font-bold text-xl mt-3">Turns & Splits</h3>
        <ul>
          <li>Click any <b>dot</b> to <b>split</b> it: a new dot appears one step in the current direction.</li>
          <li>• The split direction cycles clockwise: <b>Left → Up → Right → Down</b>.</li>
        </ul>
        <h3 className="font-bold text-xl mt-3">Dot Selection</h3>
        <ul>
          <li>Hover a dot to see the next-direction arrow.</li>
          <li>• A dashed ring marks the target: <span className="text-blue-900 dark:text-blue-400">blue = valid</span>, <span className="text-red-800 dark:text-red-400">red = invalid</span>.</li>
        </ul>
    
        <h3 className="font-bold text-xl mt-3">Assists</h3>
        <ul>
          <li><b>Drops</b> place a dot on any open node (doesn't advance direction).</li>
          <li><b>Skips</b> advance to the next direction without placing a dot.</li>
          <li>• Drops/Skips are always undoable.</li>
        </ul>
        <h3 className="font-bold text-xl mt-3">You win if every node has a dot</h3>
        <p>Try to to do it with the lowest time and without assists!</p>
      </div>
    </OverlayBase>
  );
}

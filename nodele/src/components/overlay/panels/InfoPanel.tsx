import { OverlayBase } from "../OverlayBase";

export function InfoPanel({ onClose }: { onClose: () => void }) {
  return (
    <OverlayBase title="About Dot Dot Node" onClose={onClose}>
      <p className="text-sm dark:text-white">
        <b>Dot Dot Node</b> is a daily logic puzzle. The objective is to use{" "}
        <b>splits</b>, <b>drops</b>, and <b>skips</b> to fill every node. <b>Careful!</b> Don't run
        out of moves!
      </p>
      <h3 className="font-bold text-xl mt-3 dark:text-white">Other Games</h3>
      <ul className="dark:text-white">
        <li>ReactoRush</li>
        <li>Gridle</li>
        <li>Lexagrid</li>
        <li>Rotagrid</li>
      </ul>

      <h3 className="font-bold text-xl mt-3 dark:text-white">Site Info</h3>
      <ul className="dark:text-white">
        <li>About us</li>
        <li>Privacy policy</li>
        <li>Terms</li>
        <li>Contact us</li>
      </ul>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-300">
        Built by <a href="https://ryancornett.com" className="font-bold underline hover:text-gray-600 dark:hover:text-gray-100">Ryan Cornett</a> © {new Date().getFullYear()}
      </p>
    </OverlayBase>
  );
}

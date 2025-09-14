import { OverlayBase } from "../OverlayBase";

export function InfoPanel({ onClose }: { onClose: () => void }) {

  const gameLinks = [
    {name: 'ReactoRush', url: 'https://reactorush.com', title:'A fun physics arcade game'},
    {name: 'Gridle', url: 'https://reactorush.com', title:'A logic and guessing game'},
    {name: 'Lexagrid', url: '#', title:'COMING SOON'},
    {name: 'Rotamaze', url: '#', title:'COMING SOON'},
    {name: 'Heptastic', url: '#', title:'COMING SOON'},
  ]
  const siteLinks = [
    {name: 'About us', url: '/about.html', title:'About us'},
    {name: 'Privacy policy', url: '/privacy.html', title:'Privacy policy'},
    {name: 'Terms', url: '#', title:'Terms'},
    {name: 'Contact us', url: '#', title:'Contact us'},
  ]

const linkClass = 'font-bold text-blue-900 hover:text-blue-800 dark:text-blue-200 dark:hover:text-blue-300'

  return (
    <OverlayBase title="About Dot Dot Node" onClose={onClose}>
      <p className="text-sm dark:text-white">
        <b>Dot Dot Node</b> is a daily logic puzzle. The objective is to use{" "}
        <b>splits</b>, <b>drops</b>, and <b>skips</b> to fill every node. <b>Careful!</b> Don't run
        out of moves.
      </p>
      <h3 className="font-bold text-xl mt-3 dark:text-white">Other Games</h3>
      <ul className="dark:text-white">
        {gameLinks.map((link, index) => (
          <li key={index}><a
          className={linkClass} href={link.url} title={link.title} target="_blank">{link.name}</a> - {link.title}</li>
        ))}
      </ul>

      <h3 className="font-bold text-xl mt-3 dark:text-white">Site Info</h3>
      <ul className="dark:text-white">
        {siteLinks.map((link, index) => (
          <li key={index}><a
          className={linkClass} href={link.url} title={link.title} target="_blank">{link.name}</a></li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-300">
        Built by <a href="https://ryancornett.com" className="font-bold underline hover:text-gray-600 dark:hover:text-gray-100">Ryan Cornett</a> © {new Date().getFullYear()}
      </p>
    </OverlayBase>
  );
}

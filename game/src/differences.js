// Where every difference hides, in panel space (600 by 480).
// Each entry is one clickable spot: x, y, the marker radius, and a short label
// the game shows when that difference is found.
export const DIFFERENCES = [
  // Level 1: Sunny Garden — 7 differences.
  [
    { id: 'sun-rays', x: 90, y: 80, r: 44, label: 'Sun rays' },
    { id: 'cloud', x: 305, y: 72, r: 40, label: 'A cloud' },
    { id: 'apples', x: 128, y: 302, r: 30, label: 'Apples on the tree' },
    { id: 'window', x: 517, y: 323, r: 30, label: 'House window' },
    { id: 'flower', x: 300, y: 432, r: 26, label: 'A tulip' },
    { id: 'bird', x: 330, y: 122, r: 26, label: 'A bird' },
    { id: 'smoke', x: 520, y: 220, r: 30, label: 'Chimney smoke' },
  ],
  // Level 2: Harbour at Dusk — 8 differences.
  [
    { id: 'beam', x: 448, y: 182, r: 36, label: 'Lighthouse beam' },
    { id: 'sail', x: 182, y: 292, r: 34, label: 'The sail' },
    { id: 'flag', x: 200, y: 248, r: 24, label: 'The boat flag' },
    { id: 'moon', x: 90, y: 72, r: 32, label: 'The moon' },
    { id: 'gull', x: 430, y: 96, r: 26, label: 'A gull' },
    { id: 'crates', x: 498, y: 396, r: 28, label: 'Crates on the pier' },
    { id: 'lantern', x: 541, y: 324, r: 26, label: 'The pier lantern' },
    { id: 'boathouse-window', x: 352, y: 378, r: 28, label: 'Boathouse window' },
  ],
  // Level 3: Moonlit Library — 9 differences.
  [
    { id: 'clock', x: 300, y: 92, r: 34, label: 'The clock' },
    { id: 'cat-tail', x: 118, y: 382, r: 28, label: "The cat's tail" },
    { id: 'book-stack', x: 452, y: 342, r: 30, label: 'Books on the desk' },
    { id: 'lamp', x: 522, y: 292, r: 30, label: 'The desk lamp' },
    { id: 'moon-phase', x: 92, y: 92, r: 32, label: 'The moon' },
    { id: 'picture', x: 300, y: 182, r: 36, label: 'The framed picture' },
    { id: 'plant', x: 546, y: 412, r: 28, label: 'The plant' },
    { id: 'steam', x: 382, y: 366, r: 26, label: 'Teapot steam' },
    { id: 'rug', x: 252, y: 442, r: 30, label: 'The rug' },
  ],
];

/** The differences of one level, by index. */
export function differencesForLevel(levelIndex) {
  return DIFFERENCES[levelIndex] ?? [];
}

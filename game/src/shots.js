// The screenshot scenes behind ?shot=cover|garden|harbour|library.
// Each one plays the real rules forward: it starts a level, then marks
// differences found through the game's own click path, so the frame is what
// a real game looks like mid-hunt — markers on the differences found,
// several still unfound, and the counter showing how many remain.
import { SCREEN_PLAY } from './game.js';

/** Mark `count` differences found, at their real positions, with real clicks. */
function playFinds(game, count) {
  for (let index = 0; index < count; index += 1) {
    const diff = game.differences[index];
    game.click(20 + diff.x, 110 + diff.y);
  }
}

const SHOTS = {
  cover(game) {
    game.startLevel(0);
    game.timeLeft = 142;
    game.score = 300;
    playFinds(game, 3);
    game.showMessage('Found it — A cloud! (3/7)');
  },
  garden(game) {
    game.startLevel(0);
    game.timeLeft = 96;
    game.score = 500;
    playFinds(game, 5);
    game.showMessage('Found it — A tulip! (5/7)');
  },
  harbour(game) {
    game.startLevel(1);
    game.timeLeft = 121;
    game.score = 820;
    playFinds(game, 2);
    game.useHint();
    game.showMessage('Hint: look inside the golden ring!');
  },
  library(game) {
    game.startLevel(2);
    game.timeLeft = 58;
    game.score = 1640;
    playFinds(game, 6);
    game.showMessage('Found it — The clock! (6/9)');
  },
};

/**
 * Set `game` to the named scene (cover, garden, harbour or library) and
 * return the screen to draw. Any other name is the cover.
 */
export function stageShot(name, game) {
  const stage = SHOTS[name] ?? SHOTS.cover;
  stage(game);
  game.screen = SCREEN_PLAY;
  game.messageUntil = Number.POSITIVE_INFINITY;
  return SCREEN_PLAY;
}

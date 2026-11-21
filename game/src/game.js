// The rules of Twin Town: levels, timer, scoring, hints and clicks.
import {
  FIND_POINTS,
  HINT_COST,
  LEVELS,
  PANEL_HEIGHT,
  PANEL_WIDTH,
  LEFT_PANEL_X,
  RIGHT_PANEL_X,
  PANEL_Y,
  WRONG_POINTS_PENALTY,
  WRONG_TIME_PENALTY,
} from './config.js';
import { differencesForLevel } from './differences.js';
import {
  isMuted,
  playClick,
  playFound,
  playHint,
  playLevelClear,
  playWin,
  playWrong,
  toggleMuted,
} from './audio.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_CLEAR = 'level-clear';
export const SCREEN_WIN = 'win';
export const SCREEN_OVER = 'over';

export class TwinTownGame {
  constructor() {
    this.screen = SCREEN_TITLE;
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.timeLeft = LEVELS[0].timeLimit;
    this.hintsLeft = 3;
    this.mistakes = 0;
    this.paused = false;
    this.message = '';
    this.messageUntil = 0;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.wrongMarks = [];
    this.bestScore = 0;
    this.levelBonus = 0;
    this.lastTick = 0;
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get differences() {
    return differencesForLevel(this.levelIndex);
  }

  get foundCount() {
    return this.found.size;
  }

  get totalCount() {
    return this.differences.length;
  }

  get timeFraction() {
    return Math.max(0, this.timeLeft / this.level.timeLimit);
  }

  startGame() {
    this.score = 0;
    this.mistakes = 0;
    this.startLevel(0);
  }

  startLevel(levelIndex) {
    this.levelIndex = levelIndex;
    this.found = new Set();
    this.timeLeft = this.level.timeLimit;
    this.hintsLeft = 3;
    this.hintTarget = null;
    this.wrongMarks = [];
    this.paused = false;
    this.screen = SCREEN_PLAY;
    this.showMessage(`Level ${levelIndex + 1}: ${this.level.name} — find ${this.totalCount} differences!`);
  }

  showMessage(text) {
    this.message = text;
    this.messageUntil = performance.now() + 2600;
  }

  /** Advance the clock; call once per animation frame. */
  tick(now) {
    if (this.lastTick === 0) this.lastTick = now;
    const delta = Math.min(0.25, (now - this.lastTick) / 1000);
    this.lastTick = now;
    if (this.screen !== SCREEN_PLAY || this.paused) return;
    this.timeLeft -= delta;
    if (this.hintTarget !== null && now > this.hintUntil) this.hintTarget = null;
    this.wrongMarks = this.wrongMarks.filter((mark) => now < mark.until);
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = SCREEN_OVER;
      playWrong();
    }
  }

  /** Which panel, if any, holds the point (canvas coordinates). */
  panelAt(x, y) {
    if (y < PANEL_Y || y > PANEL_Y + PANEL_HEIGHT) return null;
    if (x >= LEFT_PANEL_X && x <= LEFT_PANEL_X + PANEL_WIDTH) {
      return { side: 'left', x: x - LEFT_PANEL_X, y: y - PANEL_Y };
    }
    if (x >= RIGHT_PANEL_X && x <= RIGHT_PANEL_X + PANEL_WIDTH) {
      return { side: 'right', x: x - RIGHT_PANEL_X, y: y - PANEL_Y };
    }
    return null;
  }

  /** A click on the canvas: find a difference or mark a miss. */
  click(x, y) {
    if (this.screen === SCREEN_TITLE) {
      playClick();
      this.startGame();
      return;
    }
    if (this.screen === SCREEN_LEVEL_CLEAR || this.screen === SCREEN_WIN || this.screen === SCREEN_OVER) {
      playClick();
      if (this.screen === SCREEN_LEVEL_CLEAR) this.advance();
      else this.startGame();
      return;
    }
    if (this.screen !== SCREEN_PLAY || this.paused) return;
    const hit = this.panelAt(x, y);
    if (hit === null) return;
    const found = this.differences.find((diff) => {
      if (this.found.has(diff.id)) return false;
      const dx = hit.x - diff.x;
      const dy = hit.y - diff.y;
      return dx * dx + dy * dy <= diff.r * diff.r;
    });
    if (found) {
      this.found.add(found.id);
      this.score += FIND_POINTS;
      playFound();
      this.showMessage(`Found it — ${found.label}! (${this.foundCount}/${this.totalCount})`);
      if (this.foundCount === this.totalCount) this.completeLevel();
    } else {
      this.mistakes += 1;
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_TIME_PENALTY);
      this.score = Math.max(0, this.score - WRONG_POINTS_PENALTY);
      this.wrongMarks.push({ x, y, until: performance.now() + 900 });
      playWrong();
      this.showMessage(`Not there — minus ${WRONG_TIME_PENALTY} seconds!`);
    }
  }

  completeLevel() {
    this.levelBonus = Math.round(this.timeLeft) * 5;
    this.score += this.levelBonus;
    if (this.levelIndex === LEVELS.length - 1) {
      this.screen = SCREEN_WIN;
      if (this.score > this.bestScore) this.bestScore = this.score;
      playWin();
    } else {
      this.screen = SCREEN_LEVEL_CLEAR;
      playLevelClear();
    }
  }

  advance() {
    if (this.screen !== SCREEN_LEVEL_CLEAR) return;
    this.startLevel(this.levelIndex + 1);
  }

  /** Spend a hint: ring one difference still unfound for a few seconds. */
  useHint() {
    if (this.screen !== SCREEN_PLAY || this.paused) return;
    if (this.hintsLeft <= 0) {
      this.showMessage('No hints left in this level.');
      return;
    }
    const remaining = this.differences.filter((diff) => !this.found.has(diff.id));
    if (remaining.length === 0) return;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_COST);
    this.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintUntil = performance.now() + 4000;
    playHint();
    this.showMessage('Hint: look inside the golden ring!');
  }

  togglePause() {
    if (this.screen !== SCREEN_PLAY) return;
    this.paused = !this.paused;
    playClick();
  }

  restartLevel() {
    if (this.screen !== SCREEN_PLAY) return;
    this.startLevel(this.levelIndex);
  }

  toggleSound() {
    const muted = toggleMuted();
    this.showMessage(muted ? 'Sound off.' : 'Sound on.');
  }

  handleKey(key) {
    const lower = key.toLowerCase();
    if (lower === 'm') {
      this.toggleSound();
      return;
    }
    if (this.screen === SCREEN_TITLE && (key === 'Enter' || key === ' ')) {
      this.startGame();
      return;
    }
    if (this.screen === SCREEN_LEVEL_CLEAR && (key === 'Enter' || key === ' ')) {
      this.advance();
      return;
    }
    if ((this.screen === SCREEN_WIN || this.screen === SCREEN_OVER) && (key === 'Enter' || key === ' ')) {
      this.startGame();
      return;
    }
    if (this.screen !== SCREEN_PLAY) return;
    if (lower === 'h') this.useHint();
    else if (lower === 'p' || key === 'Escape') this.togglePause();
    else if (lower === 'r') this.restartLevel();
    else if (key >= '1' && key <= '3') {
      const wanted = Number(key) - 1;
      if (wanted !== this.levelIndex && wanted < LEVELS.length) this.startLevel(wanted);
    }
  }

  /** The ids switched on in the right-hand picture: all of them, always. */
  rightPanelDiffs() {
    return new Set(this.differences.map((diff) => diff.id));
  }

  isSoundMuted() {
    return isMuted();
  }
}

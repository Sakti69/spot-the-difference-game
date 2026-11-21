// Twin Town boots here: canvas, input, the frame loop, and the ?shot=
// presets the screenshots use.
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';
import { TwinTownGame } from './game.js';
import { drawGame } from './render.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const game = new TwinTownGame();
window.__game = game;
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot !== null) {
  stageShot(shot, game);
  document.title = `Twin Town — shot ${shot}`;
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
  };
}

canvas.addEventListener('click', (event) => {
  const point = canvasPoint(event);
  game.click(point.x, point.y);
});

window.addEventListener('keydown', (event) => {
  if ([' ', 'ArrowUp', 'ArrowDown'].includes(event.key)) event.preventDefault();
  game.handleKey(event.key);
});

let firstFrame = true;
function frame(now) {
  game.tick(now);
  drawGame(ctx, game, now);
  if (firstFrame) {
    firstFrame = false;
    window.__shotReady = true;
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

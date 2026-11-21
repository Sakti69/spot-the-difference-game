// Everything Twin Town draws: the frame, the two pictures, the markers and
// the overlays. One canvas, one font stack, no images.
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FOOTER_Y,
  LEFT_PANEL_X,
  MARK_RADIUS,
  PANEL_HEIGHT,
  PANEL_WIDTH,
  PANEL_Y,
  RIGHT_PANEL_X,
} from './config.js';
import { paintScene } from './scenes.js';
import {
  SCREEN_LEVEL_CLEAR,
  SCREEN_OVER,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_WIN,
} from './game.js';

const EMPTY_DIFFS = new Set();

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPanelFrame(ctx, x, label, foundCount, totalCount) {
  ctx.fillStyle = '#241d18';
  roundRect(ctx, x - 6, PANEL_Y - 34, PANEL_WIDTH + 12, PANEL_HEIGHT + 44, 10);
  ctx.fill();
  ctx.fillStyle = '#f2ead8';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(label, x + 4, PANEL_Y - 10);
  ctx.textAlign = 'right';
  ctx.font = '16px Georgia, serif';
  ctx.fillStyle = '#cbb98f';
  ctx.fillText(`${foundCount} of ${totalCount} marked`, x + PANEL_WIDTH - 4, PANEL_Y - 10);
  ctx.textAlign = 'left';
}

function drawMarker(ctx, x, y, radius, colour, lineWidth) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.62, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFoundMarkers(ctx, game) {
  for (const diff of game.differences) {
    if (!game.found.has(diff.id)) continue;
    drawMarker(ctx, LEFT_PANEL_X + diff.x, PANEL_Y + diff.y, MARK_RADIUS, '#37c24a', 5);
    drawMarker(ctx, RIGHT_PANEL_X + diff.x, PANEL_Y + diff.y, MARK_RADIUS, '#37c24a', 5);
  }
}

function drawHintRing(ctx, game, now) {
  if (game.hintTarget === null) return;
  const pulse = 1 + 0.18 * Math.sin(now / 130);
  const radius = MARK_RADIUS * pulse;
  ctx.save();
  ctx.globalAlpha = 0.95;
  drawMarker(ctx, RIGHT_PANEL_X + game.hintTarget.x, PANEL_Y + game.hintTarget.y, radius, '#ffd94d', 5);
  ctx.restore();
}

function drawWrongMarks(ctx, game) {
  for (const mark of game.wrongMarks) {
    ctx.strokeStyle = '#ff5347';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(mark.x - 12, mark.y - 12);
    ctx.lineTo(mark.x + 12, mark.y + 12);
    ctx.moveTo(mark.x + 12, mark.y - 12);
    ctx.lineTo(mark.x - 12, mark.y + 12);
    ctx.stroke();
  }
}

function drawHud(ctx, game) {
  ctx.fillStyle = '#241d18';
  ctx.fillRect(0, 0, CANVAS_WIDTH, 88);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('TWIN TOWN', 20, 38);
  ctx.fillStyle = '#f2ead8';
  ctx.font = '16px Georgia, serif';
  ctx.fillText(`Level ${game.levelIndex + 1} · ${game.level.name}`, 20, 66);
  // Counter of how many remain — the number the whole game turns on.
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 34px Georgia, serif';
  const remaining = game.totalCount - game.foundCount;
  ctx.fillText(`${game.foundCount} / ${game.totalCount} found`, 640, 42);
  ctx.fillStyle = '#cbb98f';
  ctx.font = '15px Georgia, serif';
  ctx.fillText(remaining === 0 ? 'All found!' : `${remaining} still hiding`, 640, 66);
  // Timer bar.
  const barX = 880;
  const barW = 200;
  ctx.fillStyle = '#4a3f35';
  roundRect(ctx, barX, 22, barW, 18, 9);
  ctx.fill();
  const fraction = game.timeFraction;
  ctx.fillStyle = fraction > 0.5 ? '#37c24a' : fraction > 0.25 ? '#ffd94d' : '#ff5347';
  if (fraction > 0) {
    roundRect(ctx, barX, 22, Math.max(18, barW * fraction), 18, 9);
    ctx.fill();
  }
  ctx.fillStyle = '#f2ead8';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'left';
  const seconds = Math.ceil(game.timeLeft);
  ctx.fillText(`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`, barX + barW + 10, 39);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText(`${game.score} pts`, 1260, 38);
  ctx.fillStyle = '#cbb98f';
  ctx.font = '15px Georgia, serif';
  ctx.fillText(`Hints: ${game.hintsLeft}  ·  Misses: ${game.mistakes}`, 1260, 64);
  ctx.textAlign = 'left';
}

function drawFooter(ctx, game, now) {
  ctx.fillStyle = '#241d18';
  ctx.fillRect(0, FOOTER_Y, CANVAS_WIDTH, CANVAS_HEIGHT - FOOTER_Y);
  ctx.fillStyle = '#f2ead8';
  ctx.font = '18px Georgia, serif';
  const message = now < game.messageUntil ? game.message : 'Click a difference in either picture. H: hint · P: pause · M: sound · R: restart level';
  ctx.fillText(message, 20, FOOTER_Y + 34);
  // Level dots.
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < game.levelIndex ? '#37c24a' : i === game.levelIndex ? '#ffd94d' : '#4a3f35';
    ctx.beginPath();
    ctx.arc(1180 + i * 28, FOOTER_Y + 28, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#cbb98f';
  ctx.font = '14px Georgia, serif';
  ctx.fillText('Best: ' + game.bestScore + ' pts', 20, FOOTER_Y + 66);
  ctx.fillText('Twin Town — an original spot-the-difference game', 640, FOOTER_Y + 66);
  drawFoundChips(ctx, game);
}

/** A chip per difference: green with its name once found, grey with a "?" until then. */
function drawFoundChips(ctx, game) {
  const y = FOOTER_Y + 84;
  let x = 20;
  ctx.font = '13px Georgia, serif';
  for (const diff of game.differences) {
    const found = game.found.has(diff.id);
    const text = found ? `✓ ${diff.label}` : '?';
    const width = ctx.measureText(text).width + 18;
    if (x + width > CANVAS_WIDTH - 20) break;
    ctx.fillStyle = found ? '#2c6b34' : '#3a322b';
    roundRect(ctx, x, y, width, 24, 12);
    ctx.fill();
    ctx.fillStyle = found ? '#b8e6bd' : '#8a7a68';
    ctx.textAlign = 'left';
    ctx.fillText(text, x + 9, y + 17);
    x += width + 8;
  }
  ctx.textAlign = 'left';
}

function drawOverlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(20,14,10,0.82)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = accent;
  ctx.font = 'bold 64px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 640, 300);
  ctx.fillStyle = '#f2ead8';
  ctx.font = '22px Georgia, serif';
  lines.forEach((line, index) => {
    ctx.fillText(line, 640, 360 + index * 36);
  });
  ctx.textAlign = 'left';
}

export function drawGame(ctx, game, now) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#171310';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawHud(ctx, game);
  drawPanelFrame(ctx, LEFT_PANEL_X, 'LEFT — the original', game.foundCount, game.totalCount);
  drawPanelFrame(ctx, RIGHT_PANEL_X, 'RIGHT — spot the changes', game.foundCount, game.totalCount);
  ctx.save();
  ctx.beginPath();
  ctx.rect(LEFT_PANEL_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(LEFT_PANEL_X, PANEL_Y);
  paintScene(ctx, game.levelIndex, EMPTY_DIFFS);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(RIGHT_PANEL_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(RIGHT_PANEL_X, PANEL_Y);
  paintScene(ctx, game.levelIndex, game.rightPanelDiffs());
  ctx.restore();
  drawFoundMarkers(ctx, game);
  drawHintRing(ctx, game, now);
  drawWrongMarks(ctx, game);
  drawFooter(ctx, game, now);
  if (game.paused && game.screen === SCREEN_PLAY) {
    drawOverlay(ctx, 'PAUSED', ['Take a breath. The clock is waiting.', 'Press P to carry on.'], '#ffd94d');
    return;
  }
  if (game.screen === SCREEN_TITLE) {
    drawOverlay(
      ctx,
      'TWIN TOWN',
      [
        'Spot the Difference — three hand-painted scenes, 24 differences hiding in plain sight.',
        'Two pictures side by side. Click a difference in either one to circle it.',
        'Wrong clicks cost 5 seconds. Hints cost 50 points. Find them all before the clock runs out.',
        '',
        'Click anywhere or press Enter to play.',
      ],
      '#ffd94d',
    );
  } else if (game.screen === SCREEN_LEVEL_CLEAR) {
    drawOverlay(
      ctx,
      'SCENE CLEARED!',
      [
        `${game.level.name} — every difference found.`,
        `Time bonus: +${game.levelBonus} pts   ·   Score: ${game.score} pts`,
        '',
        'Click or press Enter for the next scene.',
      ],
      '#37c24a',
    );
  } else if (game.screen === SCREEN_WIN) {
    drawOverlay(
      ctx,
      'YOU FOUND THEM ALL!',
      [
        'All 24 differences, across all three scenes of Twin Town.',
        `Final score: ${game.score} pts   ·   Misses: ${game.mistakes}`,
        '',
        'Click or press Enter to play again.',
      ],
      '#ffd94d',
    );
  } else if (game.screen === SCREEN_OVER) {
    drawOverlay(
      ctx,
      'TIME UP!',
      [
        `${game.level.name} — ${game.totalCount - game.foundCount} differences still hiding.`,
        `Score: ${game.score} pts`,
        '',
        'Click or press Enter to try again.',
      ],
      '#ff5347',
    );
  }
}

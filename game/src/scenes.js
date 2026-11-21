// The three scenes of Twin Town, painted in plain canvas 2D.
// Every painter draws one 600 by 480 picture. `active` is the set of difference
// ids switched on for this panel: the left picture gets an empty set, the right
// picture gets every id, so the two panels differ exactly where the game says.

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function cloud(ctx, x, y, scale) {
  ctx.fillStyle = '#ffffff';
  circle(ctx, x, y, 22 * scale);
  circle(ctx, x + 22 * scale, y + 4 * scale, 18 * scale);
  circle(ctx, x - 22 * scale, y + 5 * scale, 17 * scale);
  ctx.fillRect(x - 30 * scale, y - 2 * scale, 62 * scale, 16 * scale);
}

function bird(ctx, x, y, scale) {
  ctx.strokeStyle = '#2d2a26';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 10 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 8 * scale, x + 10 * scale, y);
  ctx.stroke();
}

function tulip(ctx, x, y, colour) {
  ctx.strokeStyle = '#2f7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 26);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 6);
  ctx.quadraticCurveTo(x - 9, y - 20, x, y - 16);
  ctx.quadraticCurveTo(x + 9, y - 20, x + 9, y - 6);
  ctx.quadraticCurveTo(x, y + 2, x - 9, y - 6);
  ctx.fill();
}

function paintGarden(ctx, active) {
  // Sky, sun and hills.
  const sky = ctx.createLinearGradient(0, 0, 0, 480);
  sky.addColorStop(0, '#7ec8f7');
  sky.addColorStop(0.62, '#cfeefb');
  sky.addColorStop(0.621, '#8fce6e');
  sky.addColorStop(1, '#5da24a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 480);
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 90, 80, 38);
  if (!active.has('sun-rays')) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(90 + Math.cos(a) * 48, 80 + Math.sin(a) * 48);
      ctx.lineTo(90 + Math.cos(a) * 62, 80 + Math.sin(a) * 62);
      ctx.stroke();
    }
  }
  cloud(ctx, 210, 64, 1);
  if (!active.has('cloud')) cloud(ctx, 305, 72, 0.85);
  cloud(ctx, 440, 52, 0.7);
  bird(ctx, 250, 110, 1);
  bird(ctx, 290, 96, 0.9);
  if (active.has('bird')) bird(ctx, 330, 122, 0.9);
  // Rolling hills.
  ctx.fillStyle = '#79b657';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(150, 290, 320, 330);
  ctx.quadraticCurveTo(470, 368, 600, 322);
  ctx.lineTo(600, 480);
  ctx.lineTo(0, 480);
  ctx.closePath();
  ctx.fill();
  // Apple tree, left.
  ctx.fillStyle = '#6d4c2f';
  ctx.fillRect(96, 300, 18, 90);
  ctx.fillStyle = '#3f9142';
  circle(ctx, 105, 268, 52);
  circle(ctx, 62, 296, 38);
  circle(ctx, 148, 296, 38);
  ctx.fillStyle = '#e23b3b';
  circle(ctx, 88, 282, 7);
  circle(ctx, 128, 302, 7);
  circle(ctx, 105, 322, 7);
  if (!active.has('apples')) {
    circle(ctx, 148, 282, 7);
    circle(ctx, 70, 312, 7);
  }
  // House, right.
  ctx.fillStyle = '#f7e8c9';
  ctx.fillRect(390, 290, 140, 110);
  ctx.fillStyle = '#b5563c';
  ctx.beginPath();
  ctx.moveTo(378, 292);
  ctx.lineTo(460, 228);
  ctx.lineTo(542, 292);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(500, 252, 16, 44);
  if (!active.has('smoke')) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    circle(ctx, 508, 238, 9);
    circle(ctx, 516, 222, 12);
    circle(ctx, 528, 206, 14);
  }
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(448, 330, 26, 70);
  circle(ctx, 470, 366, 3);
  ctx.fillStyle = '#5b8fd6';
  ctx.fillRect(396, 306, 34, 34);
  if (!active.has('window')) {
    ctx.fillStyle = '#ffe08a';
    ctx.fillRect(500, 306, 34, 34);
    ctx.fillStyle = '#e23b3b';
    ctx.fillRect(498, 340, 38, 6);
    circle(ctx, 506, 336, 4);
    circle(ctx, 526, 336, 4);
  } else {
    ctx.fillStyle = '#2c4a6e';
    ctx.fillRect(500, 306, 34, 34);
  }
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(396, 306, 34, 34);
  ctx.strokeRect(500, 306, 34, 34);
  // Path and flower bed.
  ctx.fillStyle = '#e8d9b0';
  ctx.beginPath();
  ctx.moveTo(448, 400);
  ctx.lineTo(482, 400);
  ctx.lineTo(500, 480);
  ctx.lineTo(430, 480);
  ctx.closePath();
  ctx.fill();
  tulip(ctx, 240, 432, '#e23b3b');
  tulip(ctx, 270, 438, '#ff8fb2');
  tulip(ctx, 300, 432, active.has('flower') ? '#ffd94d' : '#e23b3b');
  tulip(ctx, 330, 438, '#ffffff');
  tulip(ctx, 360, 432, '#ff8fb2');
  // Fence along the bottom.
  ctx.fillStyle = '#a9804f';
  for (let x = 20; x < 600; x += 34) ctx.fillRect(x, 452, 8, 28);
  ctx.fillRect(0, 458, 600, 5);
  ctx.fillRect(0, 470, 600, 5);
}

function paintHarbour(ctx, active) {
  // Dusk sky and sea.
  const sky = ctx.createLinearGradient(0, 0, 0, 480);
  sky.addColorStop(0, '#3d2b63');
  sky.addColorStop(0.45, '#c65d7b');
  sky.addColorStop(0.62, '#f2a65a');
  sky.addColorStop(0.621, '#274b73');
  sky.addColorStop(1, '#16324a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 480);
  ctx.fillStyle = '#ffcf7d';
  circle(ctx, 300, 296, 30);
  ctx.fillStyle = 'rgba(255,207,125,0.35)';
  ctx.fillRect(288, 300, 24, 130);
  if (!active.has('moon')) {
    ctx.fillStyle = '#f4ead2';
    circle(ctx, 90, 72, 24);
    ctx.fillStyle = '#ddd2b8';
    circle(ctx, 82, 66, 5);
    circle(ctx, 98, 80, 4);
  }
  bird(ctx, 350, 90, 1);
  bird(ctx, 390, 110, 0.9);
  if (active.has('gull')) bird(ctx, 430, 96, 0.9);
  // Sea shimmer.
  ctx.strokeStyle = 'rgba(255,207,125,0.5)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(250 + i * 8, 340 + i * 22);
    ctx.lineTo(350 - i * 8, 340 + i * 22);
    ctx.stroke();
  }
  // Sailboat.
  ctx.fillStyle = '#5b3a29';
  ctx.beginPath();
  ctx.moveTo(140, 350);
  ctx.lineTo(230, 350);
  ctx.lineTo(214, 372);
  ctx.lineTo(156, 372);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4a2e20';
  ctx.fillRect(183, 240, 5, 112);
  if (!active.has('flag')) {
    ctx.fillStyle = '#e23b3b';
    ctx.beginPath();
    ctx.moveTo(188, 240);
    ctx.lineTo(214, 248);
    ctx.lineTo(188, 256);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = active.has('sail') ? '#e23b3b' : '#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(186, 252);
  ctx.lineTo(186, 344);
  ctx.lineTo(140, 344);
  ctx.closePath();
  ctx.fill();
  if (active.has('sail')) {
    ctx.strokeStyle = '#fdf6e3';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(168, 300);
    ctx.lineTo(182, 300);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(158, 322);
    ctx.lineTo(182, 322);
    ctx.stroke();
  }
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(192, 268);
  ctx.lineTo(192, 344);
  ctx.lineTo(232, 344);
  ctx.closePath();
  ctx.fill();
  // Fishing boat, small, far.
  ctx.fillStyle = '#2f4a5e';
  ctx.fillRect(420, 356, 70, 14);
  ctx.fillRect(448, 330, 5, 28);
  ctx.fillStyle = '#c65d7b';
  ctx.beginPath();
  ctx.moveTo(453, 330);
  ctx.lineTo(475, 344);
  ctx.lineTo(453, 356);
  ctx.closePath();
  ctx.fill();
  // Lighthouse, right.
  ctx.fillStyle = '#f2ead8';
  ctx.fillRect(516, 180, 34, 160);
  ctx.fillStyle = '#c65d7b';
  ctx.fillRect(516, 200, 34, 18);
  ctx.fillRect(516, 244, 34, 18);
  ctx.fillRect(516, 288, 34, 18);
  ctx.fillStyle = '#2d2a26';
  ctx.fillRect(510, 160, 46, 22);
  ctx.fillStyle = '#ffe08a';
  ctx.fillRect(518, 164, 30, 14);
  if (!active.has('beam')) {
    ctx.fillStyle = 'rgba(255,224,138,0.35)';
    ctx.beginPath();
    ctx.moveTo(510, 164);
    ctx.lineTo(380, 130);
    ctx.lineTo(380, 208);
    ctx.closePath();
    ctx.fill();
  }
  // Pier and boathouse.
  ctx.fillStyle = '#6d4c2f';
  ctx.fillRect(0, 400, 600, 16);
  for (let x = 30; x < 600; x += 60) ctx.fillRect(x, 416, 10, 64);
  ctx.fillStyle = '#8a6a45';
  ctx.fillRect(300, 356, 110, 44);
  ctx.fillStyle = '#b5563c';
  ctx.beginPath();
  ctx.moveTo(292, 358);
  ctx.lineTo(355, 322);
  ctx.lineTo(418, 358);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = active.has('boathouse-window') ? '#2c4a6e' : '#ffe08a';
  ctx.fillRect(340, 368, 26, 26);
  ctx.strokeStyle = '#5b3a29';
  ctx.lineWidth = 2;
  ctx.strokeRect(340, 368, 26, 26);
  // Crates.
  ctx.fillStyle = '#a9804f';
  ctx.fillRect(478, 372, 26, 26);
  ctx.fillRect(506, 372, 26, 26);
  if (!active.has('crates')) ctx.fillRect(492, 346, 26, 26);
  ctx.strokeStyle = '#6d4c2f';
  ctx.lineWidth = 2;
  ctx.strokeRect(478, 372, 26, 26);
  ctx.strokeRect(506, 372, 26, 26);
  // Pier lantern.
  ctx.fillStyle = '#2d2a26';
  ctx.fillRect(538, 330, 6, 26);
  ctx.fillStyle = active.has('lantern') ? '#5b6b7a' : '#ffe08a';
  ctx.fillRect(532, 316, 18, 16);
  if (!active.has('lantern')) {
    ctx.fillStyle = 'rgba(255,224,138,0.3)';
    circle(ctx, 541, 324, 22);
  }
}

function paintLibrary(ctx, active) {
  // Night room.
  ctx.fillStyle = '#3a2a1e';
  ctx.fillRect(0, 0, 600, 480);
  ctx.fillStyle = '#5d4128';
  ctx.fillRect(0, 420, 600, 60);
  // Window with the moon.
  ctx.fillStyle = '#1b2a4a';
  ctx.fillRect(52, 52, 90, 110);
  ctx.strokeStyle = '#8a6a45';
  ctx.lineWidth = 6;
  ctx.strokeRect(52, 52, 90, 110);
  ctx.beginPath();
  ctx.moveTo(97, 52);
  ctx.lineTo(97, 162);
  ctx.moveTo(52, 107);
  ctx.lineTo(142, 107);
  ctx.stroke();
  ctx.fillStyle = '#f4ead2';
  if (!active.has('moon-phase')) {
    circle(ctx, 92, 92, 22);
  } else {
    ctx.beginPath();
    ctx.arc(92, 92, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1b2a4a';
    ctx.beginPath();
    ctx.arc(102, 86, 19, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffffff';
  circle(ctx, 66, 66, 2);
  circle(ctx, 128, 76, 2);
  circle(ctx, 120, 140, 2);
  // Framed picture.
  ctx.fillStyle = '#8a6a45';
  ctx.fillRect(252, 148, 96, 68);
  ctx.fillStyle = '#bfe3f0';
  ctx.fillRect(260, 156, 80, 52);
  if (!active.has('picture')) {
    ctx.fillStyle = '#5da24a';
    ctx.beginPath();
    ctx.moveTo(260, 208);
    ctx.lineTo(288, 168);
    ctx.lineTo(312, 196);
    ctx.lineTo(326, 176);
    ctx.lineTo(340, 208);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = '#f2a65a';
    circle(ctx, 320, 176, 10);
    ctx.fillStyle = '#2f6da3';
    ctx.fillRect(260, 188, 80, 20);
  }
  // Clock.
  ctx.fillStyle = '#f2ead8';
  circle(ctx, 300, 92, 30);
  ctx.strokeStyle = '#2d2a26';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(300, 92, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 92);
  if (!active.has('clock')) {
    ctx.lineTo(300, 70);
    ctx.moveTo(300, 92);
    ctx.lineTo(318, 92);
  } else {
    ctx.lineTo(300, 112);
    ctx.moveTo(300, 92);
    ctx.lineTo(282, 92);
  }
  ctx.stroke();
  // Bookshelves.
  ctx.fillStyle = '#6d4c2f';
  ctx.fillRect(380, 40, 180, 240);
  const shelfColours = ['#b5563c', '#2f6da3', '#5da24a', '#e8a13c', '#7a4a8a', '#3f9142'];
  for (let row = 0; row < 3; row += 1) {
    for (let i = 0; i < 8; i += 1) {
      ctx.fillStyle = shelfColours[(row * 8 + i) % shelfColours.length];
      const h = 44 + ((i * 7 + row * 5) % 14);
      ctx.fillRect(388 + i * 21, 52 + row * 76 + (58 - h), 17, h);
    }
    ctx.fillStyle = '#4a2e20';
    ctx.fillRect(384, 108 + row * 76, 172, 6);
  }
  // Desk.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(400, 360, 170, 14);
  ctx.fillRect(410, 374, 12, 46);
  ctx.fillRect(548, 374, 12, 46);
  // Book stack on the desk.
  ctx.fillStyle = '#b5563c';
  ctx.fillRect(428, 336, 52, 10);
  ctx.fillStyle = '#2f6da3';
  ctx.fillRect(432, 326, 48, 10);
  ctx.fillStyle = '#5da24a';
  ctx.fillRect(436, 316, 44, 10);
  if (!active.has('book-stack')) {
    ctx.fillStyle = '#e8a13c';
    ctx.fillRect(440, 306, 40, 10);
  }
  // Desk lamp.
  ctx.strokeStyle = '#2d2a26';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(522, 360);
  ctx.lineTo(522, 312);
  ctx.stroke();
  ctx.fillStyle = active.has('lamp') ? '#5b6b7a' : '#ffe08a';
  ctx.beginPath();
  ctx.moveTo(508, 312);
  ctx.lineTo(536, 312);
  ctx.lineTo(530, 288);
  ctx.lineTo(514, 288);
  ctx.closePath();
  ctx.fill();
  if (!active.has('lamp')) {
    ctx.fillStyle = 'rgba(255,224,138,0.25)';
    ctx.beginPath();
    ctx.moveTo(514, 312);
    ctx.lineTo(560, 360);
    ctx.lineTo(490, 360);
    ctx.closePath();
    ctx.fill();
  }
  // Teapot with steam.
  ctx.fillStyle = '#7a4a8a';
  ellipse(ctx, 382, 392, 26, 18);
  ctx.fillRect(374, 366, 16, 12);
  ctx.beginPath();
  ctx.moveTo(404, 384);
  ctx.quadraticCurveTo(420, 380, 416, 368);
  ctx.strokeStyle = '#7a4a8a';
  ctx.lineWidth = 5;
  ctx.stroke();
  if (!active.has('steam')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(382, 360);
    ctx.quadraticCurveTo(376, 344, 384, 332);
    ctx.quadraticCurveTo(390, 320, 384, 308);
    ctx.stroke();
  }
  // Rug and cat.
  ctx.fillStyle = active.has('rug') ? '#3f5da3' : '#a33c3c';
  ctx.fillRect(120, 420, 240, 44);
  ctx.fillStyle = '#e8d9b0';
  ctx.fillRect(132, 430, 216, 4);
  ctx.fillRect(132, 450, 216, 4);
  ctx.fillStyle = '#e8a13c';
  ellipse(ctx, 150, 400, 34, 20);
  circle(ctx, 178, 388, 16);
  ctx.beginPath();
  ctx.moveTo(168, 376);
  ctx.lineTo(172, 364);
  ctx.lineTo(178, 376);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(180, 376);
  ctx.lineTo(186, 364);
  ctx.lineTo(190, 376);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e8a13c';
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (!active.has('cat-tail')) {
    ctx.moveTo(120, 398);
    ctx.quadraticCurveTo(104, 380, 112, 362);
  } else {
    ctx.moveTo(120, 404);
    ctx.quadraticCurveTo(100, 412, 92, 402);
  }
  ctx.stroke();
  // Floor lamp, filling the quiet corner between the window and the desk.
  ctx.strokeStyle = '#2d2a26';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(212, 420);
  ctx.lineTo(212, 268);
  ctx.stroke();
  ctx.fillStyle = '#e8a13c';
  ctx.beginPath();
  ctx.moveTo(192, 268);
  ctx.lineTo(232, 268);
  ctx.lineTo(224, 238);
  ctx.lineTo(200, 238);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,224,138,0.18)';
  ctx.beginPath();
  ctx.moveTo(200, 268);
  ctx.lineTo(246, 330);
  ctx.lineTo(178, 330);
  ctx.closePath();
  ctx.fill();
  // Plant.
  ctx.fillStyle = '#b5563c';
  ctx.beginPath();
  ctx.moveTo(532, 420);
  ctx.lineTo(560, 420);
  ctx.lineTo(554, 448);
  ctx.lineTo(538, 448);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3f9142';
  ctx.lineWidth = 4;
  const leaves = active.has('plant') ? 3 : 5;
  for (let i = 0; i < leaves; i += 1) {
    const a = -Math.PI / 2 + (i - (leaves - 1) / 2) * 0.5;
    ctx.beginPath();
    ctx.moveTo(546, 420);
    ctx.quadraticCurveTo(546 + Math.cos(a) * 18, 420 + Math.sin(a) * 22, 546 + Math.cos(a) * 26, 420 + Math.sin(a) * 34);
    ctx.stroke();
  }
}

const PAINTERS = [paintGarden, paintHarbour, paintLibrary];

/** Paint one level's picture. `active` holds the difference ids switched on. */
export function paintScene(ctx, levelIndex, active) {
  const painter = PAINTERS[levelIndex] ?? PAINTERS[0];
  ctx.save();
  painter(ctx, active);
  ctx.restore();
}

// Shared constants for Twin Town, a spot-the-difference game.
// One logical canvas, 1280 by 800, two 600 by 480 picture panels.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 480;
export const PANEL_Y = 110;
export const LEFT_PANEL_X = 20;
export const RIGHT_PANEL_X = 660;

export const HUD_HEIGHT = 90;
export const FOOTER_Y = 610;

export const MARK_RADIUS = 26;
export const FIND_POINTS = 100;
export const HINT_COST = 50;
export const WRONG_TIME_PENALTY = 5;
export const WRONG_POINTS_PENALTY = 10;

export const LEVELS = [
  { name: 'Sunny Garden', timeLimit: 180, blurb: 'A quiet garden on a summer morning.' },
  { name: 'Harbour at Dusk', timeLimit: 150, blurb: 'Fishing boats coming home as the sun goes down.' },
  { name: 'Moonlit Library', timeLimit: 120, blurb: 'A reading room past midnight, full of small secrets.' },
];

export const TOTAL_DIFFERENCES = 24;

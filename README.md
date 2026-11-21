# Twin Town — Spot the Difference

An original spot-the-difference game for the make.fun bounty
"Make the best spot the difference game". Three hand-painted scenes, 24
differences hiding in plain sight, played offline in a desktop browser
from static files — no network, no libraries, no build step.

## How to play

Two near-identical pictures sit side by side. Click a difference in either
picture to circle it in green on both. The counter at the top shows how many
are found and how many are still hiding.

- **Wrong clicks** cost 5 seconds and 10 points.
- **H** spends a hint: a golden ring around one difference still unfound
  (50 points, 3 per scene).
- **P** pauses, **M** mutes, **R** restarts the scene, **1/2/3** jump scenes.
- Finish a scene before the clock runs out for a time bonus.

## Scenes

1. **Sunny Garden** — 7 differences, 3:00
2. **Harbour at Dusk** — 8 differences, 2:30
3. **Moonlit Library** — 9 differences, 2:00

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `game/index.html` — the page; `game/styles.css` — page chrome
- `game/src/config.js` — constants and scene list
- `game/src/differences.js` — where every difference hides
- `game/src/scenes.js` — the three scenes, painted in canvas 2D
- `game/src/game.js` — rules: levels, timer, scoring, hints, clicks
- `game/src/render.js` — the frame: HUD, panels, markers, overlays
- `game/src/audio.js` — synthesised WebAudio sounds
- `game/src/shots.js` — the `?shot=` scenes behind the screenshots
- `game/src/main.js` — boot, input, frame loop
- `main.ts` — the entry program; `vendor/makefun-game.ts` — the kit's library

License: MIT.

// Tiny WebAudio sounds, synthesised on the spot: no audio files, no network.
let audioContext = null;
let muted = false;

function context() {
  if (audioContext === null) {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

function tone(frequency, startAt, duration, type, volume) {
  const ctx = context();
  if (ctx === null || muted) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + startAt);
  oscillator.stop(ctx.currentTime + startAt + duration + 0.05);
}

export function playFound() {
  tone(660, 0, 0.14, 'sine', 0.22);
  tone(990, 0.09, 0.22, 'sine', 0.2);
}

export function playWrong() {
  tone(160, 0, 0.22, 'square', 0.12);
}

export function playHint() {
  tone(520, 0, 0.1, 'triangle', 0.16);
  tone(780, 0.08, 0.14, 'triangle', 0.14);
}

export function playLevelClear() {
  [523, 659, 784, 1046].forEach((frequency, index) => {
    tone(frequency, index * 0.11, 0.22, 'sine', 0.2);
  });
}

export function playWin() {
  [523, 659, 784, 1046, 1318].forEach((frequency, index) => {
    tone(frequency, index * 0.12, 0.3, 'triangle', 0.18);
  });
}

export function playClick() {
  tone(440, 0, 0.06, 'sine', 0.1);
}

/** Toggle the mute; returns the new muted state. */
export function toggleMuted() {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}

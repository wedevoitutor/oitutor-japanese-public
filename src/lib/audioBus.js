// Global audio coordinator: only one sound source may play at a time.
// Anything that starts playback calls `claim(stopFn)` first — this stops
// whatever was previously playing and registers the new stopper.

let currentStop = null;

export function claim(stopFn) {
  if (currentStop && currentStop !== stopFn) {
    try {
      currentStop();
    } catch {}
  }
  currentStop = stopFn;
}

export function release(stopFn) {
  if (currentStop === stopFn) currentStop = null;
}

export function stopAll() {
  if (currentStop) {
    try {
      currentStop();
    } catch {}
    currentStop = null;
  }
}

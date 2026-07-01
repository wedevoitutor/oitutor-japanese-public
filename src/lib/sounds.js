import { claim, release } from './audioBus';

// To change sound effects, replace the files in public/sounds/
// Supported formats: .wav, .mp3, .ogg — update paths below after swapping
const PATHS = {
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.wav',
  complete: '/sounds/complete.wav',
};

const cache = {};

function play(key) {
  if (!cache[key]) cache[key] = new Audio(PATHS[key]);
  const audio = cache[key];
  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
  };
  claim(stop);
  audio.currentTime = 0;
  audio.onended = () => release(stop);
  audio.play().catch(() => {});
}

export const playCorrect = () => play('correct');
export const playWrong = () => play('wrong');
export const playComplete = () => play('complete');

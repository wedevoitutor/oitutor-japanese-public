import { useState, useEffect, useCallback } from 'react';
import { claim, release } from '../lib/audioBus';

const PREFERRED_VOICE = 'Google 日本語';

const stopSpeech = () => {
  try {
    speechSynthesis.cancel();
  } catch {}
};

// Particle-aware TTS normalization.
// は/へ read as わ/え ONLY when acting as particles — detected by: something before
// them (\S lookbehind) AND a boundary after (whitespace, comma, period, or end-of-string).
// This preserves the literal "ha"/"he" reading for isolated characters in alphabet
// lessons (speakText: "は"), while still catching set greetings like こんにちは/こんばんは
// (preceding content + end-of-string → particle reading) and in-sentence particles.
// を always reads お — modern Japanese has no non-particle use of を.
function normalizeForSpeech(text) {
  return text
    .replace(/(?<=\S)は(?=\s|、|。|$)/g, 'わ')
    .replace(/(?<=\S)へ(?=\s|、|。|$)/g, 'え')
    .replace(/を/g, 'お');
}

export default function useSpeech() {
  const [voice, setVoice] = useState(null);
  const [fallbackWarning, setFallbackWarning] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!supported) return;

    const pickVoice = () => {
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.name === PREFERRED_VOICE);
      if (preferred) {
        setVoice(preferred);
        setFallbackWarning(false);
        return;
      }
      const fallback = voices.find((v) => v.lang === 'ja-JP');
      if (fallback) {
        setVoice(fallback);
        setFallbackWarning(true);
      }
    };

    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, [supported]);

  // Chromium cold-start fix: the very first utterance after page load clips its first phoneme
  // (symptom: "わたしは" heard as "..たしは"). Prime the engine with a silent utterance once the
  // voice is ready — subsequent real utterances then start cleanly.
  useEffect(() => {
    if (!supported || !voice) return;
    const primer = new SpeechSynthesisUtterance(' ');
    primer.volume = 0;
    primer.voice = voice;
    primer.lang = 'ja-JP';
    try { speechSynthesis.speak(primer); } catch {}
  }, [supported, voice]);

  const speak = useCallback((text, { rate = 1 } = {}) => {
    if (!supported || !text) return;
    claim(stopSpeech);

    const utterance = new SpeechSynthesisUtterance(normalizeForSpeech(text));
    utterance.lang = 'ja-JP';
    utterance.rate = rate;
    if (voice) utterance.voice = voice;
    utterance.onend = () => release(stopSpeech);

    const start = () => speechSynthesis.speak(utterance);

    // Avoid cancel()+speak() race that clips the first ~100ms on Chrome/Edge.
    // Only cancel when the engine is actually busy, then wait a tick before speaking.
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      setTimeout(start, 100);
    } else {
      start();
    }
  }, [supported, voice]);

  return { speak, supported, fallbackWarning, ready: !!voice };
}

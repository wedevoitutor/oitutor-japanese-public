import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaVolumeUp, FaPlay } from 'react-icons/fa';
import useSpeech from '../../hooks/useSpeech';

export default function AudioPrompt({ text, autoPlay = true, slowRate = 0.6 }) {
  const { t } = useTranslation();
  const { speak, supported, fallbackWarning, ready } = useSpeech();
  const hasAutoPlayed = useRef(false);

  useEffect(() => {
    if (autoPlay && text && ready && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      speak(text);
    }
  }, [autoPlay, text, ready, speak]);

  if (!supported || !text) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => speak(text)}
          className="w-16 h-16 rounded-full bg-red-700 text-white flex items-center justify-center text-2xl shadow-md hover:brightness-110 transition-all"
          aria-label={t('exercise.playAudio')}
        >
          <FaVolumeUp />
        </button>
        <button
          onClick={() => speak(text, { rate: slowRate })}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-all"
          aria-label={t('exercise.playSlower')}
        >
          <FaPlay className="text-[10px]" />
          {t('exercise.playSlower')}
        </button>
      </div>
      {fallbackWarning && (
        <p className="text-xs text-slate-400">{t('exercise.bestInChrome')}</p>
      )}
    </div>
  );
}

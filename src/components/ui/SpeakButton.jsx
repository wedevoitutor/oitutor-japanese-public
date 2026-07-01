import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaVolumeUp } from 'react-icons/fa';
import useSpeech from '../../hooks/useSpeech';

const SIZES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-lg',
};

export default function SpeakButton({ text, size = 'md', autoPlay = false, showWarning = false }) {
  const { t } = useTranslation();
  const { speak, supported, fallbackWarning, ready } = useSpeech();
  const hasAutoPlayed = useRef(false);

  useEffect(() => {
    if (autoPlay && text && ready && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      speak(text);
    }
  }, [autoPlay, text, ready, speak]);

  if (!supported) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => speak(text)}
        className={`${SIZES[size]} rounded-full bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center transition-all`}
        aria-label={t('exercise.tapToHear')}
      >
        <FaVolumeUp />
      </button>
      {showWarning && fallbackWarning && (
        <p className="text-xs text-slate-400">{t('exercise.bestInChrome')}</p>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaVolumeUp, FaCheck } from 'react-icons/fa';
import useSpeech from '../../hooks/useSpeech';
import Button from '../ui/Button';

const BADGES = {
  formal: 'bg-indigo-600 text-white',
  casual: 'bg-teal-600 text-white',
  slang: 'bg-pink-600 text-white',
};

export default function Shadowing({
  prompt,
  jp,
  romaji,
  en,
  speakText,
  register = 'formal',
  dialogueContext,
  speaker,
  onComplete,
}) {
  const { t } = useTranslation();
  const { speak, ready } = useSpeech();
  const [heard, setHeard] = useState(false);
  const [practised, setPractised] = useState(false);
  const autoPlayed = useRef(false);

  const speakAt = (rate) => {
    if (!speakText) return;
    speak(speakText, { rate });
    setHeard(true);
  };

  useEffect(() => {
    if (ready && !autoPlayed.current && speakText) {
      autoPlayed.current = true;
      speakAt(1);
    }
  }, [ready, speakText]);

  const markPractised = () => {
    setPractised(true);
    setTimeout(() => onComplete?.({ correct: true }), 500);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <span
        className={`text-[11px] font-bold tracking-wider px-3 py-1 rounded-full ${BADGES[register] || BADGES.formal}`}
      >
        {register.toUpperCase()}
      </span>

      {dialogueContext && (
        <p className="text-xs text-slate-500">{dialogueContext}</p>
      )}
      {prompt && <p className="text-sm font-semibold text-slate-800">{prompt}</p>}

      <div className="w-full max-w-lg rounded-2xl border-2 border-slate-200 bg-white p-5 flex flex-col gap-3">
        {speaker && (
          <span className="text-xs font-bold text-red-700">{speaker}</span>
        )}
        <p className="text-xl font-semibold text-slate-900 leading-relaxed">{jp}</p>
        <p className="text-sm text-slate-500 italic">{romaji}</p>
        <p className="text-xs text-slate-600 border-t border-slate-100 pt-2">{en}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => speakAt(1)}
          className="w-11 h-11 rounded-full bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center"
          aria-label={t('exercise.playAudio')}
        >
          <FaVolumeUp />
        </button>
        <button
          type="button"
          onClick={() => speakAt(0.6)}
          className="w-11 h-11 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center text-xs font-bold"
          aria-label={t('exercise.playSlower')}
        >
          0.6×
        </button>
      </div>

      <Button
        onClick={markPractised}
        variant={practised ? 'success' : 'primary'}
        className={!heard ? 'opacity-50 pointer-events-none' : ''}
      >
        <FaCheck className="text-xs" /> {t('exercise.practised')}
      </Button>
    </div>
  );
}

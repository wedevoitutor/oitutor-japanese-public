import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';
import { shuffle } from '../../lib/shuffle';
import useSpeech from '../../hooks/useSpeech';

export default function HiraganaBuild({
  hint,
  answer,
  suffix,
  bank,
  speakText,
  onComplete,
  onAnswerFeedback,
}) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [slots, setSlots] = useState(Array(answer.length).fill(null));
  const [checked, setChecked] = useState(false);
  const speechTimeoutRef = useRef(null);
  const shuffledBank = useMemo(() => shuffle(bank), [bank]);

  const isCorrect = slots.every((s, i) => s === answer[i]);
  const isFilled = slots.every(Boolean);

  const handleTap = (char) => {
    if (checked) return;
    const idx = slots.indexOf(null);
    if (idx < 0) return;
    setSlots((prev) => prev.map((s, i) => (i === idx ? char : s)));
  };

  const handleSlotTap = (idx) => {
    if (checked) return;
    setSlots((prev) => prev.map((s, i) => (i === idx ? null : s)));
  };

  useEffect(() => () => clearTimeout(speechTimeoutRef.current), []);

  const check = () => {
    setChecked(true);
    onAnswerFeedback?.({ correct: isCorrect });
    if (isCorrect && speakText) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = setTimeout(() => speak(speakText), 650);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Hint */}
      <p className="text-sm text-slate-500 font-medium">{hint}</p>

      {/* Slots + suffix */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {slots.map((char, i) => (
          <button
            key={i}
            onClick={() => handleSlotTap(i)}
            className={`w-12 h-12 rounded-lg border-2 text-xl font-bold flex items-center justify-center transition-all ${
              checked
                ? char === answer[i]
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-red-400 bg-red-50 text-red-600'
                : char
                  ? 'border-red-500 bg-red-50 text-red-700 cursor-pointer hover:bg-red-100'
                  : 'border-amber-300 bg-amber-50/60 text-amber-400'
            }`}
          >
            {char || '·'}
          </button>
        ))}
        {suffix && (
          <span className="text-xl font-bold text-slate-700 ml-1">{suffix}</span>
        )}
      </div>

      {/* Kana bank — parchment style */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/80 border border-amber-200/60 rounded-2xl px-6 py-4 shadow-sm">
        <div className="flex flex-wrap justify-center gap-2">
          {shuffledBank.map((char) => (
            <button
              key={char}
              onClick={() => handleTap(char)}
              disabled={checked}
              className="w-11 h-11 rounded-xl border-2 border-amber-300/80 bg-white text-lg font-bold text-amber-900 hover:bg-amber-100 hover:border-red-400 hover:-translate-y-0.5 transition-all disabled:opacity-50 shadow-sm"
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {checked && (
        <div className="flex items-center gap-3">
          <p className={`text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
            {isCorrect ? t('exercise.correct') : `${t('exercise.incorrect')} → ${answer.join('')}${suffix || ''}`}
          </p>
          {isCorrect && speakText && <SpeakButton text={speakText} size="sm" />}
        </div>
      )}

      {/* Actions */}
      {!checked && isFilled && <Button onClick={check}>{t('exercise.check')}</Button>}
      {checked && isCorrect && (
        <Button variant="success" onClick={() => onComplete?.({ correct: true })}>
          {t('exercise.continue')}
        </Button>
      )}
      {checked && !isCorrect && (
        <Button variant="secondary" onClick={() => {
          setSlots(Array(answer.length).fill(null));
          setChecked(false);
        }}>
          {t('exercise.tryAgain')}
        </Button>
      )}
    </div>
  );
}

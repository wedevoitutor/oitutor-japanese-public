import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';
import useSpeech from '../../hooks/useSpeech';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function VariantCard({ v, mode, index }) {
  // mode: 'idle' | 'selected' | 'wrongPick' | 'revealed'
  const isRevealed = mode === 'revealed';
  const base = 'w-full rounded-2xl border-2 p-4 text-left transition-all';
  let style = 'border-slate-200 bg-white hover:border-red-400';

  if (mode === 'selected') style = 'border-red-500 bg-red-50';
  if (mode === 'wrongPick') style = 'border-red-500 bg-red-50';
  if (isRevealed && v.correct) style = 'border-green-500 bg-green-50';
  if (isRevealed && !v.correct) style = 'border-red-300 bg-red-50/60 opacity-90';

  return (
    <div className={`${base} ${style}`}>
      {isRevealed ? (
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${v.correct ? 'bg-green-600 text-white' : 'bg-slate-500 text-white'}`}>
            {v.label}
          </span>
          <span className="text-lg">{v.correct ? '✅' : '❌'}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
            OPTION {String.fromCharCode(65 + index)}
          </span>
          {mode === 'wrongPick' && <span className="text-lg">❌</span>}
        </div>
      )}
      <p className="text-lg font-semibold text-slate-900">{v.jp}</p>
      <p className="text-xs text-slate-500 italic mt-1">{v.romaji}</p>
      {isRevealed && <p className="text-xs text-slate-600 mt-1">{v.en}</p>}
      {isRevealed && v.note && (
        <p className="text-xs text-slate-700 bg-white/70 rounded-lg p-2 mt-3 border border-slate-200">
          {v.note}
        </p>
      )}
    </div>
  );
}

export default function ComparisonCards({
  prompt,
  title,
  variants = [],
  takeaway,
  speakText,
  onComplete,
  onAnswerFeedback,
}) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const shuffled = useMemo(() => shuffle(variants), [variants]);

  const revealed = checked && selected !== null && !!shuffled[selected]?.correct;
  const isWrong = checked && selected !== null && !shuffled[selected]?.correct;

  // Auto-play after the correctness sound; useSpeech and sounds share audioBus.
  useEffect(() => {
    if (!revealed || !speakText) return undefined;
    const id = setTimeout(() => speak(speakText), 650);
    return () => clearTimeout(id);
  }, [revealed, speakText, speak]);

  const handleSelect = (i) => {
    if (revealed) return;
    setSelected(i);
    setChecked(false);
  };

  const handleCheck = () => {
    if (selected === null) return;
    onAnswerFeedback?.({ correct: !!shuffled[selected]?.correct });
    setChecked(true);
  };

  const handleTryAgain = () => {
    setSelected(null);
    setChecked(false);
  };

  const getMode = (i) => {
    if (revealed) return 'revealed';
    if (isWrong && selected === i) return 'wrongPick';
    if (!checked && selected === i) return 'selected';
    return 'idle';
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {title && (
        <h3 className="text-sm font-bold tracking-wide text-red-700 uppercase">
          {title}
        </h3>
      )}
      <p className="text-base font-semibold text-slate-900 text-center">{prompt}</p>

      <div className="w-full max-w-xl flex flex-col gap-3">
        {shuffled.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            disabled={revealed}
            className="text-left"
          >
            <VariantCard v={v} mode={getMode(i)} index={i} />
          </button>
        ))}
      </div>

      {!checked && selected !== null && (
        <Button onClick={handleCheck}>{t('exercise.check')}</Button>
      )}

      {isWrong && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-red-500">{t('exercise.incorrect')}</p>
          <Button onClick={handleTryAgain}>{t('exercise.tryAgain')}</Button>
        </div>
      )}

      {revealed && (
        <div className="w-full max-w-xl flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-green-600">{t('exercise.correct')}</p>
          {takeaway && (
            <p className="text-sm text-slate-700 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              💡 {takeaway}
            </p>
          )}
          <div className="flex items-center gap-3">
            {speakText && <SpeakButton text={speakText} size="sm" />}
            <Button onClick={() => onComplete?.({ correct: true })}>
              {t('exercise.continue')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

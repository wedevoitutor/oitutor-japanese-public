import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';

const TYPE_BADGES = {
  on: 'bg-indigo-600 text-white',
  kun: 'bg-emerald-600 text-white',
};

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ReadingExplanation({
  prompt,
  word,
  targetKanji,
  options = [],
  onComplete,
}) {
  const { t } = useTranslation();
  const shuffledOptions = useMemo(() => shuffle(options), [options]);
  const [pickedCorrect, setPickedCorrect] = useState(null);
  const [pickedWrong, setPickedWrong] = useState(null);
  const [rejected, setRejected] = useState([]);

  const revealed = pickedCorrect !== null;

  const pick = (i) => {
    if (revealed) return;
    if (pickedWrong === i) return;
    if (shuffledOptions[i]?.correct) {
      setPickedCorrect(i);
      setPickedWrong(null);
    } else {
      setPickedWrong(i);
      if (!rejected.includes(i)) setRejected([...rejected, i]);
    }
  };

  const tryAgain = () => setPickedWrong(null);

  const renderWord = () => {
    if (!word || !targetKanji) return word;
    const parts = word.split(targetKanji);
    return parts.map((piece, i) => (
      <span key={i}>
        {piece}
        {i < parts.length - 1 && (
          <span className="text-red-600 underline decoration-2 underline-offset-4">
            {targetKanji}
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-base font-semibold text-slate-900 text-center">{prompt}</p>

      {word && (
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold text-slate-900">{renderWord()}</div>
          {revealed && <SpeakButton text={word} size="sm" />}
        </div>
      )}

      <div className="w-full max-w-xl flex flex-col gap-2">
        {shuffledOptions.map((o, i) => {
          const isCorrectOpt = o.correct;
          const isThisWrong = pickedWrong === i;
          const wasRejected = rejected.includes(i);
          let style = 'border-slate-200 bg-white hover:border-red-400';
          if (revealed) {
            style = isCorrectOpt
              ? 'border-green-500 bg-green-50'
              : 'border-slate-200 bg-white opacity-70';
          } else if (isThisWrong) {
            style = 'border-red-500 bg-red-50';
          } else if (wasRejected) {
            style = 'border-slate-200 bg-slate-100 opacity-60';
          }

          const showExplanation =
            (revealed && o.explanation) || (isThisWrong && o.explanation);

          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={revealed || wasRejected}
              className={`text-left rounded-2xl border-2 p-3 transition-all ${style}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    TYPE_BADGES[o.readingType] || 'bg-slate-400 text-white'
                  }`}
                >
                  {o.readingType?.toUpperCase() || '—'}
                </span>
                <span className="text-lg font-semibold text-slate-900">{o.kana}</span>
                {o.romaji && (
                  <span className="text-sm text-slate-400">({o.romaji})</span>
                )}
                {revealed && (
                  <span className="ml-auto text-lg">{isCorrectOpt ? '✅' : '❌'}</span>
                )}
                {!revealed && isThisWrong && (
                  <span className="ml-auto text-lg">❌</span>
                )}
              </div>
              {showExplanation && (
                <p className="text-xs text-slate-700 bg-white/70 rounded-lg p-2 border border-slate-200">
                  {o.explanation}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {pickedWrong !== null && !revealed && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-red-500">{t('exercise.incorrect')}</p>
          <Button onClick={tryAgain}>{t('exercise.tryAgain')}</Button>
        </div>
      )}

      {revealed && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-green-600">{t('exercise.correct')}</p>
          <Button onClick={() => onComplete?.({ correct: true })}>
            {t('exercise.continue')}
          </Button>
        </div>
      )}
    </div>
  );
}

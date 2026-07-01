import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';

export default function FillInTheBlank({
  sentence,
  blank,
  options = [],
  speakText,
  onComplete,
  onAnswerFeedback,
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = selected === blank;

  const parts = sentence.split('___');

  const check = () => {
    const correct = selected === blank;
    setChecked(true);
    onAnswerFeedback?.({ correct });
    if (correct) {
      setTimeout(() => onComplete?.({ correct: true }), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-center gap-3">
        <p className="text-xl font-medium text-slate-900 text-center">
        {parts[0]}
        <span
          className={`inline-block min-w-[3rem] mx-1 px-3 py-1 border-b-2 text-center font-bold ${
            checked
              ? isCorrect
                ? 'border-green-500 text-green-700'
                : 'border-red-400 text-red-600'
              : selected
                ? 'border-red-500 text-red-700'
                : 'border-slate-300 text-slate-400'
          }`}
        >
          {selected || '___'}
        </span>
        {parts[1]}
      </p>
        {speakText && <SpeakButton text={speakText} size="sm" />}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => { if (!checked) setSelected(opt); }}
            className={`px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all ${
              selected === opt
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-slate-200 bg-white hover:border-red-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {checked && (
        <p className={`text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
          {isCorrect ? t('exercise.correct') : `${t('exercise.incorrect')} → ${blank}`}
        </p>
      )}

      {!checked && selected && <Button onClick={check}>{t('exercise.check')}</Button>}
      {checked && !isCorrect && (
        <Button variant="secondary" onClick={() => onComplete?.({ correct: false })}>
          {t('exercise.continue')}
        </Button>
      )}
    </div>
  );
}

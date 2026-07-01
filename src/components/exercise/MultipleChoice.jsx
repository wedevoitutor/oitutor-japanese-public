import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AudioPrompt from './AudioPrompt';
import useSpeech from '../../hooks/useSpeech';

export default function MultipleChoice({
  prompt,
  speakText,
  options = [],
  correctIndex,
  onComplete,
  onAnswerFeedback,
  manualAdvance = false,
}) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selected === correctIndex;

  const handleSelect = (i) => {
    if (checked) return;
    setSelected(i);
  };

  const handleCheck = () => {
    const correct = selected === correctIndex;
    setChecked(true);
    onAnswerFeedback?.({ correct });
    if (correct) {
      if (manualAdvance && speakText) speak(speakText);
      if (!manualAdvance) setTimeout(() => onComplete?.({ correct: true }), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-semibold text-slate-900 text-center">{prompt}</p>

      {speakText && <AudioPrompt text={speakText} />}

      <div className="w-full max-w-md flex flex-col gap-2">
        {options.map((opt, i) => {
          let style = 'border-slate-200 bg-white hover:border-red-400';
          if (selected === i && !checked) style = 'border-red-500 bg-red-50';
          if (checked && isCorrect && i === correctIndex) style = 'border-green-500 bg-green-50';
          if (checked && !isCorrect && selected === i) style = 'border-red-400 bg-red-50';

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {checked && (
        <p className={`text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
          {isCorrect ? t('exercise.correct') : t('exercise.incorrect')}
        </p>
      )}

      {!checked && selected !== null && (
        <button
          onClick={handleCheck}
          className="bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all"
        >
          {t('exercise.check')}
        </button>
      )}

      {checked && !isCorrect && (
        <button
          onClick={() => { setSelected(null); setChecked(false); }}
          className="bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all"
        >
          {t('exercise.tryAgain')}
        </button>
      )}

      {checked && isCorrect && manualAdvance && (
        <button
          onClick={() => onComplete?.({ correct: true })}
          className="bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all"
        >
          {t('exercise.continue')}
        </button>
      )}
    </div>
  );
}

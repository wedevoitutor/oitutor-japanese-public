import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';
import { shuffle } from '../../lib/shuffle';

// JSON shape:
// { type: "listen-and-order", speakText: "...", segments: [...], correctOrder: [0,1,2,...] }
export default function ListenAndOrder({
  speakText,
  segments = [],
  correctOrder = [],
  onComplete,
  onAnswerFeedback,
}) {
  const { t } = useTranslation();
  const [placed, setPlaced] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const shuffled = useMemo(() => shuffle(segments.map((_, i) => i)), [segments]);

  const pool = shuffled.filter((i) => !placed.includes(i));

  const addToPlaced = (idx) => {
    if (checked && isCorrect) return;
    if (checked) setChecked(false);
    setPlaced((prev) => [...prev, idx]);
  };

  const removeFromPlaced = (idx) => {
    if (checked && isCorrect) return;
    if (checked) setChecked(false);
    setPlaced((prev) => prev.filter((i) => i !== idx));
  };

  const check = () => {
    const correct = placed.every((segIdx, i) => segIdx === correctOrder[i]);
    setIsCorrect(correct);
    setChecked(true);
    onAnswerFeedback?.({ correct });
    if (correct) setTimeout(() => onComplete?.({ correct: true }), 800);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <SpeakButton text={speakText} size="md" autoPlay showWarning />

      <p className="text-sm font-medium text-slate-500">{t('exercise.buildSentence')}</p>

      {/* Answer tray */}
      <div className="flex flex-wrap justify-center gap-2 min-h-[3rem] w-full max-w-md px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl">
        {placed.map((segIdx, posIdx) => (
          <button
            key={`placed-${segIdx}`}
            onClick={() => removeFromPlaced(segIdx)}
            className={`px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all ${
              checked
                ? segIdx === correctOrder[posIdx]
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-red-400 bg-red-50 text-red-600'
                : 'border-red-500 bg-red-50 text-red-700'
            }`}
          >
            {segments[segIdx]}
          </button>
        ))}
      </div>

      {/* Available chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {pool.map((segIdx) => (
          <button
            key={`pool-${segIdx}`}
            onClick={() => addToPlaced(segIdx)}
            className="px-4 py-2 border-2 border-slate-200 bg-white rounded-xl text-sm font-semibold hover:border-red-300 transition-all"
          >
            {segments[segIdx]}
          </button>
        ))}
      </div>

      {checked && (
        <p className={`text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
          {isCorrect ? t('exercise.correct') : t('exercise.incorrect')}
        </p>
      )}

      {!checked && placed.length === segments.length && (
        <Button onClick={check}>{t('exercise.checkOrder')}</Button>
      )}

      {checked && !isCorrect && (
        <Button variant="secondary" onClick={() => onComplete?.({ correct: false })}>
          {t('exercise.continue')}
        </Button>
      )}
    </div>
  );
}

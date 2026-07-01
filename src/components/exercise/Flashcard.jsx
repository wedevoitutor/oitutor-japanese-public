import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';

export default function Flashcard({ cards = [], onComplete }) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[idx];
  if (!card) return null;

  const next = () => {
    setFlipped(false);
    if (idx + 1 < cards.length) {
      setIdx(idx + 1);
    } else {
      onComplete?.({ correct: true });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xs text-slate-400 font-medium">
        {idx + 1} / {cards.length}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setFlipped(!flipped)}
          className="w-full max-w-sm h-56 rounded-2xl border-2 border-slate-200 bg-white shadow-lg flex items-center justify-center cursor-pointer transition-all hover:shadow-xl hover:border-red-300"
        >
          <span className={`text-center px-6 ${flipped ? 'text-2xl text-red-700 font-semibold' : 'text-5xl font-bold text-slate-900'}`}>
            {flipped ? card.back : card.front}
          </span>
        </button>
        {card.speakText && <SpeakButton text={card.speakText} size="sm" />}
      </div>

      <p className="text-xs text-slate-400">{t('exercise.flipCard')}</p>

      {flipped && (
        <Button onClick={next}>
          {idx + 1 < cards.length ? t('exercise.continue') : t('exercise.continue')}
        </Button>
      )}
    </div>
  );
}

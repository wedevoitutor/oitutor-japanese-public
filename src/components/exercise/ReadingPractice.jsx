import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';

export default function ReadingPractice({ title, cards = [], onComplete }) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[idx];
  if (!card) return null;

  const next = () => {
    setFlipped(false);
    if (idx + 1 < cards.length) setIdx(idx + 1);
    else onComplete?.({ correct: true });
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-[10px] font-bold tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase">
        📖 {title || t('exercise.readingPractice')}
      </div>

      <p className="text-xs text-slate-400 font-medium">
        {idx + 1} / {cards.length}
      </p>

      <div className="w-full max-w-md flex items-center gap-3">
        <button
          onClick={() => setFlipped(!flipped)}
          className="flex-1 rounded-2xl border-2 border-amber-200 bg-white shadow-md p-6 hover:shadow-lg hover:border-amber-400 transition-all text-center"
        >
          <div className="text-3xl font-bold text-slate-900">{card.jp}</div>
          {flipped && (
            <>
              <p className="text-sm text-slate-500 italic mt-3">{card.romaji}</p>
              <p className="text-sm text-slate-700 mt-1">— {card.en}</p>
            </>
          )}
        </button>
        <SpeakButton text={card.jp} />
      </div>

      {!flipped && (
        <p className="text-xs text-slate-400">{t('exercise.flipCard')}</p>
      )}

      {flipped && <Button onClick={next}>{t('exercise.continue')}</Button>}
    </div>
  );
}

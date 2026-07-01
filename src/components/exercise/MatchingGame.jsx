import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(pair) {
  if (Array.isArray(pair)) return { left: pair[0], right: pair[1] };
  return { left: pair.left, right: pair.right };
}

export default function MatchingGame({
  prompt,
  pairs = [],
  onComplete,
  onAnswerFeedback,
  manualAdvance = false,
}) {
  const { t } = useTranslation();
  const norm = useMemo(() => pairs.map(normalize), [pairs]);
  const shuffledRight = useMemo(() => shuffle(norm.map((p) => p.right)), [norm]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState(new Set());

  const allDone = matched.size === norm.length && norm.length > 0;

  // Matched pairs sink to the bottom of each column
  const displayLeft = useMemo(() => {
    const indices = norm.map((_, i) => i);
    return [
      ...indices.filter((i) => !matched.has(i)),
      ...indices.filter((i) => matched.has(i)),
    ];
  }, [norm, matched]);

  const displayRight = useMemo(() => {
    const matchedRights = new Set([...matched].map((mi) => norm[mi].right));
    return [
      ...shuffledRight.filter((r) => !matchedRights.has(r)),
      ...shuffledRight.filter((r) => matchedRights.has(r)),
    ];
  }, [shuffledRight, norm, matched]);

  const handleRight = (right) => {
    if (selectedLeft === null) return;
    const pair = norm[selectedLeft];
    if (pair.right === right) {
      const next = new Set(matched);
      next.add(selectedLeft);
      setMatched(next);
      if (next.size === norm.length) {
        onAnswerFeedback?.({ correct: true });
      }
      if (next.size === norm.length && !manualAdvance) {
        setTimeout(() => onComplete?.({ correct: true }), 600);
      }
    }
    setSelectedLeft(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {prompt && <p className="text-lg font-semibold text-slate-900 text-center">{prompt}</p>}
      <p className="text-sm text-slate-500 font-medium">
        {matched.size} / {norm.length}
      </p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <div className="flex flex-col gap-2">
          {displayLeft.map((origIdx) => (
            <button
              key={origIdx}
              onClick={() => !matched.has(origIdx) && setSelectedLeft(origIdx)}
              disabled={matched.has(origIdx)}
              className={`px-4 py-3 border-2 rounded-xl text-center font-semibold text-lg transition-all ${
                matched.has(origIdx)
                  ? 'border-green-400 bg-green-50 text-green-700 opacity-60'
                  : selectedLeft === origIdx
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200 bg-white hover:border-red-300'
              }`}
            >
              {norm[origIdx].left}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {displayRight.map((right) => {
            const isMatched = [...matched].some((mi) => norm[mi].right === right);
            return (
              <button
                key={right}
                onClick={() => handleRight(right)}
                disabled={isMatched}
                className={`px-4 py-3 border-2 rounded-xl text-center font-medium transition-all ${
                  isMatched
                    ? 'border-green-400 bg-green-50 text-green-700 opacity-60'
                    : 'border-slate-200 bg-white hover:border-red-300'
                }`}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
      {allDone && manualAdvance && (
        <Button onClick={() => onComplete?.({ correct: true })}>
          {t('exercise.continue')}
        </Button>
      )}
    </div>
  );
}

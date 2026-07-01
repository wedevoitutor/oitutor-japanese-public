import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';

const SLOT = '[SLOT]';
const JP_CHAR = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;
const LATIN_ONLY = /^[a-zA-Z\s]+$/;

function detectScript(s) {
  if (!s) return 'empty';
  if (JP_CHAR.test(s)) return 'jp';
  if (LATIN_ONLY.test(s)) return 'latin';
  return 'mixed';
}

function renderRow(parts, value, slotClass) {
  return parts.map((piece, i) =>
    piece === SLOT ? (
      <span key={i} className={slotClass}>
        {value || '___'}
      </span>
    ) : (
      <span key={i}>{piece}</span>
    ),
  );
}

export default function FormulaFill({
  prompt,
  patternJp = [],
  patternRom = [],
  slot = {},
  translation,
  speakText,
  onComplete,
  onAnswerFeedback,
  manualAdvance = false,
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showTip, setShowTip] = useState(false);

  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  const script = detectScript(trimmed);

  const accepts = [slot.answer, slot.answerRomaji, ...(slot.acceptAlternatives || [])]
    .filter(Boolean)
    .map((a) => a.toLowerCase());
  const isMatch = trimmed.length > 0 && accepts.includes(lower);

  const check = () => {
    setFeedback(isMatch ? 'correct' : 'incorrect');
    onAnswerFeedback?.({ correct: isMatch });
    if (isMatch && !manualAdvance) setTimeout(() => onComplete?.({ correct: true }), 900);
  };

  const jpValue = script === 'jp' ? trimmed : isMatch ? slot.answer : '';
  const romValue = script === 'latin' ? trimmed : isMatch ? slot.answerRomaji : '';

  const jpSlotClass = `inline-block min-w-[4rem] px-2 mx-1 border-b-2 font-bold text-center ${
    feedback === 'correct'
      ? 'border-green-500 text-green-700'
      : feedback === 'incorrect'
        ? 'border-red-400 text-red-600'
        : jpValue
          ? 'border-red-500 text-red-700'
          : 'border-slate-300 text-slate-400'
  }`;
  const romSlotClass = 'inline-block min-w-[3rem] px-1 mx-1 border-b text-slate-500 text-sm text-center';

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-base font-semibold text-slate-800 text-center">{prompt}</p>

      <div className="w-full max-w-lg rounded-2xl border-2 border-slate-200 bg-white p-5 flex flex-col gap-3">
        <div className="flex items-center justify-center gap-3">
          <div className="text-xl text-slate-900 leading-relaxed">
            {renderRow(patternJp, jpValue, jpSlotClass)}
          </div>
          {speakText && feedback === 'correct' && <SpeakButton text={speakText} size="sm" />}
        </div>
        <div className="text-sm text-slate-400 text-center italic">
          {renderRow(patternRom, romValue, romSlotClass)}
        </div>
        {translation && (
          <p className="text-xs text-slate-500 text-center pt-1 border-t border-slate-100">
            → {translation}
          </p>
        )}
      </div>

      {showTip && slot.hint && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          💡 {slot.hint}
        </p>
      )}

      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setFeedback(null);
        }}
        onKeyDown={(e) => e.key === 'Enter' && check()}
        placeholder={t('exercise.typePrompt')}
        className={`w-full max-w-xs text-center text-lg px-4 py-3 border-2 rounded-xl outline-none transition-colors ${
          feedback === 'correct'
            ? 'border-green-500 bg-green-50'
            : feedback === 'incorrect'
              ? 'border-red-400 bg-red-50'
              : 'border-slate-200 focus:border-red-500'
        }`}
        autoFocus
      />

      {feedback && (
        <p
          className={`text-sm font-semibold ${
            feedback === 'correct' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {feedback === 'correct' ? t('exercise.correct') : t('exercise.incorrect')}
        </p>
      )}

      {feedback !== 'correct' && (
        <div className="flex gap-3 items-center">
          <Button onClick={check}>
            {feedback === 'incorrect' ? t('exercise.tryAgain') : t('exercise.check')}
          </Button>
          {!showTip && slot.hint && (
            <Button variant="secondary" onClick={() => setShowTip(true)}>
              {t('exercise.showTip')}
            </Button>
          )}
        </div>
      )}

      {feedback === 'correct' && manualAdvance && (
        <Button onClick={() => onComplete?.({ correct: true })}>
          {t('exercise.continue')}
        </Button>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toHiragana, toRomaji } from 'wanakana';
import Button from '../ui/Button';
import AudioPrompt from './AudioPrompt';

const JP_CHAR = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;
const LATIN_ONLY = /^[a-zA-Z\s-]*$/;

function stripSpaces(s) {
  return s.replace(/\s+/g, '');
}

function normalizeAnswer(s) {
  return stripSpaces(s.trim().toLowerCase());
}

export default function TypeTheAnswer({
  prompt,
  question,
  speakText,
  answer,
  acceptAlternatives = [],
  hint,
  reveal,
  onComplete,
  onAnswerFeedback,
  manualAdvance = false,
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showTip, setShowTip] = useState(false);

  const accepts = useMemo(() => {
    const list = [answer, ...acceptAlternatives];
    if (speakText) list.push(speakText);
    return list.filter(Boolean).map(normalizeAnswer);
  }, [answer, acceptAlternatives, speakText]);

  const expectsLatin = useMemo(
    () => !!answer && !JP_CHAR.test(answer) && LATIN_ONLY.test(answer),
    [answer],
  );

  const preview = useMemo(() => {
    if (expectsLatin) return '';
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (JP_CHAR.test(trimmed)) return toRomaji(trimmed);
    if (LATIN_ONLY.test(trimmed)) return toHiragana(trimmed);
    return '';
  }, [input, expectsLatin]);

  const check = () => {
    const val = normalizeAnswer(input);
    const correct = accepts.includes(val);
    setFeedback(correct ? 'correct' : 'incorrect');
    onAnswerFeedback?.({ correct });
    if (correct && !manualAdvance && !reveal)
      setTimeout(() => onComplete?.({ correct: true }), 800);
  };

  const autoReveal =
    !question && expectsLatin && speakText && JP_CHAR.test(speakText)
      ? speakText
      : null;
  const revealText = reveal || autoReveal;
  const showContinue = feedback === 'correct' && (manualAdvance || reveal);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-semibold text-slate-900 text-center">{prompt}</p>

      {speakText && <AudioPrompt text={speakText} />}

      {question && !speakText && (
        <div className="text-6xl font-bold text-slate-900 leading-none">{question}</div>
      )}

      <div className="w-full max-w-sm flex flex-col items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFeedback(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder={t('exercise.typePrompt')}
          className={`w-full text-center text-lg px-4 py-3 border-2 rounded-xl outline-none transition-colors ${
            feedback === 'correct'
              ? 'border-green-500 bg-green-50'
              : feedback === 'incorrect'
                ? 'border-red-400 bg-red-50'
                : 'border-slate-200 focus:border-red-500'
          }`}
          autoFocus
        />
        {preview && (
          <p className="text-sm text-slate-400 italic">→ {preview}</p>
        )}
      </div>

      {showTip && hint && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          💡 {hint}
        </p>
      )}

      {feedback && (
        <p
          className={`text-sm font-semibold ${
            feedback === 'correct' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {feedback === 'correct' ? t('exercise.correct') : t('exercise.incorrect')}
        </p>
      )}

      {feedback === 'correct' && revealText && (
        <div className="w-full max-w-sm rounded-2xl border-2 border-green-300 bg-green-50 px-4 py-3 text-center text-slate-800 text-base font-semibold">
          {revealText}
        </div>
      )}

      {feedback !== 'correct' && (
        <div className="flex gap-3 items-center">
          <Button onClick={check}>
            {feedback === 'incorrect' ? t('exercise.tryAgain') : t('exercise.check')}
          </Button>
          {!showTip && hint && (
            <Button variant="secondary" onClick={() => setShowTip(true)}>
              {t('exercise.showTip')}
            </Button>
          )}
        </div>
      )}

      {showContinue && (
        <Button onClick={() => onComplete?.({ correct: true })}>
          {t('exercise.continue')}
        </Button>
      )}
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';

const REGISTERS = {
  formal: {
    label: 'FORMAL · 丁寧語',
    badge: 'bg-indigo-600 text-white',
    card: 'border-indigo-200',
    bubble: 'bg-indigo-50',
  },
  casual: {
    label: 'CASUAL · ため口',
    badge: 'bg-teal-600 text-white',
    card: 'border-teal-200',
    bubble: 'bg-teal-50',
  },
  slang: {
    label: 'SLANG · くだけた',
    badge: 'bg-pink-600 text-white',
    card: 'border-pink-200',
    bubble: 'bg-pink-50',
  },
};

export default function DialogueScene({ title, register = 'formal', lines = [], onComplete }) {
  const { t } = useTranslation();
  const theme = REGISTERS[register] || REGISTERS.formal;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <span
        className={`text-[11px] font-bold tracking-wider px-3 py-1 rounded-full ${theme.badge}`}
      >
        {theme.label}
      </span>
      {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}

      <div className={`w-full max-w-xl rounded-2xl border-2 bg-white p-4 flex flex-col gap-4 ${theme.card}`}>
        {lines.map((line, i) => {
          const isA = i % 2 === 0;
          return (
            <div
              key={i}
              className={`flex gap-3 ${isA ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  {line.speaker?.slice(0, 2) || '?'}
                </div>
                <span className="text-[10px] text-slate-500">{line.speaker}</span>
              </div>
              <div className={`flex-1 rounded-2xl p-3 ${theme.bubble}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold text-slate-900 leading-relaxed">
                    {line.jp}
                  </p>
                  <SpeakButton text={line.jp} size="sm" />
                </div>
                <p className="text-xs text-slate-500 italic mt-1">{line.romaji}</p>
                <p className="text-xs text-slate-600 mt-1">{line.en}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={() => onComplete?.({ correct: true })}>
        {t('exercise.continue')}
      </Button>
    </div>
  );
}

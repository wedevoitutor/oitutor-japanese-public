import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';

function ReadingRow({ label, entries = [] }) {
  if (!entries.length) return null;
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="text-xs font-bold text-slate-500 shrink-0 w-8">{label}</span>
      <span className="text-slate-800">
        {entries.map((r, i) => (
          <span key={i}>
            <span className="font-semibold">{r.kana}</span>
            <span className="text-slate-400 text-xs ml-1">({r.romaji})</span>
            {i < entries.length - 1 && <span className="mx-1 text-slate-300">·</span>}
          </span>
        ))}
      </span>
    </div>
  );
}

function Compound({ c }) {
  return (
    <li className="flex items-center gap-2 text-sm py-1">
      <span className="font-bold text-slate-900 min-w-[3rem]">{c.word}</span>
      <span className="text-slate-500 text-xs italic">{c.reading}</span>
      <span className="text-slate-600 text-xs flex-1">— {c.meaning}</span>
      <SpeakButton text={c.word} size="sm" />
    </li>
  );
}

function Sentence({ s }) {
  return (
    <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-base font-semibold text-slate-900">{s.jp}</p>
        <SpeakButton text={s.jp} size="sm" />
      </div>
      {s.reading && <p className="text-xs text-slate-500 mt-1">{s.reading}</p>}
      <p className="text-xs text-slate-500 italic mt-1">{s.romaji}</p>
      {s.gloss && <p className="text-[10px] text-slate-400 italic mt-1">"{s.gloss}"</p>}
      <p className="text-xs text-slate-700 mt-1">{s.en}</p>
    </div>
  );
}

export default function KanjiCard({
  kanji,
  meaning,
  memoryHook,
  jlpt,
  readings = {},
  mnemonic,
  confusables = [],
  compounds = [],
  sentences = [],
  onComplete,
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full max-w-xl rounded-2xl border-2 border-amber-200 bg-white p-5 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="text-7xl font-bold text-slate-900 leading-none">{kanji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">{meaning}</h3>
              {jlpt && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                  {jlpt}
                </span>
              )}
            </div>
            {memoryHook && (
              <p className="text-sm text-amber-800 italic mt-1">💡 {memoryHook}</p>
            )}
          </div>
          <SpeakButton text={kanji} size="md" />
        </div>

        <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
          <ReadingRow label="On" entries={readings.on} />
          <ReadingRow label="Kun" entries={readings.kun} />
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-red-700 hover:underline self-start"
        >
          {expanded ? '▲ ' + t('exercise.hideDetails') : '▼ ' + t('exercise.showDetails')}
        </button>

        {expanded && (
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
            {mnemonic && (
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">{t('exercise.mnemonic')}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{mnemonic}</p>
              </div>
            )}

            {confusables.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">{t('exercise.confusables')}</p>
                <ul className="flex flex-col gap-1">
                  {confusables.map((c, i) => (
                    <li key={i} className="text-sm text-slate-700">
                      <span className="font-bold text-slate-900">{c.kanji}</span>
                      <span className="text-slate-500"> ({c.meaning})</span>
                      <span className="text-xs"> — {c.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {compounds.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">{t('exercise.compounds')}</p>
                <ul className="flex flex-col divide-y divide-slate-100">
                  {compounds.map((c, i) => <Compound key={i} c={c} />)}
                </ul>
              </div>
            )}

            {sentences.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-500">{t('exercise.sentences')}</p>
                {sentences.map((s, i) => <Sentence key={i} s={s} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <Button onClick={() => onComplete?.({ correct: true })}>{t('exercise.continue')}</Button>
    </div>
  );
}

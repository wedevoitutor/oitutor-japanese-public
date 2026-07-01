import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import SpeakButton from '../ui/SpeakButton';

const JP_CHAR = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;

function extractSpeakable(cell) {
  if (typeof cell !== 'string' || !JP_CHAR.test(cell)) return null;
  // Cells often mix English gloss → Japanese sentence, e.g. `"I like flowers" → はなが すきです`.
  // Always take the segment after the final arrow so we never read Latin/quotes to the TTS.
  const afterArrow = cell.includes('→') ? cell.split('→').pop() : cell;
  const bracketReading = afterArrow.match(/\[([^\]]*[\u3040-\u309f\u30a0-\u30ff][^\]]*)\]/);
  if (bracketReading?.[1]) return bracketReading[1].trim();
  // Strip trailing romaji parenthesis, e.g. "はな (hana)" → "はな".
  const beforeParen = afterArrow.split('(')[0].trim();
  // Strip surrounding straight/curly quotes.
  const stripped = beforeParen.replace(/^["'\u201C\u2018]+|["'\u201D\u2019]+$/g, '').trim();
  // If nothing Japanese remains after cleaning (e.g. explanatory prose about kana), don't speak.
  if (!stripped || !JP_CHAR.test(stripped)) return null;
  return stripped;
}

export default function ReferenceChart({
  title,
  intro,
  rows = [],
  takeaway,
  onComplete,
}) {
  const { t } = useTranslation();

  const [header, ...body] = rows;

  return (
    <div className="flex flex-col items-center gap-5">
      {title && (
        <h3 className="text-lg font-bold text-red-700 text-center">{title}</h3>
      )}
      {intro && (
        <p className="text-sm text-slate-700 text-center max-w-xl leading-relaxed">
          {intro}
        </p>
      )}

      <div className="w-full max-w-2xl overflow-x-auto rounded-xl border-2 border-red-200 shadow-sm">
        <table className="w-full text-center border-collapse text-sm">
          {header && (
            <thead>
              <tr className="bg-red-700 text-white">
                {header.map((cell, j) => (
                  <th key={j} className="px-3 py-2 font-semibold text-xs uppercase tracking-wide">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {body.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50/50'}>
                {row.map((cell, j) => {
                  const speak = extractSpeakable(cell);
                  return (
                    <td
                      key={j}
                      className="border-t border-red-100 px-3 py-2 text-slate-800"
                    >
                      <div className="inline-flex items-center gap-2 justify-center">
                        <span className={j === 0 ? 'font-semibold' : ''}>{cell}</span>
                        {speak && <SpeakButton text={speak} size="sm" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {takeaway && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 max-w-xl text-center">
          💡 {takeaway}
        </p>
      )}

      <Button onClick={() => onComplete?.({ correct: true })}>
        {t('exercise.continue')}
      </Button>
    </div>
  );
}

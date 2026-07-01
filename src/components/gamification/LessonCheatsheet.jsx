import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SpeakButton from '../ui/SpeakButton';

const JP_CHAR = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;

function extractSpeakable(cell) {
  if (typeof cell !== 'string' || !JP_CHAR.test(cell)) return null;
  const afterArrow = cell.includes('→') ? cell.split('→').pop() : cell;
  const bracketReading = afterArrow.match(/\[([^\]]*[\u3040-\u309f\u30a0-\u30ff][^\]]*)\]/);
  if (bracketReading?.[1]) return bracketReading[1].trim();
  const beforeParen = afterArrow.split('(')[0].trim();
  const stripped = beforeParen.replace(/^["'\u201C\u2018]+|["'\u201D\u2019]+$/g, '').trim();
  return stripped && JP_CHAR.test(stripped) ? stripped : null;
}

function ChartView({ chart }) {
  const [header, ...body] = chart.rows || [];
  return (
    <div className="flex flex-col items-center gap-4">
      {chart.title && (
        <h4 className="text-base font-bold text-red-700 text-center">{chart.title}</h4>
      )}
      <div className="w-full overflow-x-auto rounded-xl border border-red-200">
        <table className="w-full text-center border-collapse text-xs">
          {header && (
            <thead>
              <tr className="bg-red-700 text-white">
                {header.map((cell, j) => (
                  <th key={j} className="px-2 py-1.5 font-semibold uppercase tracking-wide">
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
                    <td key={j} className="border-t border-red-100 px-2 py-1.5 text-slate-800">
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
      {chart.takeaway && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 max-w-lg text-center">
          💡 {chart.takeaway}
        </p>
      )}
    </div>
  );
}

export default function LessonCheatsheet({ charts = [] }) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  if (!charts.length) return null;

  const safe = Math.min(idx, charts.length - 1);
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(charts.length - 1, i + 1));

  return (
    <div className="mt-10 rounded-2xl border-2 border-red-200 bg-white shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wider text-red-700 uppercase">
          📋 {t('exercise.cheatsheet')}
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          {safe + 1} / {charts.length}
        </p>
      </div>

      <ChartView chart={charts[safe]} />

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={prev}
          disabled={safe === 0}
          className="w-9 h-9 rounded-full bg-red-50 text-red-700 flex items-center justify-center disabled:opacity-30 hover:bg-red-100 transition-all"
          aria-label="Previous"
        >
          <FaChevronLeft />
        </button>
        <div className="flex gap-1.5">
          {charts.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === safe ? 'bg-red-700 w-6' : 'bg-slate-300'
              }`}
              aria-label={`Chart ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          disabled={safe === charts.length - 1}
          className="w-9 h-9 rounded-full bg-red-50 text-red-700 flex items-center justify-center disabled:opacity-30 hover:bg-red-100 transition-all"
          aria-label="Next"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

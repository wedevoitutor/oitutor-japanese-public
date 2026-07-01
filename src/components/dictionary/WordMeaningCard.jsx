import { useTranslation } from 'react-i18next';

function highlightText(text, highlight) {
  if (!text || !highlight) {
    return text;
  }

  const source = String(text);
  const target = String(highlight);
  const lowerSource = source.toLowerCase();
  const lowerTarget = target.toLowerCase();
  const parts = [];
  let start = 0;
  let index = lowerSource.indexOf(lowerTarget);

  if (index < 0) return text;

  while (index >= 0) {
    if (index > start) {
      parts.push(source.slice(start, index));
    }

    parts.push(
      <span key={`${target}-${index}`} className="font-bold text-blue-950">
        {source.slice(index, index + target.length)}
      </span>,
    );

    start = index + target.length;
    index = lowerSource.indexOf(lowerTarget, start);
  }

  if (start < source.length) {
    parts.push(source.slice(start));
  }

  return parts;
}

/**
 * Displays one learner-relevant meaning for a dictionary word.
 *
 * @param {object} props
 * @param {import('../../lib/dictionary').DictionaryMeaning} props.meaning
 */
export default function WordMeaningCard({ meaning }) {
  const { t } = useTranslation();
  const example = meaning.example;
  const gloss = meaning.gloss?.trim() || t('dictionary.meaningPlaceholder');
  const hasDescription = meaning.description
    && meaning.description.trim().toLowerCase() !== gloss.toLowerCase();
  const description = hasDescription ? meaning.description : t('dictionary.descriptionPlaceholder');

  return (
    <section className="grid min-h-full gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm md:p-5 md:text-left">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-stone-400">
          {t('dictionary.meaningLabel')}
        </p>
        <h3 className="text-2xl font-black text-blue-950 md:text-3xl">{gloss}</h3>
      </div>

      <p className="text-sm leading-6 text-stone-700 md:text-base">{description}</p>

      <div className="border-t border-stone-200 pt-4 text-center md:text-left">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-400">
          {t('dictionary.exampleLabel')}
        </p>
        {example ? (
          <>
          <p className="font-serif text-xl font-semibold leading-8 text-stone-950">
            {highlightText(example.japanese, example.highlight)}
          </p>
          {example.kana && <p className="mt-1 text-sm text-stone-500">{example.kana}</p>}
          {example.romaji && <p className="text-xs text-stone-400">{example.romaji}</p>}
          <p className="mt-2 text-sm text-stone-700">
            {highlightText(example.english, example.englishHighlight)}
          </p>
          </>
        ) : (
          <p className="text-sm leading-6 text-stone-500">{t('dictionary.examplePlaceholder')}</p>
        )}
      </div>
    </section>
  );
}

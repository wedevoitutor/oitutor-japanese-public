import { useTranslation } from 'react-i18next';
import { FaImage } from 'react-icons/fa';
import SpeakButton from '../ui/SpeakButton';
import WordMeaningCard from './WordMeaningCard';

const POS_DISPLAY = {
  pronoun: 'pronoun',
  'question word': 'question word',
  number: 'number',
  expression: 'expression',
  'adverbial expression': 'adverbial expression',
};

const TAG_DISPLAY = {
  verbs: 'verb',
  particles: 'particle',
  adjectives: 'adjective',
  pronouns: 'pronoun',
  questions: 'question',
  colors: 'color',
  colours: 'colour',
  objects: 'object',
};

const HIDDEN_TAGS = new Set(['reading-practice']);

function displayPartOfSpeech(partOfSpeech) {
  return POS_DISPLAY[partOfSpeech] || partOfSpeech;
}

function displayTag(tag) {
  return TAG_DISPLAY[tag] || tag;
}

function getVisibleTags(tags = []) {
  return [...new Set(
    tags
      .filter((tag) => tag && !HIDDEN_TAGS.has(tag))
      .filter((tag) => !/^(dialogue|grammar)-\d+$/i.test(tag))
      .filter((tag) => !tag.includes('/'))
      .map(displayTag),
  )];
}

function WordImage({ entry }) {
  const image = entry.image;

  if (image?.src) {
    return (
      <figure className="flex h-56 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 md:h-full md:min-h-64">
        <img
          src={image.src}
          alt={image.alt || entry.word}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </figure>
    );
  }

  if (image?.color) {
    return (
      <div
        className="flex h-56 items-center justify-center rounded-2xl border border-stone-200 shadow-inner md:h-full md:min-h-64"
        style={{ backgroundColor: image.color }}
        aria-label={image.alt || entry.word}
        role="img"
      >
        <FaImage className="text-3xl text-white/75 drop-shadow" aria-hidden />
      </div>
    );
  }

  return (
    <div
      className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.76),rgba(214,211,209,0.44)),repeating-linear-gradient(45deg,rgba(120,113,108,0.08)_0,rgba(120,113,108,0.08)_1px,transparent_1px,transparent_11px)] md:h-full md:min-h-64"
      aria-label={image?.alt || `${entry.word} image placeholder`}
      role="img"
    >
      <FaImage className="text-4xl text-stone-400" aria-hidden />
    </div>
  );
}

/**
 * Displays one grouped dictionary word and all visible ranked meanings.
 *
 * @param {object} props
 * @param {import('../../lib/dictionary').DictionaryEntry} props.entry
 */
export default function DictionaryMeaningGroup({ entry }) {
  const { t } = useTranslation();
  const hasMultipleMeanings = entry.meanings.length > 1;
  const visibleTags = getVisibleTags(entry.tags);
  const meaningCountKey = entry.hiddenMeaningCount > 0
    ? 'dictionary.multipleMeaningsCapped'
    : 'dictionary.multipleMeanings';

  return (
    <article className="overflow-hidden rounded-3xl border border-stone-200 bg-[#fbf7ec] p-4 shadow-sm md:p-5">
      <header className="mb-5 flex flex-col items-center justify-between gap-4 border-b border-stone-200 pb-4 text-center md:flex-row md:items-start md:text-left">
        <div className="min-w-0">
          <h2 className="font-serif text-4xl font-bold leading-tight text-stone-950 md:text-5xl">
            {entry.word}
          </h2>
          {entry.kana && <p className="mt-1 text-lg text-stone-500">{entry.kana}</p>}
          {entry.romaji && <p className="text-sm text-stone-400">{entry.romaji}</p>}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
          {entry.jlpt && (
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
              {entry.jlpt}
            </span>
          )}
          {entry.partOfSpeech && (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              {displayPartOfSpeech(entry.partOfSpeech)}
            </span>
          )}
          <SpeakButton text={entry.word} size="sm" />
        </div>

        {(hasMultipleMeanings || entry.hiddenMeaningCount > 0) && (
          <p className="basis-full text-sm text-stone-600">
            {t(meaningCountKey, { count: entry.meanings.length })}
          </p>
        )}
      </header>

      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <WordImage entry={entry} />
        <div className="grid gap-3">
          {entry.meanings.map((meaning) => (
            <WordMeaningCard key={meaning.id} meaning={meaning} />
          ))}
        </div>
      </div>

      {visibleTags.length > 0 && (
        <footer className="mt-4 flex flex-wrap justify-center gap-2 border-t border-stone-200 pt-4 md:justify-start">
          {visibleTags.map((tag) => (
            <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-600">
              {tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}

import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';

/**
 * Search field for the local learner dictionary.
 *
 * @param {object} props
 * @param {string} props.query
 * @param {(query: string) => void} props.onQueryChange
 * @param {number} props.resultCount
 */
export default function DictionarySearch({ query, onQueryChange, resultCount }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-stone-200 bg-white/85 p-3 shadow-sm">
      <label className="relative block">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500" aria-hidden>
          <FaSearch />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t('dictionary.searchPlaceholder')}
          className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-950 outline-none transition-colors placeholder:text-stone-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </label>
      <p className="mt-2 px-2 text-center text-xs font-medium uppercase tracking-wide text-stone-500 md:text-left">
        {t('dictionary.resultCount', { count: resultCount })}
      </p>
    </div>
  );
}

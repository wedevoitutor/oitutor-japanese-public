import { useTranslation } from 'react-i18next';
import DictionaryNotice from '../components/dictionary/DictionaryNotice';
import DictionarySearch from '../components/dictionary/DictionarySearch';
import WordCard from '../components/dictionary/WordCard';
import { useDictionary } from '../hooks/useDictionary';

export default function DictionaryPage() {
  const { t } = useTranslation();
  const {
    query,
    setQuery,
    entries,
    unlockedCount,
    loading,
    error,
    showLanguageNotice,
    dismissLanguageNotice,
  } = useDictionary();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f1e6]">
      <span className="pointer-events-none absolute -left-8 top-20 select-none font-serif text-[13rem] font-black text-violet-900/[0.04] rotate-12" aria-hidden>
        辞
      </span>
      <span className="pointer-events-none absolute -right-8 bottom-16 select-none font-serif text-[12rem] font-black text-violet-900/[0.04] -rotate-6" aria-hidden>
        語
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="mx-auto mb-8 max-w-3xl text-center md:mx-0 md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-700">
            {t('dictionary.eyebrow')}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-black leading-tight text-stone-950 md:text-6xl">
            {t('dictionary.title')}
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-700 md:text-lg">
            {t('dictionary.subtitle')}
          </p>
        </header>

        <div className="mb-8 grid gap-4">
          {showLanguageNotice && <DictionaryNotice onDismiss={dismissLanguageNotice} />}
          <DictionarySearch query={query} onQueryChange={setQuery} resultCount={entries.length} />
        </div>

        {loading && (
          <p className="rounded-3xl border border-stone-200 bg-white/80 p-8 text-center text-stone-600">
            {t('dictionary.loading')}
          </p>
        )}

        {error && (
          <p className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {t('dictionary.error')}
          </p>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white/80 p-8 text-center shadow-sm">
            <p className="font-serif text-3xl font-bold text-stone-950">
              {t(unlockedCount === 0 ? 'dictionary.empty.lockedTitle' : 'dictionary.empty.searchTitle')}
            </p>
            <p className="mt-2 text-stone-600">
              {t(unlockedCount === 0 ? 'dictionary.empty.locked' : 'dictionary.empty.search')}
            </p>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <section className="grid gap-5" aria-label={t('dictionary.resultsLabel')}>
            {entries.map((entry) => (
              <WordCard key={entry.id} entry={entry} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

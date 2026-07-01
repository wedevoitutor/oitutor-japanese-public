import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { loadDictionaryEntriesFromLiveLessons, searchDictionary } from '../lib/dictionary';

const NOTICE_STORAGE_KEY = 'oitutor.dictionary.englishJapaneseNoticeDismissed';

function hasDismissedLanguageNotice() {
  if (typeof localStorage === 'undefined') return true;
  return localStorage.getItem(NOTICE_STORAGE_KEY) === 'true';
}

/**
 * Manages local dictionary search and the first-visit English-Japanese notice.
 *
 * @returns {{
 *   query: string,
 *   setQuery: (query: string) => void,
 *   entries: import('../lib/dictionary').DictionaryEntry[],
 *   unlockedCount: number,
 *   loading: boolean,
 *   error: string | null,
 *   showLanguageNotice: boolean,
 *   dismissLanguageNotice: () => void
 * }}
 */
export function useDictionary() {
  const { progress } = useProgress();
  const [query, setQuery] = useState('');
  const [sourceEntries, setSourceEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLanguageNotice, setShowLanguageNotice] = useState(
    () => !hasDismissedLanguageNotice(),
  );
  const completedLessonIds = useMemo(
    () => Object.entries(progress.lessons ?? {})
      .filter(([, lesson]) => lesson?.completed === true)
      .map(([lessonId]) => lessonId),
    [progress.lessons],
  );

  useEffect(() => {
    let ignore = false;

    loadDictionaryEntriesFromLiveLessons({ completedLessonIds })
      .then((entries) => {
        if (!ignore) {
          setError(null);
          setSourceEntries(entries);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          setSourceEntries([]);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [completedLessonIds]);

  const entries = useMemo(() => searchDictionary(query, sourceEntries), [query, sourceEntries]);
  const unlockedCount = sourceEntries.length;

  const dismissLanguageNotice = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(NOTICE_STORAGE_KEY, 'true');
    }
    setShowLanguageNotice(false);
  };

  return {
    query,
    setQuery,
    entries,
    unlockedCount,
    loading,
    error,
    showLanguageNotice,
    dismissLanguageNotice,
  };
}

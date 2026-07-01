import { hiraganaDictionary } from '../data/hiraganaDictionary';
import { katakanaDictionary } from '../data/katakanaDictionary';
import sectionsData from '../content/sections.json';
import { AVAILABLE_CONTENT_FILES, loadLesson } from './contentLoader';
import { toHiragana } from 'wanakana';

/**
 * @typedef {Object} DictionaryExample
 * @property {string} japanese
 * @property {string} [kana]
 * @property {string} [romaji]
 * @property {string} english
 * @property {string} [highlight]
 * @property {string} [englishHighlight]
 */

/**
 * @typedef {Object} DictionaryMeaning
 * @property {string} id
 * @property {number} rank
 * @property {string} gloss
 * @property {string} description
 * @property {DictionaryExample} [example]
 */

/**
 * @typedef {Object} DictionaryEntry
 * @property {string} id
 * @property {string} word
 * @property {string} [kana]
 * @property {string} [romaji]
 * @property {string} [jlpt]
 * @property {string} [partOfSpeech]
 * @property {{ src?: string, alt?: string, credit?: string, color?: string, wikipediaTitle?: string }} [image]
 * @property {DictionaryMeaning[]} meanings
 * @property {string[]} [tags]
 * @property {'manual'|'lesson'} [source]
 * @property {string[]} [lessonFiles]
 * @property {number} [hiddenMeaningCount]
 */

const MAX_MEANINGS = 3;
const KANA_ONLY_LEARNING_MODES = new Set([
  'kana-practice',
  'hiragana-practice',
  'katakana-practice',
  'alphabet-practice',
  'sound-practice',
  'syllable-practice',
]);
const VALID_ONE_KANA_WORDS = new Set(['の', 'は', 'へ', 'を', 'が', 'に', 'で', 'と', 'も', 'や', 'ね', 'よ', 'か']);
const ROMAJI_ALPHABET_DRILL = /^[aeiou]$|^(ka|ki|ku|ke|ko|sa|shi|su|se|so|ta|chi|tsu|te|to|na|ni|nu|ne|no|ha|hi|fu|he|ho|ma|mi|mu|me|mo|ya|yu|yo|ra|ri|ru|re|ro|wa|wo|n)$/i;

const normalize = (value = '') => String(value).toLowerCase().trim();
const categoryOf = (lessonFile) => lessonFile?.split('/')[0] ?? 'misc';
const idFor = (ns, word) => `${ns}:${word}`;
const PARTICLES = new Set(['の', 'は', 'へ', 'を', 'が', 'に', 'で', 'と', 'も', 'や', 'ね', 'よ', 'か']);

function isSingleKana(value = '') {
  return /^[ぁ-んァ-ンー]$/.test(String(value).trim());
}

function isRomajiAlphabetDrill(value = '') {
  return ROMAJI_ALPHABET_DRILL.test(String(value).trim());
}

function getCandidateWord(candidate) {
  return String(candidate.word || candidate.japanese || candidate.term || candidate.left || '').trim();
}

function getCandidateMeaning(candidate) {
  return candidate.meaning || candidate.gloss || candidate.english || candidate.definition || candidate.right || '';
}

function getCandidateDescription(candidate) {
  return candidate.description || candidate.note || candidate.context || getCandidateMeaning(candidate);
}

function cleanMeaningCandidate(value = '') {
  return String(value)
    .replace(/^to\s+/i, '')
    .replace(/_+/g, '')
    .replace(/[()[\].,;:!?]/g, '')
    .trim();
}

function findCaseInsensitiveNeedle(text = '', needle = '') {
  const haystack = String(text);
  const target = cleanMeaningCandidate(needle);

  if (!haystack || !target) return '';

  const index = haystack.toLowerCase().indexOf(target.toLowerCase());
  return index >= 0 ? haystack.slice(index, index + target.length) : '';
}

function inferEnglishHighlight(example = {}, gloss = '') {
  if (example.englishHighlight) return example.englishHighlight;

  return String(gloss)
    .split('/')
    .map(cleanMeaningCandidate)
    .map((candidate) => findCaseInsensitiveNeedle(example.english, candidate))
    .find(Boolean);
}

function normalizeExample(example, gloss) {
  if (!example) return undefined;

  const englishHighlight = inferEnglishHighlight(example, gloss);

  return {
    ...example,
    ...(englishHighlight ? { englishHighlight } : {}),
  };
}

function resolveJapaneseHighlight(example = {}, entry = {}) {
  if (example.highlight) return example.highlight;

  const candidates = [
    entry.word,
    entry.kana,
    entry.romaji ? toHiragana(entry.romaji) : '',
  ].filter(Boolean);

  return candidates.find((candidate) => String(example.japanese || '').includes(candidate));
}

function normalizeExampleForEntry(example, gloss, entry) {
  if (!example) return undefined;

  return normalizeExample(
    {
      ...example,
      highlight: resolveJapaneseHighlight(example, entry),
    },
    gloss,
  );
}

function isVocabularyExercise(exercise = {}) {
  return exercise.mode === 'vocabulary' || exercise.dictionaryEligible === true;
}

function inferPartOfSpeech(candidate = {}) {
  if (candidate.partOfSpeech) return candidate.partOfSpeech;

  const word = getCandidateWord(candidate);
  const meaning = normalize(getCandidateMeaning(candidate));

  if (PARTICLES.has(word)) return 'particle';
  if (meaning.startsWith('to ')) return 'verb';
  if (word.endsWith('い') && !meaning.startsWith('to ')) return 'i-adjective';
  if (meaning.includes('adverb')) return 'adverb';

  return 'noun';
}

function getLessonMetas() {
  return sectionsData.sections.flatMap((section) =>
    section.lessons
      .filter((lesson) => !lesson.comingSoon && lesson.contentFile && AVAILABLE_CONTENT_FILES.has(lesson.contentFile))
      .map((lesson) => ({
        section,
        lesson,
        lessonFile: lesson.contentFile,
      })),
  );
}

function getStaticEntriesForLessonFiles(lessonFiles) {
  const fileSet = new Set(lessonFiles);
  return [...hiraganaDictionary, ...katakanaDictionary].filter((entry) =>
    entry.lessonFiles?.some((lessonFile) => fileSet.has(lessonFile)),
  );
}

function findExampleForWord(exercise = {}, word) {
  const sentence = (exercise.sentences || []).find((item) =>
    item.highlight === word || item.jp?.includes(word) || item.japanese?.includes(word),
  );

  if (!sentence) return undefined;

  return {
    japanese: sentence.japanese || sentence.jp,
    kana: sentence.kana || sentence.reading,
    romaji: sentence.romaji,
    english: sentence.english || sentence.en,
    highlight: sentence.highlight || word,
  };
}

function isVocabularyReferenceChart(exercise = {}) {
  if (exercise.type !== 'reference-chart') return false;
  if (!String(exercise.title || '').toLowerCase().includes('vocabulary')) return false;

  return (exercise.rows || []).some((row) =>
    Array.isArray(row)
    && normalize(row[0]) === 'nihongo'
    && normalize(row[1]) === 'english',
  );
}

function cleanJapaneseCell(value = '') {
  return String(value).replace(/\s*\([^)]*\)\s*/g, '').trim();
}

function parseVocabularyReferenceCell(value = '') {
  const source = String(value).trim();
  const bracketMatch = source.match(/^(.+?)\s*[［[](.+?)[］\]]\s*(?:\((.+?)\))?$/);
  const romajiMatch = source.match(/^(.+?)\s*\((.+?)\)$/);

  if (bracketMatch) {
    return {
      word: bracketMatch[1].trim(),
      kana: bracketMatch[2].trim(),
      romaji: bracketMatch[3]?.trim(),
    };
  }

  if (romajiMatch) {
    const word = romajiMatch[1].trim();

    return {
      word,
      kana: word,
      romaji: romajiMatch[2].trim(),
    };
  }

  return {
    word: source,
    kana: source,
  };
}

function isMultiTokenJapaneseRow(value = '') {
  return /\s/.test(cleanJapaneseCell(value));
}

function toReferenceExample(row) {
  return {
    japanese: cleanJapaneseCell(row[0]),
    english: String(row[1] || '').trim(),
  };
}

function attachReferenceExamples(candidates, examples) {
  return candidates.map((candidate) => {
    if (candidate.example || !examples.length) return candidate;

    const example = examples.find((item) =>
      item.japanese.includes(candidate.word)
      || (candidate.kana && item.japanese.includes(candidate.kana))
      || findCaseInsensitiveNeedle(item.english, candidate.meaning),
    );

    return example ? { ...candidate, example } : candidate;
  });
}

function extractVocabularyReferenceChart(exercise, lesson) {
  const candidates = [];
  const examples = [];
  let hasSeenHeader = false;

  for (const row of exercise.rows || []) {
    if (!Array.isArray(row) || row.length < 2) continue;

    if (normalize(row[0]) === 'nihongo' && normalize(row[1]) === 'english') {
      hasSeenHeader = true;
      continue;
    }

    if (!hasSeenHeader) continue;

    if (isMultiTokenJapaneseRow(row[0])) {
      examples.push(toReferenceExample(row));
      continue;
    }

    candidates.push({
      ...parseVocabularyReferenceCell(row[0]),
      meaning: row[1],
      dictionaryEligible: true,
      lessonId: lesson.id,
      tags: lesson.id ? [lesson.id] : undefined,
    });
  }

  return attachReferenceExamples(candidates, examples);
}

/**
 * Returns true only when content clearly intends to teach a dictionary word.
 *
 * @param {Record<string, any>} candidate
 * @param {Record<string, any>} [exercise]
 * @returns {boolean}
 */
export function isDictionaryEligibleWord(candidate, exercise = {}) {
  const word = getCandidateWord(candidate);
  const meaning = String(getCandidateMeaning(candidate)).trim();

  if (!word) return false;
  if (candidate.dictionaryEligible === false || exercise.dictionaryEligible === false) return false;
  if (KANA_ONLY_LEARNING_MODES.has(exercise.mode)) return false;
  if (candidate.dictionaryEligible === true) return Boolean(meaning);

  if (!isVocabularyExercise(exercise)) return false;
  if (isSingleKana(word)) return VALID_ONE_KANA_WORDS.has(word) && Boolean(meaning) && !isRomajiAlphabetDrill(meaning);
  if (isRomajiAlphabetDrill(word)) return false;

  return Boolean(meaning);
}

/**
 * @param {Record<string, any>} candidate
 * @param {string} lessonFile
 * @returns {DictionaryEntry}
 */
function normalizeDictionaryWord(candidate, lessonFile) {
  const word = getCandidateWord(candidate);
  const meaning = String(getCandidateMeaning(candidate)).trim();
  const kana = candidate.kana || candidate.reading || candidate.speakText || word;
  const rank = Number(candidate.rank) || 1;

  const image = candidate.image || (candidate.wikipediaTitle
    ? {
        alt: `${word} vocabulary image`,
        wikipediaTitle: candidate.wikipediaTitle,
      }
    : undefined);

  return {
    id: candidate.id || idFor('lesson', word),
    word,
    kana,
    romaji: candidate.romaji,
    jlpt: candidate.jlpt,
    partOfSpeech: inferPartOfSpeech(candidate),
    image,
    meanings: [
      {
        id: candidate.meaningId || `${idFor('lesson', word)}:meaning-1`,
        rank,
        gloss: meaning,
        description: getCandidateDescription(candidate),
        example: normalizeExample(candidate.example, meaning),
      },
    ],
    tags: candidate.tags || [categoryOf(lessonFile), candidate.lessonId].filter(Boolean),
    source: 'lesson',
    lessonFiles: [lessonFile],
  };
}

function normalizePair(pair) {
  if (Array.isArray(pair)) {
    return { word: pair[0], meaning: pair[1] };
  }

  return {
    word: pair.word || pair.japanese || pair.left,
    kana: pair.kana || pair.reading,
    romaji: pair.romaji,
    meaning: pair.meaning || pair.english || pair.right,
    dictionaryEligible: pair.dictionaryEligible,
    tags: pair.tags,
  };
}

function normalizeKanjiCompound(compound, exercise, lessonFile, index) {
  const word = compound.word;

  return {
    ...compound,
    kana: compound.kana || compound.reading,
    rank: compound.rank || index + 1,
    partOfSpeech: compound.partOfSpeech || 'noun',
    dictionaryEligible: compound.dictionaryEligible ?? true,
    tags: compound.tags || ['kanji', categoryOf(lessonFile), exercise.kanji].filter(Boolean),
    example: compound.example || findExampleForWord(exercise, word),
  };
}

/**
 * Extract explicitly marked learner vocabulary from a lesson.
 *
 * @param {{ exercises?: Record<string, any>[] }} lesson
 * @param {string} lessonFile
 * @returns {DictionaryEntry[]}
 */
export function extractWordsFromLesson(lesson, lessonFile) {
  const out = [];

  for (const item of lesson?.dictionaryVocabulary ?? []) {
    const candidate = {
      ...item,
      dictionaryEligible: item.dictionaryEligible ?? true,
      lessonId: lesson.id,
    };

    if (isDictionaryEligibleWord(candidate, { mode: 'vocabulary' })) {
      out.push(normalizeDictionaryWord(candidate, lessonFile));
    }
  }

  for (const exercise of lesson?.exercises ?? []) {
    if (Array.isArray(exercise.vocabulary)) {
      for (const item of exercise.vocabulary) {
        if (isDictionaryEligibleWord(item, exercise)) {
          out.push(normalizeDictionaryWord(item, lessonFile));
        }
      }
    }

    if (exercise.type === 'flashcard' && isVocabularyExercise(exercise)) {
      for (const card of exercise.cards || []) {
        const candidate = {
          word: card.word || card.japanese || card.front,
          kana: card.kana || card.reading || card.speakText,
          romaji: card.romaji,
          meaning: card.meaning || card.english || card.back,
          dictionaryEligible: card.dictionaryEligible,
          tags: card.tags,
        };

        if (isDictionaryEligibleWord(candidate, exercise)) {
          out.push(normalizeDictionaryWord(candidate, lessonFile));
        }
      }
    }

    if (exercise.type === 'matching' && isVocabularyExercise(exercise)) {
      for (const pair of exercise.pairs || []) {
        const candidate = normalizePair(pair);

        if (isDictionaryEligibleWord(candidate, exercise)) {
          out.push(normalizeDictionaryWord(candidate, lessonFile));
        }
      }
    }

    if (exercise.type === 'kanji-card' && Array.isArray(exercise.compounds)) {
      exercise.compounds.forEach((compound, index) => {
        const candidate = normalizeKanjiCompound(compound, exercise, lessonFile, index);

        if (isDictionaryEligibleWord(candidate, { ...exercise, mode: 'vocabulary' })) {
          out.push(normalizeDictionaryWord(candidate, lessonFile));
        }
      });
    }

    if (isVocabularyReferenceChart(exercise)) {
      for (const candidate of extractVocabularyReferenceChart(exercise, lesson)) {
        if (isDictionaryEligibleWord(candidate, { ...exercise, mode: 'vocabulary' })) {
          out.push(normalizeDictionaryWord(candidate, lessonFile));
        }
      }
    }
  }

  return dedupeWords(out);
}

/**
 * Merge duplicate lesson-derived entries by word.
 *
 * @param {DictionaryEntry[]} entries
 * @returns {DictionaryEntry[]}
 */
export function dedupeWords(entries) {
  const map = new Map();

  for (const entry of entries) {
    const key = normalize(entry.word);
    const previous = map.get(key);

    if (!previous) {
      map.set(key, normalizeEntry(entry));
      continue;
    }

    const lessonFiles = new Set([...(previous.lessonFiles || []), ...(entry.lessonFiles || [])]);
    const meanings = mergeMeanings(previous.meanings, entry.meanings);

    map.set(key, {
      ...previous,
      ...Object.fromEntries(Object.entries(entry).filter(([, value]) => value != null && value !== '')),
      meanings: limitMeanings(meanings),
      hiddenMeaningCount: Math.max(0, meanings.length - MAX_MEANINGS),
      tags: [...new Set([...(previous.tags || []), ...(entry.tags || [])])],
      lessonFiles: [...lessonFiles],
    });
  }

  return [...map.values()];
}

function normalizeEntry(entry) {
  const meanings = mergeMeanings([], entry.meanings || []).map((meaning) => ({
    ...meaning,
    example: normalizeExampleForEntry(meaning.example, meaning.gloss, entry),
  }));

  return {
    ...entry,
    partOfSpeech: inferPartOfSpeech(entry),
    meanings: limitMeanings(meanings),
    hiddenMeaningCount: Math.max(0, meanings.length - MAX_MEANINGS),
  };
}

function mergeMeanings(baseMeanings = [], incomingMeanings = []) {
  const map = new Map();

  for (const meaning of [...baseMeanings, ...incomingMeanings]) {
    const key = normalize(`${meaning.gloss}:${meaning.description}`);
    if (!key || map.has(key)) continue;
    map.set(key, meaning);
  }

  return [...map.values()];
}

function limitMeanings(meanings = []) {
  return [...meanings]
    .sort((a, b) => (Number(a.rank) || 0) - (Number(b.rank) || 0))
    .slice(0, MAX_MEANINGS);
}

/**
 * Normalize explicitly provided dictionary entries. Runtime callers must pass
 * live lesson-derived entries; importedDictionary remains only a named dev seed.
 *
 * @returns {DictionaryEntry[]}
 */
export function getDictionaryEntries(entries) {
  if (!Array.isArray(entries)) {
    throw new TypeError('getDictionaryEntries requires an explicit entries array.');
  }

  return dedupeWords(entries).map((entry) => normalizeEntry({
    ...entry,
    source: entry.source || 'manual',
  }));
}

/**
 * Load dictionary cards from live lesson content under src/content only.
 *
 * @param {{ completedLessonIds?: Set<string>|string[] }} [options]
 * @returns {Promise<DictionaryEntry[]>}
 */
export async function loadDictionaryEntriesFromLiveLessons(options = {}) {
  const completedLessonIds = options.completedLessonIds
    ? new Set(options.completedLessonIds)
    : null;
  if (completedLessonIds && completedLessonIds.size === 0) return [];

  const lessonMetas = getLessonMetas().filter(({ lesson }) =>
    !completedLessonIds || completedLessonIds.has(lesson.id),
  );
  const loaded = await Promise.all(
    lessonMetas.map(async ({ lesson, lessonFile }) => {
      const lessonData = await loadLesson(lessonFile);
      const entries = extractWordsFromLesson(lessonData, lessonFile);

      return entries.map((entry) => ({
        ...entry,
        tags: [...new Set([...(entry.tags || []), lesson.id])],
      }));
    }),
  );
  const staticEntries = getStaticEntriesForLessonFiles(lessonMetas.map(({ lessonFile }) => lessonFile));

  return getDictionaryEntries([...loaded.flat(), ...staticEntries]);
}

/**
 * @param {string} query
 * @param {DictionaryEntry[]} entries
 * @returns {DictionaryEntry[]}
 */
export function searchDictionary(query, entries) {
  if (!Array.isArray(entries)) {
    throw new TypeError('searchDictionary requires an explicit entries array.');
  }

  const normalizedQuery = normalize(query);
  const dictionaryEntries = entries;

  if (!normalizedQuery) return dictionaryEntries;

  return dictionaryEntries.filter((entry) => {
    const searchable = [
      entry.word,
      entry.kana,
      entry.romaji,
      entry.jlpt,
      entry.partOfSpeech,
      ...(entry.tags || []),
      ...entry.meanings.flatMap((meaning) => [
        meaning.gloss,
        meaning.description,
        meaning.example?.japanese,
        meaning.example?.kana,
        meaning.example?.romaji,
        meaning.example?.english,
      ]),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

/**
 * Per-section visual themes for the lesson page.
 *
 * Each theme is a *lighter* echo of the button color used on the matching
 * LessonCard (see TYPE_BTN in src/components/course/LessonCard.jsx). The
 * lesson page wraps its content in `bg` and drops two kanji watermarks that
 * tie the theme to the category.
 *
 * To add a theme: add one entry to SECTION_THEMES.
 * To roll a theme out to every lesson in its section: leave it enabled in
 *   `getSectionTheme` (already the case), and — once approved — remove the
 *   `PREVIEW_LESSONS` guard in `isThemeEnabled`.
 *
 * @typedef {Object} SectionTheme
 * @property {string}   bg              Tailwind classes for the full-page background
 * @property {string[]} kanji           Two characters, corner-opposed, used as watermarks
 * @property {string}   watermarkColor  Tailwind text-color for the watermarks (low-opacity)
 * @property {string}   accentLine      Tailwind classes for a thin gradient divider
 */

/** @type {Record<string, SectionTheme>} */
const SECTION_THEMES = {
  // Alphabet — hiragana + katakana share the same "study" red-700 accent.
  alphabet: {
    bg: 'bg-gradient-to-b from-rose-50 via-red-50/60 to-amber-50/30',
    kanji: ['字', '仮'],
    watermarkColor: 'text-rose-900/[.04]',
    accentLine: 'bg-gradient-to-r from-transparent via-red-500 to-transparent',
  },
  // Kanji — amber-600 accent.
  kanji: {
    bg: 'bg-gradient-to-b from-amber-50 via-orange-50/50 to-yellow-50/30',
    kanji: ['漢', '字'],
    watermarkColor: 'text-amber-900/[.05]',
    accentLine: 'bg-gradient-to-r from-transparent via-amber-500 to-transparent',
  },
  // Grammar — red-800 accent.
  grammar: {
    bg: 'bg-gradient-to-b from-red-50 via-rose-50/60 to-pink-50/30',
    kanji: ['文', '法'],
    watermarkColor: 'text-red-900/[.04]',
    accentLine: 'bg-gradient-to-r from-transparent via-red-600 to-transparent',
  },
  // Dialogue lessons — pink-600 accent.
  dialogue: {
    bg: 'bg-gradient-to-b from-pink-50 via-rose-50/50 to-fuchsia-50/30',
    kanji: ['会', '話'],
    watermarkColor: 'text-pink-900/[.04]',
    accentLine: 'bg-gradient-to-r from-transparent via-pink-500 to-transparent',
  },
};

/** Map a section slug to a theme key. */
function themeKeyFor(sectionSlug) {
  if (!sectionSlug) return null;
  if (sectionSlug === 'hiragana' || sectionSlug === 'katakana') return 'alphabet';
  if (sectionSlug === 'kanji') return 'kanji';
  if (sectionSlug === 'grammar') return 'grammar';
  if (sectionSlug.startsWith('dialogues')) return 'dialogue';
  return null;
}

/** @returns {SectionTheme | null} */
export function getSectionTheme(sectionSlug) {
  const key = themeKeyFor(sectionSlug);
  return key ? SECTION_THEMES[key] : null;
}

// ─── Rollout gates ───────────────────────────────────────────────────────────
// Sections live on every one of their lessons (theme + banner).
// Add a slug here to enable both visuals for an entire section in one edit.
const ENABLED_SECTIONS = new Set(['hiragana', 'katakana', 'kanji', 'grammar', 'dialogues']);

// Per-lesson escape hatch for sections still under visual review. Previews get
// the themed background only — not the banner, because the banner ships per
// section, not per lesson.
const PREVIEW_LESSONS = new Set();

/** True when the lesson page should render with the themed wrapper. */
export function isThemeEnabled(sectionSlug, lessonSlug) {
  return ENABLED_SECTIONS.has(sectionSlug) || PREVIEW_LESSONS.has(`${sectionSlug}/${lessonSlug}`);
}

/** True when the lesson page should render the edge-to-edge path-card banner. */
export function isBannerEnabled(sectionSlug) {
  return ENABLED_SECTIONS.has(sectionSlug);
}

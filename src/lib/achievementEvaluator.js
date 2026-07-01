import sectionsData from '../content/sections.json';
import { AVAILABLE_CONTENT_FILES } from './contentLoader';

const hasContent = (l) =>
  !l.comingSoon && !!l.contentFile && AVAILABLE_CONTENT_FILES.has(l.contentFile);

function getLessonIdsBySection(sectionId) {
  const section = sectionsData.sections.find((s) => s.id === sectionId);
  return section ? section.lessons.filter(hasContent).map((l) => l.id) : [];
}

function countCompletedByPrefix(lessons, prefix) {
  return Object.keys(lessons).filter((id) => id.startsWith(prefix) && lessons[id]?.completed).length;
}

function allCompleted(lessons, ids) {
  return ids.length > 0 && ids.every((id) => lessons[id]?.completed);
}

/**
 * Evaluate which achievements should be unlocked based on current progress.
 * Returns an array of achievement IDs that are newly earned (not yet unlocked).
 */
export function evaluateAchievements(progress, isPerfect = false) {
  const { lessons, streak, xp, achievements } = progress;
  const completedCount = Object.values(lessons).filter((l) => l.completed).length;

  const checks = {
    'first-steps':     completedCount >= 1,
    'hiragana-hero':   allCompleted(lessons, getLessonIdsBySection('hiragana')),
    'katakana-knight': allCompleted(lessons, getLessonIdsBySection('katakana')),
    'streak-3':        (streak?.count ?? 0) >= 3,
    'streak-7':        (streak?.count ?? 0) >= 7,
    'streak-30':       (streak?.count ?? 0) >= 30,
    'xp-500':          xp >= 500,
    'xp-2000':         xp >= 2000,
    'grammar-sensei':  countCompletedByPrefix(lessons, 'grammar-') >= 10,
    'dialogue-master': countCompletedByPrefix(lessons, 'dialogue-') >= 10,
    'perfect-score':   isPerfect,
    'kanji-starter':   countCompletedByPrefix(lessons, 'kanji-') >= 1,
  };

  return Object.entries(checks)
    .filter(([id, met]) => met && !achievements[id])
    .map(([id]) => id);
}

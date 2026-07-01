import sectionsData from '../content/sections.json';
import { AVAILABLE_CONTENT_FILES } from './contentLoader';
import { getCurrentLevel } from './levels';

const hasContent = (lesson) =>
  !lesson.comingSoon && !!lesson.contentFile && AVAILABLE_CONTENT_FILES.has(lesson.contentFile);

function getLessonIdsBySection(sectionId) {
  const section = sectionsData.sections.find((s) => s.id === sectionId);
  return section ? section.lessons.filter(hasContent).map((lesson) => lesson.id) : [];
}

function getManifestLessonIdsBySection(sectionId) {
  const section = sectionsData.sections.find((s) => s.id === sectionId);
  return section ? section.lessons.map((lesson) => lesson.id) : [];
}

function getAvailableLessonIds() {
  return sectionsData.sections.flatMap((section) =>
    section.lessons.filter(hasContent).map((lesson) => lesson.id),
  );
}

function getCompletedLessonIds(lessons) {
  return Object.keys(lessons).filter((id) => lessons[id]?.completed);
}

function allCompleted(lessons, ids) {
  return ids.length > 0 && ids.every((id) => lessons[id]?.completed);
}

function countCompletedOnDate(lessons, date) {
  return Object.values(lessons).filter((lesson) =>
    lesson.completed && lesson.completedAt?.slice(0, 10) === date,
  ).length;
}

function countCompletedByType(lessons, type) {
  const lessonTypes = new Map(
    sectionsData.sections.flatMap((section) =>
      section.lessons.filter(hasContent).map((lesson) => [lesson.id, lesson.type]),
    ),
  );
  return getCompletedLessonIds(lessons).filter((id) => lessonTypes.get(id) === type).length;
}

/**
 * Evaluate which badges should be unlocked based on current progress.
 * Returns badge IDs that are newly earned.
 */
export function evaluateBadges(progress, { isAuthenticated = false, completedAt = new Date() } = {}) {
  const { lessons, streak, xp, badges } = progress;
  const today = completedAt.toISOString().slice(0, 10);
  const completedCount = getCompletedLessonIds(lessons).length;
  const hiraganaIds = getLessonIdsBySection('hiragana');
  const katakanaIds = getLessonIdsBySection('katakana');
  const kanjiIds = getManifestLessonIdsBySection('kanji');
  const grammarIds = getManifestLessonIdsBySection('grammar');
  const dialogueIds = getManifestLessonIdsBySection('dialogues');
  const availableLessonIds = getAvailableLessonIds();

  const checks = {
    'first-login': isAuthenticated,
    'first-lesson': completedCount >= 1,
    explorer: false,
    'quick-learner': countCompletedOnDate(lessons, today) >= 3,
    'kana-master': allCompleted(lessons, hiraganaIds) && allCompleted(lessons, katakanaIds),
    'vocab-builder': false,
    'streak-warrior': (streak?.count ?? 0) >= 14,
    'practice-pro': countCompletedByType(lessons, 'practice') >= 20,
    'night-owl': completedAt.getHours() === 0,
    'kanji-conqueror': allCompleted(lessons, kanjiIds),
    'grammar-guru': allCompleted(lessons, grammarIds),
    'fluency-path': allCompleted(lessons, dialogueIds),
    completionist: allCompleted(lessons, availableLessonIds),
    sensei: getCurrentLevel(xp) >= 50,
    legend: xp >= 10000,
  };

  return Object.entries(checks)
    .filter(([id, met]) => met && !badges[id])
    .map(([id]) => id);
}

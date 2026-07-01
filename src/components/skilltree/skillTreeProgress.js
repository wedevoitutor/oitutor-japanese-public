import { alphabetsPathConfig } from './alphabetsPathConfig';
import { SCROLL_PATH_CONFIGS } from './scrollPathConfigs';

export function getVisiblePathLessons(path) {
  if (!path) return [];
  if (path.id === 'alphabets') return alphabetsPathConfig.lessons;
  return SCROLL_PATH_CONFIGS[path.id]?.lessons ?? path.skills ?? [];
}

export function getPathProgressSummary(path, lessonProgress = {}) {
  const lessons = getVisiblePathLessons(path);
  const done = lessons.filter((lesson) => lesson.lessonId && lessonProgress[lesson.lessonId]?.completed).length;
  const total = lessons.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return { done, total, pct };
}

export function isVisiblePathComplete(path, lessonProgress = {}) {
  const lessons = getVisiblePathLessons(path).filter((lesson) => lesson.lessonId);
  return lessons.length > 0 && lessons.every((lesson) => lessonProgress[lesson.lessonId]?.completed);
}
